"""
BasisPilot 题目标签体系 — Pydantic 数据模型
包含 Bloom's Taxonomy、Webb's DOK、CCSS、认知技能、常见误解等多维标签定义
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# 类型别名
# ---------------------------------------------------------------------------

BloomLevel = Literal["remember", "understand", "apply", "analyze", "evaluate", "create"]

DOKLevel = Literal[1, 2, 3, 4]


# ---------------------------------------------------------------------------
# 题目标签主模型
# ---------------------------------------------------------------------------


class QuestionTaxonomyTags(BaseModel):
    """题目多维标签（AI 打标输出格式）"""

    version: str = "1.0"
    tagged_at: datetime | None = None

    # Bloom's Revised Taxonomy
    blooms: dict[str, Any] = Field(
        default_factory=lambda: {"level": "apply", "rationale": ""},
        description="Bloom's level + 判断理由",
    )
    # Webb's Depth of Knowledge
    dok: dict[str, Any] = Field(
        default_factory=lambda: {"level": 2, "rationale": ""},
        description="DOK level (1-4) + 判断理由",
    )

    # NWEA MAP RIT 分数估计
    rit_estimate: int | None = None

    # Common Core State Standards 对应编码
    ccss_codes: list[str] = Field(default_factory=list)

    # 认知技能
    cognitive_skills: dict[str, Any] = Field(
        default_factory=lambda: {"primary": "", "secondary": []},
        description="主要认知技能 + 次要认知技能列表",
    )

    # 常见误解（可诊断项）
    misconceptions: dict[str, Any] = Field(
        default_factory=lambda: {"detectable": [], "if_wrong_answer": {}},
        description="可检测的误解 ID 列表 + 错误答案→误解映射",
    )

    # 学习目标描述
    learning_objective: str = ""

    # 预估答题时间（秒）
    time_estimate_sec: int | None = None

    # 题目情境类型
    context_type: str = "abstract"

    # 对标考试
    test_alignment: list[str] = Field(default_factory=list)

    # 语言复杂度（ELA/阅读类题目适用）
    language_complexity: str | None = None

    # ------------------------------------------------------------------
    # 辅助方法
    # ------------------------------------------------------------------

    def to_tags(self) -> list[str]:
        """将多维标签转为前缀化标签列表，用于写入 assessment_questions.tags 数组

        示例输出:
            ["bloom:apply", "dok:2", "band:proficient", "ccss:7.RP.A.2",
             "skill:quantitative_reasoning.proportional_thinking",
             "context:contextual", "test:map_growth", "time:standard",
             "mc:MC-MATH-FRAC-001"]
        """
        tags: list[str] = []

        # Bloom's
        if self.blooms.get("level"):
            tags.append(f"bloom:{self.blooms['level']}")

        # DOK
        if self.dok.get("level"):
            tags.append(f"dok:{self.dok['level']}")

        # Difficulty band（从 rit_estimate 推断，或留空）
        # 这里无法直接从 tags 对象获取 difficulty float,
        # 调用方可用 difficulty_to_band() 自行添加

        # CCSS
        for code in self.ccss_codes:
            tags.append(f"ccss:{code}")

        # Cognitive skills
        primary = self.cognitive_skills.get("primary", "")
        if primary:
            tags.append(f"skill:{primary}")
        for sec in self.cognitive_skills.get("secondary", []):
            tags.append(f"skill:{sec}")

        # Context
        if self.context_type:
            tags.append(f"context:{self.context_type}")

        # Test alignment
        for t in self.test_alignment:
            tags.append(f"test:{t}")

        # Time category
        if self.time_estimate_sec is not None:
            tags.append(f"time:{self.time_to_category(self.time_estimate_sec)}")

        # Language complexity
        if self.language_complexity:
            tags.append(f"lang:{self.language_complexity}")

        # Misconceptions
        for mc_id in self.misconceptions.get("detectable", []):
            tags.append(f"mc:{mc_id}")

        return tags

    @staticmethod
    def difficulty_to_band(difficulty: float) -> str:
        """将 0-1 连续难度值映射为难度带名称

        Args:
            difficulty: 0.0 ~ 1.0 的难度值

        Returns:
            foundational / basic / proficient / advanced / elite
        """
        if difficulty < 0.25:
            return "foundational"
        if difficulty < 0.45:
            return "basic"
        if difficulty < 0.65:
            return "proficient"
        if difficulty < 0.85:
            return "advanced"
        return "elite"

    @staticmethod
    def time_to_category(seconds: int) -> str:
        """将答题秒数映射为时间类别

        Args:
            seconds: 预估答题时间（秒）

        Returns:
            quick / standard / extended / complex
        """
        if seconds < 30:
            return "quick"
        if seconds < 90:
            return "standard"
        if seconds < 180:
            return "extended"
        return "complex"


# ---------------------------------------------------------------------------
# Taxonomy 定义文件模型
# ---------------------------------------------------------------------------


class TaxonomyDefinition(BaseModel):
    """taxonomy_v1.yaml 的根结构"""

    version: str
    blooms_taxonomy: dict[str, Any]
    dok: dict[str, Any]
    difficulty_bands: dict[str, Any]
    cognitive_skills: dict[str, Any]
    context_types: list[str]
    test_alignment: list[str]
    time_complexity: dict[str, Any]
    language_complexity: list[str] | None = None
    tag_prefixes: dict[str, str]


# ---------------------------------------------------------------------------
# CCSS 标准模型
# ---------------------------------------------------------------------------


class CCSStandard(BaseModel):
    """单条 Common Core State Standard"""

    code: str
    domain: str | None = None
    strand: str | None = None
    cluster: str
    standard: str
    grade: int


# ---------------------------------------------------------------------------
# 常见误解模型
# ---------------------------------------------------------------------------


class Misconception(BaseModel):
    """学生常见误解条目"""

    id: str
    subject: str
    topic: str
    description_en: str
    description_zh: str
    example: str
    correction_en: str
    correction_zh: str
    grades: list[str]
    severity: str = "moderate"


# ---------------------------------------------------------------------------
# 聚合模型 — 加载后的完整 Taxonomy 数据
# ---------------------------------------------------------------------------


class TaxonomyBundle(BaseModel):
    """包含所有 taxonomy YAML 加载后的完整数据"""

    definition: TaxonomyDefinition
    ccss_math: dict[str, CCSStandard] = Field(default_factory=dict)
    ccss_ela: dict[str, CCSStandard] = Field(default_factory=dict)
    misconceptions: dict[str, Misconception] = Field(default_factory=dict)
