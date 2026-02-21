"""
题库导出器 — 导出为 JSON / CSV
"""

import csv
import json
from io import StringIO
from pathlib import Path


async def export_json(
    *,
    subject: str | None = None,
    grade_level: str | None = None,
    review_status: str | None = None,
    output_path: str | None = None,
) -> str:
    """导出题目为 JSON 格式，返回 JSON 字符串"""
    from .. import db

    result = await db.query_questions_paginated(
        subject=subject,
        grade_level=grade_level,
        review_status=review_status,
        page_size=10000,
    )
    questions = result["items"]

    export_data = {
        "batch_name": f"export_{subject or 'all'}_{grade_level or 'all'}",
        "source": "export",
        "subject": subject,
        "grade_level": grade_level,
        "question_count": len(questions),
        "questions": [],
    }

    for q in questions:
        export_q = {
            "id": q["id"],
            "subject": q["subject"],
            "grade_level": q["grade_level"],
            "topic": q["topic"],
            "subtopic": q.get("subtopic"),
            "difficulty": q["difficulty"],
            "question_type": q["question_type"],
            "content_zh": q["content_zh"],
            "content_en": q.get("content_en"),
            "explanation_zh": q.get("explanation_zh"),
            "explanation_en": q.get("explanation_en"),
            "tags": q.get("tags"),
            "source": q.get("source"),
            "source_year": q.get("source_year"),
            "curriculum_code": q.get("curriculum_code"),
            "review_status": q.get("review_status"),
        }
        export_data["questions"].append(export_q)

    json_str = json.dumps(export_data, ensure_ascii=False, indent=2)

    if output_path:
        Path(output_path).write_text(json_str, encoding="utf-8")

    return json_str


async def export_csv(
    *,
    subject: str | None = None,
    grade_level: str | None = None,
    review_status: str | None = None,
    output_path: str | None = None,
) -> str:
    """导出题目为 CSV 格式（教师友好），返回 CSV 字符串"""
    from .. import db

    result = await db.query_questions_paginated(
        subject=subject,
        grade_level=grade_level,
        review_status=review_status,
        page_size=10000,
    )
    questions = result["items"]

    output = StringIO()
    fieldnames = [
        "id", "subject", "grade_level", "topic", "subtopic", "difficulty",
        "question_type", "stem_zh", "stem_en",
        "option_a", "option_b", "option_c", "option_d",
        "answer", "explanation", "tags", "review_status", "source",
    ]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()

    for q in questions:
        content_zh = q.get("content_zh") or {}
        content_en = q.get("content_en") or {}
        if isinstance(content_zh, str):
            content_zh = json.loads(content_zh)
        if isinstance(content_en, str):
            content_en = json.loads(content_en)

        options = content_zh.get("options", [])
        answer = content_zh.get("answer", "")

        row = {
            "id": q["id"],
            "subject": q["subject"],
            "grade_level": q["grade_level"],
            "topic": q["topic"],
            "subtopic": q.get("subtopic", ""),
            "difficulty": q["difficulty"],
            "question_type": q["question_type"],
            "stem_zh": content_zh.get("stem", ""),
            "stem_en": content_en.get("stem", ""),
            "option_a": _extract_option_text(options, 0),
            "option_b": _extract_option_text(options, 1),
            "option_c": _extract_option_text(options, 2),
            "option_d": _extract_option_text(options, 3),
            "answer": answer,
            "explanation": q.get("explanation_zh", ""),
            "tags": ", ".join(q.get("tags") or []),
            "review_status": q.get("review_status", ""),
            "source": q.get("source", ""),
        }
        writer.writerow(row)

    csv_str = output.getvalue()

    if output_path:
        Path(output_path).write_text(csv_str, encoding="utf-8-sig")

    return csv_str


def _extract_option_text(options: list, idx: int) -> str:
    """从选项列表中提取第 idx 个选项的文字"""
    if idx >= len(options):
        return ""
    opt = str(options[idx])
    # Strip leading "A. " / "B. " etc.
    if len(opt) >= 2 and opt[1] in (".", ")", " "):
        return opt[2:].strip().lstrip(". ")
    return opt
