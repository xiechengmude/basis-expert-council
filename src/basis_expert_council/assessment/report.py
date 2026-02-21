"""
Two-phase report generation:
  Phase 1 — rule-based stats (instant)
  Phase 2 — agent analysis (async background)
"""

import logging
import os
import secrets

import httpx

from .. import db
from .scoring import compute_session_stats

logger = logging.getLogger("basis.assessment.report")

LANGGRAPH_URL = os.getenv("LANGGRAPH_URL", "http://localhost:5095")


async def generate_report(session_id: str, user_id: int | None = None) -> str:
    """
    Generate a report for a completed session.
    Phase 1: compute stats and create report record immediately.
    Returns report_id. Phase 2 (agent analysis) is launched as background task.
    """
    import asyncio

    # 1. Get session + answers
    session = await db.get_assessment_session(session_id)
    if not session:
        raise ValueError(f"Session {session_id} not found")

    answers = await db.get_session_answers(session_id)

    # 2. Build questions map
    question_ids = list({a["question_id"] for a in answers})
    questions_map: dict[int, dict] = {}
    if question_ids:
        pool = await db.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM assessment_questions WHERE id = ANY($1::int[])",
                question_ids,
            )
            for r in rows:
                questions_map[r["id"]] = dict(r)

    # 3. Compute stats
    stats = compute_session_stats(answers, questions_map)

    # 4. Create report record
    share_token = secrets.token_urlsafe(16)
    report = await db.create_assessment_report(
        session_id=session_id,
        user_id=user_id,
        report_data=stats,
        share_token=share_token,
    )
    report_id = str(report["id"])

    # 5. Launch background agent analysis
    asyncio.create_task(
        _generate_agent_analysis(report_id, stats, dict(session), user_id)
    )

    return report_id


async def _generate_agent_analysis(
    report_id: str, stats: dict, session: dict, user_id: int | None
) -> None:
    """
    Phase 2: Call LangGraph agent for AI-powered analysis.
    Falls back to template-based text on failure.
    """
    try:
        prompt = _build_analysis_prompt(stats, session)
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{LANGGRAPH_URL}/runs",
                json={
                    "assistant_id": "basis_expert_council",
                    "input": {
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    "config": {
                        "configurable": {
                            "user_id": str(user_id) if user_id else None,
                        }
                    },
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                # Extract agent response text
                messages = data.get("output", {}).get("messages", [])
                analysis_text = ""
                for msg in reversed(messages):
                    if msg.get("role") == "assistant" and msg.get("content"):
                        analysis_text = msg["content"]
                        break

                if analysis_text:
                    import json
                    update_data = json.dumps({"agent_analysis": analysis_text})
                    pool = await db.get_pool()
                    async with pool.acquire() as conn:
                        await conn.execute(
                            """UPDATE assessment_reports
                               SET report_data = report_data || $1::jsonb
                               WHERE id = $2""",
                            update_data,
                            report_id,
                        )
                    logger.info(f"Agent analysis saved for report {report_id}")
                    return

        # If we get here, agent call didn't produce useful output
        raise RuntimeError("No useful agent output")

    except Exception as e:
        logger.warning(f"Agent analysis failed for report {report_id}: {e}. Using fallback.")
        import json
        fallback = _generate_fallback_analysis(stats, session)
        update_data = json.dumps({"agent_analysis": fallback})
        pool = await db.get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """UPDATE assessment_reports
                   SET report_data = report_data || $1::jsonb
                   WHERE id = $2""",
                update_data,
                report_id,
            )
        logger.info(f"Fallback analysis saved for report {report_id}")


def _build_analysis_prompt(stats: dict, session: dict) -> str:
    """Build the prompt for the agent to analyze assessment results."""
    subject = session.get("subject", "math")
    grade = session.get("grade_level", "unknown")
    accuracy = stats.get("accuracy", 0)
    total_q = stats.get("total_questions", 0)
    weak = ", ".join(stats.get("weak_topics", [])) or "none identified"
    strong = ", ".join(stats.get("strong_topics", [])) or "none identified"
    grade_eq = stats.get("grade_equivalent", "N/A")

    topic_lines = []
    for topic, data in stats.get("topic_scores", {}).items():
        topic_lines.append(f"  - {topic}: {data['correct']}/{data['total']} ({data['accuracy']:.0%})")
    topic_summary = "\n".join(topic_lines) if topic_lines else "  No data"

    return f"""You are an expert academic advisor at BASIS International School.
A student just completed a {subject} assessment for grade level {grade}.

Results:
- Overall accuracy: {accuracy:.0%} ({stats.get('correct_count', 0)}/{total_q})
- Grade equivalent: {grade_eq}
- Ability level: {stats.get('ability_level', 0.5):.2f}
- Average time per question: {stats.get('avg_time_sec', 0):.1f}s

Topic breakdown:
{topic_summary}

Strong topics: {strong}
Weak topics: {weak}

Please provide:
1. A brief overall assessment (2-3 sentences)
2. Specific strengths to celebrate
3. Areas needing improvement with actionable study recommendations
4. Recommended next steps for the student

Keep the response concise (under 300 words), encouraging, and practical."""


def _generate_fallback_analysis(stats: dict, session: dict) -> str:
    """Template-based fallback when agent is unavailable."""
    accuracy = stats.get("accuracy", 0)
    grade_eq = stats.get("grade_equivalent", "N/A")
    weak = stats.get("weak_topics", [])
    strong = stats.get("strong_topics", [])
    subject = session.get("subject", "math")

    lines = []

    if accuracy >= 0.8:
        lines.append(f"Excellent performance! You demonstrated strong {subject} skills at the {grade_eq} level.")
    elif accuracy >= 0.6:
        lines.append(f"Good job! Your overall performance places you at the {grade_eq} level in {subject}.")
    else:
        lines.append(f"Thank you for completing the assessment. Your current level is {grade_eq} in {subject}.")

    if strong:
        lines.append(f"\nStrengths: You showed solid understanding in {', '.join(strong)}. Keep building on these areas.")

    if weak:
        lines.append(f"\nAreas for improvement: Consider focusing on {', '.join(weak)}. Regular practice with targeted exercises will help strengthen these topics.")
    else:
        lines.append("\nYour performance was balanced across topics. Continue practicing to maintain your skills.")

    lines.append("\nRecommended next steps:")
    lines.append("- Review any questions you found challenging")
    lines.append("- Practice topics where you scored below 70%")
    lines.append("- Consider taking another assessment in 2-4 weeks to track progress")

    return "\n".join(lines)


def _json_escape(text: str) -> str:
    """Escape a string for safe embedding in a JSON value."""
    import json
    return json.dumps(text)
