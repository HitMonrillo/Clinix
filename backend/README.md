Clinix Backend API

Quick start
- Create a Python 3.10+ virtualenv
- Install deps: `pip install -r backend/requirements.txt`
- Copy env template: `cp backend/.env.example backend/.env` and fill values, or set env vars directly
- Run: `uvicorn backend.api.main:app --reload --port 8000`

Docker
- Build: `docker build -t clinix-backend -f backend/Dockerfile .`
- Run: `docker run --rm -p 8000:8000 --env-file backend/.env clinix-backend`

Environment variables
- GEMINI_API_KEY: Optional. When missing, deterministic fallbacks are used for planners and the knowledge agent
- KNOWLEDGE_MODEL: Optional Gemini model name for the knowledge agent (default: gemini-pro)
- SKELETON_SPREADSHEET_PATH: Optional path to skeleton CSV (default: backend/utils/MedicalRecordSkeletonSpreadsheet - Sheet1.csv)
- FULL_SPREADSHEET_PATH: Optional path to full CSV (default: backend/utils/MedicalRecordSpreadsheet - Sheet1.csv)
- APPOINTMENT_SKELETON_ICS: Optional ICS path (default: backend/resources/AppointmentSkeletonCalendar.ics)
- DEFAULT_TIMEZONE, LUNCH_START, LUNCH_END: Optional scheduling settings
- CORS_ALLOW_ORIGINS: Comma-separated list of allowed origins
- LOG_LEVEL: Logging level (default INFO)

Endpoints
- POST /records: {"query": "Find Labs for patient"} -> {plan, result}
- POST /insurance: {provider, company, plan, service?} -> {plan, details}
- POST /appointments: {patientName, patientEmail} -> {plan, booking}
- POST /chat: {message} -> {message}

Notes
- In demo mode (no API keys), planners compute sensible defaults and read `backend/resources/*.json` and `backend/resources/AppointmentSkeletonCalendar.ics`.

Render/Railway
- A `render.yaml` is included at the repo root for one-click Render blueprint deploy.
- A `railway.toml` is included for Railway; configure `RAILWAY_TOKEN` and project/service in GitHub or the Railway dashboard.
