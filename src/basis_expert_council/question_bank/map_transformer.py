"""
MAP 题库格式转换器 — 将 MAP 扩展题库转换为 assessment_questions 导入格式

MAP 源格式 (data/map_questions_bank_expanded.json):
  { id, grade, subject, topic, question, options: [{label, text}], correct_answer, explanation }

目标格式 (assessment_questions 表):
  { subject, grade_level, topic, subtopic, difficulty, question_type, content_zh, content_en,
    explanation_en, explanation_zh, tags, source, source_detail, curriculum_code, review_status }
"""

import json
from pathlib import Path

# ---------------------------------------------------------------------------
# 映射表
# ---------------------------------------------------------------------------

# MAP subject → assessment_questions subject
SUBJECT_MAP = {
    "math": "math",
    "reading": "english",
    "language_usage": "english",
}

# MAP grade → assessment grade_level
GRADE_MAP = {
    "K-1": "G1",
    "G2": "G2", "G3": "G3", "G4": "G4", "G5": "G5", "G6": "G6",
    "G7": "G7", "G8": "G8", "G9": "G9", "G10": "G10", "G11": "G11", "G12": "G12",
}

# 年级 → 默认基础难度 (CAT 0.0-1.0 标度)
GRADE_BASE_DIFFICULTY = {
    "G1": 0.20, "G2": 0.25, "G3": 0.30, "G4": 0.35, "G5": 0.40,
    "G6": 0.45, "G7": 0.50, "G8": 0.55, "G9": 0.60, "G10": 0.65,
    "G11": 0.70, "G12": 0.75,
}

# MAP reading/language_usage 下的 topic → subtopic 映射
TOPIC_SUBTOPIC_MAP = {
    # Reading topics
    "punctuation": ("reading_mechanics", "punctuation"),
    "synonyms": ("vocabulary", "synonyms"),
    "irregular_plurals": ("vocabulary", "irregular_forms"),
    "superlatives": ("grammar", "comparatives_superlatives"),
    "text_types": ("reading_comp", "text_features"),
    "conflict_resolution": ("reading_comp", "plot_analysis"),
    "text_type_identification": ("reading_comp", "genre_identification"),
    "index_reference": ("reading_comp", "text_features"),
    "text_features": ("reading_comp", "text_features"),
    "antonyms": ("vocabulary", "antonyms"),
    "best_title": ("reading_comp", "main_idea"),
    "common_themes": ("reading_comp", "theme"),
    "vocabulary_in_context": ("vocabulary", "context_clues"),
    "theme": ("reading_comp", "theme"),
    "authors_purpose": ("reading_comp", "authors_purpose"),
    "prefix_meaning": ("vocabulary", "word_parts"),
    "figurative_language": ("reading_comp", "figurative_language"),
    "point_of_view": ("reading_comp", "point_of_view"),
    "informational_text": ("reading_comp", "informational"),
    "vocabulary": ("vocabulary", "general"),
    "narrative_poetry": ("reading_comp", "poetry"),
    "tone_analysis": ("reading_comp", "tone_mood"),
    "greek_roots": ("vocabulary", "word_parts"),
    "authors_technique": ("reading_comp", "authors_craft"),
    "poetry_form": ("reading_comp", "poetry"),
    "characterization": ("reading_comp", "characterization"),
    "textual_evidence": ("reading_comp", "text_evidence"),
    "causal_relationships": ("reading_comp", "text_structure"),
    "thematic_synthesis": ("reading_comp", "theme"),
    "dual_text_comparison": ("reading_comp", "compare_contrast"),
    "rhetorical_strategy": ("reading_comp", "rhetoric"),
    "chart_analysis": ("reading_comp", "data_interpretation"),
    "word_analysis": ("vocabulary", "word_analysis"),
    "central_contrast": ("reading_comp", "theme"),
    "imagery_analysis": ("reading_comp", "figurative_language"),
    # Language Usage topics
    "contractions": ("grammar", "contractions"),
    "plural_agreement": ("grammar", "agreement"),
    "sentence_structure": ("grammar", "sentence_structure"),
    "supporting_details": ("writing", "supporting_details"),
    "plural_spelling": ("grammar", "plurals"),
    "verb_tense": ("grammar", "verb_tense"),
    "word_order": ("grammar", "sentence_structure"),
    "concluding_sentence": ("writing", "paragraph_structure"),
    "plural_rules": ("grammar", "plurals"),
    "proper_nouns": ("grammar", "parts_of_speech"),
    "subject_identification": ("grammar", "parts_of_speech"),
    "research_writing": ("writing", "research"),
    "quotation_punctuation": ("grammar", "punctuation"),
    "pronoun_usage": ("grammar", "pronouns"),
    "independent_clauses": ("grammar", "clauses"),
    "topic_sentences": ("writing", "paragraph_structure"),
    "capitalization": ("grammar", "capitalization"),
    "adjective_modification": ("grammar", "parts_of_speech"),
    "independent_dependent_clauses": ("grammar", "clauses"),
    "thesis_statements": ("writing", "thesis"),
    "sentence_function": ("grammar", "sentence_structure"),
    "sentence_clarity": ("writing", "revision"),
    "sentence_combining": ("writing", "sentence_combining"),
    "pronoun_antecedent_agreement": ("grammar", "agreement"),
    "spelling": ("grammar", "spelling"),
    "source_evaluation": ("writing", "research"),
    "active_voice": ("grammar", "voice"),
    "object_pronouns": ("grammar", "pronouns"),
    "punctuation_accuracy": ("grammar", "punctuation"),
    "misplaced_modifiers": ("grammar", "modifiers"),
    "concluding_sentences": ("writing", "paragraph_structure"),
    "semicolons_in_lists": ("grammar", "punctuation"),
    "modifier_placement": ("grammar", "modifiers"),
    "transitions": ("writing", "transitions"),
    "word_choice_tone": ("writing", "word_choice"),
    "descriptive_revision": ("writing", "revision"),
    "direct_address_punctuation": ("grammar", "punctuation"),
    "active_verbs": ("grammar", "parts_of_speech"),
    "compound_sentences": ("grammar", "sentence_structure"),
    "organizational_patterns": ("writing", "text_structure"),
}


def map_difficulty(grade: str, topic: str, position_in_grade: int, total_in_grade: int) -> float:
    """根据年级和题目在该年级中的位置推算难度值"""
    base = GRADE_BASE_DIFFICULTY.get(grade, 0.5)
    # 同一年级内，题目按序号有 ±0.15 的难度波动
    spread = 0.15
    if total_in_grade > 1:
        offset = (position_in_grade / (total_in_grade - 1) - 0.5) * 2 * spread
    else:
        offset = 0
    difficulty = round(max(0.1, min(0.9, base + offset)), 2)
    return difficulty


def transform_options(options: list[dict]) -> list[str]:
    """将 [{label: "A", text: "xxx"}] 转换为 ["A. xxx"]"""
    return [f"{opt['label']}. {opt['text']}" for opt in options]


def get_tags(q: dict) -> list[str]:
    """从 MAP 题目生成带前缀的标签 (保留遗留标签以保持向后兼容)"""
    topic = q.get("topic", "general")
    subject = q.get("subject", "math")
    grade = GRADE_MAP.get(q.get("grade", ""), "G7")

    tags = []
    # Legacy tags (backward compatibility)
    tags.append(topic)
    if subject in ("reading", "language_usage"):
        tags.append(f"map_{subject}")
    tags.append("map_style")

    # Prefixed tags
    tags.append("test:map_growth")

    # Subject-based cognitive skill prefix
    if subject == "math":
        skill_map = {
            "addition_word_problem": "skill:quantitative_reasoning.number_sense",
            "subtraction": "skill:quantitative_reasoning.number_sense",
            "multiplication": "skill:quantitative_reasoning.number_sense",
            "division": "skill:quantitative_reasoning.number_sense",
            "fractions": "skill:quantitative_reasoning.number_sense",
            "decimals": "skill:quantitative_reasoning.number_sense",
            "ratio_proportion": "skill:quantitative_reasoning.proportional_thinking",
            "percentages": "skill:quantitative_reasoning.proportional_thinking",
            "algebra": "skill:quantitative_reasoning.algebraic_thinking",
            "linear_equations": "skill:quantitative_reasoning.algebraic_thinking",
            "quadratics": "skill:quantitative_reasoning.algebraic_thinking",
            "geometry": "skill:quantitative_reasoning.spatial_reasoning",
            "data_analysis": "skill:quantitative_reasoning.data_analysis",
            "statistics": "skill:quantitative_reasoning.statistical_reasoning",
            "probability": "skill:quantitative_reasoning.statistical_reasoning",
        }
        if topic in skill_map:
            tags.append(skill_map[topic])
    elif subject in ("reading", "language_usage"):
        mapped = TOPIC_SUBTOPIC_MAP.get(topic)
        if mapped:
            parent_topic = mapped[0]
            if parent_topic == "reading_comp":
                tags.append("skill:reading_comprehension.inferential_comprehension")
            elif parent_topic == "vocabulary":
                tags.append("skill:reading_comprehension.vocabulary_knowledge")
            elif parent_topic == "grammar":
                tags.append("skill:language_mechanics.grammar_usage")
            elif parent_topic == "writing":
                tags.append("skill:language_mechanics.sentence_construction")

    # Context type guess
    if "word_problem" in topic or "real" in topic:
        tags.append("context:contextual")
    else:
        tags.append("context:abstract")

    return tags


def transform_question(q: dict, position: int, total: int) -> dict:
    """将单个 MAP 题目转换为 assessment_questions 格式"""
    grade = GRADE_MAP.get(q["grade"], q["grade"])
    subject = SUBJECT_MAP.get(q["subject"], q["subject"])
    topic_raw = q.get("topic", "general")

    # 获取 topic/subtopic 映射
    if subject == "math":
        topic = topic_raw
        subtopic = None
    else:
        mapped = TOPIC_SUBTOPIC_MAP.get(topic_raw, (topic_raw, None))
        topic = mapped[0]
        subtopic = mapped[1]

    difficulty = map_difficulty(grade, topic_raw, position, total)
    options_formatted = transform_options(q.get("options", []))
    answer = q.get("correct_answer", "")

    # 处理多选题 (correct_answer 含逗号)
    if "," in answer:
        answer = answer.replace(" ", "")

    content_en = {
        "stem": q["question"],
        "options": options_formatted,
        "answer": answer,
    }

    # content_zh: MAP 题目是英文的，stem 标注来源
    content_zh = {
        "stem": q["question"],  # 英文原题 (MAP 考试本身就是英文)
        "options": options_formatted,
        "answer": answer,
    }

    return {
        "subject": subject,
        "grade_level": grade,
        "topic": topic,
        "subtopic": subtopic,
        "difficulty": difficulty,
        "question_type": "mcq",
        "content_en": content_en,
        "content_zh": content_zh,
        "explanation_en": q.get("explanation", ""),
        "explanation_zh": q.get("explanation", ""),
        "tags": get_tags(q),
        "source": "map_testprep",
        "source_year": 2026,
        "source_detail": f"MAP-style question {q.get('id', '')} (TestPrep-Online seed + AI expansion)",
        "review_status": "draft" if q["id"].endswith(("101", "102", "103", "104", "105")) else "approved",
        "metadata": {
            "original_id": q.get("id"),
            "original_subject": q.get("subject"),
            "original_grade": q.get("grade"),
            "original_topic": q.get("topic"),
            "is_seed": not any(c.isdigit() and int(c) > 0 for c in q.get("id", "")[-3:] if c.isdigit()) if False else q.get("id", "").split("-")[-1].lstrip("0").isdigit() and int(q.get("id", "XXX-000").split("-")[-1]) < 100,
        },
    }


def transform_batch(
    map_questions: list[dict],
    batch_name: str = "MAP Question Bank Expansion 2026",
) -> dict:
    """将整批 MAP 题目转换为可导入的 JSON 格式"""

    # 按 grade 分组计算位置
    from collections import defaultdict
    grade_groups = defaultdict(list)
    for q in map_questions:
        grade_groups[q["grade"]].append(q)

    # 转换每道题
    transformed = []
    for grade, questions in grade_groups.items():
        for i, q in enumerate(questions):
            transformed.append(transform_question(q, i, len(questions)))

    return {
        "batch_name": batch_name,
        "source": "map_testprep",
        "source_year": 2026,
        "questions": transformed,
    }


def transform_by_subject_grade(map_questions: list[dict]) -> dict[str, dict]:
    """按 subject + grade 拆分成多个导入批次，写入 data/question_banks/ 目录结构"""
    from collections import defaultdict

    buckets = defaultdict(list)
    for q in map_questions:
        grade = GRADE_MAP.get(q["grade"], q["grade"])
        subject = SUBJECT_MAP.get(q["subject"], q["subject"])
        buckets[(subject, grade)].append(q)

    batches = {}
    for (subject, grade), questions in sorted(buckets.items()):
        batch_name = f"MAP_{subject}_{grade}_2026"
        transformed = []
        for i, q in enumerate(questions):
            transformed.append(transform_question(q, i, len(questions)))

        batches[f"{subject}/{grade}"] = {
            "batch_name": batch_name,
            "source": "map_testprep",
            "source_year": 2026,
            "subject": subject,
            "grade_level": grade,
            "questions": transformed,
        }
    return batches


# ---------------------------------------------------------------------------
# CLI 入口
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(description="MAP → assessment_questions 格式转换")
    parser.add_argument(
        "input", nargs="?",
        default="data/map_questions_bank_expanded.json",
        help="MAP 题库 JSON 文件路径 (默认: data/map_questions_bank_expanded.json)",
    )
    parser.add_argument(
        "--output-single", "-o",
        default="data/question_banks/map_import_all.json",
        help="合并输出路径",
    )
    parser.add_argument(
        "--output-dir", "-d",
        default="data/question_banks",
        help="按 subject/grade 拆分输出目录",
    )
    parser.add_argument(
        "--split", action="store_true",
        help="按 subject/grade 拆分输出",
    )
    args = parser.parse_args()

    # 读取 MAP 源文件
    input_path = Path(args.input)
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data.get("questions", data if isinstance(data, list) else [])
    print(f"读取 {len(questions)} 道 MAP 题目 from {input_path}")

    if args.split:
        # 拆分模式
        batches = transform_by_subject_grade(questions)
        output_dir = Path(args.output_dir)
        for key, batch in batches.items():
            out_path = output_dir / key / f"map_questions.json"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(batch, f, indent=2, ensure_ascii=False)
            print(f"  {key}: {len(batch['questions'])} 题 → {out_path}")
        print(f"\n拆分输出 {len(batches)} 个批次到 {output_dir}/")
    else:
        # 合并模式
        batch = transform_batch(questions)
        out_path = Path(args.output_single)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(batch, f, indent=2, ensure_ascii=False)
        print(f"合并输出 {len(batch['questions'])} 题 → {out_path}")

    # 校验报告
    from .validator import validate_batch as validate
    batch = transform_batch(questions)
    result = validate(batch["questions"])
    if result.valid:
        print(f"\n校验通过! {len(batch['questions'])} 题全部合格")
    else:
        print(f"\n校验有 {len(result.errors)} 个错误:")
        for e in result.errors[:10]:
            print(f"  - {e}")
    if result.warnings:
        print(f"警告 ({len(result.warnings)}):")
        for w in result.warnings[:5]:
            print(f"  - {w}")


if __name__ == "__main__":
    main()
