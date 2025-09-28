import os
import json
import re
from typing import List, Dict, Any
from backend.utils.logging import get_logger
from backend.utils.retry import retry

try:
    import google.generativeai as genai
except Exception:
    genai = None

def clean_json(text: str) -> str:
    # Remove ```json ... ``` or ``` ... ``` blocks
    return re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", text).strip()

class InsurancePlannerAgent:
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

    def plan_request(self, insurance_info: List[str], service: str) -> Dict[str, Any]:
        prompt = f"""
        You are a medical insurance researcher.
        Given the provider is {insurance_info[0]}, the insurance company is {insurance_info[1]}, and the plan is {insurance_info[2]}.
        Return a JSON object with:
        {{
            "deductable": "...",
            "co-pay": "...",
            "co-insurance": "...",
            "out-of-pocket maximum": "..."
        }}
        given that the service is {service}.
        
        Use ONLY the information provided (no real medical info) to decide what coverage this generic patient has.
        Use the internet as necessary to find information aboout the provider, insurance company, insurance plan, and medical service. 
        
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

        # Fallback stubbed values for demo
        provider = insurance_info[0] if insurance_info else "Unknown Provider"
        company = insurance_info[1] if len(insurance_info) > 1 else "Unknown Company"
        plan_name = insurance_info[2] if len(insurance_info) > 2 else "Unknown Plan"
        base = {
            "deductable": "$500",
            "co-pay": "$25",
            "co-insurance": "20%",
            "out-of-pocket maximum": "$3000",
            "provider": provider,
            "company": company,
            "plan": plan_name,
            "service": service,
        }
        # Heuristic tweaks
        if "ppo" in plan_name.lower():
            base["co-pay"] = "$20"
            base["co-insurance"] = "10%"
        if "hmo" in plan_name.lower():
            base["deductable"] = "$0"
            base["co-pay"] = "$15"
        self.logger.info(f"Insurance fallback plan: {base}")
        return base
