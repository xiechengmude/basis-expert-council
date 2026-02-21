"""Pydantic models for the assessment API."""

from pydantic import BaseModel


class StartRequest(BaseModel):
    subject: str
    grade_level: str
    anonymous_id: str | None = None
    goal: str | None = None


class AnswerRequest(BaseModel):
    question_id: int
    answer: str
    time_spent_sec: int


class ClaimRequest(BaseModel):
    anonymous_id: str


class QuestionOut(BaseModel):
    id: int
    stem: str
    options: list[str]
    topic: str
    difficulty_label: str
    question_number: int
    total_questions: int


class SessionStatus(BaseModel):
    session_id: str
    status: str
    total_questions: int
    correct_count: int
    current_difficulty: float
    subject: str
    grade_level: str
