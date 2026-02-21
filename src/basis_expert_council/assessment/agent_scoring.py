"""
Agent-based scoring for subjective questions (short_answer, essay, experiment).

Calls the LLM via OpenAI-compatible API to evaluate student answers and return
a structured score + feedback.
"""

import json
import logging
import os
import re

import httpx

logger = logging.getLogger("basis.assessment.agent_scoring")

# LLM config (same as subagent model, stripped of "openai:" prefix)
_RAW_MODEL = os.getenv("BASIS_SUBAGENT_MODEL", "openai:minimax/minimax-m2.5")
SCORING_MODEL = _RAW_MODEL.removeprefix("openai:")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Timeout for LLM scoring call
SCORING_TIMEOUT = int(os.getenv("BASIS_SCORING_TIMEOUT", "30"))


def _build_scoring_prompt(
    question: dict,
    user_answer: str,
    lang: str = "zh",
) -> str:
    """Build a scoring prompt for the LLM."""
    content = question.get("content_zh") or question.get("content_en") or {}
    if isinstance(content, str):
        content = json.loads(content)

    stem = content.get("stem", "")
    expected = content.get("answer", "")
    rubric = content.get("rubric", "")
    q_type = question.get("question_type", "short_answer")

    explanation_zh = question.get("explanation_zh", "")
    explanation_en = question.get("explanation_en", "")
    explanation = explanation_zh or explanation_en

    type_label = {
        "short_answer": "简答题",
        "essay": "论述题",
        "experiment": "实验设计题",
    }.get(q_type, "开放题")

    prompt = f"""你是一位专业的 BASIS 国际学校学科阅卷老师。请根据以下信息为学生的答案评分。

## 题目信息
- 题型: {type_label}
- 题干: {stem}
- 参考答案: {expected or '无标准答案，请根据题目要求评判'}
- 评分标准: {rubric or '根据答案的完整性、准确性和逻辑性综合评判'}
- 解析: {explanation or '无'}

## 学生答案
{user_answer}

## 评分要求
请严格按以下 JSON 格式输出，不要输出其他内容:

```json
{{
  "score": <0.0 到 1.0 的浮点数，表示得分率>,
  "is_correct": <true 或 false，得分率 >= 0.6 视为正确>,
  "feedback_zh": "<中文评语，50-150 字，指出优缺点和改进建议>",
  "feedback_en": "<英文评语，简洁版>"
}}
```

评分标准:
- 1.0 = 完美回答，覆盖所有要点
- 0.8 = 大部分正确，有少量遗漏
- 0.6 = 基本正确，但有明显不足
- 0.4 = 部分正确，关键点缺失
- 0.2 = 有一定思路但基本错误
- 0.0 = 完全错误或答非所问"""

    return prompt


def _parse_scoring_response(text: str) -> dict:
    """Parse the LLM response into structured scoring data."""
    # Try to extract JSON from the response
    # Look for ```json ... ``` block first
    json_match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass

    # Try to find any JSON object in the text
    json_match = re.search(r"\{[^{}]*\"score\"[^{}]*\}", text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass

    # Last resort: try the whole text
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Failed to parse — return a conservative fallback
    logger.warning(f"Failed to parse LLM scoring response: {text[:200]}")
    return {
        "score": 0.5,
        "is_correct": False,
        "feedback_zh": "系统评分暂时不可用，请等待人工审核。",
        "feedback_en": "Automated scoring temporarily unavailable. Pending manual review.",
    }


async def score_subjective_question(
    question: dict,
    user_answer: str | dict,
) -> tuple[bool, float, str]:
    """
    Score a subjective question using the LLM.

    Args:
        question: question dict from DB (with content_zh/en, explanation, etc.)
        user_answer: student's answer (string or dict with "text" key)

    Returns:
        (is_correct, score, feedback) where:
        - is_correct: bool (score >= 0.6)
        - score: float 0-1
        - feedback: combined zh+en feedback string
    """
    # Normalize user_answer to string
    if isinstance(user_answer, dict):
        answer_text = user_answer.get("text", str(user_answer))
    elif isinstance(user_answer, str):
        try:
            parsed = json.loads(user_answer)
            answer_text = parsed.get("text", user_answer) if isinstance(parsed, dict) else user_answer
        except (json.JSONDecodeError, TypeError):
            answer_text = user_answer
    else:
        answer_text = str(user_answer)

    # Empty answer = zero score
    if not answer_text or not answer_text.strip():
        return False, 0.0, "未作答 / No answer provided"

    prompt = _build_scoring_prompt(question, answer_text)

    try:
        async with httpx.AsyncClient(timeout=SCORING_TIMEOUT) as client:
            resp = await client.post(
                f"{OPENAI_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": SCORING_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                    "max_tokens": 500,
                },
            )

            if resp.status_code != 200:
                logger.error(f"LLM scoring API error: {resp.status_code} {resp.text[:200]}")
                return _fallback_score(question, answer_text)

            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            if not content:
                logger.warning("LLM scoring returned empty content")
                return _fallback_score(question, answer_text)

            parsed = _parse_scoring_response(content)

            score = max(0.0, min(1.0, float(parsed.get("score", 0.5))))
            is_correct = parsed.get("is_correct", score >= 0.6)
            feedback_zh = parsed.get("feedback_zh", "")
            feedback_en = parsed.get("feedback_en", "")

            # Combine feedback
            feedback = feedback_zh
            if feedback_en:
                feedback = f"{feedback_zh}\n\n{feedback_en}" if feedback_zh else feedback_en

            return bool(is_correct), score, feedback

    except httpx.TimeoutException:
        logger.warning("LLM scoring timed out")
        return _fallback_score(question, answer_text)
    except Exception as e:
        logger.error(f"LLM scoring error: {e}")
        return _fallback_score(question, answer_text)


def _fallback_score(question: dict, answer_text: str) -> tuple[bool, float, str]:
    """Fallback scoring when LLM is unavailable — give partial credit."""
    # Simple heuristic: if answer is non-empty and has some length, give partial credit
    length = len(answer_text.strip())
    if length == 0:
        return False, 0.0, "未作答"
    elif length < 10:
        return False, 0.2, "回答过于简短，建议展开论述。\nAnswer too brief, please elaborate."
    elif length < 50:
        return True, 0.5, "已作答，等待详细评分。\nAnswer recorded, pending detailed scoring."
    else:
        return True, 0.6, "已作答，等待详细评分。\nAnswer recorded, pending detailed scoring."
