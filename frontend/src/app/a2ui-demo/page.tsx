"use client";

import React, { useState } from "react";
import { A2UISurface } from "@/app/a2ui";
import type { UserAction } from "@/app/a2ui";

const QUIZ_JSONL = `{"beginRendering": {"surfaceId": "quiz-1", "root": "card-1"}}
{"surfaceUpdate": {"surfaceId": "quiz-1", "components": [{"id": "card-1", "component": {"Card": {"children": {"explicitList": ["q-title", "q-desc", "divider-1", "q-choices", "q-submit"]}}}}, {"id": "q-title", "component": {"Text": {"text": {"literalString": "Math Quiz"}, "usageHint": "h2"}}}, {"id": "q-desc", "component": {"Text": {"text": {"literalString": "Which of the following is a quadratic function?"}, "usageHint": "body"}}}, {"id": "divider-1", "component": {"Divider": {"axis": "horizontal"}}}, {"id": "q-choices", "component": {"MultipleChoice": {"selections": {"path": "/q1/answer"}, "options": [{"label": {"literalString": "y = 2x + 1"}, "value": "a"}, {"label": {"literalString": "y = x\\u00b2 + 3x - 2"}, "value": "b"}, {"label": {"literalString": "y = 1/x"}, "value": "c"}, {"label": {"literalString": "y = \\u221ax"}, "value": "d"}], "maxAllowedSelections": 1}}}, {"id": "q-submit-text", "component": {"Text": {"text": {"literalString": "Submit Answer"}, "usageHint": "body"}}}, {"id": "q-submit", "component": {"Button": {"child": "q-submit-text", "action": {"name": "submitAnswer", "context": [{"key": "questionId", "value": {"literalString": "q1"}}, {"key": "answer", "value": {"path": "/q1/answer"}}]}}}}]}}`;

const DASHBOARD_JSONL = `{"beginRendering": {"surfaceId": "dashboard-1", "root": "dash-col"}}
{"surfaceUpdate": {"surfaceId": "dashboard-1", "components": [{"id": "dash-col", "component": {"Column": {"children": {"explicitList": ["dash-title", "dash-row"]}}}}, {"id": "dash-title", "component": {"Text": {"text": {"literalString": "Learning Progress"}, "usageHint": "h2"}}}, {"id": "dash-row", "component": {"Row": {"children": {"explicitList": ["card-math", "card-science", "card-humanities"]}, "distribution": "spaceEvenly"}}}, {"id": "card-math", "component": {"Card": {"children": {"explicitList": ["math-title", "math-score"]}}}}, {"id": "math-title", "component": {"Text": {"text": {"literalString": "Mathematics"}, "usageHint": "h4"}}}, {"id": "math-score", "component": {"Text": {"text": {"literalString": "85/100 - Great progress!"}, "usageHint": "body"}}}, {"id": "card-science", "component": {"Card": {"children": {"explicitList": ["sci-title", "sci-score"]}}}}, {"id": "sci-title", "component": {"Text": {"text": {"literalString": "Science"}, "usageHint": "h4"}}}, {"id": "sci-score", "component": {"Text": {"text": {"literalString": "72/100 - Keep it up!"}, "usageHint": "body"}}}, {"id": "card-humanities", "component": {"Card": {"children": {"explicitList": ["hum-title", "hum-score"]}}}}, {"id": "hum-title", "component": {"Text": {"text": {"literalString": "Humanities"}, "usageHint": "h4"}}}, {"id": "hum-score", "component": {"Text": {"text": {"literalString": "91/100 - Excellent!"}, "usageHint": "body"}}}]}}`;

const CHECKLIST_JSONL = `{"beginRendering": {"surfaceId": "checklist-1", "root": "cl-card"}}
{"surfaceUpdate": {"surfaceId": "checklist-1", "components": [{"id": "cl-card", "component": {"Card": {"children": {"explicitList": ["cl-title", "cl-divider", "cb-1", "cb-2", "cb-3", "cb-4"]}}}}, {"id": "cl-title", "component": {"Text": {"text": {"literalString": "Study Checklist"}, "usageHint": "h3"}}}, {"id": "cl-divider", "component": {"Divider": {"axis": "horizontal"}}}, {"id": "cb-1", "component": {"CheckBox": {"label": {"literalString": "Review Chapter 5 notes"}, "value": {"path": "/tasks/ch5"}}}}, {"id": "cb-2", "component": {"CheckBox": {"label": {"literalString": "Complete practice problems"}, "value": {"path": "/tasks/practice"}}}}, {"id": "cb-3", "component": {"CheckBox": {"label": {"literalString": "Watch supplementary video"}, "value": {"path": "/tasks/video"}}}}, {"id": "cb-4", "component": {"CheckBox": {"label": {"literalString": "Submit homework"}, "value": {"path": "/tasks/homework"}}}}]}}
{"dataModelUpdate": {"surfaceId": "checklist-1", "path": "/tasks", "contents": [{"key": "ch5", "valueBoolean": true}, {"key": "practice", "valueBoolean": false}, {"key": "video", "valueBoolean": false}, {"key": "homework", "valueBoolean": false}]}}`;

export default function A2UIDemoPage() {
  const [actions, setActions] = useState<UserAction[]>([]);

  const handleAction = (action: UserAction) => {
    setActions((prev) => [...prev, action]);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <h1 className="text-3xl font-bold text-primary">A2UI Component Demo</h1>
      <p className="text-muted-foreground">
        Testing A2UI dynamic components rendered from JSONL protocol messages.
      </p>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-primary">
          1. Quiz Card (MultipleChoice + Button)
        </h2>
        <A2UISurface jsonl={QUIZ_JSONL} onAction={handleAction} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-primary">
          2. Learning Dashboard (Row + Cards)
        </h2>
        <A2UISurface jsonl={DASHBOARD_JSONL} onAction={handleAction} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-primary">
          3. Study Checklist (Checkboxes + Data Binding)
        </h2>
        <A2UISurface jsonl={CHECKLIST_JSONL} onAction={handleAction} />
      </section>

      {actions.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-primary">
            User Actions Log
          </h2>
          <div className="rounded-lg border border-border bg-gray-50 p-4 dark:bg-gray-900">
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(actions, null, 2)}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}
