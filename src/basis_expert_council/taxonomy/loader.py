"""
BasisPilot 题目标签体系 — YAML 加载、校验与缓存
从 data/taxonomy/ 目录加载 taxonomy_v1.yaml、ccss_math.yaml、ccss_ela.yaml、misconceptions.yaml
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import yaml

from .models import (
    CCSStandard,
    Misconception,
    TaxonomyBundle,
    TaxonomyDefinition,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# 模块级缓存（单例）
# ---------------------------------------------------------------------------

_cache: TaxonomyBundle | None = None


# ---------------------------------------------------------------------------
# 路径发现
# ---------------------------------------------------------------------------


def _find_taxonomy_dir() -> Path:
    """定位 data/taxonomy/ 目录

    查找策略（按优先级）:
    1. 项目根目录下的 data/taxonomy/（从本文件向上查找包含 pyproject.toml 的目录）
    2. CWD/data/taxonomy/
    """
    # 策略 1: 从当前包路径向上查找项目根
    current = Path(__file__).resolve().parent
    for ancestor in [current] + list(current.parents):
        candidate = ancestor / "data" / "taxonomy"
        if candidate.is_dir():
            return candidate
        # 碰到项目根标志则停止
        if (ancestor / "pyproject.toml").exists():
            # 项目根下 data/taxonomy 可能尚未创建
            taxonomy_dir = ancestor / "data" / "taxonomy"
            if taxonomy_dir.is_dir():
                return taxonomy_dir
            break

    # 策略 2: CWD
    cwd_candidate = Path.cwd() / "data" / "taxonomy"
    if cwd_candidate.is_dir():
        return cwd_candidate

    raise FileNotFoundError(
        "无法找到 data/taxonomy/ 目录。"
        "请确保项目根目录下存在 data/taxonomy/ 并包含 taxonomy_v1.yaml 文件。"
    )


# ---------------------------------------------------------------------------
# YAML 文件加载辅助
# ---------------------------------------------------------------------------


def _load_yaml(path: Path) -> dict[str, Any]:
    """安全加载单个 YAML 文件"""
    with open(path, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"YAML 文件 {path} 的根结构应为 dict，实际为 {type(data).__name__}")
    return data


def _parse_ccss_file(path: Path) -> dict[str, CCSStandard]:
    """解析 CCSS YAML 文件为 {code: CCSStandard} 字典"""
    if not path.exists():
        logger.debug("CCSS 文件不存在，跳过: %s", path)
        return {}

    data = _load_yaml(path)
    standards: dict[str, CCSStandard] = {}

    # YAML 格式约定: { "standards": [ {code, domain, strand, cluster, standard, grade}, ... ] }
    items = data.get("standards", [])
    if isinstance(items, list):
        for item in items:
            try:
                cs = CCSStandard(**item)
                standards[cs.code] = cs
            except Exception as e:
                logger.warning("解析 CCSS 条目失败 (%s): %s", item.get("code", "?"), e)
    else:
        # 兼容 {code: {fields...}} 格式
        for code, fields in items.items() if isinstance(items, dict) else []:
            try:
                cs = CCSStandard(code=code, **fields)
                standards[code] = cs
            except Exception as e:
                logger.warning("解析 CCSS 条目失败 (%s): %s", code, e)

    logger.info("加载 CCSS 标准 %d 条: %s", len(standards), path.name)
    return standards


def _parse_misconceptions_file(path: Path) -> dict[str, Misconception]:
    """解析 misconceptions YAML 文件为 {id: Misconception} 字典"""
    if not path.exists():
        logger.debug("Misconceptions 文件不存在，跳过: %s", path)
        return {}

    data = _load_yaml(path)
    misconceptions: dict[str, Misconception] = {}

    # YAML 格式约定: { "misconceptions": [ {id, subject, topic, ...}, ... ] }
    items = data.get("misconceptions", [])
    if isinstance(items, list):
        for item in items:
            try:
                mc = Misconception(**item)
                misconceptions[mc.id] = mc
            except Exception as e:
                logger.warning("解析误解条目失败 (%s): %s", item.get("id", "?"), e)
    else:
        for mc_id, fields in items.items() if isinstance(items, dict) else []:
            try:
                mc = Misconception(id=mc_id, **fields)
                misconceptions[mc_id] = mc
            except Exception as e:
                logger.warning("解析误解条目失败 (%s): %s", mc_id, e)

    logger.info("加载误解条目 %d 条: %s", len(misconceptions), path.name)
    return misconceptions


# ---------------------------------------------------------------------------
# 主加载函数
# ---------------------------------------------------------------------------


def load_taxonomy(taxonomy_dir: Path | None = None) -> TaxonomyBundle:
    """加载所有 taxonomy YAML 文件并缓存为 TaxonomyBundle 单例

    Args:
        taxonomy_dir: data/taxonomy/ 目录路径。为 None 时自动查找。

    Returns:
        TaxonomyBundle 包含定义、CCSS 标准、误解条目
    """
    global _cache
    if _cache is not None:
        return _cache

    if taxonomy_dir is None:
        taxonomy_dir = _find_taxonomy_dir()

    taxonomy_dir = Path(taxonomy_dir)

    # 1) 加载主定义文件
    definition_path = taxonomy_dir / "taxonomy_v1.yaml"
    if not definition_path.exists():
        raise FileNotFoundError(f"Taxonomy 定义文件不存在: {definition_path}")

    raw_def = _load_yaml(definition_path)

    # language_complexity 在 YAML 中可能是 dict 或 list
    lang_complexity = raw_def.get("language_complexity")
    if isinstance(lang_complexity, dict):
        raw_def["language_complexity"] = list(lang_complexity.keys())
    elif isinstance(lang_complexity, list):
        pass  # 已经是列表
    else:
        raw_def["language_complexity"] = None

    # tag_prefixes 在 YAML 中是 {prefix: {description, example}} 格式，模型期望 {prefix: str}
    raw_prefixes = raw_def.get("tag_prefixes", {})
    if raw_prefixes and isinstance(next(iter(raw_prefixes.values()), None), dict):
        raw_def["tag_prefixes"] = {
            k: v.get("description", "") if isinstance(v, dict) else str(v)
            for k, v in raw_prefixes.items()
        }

    # context_types 在 YAML 中可能含行内注释，清洗为纯字符串
    ctx_types = raw_def.get("context_types", [])
    if ctx_types:
        raw_def["context_types"] = [
            str(t).split("#")[0].strip() if isinstance(t, str) else str(t)
            for t in ctx_types
        ]

    # test_alignment 同理
    test_align = raw_def.get("test_alignment", [])
    if test_align:
        raw_def["test_alignment"] = [
            str(t).split("#")[0].strip() if isinstance(t, str) else str(t)
            for t in test_align
        ]

    definition = TaxonomyDefinition(**raw_def)
    logger.info("加载 Taxonomy 定义 v%s", definition.version)

    # 2) 加载 CCSS 文件
    ccss_math = _parse_ccss_file(taxonomy_dir / "ccss_math.yaml")
    ccss_ela = _parse_ccss_file(taxonomy_dir / "ccss_ela.yaml")

    # 3) 加载误解文件
    misconceptions = _parse_misconceptions_file(taxonomy_dir / "misconceptions.yaml")

    _cache = TaxonomyBundle(
        definition=definition,
        ccss_math=ccss_math,
        ccss_ela=ccss_ela,
        misconceptions=misconceptions,
    )
    return _cache


def validate_taxonomy(taxonomy_dir: Path | None = None) -> list[str]:
    """校验所有 taxonomy YAML 文件，返回错误信息列表（空列表 = 全部通过）

    Args:
        taxonomy_dir: data/taxonomy/ 目录路径。为 None 时自动查找。

    Returns:
        错误信息列表
    """
    errors: list[str] = []

    try:
        if taxonomy_dir is None:
            taxonomy_dir = _find_taxonomy_dir()
    except FileNotFoundError as e:
        return [str(e)]

    taxonomy_dir = Path(taxonomy_dir)

    # 校验主定义文件
    definition_path = taxonomy_dir / "taxonomy_v1.yaml"
    if not definition_path.exists():
        errors.append(f"主定义文件缺失: {definition_path}")
    else:
        try:
            raw = _load_yaml(definition_path)
            # 检查必须的顶级字段
            required_keys = [
                "version", "blooms_taxonomy", "dok", "difficulty_bands",
                "cognitive_skills", "context_types", "test_alignment",
                "time_complexity", "tag_prefixes",
            ]
            for key in required_keys:
                if key not in raw:
                    errors.append(f"taxonomy_v1.yaml 缺少必要字段: {key}")
        except Exception as e:
            errors.append(f"taxonomy_v1.yaml 解析失败: {e}")

    # 校验 CCSS 文件（可选，但如果存在则必须合法）
    for fname in ("ccss_math.yaml", "ccss_ela.yaml"):
        fpath = taxonomy_dir / fname
        if fpath.exists():
            try:
                data = _load_yaml(fpath)
                if "standards" not in data:
                    errors.append(f"{fname} 缺少 'standards' 字段")
            except Exception as e:
                errors.append(f"{fname} 解析失败: {e}")

    # 校验误解文件（可选）
    mc_path = taxonomy_dir / "misconceptions.yaml"
    if mc_path.exists():
        try:
            data = _load_yaml(mc_path)
            if "misconceptions" not in data:
                errors.append("misconceptions.yaml 缺少 'misconceptions' 字段")
        except Exception as e:
            errors.append(f"misconceptions.yaml 解析失败: {e}")

    # 尝试完整加载以发现模型校验错误
    if not errors:
        try:
            # 清除缓存以强制重新加载
            global _cache
            old_cache = _cache
            _cache = None
            try:
                load_taxonomy(taxonomy_dir)
            finally:
                # 恢复原缓存，避免副作用
                _cache = old_cache
        except Exception as e:
            errors.append(f"Taxonomy 加载失败: {e}")

    return errors


# ---------------------------------------------------------------------------
# 查询辅助函数
# ---------------------------------------------------------------------------


def get_ccss_codes_for_grade(
    bundle: TaxonomyBundle, grade: int, subject: str = "math"
) -> list[str]:
    """获取指定年级和学科的所有 CCSS 编码

    Args:
        bundle: 已加载的 TaxonomyBundle
        grade: 年级数字（如 6, 7, 8）
        subject: 学科，"math" 或 "ela"

    Returns:
        匹配的 CCSS 编码列表
    """
    ccss_dict = bundle.ccss_math if subject == "math" else bundle.ccss_ela
    return [
        code for code, std in ccss_dict.items()
        if std.grade == grade
    ]


def get_misconceptions_for_topic(
    bundle: TaxonomyBundle, subject: str, topic: str
) -> list[Misconception]:
    """获取指定学科和主题下的误解条目

    Args:
        bundle: 已加载的 TaxonomyBundle
        subject: 学科（如 "math", "english"）
        topic: 主题（如 "fractions", "algebra"）

    Returns:
        匹配的 Misconception 列表
    """
    return [
        mc for mc in bundle.misconceptions.values()
        if mc.subject.lower() == subject.lower()
        and mc.topic.lower() == topic.lower()
    ]
