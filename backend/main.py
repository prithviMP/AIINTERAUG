from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import EvaluateRequest, EvaluationResult, GenerateRequest, QuestionBatch
from services.gemini import evaluate_submissions, generate_questions, gemini_available

app = FastAPI(
    title="COACH.AI API",
    version="2.4.0",
    description="Technical interview question generation and evaluation",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "coach-ai",
        "gemini": gemini_available(),
    }


@app.post("/api/v1/generate", response_model=QuestionBatch)
def generate(payload: GenerateRequest) -> QuestionBatch:
    return generate_questions(payload)


@app.post("/api/v1/evaluate", response_model=EvaluationResult)
def evaluate(payload: EvaluateRequest) -> EvaluationResult:
    return evaluate_submissions(payload)
