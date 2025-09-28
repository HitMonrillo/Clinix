from typing import List, Dict, Any, Optional


class MedicalExecutorAgent:
    def __init__(self):
        pass

    def fetch_record(self, plan: Dict[str, Any], full_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Given a planning result and the full records list, return the matching
        record subset. Falls back gracefully if keys are missing.
        """
        if not isinstance(full_records, list):
            return {"error": "Invalid full_records payload"}

        pid = plan.get("patient_id") if isinstance(plan, dict) else None
        field = plan.get("field") if isinstance(plan, dict) else None

        match: Optional[Dict[str, Any]] = None
        if pid is not None:
            for row in full_records:
                # Support multiple potential id keys
                if str(row.get("Patient ID")) == str(pid) or str(row.get("patient_id")) == str(pid):
                    match = row
                    break

        if match is None and full_records:
            match = full_records[0]

        if match is None:
            return {"warning": "No records found"}

        if field and isinstance(field, str):
            # Return only requested field if present
            return {"patient_id": pid, "field": field, "value": match.get(field)}

        return match
