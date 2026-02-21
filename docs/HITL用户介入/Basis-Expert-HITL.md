╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Plan to implement                                                                                                       │
│                                                                                                                         │
│ A2UI HITL 重设计 — interrupt/resume 交互模式                                                                            │
│                                                                                                                         │
│ Context                                                                                                                 │
│                                                                                                                         │
│ A2UI 组件渲染已完成（Phase 1-3），Agent 能生成 A2UI JSON 并在聊天中渲染交互卡片。                                       │
│ 但交互模型有根本性问题：用户点击选项/按钮后，前端通过 sendMessage() 发送新消息，                                        │
│ 这会启动全新的 Agent 调用，丢失原始上下文。                                                                             │
│                                                                                                                         │
│ 正确模式：使用 LangGraph 原生 HITL（Human-in-the-Loop）的 interrupt() / resumeInterrupt() 机制：                        │
│ 1. Agent 调用 a2ui_render tool → tool 内部调用 interrupt() → 图暂停                                                     │
│ 2. 前端检测到 interrupt → 从 interrupt payload 渲染 A2UI 卡片                                                           │
│ 3. 用户交互（选答案、点按钮）→ 前端调用 resumeInterrupt(action)                                                         │
│ 4. interrupt() 返回用户动作 → Agent 在同一 turn 继续处理                                                                │
│                                                                                                                         │
│ ---                                                                                                                     │
│ 交互流程图                                                                                                              │
│                                                                                                                         │
│ Agent                          Frontend                        User                                                     │
│   │                               │                              │                                                      │
│   ├─ call a2ui_render(jsonl)      │                              │                                                      │
│   ├─ tool: interrupt(payload) ──→ │                              │                                                      │
│   │   [graph paused]              ├─ detect stream.interrupt     │                                                      │
│   │                               ├─ render A2UISurface(jsonl)   │                                                      │
│   │                               │                          ←── ├─ click option                                        │
│   │                               ├─ resumeInterrupt(action) ──→ │                                                      │
│   │ ←── interrupt() returns action│                              │                                                      │
│   ├─ tool returns action to agent │                              │                                                      │
│   ├─ agent continues (e.g. "正确!")│                              │                                                     │
│   ├─ response ──────────────────→ ├─ render markdown             │                                                      │
│                                                                                                                         │
│ ---                                                                                                                     │
│ Step 1: 后端 — a2ui_tool.py 改用 interrupt()                                                                            │
│                                                                                                                         │
│ 文件: src/basis_expert_council/a2ui_tool.py                                                                             │
│                                                                                                                         │
│ from langchain_core.tools import tool                                                                                   │
│ from langgraph.types import interrupt                                                                                   │
│ import json                                                                                                             │
│                                                                                                                         │
│ @tool                                                                                                                   │
│ def a2ui_render(jsonl: str) -> str:                                                                                     │
│     """生成 A2UI 交互式 UI 组件并等待用户交互。"""                                                                      │
│     # 暂停图执行，将 A2UI JSONL 发送给前端                                                                              │
│     user_action = interrupt({                                                                                           │
│         "type": "a2ui_render",                                                                                          │
│         "payload": jsonl,                                                                                               │
│     })                                                                                                                  │
│     # 用户交互完成后，返回结构化结果给 Agent                                                                            │
│     return json.dumps({                                                                                                 │
│         "ui": jsonl,          # 原始 UI（供前端 resume 后再次渲染）                                                     │
│         "action": user_action  # 用户的交互动作                                                                         │
│     })                                                                                                                  │
│                                                                                                                         │
│ 关键点：                                                                                                                │
│ - interrupt() 的参数是发给前端的 payload（包含 A2UI JSONL）                                                             │
│ - interrupt() 的返回值是前端 resumeInterrupt() 传入的数据                                                               │
│ - tool 最终返回的字符串会成为 ToolMessage.content，Agent 可以看到用户选了什么                                           │
│                                                                                                                         │
│ ---                                                                                                                     │
│ Step 2: 前端 — ChatInterface.tsx 改用 resumeInterrupt                                                                   │
│                                                                                                                         │
│ 文件: frontend/src/app/components/ChatInterface.tsx                                                                     │
│                                                                                                                         │
│ 2.1 提取 A2UI interrupt 数据                                                                                            │
│                                                                                                                         │
│ 在现有 actionRequestsMap / reviewConfigsMap 旁边，新增：                                                                │
│                                                                                                                         │
│ // line ~254, 在 reviewConfigsMap 之后                                                                                  │
│ const a2uiInterruptPayload = useMemo(() => {                                                                            │
│   if (!interrupt?.value) return null;                                                                                   │
│   const val = interrupt.value as any;                                                                                   │
│   if (val.type === "a2ui_render" && val.payload) {                                                                      │
│     return val.payload as string;  // A2UI JSONL string                                                                 │
│   }                                                                                                                     │
│   return null;                                                                                                          │
│ }, [interrupt]);                                                                                                        │
│                                                                                                                         │
│ 2.2 改 handleA2UIAction 为 resumeInterrupt                                                                              │
│                                                                                                                         │
│ // 替换现有 handleA2UIAction (line 89-96)                                                                               │
│ const handleA2UIAction = useCallback(                                                                                   │
│   (action: UserAction) => {                                                                                             │
│     resumeInterrupt(action);  // 关键变化：不再 sendMessage，而是 resume                                                │
│   },                                                                                                                    │
│   [resumeInterrupt]                                                                                                     │
│ );                                                                                                                      │
│                                                                                                                         │
│ 2.3 传 a2uiInterruptPayload 给 ChatMessage                                                                              │
│                                                                                                                         │
│ 在 <ChatMessage> 的 props 中新增 a2uiInterruptPayload，仅传给最后一条消息：                                             │
│                                                                                                                         │
│ <ChatMessage                                                                                                            │
│   ...                                                                                                                   │
│   a2uiInterruptPayload={isLastMessage ? a2uiInterruptPayload : undefined}                                               │
│ />                                                                                                                      │
│                                                                                                                         │
│ ---                                                                                                                     │
│ Step 3: 前端 — ChatMessage.tsx 处理两种渲染状态                                                                         │
│                                                                                                                         │
│ 文件: frontend/src/app/components/ChatMessage.tsx                                                                       │
│                                                                                                                         │
│ 3.1 新增 prop                                                                                                           │
│                                                                                                                         │
│ HiddenToolsAndVisibleTools 和 ChatMessage 新增 a2uiInterruptPayload?: string prop。                                     │
│                                                                                                                         │
│ 3.2 修改 A2UI 渲染逻辑（line 134）                                                                                      │
│                                                                                                                         │
│ 当前代码：                                                                                                              │
│ if (toolCall.name === A2UI_TOOL_NAME && toolCall.result) {                                                              │
│   return <A2UISurface key={toolCall.id} jsonl={toolCall.result} onAction={onA2UIAction} />;                             │
│ }                                                                                                                       │
│                                                                                                                         │
│ 改为两阶段渲染：                                                                                                        │
│ if (toolCall.name === A2UI_TOOL_NAME) {                                                                                 │
│   // 阶段 1: interrupt 中 — 从 interrupt payload 渲染，可交互                                                           │
│   if (toolCall.status === "interrupted" && a2uiInterruptPayload) {                                                      │
│     return (                                                                                                            │
│       <A2UISurface                                                                                                      │
│         key={toolCall.id}                                                                                               │
│         jsonl={a2uiInterruptPayload}                                                                                    │
│         onAction={onA2UIAction}                                                                                         │
│       />                                                                                                                │
│     );                                                                                                                  │
│   }                                                                                                                     │
│   // 阶段 2: resume 完成 — 从 tool result 的 ui 字段渲染，静态展示                                                      │
│   if (toolCall.result) {                                                                                                │
│     try {                                                                                                               │
│       const parsed = JSON.parse(toolCall.result);                                                                       │
│       const jsonl = parsed.ui || toolCall.result;                                                                       │
│       return <A2UISurface key={toolCall.id} jsonl={jsonl} />;                                                           │
│     } catch {                                                                                                           │
│       return null;                                                                                                      │
│     }                                                                                                                   │
│   }                                                                                                                     │
│   return null;  // tool 正在执行中                                                                                      │
│ }                                                                                                                       │
│                                                                                                                         │
│ 两阶段说明：                                                                                                            │
│ - interrupt 中：用户看到交互式 A2UI 卡片（可点击选项、按钮）                                                            │
│ - resume 后：A2UI 卡片变为静态展示（无 onAction），选项不再可点击，Agent 的后续回复出现在卡片下方                       │
│                                                                                                                         │
│ ---                                                                                                                     │
│ Step 4: E2E 测试                                                                                                        │
│                                                                                                                         │
│ 文件: tests/test_a2ui_agent_e2e.py                                                                                      │
│                                                                                                                         │
│ 更新测试以验证完整 HITL 流程：                                                                                          │
│                                                                                                                         │
│ async def test_agent_a2ui_hitl(timeout=120):                                                                            │
│     agent = create_basis_expert_agent()                                                                                 │
│     config = {"configurable": {"thread_id": f"test-hitl-{int(time.time())}"}}                                           │
│                                                                                                                         │
│     # Step 1: 调用 Agent → 触发 interrupt                                                                               │
│     response = await agent.ainvoke(                                                                                     │
│         {"messages": [{"role": "user", "content": "请出一道数学选择题..."}]},                                           │
│         config=config,                                                                                                  │
│     )                                                                                                                   │
│                                                                                                                         │
│     # Step 2: 验证 interrupt 存在                                                                                       │
│     assert "__interrupt__" in response, "Agent 应触发 interrupt"                                                        │
│     interrupt_data = response["__interrupt__"][0].value                                                                 │
│     assert interrupt_data["type"] == "a2ui_render"                                                                      │
│     jsonl = interrupt_data["payload"]                                                                                   │
│     validation = validate_a2ui_jsonl(jsonl)                                                                             │
│     assert validation["valid"], f"A2UI JSONL 无效: {validation['errors']}"                                              │
│                                                                                                                         │
│     # Step 3: 模拟用户选择答案，resume                                                                                  │
│     from langgraph.types import Command                                                                                 │
│     mock_action = {                                                                                                     │
│         "actionName": "submitAnswer",                                                                                   │
│         "surfaceId": "quiz-1",                                                                                          │
│         "context": {"questionId": "q1", "answer": "b"},                                                                 │
│     }                                                                                                                   │
│     response2 = await agent.ainvoke(                                                                                    │
│         Command(resume=mock_action),                                                                                    │
│         config=config,  # 同一个 thread_id！                                                                            │
│     )                                                                                                                   │
│                                                                                                                         │
│     # Step 4: 验证 Agent 正常继续                                                                                       │
│     messages = response2.get("messages", [])                                                                            │
│     assert len(messages) > 0, "Agent 应在 resume 后生成回复"                                                            │
│                                                                                                                         │
│     # 检查 ToolMessage — a2ui_render 应返回包含 action 的 JSON                                                          │
│     tool_msgs = [m for m in messages if getattr(m, "name", "") == "a2ui_render"]                                        │
│     assert len(tool_msgs) > 0, "应有 a2ui_render ToolMessage"                                                           │
│     result = json.loads(tool_msgs[0].content)                                                                           │
│     assert "action" in result, "ToolMessage 应包含 action 字段"                                                         │
│     assert result["action"]["actionName"] == "submitAnswer"                                                             │
│                                                                                                                         │
│ ---                                                                                                                     │
│ 文件变更清单                                                                                                            │
│                                                                                                                         │
│ 文件: src/basis_expert_council/a2ui_tool.py                                                                             │
│ 操作: 修改                                                                                                              │
│ 说明: 从透传改为 interrupt() + 返回结构化结果                                                                           │
│ ────────────────────────────────────────                                                                                │
│ 文件: frontend/src/app/components/ChatInterface.tsx                                                                     │
│ 操作: 修改                                                                                                              │
│ 说明: 提取 A2UI interrupt、handleA2UIAction 改用 resumeInterrupt、传 payload                                            │
│ ────────────────────────────────────────                                                                                │
│ 文件: frontend/src/app/components/ChatMessage.tsx                                                                       │
│ 操作: 修改                                                                                                              │
│ 说明: 两阶段渲染：interrupt 时交互、resume 后静态                                                                       │
│ ────────────────────────────────────────                                                                                │
│ 文件: tests/test_a2ui_agent_e2e.py                                                                                      │
│ 操作: 修改                                                                                                              │
│ 说明: 测试完整 HITL 流程（invoke → interrupt → resume → continue）                                                      │
│                                                                                                                         │
│ 无新文件、无新依赖。                                                                                                    │
│                                                                                                                         │
│ ---                                                                                                                     │
│ 验证方式                                                                                                                │
│                                                                                                                         │
│ 1. Agent E2E 测试                                                                                                       │
│                                                                                                                         │
│ cd /Users/gumpm5/Documents/Code/basis-expert-council                                                                    │
│ python tests/test_a2ui_agent_e2e.py                                                                                     │
│ 验证：invoke → __interrupt__ → resume → Agent 继续                                                                      │
│                                                                                                                         │
│ 2. 前端构建                                                                                                             │
│                                                                                                                         │
│ cd frontend && yarn build                                                                                               │
│                                                                                                                         │
│ 3. 浏览器 E2E                                                                                                           │
│                                                                                                                         │
│ 1. 启动 LangGraph dev + Next.js dev                                                                                     │
│ 2. 发送 "出一道数学选择题"                                                                                              │
│ 3. 验证 A2UI 卡片渲染且选项可点击                                                                                       │
│ 4. 点击选项 → 点提交 → Agent 回复（如 "正确!"）                                                                         │
│ 5. 提交后卡片变为静态（选项不可再点击）                                                                                 │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
