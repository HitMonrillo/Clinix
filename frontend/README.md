Clinix Frontend (Vite + React)

Local dev
- npm install
- Copy `.env.local.example` to `.env.local` (optional if using dev proxy)
- npm run dev

Vercel deploy
- Project root: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Set an env var `VITE_API_BASE_URL` to your deployed backend (e.g., `https://clinix-backend.onrender.com`)

Alternative: Rewrites
- You can also use `vercel.json` rewrites to proxy API routes and avoid CORS. Update `frontend/vercel.json` and replace `https://YOUR-BACKEND-URL` with your backend URL.
- When using rewrites, omit `VITE_API_BASE_URL` so the app calls relative paths like `/records`.
