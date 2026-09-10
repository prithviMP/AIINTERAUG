# Product Requirement Document (PRD)
## AI Interview Coach MVP

---

| Document Attribute | Details |
| :--- | :--- |
| **Project Title** | AI-Powered Tech Interview Coach |
| **Document Version** | v1.0.0 |
| **Status** | Approved / Ready for Build |
| **Target Build Duration**| 1 Hour Rapid MVP |
| **Tech Stack** | Next.js (App Router, Tailwind CSS), FastAPI, Google Gemini API (`gemini-2.5-flash`) |
| **Deployment Targets**| Vercel (Frontend), Render (Backend) |

---

## 1. Executive Summary & Vision

### 1.1 Objective
The **AI Interview Coach** is a web-based candidate preparation platform designed to help software engineers practice interview scenarios on-demand. Candidates can choose target technical topics (e.g., Data Structures & Algorithms, System Design, Java, Spring Boot, Low-Level Design) and engage in an automated evaluation session.

### 1.2 core Value Proposition
* **Instant Dynamic Question Generation:** Customized technical questions generated dynamically based on candidate-selected topics and skill domain.
* **Instant Structured Feedback:** Automated, AI-driven evaluation supplying a numerical performance score (0–100), key strengths, and targeted focus areas.
* **Rapid Deployment Footprint:** Architecture optimized for execution and deployment within 60 minutes.

---

## 2. Product Roadmap & Phased Execution

```
  ┌─────────────────────────────────────────────────────────┐
  │                        PHASE 1                          │
  │            Static Engine & Flow Validation             │
  │  • Mock JSON Questions     • Next.js Wizard UI          │
  │  • Static Score Logic      • Fast API Skeleton          │
  └───────────────────────────┬─────────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │                        PHASE 2                          │
  │              Live Gemini AI Integration                 │
  │  • Structured Outputs      • Dynamic Evaluation          │
  │  • gemini-2.5-flash        • Render/Vercel Live Deployment│
  └─────────────────────────────────────────────────────────┘
```

### Phase 1: Static Engine & Flow Validation (Minutes 00–35)
* Hardcoded MCQ JSON payloads served via FastAPI endpoints.
* Validates end-to-end user navigation (`/` → `/setup` → `/interview` → `/results`).
* Establishes clean state management using `localStorage` and Next.js React hooks.

### Phase 2: Live Gemini Integration & Deployment (Minutes 35–60)
* Integrate `google-genai` SDK using `gemini-2.5-flash` with strict Pydantic JSON schemas.
* Dynamic output generation for target topics.
* Production build verification and automated deployment to Vercel and Render.

---

## 3. User Flows & Module Specifications

```
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │   Landing    │ ───> │ Topic Setup  │ ───> │  Interview   │ ───> │ Scorecard &  │
  │  Page (`/`)  │      │  (`/setup`)  │      │ (`/interview`)│      │ (`/results`) │
  └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

### Module 1: Landing Page (`/`)
* **Hero Banner:** Headline *"Master Technical Interviews with AI"*.
* **Feature Highlights:** Real-time feedback, multi-domain dynamic targeting, automated dynamic scoring.
* **Primary Call-to-Action (CTA):** "Start Practice" button navigating directly to `/setup`.

### Module 2: Setup & Topic Selection (`/setup`)
* **Topic Selection Matrix:** Pill toggles for:
  * Data Structures & Algorithms (DSA)
  * System Design / High-Level Design (HLD)
  * Low-Level Design (LLD) / Object-Oriented Design
  * Java Core
  * Spring / Spring Boot Framework
* **Configuration Controls:**
  * Question Count Selector (3, 5, or 10 questions).
  * Difficulty Level Dropdown (Beginner, Intermediate, Advanced).
* **Validation:** Require at least 1 topic selected before enabling "Launch Interview".

### Module 3: Interview Room (`/interview`)
* **Progress Bar:** Active visual indicator (e.g., *"Question 2 of 5"*).
* **Question Viewport:** Displays stem text, topic badge, and difficulty tier.
* **Interactive Option List:** 4 multiple-choice radio cards (A, B, C, D) with selected states.
* **Answer Input Toggles:** Standard MCQ selection card, with placeholder UI toggle for voice/text response.
* **Control Actions:** "Next Question" and "Submit & Finish" buttons.

### Module 4: Scorecard & Feedback (`/results`)
* **Performance Metric Header:** Dynamic visual radial/score bar displaying overall grade (0–100).
* **Qualitative Breakdown:**
  * **Strengths:** Bulleted list of domains mastered during the session.
  * **Improvement Vectors:** Concrete recommendations on weak areas.
* **Action Footer:** "Start New Session" (resets state and redirects to `/setup`).

---

## 4. Technical Architecture & Tech Stack

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      FRONTEND ENVIRONMENT                   │
 │ Next.js 14+ (App Router) + Tailwind CSS + TypeScript        │
 │ Deployed on Vercel                                          │
 └──────────────────────────────┬──────────────────────────────┘
                                │ REST API (JSON)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                      BACKEND ENVIRONMENT                    │
 │ FastAPI (Python 3.10+) + Uvicorn                            │
 │ Deployed on Render.com                                      │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Google GenAI SDK
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                      LLM ENGINE LAYER                       │
 │ Google Gemini API (`gemini-2.5-flash`)                      │
 │ Enforced via Pydantic Structured Outputs                    │
 └─────────────────────────────────────────────────────────────┘
```

### Stack Components
* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
* **Backend:** FastAPI (Python 3.10+), Uvicorn ASGI Web Server.
* **LLM Engine:** Google Gemini API (`gemini-2.5-flash`).
* **Deployment Infrastructure:**
  * **Vercel:** Frontend static host with automated GitHub CI/CD integration.
  * **Render.com:** Web Service runtime for FastAPI server execution.

---

## 5. API Contracts & Data Models

### 5.1 Endpoint 1: Question Generation
* **Route:** `POST /api/v1/generate`
* **Request Body:**
```json
{
  "topics": ["DSA", "Java", "System Design"],
  "count": 3
}
```
* **Response Body (`QuestionBatch` Schema):**
```json
{
  "questions": [
    {
      "id": 1,
      "topic": "Java",
      "question": "Which memory area in the JVM is shared among all threads?",
      "options": [
        { "id": "A", "text": "Program Counter Register" },
        { "id": "B", "text": "JVM Stack" },
        { "id": "C", "text": "Heap Area" },
        { "id": "D", "text": "Native Method Stack" }
      ],
      "correct_option_id": "C",
      "explanation": "The Heap and Method areas are shared across all active threads in JVM execution."
    }
  ]
}
```

### 5.2 Endpoint 2: Session Evaluation
* **Route:** `POST /api/v1/evaluate`
* **Request Body:**
```json
{
  "submissions": [
    {
      "topic": "Java",
      "question": "Which memory area in the JVM is shared among all threads?",
      "user_answer": "C",
      "correct_answer": "C"
    }
  ]
}
```
* **Response Body (`EvaluationResult` Schema):**
```json
{
  "score": 100,
  "feedback": "Demonstrated strong core understanding of JVM internal memory architecture.",
  "strengths": [
    "Solid grasp of Java memory management and thread sharing rules."
  ],
  "areas_to_improve": [
    "Explore deeper thread-local optimization mechanisms."
  ]
}
```

---

## 6. Non-Functional & Deployment Requirements

### 6.1 CORS Configuration (Crucial)
FastAPI backend MUST explicit allow Cross-Origin requests from Vercel deployments:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6.2 Environment Variable Mapping
* **Backend (`/backend/.env`):**
  * `GEMINI_API_KEY`: API Key for Google Gemini API authentication.
* **Frontend (`/frontend/.env.local`):**
  * `NEXT_PUBLIC_API_URL`: Base URI targeting the active backend (`http://localhost:8000` for dev, Render domain for prod).

### 6.3 Deployment Commands
* **Render Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Vercel Build Command:** `npm run build`


