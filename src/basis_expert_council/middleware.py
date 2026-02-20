"""
BASIS Expert Council — 共享中间件工具
供 server.py 使用的认证检查和配额验证工具函数。
"""

from . import db


async def check_and_record_usage(user_id: int, agent_name: str | None = None) -> dict:
    """
    检查用户配额并记录一次用量。
    返回 quota 字典，包含 allowed、plan、remaining 等字段。
    如果配额不足，allowed=False。
    """
    quota = await db.check_quota(user_id)
    if quota["allowed"]:
        await db.increment_usage(user_id, agent_name)
        # 刷新 quota（用量 +1 后）
        quota = await db.check_quota(user_id)
    return quota
