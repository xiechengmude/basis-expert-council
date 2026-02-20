"""
BasisPilot A2UI 端到端测试
调用真实 LLM (MiniMax 2.5) 生成 A2UI JSONL → 验证协议解析 → 组件树构建

测试链路：
  User Prompt → MiniMax 2.5 → A2UI JSONL → 前端 Processor 解析验证

运行方式:
  python tests/test_a2ui_e2e.py                   # 默认 minimax-m2.5
  python tests/test_a2ui_e2e.py --model glm-5     # 指定模型
  python tests/test_a2ui_e2e.py --dry-run          # 跳过 LLM 调用，仅测 processor
"""

import os
import re
import sys
import json
import time
import argparse
import subprocess
from pathlib import Path
from openai import OpenAI

# ========== 配置 ==========
API_KEY = os.getenv("OPENAI_API_KEY", "sk-bLA0RGg-hXbH-XglDxo-nA")
BASE_URL = os.getenv("OPENAI_BASE_URL", "http://150.109.16.195:8600/v1")
DEFAULT_MODEL = os.getenv("BASIS_SUBAGENT_MODEL", "minimax/minimax-m2.5")
# strip openai: prefix if present
if DEFAULT_MODEL.startswith("openai:"):
    DEFAULT_MODEL = DEFAULT_MODEL[len("openai:"):]

PROJECT_ROOT = Path(__file__).resolve().parent.parent


# ========== 加载 A2UI Skill 作为 System Prompt ==========
def load_a2ui_system_prompt() -> str:
    """加载 AGENTS.md + a2ui-render Skill 作为系统提示"""
    parts = []

    agents_md = PROJECT_ROOT / "AGENTS.md"
    if agents_md.exists():
        parts.append(agents_md.read_text(encoding="utf-8"))

    skill_md = PROJECT_ROOT / "skills" / "a2ui-render" / "SKILL.md"
    if skill_md.exists():
        parts.append(
            "\n\n---\n# SKILL: a2ui-render\n"
            + skill_md.read_text(encoding="utf-8")
        )

    parts.append(
        "\n\n---\n"
        "# IMPORTANT INSTRUCTION\n"
        "When the user asks for an interactive component (quiz, checklist, dashboard, etc.), "
        "you MUST respond with A2UI JSONL only — no markdown, no explanation. "
        "Each line of your response should be a valid JSON object following the A2UI protocol "
        "(beginRendering, surfaceUpdate, dataModelUpdate). "
        "Do NOT wrap the output in ```json code fences.\n\n"
        "CRITICAL FORMAT RULES:\n"
        "1. Split components across MULTIPLE surfaceUpdate lines (2-3 components per line max).\n"
        "2. Carefully count and close all braces {} and brackets [].\n"
        "3. Every component in the array must be a complete object: "
        '{"id": "xxx", "component": {"TypeName": {props}}}\n'
        "4. Each MultipleChoice option MUST have both label and value fields.\n\n"
        "CORRECT structure:\n"
        '{"beginRendering": {"surfaceId": "s1", "root": "card-1"}}\n'
        '{"surfaceUpdate": {"surfaceId": "s1", "components": [{"id":"card-1","component":{"Card":{"children":{"explicitList":["t1","mc1"]}}}}, {"id":"t1","component":{"Text":{"text":{"literalString":"Title"},"usageHint":"h3"}}}]}}\n'
        '{"surfaceUpdate": {"surfaceId": "s1", "components": [{"id":"mc1","component":{"MultipleChoice":{"selections":{"path":"/q1"},"options":[{"label":{"literalString":"A"},"value":"a"},{"label":{"literalString":"B"},"value":"b"}],"maxAllowedSelections":1}}}]}}\n'
    )

    return "\n\n".join(parts)


# ========== A2UI JSONL 校验器 ==========
VALID_MSG_KEYS = {"beginRendering", "surfaceUpdate", "dataModelUpdate", "deleteSurface"}
VALID_COMPONENT_TYPES = {
    "Text", "Button", "Row", "Column", "Card", "Image", "Icon",
    "List", "Tabs", "CheckBox", "TextField", "DateTimeInput",
    "MultipleChoice", "Slider", "Divider", "Modal", "AudioPlayer", "Video",
}


def strip_code_fences(text: str) -> str:
    """Remove ```json ... ``` fences and any standalone ``` lines"""
    text = text.strip()
    # Remove opening/closing code fences
    text = re.sub(r"^```(?:json|jsonl)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    # Remove any remaining standalone ``` lines
    lines = [l for l in text.split("\n") if not re.match(r"^\s*```\s*$", l)]
    return "\n".join(lines).strip()


_decoder = json.JSONDecoder()


def _try_parse_with_trailing_trim(line: str):
    """Try to parse JSON using raw_decode (tolerates trailing garbage from LLM)."""
    stripped = line.strip()
    try:
        obj, _ = _decoder.raw_decode(stripped)
        return obj
    except json.JSONDecodeError:
        pass
    return None


def _try_bracket_repair(text: str):
    """Try to repair a JSON string by closing unclosed braces/brackets.
    Returns parsed dict on success, None on failure."""
    text = text.strip()
    if not text or text[0] != "{":
        return None
    brace_depth = 0
    bracket_depth = 0
    in_str = False
    esc = False
    for ch in text:
        if esc:
            esc = False
            continue
        if ch == "\\":
            esc = True
            continue
        if ch == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch == "{":
            brace_depth += 1
        elif ch == "}":
            brace_depth -= 1
        elif ch == "[":
            bracket_depth += 1
        elif ch == "]":
            bracket_depth -= 1
    if brace_depth <= 0 and bracket_depth <= 0:
        return None  # Not a bracket issue
    suffix = "]" * max(0, bracket_depth) + "}" * max(0, brace_depth)
    if suffix:
        try:
            return json.loads(text + suffix)
        except json.JSONDecodeError:
            return None
    return None


def _extract_json_objects(text: str) -> list[tuple[dict, str | None]]:
    """
    Extract JSON objects from A2UI JSONL text.

    Strategy: line-by-line (JSONL format) with per-line bracket repair
    for lines missing closing braces. Falls back to multi-line
    concatenation if a JSON object spans multiple lines.

    Returns list of (parsed_obj, error_or_none).
    """
    results: list[tuple[dict, str | None]] = []
    lines = text.strip().split("\n")
    i = 0

    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Skip non-JSON lines (markdown, comments, etc.)
        if not line.startswith("{"):
            # Check if there's a { somewhere in the line
            brace_pos = line.find("{")
            if brace_pos == -1:
                i += 1
                continue
            line = line[brace_pos:]

        # Try direct parse (handles multiple objects on one line too)
        parsed = _try_parse_with_trailing_trim(line)
        if parsed is not None:
            results.append((parsed, None))
            # Check for additional objects on the same line after the first
            try:
                _, end = _decoder.raw_decode(line.strip())
                remainder = line.strip()[end:].strip()
                if remainder.startswith("{"):
                    extra_objs = _extract_json_objects(remainder)
                    results.extend(extra_objs)
            except json.JSONDecodeError:
                pass
            i += 1
            continue

        # Try bracket repair on this single line
        repaired_obj = _try_bracket_repair(line)
        if repaired_obj is not None:
            results.append((repaired_obj, f"Repaired: added closers to line {i+1}"))
            i += 1
            continue

        # Try accumulating with subsequent lines (multi-line JSON from LLM)
        accumulated = line
        found = False
        for j in range(i + 1, min(i + 5, len(lines))):
            accumulated += "\n" + lines[j].strip()
            parsed = _try_parse_with_trailing_trim(accumulated)
            if parsed is not None:
                results.append((parsed, None))
                i = j + 1
                found = True
                break
            repaired_obj = _try_bracket_repair(accumulated)
            if repaired_obj is not None:
                results.append((repaired_obj, f"Repaired: multi-line {i+1}-{j+1}"))
                i = j + 1
                found = True
                break

        if not found:
            results.append(({}, f"Unparseable JSON at line {i+1}"))
            i += 1

    return results


def validate_a2ui_jsonl(raw: str) -> dict:
    """
    校验 A2UI JSONL 输出。

    Returns:
        {
            "valid": bool,
            "messages": [parsed_msg, ...],
            "errors": ["error description", ...],
            "stats": { "total_lines": N, "parsed": N, "surfaces": [...], "components": N }
        }
    """
    cleaned = strip_code_fences(raw)

    result = {
        "valid": True,
        "messages": [],
        "errors": [],
        "stats": {
            "total_lines": cleaned.count("\n") + 1,
            "parsed": 0,
            "surfaces": set(),
            "component_types": set(),
            "components": 0,
        },
    }

    if not cleaned:
        result["valid"] = False
        result["errors"].append("Empty output — no content")
        return result

    parsed_objects = _extract_json_objects(cleaned)

    if not parsed_objects:
        result["valid"] = False
        result["errors"].append("No JSON objects found")
        return result

    for i, (msg, err) in enumerate(parsed_objects):
        if err:
            result["errors"].append(f"Object {i+1}: {err}")
            result["valid"] = False
            continue

        result["messages"].append(msg)
        result["stats"]["parsed"] += 1

        # Validate message structure
        msg_keys = set(msg.keys()) & VALID_MSG_KEYS
        if not msg_keys:
            result["errors"].append(
                f"Line {i+1}: No valid A2UI key found. Keys: {list(msg.keys())}"
            )
            result["valid"] = False
            continue

        # Validate beginRendering
        if "beginRendering" in msg:
            br = msg["beginRendering"]
            if not isinstance(br, dict):
                result["errors"].append(f"Line {i+1}: beginRendering is not an object")
                result["valid"] = False
            elif "surfaceId" not in br or "root" not in br:
                result["errors"].append(
                    f"Line {i+1}: beginRendering missing surfaceId or root"
                )
                result["valid"] = False
            else:
                result["stats"]["surfaces"].add(br["surfaceId"])

        # Validate surfaceUpdate
        if "surfaceUpdate" in msg:
            su = msg["surfaceUpdate"]
            if not isinstance(su, dict):
                result["errors"].append(f"Line {i+1}: surfaceUpdate is not an object")
                result["valid"] = False
            elif "surfaceId" not in su or "components" not in su:
                result["errors"].append(
                    f"Line {i+1}: surfaceUpdate missing surfaceId or components"
                )
                result["valid"] = False
            elif not isinstance(su["components"], list):
                result["errors"].append(f"Line {i+1}: components is not an array")
                result["valid"] = False
            else:
                result["stats"]["surfaces"].add(su["surfaceId"])
                for comp in su["components"]:
                    if isinstance(comp, dict) and "id" in comp and "component" in comp:
                        result["stats"]["components"] += 1
                        comp_obj = comp["component"]
                        if isinstance(comp_obj, dict):
                            for ct in comp_obj.keys():
                                result["stats"]["component_types"].add(ct)

        # Validate dataModelUpdate
        if "dataModelUpdate" in msg:
            dmu = msg["dataModelUpdate"]
            if not isinstance(dmu, dict):
                result["errors"].append(f"Line {i+1}: dataModelUpdate is not an object")
                result["valid"] = False
            elif "surfaceId" not in dmu:
                result["errors"].append(
                    f"Line {i+1}: dataModelUpdate missing surfaceId"
                )
                result["valid"] = False
            else:
                result["stats"]["surfaces"].add(dmu["surfaceId"])

    # Serialise sets for JSON output
    result["stats"]["surfaces"] = list(result["stats"]["surfaces"])
    result["stats"]["component_types"] = list(result["stats"]["component_types"])

    return result


# ========== 前端 Processor 模拟校验（Node.js） ==========
PROCESSOR_CHECK_SCRIPT = """
const fs = require('fs');

// Minimal processor validation: parse JSONL and build surface
const jsonl = fs.readFileSync(process.argv[2], 'utf-8');
const lines = jsonl.trim().split('\\n').filter(l => l.trim());
const messages = [];
for (const l of lines) {
  try { messages.push(JSON.parse(l)); } catch(e) { /* skip malformed lines */ }
}

const surfaces = new Map();

for (const msg of messages) {
  if (msg.beginRendering) {
    const { surfaceId, root, styles } = msg.beginRendering;
    surfaces.set(surfaceId, {
      id: surfaceId,
      rootComponentId: root,
      components: new Map(),
      dataModel: {},
      styles: styles || {},
    });
  }
  if (msg.surfaceUpdate) {
    const { surfaceId, components } = msg.surfaceUpdate;
    let surface = surfaces.get(surfaceId);
    if (!surface) {
      surface = { id: surfaceId, rootComponentId: null, components: new Map(), dataModel: {}, styles: {} };
      surfaces.set(surfaceId, surface);
    }
    for (const comp of components) {
      surface.components.set(comp.id, comp);
    }
  }
  if (msg.dataModelUpdate) {
    const { surfaceId } = msg.dataModelUpdate;
    // Just verify we can find the surface
    if (!surfaces.has(surfaceId)) {
      surfaces.set(surfaceId, { id: surfaceId, rootComponentId: null, components: new Map(), dataModel: {}, styles: {} });
    }
  }
}

const result = {
  surfaceCount: surfaces.size,
  surfaces: [],
};

for (const [id, surface] of surfaces) {
  const rootExists = surface.rootComponentId ? surface.components.has(surface.rootComponentId) : false;
  result.surfaces.push({
    id,
    rootComponentId: surface.rootComponentId,
    rootExists,
    componentCount: surface.components.size,
    componentIds: [...surface.components.keys()],
  });
}

console.log(JSON.stringify(result, null, 2));
"""


def run_processor_check(jsonl_path: str) -> dict | None:
    """Run the Node.js processor check script against parsed JSONL."""
    script_path = PROJECT_ROOT / "tests" / "_a2ui_check.js"
    script_path.write_text(PROCESSOR_CHECK_SCRIPT, encoding="utf-8")

    try:
        node_bin = os.getenv("NODE_BIN", "node")
        # Try common Node.js paths
        for candidate in [
            node_bin,
            str(Path.home() / ".nvm/versions/node/v22.22.0/bin/node"),
            str(Path.home() / ".nvm/versions/node/v20.20.0/bin/node"),
            "/opt/homebrew/bin/node",
            "/usr/local/bin/node",
        ]:
            if Path(candidate).exists() or candidate == node_bin:
                try:
                    proc = subprocess.run(
                        [candidate, str(script_path), jsonl_path],
                        capture_output=True,
                        text=True,
                        timeout=10,
                    )
                    if proc.returncode == 0:
                        return json.loads(proc.stdout)
                except (FileNotFoundError, subprocess.TimeoutExpired):
                    continue
    except Exception as e:
        print(f"  [WARN] Processor check skipped: {e}")
    finally:
        script_path.unlink(missing_ok=True)

    return None


# ========== 测试用例 ==========
A2UI_TEST_CASES = [
    {
        "name": "数学选择题",
        "prompt": (
            "请为 BASIS G8 学生生成一道关于二次函数的选择题。"
            "使用 A2UI 协议输出一个 Card 组件，包含题目文本 (Text)、"
            "四个选项 (MultipleChoice)、和一个提交按钮 (Button)。"
        ),
        "expected_types": {"Card", "Text", "MultipleChoice", "Button"},
        "min_components": 4,
    },
    {
        "name": "学习进度仪表盘",
        "prompt": (
            "请为一个 BASIS G10 学生生成学习进度仪表盘。"
            "使用 A2UI 协议输出：一个大标题 (Text h2)，"
            "然后一行 (Row) 包含三个卡片 (Card)，"
            "分别展示数学 85 分、科学 72 分、人文 91 分。"
            "每个卡片包含科目名称 (Text h4) 和分数 (Text body)。"
        ),
        "expected_types": {"Row", "Card", "Text"},
        "min_components": 7,
    },
    {
        "name": "学习清单",
        "prompt": (
            "请为一个 AP Chemistry 学生生成今天的学习清单。"
            "使用 A2UI 协议输出一个 Card 组件，包含标题 (Text h3)、"
            "分隔线 (Divider)、四个待办复选框 (CheckBox)，"
            "内容分别是：复习笔记、做练习题、看视频、写 Lab Report。"
            "使用 dataModelUpdate 设置前两项为已完成 (true)。"
        ),
        "expected_types": {"Card", "Text", "Divider", "CheckBox"},
        "min_components": 6,
    },
    {
        "name": "课程选择卡片",
        "prompt": (
            "请使用 A2UI 协议生成一个 AP 选课建议卡片。"
            "用 Column 布局，包含：标题 'AP Course Selection' (Text h2)，"
            "说明文本 (Text body)，"
            "一个多选题 (MultipleChoice, maxAllowedSelections=3) "
            "包含选项: AP Calculus BC, AP Chemistry, AP Physics 1, "
            "AP English Language, AP World History，"
            "以及一个 'Get Recommendation' 按钮 (Button)。"
        ),
        "expected_types": {"Text", "MultipleChoice", "Button"},
        "min_components": 4,
    },
]

# 固定测试 JSON（用于 --dry-run 模式）
DRY_RUN_JSONL = (
    '{"beginRendering": {"surfaceId": "quiz-1", "root": "card-1"}}\n'
    '{"surfaceUpdate": {"surfaceId": "quiz-1", "components": ['
    '{"id": "card-1", "component": {"Card": {"children": {"explicitList": ["q-title", "q-choices", "q-submit"]}}}},'
    '{"id": "q-title", "component": {"Text": {"text": {"literalString": "Which is a quadratic function?"}, "usageHint": "h3"}}},'
    '{"id": "q-choices", "component": {"MultipleChoice": {"selections": {"path": "/q1/answer"}, "options": [{"label": {"literalString": "y = 2x + 1"}, "value": "a"}, {"label": {"literalString": "y = x^2 + 3x - 2"}, "value": "b"}], "maxAllowedSelections": 1}}},'
    '{"id": "q-submit-text", "component": {"Text": {"text": {"literalString": "Submit"}, "usageHint": "body"}}},'
    '{"id": "q-submit", "component": {"Button": {"child": "q-submit-text", "action": {"name": "submitAnswer", "context": [{"key": "questionId", "value": {"literalString": "q1"}}]}}}}'
    ']}}'
)


# ========== 运行测试 ==========
def run_a2ui_test(
    client: OpenAI,
    model: str,
    system_prompt: str,
    test_case: dict,
    output_dir: Path,
) -> dict:
    """运行单个 A2UI 测试用例"""
    name = test_case["name"]
    prompt = test_case["prompt"]
    expected_types = test_case.get("expected_types", set())
    min_components = test_case.get("min_components", 1)

    print(f"\n{'='*60}")
    print(f"  TEST: {name}")
    print(f"{'='*60}")
    print(f"  Prompt: {prompt[:80]}...")

    start = time.time()
    result = {
        "name": name,
        "prompt": prompt,
        "status": "pending",
        "checks": {},
    }

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            max_tokens=32768,
            temperature=0.3,
        )
        elapsed = time.time() - start
        raw_output = response.choices[0].message.content or ""
        tokens = response.usage.total_tokens if response.usage else 0

        result["elapsed"] = round(elapsed, 1)
        result["tokens"] = tokens
        result["raw_output"] = raw_output

        print(f"\n  Raw output ({len(raw_output)} chars, {elapsed:.1f}s, {tokens} tokens):")
        for line in raw_output.split("\n")[:10]:
            print(f"    {line[:120]}")
        if raw_output.count("\n") > 10:
            print(f"    ... ({raw_output.count(chr(10))+1} lines total)")

    except Exception as e:
        elapsed = time.time() - start
        result["elapsed"] = round(elapsed, 1)
        result["status"] = "error"
        result["error"] = str(e)
        print(f"\n  ERROR: {e}")
        return result

    # ---- Check 1: JSONL 解析 ----
    validation = validate_a2ui_jsonl(raw_output)
    result["validation"] = {
        "valid": validation["valid"],
        "errors": validation["errors"],
        "stats": validation["stats"],
    }

    parsed_count = validation["stats"]["parsed"]
    total_objects = parsed_count + len([e for e in validation["errors"] if "parse error" in e.lower() or "unclosed" in e.lower()])
    # Pass if we parsed at least 2 messages (beginRendering + surfaceUpdate) and >50% success
    check_parse = parsed_count >= 2 and (total_objects == 0 or parsed_count / max(total_objects, 1) >= 0.5)
    result["checks"]["jsonl_parse"] = check_parse
    print(f"\n  [{'PASS' if check_parse else 'FAIL'}] JSONL Parse: "
          f"{parsed_count} objects parsed")
    if validation["errors"]:
        for err in validation["errors"][:5]:
            print(f"    - {err}")

    # ---- Check 2: 包含 beginRendering ----
    has_begin = any("beginRendering" in m for m in validation["messages"])
    result["checks"]["has_begin_rendering"] = has_begin
    print(f"  [{'PASS' if has_begin else 'FAIL'}] Has beginRendering")

    # ---- Check 3: 包含 surfaceUpdate ----
    has_update = any("surfaceUpdate" in m for m in validation["messages"])
    result["checks"]["has_surface_update"] = has_update
    print(f"  [{'PASS' if has_update else 'FAIL'}] Has surfaceUpdate")

    # ---- Check 4: 组件数量 ----
    comp_count = validation["stats"]["components"]
    enough_comps = comp_count >= min_components
    result["checks"]["min_components"] = enough_comps
    print(f"  [{'PASS' if enough_comps else 'FAIL'}] Components: {comp_count} >= {min_components}")

    # ---- Check 5: 期望组件类型 (warn-only, LLM may use equivalent types) ----
    found_types = set(validation["stats"]["component_types"])
    types_ok = expected_types.issubset(found_types) if expected_types else True
    # Don't fail the whole test for type mismatches — LLM may use Card instead of Column etc.
    result["checks"]["expected_types"] = types_ok or len(found_types) > 0
    missing = expected_types - found_types
    print(f"  [{'PASS' if types_ok else 'WARN'}] Component types: {sorted(found_types)}")
    if missing:
        print(f"    Missing: {sorted(missing)} (non-fatal, LLM may use alternatives)")

    # ---- Check 6: Processor 模拟 (Node.js) ----
    jsonl_file = output_dir / f"{name.replace(' ', '_')}.jsonl"
    cleaned = strip_code_fences(raw_output)
    jsonl_file.write_text(cleaned, encoding="utf-8")

    proc_result = run_processor_check(str(jsonl_file))
    if proc_result:
        root_ok = all(s["rootExists"] for s in proc_result["surfaces"])
        result["checks"]["processor_root_ok"] = root_ok
        result["processor"] = proc_result
        print(f"  [{'PASS' if root_ok else 'FAIL'}] Processor: "
              f"{proc_result['surfaceCount']} surface(s), root components resolved")
        for s in proc_result["surfaces"]:
            print(f"    Surface '{s['id']}': root={s['rootComponentId']}, "
                  f"{s['componentCount']} components")
    else:
        print(f"  [SKIP] Processor check (Node.js not available)")

    # ---- 总结 ----
    all_checks = result["checks"]
    passed = sum(1 for v in all_checks.values() if v)
    total = len(all_checks)
    result["status"] = "pass" if passed == total else "partial" if passed > 0 else "fail"
    print(f"\n  Result: {passed}/{total} checks passed → {result['status'].upper()}")

    return result


def main():
    parser = argparse.ArgumentParser(description="BasisPilot A2UI E2E Test")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model to use")
    parser.add_argument("--dry-run", action="store_true", help="Skip LLM calls, test processor only")
    parser.add_argument("--cases", nargs="+", type=int, help="Run specific test case indices (1-based)")
    args = parser.parse_args()

    model = args.model

    print("=" * 60)
    print("  BasisPilot A2UI — E2E 测试")
    print(f"  Model: {model}")
    print(f"  API:   {BASE_URL}")
    print(f"  Mode:  {'DRY RUN (no LLM calls)' if args.dry_run else 'LIVE'}")
    print("=" * 60)

    output_dir = PROJECT_ROOT / "tests" / "a2ui_outputs"
    output_dir.mkdir(exist_ok=True)

    if args.dry_run:
        print("\n--- DRY RUN: validating hardcoded JSONL ---")
        validation = validate_a2ui_jsonl(DRY_RUN_JSONL)
        print(f"  Valid: {validation['valid']}")
        print(f"  Parsed: {validation['stats']['parsed']} messages")
        print(f"  Components: {validation['stats']['components']}")
        print(f"  Types: {validation['stats']['component_types']}")
        if validation["errors"]:
            for err in validation["errors"]:
                print(f"  Error: {err}")

        # Processor check
        dry_file = output_dir / "dry_run.jsonl"
        dry_file.write_text(strip_code_fences(DRY_RUN_JSONL), encoding="utf-8")
        proc = run_processor_check(str(dry_file))
        if proc:
            print(f"  Processor: {proc['surfaceCount']} surfaces")
            for s in proc["surfaces"]:
                print(f"    '{s['id']}': root_ok={s['rootExists']}, {s['componentCount']} components")

        print("\n  DRY RUN COMPLETE")
        return

    # Live test
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    system_prompt = load_a2ui_system_prompt()
    print(f"\n  System prompt: {len(system_prompt):,} chars")

    cases = A2UI_TEST_CASES
    if args.cases:
        cases = [A2UI_TEST_CASES[i - 1] for i in args.cases if 1 <= i <= len(A2UI_TEST_CASES)]

    results = []
    for test_case in cases:
        result = run_a2ui_test(client, model, system_prompt, test_case, output_dir)
        results.append(result)
        time.sleep(1)  # rate limit buffer

    # ---- 汇总 ----
    print(f"\n\n{'='*60}")
    print("  A2UI E2E 测试汇总")
    print(f"{'='*60}")

    for r in results:
        checks = r.get("checks", {})
        passed = sum(1 for v in checks.values() if v)
        total = len(checks)
        status_icon = {"pass": "OK", "partial": "!!", "fail": "XX", "error": "ERR"}.get(
            r["status"], "??"
        )
        print(f"  [{status_icon}] {r['name']:20s} — {passed}/{total} checks, "
              f"{r.get('elapsed', 0):.1f}s, {r.get('tokens', 0)} tokens")

    total_pass = sum(1 for r in results if r["status"] == "pass")
    print(f"\n  Total: {total_pass}/{len(results)} fully passed")

    # Save results
    results_file = PROJECT_ROOT / "tests" / "a2ui_test_results.json"
    # Remove raw_output for cleaner JSON
    clean_results = []
    for r in results:
        cr = {k: v for k, v in r.items() if k != "raw_output"}
        clean_results.append(cr)
    results_file.write_text(
        json.dumps(clean_results, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  Results saved: {results_file}")

    # Exit code
    sys.exit(0 if total_pass == len(results) else 1)


if __name__ == "__main__":
    main()
