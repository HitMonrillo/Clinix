import os
from typing import List

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # dotenv is optional in production
    pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import json
from pathlib import Path

from backend.utils.google import load_sheet_records
from backend.agents.appointment_planning_agent import AppointmentPlannerAgent
from backend.agents.appointment_executer_agent import AppointmentExecutorAgent
from backend.agents.medical_record_planner_agent import MedicalPlannerAgent
from backend.agents.medical_record_executer_agent import MedicalExecutorAgent
from backend.agents.insurance_planning_agent import InsurancePlannerAgent
from backend.agents.insurance_executer_agent import InsuranceExecutorAgent
from backend.agents.knowledge_agent import KnowledgeAgent, escalate_to_human
from backend.orchestrating_agent import HealthcareOrchestrator


# ---------- Request Schemas ----------

class RecordsRequest(BaseModel):
    query: str


class InsuranceRequest(BaseModel):
    provider: str = Field(..., description="Provider or facility, e.g., 'AdventHealth Orlando, Orlando, FL'")
    company: str = Field(..., description="Insurance company, e.g., 'Aetna'")
    plan: str = Field(..., description="Plan name, e.g., 'Aetna Open Choice PPO'")
    service: str = Field("General Consultation", description="Service type")


class AppointmentRequest(BaseModel):
    patientName: str = Field("Patient")
    patientEmail: str = Field("patient@example.com")


class ChatRequest(BaseModel):
    message: str


# ---------- Helpers / DI ----------

def _load_local_json(path: str) -> List[dict]:
    p = Path(path)
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []


def load_skeleton_records() -> List[dict]:
    name = os.getenv("SKELETON_SPREADSHEET_NAME")
    try:
        if name:
            return load_sheet_records(name)
        # If env not provided, try default; may fail without creds
        return load_sheet_records("MedicalRecordSkeletonSpreadsheet")
    except Exception:
        return _load_local_json("backend/resources/skeleton_records.json")


def load_full_records() -> List[dict]:
    name = os.getenv("FULL_SPREADSHEET_NAME")
    try:
        if name:
            return load_sheet_records(name)
        return load_sheet_records("MedicalRecordSpreadsheet")
    except Exception:
        return _load_local_json("backend/resources/full_records.json")


def load_calendar_defaults():
    calendar_path = os.getenv("APPOINTMENT_SKELETON_ICS", "backend/resources/AppointmentSkeletonCalendar.ics")
    time_length = float(os.getenv("APPOINTMENT_DEFAULT_LENGTH_HOURS", "1.5"))
    time_zone = os.getenv("DEFAULT_TIMEZONE", "America/New_York")
    lunch = [os.getenv("LUNCH_START", "12:00"), os.getenv("LUNCH_END", "13:00")]
    return calendar_path, time_length, time_zone, lunch


def create_medical_agents(api_key: str):
    planner = MedicalPlannerAgent(api_key=api_key)
    executor = MedicalExecutorAgent()
    return planner, executor


def create_insurance_agents(api_key: str):
    planner = InsurancePlannerAgent(api_key=api_key)
    # dataset not available yet; initialize with empty list
    executor = InsuranceExecutorAgent(full_dataset=[])
    return planner, executor


def create_appointment_agents(api_key: str):
    planner = AppointmentPlannerAgent(api_key=api_key)
    # Use a no-op executor that returns a confirmation string
    executor = AppointmentExecutorAgent()
    return planner, executor


def create_knowledge_agent() -> KnowledgeAgent:
    class DummyLLM:
        def generate_response(self, query: str, instruction: str) -> str:
            return "Thanks for your message. For medical issues, consult a professional."

    return KnowledgeAgent(DummyLLM(), escalate_to_human)


# ---------- FastAPI App ----------

app = FastAPI(title="Clinix API", version="0.1.0")

# CORS
allow_origins = os.getenv("CORS_ALLOW_ORIGINS")
origins = [o.strip() for o in allow_origins.split(",") if o.strip()] if allow_origins else [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency: Orchestrator
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
app_planner, app_executor = create_appointment_agents(GEMINI_API_KEY)
rec_planner, rec_executor = create_medical_agents(GEMINI_API_KEY)
ins_planner, ins_executor = create_insurance_agents(GEMINI_API_KEY)
knowledge = create_knowledge_agent()

orchestrator = HealthcareOrchestrator(
    appointment_agents=(app_planner, app_executor),
    record_agents=(rec_planner, rec_executor),
    insurance_agents=(ins_planner, ins_executor),
    knowledge_agent=knowledge,
    load_skeleton_records=load_skeleton_records,
    load_full_records=load_full_records,
    load_calendar_defaults=load_calendar_defaults,
)


@app.post("/records")
async def get_records(payload: RecordsRequest):
    try:
        return orchestrator.handle_record(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/insurance")
async def post_insurance(payload: InsuranceRequest):
    try:
        return orchestrator.handle_insurance(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/appointments")
async def post_appointment(payload: AppointmentRequest):
    try:
        return orchestrator.handle_appointment(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/chat")
async def post_chat(payload: ChatRequest):
    try:
        return orchestrator.handle_chat(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/")
async def health():
    return {"status": "ok"}
