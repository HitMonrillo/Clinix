import google.generativeai as genai
import json

import re

def clean_json(text: str) -> str:
    # Remove ```json ... ``` or ``` ... ``` blocks
    return re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", text).strip()

class InsurancePlannerAgent:
    def __init__(self, api_key: str, model_name="gemini-flash-latest"):
        # configure Gemini
        genai.configure(api_key=api_key, transport="rest")
        self.model = genai.GenerativeModel(model_name)

    def plan_request(self, insurance_info: list, service: str) -> dict:
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

        response = self.model.generate_content(prompt)

        # Try to parse Gemini response safely
        response_text = clean_json(response.text)
        try:
            plan = json.loads(response_text)
        except json.JSONDecodeError:
            plan = {"error": "Could not parse planner response", "raw": response.text}

        return plan