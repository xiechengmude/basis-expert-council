---
name: student-assessment
description: "学生水平评估和学习诊断。当用户需要评估学生水平、诊断学习问题、制定个性化学习计划、跟踪学习进度时使用此 skill。"
license: MIT
compatibility: "Deep Agents CLI"
metadata:
  author: "basis-expert-council"
  version: "1.0"
  target: "Teachers, Parents"
allowed-tools: "Read Write"
---

# 学生评估与学习诊断 Skill

## 何时使用

当用户需要：
- 评估学生当前学术水平
- 诊断学科薄弱环节
- 评估学术英语能力
- 制定个性化学习计划
- 设计阶段性测试

## 评估维度

### 1. 学术英语能力评估

| 维度 | 评估内容 | 方法 |
|------|---------|------|
| **Listening** | 课堂听力理解 | 听一段学术讲解 → 回答问题 |
| **Reading** | 学术文本阅读 | 阅读教材段落 → 总结 + 词汇测试 |
| **Writing** | 学术写作能力 | 写一段 paragraph → 评估结构和语言 |
| **Speaking** | 口头学术表达 | 用英文解释一个概念 → 评估流利度和准确性 |
| **Vocabulary** | 学术词汇量 | Tier 2 + Tier 3 词汇测试 |

**评估等级：**
- **Level 1 — Emerging**：基本听不懂/读不懂学术英语
- **Level 2 — Developing**：能理解简单内容，复杂内容有困难
- **Level 3 — Expanding**：大部分能理解，写作和表达有提升空间
- **Level 4 — Bridging**：接近母语学生水平，细节上有差距
- **Level 5 — Proficient**：与母语学生无显著差异

### 2. 学科知识评估

**数学诊断测试覆盖：**
- Number Sense & Operations
- Algebraic Thinking
- Geometry & Measurement
- Data Analysis & Probability
- Problem Solving & Reasoning

**科学诊断测试覆盖：**
- Scientific Method Understanding
- Content Knowledge (by topic)
- Lab Skills & Experimental Design
- Data Analysis & Graph Interpretation
- Scientific Writing

**人文诊断测试覆盖：**
- Reading Comprehension (fiction & nonfiction)
- Writing Structure & Grammar
- Analytical Thinking
- Historical Knowledge & Reasoning
- Vocabulary Depth

### 3. 学习习惯评估

| 维度 | 观察指标 |
|------|---------|
| **时间管理** | 能否按时完成作业？有无 planner/calendar？ |
| **笔记技巧** | 笔记是否有结构？是否用 Cornell Notes？ |
| **自主学习** | 遇到不懂的会自己查还是等老师教？ |
| **课堂参与** | 是否主动提问？参与讨论？ |
| **考试准备** | 有无复习策略？是否会做 study guide？ |

## 评估报告模板

```
═══════════════════════════════════════════════════
STUDENT ASSESSMENT REPORT
学生学术评估报告
═══════════════════════════════════════════════════

Student: [Name]           Grade: [Current Grade]
Date: [Assessment Date]   Target: [BASIS Grade Level]
Assessor: [Name]

───────────────────────────────────────────────────
OVERALL READINESS: [★★★☆☆] [Level Description]
───────────────────────────────────────────────────

1. ACADEMIC ENGLISH PROFICIENCY
   Level: [1-5] — [Description]
   ├── Listening:    [Level] — [Notes]
   ├── Reading:      [Level] — [Notes]
   ├── Writing:      [Level] — [Notes]
   ├── Speaking:     [Level] — [Notes]
   └── Vocabulary:   [Estimated size] — [Notes]

2. SUBJECT KNOWLEDGE
   ├── Mathematics:  [Grade Equivalent] — [Details]
   ├── Science:      [Grade Equivalent] — [Details]
   ├── ELA:          [Grade Equivalent] — [Details]
   └── History:      [Grade Equivalent] — [Details]

3. LEARNING SKILLS
   ├── Time Management:     [Strong / Developing / Needs Support]
   ├── Note-Taking:         [Strong / Developing / Needs Support]
   ├── Self-Directed Study: [Strong / Developing / Needs Support]
   ├── Class Participation: [Strong / Developing / Needs Support]
   └── Test Preparation:    [Strong / Developing / Needs Support]

4. KEY STRENGTHS
   • [Strength 1]
   • [Strength 2]

5. AREAS FOR IMPROVEMENT
   • [Area 1] — Priority: [High/Medium/Low]
   • [Area 2] — Priority: [High/Medium/Low]
   • [Area 3] — Priority: [High/Medium/Low]

6. RECOMMENDED ACTION PLAN
   Phase 1 (Week 1-4): [Focus area + specific actions]
   Phase 2 (Week 5-8): [Focus area + specific actions]
   Phase 3 (Week 9-12): [Focus area + specific actions]

7. RECOMMENDED RESOURCES
   • [Resource 1]
   • [Resource 2]

═══════════════════════════════════════════════════
```

## 个性化学习计划生成

根据评估结果，生成以下格式的学习计划：

### 周计划模板

```
WEEKLY STUDY PLAN — Week [#]
Student: [Name]    Grade: [Grade]    Focus: [Main Focus Area]

Monday:
  □ [Subject] — [Specific task] (30 min)
  □ Vocabulary — [5 words review + 5 new words] (15 min)

Tuesday:
  □ [Subject] — [Specific task] (30 min)
  □ Reading — [Material + pages] (20 min)

Wednesday:
  □ [Subject] — [Specific task] (30 min)
  □ Writing Practice — [Prompt/assignment] (20 min)

Thursday:
  □ [Subject] — [Specific task] (30 min)
  □ Vocabulary — [Review + quiz self] (15 min)

Friday:
  □ Weekly Review — [Summarize key concepts] (20 min)
  □ Practice Test — [Subject-specific] (30 min)

Weekend:
  □ Extended Reading — [Book/article] (30 min)
  □ Catch-up on any missed tasks

Weekly Goal: [Measurable goal]
Check-in: [How to measure progress]
```
