from typing import List, Literal, Optional

from pydantic import BaseModel, Field


Difficulty = Literal["junior", "senior", "staff"]


class GenerateRequest(BaseModel):
    topics: List[str] = Field(..., min_length=1)
    count: int = Field(..., ge=1, le=15)
    difficulty: Difficulty = "senior"


class Option(BaseModel):
    id: Literal["A", "B", "C", "D"]
    text: str


class Question(BaseModel):
    id: int
    topic: str
    question: str
    options: List[Option]
    correct_option_id: Literal["A", "B", "C", "D"]
    explanation: str
    code_snippet: Optional[str] = None
    code_language: Optional[str] = None


class QuestionBatch(BaseModel):
    questions: List[Question]


class Submission(BaseModel):
    topic: str
    question: str
    user_answer: str
    correct_answer: str


class EvaluateRequest(BaseModel):
    submissions: List[Submission] = Field(..., min_length=1)


class EvaluationResult(BaseModel):
    score: int = Field(..., ge=0, le=100)
    feedback: str
    strengths: List[str]
    areas_to_improve: List[str]
    category_scores: Optional[dict[str, int]] = None
