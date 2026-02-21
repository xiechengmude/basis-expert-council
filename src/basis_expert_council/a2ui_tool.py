"""
A2UI 渲染工具 — 使用 LangGraph interrupt() 实现 HITL 交互

Agent 调用 a2ui_render → tool 内部调用 interrupt() → 图暂停 →
前端从 interrupt payload 渲染 A2UI 卡片 → 用户交互 →
前端 resumeInterrupt(action) → interrupt() 返回用户动作 → Agent 继续处理
"""

from langchain_core.tools import tool
from langgraph.types import interrupt
import json


@tool
def a2ui_render(jsonl: str) -> str:
    """生成 A2UI 交互式 UI 组件并等待用户交互。

    输入必须是 A2UI JSONL 格式字符串（每行一个 JSON 对象）。
    使用前请先阅读 a2ui-render Skill 了解完整的组件类型和格式规范。

    Args:
        jsonl: A2UI JSONL 格式字符串，包含 beginRendering、surfaceUpdate 等消息
    """
    # 暂停图执行，将 A2UI JSONL 发送给前端
    user_action = interrupt({
        "type": "a2ui_render",
        "payload": jsonl,
    })
    # 用户交互完成后，返回结构化结果给 Agent
    return json.dumps({
        "ui": jsonl,
        "action": user_action,
    })
