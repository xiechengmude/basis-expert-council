"""
BasisPilot 题目标签体系 — QuestionTagger LLM 批量打标引擎
使用 OpenAI-compatible API 对题库进行多维标签标注
"""
from __future__ import annotations

import json
import logging
import os
from collections.abc import Callable
from datetime import datetime, timezone
from typing import Any

from openai import AsyncOpenAI

from .loader import load_taxonomy
from .models import QuestionTaxonomyTags, TaxonomyBundle
from .prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, build_taxonomy_context

logger = logging.getLogger(__name__)


class QuestionTagger:
    """LLM 驱动的题目多维标签批量打标器

    支持:
    - 批量打标（每批最多 batch_size 道题）
    - 进度回调
    - 幂等性（已打标题目自动跳过）
    - dry_run 模式（仅打印不写入 DB）
    """

    def __init__(
        self,
        model: str | None = None,
        batch_size: int = 5,
        dry_run: bool = False,
    ) -> None:
        """初始化打标器

        Args:
            model: LLM 模型名。默认读取 TAXONOMY_LLM_MODEL 或 MEM0_LLM_MODEL 环境变量
            batch_size: 每次 LLM 调用的题目数量上限
            dry_run: 仅打印标签结果，不写入数据库
        """
        self.model = model or os.getenv(
            "TAXONOMY_LLM_MODEL",
            os.getenv("MEM0_LLM_MODEL", "gpt-4o-mini"),
        )
        self.batch_size = batch_size
        self.dry_run = dry_run

        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY", ""),
            base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
        )

        self.bundle: TaxonomyBundle = load_taxonomy()
        logger.info(
            "QuestionTagger 初始化完成: model=%s, batch_size=%d, dry_run=%s",
            self.model, self.batch_size, self.dry_run,
        )

    # ------------------------------------------------------------------
    # 单批次打标
    # ------------------------------------------------------------------

    async def tag_batch(
        self, questions: list[dict]
    ) -> list[QuestionTaxonomyTags]:
        """对一批题目调用 LLM 打标

        Args:
            questions: 题目字典列表（最多 batch_size 条），每个 dict 应包含
                       id, subject, grade_level, topic, content_en/content_zh 等字段

        Returns:
            QuestionTaxonomyTags 列表，与输入顺序一一对应
        """
        if not questions:
            return []

        # 推断学科和年级（取第一道题的信息）
        subject = questions[0].get("subject", "math")
        grade_level = questions[0].get("grade_level", "G7")
        grade_num = _parse_grade(grade_level)

        # 构建 taxonomy 上下文
        taxonomy_summary = build_taxonomy_context(self.bundle, subject, grade_num)

        # 构建题目 JSON（精简字段，避免 prompt 过长）
        q_items = []
        for i, q in enumerate(questions):
            item: dict[str, Any] = {"index": i}
            # 优先使用英文内容
            content = q.get("content_en") or q.get("content_zh") or {}
            if isinstance(content, str):
                try:
                    content = json.loads(content)
                except (json.JSONDecodeError, TypeError):
                    content = {"stem": content}
            item["stem"] = content.get("stem", "")
            if content.get("options"):
                item["options"] = content["options"]
            item["question_type"] = q.get("question_type", "mcq")
            item["topic"] = q.get("topic", "")
            item["subtopic"] = q.get("subtopic", "")
            item["difficulty"] = q.get("difficulty", 0.5)
            q_items.append(item)

        questions_json = json.dumps(q_items, ensure_ascii=False, indent=2)

        user_prompt = USER_PROMPT_TEMPLATE.format(
            subject=subject,
            grade_level=grade_level,
            taxonomy_summary=taxonomy_summary,
            questions_json=questions_json,
        )

        # 调用 LLM
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            raw_content = response.choices[0].message.content or "{}"
        except Exception:
            logger.exception("LLM 调用失败 (batch=%d 题)", len(questions))
            # 返回空标签列表，让调用方处理
            return [QuestionTaxonomyTags() for _ in questions]

        # 解析 JSON 响应
        return self._parse_response(raw_content, len(questions))

    def _parse_response(
        self, raw_content: str, expected_count: int
    ) -> list[QuestionTaxonomyTags]:
        """解析 LLM 返回的 JSON，容错处理"""
        try:
            data = json.loads(raw_content)
        except json.JSONDecodeError:
            logger.error("LLM 返回非法 JSON: %s...", raw_content[:200])
            return [QuestionTaxonomyTags() for _ in range(expected_count)]

        # 支持 {"tagged": [...]} 或直接 [...]
        if isinstance(data, dict):
            items = data.get("tagged", data.get("results", data.get("questions", [])))
            if isinstance(items, dict):
                items = [items]
        elif isinstance(data, list):
            items = data
        else:
            logger.error("LLM 返回非预期类型: %s", type(data).__name__)
            return [QuestionTaxonomyTags() for _ in range(expected_count)]

        results: list[QuestionTaxonomyTags] = []
        now = datetime.now(timezone.utc)

        for i in range(expected_count):
            if i < len(items):
                item = items[i]
                try:
                    tags = QuestionTaxonomyTags(
                        version="1.0",
                        tagged_at=now,
                        **{k: v for k, v in item.items() if k not in ("version", "tagged_at")},
                    )
                    results.append(tags)
                except Exception as e:
                    logger.warning("解析第 %d 题标签失败: %s", i, e)
                    results.append(QuestionTaxonomyTags(version="1.0", tagged_at=now))
            else:
                logger.warning("LLM 返回题数不足: 期望 %d, 实际 %d", expected_count, len(items))
                results.append(QuestionTaxonomyTags(version="1.0", tagged_at=now))

        return results

    # ------------------------------------------------------------------
    # 全量打标（含幂等跳过）
    # ------------------------------------------------------------------

    async def tag_all(
        self,
        questions: list[dict],
        *,
        on_progress: Callable[[int, int], Any] | None = None,
    ) -> list[tuple[dict, QuestionTaxonomyTags]]:
        """批量打标所有题目，自动跳过已打标题

        Args:
            questions: 完整题目列表
            on_progress: 进度回调 (已完成数, 总数)

        Returns:
            (question, tags) 元组列表
        """
        # 幂等性: 跳过已打标的题目
        to_tag: list[dict] = []
        already_tagged: list[tuple[dict, QuestionTaxonomyTags]] = []

        for q in questions:
            metadata = q.get("metadata") or {}
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except (json.JSONDecodeError, TypeError):
                    metadata = {}

            taxonomy_data = metadata.get("taxonomy", {})
            if taxonomy_data.get("version") == "1.0":
                # 已打标，跳过
                tags = QuestionTaxonomyTags(**taxonomy_data)
                already_tagged.append((q, tags))
            else:
                to_tag.append(q)

        total = len(to_tag)
        completed = 0
        results: list[tuple[dict, QuestionTaxonomyTags]] = list(already_tagged)

        logger.info(
            "批量打标: 共 %d 题, 跳过已打标 %d 题, 需打标 %d 题",
            len(questions), len(already_tagged), total,
        )

        # 分批处理
        for batch_start in range(0, total, self.batch_size):
            batch = to_tag[batch_start : batch_start + self.batch_size]
            batch_tags = await self.tag_batch(batch)

            for q, tags in zip(batch, batch_tags):
                results.append((q, tags))

            completed += len(batch)
            if on_progress:
                on_progress(completed, total)

            logger.debug("打标进度: %d/%d", completed, total)

        return results

    # ------------------------------------------------------------------
    # 端到端: 从 DB 读取 → 打标 → 写回 DB
    # ------------------------------------------------------------------

    async def tag_and_save(
        self,
        *,
        limit: int | None = None,
        subject: str | None = None,
        grade_level: str | None = None,
        on_progress: Callable[[int, int], Any] | None = None,
    ) -> dict[str, int]:
        """从数据库读取未打标题目 → LLM 打标 → 写回 metadata.taxonomy

        Args:
            limit: 最多处理题目数量
            subject: 按学科过滤
            grade_level: 按年级过滤
            on_progress: 进度回调

        Returns:
            {"total": N, "tagged": N, "skipped": N, "errors": N}
        """
        from .. import db

        # 从 DB 获取待打标题目
        questions = await db.get_questions_for_tagging(
            subject=subject, grade_level=grade_level, skip_tagged=True, limit=limit,
        )

        if not questions:
            logger.info("无待打标题目")
            return {"total": 0, "tagged": 0, "skipped": 0, "errors": 0}

        # 执行打标
        tagged_pairs = await self.tag_all(questions, on_progress=on_progress)

        # 写回 DB
        tagged_count = 0
        skipped_count = 0
        error_count = 0

        for q, tags in tagged_pairs:
            # 跳过之前已打标的
            metadata = q.get("metadata") or {}
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except (json.JSONDecodeError, TypeError):
                    metadata = {}

            if metadata.get("taxonomy", {}).get("version") == "1.0":
                skipped_count += 1
                continue

            if self.dry_run:
                print(f"\n[DRY RUN] 题目 #{q.get('id')} ({q.get('subject')}/{q.get('grade_level')}):")
                print(f"  Bloom's: {tags.blooms}")
                print(f"  DOK: {tags.dok}")
                print(f"  CCSS: {tags.ccss_codes}")
                print(f"  Skills: {tags.cognitive_skills}")
                print(f"  Tags: {tags.to_tags()}")
                tagged_count += 1
                continue

            try:
                # 合并 taxonomy 到现有 metadata
                metadata["taxonomy"] = tags.model_dump(mode="json")

                # 更新 metadata 和 tags 数组
                new_tag_list = tags.to_tags()
                # 追加 difficulty band
                difficulty = q.get("difficulty", 0.5)
                new_tag_list.append(f"band:{QuestionTaxonomyTags.difficulty_to_band(difficulty)}")

                await db.update_question(
                    q["id"],
                    metadata=metadata,
                    tags=new_tag_list,
                )
                tagged_count += 1
            except Exception:
                logger.exception("写入题目 #%s 标签失败", q.get("id"))
                error_count += 1

        summary = {
            "total": len(questions),
            "tagged": tagged_count,
            "skipped": skipped_count,
            "errors": error_count,
        }
        logger.info("打标完成: %s", summary)
        return summary


# ---------------------------------------------------------------------------
# 辅助函数
# ---------------------------------------------------------------------------


def _parse_grade(grade_level: str) -> int:
    """从 'G7'、'G10' 等字符串解析年级数字"""
    import re
    m = re.search(r"\d+", grade_level)
    return int(m.group()) if m else 7


