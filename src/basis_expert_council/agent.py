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
# Monkey-patch: langchain + deepagents version incompatibility —
# BaseChatModel.__getattr__ raises AttributeError for .profile, ._llm_type
# which both deepagents and langchain middleware try to access.
# ---------------------------------------------------------------------------
_SUMMARIZATION_DEFAULTS = {
    "trigger": ("tokens", 170000),
    "keep": ("messages", 6),
    "truncate_args_settings": {
        "trigger": ("messages", 20),
        "keep": ("messages", 20),
    },
}

try:
    # 1) Patch deepagents _compute_summarization_defaults (accesses model.profile)
    import deepagents.middleware.summarization as _summ
    import deepagents.graph as _dgraph

    _orig_compute_defaults = _summ._compute_summarization_defaults

    def _safe_compute_defaults(model):
        try:
            return _orig_compute_defaults(model)
        except AttributeError:
            return _SUMMARIZATION_DEFAULTS

    _summ._compute_summarization_defaults = _safe_compute_defaults
    if hasattr(_dgraph, "_compute_summarization_defaults"):
        _dgraph._compute_summarization_defaults = _safe_compute_defaults
except Exception:
    pass

try:
    # 2) Patch langchain _get_approximate_token_counter (accesses model._llm_type)
    import langchain.agents.middleware.summarization as _lc_summ

    _orig_get_counter = _lc_summ._get_approximate_token_counter

    def _safe_get_counter(model):
        try:
            return _orig_get_counter(model)
        except AttributeError:
            # Fallback: approximate token count as len(str) / 4
            def _approx(messages):
                return sum(len(str(getattr(m, "content", ""))) // 4 for m in messages)
            return _approx

    _lc_summ._get_approximate_token_counter = _safe_get_counter
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
VISION_MODEL = os.getenv("BASIS_VISION_MODEL", "openai:moonshotai/kimi-k2.5")

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
# 视觉预处理 — 检测图片消息，调 Vision 模型识别后转为文字
# ---------------------------------------------------------------------------

_vision_model = None


def _get_vision_model():
    global _vision_model
    if _vision_model is None:
        _vision_model = init_chat_model(VISION_MODEL, use_responses_api=False)
    return _vision_model


def _has_image_blocks(message) -> bool:
    """检查消息是否包含 image_url blocks"""
    content = getattr(message, "content", None) or (
        message.get("content") if isinstance(message, dict) else None
    )
    if not isinstance(content, list):
        return False
    return any(
        isinstance(b, dict) and b.get("type") == "image_url"
        for b in content
    )


async def _vision_preprocess(state: dict, config=None):
    """如果最新的 human 消息含图片，用 Vision 模型识别后替换为文本描述。"""
    from langchain_core.messages import HumanMessage

    messages = state.get("messages", [])
    if not messages:
        return state

    last_msg = messages[-1]
    if not _has_image_blocks(last_msg):
        return state

    # 提取原始内容
    content = last_msg.content if hasattr(last_msg, "content") else last_msg.get("content", [])
    if not isinstance(content, list):
        return state

    text_parts = [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]
    user_text = " ".join(t for t in text_parts if t).strip() or "请识别并讲解这张图片中的内容"

    # 构建 Vision 模型请求
    vision_prompt = [
        HumanMessage(content=[
            *[b for b in content if isinstance(b, dict) and b.get("type") == "image_url"],
            {"type": "text", "text": (
                "请仔细识别图片中的所有文字、公式、图表和题目内容。"
                "逐字逐句准确还原，保留原始格式和选项。"
                "不要解题，只做 OCR 识别和内容还原。"
            )},
        ])
    ]

    vm = _get_vision_model()
    try:
        response = await vm.ainvoke(vision_prompt)
        ocr_text = response.content if isinstance(response.content, str) else str(response.content)
    except Exception as e:
        ocr_text = f"[图片识别失败: {e}]"

    # 替换最后一条消息为纯文本
    new_content = f"[学生上传了一张图片，以下是图片内容的识别结果]\n\n{ocr_text}\n\n[学生的问题] {user_text}"
    new_messages = list(messages[:-1]) + [HumanMessage(content=new_content)]
    return {**state, "messages": new_messages}


def create_basis_expert_agent_with_vision(**kwargs):
    """带视觉预处理的 BasisPilot Agent"""
    from langgraph.graph import StateGraph, START

    inner_agent = create_basis_expert_agent(**kwargs)

    # 获取内部 Agent 的 state schema
    state_schema = inner_agent.builder.schema_ if hasattr(inner_agent, "builder") else None

    if state_schema is None:
        # Fallback: 直接返回内部 agent，跳过视觉预处理
        return inner_agent

    builder = StateGraph(state_schema)
    builder.add_node("vision_preprocess", _vision_preprocess)
    builder.add_node("agent", inner_agent)
    builder.add_edge(START, "vision_preprocess")
    builder.add_edge("vision_preprocess", "agent")

    return builder.compile()


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
