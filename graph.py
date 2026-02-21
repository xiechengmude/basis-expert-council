"""LangGraph Server entry point for BasisPilot (贝领)."""
import logging
from dotenv import load_dotenv
load_dotenv()

from src.basis_expert_council.agent import create_basis_expert_agent, _vision_preprocess

_log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Vision 预处理 — 在 Pregel 类级别注入
#
# 为什么不能用实例级 patch？
#   LangGraph Server 的 get_graph() 对每次 run 调用 graph.copy(update)
#   创建新实例并注入 checkpointer/store，实例级 monkey-patch 会丢失。
#
# 为什么不用子图包装？
#   LangGraph 的 messages 字段使用 add_messages reducer（追加语义），
#   如果在 graph node 中返回修改后的 messages，旧消息不会被替换。
#
# 方案：在 Pregel 类级别 patch astream / astream_events，
#   对所有实例（包括 copy 出来的新实例）生效。
#   预处理仅在检测到 image_url blocks 时触发，对普通文本消息无影响。
# ---------------------------------------------------------------------------


async def _safe_vision_preprocess(input_dict, config=None):
    """安全的视觉预处理：失败时静默回退到原始 input。"""
    try:
        if isinstance(input_dict, dict) and "messages" in input_dict:
            return await _vision_preprocess(input_dict, config)
    except Exception as e:
        _log.warning("Vision preprocess failed, falling back to raw input: %s", e)
    return input_dict


# Patch Pregel 类方法（非实例方法），确保 copy() 后的新实例也生效
from langgraph.pregel import Pregel

_orig_pregel_astream = Pregel.astream
_orig_pregel_astream_events = Pregel.astream_events


async def _patched_astream(self, input_dict=None, config=None, **kwargs):
    input_dict = await _safe_vision_preprocess(input_dict, config)
    async for chunk in _orig_pregel_astream(self, input_dict, config=config, **kwargs):
        yield chunk


async def _patched_astream_events(self, input_dict=None, config=None, **kwargs):
    input_dict = await _safe_vision_preprocess(input_dict, config)
    async for event in _orig_pregel_astream_events(self, input_dict, config=config, **kwargs):
        yield event


Pregel.astream = _patched_astream
Pregel.astream_events = _patched_astream_events

# 创建 agent（此时 Pregel 类已被 patch，agent 实例自动继承）
agent = create_basis_expert_agent()
