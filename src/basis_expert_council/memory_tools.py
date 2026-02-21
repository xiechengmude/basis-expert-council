"""
BasisPilot (贝领) 记忆工具 — 7 个 LangGraph Tool
通过 RunnableConfig 自动注入 user_id，Agent 自主决定何时存储/召回
"""

import concurrent.futures
import logging
from datetime import datetime, timedelta, timezone

from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool

from .memory import get_memory, run_with_timeout, user_id_to_mem0

logger = logging.getLogger("basis.memory_tools")

TTL_DAYS = {"high": 365, "medium": 180, "low": 90}


def _extract_user_id(config: RunnableConfig) -> str | None:
    """从 RunnableConfig 中提取 user_id (Supabase UUID)，无效时返回 None"""
    configurable = config.get("configurable", {})
    user_id = configurable.get("user_id")
    if not user_id:
        return None
    return str(user_id)


@tool
def remember_fact(
    content: str,
    category: str,
    config: RunnableConfig,
    subject: str = "general",
    importance: str = "medium",
) -> str:
    """存储用户的关键信息到长期记忆中。

    当用户透露年级、学校、成绩、学习目标、薄弱学科等重要信息时使用此工具。

    Args:
        content: 要记住的事实内容，例如 "学生就读 BASIS 深圳蛇口校区 G10"
        category: 分类标签，必须是以下之一：
            tutoring（学科辅导相关）、college_planning（升学规划）、
            onboarding（新生衔接）、exam_prep（AP考试备考）、
            grade（成绩相关）、assessment（评估报告）、
            preference（用户偏好）、goal（学习目标）
        subject: 学科维度，默认 general。可选：math/science/humanities/curriculum/general
        importance: 重要程度：high/medium/low
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "记忆功能暂不可用（用户未登录或 user_id 未传入），但我会在本次对话中记住您的信息。"
    mem0_uid = user_id_to_mem0(user_id)
    mem = get_memory()

    expires_at = (
        datetime.now(timezone.utc) + timedelta(days=TTL_DAYS.get(importance, 180))
    ).isoformat()

    try:
        result = run_with_timeout(
            mem.add,
            messages=content,
            user_id=mem0_uid,
            metadata={
                "source": "agent_explicit",
                "basis_user_id": str(user_id),
                "category": category,
                "subject": subject,
                "importance": importance,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "expires_at": expires_at,
            },
        )
        added = result.get("results", []) if isinstance(result, dict) else result
        count = len(added) if added else 0
        return f"已记住 {count} 条信息（类别: {category}, 学科: {subject}）"
    except concurrent.futures.TimeoutError:
        return "记忆存储超时，请稍后再试。本次对话中的信息不会丢失。"
    except Exception as e:
        logger.warning(f"remember_fact failed for user {user_id}: {e}")
        return "记忆功能暂时不可用，但我会在本次对话中记住您的信息。"


@tool
def recall_memories(
    query: str,
    config: RunnableConfig,
    limit: int = 10,
) -> str:
    """搜索与当前问题相关的用户历史记忆。

    在回答涉及用户个人情况的问题前，先调用此工具获取相关背景信息。

    Args:
        query: 搜索查询，描述需要回忆的内容，例如 "学生的数学成绩和薄弱环节"
        limit: 最多返回的记忆条数，默认 10
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "未找到相关记忆。用户未登录或 user_id 未传入，这可能是匿名对话。"
    mem0_uid = user_id_to_mem0(user_id)
    mem = get_memory()

    try:
        results = run_with_timeout(mem.search, query=query, user_id=mem0_uid, limit=limit)
        memories = results.get("results", []) if isinstance(results, dict) else results
        if not memories:
            return "未找到相关记忆。这可能是该用户的首次对话。"

        lines = []
        for i, m in enumerate(memories, 1):
            text = m.get("memory", "") if isinstance(m, dict) else str(m)
            meta = m.get("metadata", {}) if isinstance(m, dict) else {}
            cat = meta.get("category", "")
            subj = meta.get("subject", "")
            tag = f"[{cat}/{subj}]" if cat else ""
            lines.append(f"{i}. {tag} {text}")

        return f"找到 {len(memories)} 条相关记忆：\n" + "\n".join(lines)
    except concurrent.futures.TimeoutError:
        return "记忆搜索超时，请稍后再试。"
    except Exception as e:
        logger.warning(f"recall_memories failed for user {user_id}: {e}")
        return "记忆搜索暂时不可用。"


@tool
def get_user_memory_profile(config: RunnableConfig) -> str:
    """获取用户的完整记忆档案。

    在新对话开始时使用此工具，了解用户的完整背景信息。
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "该用户暂无历史记忆。用户未登录或 user_id 未传入。"
    mem0_uid = user_id_to_mem0(user_id)
    mem = get_memory()

    try:
        results = run_with_timeout(mem.get_all, user_id=mem0_uid)
        memories = results.get("results", []) if isinstance(results, dict) else results
        if not memories:
            return "该用户暂无历史记忆。这是一位新用户，请在对话中主动收集关键信息。"

        # 按 category 分组展示
        grouped: dict[str, list[str]] = {}
        for m in memories:
            text = m.get("memory", "") if isinstance(m, dict) else str(m)
            meta = m.get("metadata", {}) if isinstance(m, dict) else {}
            cat = meta.get("category", "other")
            grouped.setdefault(cat, []).append(text)

        lines = [f"用户记忆档案（共 {len(memories)} 条）："]
        category_labels = {
            "tutoring": "学科辅导",
            "college_planning": "升学规划",
            "onboarding": "新生衔接",
            "exam_prep": "AP 考试备考",
            "grade": "成绩记录",
            "assessment": "评估报告",
            "preference": "用户偏好",
            "goal": "学习目标",
            "other": "其他",
        }
        for cat, items in grouped.items():
            label = category_labels.get(cat, cat)
            lines.append(f"\n【{label}】")
            for item in items:
                lines.append(f"  - {item}")

        return "\n".join(lines)
    except concurrent.futures.TimeoutError:
        return "获取记忆档案超时，请稍后再试。"
    except Exception as e:
        logger.warning(f"get_user_memory_profile failed for user {user_id}: {e}")
        return "记忆功能暂时不可用。"


@tool
def forget_memory(
    memory_id: str,
    config: RunnableConfig,
) -> str:
    """删除特定记忆条目。

    当用户明确要求"忘记"某条信息时使用此工具。

    Args:
        memory_id: 要删除的记忆 ID
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "无法删除记忆：用户未登录或 user_id 未传入。"
    mem = get_memory()

    try:
        run_with_timeout(mem.delete, memory_id=memory_id)
        return f"已删除记忆 {memory_id}"
    except concurrent.futures.TimeoutError:
        return "删除记忆超时，请稍后再试。"
    except Exception as e:
        logger.warning(f"forget_memory failed for user {user_id}: {e}")
        return "删除记忆失败，请稍后再试。"


@tool
def update_memory(
    memory_id: str,
    new_content: str,
    config: RunnableConfig,
) -> str:
    """更新已有记忆的内容。

    当用户更正了之前的信息（如成绩变化、目标调整等）时使用此工具。

    Args:
        memory_id: 要更新的记忆 ID
        new_content: 新的记忆内容
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "无法更新记忆：用户未登录或 user_id 未传入。"
    mem = get_memory()

    try:
        run_with_timeout(mem.update, memory_id=memory_id, data=new_content)
        return f"已更新记忆 {memory_id}"
    except concurrent.futures.TimeoutError:
        return "更新记忆超时，请稍后再试。"
    except Exception as e:
        logger.warning(f"update_memory failed for user {user_id}: {e}")
        return "更新记忆失败，请稍后再试。"


@tool
def batch_remember(
    items: list[dict],
    config: RunnableConfig,
) -> str:
    """批量存储多条记忆。

    当用户一次性提供多条信息（如全科成绩、多个学习目标等）时使用此工具。

    Args:
        items: 记忆列表，每条包含 content/category，可选 subject/importance
              例如 [{"content": "数学 A", "category": "grade", "subject": "math"}]
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "记忆功能暂不可用（用户未登录或 user_id 未传入），但我会在本次对话中记住您的信息。"
    mem0_uid = user_id_to_mem0(user_id)
    mem = get_memory()

    saved = 0
    failed = 0
    for item in items:
        content = item.get("content", "")
        category = item.get("category", "other")
        subject = item.get("subject", "general")
        importance = item.get("importance", "medium")
        if not content:
            continue

        expires_at = (
            datetime.now(timezone.utc) + timedelta(days=TTL_DAYS.get(importance, 180))
        ).isoformat()

        try:
            run_with_timeout(
                mem.add,
                messages=content,
                user_id=mem0_uid,
                metadata={
                    "source": "agent_explicit",
                    "basis_user_id": str(user_id),
                    "category": category,
                    "subject": subject,
                    "importance": importance,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "expires_at": expires_at,
                },
            )
            saved += 1
        except Exception as e:
            logger.warning(f"batch_remember item failed for user {user_id}: {e}")
            failed += 1

    result = f"批量存储完成：成功 {saved} 条"
    if failed:
        result += f"，失败 {failed} 条"
    return result


@tool
def batch_forget(
    memory_ids: list[str],
    config: RunnableConfig,
) -> str:
    """批量删除多条记忆。

    当用户要求删除多条信息时使用此工具。

    Args:
        memory_ids: 要删除的记忆 ID 列表
    """
    user_id = _extract_user_id(config)
    if user_id is None:
        return "无法删除记忆：用户未登录或 user_id 未传入。"
    mem = get_memory()

    deleted = 0
    failed = 0
    for mid in memory_ids:
        try:
            run_with_timeout(mem.delete, memory_id=mid)
            deleted += 1
        except Exception as e:
            logger.warning(f"batch_forget failed for memory {mid}: {e}")
            failed += 1

    result = f"批量删除完成：成功 {deleted} 条"
    if failed:
        result += f"，失败 {failed} 条"
    return result


# 导出工具列表供 agent.py 使用
MEMORY_TOOLS = [
    remember_fact,
    recall_memories,
    get_user_memory_profile,
    forget_memory,
    update_memory,
    batch_remember,
    batch_forget,
]
