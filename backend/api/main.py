import os
from pathlib import Path
from typing import List

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

try:
    from dotenv import load_dotenv
    # Try common locations: backend/api/.env, backend/.env, repo_root/.env
    candidate_paths = [
        BASE_DIR / ".env",
        PROJECT_ROOT / ".env",
        PROJECT_ROOT.parent / ".env",
    ]
    for p in candidate_paths:
        if p.exists():
            load_dotenv(p)
            break
    else:
        # Fallback to default loader (uses CWD)
        load_dotenv()
except Exception:
    # dotenv is optional in production
    pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import json

from backend.utils.google import load_sheet_records
from backend.utils.logging import get_logger
from backend.utils.retry import retry
try:
    import google.generativeai as genai
except Exception:
    genai = None

logger = get_logger(__name__)

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
    path = os.getenv(
        "SKELETON_SPREADSHEET_PATH",
        "backend/utils/MedicalRecordSkeletonSpreadsheet - Sheet1.csv",
    )
    try:
        return load_sheet_records(path)
    except Exception:
        return _load_local_json("backend/resources/skeleton_records.json")


def load_full_records() -> List[dict]:
    path = os.getenv(
        "FULL_SPREADSHEET_PATH",
        "backend/utils/MedicalRecordSpreadsheet - Sheet1.csv",
    )
    try:
        return load_sheet_records(path)
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
    executor = InsuranceExecutorAgent()
    return planner, executor


def create_appointment_agents(api_key: str):
    planner = AppointmentPlannerAgent(api_key=api_key)
    # Use a no-op executor that returns a confirmation string
    executor = AppointmentExecutorAgent()
    return planner, executor


# Prefer stable, widely available default model
GENAI_MODEL = os.getenv("KNOWLEDGE_MODEL", "gemini-2.5-flash")


def create_knowledge_agent(api_key: str) -> KnowledgeAgent:
    # Resolve API key from common env var aliases if not provided explicitly
    resolved_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("GENAI_API_KEY") or os.getenv("GOOGLE_GENAI_API_KEY") or os.getenv("GOOGLEAI_API_KEY") or ""
    if resolved_key:
        logger.info(f"Knowledge agent: API key detected. Using model '{GENAI_MODEL}'.")
    else:
        logger.warning("Knowledge agent: No API key found in GEMINI_API_KEY/GOOGLE_API_KEY/GENAI_API_KEY.")

    class GeminiWrapper:
        def __init__(self, api_key: str, model_name: str):
            self.model = None
            if not api_key:
                logger.warning("Knowledge agent: Missing API key; Gemini disabled.")
                return
            if genai is None:
                logger.warning("Knowledge agent: google-generativeai not installed; Gemini disabled.")
                return
            try:
                genai.configure(api_key=api_key, transport="rest")
            except Exception as exc:
                logger.warning(f"Knowledge agent: Failed to configure Gemini client: {exc}")
                return

            # Try requested model, then fallbacks if needed
            candidates = [model_name, "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"]
            for name in [m for m in candidates if m]:
                try:
                    self.model = genai.GenerativeModel(name)
                    logger.info(f"Knowledge agent: Initialized Gemini model '{name}'.")
                    break
                except Exception as exc:
                    logger.warning(f"Knowledge agent: Failed to init model '{name}': {exc}")
            if not self.model:
                logger.error("Knowledge agent: Could not initialize any Gemini model; knowledge disabled.")

        def generate_response(self, query: str, instruction: str) -> str:
            if not self.model:
                return (
                    "Knowledge model is not configured. Please set GEMINI_API_KEY or "
                    "GOOGLE_API_KEY on the backend environment."
                )

            prompt = (
                f"Instruction: {instruction}\n"
                "Respond in a warm, conversational tone. Offer at most two specific, relevant tips. "
                "Avoid generic lifestyle lists and only suggest contacting a professional if the message sounds urgent. "
                "Keep it under three sentences.\n"
                f"Question: {query}"
            )
            try:
                response = retry(lambda: self.model.generate_content(prompt))
                text = getattr(response, "text", "")
                return text.strip() or "I'm not sure how to answer that right now."
            except Exception as exc:
                logger.error(f"Gemini knowledge call failed: {exc}")
                return "I'm not sure how to answer that right now."

    llm = GeminiWrapper(resolved_key, GENAI_MODEL)
    return KnowledgeAgent(llm, escalate_to_human)


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
knowledge = create_knowledge_agent(GEMINI_API_KEY)

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
