# a2ui-render

When the user's question would benefit from an interactive UI component (quiz, multiple choice, progress dashboard, course planner, comparison table, etc.), use this skill to generate A2UI JSONL.

## Output Format

Output **one JSON object per line** (JSONL). Each line is a `ServerToClientMessage`:

### Step 1: Begin rendering
```json
{"beginRendering": {"surfaceId": "<unique-id>", "root": "<root-component-id>"}}
```

### Step 2: Surface update (component definitions)

**CRITICAL: Split components across MULTIPLE surfaceUpdate lines (2-3 components per line).** This prevents JSON errors from long lines.

```json
{"surfaceUpdate": {"surfaceId": "<id>", "components": [comp1, comp2]}}
{"surfaceUpdate": {"surfaceId": "<id>", "components": [comp3, comp4]}}
```

### Step 3 (optional): Data model update
```json
{"dataModelUpdate": {"surfaceId": "<same-id>", "path": "/", "contents": [{"key": "field", "valueBoolean": true}]}}
```

## Component Types

Available component types for the `component` field:

- `Text` — `{ "Text": { "text": { "literalString": "..." }, "usageHint": "h1"|"h2"|"h3"|"h4"|"h5"|"body"|"caption" } }`
- `Button` — `{ "Button": { "child": "<text-component-id>", "action": { "name": "...", "context": [...] } } }`
- `Row` — `{ "Row": { "children": { "explicitList": ["id1", "id2"] }, "distribution": "spaceBetween"|"spaceAround"|"spaceEvenly" } }`
- `Column` — `{ "Column": { "children": { "explicitList": ["id1", "id2"] } } }`
- `Card` — `{ "Card": { "children": { "explicitList": ["id1", "id2"] } } }`
- `Image` — `{ "Image": { "url": { "literalString": "https://..." }, "usageHint": "icon"|"avatar"|"mediumFeature" } }`
- `List` — `{ "List": { "children": { "explicitList": ["id1"] }, "direction": "vertical"|"horizontal" } }`
- `CheckBox` — `{ "CheckBox": { "label": { "literalString": "..." }, "value": { "path": "/checked" } } }`
- `MultipleChoice` — `{ "MultipleChoice": { "selections": { "path": "/answer" }, "options": [{"label": {"literalString": "..."}, "value": "a"}, ...], "maxAllowedSelections": 1 } }`
- `Divider` — `{ "Divider": { "axis": "horizontal"|"vertical" } }`

## Example: Quiz Card (multi-line surfaceUpdate)

```jsonl
{"beginRendering": {"surfaceId": "quiz-1", "root": "card-1"}}
{"surfaceUpdate": {"surfaceId": "quiz-1", "components": [{"id": "card-1", "component": {"Card": {"children": {"explicitList": ["q-title", "q-choices", "q-submit"]}}}}, {"id": "q-title", "component": {"Text": {"text": {"literalString": "Which is a quadratic function?"}, "usageHint": "h3"}}}]}}
{"surfaceUpdate": {"surfaceId": "quiz-1", "components": [{"id": "q-choices", "component": {"MultipleChoice": {"selections": {"path": "/q1/answer"}, "options": [{"label": {"literalString": "y = 2x + 1"}, "value": "a"}, {"label": {"literalString": "y = x² + 3x - 2"}, "value": "b"}, {"label": {"literalString": "y = 1/x"}, "value": "c"}], "maxAllowedSelections": 1}}}]}}
{"surfaceUpdate": {"surfaceId": "quiz-1", "components": [{"id": "q-submit-text", "component": {"Text": {"text": {"literalString": "Submit"}, "usageHint": "body"}}}, {"id": "q-submit", "component": {"Button": {"child": "q-submit-text", "action": {"name": "submitAnswer", "context": [{"key": "questionId", "value": {"literalString": "q1"}}, {"key": "answer", "value": {"path": "/q1/answer"}}]}}}}]}}
```

## Example: Checklist with data binding

```jsonl
{"beginRendering": {"surfaceId": "cl-1", "root": "cl-card"}}
{"surfaceUpdate": {"surfaceId": "cl-1", "components": [{"id": "cl-card", "component": {"Card": {"children": {"explicitList": ["cl-title", "cl-div", "cb-1", "cb-2"]}}}}, {"id": "cl-title", "component": {"Text": {"text": {"literalString": "Study Checklist"}, "usageHint": "h3"}}}]}}
{"surfaceUpdate": {"surfaceId": "cl-1", "components": [{"id": "cl-div", "component": {"Divider": {"axis": "horizontal"}}}, {"id": "cb-1", "component": {"CheckBox": {"label": {"literalString": "Review notes"}, "value": {"path": "/tasks/review"}}}}, {"id": "cb-2", "component": {"CheckBox": {"label": {"literalString": "Do homework"}, "value": {"path": "/tasks/hw"}}}}]}}
{"dataModelUpdate": {"surfaceId": "cl-1", "path": "/tasks", "contents": [{"key": "review", "valueBoolean": true}, {"key": "hw", "valueBoolean": false}]}}
```

## Tool Name

This skill outputs via the `a2ui_render` tool call. The frontend intercepts tool calls with `name === "a2ui_render"` and renders the A2UI surface inline in the chat.
