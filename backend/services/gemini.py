"""Gemini-backed question generation and evaluation with mock fallback."""

from __future__ import annotations

import json
import os
from typing import Optional

from dotenv import load_dotenv

from schemas import (
    EvaluateRequest,
    EvaluationResult,
    GenerateRequest,
    QuestionBatch,
)
from services.mock_questions import get_mock_questions

load_dotenv()

MODEL_ID = "gemini-2.5-flash"


def _client():
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return None
    try:
        from google import genai

        return genai.Client(api_key=api_key)
    except Exception:
        return None


def generate_questions(payload: GenerateRequest) -> QuestionBatch:
    client = _client()
    if client is None:
        return get_mock_questions(payload.topics, payload.count, payload.difficulty)

    prompt = f"""You are COACH.AI, an adversarial technical interview engine for senior engineers.
Generate exactly {payload.count} multiple-choice interview questions.

Topics: {', '.join(payload.topics)}
Seniority / difficulty: {payload.difficulty}

Rules:
- Each question must have exactly 4 options with ids A, B, C, D.
- Exactly one correct_option_id.
- Provide a concise explanation.
- Optionally include a short code_snippet and code_language when it strengthens the stem.
- Calibrate depth for {payload.difficulty} (junior=fundamentals, senior=production trade-offs, staff=distributed systems / failure domains).
- Questions must be unique and high-signal, not trivia.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": QuestionBatch,
            },
        )
        raw = response.text
        if not raw:
            raise ValueError("Empty Gemini response")
        data = json.loads(raw)
        batch = QuestionBatch.model_validate(data)
        # Normalize ids to 1..n
        questions = [
            q.model_copy(update={"id": i})
            for i, q in enumerate(batch.questions[: payload.count], start=1)
        ]
        if len(questions) < payload.count:
            fill = get_mock_questions(payload.topics, payload.count - len(questions), payload.difficulty)
            start = len(questions) + 1
            for offset, q in enumerate(fill.questions):
                questions.append(q.model_copy(update={"id": start + offset}))
        return QuestionBatch(questions=questions[: payload.count])
    except Exception:
        return get_mock_questions(payload.topics, payload.count, payload.difficulty)


def evaluate_submissions(payload: EvaluateRequest) -> EvaluationResult:
    total = len(payload.submissions)
    correct = sum(
        1
        for s in payload.submissions
        if s.user_answer.strip().upper() == s.correct_answer.strip().upper()
    )
    base_score = int(round((correct / total) * 100)) if total else 0

    client = _client()
    if client is None:
        return _heuristic_evaluation(payload, base_score, correct, total)

    prompt = f"""You are COACH.AI evaluation kernel. Score this interview session.
Correct answers: {correct}/{total} (objective accuracy {base_score}%).

Submissions JSON:
{payload.model_dump_json(indent=2)}

Return a calibrated EvaluationResult:
- score: integer 0-100 (weight objective accuracy heavily; adjust ±5 for reasoning quality signals if evident)
- feedback: 1-2 sentences overall synthesis
- strengths: 2-4 concrete strengths tied to topics answered correctly
- areas_to_improve: 2-4 actionable gaps for incorrect or weak topics
- category_scores: optional map of topic -> 0-100
Be rigorous, not sycophantic. Staff-level calibration tone.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": EvaluationResult,
            },
        )
        raw = response.text
        if not raw:
            raise ValueError("Empty Gemini response")
        result = EvaluationResult.model_validate(json.loads(raw))
        # Keep score grounded near objective accuracy
        if abs(result.score - base_score) > 15:
            result.score = base_score
        return result
    except Exception:
        return _heuristic_evaluation(payload, base_score, correct, total)


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
        "Evaluation ran in offline/mock mode; connect GEMINI_API_KEY for richer synthesis."
    )
    return EvaluationResult(
        score=base_score,
        feedback=feedback,
        strengths=strengths[:4],
        areas_to_improve=areas[:4],
        category_scores=category_scores,
    )


def gemini_available() -> bool:
    return _client() is not None
