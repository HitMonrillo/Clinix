import os
import json
import re
from typing import Dict, Any, List
from backend.utils.logging import get_logger
from backend.utils.retry import retry

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - optional at runtime
    genai = None

def clean_json(text: str) -> str:
    # Remove ```json ... ``` or ``` ... ``` blocks
    return re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", text).strip()

class MedicalPlannerAgent:
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

    def plan_request(self, query: str, skeleton_data: List[Dict[str, Any]]) -> dict:
        prompt = f"""
        You are a medical records planner.
        Use ONLY the skeleton data (no real medical info) to decide which patient and field to fetch.

        Skeleton data: {json.dumps(skeleton_data)}

        For the query: "{query}", return a JSON object with:
        {{
            "row": "...",
            "patient_id": "...",
            "field": "Labs | Prescriptions | Exam | Notes | Vaccinations | etc."
        }}

        Respond with ONLY valid JSON. No explanation or text outside the JSON.
        """

        # Use LLM if available
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

        # Fallback heuristic: infer a field and first matching patient
        q = (query or "").lower()
        known_fields = [
            "labs", "prescriptions", "allergies", "notes", "vaccinations", "imaging"
        ]
        field = next((f.title() for f in known_fields if f in q), "Labs")

        pid = None
        row_idx = None
        for idx, row in enumerate(skeleton_data or []):
            fields_col = row.get("Fields")
            if isinstance(fields_col, str):
                fields = [x.strip().lower() for x in fields_col.split(",")]
            elif isinstance(fields_col, list):
                fields = [str(x).strip().lower() for x in fields_col]
            else:
                fields = []
            if field.lower() in fields:
                pid = row.get("Patient ID") or row.get("patient_id")
                row_idx = idx + 1
                break

        if pid is None and skeleton_data:
            pid = skeleton_data[0].get("Patient ID") or skeleton_data[0].get("patient_id")
            row_idx = 1

        plan = {"row": row_idx, "patient_id": pid, "field": field}
        self.logger.info(f"Planner fallback plan: {plan}")
        return plan
