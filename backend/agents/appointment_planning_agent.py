import os
import json
import re
from typing import List, Tuple
from backend.utils.logging import get_logger
from backend.utils.retry import retry

try:
    import google.generativeai as genai
except Exception:
    genai = None

from ics import Calendar
from datetime import datetime, timedelta, time as dtime
import pytz

def clean_json(text: str) -> str:
    # Remove ```json ... ``` or ``` ... ``` blocks
    return re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", text).strip()


class AppointmentPlannerAgent:
    def __init__(self, api_key: str, model_name="gemini-flash-latest"):
        self.model = None
        self.logger = get_logger(__name__)
        if api_key and genai is not None:
            try:
                genai.configure(api_key=api_key, transport="rest")
                self.model = genai.GenerativeModel(model_name)
            except Exception:
                self.logger.warning("Failed to initialize Gemini; using fallback")
                self.model = None

    def plan_slot(self, skeleton_calendar, time_length, user_timezone, lunch_time: list):
        # Open and read the ICS file (robust path resolution)
        BASE_DIR = os.path.dirname(__file__)
        PROJECT_DIR = os.path.dirname(BASE_DIR)  # backend directory

        # Accept absolute paths, existing relative paths, or just a filename.
        # Try several candidates to avoid duplicating path segments.
        candidates = []
        if isinstance(skeleton_calendar, str) and skeleton_calendar.strip():
            sc = os.path.normpath(skeleton_calendar)
            # 1) Absolute or exists as provided (relative to CWD)
            if os.path.isabs(sc) or os.path.exists(sc):
                candidates.append(sc)
            # 2) Relative to the backend project dir
            candidates.append(os.path.join(PROJECT_DIR, sc))
            # 3) Under backend/resources with provided value
            candidates.append(os.path.join(PROJECT_DIR, "resources", sc))
            # 4) Under backend/resources using only the basename
            candidates.append(os.path.join(PROJECT_DIR, "resources", os.path.basename(sc)))

        # Fallback default path
        candidates.append(os.path.join(PROJECT_DIR, "resources", "AppointmentSkeletonCalendar.ics"))

        ics_path = next((p for p in candidates if os.path.exists(p)), None)
        if not ics_path:
            raise FileNotFoundError(
                f"Could not locate ICS file. Tried: {candidates}"
            )

        with open(ics_path, 'r', encoding='utf-8') as file:
            calendar_data = file.read()

        # Parse it into a Calendar object
        calendar = Calendar(calendar_data)

        events = calendar.events
        calendar_text = ""
        for event in events:
            # event.begin and event.end are Arrow objects, so convert to datetime
            start = event.begin.datetime.astimezone(pytz.timezone(user_timezone))
            end = event.end.datetime.astimezone(pytz.timezone(user_timezone))
            calendar_text += f"Event: {event.name}, Start: {start}, End: {end}\n"


        # Debug text prepared; not printed to avoid noise during API calls
        # Send safe prompt to LLM
        prompt = f"""
        You are a scheduling assistant. Convert the following into a calendar event:
        Use ONLY the skeleton schedule (no real info) to find the best time slot.
        Calendar object: {calendar_text}
        The event trying to be scheduled takes {time_length} hours.
        Do not schedule an event before 8 AM or after 5 PM. 
        Do not schedule an event during lunch, which is from {lunch_time[0]} to {lunch_time[1]}.
        Leave at least 15 minutes between events.
        Find the earliest available time that does not break any of the previous rules. 
        
        Respond in JSON with 'date', 'start_time', 'end_time'.
        Respond with ONLY valid JSON. No explanation or text outside the JSON.
        """

        if self.model is not None:
            try:
                response = retry(lambda: self.model.generate_content(prompt))
                response_text = clean_json(response.text)
                try:
                    return json.loads(response_text)
                except json.JSONDecodeError:
                    self.logger.warning("Gemini returned non-JSON; using fallback")
            except Exception as e:
                self.logger.error(f"Gemini error: {e}; using fallback")

        # Fallback deterministic scheduler
        tz = pytz.timezone(user_timezone)
        events_local: List[Tuple[datetime, datetime]] = []
        for event in events:
            start = event.begin.datetime.astimezone(tz)
            end = event.end.datetime.astimezone(tz)
            events_local.append((start, end))
        events_local.sort(key=lambda x: x[0])

        # Choose day from first event or today
        base_day = events_local[0][0].date() if events_local else datetime.now(tz).date()

        duration = timedelta(hours=float(time_length))
        pad = timedelta(minutes=15)
        work_start = tz.localize(datetime.combine(base_day, dtime(hour=8)))
        work_end = tz.localize(datetime.combine(base_day, dtime(hour=17)))

        # Lunch window
        ls = datetime.strptime(lunch_time[0], "%H:%M").time()
        le = datetime.strptime(lunch_time[1], "%H:%M").time()
        lunch_start = tz.localize(datetime.combine(base_day, ls))
        lunch_end = tz.localize(datetime.combine(base_day, le))

        # Build blocked intervals
        blocked: List[Tuple[datetime, datetime]] = []
        for s, e in events_local:
            # clamp to work hours
            s2 = max(work_start, s - pad)
            e2 = min(work_end, e + pad)
            if s2 < e2:
                blocked.append((s2, e2))
        blocked.append((lunch_start, lunch_end))
        blocked.sort(key=lambda x: x[0])

        # Merge overlaps
        merged: List[Tuple[datetime, datetime]] = []
        for s, e in blocked:
            if not merged or s > merged[-1][1]:
                merged.append((s, e))
            else:
                merged[-1] = (merged[-1][0], max(merged[-1][1], e))

        # Find earliest gap
        cursor = work_start
        for s, e in merged:
            if cursor + duration <= s:
                start = cursor
                end = start + duration
                return {
                    "date": start.strftime("%Y-%m-%d"),
                    "start_time": start.strftime("%H:%M"),
                    "end_time": end.strftime("%H:%M"),
                }
            cursor = max(cursor, e)

        if cursor + duration <= work_end:
            start = cursor
            end = start + duration
            return {
                "date": start.strftime("%Y-%m-%d"),
                "start_time": start.strftime("%H:%M"),
                "end_time": end.strftime("%H:%M"),
            }

        # No slot available
        result = {"error": "No available slot found"}
        self.logger.info(f"Appointment fallback result: {result}")
        return result
