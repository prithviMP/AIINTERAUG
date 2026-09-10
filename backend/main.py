import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    EvaluateRequest,
    EvaluationResult,
    GenerateRequest,
    GenerateResponse,
)
from services.gemini import evaluate_submissions, generate_questions, gemini_available

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="COACH.AI API",
    version="2.4.0",
    description="Technical interview MCQ generation and evaluation via Gemini",
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
        "model": "gemini-2.5-flash",
    }


@app.post("/api/v1/generate", response_model=GenerateResponse)
def generate(payload: GenerateRequest) -> GenerateResponse:
    batch, engine = generate_questions(payload)
    return GenerateResponse(questions=batch.questions, engine=engine)


@app.post("/api/v1/evaluate", response_model=EvaluationResult)
def evaluate(payload: EvaluateRequest) -> EvaluationResult:
    result, engine = evaluate_submissions(payload)
    return result.model_copy(update={"engine": engine})
