"""LangGraph Server entry point for BasisPilot (贝领)."""
import logging
from dotenv import load_dotenv
load_dotenv()

from src.basis_expert_council.agent import create_basis_expert_agent, _vision_preprocess

_log = logging.getLogger(__name__)

_inner = create_basis_expert_agent()

# ---------------------------------------------------------------------------
# Vision 预处理 — monkey-patch agent 的入口方法
#
# 为什么不用子图包装？
#   LangGraph 的 messages 字段使用 add_messages reducer（追加语义），
#   如果在 graph node 中返回修改后的 messages，旧消息不会被替换，
#   image_url blocks 仍会到达不支持视觉的主模型。
#
# 方案：在 input 进入 CompiledGraph 之前拦截，将图片消息替换为 OCR 文本。
#   保持 agent 仍是原始 CompiledGraph 实例（LangGraph Server 类型检查通过）。
# ---------------------------------------------------------------------------


async def _safe_vision_preprocess(input_dict, config=None):
    """安全的视觉预处理：失败时静默回退到原始 input。"""
    try:
        if isinstance(input_dict, dict) and "messages" in input_dict:
            return await _vision_preprocess(input_dict, config)
    except Exception as e:
        _log.warning("Vision preprocess failed, falling back to raw input: %s", e)
    return input_dict


# 保存原始方法引用
_orig_ainvoke = _inner.ainvoke
_orig_astream = _inner.astream
_orig_astream_events = _inner.astream_events


async def _patched_ainvoke(input_dict, config=None, **kwargs):
    input_dict = await _safe_vision_preprocess(input_dict, config)
    return await _orig_ainvoke(input_dict, config=config, **kwargs)


async def _patched_astream(input_dict, config=None, **kwargs):
    input_dict = await _safe_vision_preprocess(input_dict, config)
    async for chunk in _orig_astream(input_dict, config=config, **kwargs):
        yield chunk


async def _patched_astream_events(input_dict, config=None, **kwargs):
    input_dict = await _safe_vision_preprocess(input_dict, config)
    async for event in _orig_astream_events(input_dict, config=config, **kwargs):
        yield event


# 注入补丁
_inner.ainvoke = _patched_ainvoke
_inner.astream = _patched_astream
_inner.astream_events = _patched_astream_events

agent = _inner
