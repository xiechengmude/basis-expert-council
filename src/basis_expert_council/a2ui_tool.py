"""
A2UI 渲染工具 — 将 Agent 生成的 A2UI JSONL 透传给前端渲染

Agent 通过 a2ui-render Skill 学习 A2UI 协议格式，
然后调用此工具将生成的 JSONL 输出为 ToolMessage，
前端检测 toolCall.name === "a2ui_render" 后渲染为交互组件。
"""

from langchain_core.tools import tool


@tool
def a2ui_render(jsonl: str) -> str:
    """生成 A2UI 交互式 UI 组件。当需要展示测验卡片、进度仪表盘、学习清单等交互组件时使用此工具。

    输入必须是 A2UI JSONL 格式字符串（每行一个 JSON 对象）。
    使用前请先阅读 a2ui-render Skill 了解完整的组件类型和格式规范。

    Args:
        jsonl: A2UI JSONL 格式字符串，包含 beginRendering、surfaceUpdate 等消息
    """
    return jsonl
