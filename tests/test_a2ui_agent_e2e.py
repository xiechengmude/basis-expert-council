"""
BasisPilot A2UI Agent 端到端测试
测试真实 Agent Graph 是否正确调用 a2ui_render 工具

测试链路（完整 E2E）：
  User Message → LangGraph Agent (DeepAgents + SkillsMiddleware)
    → Agent 读取 a2ui-render Skill
    → Agent 生成 A2UI JSONL
    → Agent 调用 a2ui_render tool
    → ToolMessage(name="a2ui_render", content=jsonl)
    → 验证 JSONL 格式正确性

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

async def test_agent_a2ui(timeout: int = 120):
    """运行 Agent E2E 测试"""
    print("=" * 60)
    print("  BasisPilot A2UI Agent E2E 测试")
    print("=" * 60)

    # ---- Step 1: 创建 Agent ----
    print("\n[1/4] 创建 BasisPilot Agent Graph...")
    t0 = time.time()

    from src.basis_expert_council.agent import create_basis_expert_agent
    agent = create_basis_expert_agent()
    print(f"  Agent 创建成功 ({time.time() - t0:.1f}s)")

    # ---- Step 2: 发送触发 A2UI 的消息 ----
    test_cases = [
        {
            "name": "数学选择题",
            "message": (
                "请给我出一道关于二次函数的数学选择题。"
                "要求使用 a2ui_render 工具生成交互式卡片，"
                "包含题目、四个选项和一个提交按钮。"
            ),
            "expected_types": ["Card", "MultipleChoice", "Button", "Text"],
        },
    ]

    results = []
    for case in test_cases:
        print(f"\n[2/4] 测试用例: {case['name']}")
        print(f"  用户消息: {case['message'][:60]}...")

        # ---- Step 3: 调用 Agent ----
        print(f"\n[3/4] 调用 Agent (timeout={timeout}s)...")
        t1 = time.time()
        config = {"configurable": {"thread_id": f"test-a2ui-{int(time.time())}"}}
        messages = [{"role": "user", "content": case["message"]}]

        try:
            response = await asyncio.wait_for(
                agent.ainvoke({"messages": messages}, config=config),
                timeout=timeout,
            )
        except asyncio.TimeoutError:
            print(f"  TIMEOUT: Agent 未在 {timeout}s 内返回")
            results.append({"name": case["name"], "status": "timeout"})
            continue
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({"name": case["name"], "status": "error", "error": str(e)})
            continue

        elapsed = time.time() - t1
        print(f"  Agent 响应完成 ({elapsed:.1f}s)")

        # ---- Step 4: 分析输出消息 ----
        print(f"\n[4/4] 分析 Agent 输出消息...")
        all_messages = response.get("messages", [])
        print(f"  总消息数: {len(all_messages)}")

        # 找 a2ui_render tool call
        a2ui_tool_calls = []
        a2ui_tool_results = []
        text_content = []

        for msg in all_messages:
            msg_type = getattr(msg, "type", None)
            msg_name = getattr(msg, "name", None)

            # 收集 AI 消息文本
            if msg_type == "ai":
                content = getattr(msg, "content", "")
                if isinstance(content, str) and content.strip():
                    text_content.append(content[:100])

                # 检查 tool_calls
                tool_calls = getattr(msg, "tool_calls", [])
                if tool_calls:
                    for tc in tool_calls:
                        tc_name = tc.get("name", "")
                        print(f"  Tool call: {tc_name}")
                        if tc_name == "a2ui_render":
                            a2ui_tool_calls.append(tc)

            # 检查 ToolMessage
            elif msg_type == "tool" and msg_name == "a2ui_render":
                content = getattr(msg, "content", "")
                a2ui_tool_results.append(content)
                print(f"  ToolMessage(a2ui_render): {len(content)} chars")

        # 打印消息摘要
        if text_content:
            print(f"\n  AI 文本片段:")
            for t in text_content[:3]:
                print(f"    「{t}...」")

        # ---- 验证 ----
        case_result = {
            "name": case["name"],
            "elapsed": round(elapsed, 1),
            "total_messages": len(all_messages),
            "a2ui_tool_calls": len(a2ui_tool_calls),
            "a2ui_tool_results": len(a2ui_tool_results),
        }

        if a2ui_tool_calls:
            print(f"\n  a2ui_render tool call 找到: {len(a2ui_tool_calls)}")
            jsonl = a2ui_tool_calls[0].get("args", {}).get("jsonl", "")
            print(f"  JSONL 长度: {len(jsonl)} chars")
            print(f"  JSONL 预览:\n    {jsonl[:300]}...")

            validation = validate_a2ui_jsonl(jsonl)
            case_result["validation"] = validation
            print(f"\n  验证结果:")
            print(f"    有效: {validation['valid']}")
            print(f"    解析行数: {validation['parsed_count']}")
            print(f"    beginRendering: {validation['has_begin_rendering']}")
            print(f"    surfaceUpdate: {validation['has_surface_update']}")
            print(f"    组件数: {validation['component_count']}")
            print(f"    组件类型: {validation['component_types']}")
            print(f"    Surface IDs: {validation['surface_ids']}")
            if validation["errors"]:
                print(f"    错误: {validation['errors']}")

            case_result["status"] = "pass" if validation["valid"] else "partial"
        else:
            print(f"\n  未找到 a2ui_render tool call!")
            if a2ui_tool_results:
                print(f"  但找到 {len(a2ui_tool_results)} 个 ToolMessage 结果")
            case_result["status"] = "fail"
            case_result["reason"] = "Agent 未调用 a2ui_render 工具"

        results.append(case_result)

    # ---- 汇总 ----
    print("\n" + "=" * 60)
    print("  测试汇总")
    print("=" * 60)
    passed = sum(1 for r in results if r.get("status") == "pass")
    total = len(results)
    for r in results:
        status_icon = {"pass": "PASS", "partial": "WARN", "fail": "FAIL", "timeout": "TIME", "error": "ERR"}.get(r["status"], "?")
        print(f"  [{status_icon}] {r['name']} ({r.get('elapsed', '?')}s)")
        if r.get("reason"):
            print(f"        原因: {r['reason']}")
    print(f"\n  通过: {passed}/{total}")

    # 保存结果
    output_path = PROJECT_ROOT / "tests" / "a2ui_agent_test_results.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2, default=str)
    print(f"  结果保存: {output_path}")

    return passed == total


# ========== 入口 ==========

def main():
    parser = argparse.ArgumentParser(description="BasisPilot A2UI Agent E2E 测试")
    parser.add_argument("--timeout", type=int, default=120, help="Agent 调用超时秒数")
    args = parser.parse_args()

    success = asyncio.run(test_agent_a2ui(timeout=args.timeout))
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
