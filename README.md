# Clinix – Seamless Care Starts Here

Clinix is a front-desk assistant (human-built) with an optional LLM chat module. It coordinates appointments, assists with medical records, and estimates insurance coverage—while keeping patient data private.

## ✨ Highlights
- **Fast scheduling**: surfaces available appointment slots using anonymized calendar data.
- **Record guidance**: directs staff to the right medical record without exposing protected health information (PHI) to the AI.
- **Insurance insights**: generates quick, generic coverage summaries so patients understand costs sooner.
- **Privacy by design**: leverages “skeleton” datasets so large language models never touch sensitive data.

## 🧱 Architecture
| Layer     | Stack                               | Notes |
|---------- |-------------------------------------|-------|
| Frontend  | React 19, Vite, Tailwind CSS        | Deployed to Vercel (`frontend/`) |
| Backend   | Python 3.11, FastAPI, Uvicorn       | Deployed via Docker to Render or Railway (`backend/`) |
| Conversation engine (optional) | Google Gemini (default: `gemini-2.5-flash`) | Disabled if no API key; all actions run through our FastAPI controller |
| Data      | Skeleton CSVs & ICS template        | Anonymous data in `backend/utils/` and `backend/resources/` |


## 🛡️ Privacy Strategy
1. **No raw PHI in prompts** – Inputs from users are filtered; only the minimum needed reaches an LLM.
2. **Skeleton datasets** – Appointment, record, and insurance flows use stripped-down calendars/spreadsheets so the AI works with structure, not secrets.
3. **Backend guardianship** – FastAPI orchestrates every task, ensuring LLM responses are post-processed before any real data is fetched or confirmed.

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20 (frontend)
- Python ≥ 3.11 (backend)
- **(Optional)** Google Gemini API key (`GEMINI_API_KEY`) for chat features
- **(Optional)** Google service account JSON for Sheets via `gspread`

### Clone the project
```bash
git clone https://github.com/HitMonrillo/Clinix.git
cd Clinix
```

### Environment variables
Create `.env` files locally (they are gitignored):

`backend/.env`
```
GEMINI_API_KEY=your_gemini_key
# Optional aliases also supported: GOOGLE_API_KEY, GENAI_API_KEY, etc.
SKELETON_SPREADSHEET_PATH=backend/utils/MedicalRecordSkeletonSpreadsheet - Sheet1.csv
FULL_SPREADSHEET_PATH=backend/utils/MedicalRecordSpreadsheet - Sheet1.csv
APPOINTMENT_SKELETON_ICS=backend/resources/AppointmentSkeletonCalendar.ics
DEFAULT_TIMEZONE=America/New_York
```

`frontend/.env.local`
```
VITE_API_BASE_URL=http://localhost:8000
```

### Run the backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.api.main:app --reload --port 8000
```

### Run the frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Visit <http://localhost:5173> to interact with Clinix.

## 🧪 Demo Data
- `backend/utils/MedicalRecordSkeletonSpreadsheet - Sheet1.csv`
- `backend/utils/MedicalRecordSpreadsheet - Sheet1.csv`
- `backend/resources/AppointmentSkeletonCalendar.ics`
- JSON fallbacks in `backend/resources/`

All sample data is anonymized and intended purely for demonstration.

## ☁️ Deployment

### Backend
- **Render**: Configure the service using `render.yaml`, add environment variables in the dashboard, and rely on the existing GitHub Actions workflow (`.github/workflows/backend-deploy.yml`) or push to trigger auto-deploy.
- **Railway**: Uses `railway.toml`. Set `GEMINI_API_KEY` and other secrets via the Railway UI; the Dockerfile handles the build.

### Frontend
- Deploy `frontend/` to Vercel (or any static host). Set `VITE_API_BASE_URL` to the deployed backend URL, or use the provided rewrites in `frontend/vercel.json` to proxy API calls.

## 🔍 Key Commands
| Task | Command |
| ---- | ------- |
| Format / lint frontend | `npm run lint` |
| Start backend | `uvicorn backend.api.main:app --host 0.0.0.0 --port 8000` |
| Trigger Render deploy (GitHub Action) | Push to `main` or manually run workflow |

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feat/save-time`)
3. Commit changes (`git commit -m "Add scheduling widget"`)
4. Push (`git push origin feat/save-time`)
5. Open a pull request

## 🙏 Credits
- Built by the Clinix team

---
Questions or suggestions? Open an issue or reach out to the contributors!
