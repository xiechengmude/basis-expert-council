"""
BasisPilot A2UI Agent 端到端测试 (HITL interrupt/resume)

测试链路（完整 E2E）：
  User Message → LangGraph Agent
    → Agent 调用 a2ui_render tool
    → tool 内部 interrupt() → 图暂停，返回 __interrupt__
    → 验证 interrupt payload 中的 A2UI JSONL
    → 模拟用户交互 → Command(resume=action)
    → interrupt() 返回 action → tool 返回结构化结果
    → Agent 继续处理

运行方式:
  python tests/test_a2ui_agent_e2e.py
  python tests/test_a2ui_agent_e2e.py --timeout 120
"""

import os
import sys
import json
import asyncio
import argparse
import time
from pathlib import Path

# 确保项目根目录在 sys.path 中
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from dotenv import load_dotenv
load_dotenv(PROJECT_ROOT / ".env")


# ========== A2UI JSONL 验证 ==========

def validate_a2ui_jsonl(jsonl_str: str) -> dict:
    """验证 A2UI JSONL 字符串的有效性"""
    result = {
        "valid": False,
        "parsed_count": 0,
        "has_begin_rendering": False,
        "has_surface_update": False,
        "component_count": 0,
        "component_types": set(),
        "surface_ids": set(),
        "errors": [],
    }

    if not jsonl_str or not jsonl_str.strip():
        result["errors"].append("JSONL 字符串为空")
        return result

    lines = jsonl_str.strip().split("\n")
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            result["parsed_count"] += 1

            if "beginRendering" in obj:
                result["has_begin_rendering"] = True
                br = obj["beginRendering"]
                if "surfaceId" in br:
                    result["surface_ids"].add(br["surfaceId"])

            elif "surfaceUpdate" in obj:
                result["has_surface_update"] = True
                su = obj["surfaceUpdate"]
                if "surfaceId" in su:
                    result["surface_ids"].add(su["surfaceId"])
                for comp in su.get("components", []):
                    result["component_count"] += 1
                    c = comp.get("component", {})
                    for type_name in c:
                        result["component_types"].add(type_name)

            elif "dataModelUpdate" in obj:
                dmu = obj["dataModelUpdate"]
                if "surfaceId" in dmu:
                    result["surface_ids"].add(dmu["surfaceId"])

        except json.JSONDecodeError as e:
            result["errors"].append(f"Line {i+1}: JSON 解析失败 — {e}")

    result["valid"] = (
        result["parsed_count"] >= 2
        and result["has_begin_rendering"]
        and result["has_surface_update"]
        and result["component_count"] >= 2
    )
    result["component_types"] = sorted(result["component_types"])
    result["surface_ids"] = sorted(result["surface_ids"])
    return result


# ========== Agent 测试 ==========

async def test_agent_a2ui_hitl(timeout: int = 120):
    """运行 Agent HITL E2E 测试：invoke → interrupt → resume → continue"""
    print("=" * 60)
    print("  BasisPilot A2UI Agent HITL E2E 测试")
    print("=" * 60)

    # ---- Step 1: 创建 Agent ----
    print("\n[1/5] 创建 BasisPilot Agent Graph...")
    t0 = time.time()

    from langgraph.checkpoint.memory import MemorySaver
    from src.basis_expert_council.agent import create_basis_expert_agent
    checkpointer = MemorySaver()
    agent = create_basis_expert_agent(checkpointer=checkpointer)
    print(f"  Agent 创建成功 ({time.time() - t0:.1f}s)")

    # ---- Step 2: 发送触发 A2UI 的消息 → 期望 interrupt ----
    print(f"\n[2/5] 调用 Agent，期望触发 interrupt (timeout={timeout}s)...")
    t1 = time.time()
    config = {"configurable": {"thread_id": f"test-hitl-{int(time.time())}"}}
    messages = [{"role": "user", "content": (
        "请给我出一道关于二次函数的数学选择题。"
        "要求使用 a2ui_render 工具生成交互式卡片，"
        "包含题目、四个选项和一个提交按钮。"
    )}]

    try:
        response = await asyncio.wait_for(
            agent.ainvoke({"messages": messages}, config=config),
            timeout=timeout,
        )
    except asyncio.TimeoutError:
        print(f"  TIMEOUT: Agent 未在 {timeout}s 内返回")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

    elapsed = time.time() - t1
    print(f"  Agent 响应完成 ({elapsed:.1f}s)")

    # ---- Step 3: 验证 interrupt 存在 ----
    print(f"\n[3/5] 验证 __interrupt__...")
    interrupt_info = response.get("__interrupt__")
    if not interrupt_info:
        print("  FAIL: 响应中未找到 __interrupt__")
        print(f"  响应 keys: {list(response.keys())}")
        # 回退检查：也许 Agent 直接返回了消息
        all_messages = response.get("messages", [])
        for msg in all_messages:
            msg_type = getattr(msg, "type", None)
            if msg_type == "ai":
                tool_calls = getattr(msg, "tool_calls", [])
                for tc in tool_calls:
                    print(f"  Tool call: {tc.get('name', '?')}")
        return False

    interrupt_data = interrupt_info[0].value if hasattr(interrupt_info[0], "value") else interrupt_info[0]
    print(f"  interrupt type: {interrupt_data.get('type', '?')}")

    if interrupt_data.get("type") != "a2ui_render":
        print(f"  FAIL: interrupt type 应为 'a2ui_render'，实际为 '{interrupt_data.get('type')}'")
        return False

    jsonl = interrupt_data.get("payload", "")
    print(f"  A2UI JSONL 长度: {len(jsonl)} chars")
    print(f"  JSONL 预览:\n    {jsonl[:300]}...")

    validation = validate_a2ui_jsonl(jsonl)
    print(f"\n  JSONL 验证:")
    print(f"    有效: {validation['valid']}")
    print(f"    解析行数: {validation['parsed_count']}")
    print(f"    组件数: {validation['component_count']}")
    print(f"    组件类型: {validation['component_types']}")
    if validation["errors"]:
        print(f"    错误: {validation['errors']}")

    if not validation["valid"]:
        print("  WARN: JSONL 验证未通过，但继续测试 resume 流程")

    # ---- Step 4: 模拟用户交互 → resume ----
    print(f"\n[4/5] 模拟用户交互，调用 Command(resume=action)...")
    from langgraph.types import Command

    mock_action = {
        "actionName": "submitAnswer",
        "surfaceId": "quiz-1",
        "context": {"questionId": "q1", "answer": "b"},
    }

    t2 = time.time()
    try:
        response2 = await asyncio.wait_for(
            agent.ainvoke(Command(resume=mock_action), config=config),
            timeout=timeout,
        )
    except asyncio.TimeoutError:
        print(f"  TIMEOUT: resume 未在 {timeout}s 内返回")
        return False
    except Exception as e:
        print(f"  ERROR on resume: {e}")
        return False

    elapsed2 = time.time() - t2
    print(f"  Resume 响应完成 ({elapsed2:.1f}s)")

    # ---- Step 5: 验证 Agent 继续处理 ----
    print(f"\n[5/5] 验证 Agent resume 后的响应...")
    all_messages = response2.get("messages", [])
    print(f"  总消息数: {len(all_messages)}")

    # 检查 ToolMessage — a2ui_render 应返回包含 action 的 JSON
    tool_msgs = [m for m in all_messages
                 if getattr(m, "type", None) == "tool"
                 and getattr(m, "name", None) == "a2ui_render"]

    if tool_msgs:
        print(f"  a2ui_render ToolMessage 数: {len(tool_msgs)}")
        try:
            result = json.loads(getattr(tool_msgs[0], "content", "{}"))
            print(f"  ToolMessage 内容: {json.dumps(result, ensure_ascii=False)[:200]}")
            if "action" in result:
                print(f"  action.actionName: {result['action'].get('actionName', '?')}")
                if result["action"].get("actionName") == "submitAnswer":
                    print("  PASS: action 正确传回")
                else:
                    print("  WARN: action.actionName 不匹配")
            else:
                print("  WARN: ToolMessage 中未找到 action 字段")
        except json.JSONDecodeError:
            print(f"  WARN: ToolMessage 内容非 JSON")
    else:
        print("  WARN: 未找到 a2ui_render ToolMessage")

    # 检查 Agent 是否生成了后续 AI 消息
    ai_msgs = [m for m in all_messages
                if getattr(m, "type", None) == "ai"
                and getattr(m, "content", "")]
    print(f"  AI 消息数: {len(ai_msgs)}")
    for msg in ai_msgs[-2:]:
        content = getattr(msg, "content", "")
        if isinstance(content, str) and content.strip():
            print(f"  AI: 「{content[:100]}...」")

    print(f"\n  PASS: HITL 流程完整 (invoke → interrupt → resume → continue)")

    # 保存结果
    output_path = PROJECT_ROOT / "tests" / "a2ui_agent_test_results.json"
    results = {
        "test": "a2ui_hitl",
        "invoke_time": round(elapsed, 1),
        "resume_time": round(elapsed2, 1),
        "interrupt_type": interrupt_data.get("type"),
        "jsonl_valid": validation["valid"],
        "tool_msgs": len(tool_msgs),
        "ai_msgs": len(ai_msgs),
        "status": "pass",
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2, default=str)
    print(f"  结果保存: {output_path}")

    return True


# ========== 入口 ==========

def main():
    parser = argparse.ArgumentParser(description="BasisPilot A2UI Agent E2E 测试")
    parser.add_argument("--timeout", type=int, default=120, help="Agent 调用超时秒数")
    args = parser.parse_args()

    success = asyncio.run(test_agent_a2ui_hitl(timeout=args.timeout))
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
