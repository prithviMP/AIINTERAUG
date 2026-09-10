"""Gemini-backed MCQ generation and evaluation with mock fallback."""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

from dotenv import load_dotenv

from schemas import (
    EvaluateRequest,
    EvaluationPayload,
    EvaluationResult,
    GenerateRequest,
    QuestionBatch,
)
from services.mock_questions import get_mock_questions

# Always load backend/.env regardless of process cwd
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

logger = logging.getLogger("coach.ai.gemini")

MODEL_ID = "gemini-2.5-flash"


def _api_key() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip()


def _client():
    api_key = _api_key()
    if not api_key:
        return None
    try:
        from google import genai

        return genai.Client(api_key=api_key)
    except Exception as exc:
        logger.warning("Failed to init Gemini client: %s", exc)
        return None


def generate_questions(payload: GenerateRequest) -> tuple[QuestionBatch, str]:
    """Return (batch, engine) where engine is 'gemini' or 'mock'."""
    client = _client()
    if client is None:
        logger.info("Gemini unavailable — using mock bank")
        return get_mock_questions(payload.topics, payload.count, payload.difficulty), "mock"

    prompt = f"""You are COACH.AI, an adversarial technical interview engine.
Generate exactly {payload.count} MULTIPLE-CHOICE (MCQ) interview questions only.

Topics selected by candidate: {', '.join(payload.topics)}
Seniority / difficulty: {payload.difficulty}
Format: MCQ only (never ask for free-text or voice answers).

Hard requirements:
- Exactly {payload.count} questions in the "questions" array.
- Each question: topic (string), question stem, exactly 4 options with ids A/B/C/D, one correct_option_id, concise explanation.
- Distribute questions across the selected topics as evenly as possible.
- Calibrate depth for {payload.difficulty}:
  - junior: fundamentals and clear correctness
  - senior: production trade-offs, concurrency, operational edge cases
  - staff: distributed failure domains, consistency models, capacity / latency budgets
- Prefer high-signal scenario stems. Optionally include a short code_snippet + code_language when useful.
- No duplicate questions. No trick trivia.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": QuestionBatch,
                "temperature": 0.85,
            },
        )
        raw = response.text
        if not raw:
            raise ValueError("Empty Gemini response")
        batch = QuestionBatch.model_validate(json.loads(raw))
        questions = [
            q.model_copy(update={"id": i})
            for i, q in enumerate(batch.questions[: payload.count], start=1)
        ]
        if len(questions) < payload.count:
            fill = get_mock_questions(
                payload.topics, payload.count - len(questions), payload.difficulty
            )
            start = len(questions) + 1
            for offset, q in enumerate(fill.questions):
                questions.append(q.model_copy(update={"id": start + offset}))
        logger.info("Generated %s MCQs via Gemini", len(questions[: payload.count]))
        return QuestionBatch(questions=questions[: payload.count]), "gemini"
    except Exception as exc:
        logger.exception("Gemini generate failed — falling back to mock: %s", exc)
        return (
            get_mock_questions(payload.topics, payload.count, payload.difficulty),
            "mock",
        )


def evaluate_submissions(payload: EvaluateRequest) -> tuple[EvaluationResult, str]:
    total = len(payload.submissions)
    correct = sum(
        1
        for s in payload.submissions
        if s.user_answer.strip().upper() == s.correct_answer.strip().upper()
    )
    base_score = int(round((correct / total) * 100)) if total else 0

    client = _client()
    if client is None:
        return _heuristic_evaluation(payload, base_score, correct, total), "mock"

    prompt = f"""You are COACH.AI evaluation kernel for MCQ technical interviews.
Objective accuracy: {correct}/{total} ({base_score}%).

Submissions:
{payload.model_dump_json(indent=2)}

Return EvaluationResult JSON:
- score: 0-100, stay within ±8 of objective accuracy {base_score}
- feedback: 1-2 sentences, rigorous (not sycophantic)
- strengths: 2-4 concrete strengths from correct topics
- areas_to_improve: 2-4 actionable gaps from incorrect topics
- category_scores: map of topic -> 0-100 based on that topic's accuracy
Tone: Staff-level calibration. MCQ session only.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": EvaluationPayload,
                "temperature": 0.4,
            },
        )
        raw = response.text
        if not raw:
            raise ValueError("Empty Gemini response")
        payload_out = EvaluationPayload.model_validate(json.loads(raw))
        result = EvaluationResult(**payload_out.model_dump())
        if abs(result.score - base_score) > 12:
            result.score = base_score
        logger.info("Evaluated session via Gemini score=%s", result.score)
        return result, "gemini"
    except Exception as exc:
        logger.exception("Gemini evaluate failed — heuristic fallback: %s", exc)
        return _heuristic_evaluation(payload, base_score, correct, total), "mock"


def _heuristic_evaluation(
    payload: EvaluateRequest,
    base_score: int,
    correct: int,
    total: int,
) -> EvaluationResult:
    by_topic: dict[str, list[bool]] = {}
    for s in payload.submissions:
        ok = s.user_answer.strip().upper() == s.correct_answer.strip().upper()
        by_topic.setdefault(s.topic, []).append(ok)

    strengths: list[str] = []
    areas: list[str] = []
    category_scores: dict[str, int] = {}
    for topic, results in by_topic.items():
        ratio = sum(results) / len(results)
        category_scores[topic] = int(round(ratio * 100))
        if ratio >= 0.67:
            strengths.append(f"Solid signal on {topic} ({int(ratio * 100)}% accuracy).")
        else:
            areas.append(f"Reinforce {topic} fundamentals and failure-mode reasoning.")

    if not strengths:
        strengths.append("Completed the full assessment loop under timed conditions.")
    if not areas:
        areas.append("Push deeper on edge cases, concurrency hazards, and operational trade-offs.")

    feedback = (
        f"Objective accuracy {correct}/{total} ({base_score}%). "
        "Evaluation used offline heuristics; Gemini synthesis unavailable."
    )
    return EvaluationResult(
        score=base_score,
        feedback=feedback,
        strengths=strengths[:4],
        areas_to_improve=areas[:4],
        category_scores=category_scores,
    )


def gemini_available() -> bool:
    return bool(_api_key()) and _client() is not None
