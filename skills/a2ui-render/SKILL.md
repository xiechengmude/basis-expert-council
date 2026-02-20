# a2ui-render

When the user's question would benefit from an interactive UI component (quiz, multiple choice, progress dashboard, course planner, comparison table, etc.), use this skill to generate A2UI JSONL.

## Output Format

Output **one JSON object per line** (JSONL). Each line is a `ServerToClientMessage`:

### Step 1: Begin rendering
```json
{"beginRendering": {"surfaceId": "<unique-id>", "root": "<root-component-id>"}}
```

### Step 2: Surface update (component definitions)
```json
{"surfaceUpdate": {"surfaceId": "<same-id>", "components": [...]}}
```

### Step 3 (optional): Data model update
```json
{"dataModelUpdate": {"surfaceId": "<same-id>", "path": "/", "contents": [...]}}
```

## Component Types

Available component types for the `component` field:

- `Text` — `{ "Text": { "text": { "literalString": "..." }, "usageHint": "h1"|"h2"|"h3"|"body"|"caption" } }`
- `Button` — `{ "Button": { "child": "<text-component-id>", "action": { "name": "...", "context": [...] } } }`
- `Row` — `{ "Row": { "children": { "explicitList": ["id1", "id2"] }, "distribution": "spaceBetween" } }`
- `Column` — `{ "Column": { "children": { "explicitList": ["id1", "id2"] } } }`
- `Card` — `{ "Card": { "children": { "explicitList": ["id1", "id2"] } } }`
- `Image` — `{ "Image": { "url": { "literalString": "https://..." }, "usageHint": "mediumFeature" } }`
- `List` — `{ "List": { "children": { "explicitList": ["id1"] }, "direction": "vertical" } }`
- `CheckBox` — `{ "CheckBox": { "label": { "literalString": "..." }, "value": { "path": "/checked" } } }`
- `MultipleChoice` — `{ "MultipleChoice": { "selections": { "path": "/answer" }, "options": [...], "maxAllowedSelections": 1 } }`
- `Divider` — `{ "Divider": { "axis": "horizontal" } }`

## Example: Quiz Card

```jsonl
{"beginRendering": {"surfaceId": "quiz-1", "root": "card-1"}}
{"surfaceUpdate": {"surfaceId": "quiz-1", "components": [{"id": "card-1", "component": {"Card": {"children": {"explicitList": ["q-title", "q-choices", "q-submit"]}}}}, {"id": "q-title", "component": {"Text": {"text": {"literalString": "Which is a quadratic function?"}, "usageHint": "h3"}}}, {"id": "q-choices", "component": {"MultipleChoice": {"selections": {"path": "/q1/answer"}, "options": [{"label": {"literalString": "y = 2x + 1"}, "value": "a"}, {"label": {"literalString": "y = x² + 3x - 2"}, "value": "b"}, {"label": {"literalString": "y = 1/x"}, "value": "c"}], "maxAllowedSelections": 1}}}, {"id": "q-submit-text", "component": {"Text": {"text": {"literalString": "Submit"}, "usageHint": "body"}}}, {"id": "q-submit", "component": {"Button": {"child": "q-submit-text", "action": {"name": "submitAnswer", "context": [{"key": "questionId", "value": {"literalString": "q1"}}, {"key": "answer", "value": {"path": "/q1/answer"}}]}}}}]}}
```

## Tool Name

This skill outputs via the `a2ui_render` tool call. The frontend intercepts tool calls with `name === "a2ui_render"` and renders the A2UI surface inline in the chat.
