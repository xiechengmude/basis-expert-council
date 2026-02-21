"""Compute statistics from session answers."""


def compute_session_stats(answers: list[dict], questions_map: dict[int, dict]) -> dict:
    """
    Compute comprehensive assessment statistics.

    Args:
        answers: list of answer records (from DB, with question_id, is_correct, etc.)
        questions_map: {question_id: question_dict} for looking up topic info

    Returns dict with accuracy, topic_scores, weak/strong topics, etc.
    """
    if not answers:
        return {
            "accuracy": 0.0,
            "total_questions": 0,
            "correct_count": 0,
            "avg_time_sec": 0.0,
            "total_time_sec": 0,
            "topic_scores": {},
            "difficulty_progression": [],
            "weak_topics": [],
            "strong_topics": [],
            "grade_equivalent": "N/A",
            "ability_level": 0.5,
            "percentile_estimate": 50,
        }

    total = len(answers)
    correct = sum(1 for a in answers if a.get("is_correct"))
    accuracy = correct / total if total > 0 else 0.0

    times = [a.get("time_spent_sec", 0) or 0 for a in answers]
    total_time = sum(times)
    avg_time = total_time / total if total > 0 else 0.0

    # Topic breakdown
    topic_scores: dict[str, dict] = {}
    for a in answers:
        qid = a.get("question_id")
        q = questions_map.get(qid, {})
        topic = q.get("topic", a.get("topic", "unknown"))

        if topic not in topic_scores:
            topic_scores[topic] = {"correct": 0, "total": 0}
        topic_scores[topic]["total"] += 1
        if a.get("is_correct"):
            topic_scores[topic]["correct"] += 1

    for topic, data in topic_scores.items():
        data["accuracy"] = round(data["correct"] / data["total"], 2) if data["total"] > 0 else 0.0

    # Difficulty progression
    difficulty_progression = [a.get("difficulty_at", 0.5) for a in answers]

    # Ability level: recency-weighted average of last 5 difficulties
    last_diffs = difficulty_progression[-5:]
    if last_diffs:
        weights = list(range(1, len(last_diffs) + 1))
        ability_level = sum(d * w for d, w in zip(last_diffs, weights)) / sum(weights)
    else:
        ability_level = 0.5

    # Weak and strong topics (threshold: < 0.5 weak, >= 0.7 strong)
    weak_topics = [t for t, d in topic_scores.items() if d["accuracy"] < 0.5 and d["total"] >= 2]
    strong_topics = [t for t, d in topic_scores.items() if d["accuracy"] >= 0.7 and d["total"] >= 2]

    # Grade equivalent estimate
    grade_equivalent = _estimate_grade_equivalent(ability_level)

    # Rough percentile
    percentile_estimate = _estimate_percentile(ability_level)

    return {
        "accuracy": round(accuracy, 2),
        "total_questions": total,
        "correct_count": correct,
        "avg_time_sec": round(avg_time, 1),
        "total_time_sec": total_time,
        "topic_scores": topic_scores,
        "difficulty_progression": [round(d, 3) for d in difficulty_progression],
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "grade_equivalent": grade_equivalent,
        "ability_level": round(ability_level, 3),
        "percentile_estimate": percentile_estimate,
    }


def _estimate_grade_equivalent(ability: float) -> str:
    """Map ability level (0-1) to a grade equivalent string."""
    if ability < 0.2:
        return "Below G5"
    elif ability < 0.3:
        return "G5"
    elif ability < 0.4:
        return "G6"
    elif ability < 0.5:
        return "G6.5"
    elif ability < 0.6:
        return "G7"
    elif ability < 0.7:
        return "G7.5"
    elif ability < 0.8:
        return "G8"
    elif ability < 0.9:
        return "G8.5"
    else:
        return "G9+"


def _estimate_percentile(ability: float) -> int:
    """Map ability (0-1) to a rough percentile (1-99)."""
    p = int(ability * 100)
    return max(1, min(99, p))
