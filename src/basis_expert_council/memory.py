"""
BasisPilot (贝领) Mem0 记忆后端 — 单例初始化 + 配置
跨 session 用户记忆存储，基于 Qdrant 向量数据库
"""

import os
import threading
from typing import Any

_memory_instance = None
_lock = threading.Lock()


def _build_config() -> dict[str, Any]:
    """从环境变量构建 Mem0 配置"""
    return {
        "llm": {
            "provider": "litellm",
            "config": {
                "model": os.getenv("MEM0_LLM_MODEL", "Pro/deepseek-ai/DeepSeek-V3.2"),
                "api_key": os.getenv("OPENAI_API_KEY", ""),
                "api_base": os.getenv("OPENAI_BASE_URL", ""),
            },
        },
        "embedder": {
            "provider": "litellm",
            "config": {
                "model": os.getenv("MEM0_EMBEDDING_MODEL", "Qwen/Qwen3-Embedding-4B"),
                "embedding_dims": int(os.getenv("MEM0_EMBEDDING_DIMS", "2560")),
                "api_key": os.getenv("EMBEDDING_API_KEY", os.getenv("OPENAI_API_KEY", "")),
                "api_base": os.getenv(
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
