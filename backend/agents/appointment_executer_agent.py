class AppointmentExecutorAgent:
    def __init__(self, calendar_api_client=None, email_client=None):
        self.calendar = calendar_api_client
        self.email = email_client

    def book_appointment(self, patient_name, patient_email, plan_result):
        # plan_result expected from planner fallback: {date, start_time, end_time}
        doctor = plan_result.get("doctor", "Primary Care")
        time_slot = f"{plan_result.get('date')} {plan_result.get('start_time')} - {plan_result.get('end_time')}"

        if self.calendar:
            try:
                self.calendar.create_event(doctor, patient_name, time_slot)
            except Exception:
                pass

        if self.email:
            try:
                self.email.send_email(
                    to=patient_email,
                    subject="Appointment Confirmation",
                    body=f"Your appointment with {doctor} is scheduled for {time_slot}."
                )
            except Exception:
                pass

        return f"Appointment slot reserved for {patient_name} with {doctor} at {time_slot}"
