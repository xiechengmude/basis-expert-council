"""
BASIS Expert Council Agent — 基于 DeepAgents / LangGraph 架构
主入口：创建 BASIS 教育专家智囊团智能体
"""

from pathlib import Path
from typing import Any

from deepagents import create_deep_agent
from deepagents.backends import FilesystemBackend
from langchain_anthropic import ChatAnthropic

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# ---------------------------------------------------------------------------
# Subagent 定义
# ---------------------------------------------------------------------------

SUBAGENTS = [
    {
        "name": "math-expert",
        "description": (
            "BASIS 数学学科专家。处理数学概念讲解、解题辅导、"
            "AP Calculus/Statistics 备考、数学教案生成等深度数学问题。"
        ),
        "system_prompt": (PROJECT_ROOT / "agents" / "math-expert" / "AGENTS.md").read_text(
            encoding="utf-8"
        ),
        "model": "anthropic:claude-sonnet-4-5-20250929",
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
        "model": "anthropic:claude-sonnet-4-5-20250929",
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
        "model": "anthropic:claude-sonnet-4-5-20250929",
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
        "model": "anthropic:claude-sonnet-4-5-20250929",
    },
]


# ---------------------------------------------------------------------------
# Agent 工厂
# ---------------------------------------------------------------------------

def create_basis_expert_agent(
    model: str = "anthropic:claude-sonnet-4-5-20250929",
    **kwargs: Any,
):
    """创建 BASIS 教育专家智囊团智能体

    Args:
        model: 主智能体使用的模型，默认 Claude Sonnet
        **kwargs: 传给 create_deep_agent 的其他参数

    Returns:
        编译好的 LangGraph StateGraph
    """
    backend = FilesystemBackend(root_dir=PROJECT_ROOT)

    agent = create_deep_agent(
        model=model,
        memory=[str(PROJECT_ROOT / "AGENTS.md")],
        skills=[str(PROJECT_ROOT / "skills") + "/"],
        subagents=SUBAGENTS,
        backend=backend,
        **kwargs,
    )

    return agent


# ---------------------------------------------------------------------------
# 独立运行入口
# ---------------------------------------------------------------------------

def main():
    """CLI 模式运行 BASIS 专家智囊团"""
    import asyncio

    agent = create_basis_expert_agent()

    print("=" * 60)
    print("  BASIS 教育专家智囊团 (贝赛思教育体系 AI 顾问)")
    print("  Powered by DeepAgents + LangGraph")
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
