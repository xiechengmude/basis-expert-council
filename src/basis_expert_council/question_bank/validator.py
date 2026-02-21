"""
题目格式校验器 — 确保每道题满足入库标准
"""

from dataclasses import dataclass, field

VALID_SUBJECTS = {"math", "english", "science", "chinese", "physics", "chemistry", "biology", "history", "reading", "language_usage"}
VALID_GRADE_LEVELS = {f"G{i}" for i in range(1, 13)}
VALID_QUESTION_TYPES = {"mcq", "fill_in", "short_answer", "essay", "experiment"}
VALID_REVIEW_STATUSES = {"draft", "reviewed", "approved", "archived"}
VALID_SOURCES = {"basis_exam", "ap_exam", "sat", "custom", "seed", "map_testprep"}
DIFFICULTY_RANGE = (0.05, 0.95)
STEM_MIN_LENGTH = 5


@dataclass
class ValidationResult:
    valid: bool = True
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def add_error(self, msg: str):
        self.valid = False
        self.errors.append(msg)

    def add_warning(self, msg: str):
        self.warnings.append(msg)


def validate_question(q: dict, index: int | None = None) -> ValidationResult:
    """校验单道题目，返回 ValidationResult"""
    result = ValidationResult()
    prefix = f"Q#{index}" if index is not None else "Q"

    # --- 必填字段 ---
    required = ["subject", "grade_level", "topic", "question_type", "content_zh"]
    for f in required:
        if not q.get(f):
            result.add_error(f"{prefix}: 缺少必填字段 '{f}'")

    if not result.valid:
        return result

    # --- subject ---
    if q["subject"] not in VALID_SUBJECTS:
        result.add_error(f"{prefix}: 无效学科 '{q['subject']}', 可选: {VALID_SUBJECTS}")

    # --- grade_level ---
    if q["grade_level"] not in VALID_GRADE_LEVELS:
        result.add_error(f"{prefix}: 无效年级 '{q['grade_level']}', 可选: G1-G12")

    # --- question_type ---
    if q["question_type"] not in VALID_QUESTION_TYPES:
        result.add_error(f"{prefix}: 无效题型 '{q['question_type']}', 可选: {VALID_QUESTION_TYPES}")

    # --- difficulty ---
    difficulty = q.get("difficulty", 0.5)
    if not isinstance(difficulty, (int, float)):
        result.add_error(f"{prefix}: difficulty 必须是数字")
    elif not (DIFFICULTY_RANGE[0] <= difficulty <= DIFFICULTY_RANGE[1]):
        result.add_warning(f"{prefix}: difficulty={difficulty} 超出推荐范围 {DIFFICULTY_RANGE}")

    # --- content_zh ---
    content = q.get("content_zh", {})
    if isinstance(content, dict):
        stem = content.get("stem", "")
        if len(str(stem)) < STEM_MIN_LENGTH:
            result.add_error(f"{prefix}: content_zh.stem 过短 (最少 {STEM_MIN_LENGTH} 字符)")

        # MCQ 校验
        if q["question_type"] == "mcq":
            options = content.get("options", [])
            answer = content.get("answer", "")

            if not options or not isinstance(options, list):
                result.add_error(f"{prefix}: MCQ 必须包含 options 列表")
            elif len(options) < 3 or len(options) > 5:
                result.add_error(f"{prefix}: MCQ 选项数须 3-5 个，当前 {len(options)} 个")
            else:
                # 去重检查
                option_texts = [str(o).strip().lower() for o in options]
                if len(set(option_texts)) != len(option_texts):
                    result.add_error(f"{prefix}: MCQ 选项有重复")

            if not answer:
                result.add_error(f"{prefix}: MCQ 必须指定 answer")

        # fill_in 校验
        elif q["question_type"] == "fill_in":
            if not content.get("answer"):
                result.add_error(f"{prefix}: fill_in 必须指定 answer")
    else:
        result.add_error(f"{prefix}: content_zh 必须是字典")

    # --- source ---
    source = q.get("source")
    if source and source not in VALID_SOURCES:
        result.add_warning(f"{prefix}: 非标准来源 '{source}', 推荐: {VALID_SOURCES}")

    # --- review_status ---
    status = q.get("review_status")
    if status and status not in VALID_REVIEW_STATUSES:
        result.add_error(f"{prefix}: 无效审核状态 '{status}'")

    return result


def validate_batch(questions: list[dict]) -> ValidationResult:
    """校验一批题目"""
    batch_result = ValidationResult()
    for i, q in enumerate(questions):
        r = validate_question(q, index=i + 1)
        if not r.valid:
            batch_result.valid = False
        batch_result.errors.extend(r.errors)
        batch_result.warnings.extend(r.warnings)
    return batch_result
