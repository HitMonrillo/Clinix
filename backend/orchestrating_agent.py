from typing import Callable, Optional, Tuple, Dict, Any

from backend.agents.appointment_planning_agent import AppointmentPlannerAgent
from backend.agents.appointment_executer_agent import AppointmentExecutorAgent
from backend.agents.medical_record_planner_agent import MedicalPlannerAgent
from backend.agents.medical_record_executer_agent import MedicalExecutorAgent
from backend.agents.insurance_planning_agent import InsurancePlannerAgent
from backend.agents.insurance_executer_agent import InsuranceExecutorAgent
from backend.agents.knowledge_agent import KnowledgeAgent


class HealthcareOrchestrator:
    def __init__(
        self,
        appointment_agents: Optional[Tuple[AppointmentPlannerAgent, Optional[AppointmentExecutorAgent]]] = None,
        record_agents: Optional[Tuple[MedicalPlannerAgent, Optional[MedicalExecutorAgent]]] = None,
        insurance_agents: Optional[Tuple[InsurancePlannerAgent, Optional[InsuranceExecutorAgent]]] = None,
        knowledge_agent: Optional[KnowledgeAgent] = None,
        load_skeleton_records: Optional[Callable[[], list]] = None,
        load_full_records: Optional[Callable[[], list]] = None,
        load_calendar_defaults: Optional[Callable[[], Tuple[str, float, str, list]]] = None,
    ):
        # Agents
        if appointment_agents:
            self.app_planner = appointment_agents[0]
            self.app_executor = appointment_agents[1] if len(appointment_agents) > 1 else None
        else:
            self.app_planner = None
            self.app_executor = None

        if record_agents:
            self.rec_planner = record_agents[0]
            self.rec_executor = record_agents[1] if len(record_agents) > 1 else None
        else:
            self.rec_planner = None
            self.rec_executor = None

        if insurance_agents:
            self.ins_planner = insurance_agents[0]
            self.ins_executor = insurance_agents[1] if len(insurance_agents) > 1 else None
        else:
            self.ins_planner = None
            self.ins_executor = None

        self.knowledge = knowledge_agent

        # Data loaders (dependency injected)
        self.load_skeleton_records = load_skeleton_records or (lambda: [])
        self.load_full_records = load_full_records or (lambda: [])
        self.load_calendar_defaults = load_calendar_defaults or (lambda: ("AppointmentSkeletonCalendar.ics", 1.0, "America/New_York", ["12:00", "13:00"]))

    # Records
    def handle_record(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.rec_planner:
            raise RuntimeError("Record planner not configured")

        query = payload.get("query", "")
        skeleton = self.load_skeleton_records()
        plan = self.rec_planner.plan_request(query, skeleton)

        result: Dict[str, Any] = {}
        if self.rec_executor:
            full = self.load_full_records()
            result = self.rec_executor.fetch_record(plan, full)

        return {"plan": plan, "result": result}

    # Insurance
    def handle_insurance(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.ins_planner:
            raise RuntimeError("Insurance planner not configured")

        provider = payload.get("provider", "")
        company = payload.get("company", payload.get("insurance_company", ""))
        plan_name = payload.get("plan", payload.get("plan_name", ""))
        service = payload.get("service", "General Consultation")

        plan = self.ins_planner.plan_request([provider, company, plan_name], service)

        # In this prototype, planner is authoritative; executor optional
        details = {}
        if self.ins_executor:
            plan_id = plan.get("plan_id") if isinstance(plan, dict) else None
            if plan_id:
                details = {"executor_details": self.ins_executor.get_plan_details(plan_id)}

        return {"plan": plan, "details": details}

    # Appointments
    def handle_appointment(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.app_planner:
            raise RuntimeError("Appointment planner not configured")

        calendar_path, time_len, tz, lunch_window = self.load_calendar_defaults()
        plan = self.app_planner.plan_slot(calendar_path, time_len, tz, lunch_window)

        booking = None
        if self.app_executor:
            try:
                booking = self.app_executor.book_appointment(
                    patient_name=payload.get("patientName", "Patient"),
                    patient_email=payload.get("patientEmail", "patient@example.com"),
                    plan_result=plan,
                )
            except Exception as e:
                booking = {"warning": f"Booking skipped: {e}"}

        return {"plan": plan, "booking": booking}

    # Chat
    def handle_chat(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.knowledge:
            return {"message": "Knowledge agent not configured"}
        query = payload.get("message", "")
        return {"message": self.knowledge.get_general_advice(query)}
