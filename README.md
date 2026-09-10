# COACH.AI

AI-powered technical interview coach. Monorepo with Next.js frontend (Vercel) and FastAPI backend (Render).

## Structure

```
frontend/   Next.js 14 App Router + Tailwind (Terminal Obsidian)
backend/    FastAPI + Gemini 2.5 Flash (mock fallback)
```

## Local development

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # optionally set GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

Health check: `http://localhost:8000/health`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service status |
| POST | `/api/v1/generate` | Generate MCQ batch |
| POST | `/api/v1/evaluate` | Score session + feedback |

Without `GEMINI_API_KEY`, the backend serves a curated mock question bank and heuristic evaluation so the full flow still works.

## Deployment

### Backend → Render.com

1. Create a **Web Service** connected to this GitHub repo.
2. Set **Root Directory** to `backend`.
3. **Runtime:** Python 3.11
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable `GEMINI_API_KEY` (optional; mock mode works without it).
7. Confirm health at `https://<service>.onrender.com/health`.

A Blueprint file lives at [`backend/render.yaml`](backend/render.yaml) for one-click setup when Root Directory is `backend`.

### Frontend → Vercel

1. Import the monorepo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Next.js** (auto-detected).
4. Build Command: `npm run build` (see [`frontend/vercel.json`](frontend/vercel.json)).
5. Environment Variable:
   - `API_URL` = `https://<your-render-service>.onrender.com` (no trailing slash)
6. Deploy. CORS on the backend allows all origins for MVP (`allow_origins=["*"]`).

### Local pair run

```bash
# terminal 1
cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000

# terminal 2
cd frontend && npm run dev
```


## Product flow

`/` Overview → `/setup` Configure topics & seniority → `/interview` MCQ session → `/results` Scorecard
