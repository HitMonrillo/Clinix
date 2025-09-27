import json
import os

from backend.utils.google import load_sheet_records
from backend.agents.medical_record_planner_agent import MedicalPlannerAgent
from backend.agents.insurance_planning_agent import InsurancePlannerAgent
from backend.agents.appointment_planning_agent import AppointmentPlannerAgent


def _parse_fields_column(rows):
    for r in rows:
        if isinstance(r.get("Fields"), str):
            r["Fields"] = [f.strip() for f in r["Fields"].split(",")]
    return rows


def load_skeleton_and_full_data():
    """Load skeleton and full data sets from Google Sheets as configured by env vars."""
    skeleton_spreadsheet = os.getenv("SKELETON_SPREADSHEET_NAME", "MedicalRecordSkeletonSpreadsheet")
    full_spreadsheet = os.getenv("FULL_SPREADSHEET_NAME", "MedicalRecordSpreadsheet")

    skeleton_data = load_sheet_records(skeleton_spreadsheet)
    full_data = load_sheet_records(full_spreadsheet)

    return _parse_fields_column(skeleton_data), _parse_fields_column(full_data)


def create_agents():
    api_key = os.getenv("GEMINI_API_KEY", "")
    planner = MedicalPlannerAgent(api_key=api_key)
    insurance = InsurancePlannerAgent(api_key=api_key)
    appointment = AppointmentPlannerAgent(api_key=api_key)
    return planner, insurance, appointment


def load_calendar_defaults():
    skeleton_schedule = os.getenv("APPOINTMENT_SKELETON_ICS", "backend/resources/AppointmentSkeletonCalendar.ics")
    time_length = float(os.getenv("APPOINTMENT_DEFAULT_LENGTH_HOURS", "1.5"))
    time_zone = os.getenv("DEFAULT_TIMEZONE", "America/New_York")
    lunch_start = os.getenv("LUNCH_START", "12:00")
    lunch_end = os.getenv("LUNCH_END", "1:00")
    return skeleton_schedule, time_length, time_zone, [lunch_start, lunch_end]


def demo() -> dict:
    """Return a summary of planner outputs for quick local testing."""
    skeleton_data, _ = load_skeleton_and_full_data()
    planner, insurance, appointment = create_agents()
    skeleton_schedule, time_length, time_zone, lunch_time = load_calendar_defaults()

    outputs = {}
    test_queries = ["Find all the IDs that require Lab"]
    insurance_queries = ["AdventHealth Orlando, Orlando, FL", "Aetna", "Aetna Open Choice PPO"]

    outputs["records"] = [planner.plan_request(q, skeleton_data) for q in test_queries]
    outputs["insurance"] = insurance.plan_request(insurance_queries, "Regular Check Up")
    outputs["appointment"] = appointment.plan_slot(skeleton_schedule, time_length, time_zone, lunch_time)
    return outputs


if __name__ == "__main__":
    # Local manual run helper (no side effects on import)
    print(json.dumps(demo(), indent=2))
