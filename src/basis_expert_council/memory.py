"""
BasisPilot (贝领) Mem0 记忆后端 — 单例初始化 + 配置
跨 session 用户记忆存储，基于 Qdrant 向量数据库
"""

import concurrent.futures
import logging
import os
import threading
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger("basis.memory")

_memory_instance = None
_lock = threading.Lock()

_executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)
MEMORY_TIMEOUT_SEC = int(os.getenv("MEM0_TIMEOUT_SEC", "15"))


def _build_config() -> dict[str, Any]:
    """从环境变量构建 Mem0 配置"""
    return {
        "llm": {
            "provider": "openai",
            "config": {
                "model": os.getenv("MEM0_LLM_MODEL", "Pro/deepseek-ai/DeepSeek-V3.2"),
                "api_key": os.getenv("OPENAI_API_KEY", ""),
                "openai_base_url": os.getenv("OPENAI_BASE_URL", ""),
            },
        },
        "embedder": {
            "provider": "openai",
            "config": {
                "model": os.getenv("MEM0_EMBEDDING_MODEL", "Qwen/Qwen3-Embedding-4B"),
                "embedding_dims": int(os.getenv("MEM0_EMBEDDING_DIMS", "2560")),
                "api_key": os.getenv("EMBEDDING_API_KEY", os.getenv("OPENAI_API_KEY", "")),
                "openai_base_url": os.getenv(
                    "EMBEDDING_BASE_URL", os.getenv("OPENAI_BASE_URL", "")
                ),
            },
        },
        "vector_store": {
            "provider": "qdrant",
            "config": {
                "host": os.getenv("MEM0_QDRANT_HOST", "basis-qdrant"),
                "port": int(os.getenv("MEM0_QDRANT_PORT", "6333")),
                "collection_name": os.getenv(
                    "MEM0_QDRANT_COLLECTION", "basispilot_memories"
                ),
                "embedding_model_dims": int(
                    os.getenv("MEM0_EMBEDDING_DIMS", "2560")
                ),
            },
        },
        "version": "v1.1",
    }


def get_memory():
    """获取 Mem0 Memory 单例（延迟初始化，线程安全）"""
    global _memory_instance
    if _memory_instance is not None:
        return _memory_instance

    with _lock:
        if _memory_instance is not None:
            return _memory_instance

        from mem0 import Memory

        _memory_instance = Memory.from_config(_build_config())
        return _memory_instance


def user_id_to_mem0(user_id: str) -> str:
    """映射 Supabase UUID → Mem0 user_id 字符串"""
    return f"basis_user_{user_id}"


def run_with_timeout(fn, *args, timeout_sec=None, **kwargs):
    """Run synchronous Mem0 call with timeout."""
    t = timeout_sec or MEMORY_TIMEOUT_SEC
    future = _executor.submit(fn, *args, **kwargs)
    return future.result(timeout=t)


async def cleanup_expired_memories():
    """遍历所有用户，删除 metadata.expires_at 已过期的记忆。"""
    from . import db

    pool = await db.get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT supabase_uid FROM biz_users WHERE supabase_uid IS NOT NULL"
        )
    mem = get_memory()
    now = datetime.now(timezone.utc).isoformat()
    total = 0
    for row in rows:
        mem0_uid = user_id_to_mem0(row["supabase_uid"])
        try:
            results = run_with_timeout(mem.get_all, user_id=mem0_uid)
            memories = results.get("results", []) if isinstance(results, dict) else results
            for m in memories:
                meta = m.get("metadata", {}) if isinstance(m, dict) else {}
                exp = meta.get("expires_at")
                if exp and exp < now:
                    run_with_timeout(mem.delete, memory_id=m.get("id"))
                    total += 1
        except Exception as e:
            logger.warning(f"Cleanup failed for {mem0_uid}: {e}")
    logger.info(f"Memory cleanup done: {total} expired deleted")
    return total
