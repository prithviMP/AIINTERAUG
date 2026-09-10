# COACH.AI — Student Build Guide

A step-by-step tutorial for rebuilding **COACH.AI** (AI Technical Interview Coach) with **Cursor**, the same way this project was built in class.

You will go from idea → design → PRD → Cursor prompts → monorepo app → Gemini AI → deploy on Vercel + Render.

---

## What you will build

A full-stack interview practice app:

| Layer | Stack | Deploy |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind + GSAP + Three.js | Vercel |
| Backend | FastAPI + Pydantic + Google Gemini (`gemini-2.5-flash`) | Render |
| Flow | `/` Overview → `/setup` → `/interview` → `/results` | MCQ only (MVP) |

**Repo layout (monorepo):**

```
AIINTERAUG/
  frontend/     → Vercel (Root Directory = frontend)
  backend/      → Render (Root Directory = backend)
  prd.md        → Functional MVP PRD
  prd2.md       → Product vision / design-driven PRD
  docs/         → This guide + design mocks
```

---

## Prerequisites

Before you start, install / create accounts for:

1. **Cursor** — [https://cursor.com](https://cursor.com)
2. **Node.js 18+** and **npm**
3. **Python 3.11+**
4. **GitHub** account
5. **Google AI Studio** account (for Gemini API key) — [https://aistudio.google.com](https://aistudio.google.com)
6. **Google Stitch** (design) — [https://stitch.withgoogle.com](https://stitch.withgoogle.com)
7. **Vercel** account
8. **Render** account

Optional but helpful: Chrome DevTools, Postman / Thunder Client.

---

# Part 1 — Design with Google Stitch

This is how we got the visual direction (Terminal Obsidian / dark engineering UI).

## 1.1 Open Stitch and create a project

1. Go to [https://stitch.withgoogle.com](https://stitch.withgoogle.com) and sign in with Google.
2. Create a new project, e.g. **“COACH.AI / AI Interview Coach”**.
3. Describe the product in the Stitch prompt. Example:

```text
Design a premium dark-mode AI technical interview coach web app called COACH.AI.
Aesthetic: terminal / obsidian engineering console — not purple neon AI clichés.
Screens needed:
1) Overview / landing
2) Setup engine (topic clusters, seniority, question count)
3) Live interview session (MCQ)
4) Scorecard / results with strengths and areas to improve
Use emerald accents, monospace telemetry labels, high density UI.
```

4. Generate the screens. Iterate until the look feels like a serious engineering tool.
5. Export / download:
   - Screen PNGs (mockups)
   - Design tokens / HTML if Stitch offers them
   - Any design-system notes Stitch produces

## 1.2 Save your design assets

Create a folder for class work, e.g.:

```text
~/Documents/COACH-AI-class/
  designs/
    overview.png
    setup.png
    interview.png
    scorecard.png
  DESIGN.md          ← tokens / colors / typography from Stitch
```

In this repo, reference copies live under:

- `docs/design-mocks/` — screen PNGs used during the build
  - `01-overview.png`
  - `02-setup-engine.png`
  - `03-live-session.png`
  - `04-scorecard.png` / `04b-scorecard-alt.png`
- `docs/DESIGN.md` — Terminal Obsidian design tokens

**Design tokens we locked (Terminal Obsidian):**

| Token | Value | Use |
|---|---|---|
| Canvas | `#09090B` | Page background |
| Surfaces | `#121215` / `#18181B` | Panels |
| Borders | `#27272A` | Hairlines |
| Accent | `#10B981` (Terminal Emerald) | Selected states, live indicators |
| CTA | White pill on dark | Primary actions |
| Fonts | Geist / Inter / JetBrains Mono | Display / body / telemetry |

---

# Part 2 — Write the PRDs

We used **two** PRDs on purpose:

| File | Role |
|---|---|
| `prd.md` | **Buildable MVP** — APIs, routes, stack, deploy targets, 1-hour scope |
| `prd2.md` | **Vision / product design** — personas, aesthetics, fuller feature language from Stitch |

Students: you can generate these with Gemini / ChatGPT, then paste into files in your project.

## 2.1 Generate a basic functional PRD (`prd.md`)

Use Google AI Studio / Gemini (or ChatGPT) with a prompt like:

```text
Write a Product Requirements Document (PRD) for an MVP called "AI Interview Coach".

Tech stack:
- Frontend: Next.js App Router + Tailwind + TypeScript, deploy on Vercel
- Backend: FastAPI (Python), deploy on Render
- LLM: Google Gemini gemini-2.5-flash with structured JSON outputs

User flow:
/ (landing) → /setup (topics + difficulty + question count) → /interview (MCQ) → /results (score + feedback)

APIs:
1) POST /api/v1/generate — body: topics[], count — returns MCQ questions with options A-D, correct_option_id, explanation
2) POST /api/v1/evaluate — body: submissions[] — returns score 0-100, feedback, strengths[], areas_to_improve[]

Include:
- Executive summary
- Phased plan (Phase 1 mock JSON, Phase 2 live Gemini)
- Module specs per page
- Architecture diagram in ASCII/mermaid
- CORS notes for Vercel → FastAPI
- Env vars: GEMINI_API_KEY (backend), API_URL (frontend)
- Out of scope: auth, real voice, database

Keep it concrete enough that an AI coding agent can implement it in one session.
```

Save the output as `prd.md` in the project root.

## 2.2 Generate a design-driven product PRD (`prd2.md`)

Feed Stitch’s vision / screenshots into Gemini:

```text
Using this design direction (Terminal Obsidian, COACH.AI branding) and these screen descriptions,
write a richer Product Requirements Document focused on:
- Problem statement for senior engineers
- Personas (Senior / Staff / Hiring)
- Visual principles (extreme restraint, emerald accent, high density)
- Module specs for Overview, Setup Engine, Interview Room, Scorecard
- NFRs and success metrics
- Future roadmap (whiteboard, enterprise, IDE)

This PRD is the product vision. The buildable MVP is a separate shorter PRD.
```

Save as `prd2.md`.

## 2.3 Why two PRDs?

- Cursor (and you) need a **narrow MVP contract** (`prd.md`) so the agent does not try to build voice, PDF, topology maps, etc. in hour one.
- `prd2.md` keeps the **premium UI language** and brand so the frontend matches Stitch, even when some features are stubs.

In the real build we explicitly deferred: real voice, live AST, PDF export, live topology data. UI chrome can exist; **MCQ is the only wired answer mode**.

---

# Part 3 — Open the project in Cursor & attach context

## 3.1 Create / open the folder

1. Create an empty folder (or clone a starter).
2. Put `prd.md`, `prd2.md`, design PNGs, and `DESIGN.md` inside.
3. Open the folder in Cursor: **File → Open Folder**.

## 3.2 How to “select files” for the agent (important)

Cursor does **not** magically know which files matter. You attach them:

### Method A — `@` mentions in chat (recommended)

In the Composer / Agent chat input, type `@` and pick:

- `@prd.md`
- `@prd2.md`
- `@DESIGN.md` (if present)
- Or `@docs/design-mocks/...` for images if they are in the workspace

### Method B — Drag & drop images

Drag your Stitch PNG mockups into the chat. Cursor saves them as attachments and the agent can “see” the UI.

### Method C — Context pills / file picker

Use the **+** / paperclip / context controls in Composer to add files and images before sending the prompt.

**What we did in the real session:** attached **5 design screenshots** + `prd.md` + `prd2.md` + `DESIGN.md`, then asked for a plan.

---

# Part 4 — Prompt library (copy these)

Use **Plan mode** first when the task is large. Then approve the plan and let the agent implement.

## Prompt 1 — Plan the whole app (first message)

```text
Hey Cursor, we are trying to build a web application. The details are in the files I have attached.
Refer to those files and come up with a plan, then build this.

Monorepo rules:
- frontend/ folder = Next.js frontend
- backend/ folder = FastAPI backend
- Easy to deploy separately

Deploy targets:
- Vercel for frontend
- Render.com for backend

@prd.md @prd2.md
I have also added images of the design.
Now start planning to build the application.
```

**What should happen:** Cursor switches to a plan (or you use Plan mode), produces a monorepo build plan, todos, and scope locks (MCQ only, mock Gemini fallback, etc.).

## Prompt 2 — Implement the approved plan

After you review the plan:

```text
Implement the plan as specified. Do NOT edit the plan file itself.
To-dos from the plan have already been created. Do not create them again.
Mark them as in_progress as you work, starting with the first one.
Don't stop until you have completed all the to-dos.
```

## Prompt 3 — Run locally to test

```text
Can you run the frontend and backend for me? I want to test it out.
```

Expected local URLs:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## Prompt 4 — Make it look premium (3D + GSAP)

```text
Hey, the website looks very plain. Can you use Three.js libraries with Next.js,
or GSAP animations, and make this website look cooler?
Add parallax effect and 3D effect.
```

Follow-up we used:

```text
Also add a lot of micro-interactions. Whenever I click something,
cool little animations should happen. The website should look premium.
Micro-interactions and micro-animations.
```

Then approve the motion plan and implement.

## Prompt 5 — Wire live Gemini MCQ generation

```text
Integrate Gemini LLM generation so that based on my selections,
questions are dynamically generated.
Also add proper animations while questions are being generated.
For now keep questions MCQ only.
Based on user selections, questions should be dynamically generated
and evaluated using AI.
```

## Prompt 6 — Push to GitHub

```text
Push all my changes to the GitHub repository, both frontend and backend,
so that I can deploy them.
```

(Or: create the repo first on GitHub, then ask Cursor to push.)

## Prompt 7 — Deploy help (Vercel)

```text
I want to deploy my frontend on Vercel. I already imported my GitHub repo.
I am on the New Project page. Tell me exactly what to put in each field.
```

## Prompt 8 — Deploy help (Render)

```text
Help me deploy the FastAPI backend on Render.com.
I am new to Render. Tell me which service type to choose and the exact settings.
```

---

# Part 5 — Build sequence (what the agent should create)

Use this as a checklist while Cursor works (or if you build manually).

## 5.1 Scaffold

- [ ] `.gitignore`
- [ ] Root `README.md`
- [ ] `frontend/` Next.js + Tailwind + TypeScript
- [ ] `backend/` FastAPI + `requirements.txt`
- [ ] `frontend/.env.example` → `API_URL=http://localhost:8000`
- [ ] `backend/.env.example` → `GEMINI_API_KEY=`

## 5.2 Backend

- [ ] `backend/main.py` — CORS, `/health`, generate, evaluate
- [ ] `backend/schemas.py` — Pydantic models
- [ ] `backend/services/mock_questions.py` — offline fallback bank
- [ ] `backend/services/gemini.py` — Gemini structured JSON + fallback
- [ ] `backend/render.yaml` — start command for Render

**CORS (MVP):**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 5.3 Frontend pages

| Route | Purpose |
|---|---|
| `/` | Overview / marketing hero + CTA |
| `/setup` | Topics, seniority, question count → call generate |
| `/interview` | MCQ session, progress, timer |
| `/results` | Score, strengths, areas to improve |

Session state: `localStorage` (see `frontend/src/lib/session.ts`).

## 5.4 Motion layer (after MVP works)

- React Three Fiber hero on Overview (`WireframeKernel`)
- GSAP reveals / parallax
- Micro-interaction kit: Pressable, MagneticButton, Ripple, TiltCard
- Respect `prefers-reduced-motion`

## 5.5 Gemini live mode

1. Get API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Put it in `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
```

3. Restart uvicorn
4. Hit `/health` — `"gemini": true` means live mode is active
5. Without a key, mock bank still works (great for demos)

---

# Part 6 — Run it yourself (manual commands)

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and add GEMINI_API_KEY if you have one
uvicorn main:app --reload --port 8000
```

### Frontend (second terminal)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000` and walk the flow:

1. Overview → **Start Interview Session**
2. Setup → select topics → Begin Session
3. Answer MCQs
4. Review Scorecard

---

# Part 7 — Deploy

## 7.1 Push code to GitHub

Create an empty GitHub repo (e.g. `AIINTERAUG`), then:

```bash
git init
git add .
git commit -m "Initial commit: COACH.AI monorepo MVP"
git branch -M main
git remote add origin https://github.com/<you>/AIINTERAUG.git
git push -u origin main
```

Or ask Cursor (Prompt 6) after the remote exists.

## 7.2 Frontend → Vercel

1. [https://vercel.com/new](https://vercel.com/new) → Import the GitHub repo.
2. Fill the form:

| Field | Value |
|---|---|
| Framework | **Next.js** |
| Root Directory | **`frontend`** |
| Build Command | `npm run build` (default) |
| Install Command | default |

3. Environment variable:

| Key | Value |
|---|---|
| `API_URL` | Your Render URL later, e.g. `https://coach-ai-backend.onrender.com` |

> This project exposes `API_URL` to the browser via `frontend/next.config.mjs` (`env: { API_URL: ... }`).  
> If Vercel warns about “public prefix”, you can ignore it for this URL — it is not a secret. **Never** put `GEMINI_API_KEY` in Vercel public env.

4. Deploy. Note your Vercel URL (e.g. `https://aiinteraug.vercel.app`).

## 7.3 Backend → Render

1. [https://dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service** (not Static Site).
2. Connect the same GitHub repo, branch `main`.
3. Settings:

| Field | Value |
|---|---|
| Root Directory | **`backend`** |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Instance | Free is OK for class |

4. Env var: `GEMINI_API_KEY` = your key (secret).
5. Deploy → wait until **Live**.
6. Test: `https://YOUR-SERVICE.onrender.com/health`

## 7.4 Connect frontend to backend

1. Vercel → Project → **Settings** → **Environment Variables**
2. Set `API_URL` = `https://YOUR-SERVICE.onrender.com` (no trailing slash)
3. **Redeploy** (required — build-time env)

CORS: MVP already allows `*`, so you do not need to paste the Vercel URL into Render for CORS today.

### Free tier tip

Render free services **sleep** after idle time. The first request after sleep can take 30–60+ seconds. That is normal in class demos.

---

# Part 8 — How Cursor was used (teaching notes)

Share these habits with students:

1. **PRD first, code second** — vague vibes produce vague apps.
2. **Attach designs + PRDs** with `@` and image drop — do not assume the agent “remembers” class slides.
3. **Plan mode for big builds** — review scope locks before Implement.
4. **Iterate in layers:**
   - Layer A: working flow with mock data
   - Layer B: visual fidelity to Stitch
   - Layer C: motion / 3D polish
   - Layer D: live Gemini
   - Layer E: deploy
5. **Always keep a mock fallback** so demos work without API keys / network.
6. **Monorepo with two roots** so Vercel and Render each point at one folder.

---

# Part 9 — Suggested class timeline (≈ 90–120 minutes)

| Block | Time | Activity |
|---|---|---|
| 1 | 15 min | Stitch design + export screenshots |
| 2 | 15 min | Generate `prd.md` + `prd2.md` with Gemini |
| 3 | 10 min | Open Cursor, attach files, send Prompt 1 |
| 4 | 25 min | Approve plan, implement MVP, local run |
| 5 | 15 min | Motion / micro-interaction polish |
| 6 | 10 min | Add Gemini key, verify live generate/evaluate |
| 7 | 20–30 min | Push GitHub → Vercel + Render |

---

# Part 10 — Acceptance checklist (for students)

- [ ] App opens on `/` with COACH.AI branding
- [ ] Setup requires ≥ 1 topic before Begin Session
- [ ] Interview shows MCQs and advances
- [ ] Results shows score + strengths + areas to improve
- [ ] Backend `/health` returns OK
- [ ] Without Gemini key → mock engine still works
- [ ] With Gemini key → `/health` shows `"gemini": true`
- [ ] Frontend deployed on Vercel (`Root Directory = frontend`)
- [ ] Backend deployed on Render (`Root Directory = backend`)
- [ ] Vercel `API_URL` points at Render and site was redeployed

---

# Part 11 — Troubleshooting

| Problem | Fix |
|---|---|
| Frontend can’t reach API locally | Backend running on `:8000`? `API_URL` in `.env.local`? |
| CORS errors after tightening origins | Add Vercel URL to `allow_origins` list |
| Vercel build fails | Confirm Root Directory is `frontend` |
| Render build fails | Confirm Root Directory is `backend` and start command uses `$PORT` |
| Gemini not used | Check `GEMINI_API_KEY` in Render / local `.env`, restart service |
| Env change on Vercel ignored | Redeploy after changing `API_URL` |
| First Render request slow | Free tier cold start — wait and retry |

---

# Appendix A — Exact prompts used in the original build

These are the real prompts from the COACH.AI session (lightly cleaned for students):

1. Plan + build with `@prd.md` `@prd2.md` + design images; monorepo; Vercel + Render.
2. Implement the plan / complete all todos.
3. Run frontend and backend for testing.
4. Add Three.js / GSAP / parallax / 3D.
5. Add premium micro-interactions on click.
6. Integrate Gemini for dynamic MCQ generate + evaluate + loading animations.
7. Push changes to GitHub.
8. Step-by-step Vercel New Project field values.
9. Step-by-step Render Web Service for FastAPI.
10. CORS / edit backend URL on Vercel / `API_URL` env guidance.

---

# Appendix B — Reference files in this repo

| Path | What it is |
|---|---|
| `prd.md` | Functional MVP PRD |
| `prd2.md` | Vision / design PRD |
| `docs/DESIGN.md` | Terminal Obsidian tokens |
| `docs/design-mocks/` | Stitch-inspired screen mocks used in Cursor |
| `README.md` | Quick run + deploy reference |
| `frontend/` | Next.js app |
| `backend/` | FastAPI + Gemini |

---

# Appendix C — Product flow diagram

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Overview   │ ──► │    Setup     │ ──► │  Interview   │ ──► │   Results    │
│      /       │     │   /setup     │     │  /interview  │     │  /results    │
└──────────────┘     └──────┬───────┘     └──────┬───────┘     └──────────────┘
                            │                    │
                            ▼                    ▼
                     POST /api/v1/generate  POST /api/v1/evaluate
                            │                    │
                            └────────┬───────────┘
                                     ▼
                              FastAPI + Gemini
                           (mock fallback if no key)
```

---

**Instructor tip:** Have students paste Prompts 1–5 exactly first. Only customize after the baseline MVP works. Most “Cursor didn’t build it right” failures come from missing `@prd` attachments or skipping Plan mode.
