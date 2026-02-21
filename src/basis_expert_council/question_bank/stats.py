"""
题库统计 — 按年级/学科/难度/来源分布
"""


async def get_stats_report() -> str:
    """生成可读的题库统计报告"""
    from .. import db

    stats = await db.get_question_stats()

    lines = [
        "=" * 50,
        "  BASIS 真题库统计概览",
        "=" * 50,
        f"  总题量: {stats['total']}",
        "",
        "  -- 按学科 --",
    ]
    for subj, cnt in stats["by_subject"].items():
        lines.append(f"    {subj:15s} {cnt:5d}")

    lines.append("")
    lines.append("  -- 按年级 --")
    for grade, cnt in stats["by_grade"].items():
        lines.append(f"    {grade:15s} {cnt:5d}")

    lines.append("")
    lines.append("  -- 按审核状态 --")
    for status, cnt in stats["by_review_status"].items():
        lines.append(f"    {(status or 'null'):15s} {cnt:5d}")

    lines.append("")
    lines.append("  -- 按题型 --")
    for qtype, cnt in stats["by_question_type"].items():
        lines.append(f"    {qtype:15s} {cnt:5d}")

    lines.append("")
    lines.append("  -- 按来源 --")
    for source, cnt in stats["by_source"].items():
        lines.append(f"    {source:15s} {cnt:5d}")

    lines.append("")
    d = stats["difficulty"]
    lines.append(f"  -- 难度分布 --")
    lines.append(f"    平均: {d['avg']:.3f}  最低: {d['min']:.3f}  最高: {d['max']:.3f}")
    lines.append("=" * 50)

    return "\n".join(lines)
