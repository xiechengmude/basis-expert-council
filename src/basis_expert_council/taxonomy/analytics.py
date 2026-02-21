"""
BasisPilot 题目标签体系 — 标签分布统计与覆盖率分析
提供标签维度分布报告和题库覆盖率指标
"""
from __future__ import annotations

import json
import logging
from typing import Any

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# 标签统计报告
# ---------------------------------------------------------------------------


async def get_tag_stats_report() -> str:
    """生成题库标签分布的人类可读报告

    Returns:
        格式化的统计报告字符串
    """
    stats = await _fetch_tag_stats()

    lines: list[str] = [
        "=" * 60,
        "BasisPilot 题目标签统计报告",
        "=" * 60,
        "",
    ]

    # 总览
    total = stats.get("total", 0)
    tagged = stats.get("tagged", 0)
    untagged = total - tagged
    pct = (tagged / total * 100) if total > 0 else 0
    lines.append(f"总题目数: {total}")
    lines.append(f"已打标:   {tagged} ({pct:.1f}%)")
    lines.append(f"未打标:   {untagged}")
    lines.append("")

    # Bloom's 分布
    blooms = stats.get("blooms_distribution", {})
    if blooms:
        lines.append("--- Bloom's Taxonomy 分布 ---")
        bloom_order = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
        for level in bloom_order:
            count = blooms.get(level, 0)
            bar = "#" * min(count, 50)
            lines.append(f"  {level:<12} {count:>5}  {bar}")
        lines.append("")

    # DOK 分布
    dok = stats.get("dok_distribution", {})
    if dok:
        lines.append("--- Webb's DOK 分布 ---")
        for level in [1, 2, 3, 4]:
            count = dok.get(str(level), dok.get(level, 0))
            bar = "#" * min(count, 50)
            lines.append(f"  DOK {level}        {count:>5}  {bar}")
        lines.append("")

    # Difficulty Band 分布
    bands = stats.get("band_distribution", {})
    if bands:
        lines.append("--- Difficulty Band 分布 ---")
        band_order = ["foundational", "basic", "proficient", "advanced", "elite"]
        for band in band_order:
            count = bands.get(band, 0)
            bar = "#" * min(count, 50)
            lines.append(f"  {band:<15} {count:>5}  {bar}")
        lines.append("")

    # Top CCSS codes
    ccss = stats.get("top_ccss_codes", [])
    if ccss:
        lines.append("--- Top 10 CCSS 标准编码 ---")
        for item in ccss[:10]:
            code = item.get("code", "?")
            count = item.get("count", 0)
            lines.append(f"  {code:<15} {count:>5}")
        lines.append("")

    # Top Cognitive Skills
    skills = stats.get("top_cognitive_skills", [])
    if skills:
        lines.append("--- Top 10 认知技能 ---")
        for item in skills[:10]:
            skill = item.get("skill", "?")
            count = item.get("count", 0)
            lines.append(f"  {skill:<40} {count:>5}")
        lines.append("")

    # Misconception 覆盖
    mc_count = stats.get("misconception_coverage", {})
    if mc_count:
        lines.append("--- 误解覆盖 ---")
        lines.append(f"  涉及误解 ID 总数: {mc_count.get('unique_ids', 0)}")
        lines.append(f"  含误解诊断的题目数: {mc_count.get('questions_with_mc', 0)}")
        lines.append("")

    # Taxonomy 版本分布
    versions = stats.get("version_distribution", {})
    if versions:
        lines.append("--- Taxonomy 版本分布 ---")
        for ver, count in versions.items():
            lines.append(f"  v{ver}: {count}")
        lines.append("")

    lines.append("=" * 60)
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# 覆盖率计算
# ---------------------------------------------------------------------------


async def compute_coverage(
    subject: str | None = None,
    grade_level: str | None = None,
) -> dict[str, Any]:
    """计算题库标签覆盖率指标

    Args:
        subject: 按学科过滤（可选）
        grade_level: 按年级过滤（可选）

    Returns:
        覆盖率指标字典:
        - total_questions: 总题数
        - tagged_count: 已打标数
        - coverage_pct: 覆盖率百分比
        - blooms_distribution: Bloom's 各级别计数
        - dok_distribution: DOK 各级别计数
        - band_distribution: 难度带各级别计数
        - ccss_coverage: 涉及的唯一 CCSS 编码数
        - misconception_coverage: 涉及的唯一误解 ID 数
    """
    from .. import db

    pool = await db.get_pool()

    # 构建过滤条件
    conditions: list[str] = []
    params: list[Any] = []
    idx = 1

    if subject:
        conditions.append(f"subject = ${idx}")
        params.append(subject)
        idx += 1

    if grade_level:
        conditions.append(f"grade_level = ${idx}")
        params.append(grade_level)
        idx += 1

    where = " AND ".join(conditions) if conditions else "TRUE"

    async with pool.acquire() as conn:
        # 总题数
        total = await conn.fetchval(
            f"SELECT COUNT(*) FROM assessment_questions WHERE {where}",
            *params,
        )

        # 已打标数
        tagged_where = f"{where} AND metadata->'taxonomy'->>'version' IS NOT NULL"
        tagged_count = await conn.fetchval(
            f"SELECT COUNT(*) FROM assessment_questions WHERE {tagged_where}",
            *params,
        )

        coverage_pct = (tagged_count / total * 100) if total > 0 else 0.0

        # Bloom's 分布
        blooms_rows = await conn.fetch(
            f"""SELECT metadata->'taxonomy'->'blooms'->>'level' AS level, COUNT(*) AS cnt
                FROM assessment_questions
                WHERE {tagged_where}
                GROUP BY level ORDER BY cnt DESC""",
            *params,
        )
        blooms_distribution = {r["level"]: r["cnt"] for r in blooms_rows if r["level"]}

        # DOK 分布
        dok_rows = await conn.fetch(
            f"""SELECT metadata->'taxonomy'->'dok'->>'level' AS level, COUNT(*) AS cnt
                FROM assessment_questions
                WHERE {tagged_where}
                GROUP BY level ORDER BY cnt DESC""",
            *params,
        )
        dok_distribution = {r["level"]: r["cnt"] for r in dok_rows if r["level"]}

        # Band 分布（从 tags 数组提取 band:xxx）
        band_rows = await conn.fetch(
            f"""SELECT t AS tag, COUNT(*) AS cnt
                FROM assessment_questions, unnest(tags) AS t
                WHERE {where} AND t LIKE 'band:%'
                GROUP BY t ORDER BY cnt DESC""",
            *params,
        )
        band_distribution = {
            r["tag"].replace("band:", ""): r["cnt"]
            for r in band_rows
        }

        # CCSS 覆盖（从 tags 数组提取 ccss:xxx 的唯一数量）
        ccss_count = await conn.fetchval(
            f"""SELECT COUNT(DISTINCT t) FROM assessment_questions, unnest(tags) AS t
                WHERE {where} AND t LIKE 'ccss:%'""",
            *params,
        ) or 0

        # 误解覆盖（从 tags 数组提取 mc:xxx 的唯一数量）
        mc_count = await conn.fetchval(
            f"""SELECT COUNT(DISTINCT t) FROM assessment_questions, unnest(tags) AS t
                WHERE {where} AND t LIKE 'mc:%'""",
            *params,
        ) or 0

    return {
        "total_questions": total,
        "tagged_count": tagged_count,
        "coverage_pct": round(coverage_pct, 1),
        "blooms_distribution": blooms_distribution,
        "dok_distribution": dok_distribution,
        "band_distribution": band_distribution,
        "ccss_coverage": ccss_count,
        "misconception_coverage": mc_count,
    }


# ---------------------------------------------------------------------------
# 内部辅助
# ---------------------------------------------------------------------------


async def _fetch_tag_stats() -> dict[str, Any]:
    """从数据库聚合标签统计数据"""
    from .. import db

    pool = await db.get_pool()

    async with pool.acquire() as conn:
        # 总题数
        total = await conn.fetchval("SELECT COUNT(*) FROM assessment_questions")

        # 已打标数
        tagged = await conn.fetchval(
            "SELECT COUNT(*) FROM assessment_questions "
            "WHERE metadata->'taxonomy'->>'version' IS NOT NULL"
        )

        # Bloom's 分布
        blooms_rows = await conn.fetch(
            """SELECT metadata->'taxonomy'->'blooms'->>'level' AS level, COUNT(*) AS cnt
               FROM assessment_questions
               WHERE metadata->'taxonomy'->>'version' IS NOT NULL
               GROUP BY level ORDER BY cnt DESC"""
        )
        blooms_distribution = {r["level"]: r["cnt"] for r in blooms_rows if r["level"]}

        # DOK 分布
        dok_rows = await conn.fetch(
            """SELECT metadata->'taxonomy'->'dok'->>'level' AS level, COUNT(*) AS cnt
               FROM assessment_questions
               WHERE metadata->'taxonomy'->>'version' IS NOT NULL
               GROUP BY level ORDER BY cnt DESC"""
        )
        dok_distribution = {r["level"]: r["cnt"] for r in dok_rows if r["level"]}

        # Band 分布
        band_rows = await conn.fetch(
            """SELECT t AS tag, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'band:%'
               GROUP BY t ORDER BY cnt DESC"""
        )
        band_distribution = {
            r["tag"].replace("band:", ""): r["cnt"]
            for r in band_rows
        }

        # Top CCSS codes
        ccss_rows = await conn.fetch(
            """SELECT t AS tag, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'ccss:%'
               GROUP BY t ORDER BY cnt DESC LIMIT 10"""
        )
        top_ccss = [
            {"code": r["tag"].replace("ccss:", ""), "count": r["cnt"]}
            for r in ccss_rows
        ]

        # Top cognitive skills
        skill_rows = await conn.fetch(
            """SELECT t AS tag, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'skill:%'
               GROUP BY t ORDER BY cnt DESC LIMIT 10"""
        )
        top_skills = [
            {"skill": r["tag"].replace("skill:", ""), "count": r["cnt"]}
            for r in skill_rows
        ]

        # Misconception 覆盖
        mc_unique = await conn.fetchval(
            """SELECT COUNT(DISTINCT t)
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'mc:%'"""
        ) or 0
        mc_questions = await conn.fetchval(
            """SELECT COUNT(DISTINCT id)
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'mc:%'"""
        ) or 0

        # Taxonomy 版本分布
        version_rows = await conn.fetch(
            """SELECT metadata->'taxonomy'->>'version' AS ver, COUNT(*) AS cnt
               FROM assessment_questions
               WHERE metadata->'taxonomy'->>'version' IS NOT NULL
               GROUP BY ver ORDER BY cnt DESC"""
        )
        version_distribution = {r["ver"]: r["cnt"] for r in version_rows if r["ver"]}

    return {
        "total": total,
        "tagged": tagged,
        "blooms_distribution": blooms_distribution,
        "dok_distribution": dok_distribution,
        "band_distribution": band_distribution,
        "top_ccss_codes": top_ccss,
        "top_cognitive_skills": top_skills,
        "misconception_coverage": {
            "unique_ids": mc_unique,
            "questions_with_mc": mc_questions,
        },
        "version_distribution": version_distribution,
    }
