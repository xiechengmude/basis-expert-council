"""
BasisPilot (贝领) Agent — 基于 DeepAgents / LangGraph 架构
主入口：创建 BasisPilot AI 教育领航智能体
"""

import os
from pathlib import Path
from typing import Any

from deepagents import create_deep_agent
from deepagents.backends import FilesystemBackend
from langchain.chat_models import init_chat_model

# ---------------------------------------------------------------------------
# Monkey-patch: deepagents _compute_summarization_defaults accesses
# model.profile which newer langchain versions don't have.
# Patch both the source module AND the importing module (deepagents.graph).
# ---------------------------------------------------------------------------
try:
    import deepagents.middleware.summarization as _summ
    import deepagents.graph as _dgraph

    _orig_compute_defaults = _summ._compute_summarization_defaults

    def _safe_compute_defaults(model):
        try:
            return _orig_compute_defaults(model)
        except AttributeError:
            return {
                "trigger": ("tokens", 170000),
                "keep": ("messages", 6),
                "truncate_args_settings": {
                    "trigger": ("messages", 20),
                    "keep": ("messages", 20),
                },
            }

    _summ._compute_summarization_defaults = _safe_compute_defaults
    if hasattr(_dgraph, "_compute_summarization_defaults"):
        _dgraph._compute_summarization_defaults = _safe_compute_defaults
except Exception:
    pass

from .memory_tools import MEMORY_TOOLS
from .a2ui_tool import a2ui_render

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# ---------------------------------------------------------------------------
# 模型配置 — 全部通过环境变量指定
# ---------------------------------------------------------------------------

LEAD_MODEL = os.getenv("BASIS_LEAD_MODEL", "openai:z-ai/glm-5")
SUBAGENT_MODEL = os.getenv("BASIS_SUBAGENT_MODEL", "openai:minimax/minimax-m2.5")

# 各子智能体可单独覆盖，未设置时 fallback 到 SUBAGENT_MODEL
MATH_MODEL = os.getenv("BASIS_MATH_MODEL", SUBAGENT_MODEL)
SCIENCE_MODEL = os.getenv("BASIS_SCIENCE_MODEL", SUBAGENT_MODEL)
HUMANITIES_MODEL = os.getenv("BASIS_HUMANITIES_MODEL", SUBAGENT_MODEL)
CURRICULUM_MODEL = os.getenv("BASIS_CURRICULUM_MODEL", SUBAGENT_MODEL)
BUSINESS_MODEL = os.getenv("BASIS_BUSINESS_MODEL", SUBAGENT_MODEL)
PROBATION_MODEL = os.getenv("BASIS_PROBATION_MODEL", SUBAGENT_MODEL)

# ---------------------------------------------------------------------------
# Subagent 定义
# ---------------------------------------------------------------------------


def _load_subagents():
    """加载所有子智能体，模型从环境变量读取"""
    return [
        {
            "name": "math-expert",
            "description": (
                "BASIS 数学学科专家。处理数学概念讲解、解题辅导、"
                "AP Calculus/Statistics 备考、数学教案生成等深度数学问题。"
            ),
            "system_prompt": (PROJECT_ROOT / "agents" / "math-expert" / "AGENTS.md").read_text(
                encoding="utf-8"
            ),
            "model": MATH_MODEL,
        },
        {
            "name": "science-expert",
            "description": (
                "BASIS 科学学科专家。处理物理、化学、生物概念讲解、"
                "Lab Report 指导、实验设计、AP Science 备考等深度科学问题。"
            ),
            "system_prompt": (PROJECT_ROOT / "agents" / "science-expert" / "AGENTS.md").read_text(
                encoding="utf-8"
            ),
            "model": SCIENCE_MODEL,
        },
        {
            "name": "humanities-expert",
            "description": (
                "BASIS 人文学科专家。处理英语阅读与写作、历史、文学分析、"
                "Essay 写作、DBQ/LEQ、Rhetorical Analysis 等深度人文问题。"
            ),
            "system_prompt": (PROJECT_ROOT / "agents" / "humanities-expert" / "AGENTS.md").read_text(
                encoding="utf-8"
            ),
            "model": HUMANITIES_MODEL,
        },
        {
            "name": "curriculum-advisor",
            "description": (
                "课程规划与升学顾问。处理 AP 选课策略、学术规划、"
                "升学路径、GPA 管理、大学申请策略等综合规划问题。"
            ),
            "system_prompt": (PROJECT_ROOT / "agents" / "curriculum-advisor" / "AGENTS.md").read_text(
                encoding="utf-8"
            ),
            "model": CURRICULUM_MODEL,
        },
        {
            "name": "business-advisor",
            "description": (
                "商务谈判与市场专家。处理中国国际学校市场分析、家长沟通策略、"
                "销售转化、定价策略、B端学校合作谈判、竞品分析等商务问题。"
            ),
            "system_prompt": (PROJECT_ROOT / "agents" / "business-advisor" / "AGENTS.md").read_text(
                encoding="utf-8"
            ),
            "model": BUSINESS_MODEL,
        },
        {
            "name": "probation-advisor",
            "description": (
                "Academic Probation 保级专家。处理 GPA 危机评估、学科优先级排序、"
                "逐周恢复计划、学校沟通策略、Academic Probation 保级方案制定等紧急学术问题。"
            ),
            "system_prompt": (PROJECT_ROOT / "agents" / "probation-advisor" / "AGENTS.md").read_text(
                encoding="utf-8"
            ),
            "model": PROBATION_MODEL,
        },
    ]


# ---------------------------------------------------------------------------
# Agent 工厂
# ---------------------------------------------------------------------------

def _init_model(model_id: str):
    """初始化 LLM 模型，绕过 DeepAgents 对 openai: 前缀的 Responses API 自动启用。

    DeepAgents create_deep_agent() 检测到 "openai:" 前缀时会设置
    use_responses_api=True，但 LiteLLM 代理不支持 OpenAI Responses API，
    导致 tool_calls 全部丢失。这里预先初始化模型对象（use_responses_api=False），
    传入对象而非字符串即可绕过该检测。
    """
    return init_chat_model(model_id, use_responses_api=False)


def create_basis_expert_agent(
    model: str | None = None,
    **kwargs: Any,
):
    """创建 BasisPilot (贝领) 教育领航智能体

    Args:
        model: 主智能体使用的模型。为 None 时从 BASIS_LEAD_MODEL 环境变量读取。
        **kwargs: 传给 create_deep_agent 的其他参数

    Returns:
        编译好的 LangGraph StateGraph
    """
    if model is None:
        model = LEAD_MODEL

    # 预初始化模型对象，避免 DeepAgents 自动启用 Responses API
    model_instance = _init_model(model)

    backend = FilesystemBackend(root_dir=PROJECT_ROOT)
    subagents = _load_subagents()

    agent = create_deep_agent(
        model=model_instance,
        memory=[str(PROJECT_ROOT / "AGENTS.md")],
        skills=[str(PROJECT_ROOT / "skills") + "/"],
        subagents=subagents,
        backend=backend,
        tools=[*MEMORY_TOOLS, a2ui_render],
        **kwargs,
    )

    return agent


# ---------------------------------------------------------------------------
# 独立运行入口
# ---------------------------------------------------------------------------

def main():
    """CLI 模式运行 BasisPilot 贝领"""
    import asyncio

    from dotenv import load_dotenv
    load_dotenv()

    agent = create_basis_expert_agent()

    print("=" * 60)
    print("  BasisPilot · 贝领 — Your AI Co-Pilot Through BASIS")
    print("  Powered by DeepAgents + LangGraph")
    print(f"  Lead Model:     {LEAD_MODEL}")
    print(f"  Subagent Model: {SUBAGENT_MODEL}")
    print("=" * 60)
    print()
    print("  可以问我：")
    print("  - 学科问题（数学/科学/人文，中英双语讲解）")
    print("  - 教学设计（教案生成、课堂活动、EMI 教学法）")
    print("  - AP 备考（选课策略、考试技巧、FRQ 训练）")
    print("  - 学生评估（水平诊断、学习计划、新生衔接）")
    print("  - 升学规划（GPA 管理、大学申请、课外活动）")
    print()
    print("  输入 /quit 退出")
    print("=" * 60)

    async def run():
        thread_id = "basis-expert-session"
        config = {"configurable": {"thread_id": thread_id}}

        while True:
            try:
                user_input = input("\n你: ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\n再见！")
                break

            if not user_input:
                continue
            if user_input.lower() in ("/quit", "/exit", "quit", "exit"):
                print("再见！祝学习顺利！")
                break

            messages = [{"role": "user", "content": user_input}]

            print("\nBASIS 专家: ", end="", flush=True)
            async for event in agent.astream_events(
                {"messages": messages},
                config=config,
                version="v2",
            ):
                kind = event["event"]
                if kind == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        print(content, end="", flush=True)

            print()  # newline after stream

    asyncio.run(run())


if __name__ == "__main__":
    main()
