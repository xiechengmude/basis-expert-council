---
name: academic-vocabulary
description: "学术英语词汇辅导。当用户询问学术词汇 Academic Vocabulary、学科术语、英文术语表、词汇学习方法、Tier 2/Tier 3 词汇时使用此 skill。"
license: MIT
compatibility: "Deep Agents CLI"
metadata:
  author: "basis-expert-council"
  version: "1.0"
  target: "Students, Teachers"
allowed-tools: "Read Write"
---

# 学术英语词汇 Skill

## 何时使用

当用户需要：
- 学科专业术语中英对照
- 学术词汇学习方法和策略
- 按年级/学科生成词汇表
- Tier 2 / Tier 3 词汇解析
- 词汇在考试中的应用指导

## 词汇分层体系

### Three-Tier Vocabulary Model

| Tier | 定义 | 例子 | 教学重点 |
|------|------|------|---------|
| **Tier 1** | 基础日常词汇 | book, run, happy | 无需专门教学 |
| **Tier 2** | 跨学科通用学术词汇 | analyze, evidence, significant, contribute | **最重要！** 出现在所有学科 |
| **Tier 3** | 学科专业术语 | photosynthesis, derivative, imperialism | 在学科教学中自然习得 |

### 核心 Tier 2 词汇表（全学科通用）

以下词汇在 BASIS 各学科课堂和考试中高频出现：

**分析类：**
| Word | 中文 | Sentence Frame |
|------|------|---------------|
| analyze | 分析 | "Analyze the relationship between X and Y." |
| evaluate | 评估 | "Evaluate the effectiveness of this approach." |
| interpret | 解读 | "Interpret the data shown in the graph." |
| compare / contrast | 比较/对比 | "Compare and contrast the two theories." |
| distinguish | 区分 | "Distinguish between correlation and causation." |
| infer | 推断 | "What can you infer from this evidence?" |

**论证类：**
| Word | 中文 | Sentence Frame |
|------|------|---------------|
| argue / argument | 论证/论点 | "The author argues that..." |
| evidence | 证据 | "Cite evidence from the text to support your claim." |
| justify | 证明合理性 | "Justify your answer using mathematical reasoning." |
| claim | 论点/主张 | "State your claim clearly." |
| counterclaim | 反驳论点 | "Address the counterclaim in your essay." |
| refute | 反驳 | "Refute the opposing argument with evidence." |

**描述变化类：**
| Word | 中文 | Sentence Frame |
|------|------|---------------|
| increase / decrease | 增加/减少 | "The rate of reaction increased." |
| significant | 显著的 | "There was a significant difference between groups." |
| approximately | 大约 | "The value is approximately 3.14." |
| consequently | 因此 | "Consequently, the population declined." |
| furthermore | 此外 | "Furthermore, the evidence suggests..." |
| however | 然而 | "However, this theory has limitations." |

**过程类：**
| Word | 中文 | Sentence Frame |
|------|------|---------------|
| process | 过程 | "Describe the process of cellular respiration." |
| sequence | 顺序/序列 | "Arrange the events in chronological sequence." |
| contribute | 促成 | "Several factors contributed to the outcome." |
| influence | 影响 | "How did this event influence the outcome?" |
| determine | 决定 | "Determine the value of x." |
| demonstrate | 展示/证明 | "The experiment demonstrates that..." |

## 词汇学习策略

### Frayer Model（四格词汇法）

每个新词制作一张四格卡片：

```
┌─────────────────────┬─────────────────────┐
│   Definition        │   Characteristics   │
│   (用自己的话)       │   (特征/属性)        │
│                     │                     │
├─────────────────────┼─────────────────────┤
│   Examples          │   Non-Examples      │
│   (例子)            │   (反例)             │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

### Word Wall（词汇墙）

按学科和单元组织词汇：

```
Unit 5: Chemical Bonding
├── ionic bond（离子键）
├── covalent bond（共价键）
├── electronegativity（电负性）
├── polar / nonpolar（极性/非极性）
└── Lewis structure（路易斯结构式）
```

### Vocabulary Journal（词汇日记）

每天记录 3-5 个新词：

```
Word: equilibrium（平衡）
Subject: Chemistry
Definition: A state where forward and reverse reactions occur at equal rates.
My sentence: The reaction reached equilibrium after 10 minutes.
Chinese: 当正反应和逆反应速率相等时，反应达到平衡。
Related words: dynamic, Le Chatelier's Principle, shift
```

### Morpheme Analysis（词素分析法）

教学生拆解学术词汇：

| Prefix/Root/Suffix | Meaning | Examples |
|-------------------|---------|---------|
| **bio-** | life | biology, biochemistry, biome |
| **geo-** | earth | geography, geology, geothermal |
| **-tion/-sion** | action/state | equation, evolution, conclusion |
| **-ity** | quality of | electricity, velocity, density |
| **re-** | again | reaction, reform, revolution |
| **un-/in-/im-** | not | unstable, independent, impossible |
| **inter-** | between | interaction, international, interpret |
| **trans-** | across | transformation, translation, transport |
| **-ous/-ious** | having quality | continuous, spontaneous, aqueous |
| **-ment** | result of | measurement, experiment, development |

## 按学科生成词汇表的模板

当教师或学生请求词汇表时，按以下格式输出：

```
═══════════════════════════════════════════
ACADEMIC VOCABULARY LIST
Subject: [Subject]
Unit/Topic: [Topic]
Grade: [Grade Level]
═══════════════════════════════════════════

TIER 3 (Domain-Specific) — 必须掌握
───────────────────────────────────────────
1. [term] /pronunciation/ — [中文]
   Definition: [English definition]
   Example: "[sentence in academic context]"
   AP Frequency: ★★★ (High)

2. [term] ...

TIER 2 (Cross-Curricular) — 本单元涉及
───────────────────────────────────────────
1. [term] — [中文]
   In this context: "[how it's used in this subject]"

PRACTICE ACTIVITIES
───────────────────────────────────────────
1. Fill in the blank: [sentences with blanks]
2. Matching: [term-definition pairs]
3. Use in context: [writing prompt using vocabulary]
```
