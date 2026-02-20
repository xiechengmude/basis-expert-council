---
name: lesson-planning
description: "BASIS 教案生成和教学设计。当教师需要生成教案 Lesson Plan、课堂活动设计、教学策略、课堂管理、备课、EMI 英语教学法指导时使用此 skill。"
license: MIT
compatibility: "Deep Agents CLI"
metadata:
  author: "basis-expert-council"
  version: "1.0"
  target: "Teachers"
allowed-tools: "Read Write"
---

# BASIS 教案生成 Skill

## 何时使用

当教师需要：
- 生成符合 BASIS 标准的教案
- 设计课堂活动和互动环节
- 获取 EMI（English as Medium of Instruction）教学法指导
- 课堂管理和教学策略建议
- 对齐 AP / Common Core 标准

## BASIS 教案标准模板

### 完整教案结构

```
═══════════════════════════════════════════════
LESSON PLAN
═══════════════════════════════════════════════
Teacher: [Name]              Date: [Date]
Subject: [Subject]           Grade: [Grade Level]
Unit: [Unit Name]            Lesson: [#] of [Total]
Duration: [Minutes]
═══════════════════════════════════════════════

STANDARDS ALIGNMENT
───────────────────────────────────────────────
□ Common Core: [Standard Code & Description]
□ AP Framework: [AP Topic & Learning Objective]
□ NGSS (Science): [Standard Code] (if applicable)

LEARNING OBJECTIVES (SWBAT - Students Will Be Able To)
───────────────────────────────────────────────
By the end of this lesson, students will be able to:
1. [Cognitive verb] + [specific skill/knowledge]
2. [Cognitive verb] + [specific skill/knowledge]
3. [Cognitive verb] + [specific skill/knowledge]

ACADEMIC VOCABULARY
───────────────────────────────────────────────
Tier 2 (General Academic): [words]
Tier 3 (Domain-Specific): [words]

MATERIALS & RESOURCES
───────────────────────────────────────────────
□ [Material 1]
□ [Material 2]
□ [Technology requirements]

═══════════════════════════════════════════════
LESSON SEQUENCE
═══════════════════════════════════════════════

1. BELL RINGER / DO NOW (5 min)
───────────────────────────────────────────────
Activity: [Quick review or hook activity]
Purpose: [Activate prior knowledge / spark curiosity]

2. DIRECT INSTRUCTION (15-20 min)
───────────────────────────────────────────────
Content: [Key concepts to teach]
Method: [Lecture, demonstration, modeling]
Scaffolding: [Support for ELL/struggling students]
Key Questions:
  - [Socratic question 1]
  - [Socratic question 2]

3. GUIDED PRACTICE (10-15 min)
───────────────────────────────────────────────
Activity: [Structured practice with teacher support]
Grouping: [Individual / Pairs / Small Groups]
Differentiation:
  - Approaching: [Simplified version]
  - On-level: [Standard version]
  - Advanced: [Extension version]

4. INDEPENDENT PRACTICE (10-15 min)
───────────────────────────────────────────────
Activity: [Student works independently]
Assessment: [How you'll monitor understanding]

5. EXIT TICKET (5 min)
───────────────────────────────────────────────
Question(s): [1-3 quick assessment questions]
Success Criteria: [What counts as mastery]

═══════════════════════════════════════════════
DIFFERENTIATION & ACCOMMODATIONS
═══════════════════════════════════════════════
ELL Support: [Strategies for English Language Learners]
Advanced: [Extension activities]
Struggling: [Additional scaffolding]

HOMEWORK / EXTENSION
───────────────────────────────────────────────
Assignment: [Description]
Due: [Date]
Purpose: [Reinforcement / Preview / Application]

REFLECTION (Post-Lesson)
───────────────────────────────────────────────
What worked: [To be filled after teaching]
What to improve: [To be filled after teaching]
Student misconceptions observed: [To be filled]
```

## Bloom's Taxonomy 动词对照（教学目标设计）

设计 Learning Objectives 时使用 Bloom's Taxonomy 动词：

| Level | English Verbs | 中文 | Example Objective |
|-------|--------------|------|------------------|
| **Remember** | list, define, identify, recall | 记忆 | "Define the term 'photosynthesis'." |
| **Understand** | explain, summarize, compare, describe | 理解 | "Explain the process of mitosis." |
| **Apply** | solve, calculate, demonstrate, use | 应用 | "Solve quadratic equations using the formula." |
| **Analyze** | analyze, differentiate, examine, categorize | 分析 | "Analyze the causes of World War I." |
| **Evaluate** | evaluate, justify, critique, assess | 评价 | "Evaluate the effectiveness of this policy." |
| **Create** | design, construct, develop, formulate | 创造 | "Design an experiment to test the hypothesis." |

## EMI 教学法指导（面向中文母语教师）

### 课堂用语模板

**开课：**
- "Good morning, class. Let's get started with our Do Now."
- "Please take out your notebooks and turn to page [X]."
- "Today's learning objective is..."

**讲解：**
- "Let me walk you through this concept step by step."
- "Pay attention to [key point]. This is important because..."
- "Does everyone follow so far? Any questions?"

**提问：**
- "What do you think would happen if...?" (Socratic)
- "Can someone explain this in their own words?"
- "Turn to your partner and discuss: [question]. You have 2 minutes."
- "Who would like to share what their partner said?"

**鼓励：**
- "Great observation! Can you elaborate on that?"
- "That's a good start. Let's build on that idea."
- "I appreciate your effort. Let's look at it from another angle."

**纠错：**
- "Almost there! Let's revisit this part."
- "That's a common misconception. Actually..."
- "Good thinking, but consider this..."

**收课：**
- "Let's wrap up. What were the key takeaways from today?"
- "For homework, please complete..."
- "Tomorrow we'll be looking at..."

### 中文教师常见教学挑战

| 挑战 | 应对策略 |
|------|---------|
| 英语口语不够流利 | 提前准备关键句，练习到流利；允许偶尔停顿思考 |
| 不知道如何提问 | 准备 Socratic Questions 清单，从简单的 "What/Why" 开始 |
| 学生用中文提问 | 重复学生的问题用英文，引导学生尝试英文表达 |
| 课堂互动少 | 使用 Think-Pair-Share、Gallery Walk 等结构化互动 |
| 不会差异化教学 | 准备 3 个难度版本的练习；用 scaffolding 支撑弱学生 |

## 课堂活动库

### 热身活动（Bell Ringers）
1. **Quick Write** — 3 分钟写一个与主题相关的问题
2. **Vocabulary Review** — 用前一课的词汇填空
3. **Error Analysis** — 找出解题过程中的错误
4. **Predict** — 看标题/图片，预测今天的内容

### 互动活动
1. **Think-Pair-Share** — 独立思考 → 同伴讨论 → 全班分享
2. **Jigsaw** — 每组学不同部分，然后互相教
3. **Gallery Walk** — 小组海报展示，其他组巡回观看和反馈
4. **Socratic Seminar** — 围坐讨论，基于文本提问和回应
5. **Fishbowl** — 内圈讨论，外圈观察和记录

### 评估活动（Exit Tickets）
1. **3-2-1** — 3 things learned, 2 questions, 1 connection
2. **Muddiest Point** — 写下最不理解的一个点
3. **Quick Quiz** — 3 道选择或简答题
4. **Explain to a Friend** — 用自己的话解释今天的核心概念
