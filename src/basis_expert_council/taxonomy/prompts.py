"""
BasisPilot 题目标签体系 — LLM Prompt 模板
为 QuestionTagger 提供 system / user prompt 及上下文构建
"""
from __future__ import annotations

from .models import TaxonomyBundle

# ---------------------------------------------------------------------------
# System Prompt — 评估专家角色设定
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """\
You are a senior international education assessment expert with deep expertise in:
- Bloom's Revised Taxonomy (Anderson & Krathwohl, 2001)
- Webb's Depth of Knowledge (DOK) framework
- Common Core State Standards (CCSS) alignment for Mathematics and ELA
- Cognitive diagnostic testing and misconception analysis
- NWEA MAP Growth, SAT, ACT, and AP exam frameworks

Your task is to analyze educational assessment questions and tag each one with \
multi-dimensional metadata. You must output **strict JSON** matching the schema below.

## Tagging Dimensions

1. **Bloom's Taxonomy** (`blooms`): Assign one of: remember, understand, apply, analyze, \
evaluate, create. Consider what cognitive process the student must perform to answer correctly. \
"apply" means using a known procedure; "analyze" means decomposing or differentiating; \
"evaluate" means making judgments with criteria.

2. **Webb's DOK** (`dok`): Assign 1-4. DOK 1 = simple recall/recognition; DOK 2 = skill/concept \
requiring two or more steps; DOK 3 = strategic thinking requiring reasoning, planning, or evidence; \
DOK 4 = extended thinking requiring synthesis across sources or time periods.

3. **CCSS Codes** (`ccss_codes`): Provide the most specific applicable Common Core standard codes. \
Use the provided list of available codes for the grade/subject. Leave empty if no standard applies.

4. **Cognitive Skills** (`cognitive_skills`): Identify the primary cognitive skill and up to 3 \
secondary skills from the skill tree provided. Use dot notation for sub-skills \
(e.g., "quantitative_reasoning.algebraic_thinking").

5. **Misconceptions** (`misconceptions`): List misconception IDs that this question could \
diagnose if the student answers incorrectly. In `if_wrong_answer`, map specific wrong answer \
choices (e.g., "A", "B") to misconception IDs that likely explain that error.

6. **RIT Estimate** (`rit_estimate`): Estimate the NWEA MAP Growth RIT score level. Use the \
difficulty bands: foundational (160-190), basic (190-210), proficient (210-230), \
advanced (230-250), elite (250-270).

7. **Learning Objective** (`learning_objective`): Write a concise 1-sentence learning objective \
that this question assesses.

8. **Time Estimate** (`time_estimate_sec`): Estimate seconds needed. Quick (<30s), \
standard (30-90s), extended (90-180s), complex (>180s).

9. **Context Type** (`context_type`): One of: abstract, contextual, real_world, cross_disciplinary.

10. **Test Alignment** (`test_alignment`): Which standardized tests this item aligns with. \
Options: map_growth, sat, act, ap, basis_internal, common_core.

11. **Language Complexity** (`language_complexity`): For ELA/reading items: basic, intermediate, \
advanced, academic. For math/science, set to null unless the reading load is significant.

## Output Rules
- Return a JSON array of objects, one per input question, in the same order.
- Each object must contain all fields from the schema.
- Rationale fields should be concise (1 sentence max).
- If uncertain about a dimension, provide your best estimate with a hedged rationale.
- Never omit required fields; use null or empty arrays/strings for unknown values.
"""

# ---------------------------------------------------------------------------
# User Prompt 模板
# ---------------------------------------------------------------------------

USER_PROMPT_TEMPLATE = """\
Please tag the following {subject} questions for grade level {grade_level}.

## Available Taxonomy Context
{taxonomy_summary}

## Questions to Tag
```json
{questions_json}
```

Return a JSON object with a single key "tagged" whose value is an array of objects, \
one per question above, each containing these fields:
- blooms: {{"level": "<bloom_level>", "rationale": "<1 sentence>"}}
- dok: {{"level": <1-4>, "rationale": "<1 sentence>"}}
- rit_estimate: <int or null>
- ccss_codes: [<string>, ...]
- cognitive_skills: {{"primary": "<skill>", "secondary": ["<skill>", ...]}}
- misconceptions: {{"detectable": ["<mc_id>", ...], "if_wrong_answer": {{"<choice>": "<mc_id>", ...}}}}
- learning_objective: "<1 sentence>"
- time_estimate_sec: <int>
- context_type: "<abstract|contextual|real_world|cross_disciplinary>"
- test_alignment: ["<test_name>", ...]
- language_complexity: "<level or null>"

Respond ONLY with the JSON object. No markdown fences, no explanation.
"""


# ---------------------------------------------------------------------------
# 上下文构建
# ---------------------------------------------------------------------------


def build_taxonomy_context(
    bundle: TaxonomyBundle, subject: str, grade: int
) -> str:
    """根据学科和年级构建 LLM prompt 中的 taxonomy 上下文摘要

    包含:
    - 该年级可用的 CCSS 编码
    - 该学科的误解 ID 列表
    - 该学科的认知技能树

    Args:
        bundle: 已加载的 TaxonomyBundle
        subject: 学科（math/english/science/history 等）
        grade: 年级数字（5-12）

    Returns:
        格式化的上下文字符串
    """
    sections: list[str] = []

    # 1) CCSS 编码
    ccss_subject = "ela" if subject in ("english", "ela", "reading") else "math"
    ccss_dict = bundle.ccss_math if ccss_subject == "math" else bundle.ccss_ela
    grade_codes = [
        code for code, std in ccss_dict.items()
        if std.grade == grade
    ]
    if grade_codes:
        codes_str = ", ".join(sorted(grade_codes)[:30])  # 限制数量避免 prompt 过长
        sections.append(
            f"### Available CCSS Codes for Grade {grade} ({ccss_subject.upper()})\n"
            f"{codes_str}"
        )
    else:
        sections.append(
            f"### CCSS Codes\nNo CCSS codes loaded for Grade {grade} {ccss_subject.upper()}. "
            f"Use your best judgment for ccss_codes field."
        )

    # 2) 误解 ID
    subject_lower = subject.lower()
    relevant_mc = [
        mc for mc in bundle.misconceptions.values()
        if mc.subject.lower() == subject_lower
        or subject_lower in mc.subject.lower()
    ]
    if relevant_mc:
        mc_lines = [f"- {mc.id}: {mc.description_en}" for mc in relevant_mc[:20]]
        sections.append(
            f"### Available Misconception IDs for {subject}\n" + "\n".join(mc_lines)
        )
    else:
        sections.append(
            f"### Misconceptions\nNo misconceptions loaded for {subject}. "
            f"You may use descriptive IDs in format MC-{subject.upper()}-TOPIC-NNN."
        )

    # 3) 认知技能树
    skills_def = bundle.definition.cognitive_skills
    # 根据学科选取相关的技能分支
    subject_skill_map: dict[str, list[str]] = {
        "math": ["quantitative_reasoning"],
        "english": ["reading_comprehension", "language_mechanics"],
        "ela": ["reading_comprehension", "language_mechanics"],
        "reading": ["reading_comprehension"],
        "science": ["scientific_reasoning", "quantitative_reasoning"],
        "physics": ["scientific_reasoning", "quantitative_reasoning"],
        "chemistry": ["scientific_reasoning", "quantitative_reasoning"],
        "biology": ["scientific_reasoning"],
        "history": ["historical_thinking", "reading_comprehension"],
    }
    relevant_branches = subject_skill_map.get(subject_lower, list(skills_def.keys()))

    skill_lines: list[str] = []
    for branch in relevant_branches:
        if branch in skills_def:
            branch_data = skills_def[branch]
            sub_skills = branch_data.get("skills", {})
            skill_names = list(sub_skills.keys()) if isinstance(sub_skills, dict) else []
            skill_lines.append(
                f"- {branch}: {', '.join(skill_names)}"
            )
    if skill_lines:
        sections.append(
            "### Cognitive Skills Tree\n" + "\n".join(skill_lines)
        )

    # 4) Context types & test alignment（简短列出）
    ctx = ", ".join(bundle.definition.context_types)
    tests = ", ".join(bundle.definition.test_alignment)
    sections.append(f"### Context Types: {ctx}")
    sections.append(f"### Test Alignment Options: {tests}")

    return "\n\n".join(sections)
