"""
BasisPilot (贝领) — 测评引擎
CAT 自适应出题 + 规则评分 + 能力估算
"""

import json
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone

from . import db

# ---------------------------------------------------------------------------
# 常量
# ---------------------------------------------------------------------------

# 每种测评类型的默认题目数
QUESTION_COUNT = {
    "pre_admission": 20,
    "subject_diagnostic": 15,
    "quick": 8,
}

# 难度等级映射
ABILITY_LABELS = [
    (0.0, 0.2, "Below Grade Level", "基础薄弱"),
    (0.2, 0.4, "Approaching Grade Level", "发展中"),
    (0.4, 0.6, "At Grade Level", "达标"),
    (0.6, 0.8, "Above Grade Level", "优秀"),
    (0.8, 1.0, "Advanced / AP Ready", "卓越"),
]

# 可用测评类型定义
ASSESSMENT_TYPES = {
    "pre_admission": {
        "name_zh": "入学能力预评估",
        "name_en": "Pre-Admission Assessment",
        "description_zh": "全面评估学生当前学科水平与 BASIS 目标年级要求的差距",
        "description_en": "Comprehensive assessment of current academic level vs. BASIS target grade requirements",
        "question_count": 20,
        "estimated_minutes": 25,
        "subjects": ["math", "english"],
    },
    "subject_diagnostic": {
        "name_zh": "学科诊断测评",
        "name_en": "Subject Diagnostic",
        "description_zh": "深入诊断单一学科的知识掌握情况，精准定位薄弱环节",
        "description_en": "In-depth diagnostic of a single subject to identify weak areas",
        "question_count": 15,
        "estimated_minutes": 20,
        "subjects": ["math", "english", "physics", "chemistry", "biology", "history"],
    },
    "quick": {
        "name_zh": "快速摸底测评",
        "name_en": "Quick Assessment",
        "description_zh": "5 分钟快速了解学科水平，适合初次使用",
        "description_en": "5-minute quick assessment, ideal for first-time users",
        "question_count": 8,
        "estimated_minutes": 5,
        "subjects": ["math", "english"],
    },
    "map_practice": {
        "name_zh": "MAP 模拟测评",
        "name_en": "MAP Practice Test",
        "description_zh": "模拟 NWEA MAP Growth 自适应考试，覆盖 Math / Reading / Language Usage 三科",
        "description_en": "Simulates NWEA MAP Growth adaptive test covering Math, Reading, and Language Usage",
        "question_count": 20,
        "estimated_minutes": 25,
        "subjects": ["math", "english"],
    },
}
# Frontend uses "diagnostic" as alias for "subject_diagnostic"
ASSESSMENT_TYPES["diagnostic"] = ASSESSMENT_TYPES["subject_diagnostic"]
QUESTION_COUNT["diagnostic"] = QUESTION_COUNT["subject_diagnostic"]
QUESTION_COUNT["map_practice"] = 20


# ---------------------------------------------------------------------------
# CAT 自适应算法状态
# ---------------------------------------------------------------------------


@dataclass
class CATState:
    """Tracks the state of a Computer Adaptive Testing session."""
    subject: str
    grade_level: str
    assessment_type: str
    current_difficulty: float = 0.5
    consecutive_correct: int = 0
    consecutive_wrong: int = 0
    answered_question_ids: list[int] = field(default_factory=list)
    difficulty_history: list[float] = field(default_factory=list)
    correct_history: list[bool] = field(default_factory=list)
    question_count: int = 0
    max_questions: int = 15

    @property
    def is_complete(self) -> bool:
        return self.question_count >= self.max_questions

    @property
    def progress(self) -> float:
        return min(1.0, self.question_count / self.max_questions)


def compute_next_difficulty(state: CATState, is_correct: bool) -> float:
    """
    CAT simplified algorithm:
    - Answer correct → difficulty +0.15
    - Answer wrong → difficulty -0.15
    - 2 consecutive correct → +0.25 (accelerate)
    - 2 consecutive wrong → -0.25 (accelerate)
    - Clamp to [0.0, 1.0]
    """
    if is_correct:
        state.consecutive_correct += 1
        state.consecutive_wrong = 0
        if state.consecutive_correct >= 2:
            delta = 0.25
        else:
            delta = 0.15
    else:
        state.consecutive_wrong += 1
        state.consecutive_correct = 0
        if state.consecutive_wrong >= 2:
            delta = -0.25
        else:
            delta = -0.15

    new_difficulty = state.current_difficulty + delta
    return max(0.0, min(1.0, new_difficulty))


def estimate_ability(state: CATState) -> float:
    """
    Ability = mean difficulty of last N answered questions, weighted by correctness.
    Uses last 5 questions or all if fewer.
    """
    n = min(5, len(state.difficulty_history))
    if n == 0:
        return 0.5

    recent_d = state.difficulty_history[-n:]
    recent_c = state.correct_history[-n:]

    # Weighted average: correct answers at that difficulty count positively
    total = 0.0
    for d, c in zip(recent_d, recent_c):
        if c:
            total += d
        else:
            total += max(0.0, d - 0.15)
    return max(0.0, min(1.0, total / n))


def ability_to_grade_equivalent(ability: float, target_grade: str) -> str:
    """Convert ability score to grade-equivalent description."""
    grade_num = int(target_grade.replace("G", "")) if target_grade.startswith("G") else 7

    if ability >= 0.8:
        return f"Above {target_grade} level"
    elif ability >= 0.6:
        return f"At {target_grade} level"
    elif ability >= 0.4:
        below = f"G{grade_num - 1}" if grade_num > 5 else "G5"
        return f"Approaching {target_grade}, near {below} level"
    elif ability >= 0.2:
        below = f"G{max(5, grade_num - 2)}"
        return f"Below {target_grade}, at {below} level"
    else:
        below = f"G{max(5, grade_num - 3)}"
        return f"Significantly below {target_grade}, at {below} level"


def ability_to_label(ability: float) -> tuple[str, str]:
    """Return (english_label, chinese_label) for an ability score."""
    for low, high, en, zh in ABILITY_LABELS:
        if low <= ability < high:
            return en, zh
    return ABILITY_LABELS[-1][2], ABILITY_LABELS[-1][3]


def ability_to_score(ability: float) -> float:
    """Convert 0-1 ability to 0-100 score."""
    return round(ability * 100, 1)


# ---------------------------------------------------------------------------
# 规则评分引擎
# ---------------------------------------------------------------------------


def score_mcq(question: dict, user_answer: str | dict) -> tuple[bool, float]:
    """Score a multiple-choice question. Returns (is_correct, score)."""
    # content_en or content_zh contains {answer: "A"} or {answer: "B"}
    content = question.get("content_en") or question.get("content_zh") or {}
    if isinstance(content, str):
        content = json.loads(content)
    correct_answer = content.get("answer", "")

    # user_answer could be {"selected": "A"} or just "A"
    if isinstance(user_answer, dict):
        given = user_answer.get("selected", "")
    elif isinstance(user_answer, str):
        try:
            parsed = json.loads(user_answer)
            given = parsed.get("selected", user_answer) if isinstance(parsed, dict) else user_answer
        except (json.JSONDecodeError, TypeError):
            given = user_answer
    else:
        given = str(user_answer)

    is_correct = str(given).strip().upper() == str(correct_answer).strip().upper()
    return is_correct, 1.0 if is_correct else 0.0


def score_fill_in(question: dict, user_answer: str | dict) -> tuple[bool, float]:
    """Score a fill-in-the-blank question with fuzzy matching."""
    content = question.get("content_en") or question.get("content_zh") or {}
    if isinstance(content, str):
        content = json.loads(content)
    correct_answer = str(content.get("answer", "")).strip()

    if isinstance(user_answer, dict):
        given = str(user_answer.get("text", "")).strip()
    elif isinstance(user_answer, str):
        try:
            parsed = json.loads(user_answer)
            given = str(parsed.get("text", user_answer)).strip() if isinstance(parsed, dict) else user_answer.strip()
        except (json.JSONDecodeError, TypeError):
            given = user_answer.strip()
    else:
        given = str(user_answer).strip()

    # Normalize: strip whitespace, lowercase
    norm_correct = re.sub(r'\s+', ' ', correct_answer.lower())
    norm_given = re.sub(r'\s+', ' ', given.lower())

    # Check for acceptable answers (pipe-separated alternatives)
    acceptable = [a.strip().lower() for a in correct_answer.split("|")]
    is_correct = norm_given in acceptable or norm_given == norm_correct
    return is_correct, 1.0 if is_correct else 0.0


def score_question(question: dict, user_answer: str | dict | None) -> tuple[bool | None, float | None]:
    """
    Score a question based on its type (rule-based only).
    Returns (is_correct, score).
    For open-ended types (essay/experiment/short_answer), returns (None, None)
    since those require Agent scoring via score_question_async().
    """
    if user_answer is None:
        return False, 0.0

    q_type = question.get("question_type", "")

    if q_type == "mcq":
        return score_mcq(question, user_answer)
    elif q_type == "fill_in":
        return score_fill_in(question, user_answer)
    elif q_type in ("short_answer", "essay", "experiment"):
        # Requires Agent scoring — return None to signal async scoring needed
        return None, None
    else:
        return None, None


async def score_question_async(
    question: dict, user_answer: str | dict | None,
) -> tuple[bool | None, float | None, str | None]:
    """
    Score a question, using Agent LLM for subjective types.
    Returns (is_correct, score, agent_feedback).
    For rule-scored types, agent_feedback is None.
    """
    if user_answer is None:
        return False, 0.0, None

    q_type = question.get("question_type", "")

    if q_type == "mcq":
        is_correct, score = score_mcq(question, user_answer)
        return is_correct, score, None
    elif q_type == "fill_in":
        is_correct, score = score_fill_in(question, user_answer)
        return is_correct, score, None
    elif q_type in ("short_answer", "essay", "experiment"):
        from .assessment.agent_scoring import score_subjective_question
        is_correct, score, feedback = await score_subjective_question(question, user_answer)
        return is_correct, score, feedback
    else:
        return None, None, None


# ---------------------------------------------------------------------------
# 测评会话编排
# ---------------------------------------------------------------------------


async def start_session(
    *,
    assessment_type: str,
    subject: str,
    grade_level: str,
    campus: str | None = None,
    user_id: int | None = None,
    anonymous_id: str | None = None,
    referral_code: str | None = None,
    utm_source: str | None = None,
    utm_campaign: str | None = None,
) -> dict:
    """
    Create a new assessment session and return the first question.
    Returns: { session, first_question, total_questions }
    """
    max_q = QUESTION_COUNT.get(assessment_type, 15)

    session = await db.create_assessment_session(
        assessment_type=assessment_type,
        subject=subject,
        grade_level=grade_level,
        campus=campus,
        user_id=user_id,
        anonymous_id=anonymous_id,
        referral_code=referral_code,
        utm_source=utm_source,
        utm_campaign=utm_campaign,
    )

    # Find the first question at medium difficulty
    first_q = await db.find_next_question(
        subject=subject,
        grade_level=grade_level,
        target_difficulty=0.5,
        exclude_ids=[],
        tolerance=0.2,
    )

    return {
        "session": session,
        "first_question": _format_question(first_q) if first_q else None,
        "total_questions": max_q,
    }


async def submit_answer(
    session_id: str,
    question_id: int,
    user_answer: str | dict | None,
    time_spent_sec: int | None = None,
) -> dict:
    """
    Process an answer submission:
    1. Score the answer (rules or mark as needing Agent)
    2. Update CAT state
    3. Select next question
    4. Return result
    """
    session = await db.get_assessment_session(session_id)
    if not session:
        raise ValueError("Session not found")
    if session["status"] != "in_progress":
        raise ValueError("Session is not in progress")

    question = await db.get_question(question_id)
    if not question:
        raise ValueError("Question not found")

    # Get existing answers to reconstruct CAT state
    existing_answers = await db.get_session_answers(session_id)
    question_order = len(existing_answers) + 1
    max_q = QUESTION_COUNT.get(session["assessment_type"], 15)

    # Score the answer (Agent LLM for subjective types)
    is_correct, score, agent_feedback = await score_question_async(question, user_answer)

    # Save the answer record
    answer_record = await db.save_answer(
        session_id=session_id,
        question_id=question_id,
        question_order=question_order,
        user_answer=user_answer if isinstance(user_answer, (dict, list)) else {"text": user_answer},
        is_correct=is_correct,
        score=score,
        difficulty_at=question["difficulty"],
        time_spent_sec=time_spent_sec,
        agent_feedback=agent_feedback,
    )

    # Update question usage stats (only for scored questions)
    if is_correct is not None:
        await db.increment_question_usage(question_id, is_correct)

    # Rebuild CAT state from history
    state = _rebuild_cat_state(session, existing_answers, max_q)

    # Record this answer in CAT state
    state.answered_question_ids.append(question_id)
    state.difficulty_history.append(question["difficulty"])
    if is_correct is not None:
        state.correct_history.append(is_correct)
    else:
        # For agent-scored questions, assume partial credit for CAT progression
        state.correct_history.append(True)
    state.question_count += 1

    is_last = state.question_count >= max_q

    # Compute next difficulty and find next question
    next_question = None
    if not is_last:
        effective_correct = is_correct if is_correct is not None else True
        state.current_difficulty = compute_next_difficulty(state, effective_correct)
        # find_next_question 内建多级 fallback（扩难度→同年级全部→相邻年级→全题库）
        next_q = await db.find_next_question(
            subject=session["subject"],
            grade_level=session["grade_level"],
            target_difficulty=state.current_difficulty,
            exclude_ids=state.answered_question_ids,
        )
        next_question = _format_question(next_q) if next_q else None
        # If still no question, session is complete
        if not next_question:
            is_last = True

    result = {
        "answer_id": answer_record["id"],
        "is_correct": is_correct,
        "score": score,
        "next_question": next_question,
        "progress": {
            "current": state.question_count + 1,  # next question number
            "total": max_q,
        },
        "questions_answered": state.question_count,
        "total_questions": max_q,
        "is_last": is_last,
    }
    if agent_feedback:
        result["agent_feedback"] = agent_feedback
    return result


async def complete_session(session_id: str) -> dict:
    """
    Finalize an assessment session:
    1. Compute ability level + score
    2. Update session record
    3. Generate a basic rule-based report
    Returns: { session, report_data }
    """
    session = await db.get_assessment_session(session_id)
    if not session:
        raise ValueError("Session not found")

    answers = await db.get_session_answers(session_id)
    if not answers:
        raise ValueError("No answers found")

    # Compute stats
    stats = compute_session_stats(session, answers)

    # Update session with final results
    updated_session = await db.update_assessment_session(
        session_id,
        status="completed",
        completed_at=datetime.now(timezone.utc),
        total_questions=stats["total"],
        correct_count=stats["correct"],
        final_score=stats["score"],
        ability_level=stats["ability_level"],
        grade_equivalent=stats["grade_equivalent"],
        time_spent_sec=stats["total_time_sec"],
    )

    # Create report
    report = await db.create_assessment_report(
        session_id=session_id,
        user_id=session.get("user_id"),
        report_data=stats,
        summary_zh=stats.get("summary_zh"),
        summary_en=stats.get("summary_en"),
        recommendations=stats.get("recommendations"),
    )

    return {
        "session": updated_session,
        "report": report,
    }


# ---------------------------------------------------------------------------
# 统计计算
# ---------------------------------------------------------------------------


def compute_session_stats(session: dict, answers: list[dict]) -> dict:
    """Compute comprehensive stats from a completed assessment session."""
    total = len(answers)
    # Only count rule-scored answers for correct_count
    scored = [a for a in answers if a.get("is_correct") is not None]
    correct = sum(1 for a in scored if a["is_correct"])
    accuracy = correct / len(scored) if scored else 0.0

    # Ability estimation using difficulty history
    difficulty_history = [a["difficulty_at"] or a.get("difficulty", 0.5) for a in answers]
    correct_history = [bool(a.get("is_correct", False)) for a in answers]

    # Build a minimal CAT state for ability estimation
    state = CATState(
        subject=session["subject"],
        grade_level=session["grade_level"],
        assessment_type=session["assessment_type"],
        difficulty_history=difficulty_history,
        correct_history=correct_history,
        question_count=total,
    )
    ability = estimate_ability(state)
    score = ability_to_score(ability)
    grade_eq = ability_to_grade_equivalent(ability, session["grade_level"])
    label_en, label_zh = ability_to_label(ability)

    # Topic-level breakdown
    topic_stats: dict[str, dict] = {}
    for a in answers:
        topic = a.get("topic", "unknown")
        if topic not in topic_stats:
            topic_stats[topic] = {"total": 0, "correct": 0, "difficulties": []}
        topic_stats[topic]["total"] += 1
        if a.get("is_correct"):
            topic_stats[topic]["correct"] += 1
        topic_stats[topic]["difficulties"].append(a.get("difficulty_at", 0.5))

    topic_scores = {}
    weak_topics = []
    strong_topics = []
    for topic, ts in topic_stats.items():
        topic_acc = ts["correct"] / ts["total"] if ts["total"] > 0 else 0
        topic_scores[topic] = {
            "correct": ts["correct"],
            "total": ts["total"],
            "accuracy": round(topic_acc * 100, 1),
        }
        if topic_acc < 0.5:
            weak_topics.append(topic)
        elif topic_acc >= 0.75:
            strong_topics.append(topic)

    total_time = sum(a.get("time_spent_sec", 0) or 0 for a in answers)

    # Build summaries
    summary_zh = (
        f"共完成 {total} 道题，正确率 {accuracy:.0%}。"
        f"综合能力评估：{label_zh}（{score:.0f}/100）。"
        f"年级对齐：{grade_eq}。"
    )
    summary_en = (
        f"Completed {total} questions with {accuracy:.0%} accuracy. "
        f"Overall ability: {label_en} ({score:.0f}/100). "
        f"Grade alignment: {grade_eq}."
    )

    # Basic recommendations
    recommendations = _generate_recommendations(
        session["subject"], session["grade_level"], weak_topics, strong_topics, ability
    )

    return {
        "total": total,
        "correct": correct,
        "accuracy": round(accuracy, 3),
        "ability_level": round(ability, 3),
        "score": score,
        "grade_equivalent": grade_eq,
        "ability_label_en": label_en,
        "ability_label_zh": label_zh,
        "topic_scores": topic_scores,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "total_time_sec": total_time,
        "summary_zh": summary_zh,
        "summary_en": summary_en,
        "recommendations": recommendations,
    }


# ---------------------------------------------------------------------------
# 内部辅助
# ---------------------------------------------------------------------------


def _rebuild_cat_state(session: dict, answers: list[dict], max_q: int) -> CATState:
    """Reconstruct CAT state from session + existing answers."""
    state = CATState(
        subject=session["subject"],
        grade_level=session["grade_level"],
        assessment_type=session["assessment_type"],
        max_questions=max_q,
    )

    for a in answers:
        state.answered_question_ids.append(a["question_id"])
        state.difficulty_history.append(a.get("difficulty_at") or a.get("difficulty", 0.5))
        is_c = a.get("is_correct")
        state.correct_history.append(bool(is_c) if is_c is not None else True)
        state.question_count += 1

        if is_c is not None:
            state.current_difficulty = compute_next_difficulty(state, is_c)

    return state


def _format_question(q: dict | None, lang: str = "zh") -> dict | None:
    """Format a question for the frontend.

    Returns a flat structure the quiz UI expects:
    { id, stem, options: [{key, text}], type, image_url?, topic, difficulty }
    """
    if not q:
        return None
    content_zh = q.get("content_zh") or {}
    content_en = q.get("content_en") or {}
    if isinstance(content_zh, str):
        content_zh = json.loads(content_zh)
    if isinstance(content_en, str):
        content_en = json.loads(content_en)

    # Primary / fallback language
    primary = content_zh if lang.startswith("zh") else content_en
    fallback = content_en if lang.startswith("zh") else content_zh
    stem = primary.get("stem") or fallback.get("stem", "")

    # Convert raw options list ["A. foo", "B. bar"] → [{key, text}]
    raw_options = primary.get("options") or fallback.get("options")
    options = None
    if raw_options and isinstance(raw_options, list):
        options = []
        for opt in raw_options:
            opt_str = str(opt)
            # Handle "A. text" or "A) text" format
            if len(opt_str) >= 2 and opt_str[1] in (".", ")", " "):
                key = opt_str[0].upper()
                text = opt_str[2:].strip().lstrip(". ")
            else:
                key = opt_str[0].upper() if opt_str else ""
                text = opt_str
            options.append({"key": key, "text": text})

    images = primary.get("images") or fallback.get("images")

    return {
        "id": q["id"],
        "type": q["question_type"],  # "mcq" | "fill_in"
        "stem": stem,
        "options": options,
        "image_url": images[0] if images else None,
        "topic": q["topic"],
        "difficulty_label": _difficulty_to_label(q["difficulty"]),
    }


def _difficulty_to_label(d: float) -> str:
    if d < 0.3:
        return "easy"
    elif d < 0.6:
        return "medium"
    else:
        return "hard"


def _generate_recommendations(
    subject: str,
    grade_level: str,
    weak_topics: list[str],
    strong_topics: list[str],
    ability: float,
) -> list[dict]:
    """Generate basic rule-based study recommendations."""
    recs = []

    if weak_topics:
        recs.append({
            "type": "weakness",
            "priority": "high",
            "title_zh": f"重点提升：{', '.join(weak_topics[:3])}",
            "title_en": f"Focus areas: {', '.join(weak_topics[:3])}",
            "description_zh": f"建议每周安排 3 次专项练习，针对薄弱知识点进行强化训练。",
            "description_en": f"Schedule 3 focused practice sessions per week targeting weak areas.",
        })

    if strong_topics:
        recs.append({
            "type": "strength",
            "priority": "low",
            "title_zh": f"保持优势：{', '.join(strong_topics[:3])}",
            "title_en": f"Maintain strengths: {', '.join(strong_topics[:3])}",
            "description_zh": "继续保持，可以尝试更高难度的题目来进一步提升。",
            "description_en": "Keep up the good work. Try more challenging problems to push further.",
        })

    if ability < 0.4:
        recs.append({
            "type": "foundation",
            "priority": "high",
            "title_zh": f"建议回顾 {grade_level} 前置基础知识",
            "title_en": f"Review prerequisite knowledge before {grade_level}",
            "description_zh": "当前基础尚有差距，建议先巩固前一年级核心知识点。",
            "description_en": "Foundation gaps detected. Recommend consolidating prior grade core concepts.",
        })

    if ability >= 0.7:
        recs.append({
            "type": "challenge",
            "priority": "medium",
            "title_zh": "可以尝试 AP 预备内容",
            "title_en": "Ready for AP-level preparation",
            "description_zh": "当前水平优秀，建议开始接触 AP 预备内容以保持学术挑战。",
            "description_en": "Strong performance. Consider starting AP preparatory material for academic challenge.",
        })

    recs.append({
        "type": "tutoring",
        "priority": "medium",
        "title_zh": "开始 BasisPilot AI 辅导",
        "title_en": "Start BasisPilot AI Tutoring",
        "description_zh": "根据测评结果，BasisPilot 可为你制定个性化学习计划，随时答疑解惑。",
        "description_en": "Based on your assessment, BasisPilot can create a personalized study plan with on-demand tutoring.",
    })

    return recs
