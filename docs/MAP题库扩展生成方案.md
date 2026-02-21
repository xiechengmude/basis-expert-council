# MAP 题库扩展生成方案

> Few-Shot Question Generation Methodology for MAP Growth Practice Bank
>
> 版本: v1.0 | 日期: 2026-02-21

---

## 目录

1. [项目概述](#1-项目概述)
2. [MAP 测试体系分析](#2-map-测试体系分析)
3. [知识点矩阵](#3-知识点矩阵)
4. [Few-Shot 生成策略](#4-few-shot-生成策略)
5. [2025-2026 时事融合策略](#5-2025-2026-时事融合策略)
6. [题目质量控制清单](#6-题目质量控制清单)
7. [输出格式规范](#7-输出格式规范)
8. [生成目标与进度](#8-生成目标与进度)
9. [扩展方向](#9-扩展方向)

---

## 1. 项目概述

### 目标

将现有 **130 道种子题** 扩展至 **400+ 道高质量 MAP 风格练习题**，覆盖 K-12 全年级、Math / Reading / Language Usage 三大学科。

### 数据来源

- **种子题库**: `data/map_questions_bank.json` — 130 道 TestPrep-Online MAP-style 练习题
- **参考来源**: TestPrep-Online (https://www.testprep-online.com/map-test-practice) 编写的 MAP 风格样题
- **声明**: 所有题目均为测试准备专家编写的 MAP 风格练习题，模拟 NWEA MAP 的格式、难度和技能点，**非 NWEA 官方题目**

### 种子题库概况

| 维度 | 数据 |
|------|------|
| 总题数 | 130 |
| 年级覆盖 | K-1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12 |
| 学科 | math, reading, language_usage |
| 题型 | 单选为主，部分多选 (correct_answer 含逗号分隔) |
| 每年级约 | 10-12 题 (3-4 Math + 3-5 Reading + 3-4 Language Usage) |

### 技术约束

- 生成模型: 通过 OpenAI-compatible API 调用大语言模型
- 输出格式: 严格遵循种子题库 JSON schema
- 语言: 英文 (题目内容)，中文 (项目文档)

---

## 2. MAP 测试体系分析

### 什么是 MAP Growth

**MAP Growth** (Measures of Academic Progress) 是由 **NWEA** (Northwest Evaluation Association) 开发的计算机自适应学业成长测评。它是美国 K-12 教育中使用最广泛的标准化评估工具之一，被全美超过 9,500 个学区和全球 145 个国家采用。

核心特点:
- **Computer-Adaptive Testing (CAT)**: 题目难度根据学生作答表现实时调整 —— 答对则下一题更难，答错则下一题更简单
- **RIT 量表 (Rasch Unit)**: 使用等间距量表衡量学业水平，RIT 分数跨年级可比
- **成长导向**: 重点衡量学生的学业成长轨迹，而非简单的通过/不通过

### 测试科目

| 科目 | 英文名称 | 测试时长 | 题目数量 |
|------|----------|----------|----------|
| 数学 | Mathematics | ~45-60 min | 40-53 题 |
| 阅读 | Reading | ~40-50 min | 40-43 题 |
| 语言运用 | Language Usage | ~35-45 min | 40-53 题 |

### RIT 分数区间 (按年级)

RIT (Rasch Unit) 量表通常在 100-350 之间，以下为各年级典型分数区间 (基于 NWEA 2024 norms):

| 年级 | Math RIT | Reading RIT | Language Usage RIT |
|------|----------|-------------|-------------------|
| K | 140-165 | 140-160 | — |
| G1 | 160-185 | 155-180 | — |
| G2 | 170-195 | 170-195 | 170-190 |
| G3 | 185-205 | 180-205 | 180-200 |
| G4 | 195-215 | 190-210 | 190-210 |
| G5 | 205-225 | 200-220 | 200-215 |
| G6 | 210-230 | 205-225 | 205-220 |
| G7 | 215-235 | 210-230 | 210-225 |
| G8 | 220-240 | 215-235 | 215-230 |
| G9 | 225-245 | 215-240 | 220-235 |
| G10 | 225-250 | 220-245 | 220-240 |
| G11 | 228-255 | 220-248 | 222-242 |
| G12 | 230-260 | 222-250 | 225-245 |

> **注**: K-G1 年级通常不测试 Language Usage。

### 测试格式特征

- **全部选择题**: 单选或多选 (multi-select 会在题目中明确标注)
- **4-5 个选项**: 大多数题目有 4 个选项 (A-D)，部分有 5 个 (A-E) 或 6 个 (A-F)
- **无回退机制**: 学生提交答案后不能返回修改
- **无计算器**: 数学部分不允许使用计算器 (部分高年级例外)
- **图表类题目**: 大量使用图表、图形、文本段落作为题目素材

---

## 3. 知识点矩阵

### 3.1 Mathematics 知识点矩阵

#### K-G2: 基础数学

| 知识点 (Topic) | K-G1 | G2 | 代表题型 |
|----------------|------|----|----------|
| Counting & Cardinality | ● | | 数数、一一对应 |
| Addition & Subtraction | ● | ● | 加减法应用题、算式填空 |
| Place Value | ● | ● | 十位/个位概念、数字分解 |
| Number Patterns | ● | ● | 数列规律、skip counting |
| Geometry (2D/3D Shapes) | ● | ● | 形状识别、立体图形 |
| Measurement (Length/Weight) | ● | ● | 非标准单位、比较大小 |
| Data Interpretation | ● | ● | 柱状图读取、pictograph |
| Multiplication Concepts | | ● | 乘法可视化、equal groups |
| Equal Parts / Fractions Intro | | ● | 等分图形 |
| Time & Money | ● | ● | 钟表读取、硬币计算 |

#### G3-G5: 中级数学

| 知识点 (Topic) | G3 | G4 | G5 | 代表题型 |
|----------------|----|----|-----|----------|
| Multiplication & Division | ● | ● | ● | 多步应用题、长除法 |
| Fractions (Visual & Computation) | ● | ● | ● | 分数比较、加减乘除 |
| Decimals | | ● | ● | 小数表示、十进制网格 |
| Number Sequences & Patterns | ● | ● | ● | 数列规律、skip counting |
| Perimeter & Area | ● | ● | ● | 矩形周长面积、组合图形 |
| Angles & Triangles | | ● | ● | 角度计算、三角形内角和 |
| Unit Conversion | | | ● | 时间/长度/重量单位换算 |
| Measurement Estimation | | ● | ● | 重量/长度估算 |
| Data & Graph Interpretation | ● | ● | ● | 折线图、双柱状图 |
| Coordinate Plane (Intro) | | | ● | 坐标点读取 |
| Order of Operations | | | ● | PEMDAS |

#### G6-G8: 高级数学 / Pre-Algebra

| 知识点 (Topic) | G6 | G7 | G8 | 代表题型 |
|----------------|----|----|-----|----------|
| Ratios & Proportions | ● | ● | ● | 比例应用、unit rate |
| Percentages | ● | ● | ● | 折扣、税率、百分比变化 |
| Integers & Rational Numbers | ● | ● | ● | 负数运算、数轴 |
| Algebraic Expressions | ● | ● | ● | 变量求值、化简 |
| Linear Equations | | ● | ● | 一元一次方程 |
| Geometry (Perimeter/Area/Volume) | ● | ● | ● | 组合图形、圆 |
| Similar & Congruent Figures | | ● | ● | 相似三角形、全等条件 |
| Probability | | | ● | 有放回/无放回概率 |
| Statistics (Mean/Median/Mode) | ● | ● | ● | 数据分析、box plot |
| Exterior & Interior Angles | | | ● | 外角定理 |
| Data Representation | ● | ● | | line plot、scatter plot |
| Decomposition & Mental Math | ● | | | 分解乘法 |

#### G9-G12: 高中数学

| 知识点 (Topic) | G9 | G10 | G11 | G12 | 代表题型 |
|----------------|-----|------|------|------|----------|
| Systems of Equations | ● | ● | | | 二元一次方程组 |
| Quadratic Functions | | | ● | ● | 抛物线顶点、因式分解 |
| Logarithmic Equations | | | ● | | 对数方程 |
| Polynomial Factoring | | | | ● | GCF 提取、因式分解 |
| Triangle Congruence (AAS/SAS/SSS) | ● | | | | 三角形全等判定 |
| Proportional Triangles | | | ● | | 3:4:5 等比三角形 |
| Probability (Advanced) | | ● | | | 条件概率 |
| Volume & Scaling | | | | ● | 体积缩放关系 |
| Algebraic Evaluation | ● | | | | 多变量代数式求值 |
| Unit Cost & Rate Problems | ● | | | | 单价计算 |
| Ordering Fractions/Decimals | | ● | | | 分数小数排序 |
| Multi-step Word Problems | | | | ● | 多步骤实际问题 |

### 3.2 Reading 知识点矩阵

#### K-G2: 基础阅读

| 知识点 (Topic) | K-G1 | G2 | 代表题型 |
|----------------|------|----|----------|
| Phonics & Decoding | ● | | 拼读规则、音素 |
| Sight Words | ● | | 高频词识别 |
| Punctuation Recognition | ● | | 标点符号用途 |
| Synonyms & Antonyms | ● | ● | 近义词/反义词 |
| Irregular Plurals | ● | | 不规则复数 |
| Superlatives / Comparatives | ● | | -est/-er 含义 |
| Text Type Identification | ● | ● | 故事/诗歌/清单/信件 |
| Main Idea | | ● | 中心思想 |
| Text Features (Index/Glossary) | | ● | 索引、目录使用 |
| Conflict Resolution | | ● | 故事冲突解决 |

#### G3-G5: 中级阅读

| 知识点 (Topic) | G3 | G4 | G5 | 代表题型 |
|----------------|----|----|-----|----------|
| Main Idea & Best Title | ● | | | 最佳标题选择 |
| Common Themes | ● | | | 多文本共同主题 |
| Vocabulary in Context | ● | ● | ● | 上下文推词义 |
| Author's Purpose | | ● | | 作者写作目的 |
| Theme & Moral | | ● | | 主题/寓意 |
| Prefix/Suffix Meaning | | ● | | 词缀含义 |
| Point of View (1st/3rd) | | | ● | 叙述视角判断 |
| Informational Text | | | ● | 非虚构文本理解 |
| Inference | | | ● | 推断/暗示 |
| Text Structure | | ● | ● | 组织结构 |

#### G6-G8: 高级阅读

| 知识点 (Topic) | G6 | G7 | G8 | 代表题型 |
|----------------|----|----|-----|----------|
| Author's Purpose (Advanced) | ● | | | 信息/说服/娱乐/表达 |
| Figurative Language | ● | | ● | 比喻、拟人、矛盾修辞 |
| Vocabulary in Context (Advanced) | ● | ● | ● | 高级词汇推断 |
| Narrative Poetry | | ● | | 叙事诗分析 |
| Tone & Attitude Analysis | | ● | | 语气/态度判断 |
| Greek/Latin Roots | | ● | | 词根含义 |
| Informational Text (Advanced) | | ● | | 非虚构文本深度分析 |
| Author's Technique | | | ● | 写作技巧识别 |
| Poetry Form & Meter | | | ● | 诗歌韵律分析 |
| Simile/Metaphor Analysis | | | ● | 比喻手法解析 |

#### G9-G12: 高中阅读

| 知识点 (Topic) | G9 | G10 | G11 | G12 | 代表题型 |
|----------------|-----|------|------|------|----------|
| Characterization | ● | | | | 人物塑造分析 |
| Vocabulary in Context (College) | ● | ● | | | 高阶词汇语境推断 |
| Textual Evidence | ● | | | | 文本证据引用 |
| Causal Relationships | | ● | | | 因果关系链 |
| Thematic Synthesis | | ● | | | 多维主题整合 |
| Word Analysis (Poetry) | | | ● | | 诗歌选词效果 |
| Central Contrast | | | ● | | 核心对比分析 |
| Imagery Analysis | | | ● | | 意象分析 |
| Dual Text Comparison | | | | ● | 双文本对比 |
| Rhetorical Strategy | | | | ● | 修辞策略分析 (logos/pathos/ethos) |
| Chart/Data Analysis | | | | ● | 图表数据综合分析 |

### 3.3 Language Usage 知识点矩阵

#### G2-G3: 基础语言运用

| 知识点 (Topic) | G2 | G3 | 代表题型 |
|----------------|----|----|----------|
| Contractions | ● | | 缩写词撇号位置 |
| Plural Agreement | ● | ● | 名词复数一致性 |
| Sentence Structure | ● | | 词序调整 |
| Supporting Details | ● | | 支持细节选择 |
| Plural Spelling (Irregular) | | ● | 不规则复数拼写 |
| Verb Tense (Past Participle) | | ● | 过去分词使用 |
| Word Order | | ● | 副词位置 |
| Concluding Sentences | | ● | 总结句写作 |

#### G4-G5: 中级语言运用

| 知识点 (Topic) | G4 | G5 | 代表题型 |
|----------------|----|----|----------|
| Plural Rules (-f → -ves) | ● | | 复数规则变化 |
| Proper Nouns | ● | | 专有名词定义 |
| Subject Identification | ● | | 主语识别 |
| Research Writing | ● | | 研究写作要求 |
| Direct Address Punctuation | | ● | 称呼语逗号 |
| Active Verbs | | ● | 主动动词识别 |
| Compound Sentences | | ● | 并列句判断 |
| Organizational Patterns | | ● | 文章组织模式 |
| Capitalization Rules | ● | ● | 大写规则 |
| Writing Process | | ● | 写作流程 |

#### G6-G8: 高级语言运用

| 知识点 (Topic) | G6 | G7 | G8 | 代表题型 |
|----------------|----|----|-----|----------|
| Quotation Punctuation | ● | | | 引语标点 (split quotation) |
| Pronoun Usage (Object/Subject) | ● | | | 代词格 |
| Independent/Dependent Clauses | ● | ● | | 独立/从属子句 |
| Topic Sentences | ● | | | 主题句选择 |
| Capitalization (Advanced) | | ● | | 引语/地名大写 |
| Adjective Modification | | ● | | 形容词修饰对象 |
| Thesis Statements | | ● | | 论文陈述 |
| Sentence Function | | | ● | 句子功能分析 |
| Sentence Clarity & Revision | | | ● | 消除歧义修改 |
| Sentence Combining | | | ● | 合并句子 |
| Pronoun-Antecedent Agreement | | | ● | 代词先行词一致 |

#### G9-G12: 高中语言运用

| 知识点 (Topic) | G9 | G10 | G11 | G12 | 代表题型 |
|----------------|-----|------|------|------|----------|
| Spelling (-ible/-able) | ● | | | | 后缀拼写 |
| Source Evaluation | ● | | | | 信息源可靠性 |
| Active Voice | ● | | | | 主动语态 |
| Object Pronouns | | ● | | | 宾格代词 |
| Punctuation Accuracy | | ● | | | 逗号精准使用 |
| Misplaced Modifiers | | ● | | | 修饰语错位修正 |
| Concluding Sentences (Adv.) | | | ● | | 行动号召型结尾 |
| Semicolons in Lists | | | ● | | 含内部逗号列表 |
| Modifier Placement (only) | | | ● | | "only" 位置影响语义 |
| Transitions | | | | ● | 过渡词选择 |
| Word Choice & Tone | | | | ● | 措辞与语气匹配 |
| Descriptive Revision | | | | ● | 描写修辞提升 |

---

## 4. Few-Shot 生成策略

### 4.1 整体方法论

采用 **Few-Shot Prompting** 策略: 每次生成时，为模型提供 2-3 道同年级、同学科的种子题作为示例 (few-shot examples)，引导模型生成风格一致、质量可靠的新题目。

```
┌─────────────────────────────────────────┐
│         System Instruction              │
│  (角色定义 + 格式约束 + 质量要求)        │
├─────────────────────────────────────────┤
│         Few-Shot Examples (2-3)          │
│  (同年级同学科种子题，完整 JSON)          │
├─────────────────────────────────────────┤
│         Generation Directive             │
│  (目标知识点 + 生成数量 + 特殊要求)       │
├─────────────────────────────────────────┤
│         Output                           │
│  (JSON array of new questions)           │
└─────────────────────────────────────────┘
```

### 4.2 模型参数推荐

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| Temperature | 0.7 - 0.8 | 平衡创造性与准确性 |
| Top-P | 0.9 | 避免过于保守的输出 |
| Max Tokens | 4096 | 足够生成 10 道题 |
| Frequency Penalty | 0.3 | 减少重复用词 |
| Presence Penalty | 0.2 | 鼓励话题多样性 |

### 4.3 生成批次

- 每批生成 **10 道题**，按 `grade × subject` 组合
- 每个组合使用 **2-3 道种子题** 作为 few-shot examples
- 每批指定 **2-3 个不同 topic** 以确保知识点覆盖

### 4.4 种子题选取原则

1. **同年级同学科**: 必须选择与目标题目相同 grade 和 subject 的种子题
2. **知识点多样**: 尽量选择不同 topic 的种子题，展示格式多样性
3. **题型多样**: 如果目标年级有多选题 (multi-select)，至少包含一道作为示例
4. **长度适中**: 优先选择 question 长度中等的题目

### 4.5 完整 Prompt 模板示例 (G5 Math)

```
SYSTEM:
You are an expert educational content creator specializing in K-12 standardized test preparation. Your task is to generate MAP Growth-style practice questions that closely match the format, difficulty, and pedagogical standards of NWEA MAP assessments.

Requirements:
- Output MUST be a valid JSON array
- Each question MUST follow the exact schema provided in the examples
- Questions must be grade-appropriate (G5 level, RIT range 200-220)
- Each question must have exactly ONE correct answer unless explicitly marked as multi-select
- All distractors must be plausible but clearly incorrect
- Explanations must be clear, concise, and educational
- Do NOT reference copyrighted test materials or specific test publishers
- Avoid cultural bias, stereotypes, or sensitive topics

USER:
Here are example MAP-style G5 Math questions. Study their format, difficulty level, and style carefully:

### Example 1:
{
  "id": "G5-MATH-001",
  "grade": "G5",
  "subject": "math",
  "topic": "decimals_visual",
  "question": "Which decimal is represented by the shaded region of a 10×10 grid?",
  "options": [
    {"label": "A", "text": "0.24"},
    {"label": "B", "text": "0.28"},
    {"label": "C", "text": "0.47"},
    {"label": "D", "text": "0.72"},
    {"label": "E", "text": "2.8"}
  ],
  "correct_answer": "B",
  "explanation": "Count the shaded squares in the 10×10 grid: 28 out of 100 = 0.28."
}

### Example 2:
{
  "id": "G5-MATH-002",
  "grade": "G5",
  "subject": "math",
  "topic": "fraction_subtraction",
  "question": "What is 7/8 − 1/6?",
  "options": [
    {"label": "A", "text": "6/2"},
    {"label": "B", "text": "6/8"},
    {"label": "C", "text": "6/24"},
    {"label": "D", "text": "17/24"}
  ],
  "correct_answer": "D",
  "explanation": "Find common denominator 24: 7/8 = 21/24, 1/6 = 4/24. 21/24 − 4/24 = 17/24."
}

### Example 3:
{
  "id": "G5-MATH-004",
  "grade": "G5",
  "subject": "math",
  "topic": "unit_conversion",
  "question": "Select all measurements equal to six hours.",
  "options": [
    {"label": "A", "text": "3,600 seconds"},
    {"label": "B", "text": "21,600 seconds"},
    {"label": "C", "text": "36 minutes"},
    {"label": "D", "text": "216 minutes"},
    {"label": "E", "text": "360 minutes"}
  ],
  "correct_answer": "B,E",
  "explanation": "6 hours = 6 × 60 = 360 minutes. 6 hours = 6 × 3600 = 21,600 seconds."
}

---

Now generate 10 NEW G5 Math questions covering the following topics:
- fraction_addition (2 questions)
- decimal_comparison (2 questions)
- volume_rectangular_prism (2 questions)
- coordinate_plane (2 questions)
- order_of_operations (2 questions)

Rules:
1. Use sequential IDs starting from G5-MATH-005
2. Vary the number of options (some with 4, some with 5)
3. Include at least 1 multi-select question
4. Make distractors reflect common student mistakes (e.g., forgetting to find common denominators, misplacing decimal points)
5. 20-30% of questions should incorporate real-world contexts from 2025-2026 events when natural
6. Ensure explanations show step-by-step solutions

Output the questions as a JSON array.
```

### 4.6 按学科的 Prompt 调整

#### Math 特殊要求
- 确保所有计算题的答案数学上正确
- 干扰项应反映常见计算错误 (如忘记借位、错误进位、单位换算失误)
- 应用题需给出足够信息求解 (不含隐藏条件)
- 图表题需以文字描述替代图片 (当前限制)

#### Reading 特殊要求
- 需要提供阅读段落或明确引用文本 (passage-based questions)
- 题目不能脱离文本独立回答
- 词汇题需提供足够上下文线索
- 文学类题目可引用公共领域作品 (e.g., Dickens, Frost, Whitman)

#### Language Usage 特殊要求
- 语法题需测试特定规则，而非一般"哪个更好"
- 标点题需包含干扰选项，展示常见错误 (如逗号拼接、撇号错位)
- 写作组织题需提供足够上下文判断
- 修辞题 (G9+) 需区分 logos/pathos/ethos

---

## 5. 2025-2026 时事融合策略

### 5.1 融合原则

将 2025-2026 年真实事件融入题目 **情境/题干** (question stem)，而非融入答案选项。目标是让题目感觉鲜活、有时代感，同时不影响知识点测试的有效性。

### 5.2 融合比例

- **目标**: 20-30% 的生成题目包含 2025-2026 时事元素
- **分布**: 数学应用题最适合融入，阅读题次之，语言运用题酌情

### 5.3 适合融入的事件类型

| 类别 | 可用事件示例 | 适合学科 |
|------|-------------|----------|
| 航天探索 | SpaceX Starship 任务, NASA Artemis 计划, 火星探测 | Math (距离/速度计算), Reading (科普文) |
| 气候与环境 | 全球温度记录, 可再生能源里程碑, 海洋保护 | Math (数据分析/图表), Reading (信息文本) |
| AI & 科技 | AI 发展里程碑, 机器人技术, 量子计算 | Reading (科技文阅读), Language (写作话题) |
| 体育赛事 | 2026 FIFA World Cup (US/Mexico/Canada), 奥运会 | Math (统计/比例), Reading (新闻文体) |
| 科学发现 | 新物种发现, 医学突破, 天文观测 | Math (数据), Reading (科学文本) |
| 文化教育 | 博物馆展览, 文学奖项, 教育政策 | Reading (评论文), Language (写作) |

### 5.4 年龄适宜性过滤

**必须遵守的规则**:
- **禁止**: 暴力事件、政治争议、种族/宗教敏感话题、灾难伤亡细节
- **政治中立**: 涉及政策时仅陈述事实，不表达立场
- **正面导向**: 优先选择激励性、教育性的事件
- **年级适配**: 低年级 (K-G5) 使用简单、贴近生活的事件; 高年级 (G6+) 可使用更复杂的社会/科学话题

### 5.5 融合示例

#### Math (G5) — 航天主题
```json
{
  "id": "G5-MATH-EXT-001",
  "grade": "G5",
  "subject": "math",
  "topic": "multi_step_word_problem",
  "question": "NASA's Artemis program plans to send 4 astronauts to the Moon. If each astronaut needs 2.5 liters of water per day and the mission lasts 14 days, how many total liters of water must be loaded onto the spacecraft?",
  "options": [
    {"label": "A", "text": "35 liters"},
    {"label": "B", "text": "56 liters"},
    {"label": "C", "text": "100 liters"},
    {"label": "D", "text": "140 liters"}
  ],
  "correct_answer": "D",
  "explanation": "4 astronauts × 2.5 liters/day × 14 days = 140 liters total."
}
```

#### Reading (G7) — AI 主题
```json
{
  "id": "G7-READ-EXT-001",
  "grade": "G7",
  "subject": "reading",
  "topic": "informational_text",
  "question": "Read the following passage about artificial intelligence in 2025:\n\n'In 2025, AI-powered tools became standard in many classrooms, helping teachers personalize lessons for each student. However, educators debated whether relying on AI might reduce students' ability to think critically on their own.'\n\nWhat is the author's primary purpose in this passage?",
  "options": [
    {"label": "A", "text": "To persuade readers that AI is harmful to education"},
    {"label": "B", "text": "To present both benefits and concerns about AI in education"},
    {"label": "C", "text": "To explain how AI technology works"},
    {"label": "D", "text": "To compare AI education in different countries"}
  ],
  "correct_answer": "B",
  "explanation": "The passage presents both a benefit ('helping teachers personalize lessons') and a concern ('reduce students' ability to think critically'), indicating a balanced informational purpose."
}
```

---

## 6. 题目质量控制清单

每道生成的题目必须通过以下质量检查:

### 6.1 答案正确性

- [ ] 标注的 correct_answer 确实是正确答案
- [ ] 数学计算题: 答案经过独立验算
- [ ] 单选题: 有且仅有一个正确答案
- [ ] 多选题: correct_answer 字段包含所有正确选项 (逗号分隔)，且 question 中明确提示"Select all" / "Click on two"

### 6.2 干扰项质量

- [ ] 所有干扰项 (distractors) 看似合理但确实错误
- [ ] 干扰项反映常见学生错误 (common misconceptions)
- [ ] 没有"显然荒谬"的选项 (除非该年级需要)
- [ ] 干扰项之间无重复或过于相似
- [ ] 选项顺序合理 (数字从小到大, 或按逻辑排列)

### 6.3 知识点对齐

- [ ] 题目测试的是标注的 topic 对应的知识点
- [ ] 难度适合标注的 grade level
- [ ] 符合该年级 RIT 分数区间的预期水平
- [ ] 不超纲 (不考查高于该年级的知识)

### 6.4 语言与表述

- [ ] 语言清晰、简洁、无歧义
- [ ] 用词适合目标年级的阅读水平
- [ ] 无语法错误或拼写错误
- [ ] 题干提供足够信息独立作答 (无需外部知识)
- [ ] 阅读题提供了必要的文本段落

### 6.5 公平性与敏感性

- [ ] 无文化偏见或性别刻板印象
- [ ] 人名多样化 (不同文化背景)
- [ ] 无宗教、政治、种族敏感内容
- [ ] 对所有社会经济背景的学生公平

### 6.6 格式一致性

- [ ] JSON schema 完全匹配种子题库格式
- [ ] ID 命名遵循 `{GRADE}-{SUBJECT_ABBR}-{SEQ}` 规则
- [ ] options 使用 label (A/B/C/D/E/F) + text 结构
- [ ] explanation 提供清晰的解题思路
- [ ] 题目风格与 MAP 测试一致

---

## 7. 输出格式规范

### 7.1 JSON Schema

每道题目必须遵循以下严格格式:

```jsonc
{
  // 唯一标识符, 格式: {年级}-{学科缩写}-{三位序号}
  // 年级: K1, G2, G3, ..., G12
  // 学科缩写: MATH, READ, LANG
  // 示例: G5-MATH-012, G8-READ-003, G3-LANG-007
  "id": "G5-MATH-012",

  // 年级标识, 与种子库一致
  // 可选值: "K-1", "G2", "G3", ..., "G12"
  "grade": "G5",

  // 学科, 小写
  // 可选值: "math", "reading", "language_usage"
  "subject": "math",

  // 知识点标签, snake_case
  // 需从知识点矩阵中选取或合理新增
  "topic": "fraction_addition",

  // 题目文本
  // 对于阅读题, 应包含阅读段落 (可用 \n 分段)
  // 对于多选题, 应在题干中明确标注 (如 "Select all that apply")
  "question": "What is 2/5 + 1/3?",

  // 选项数组, 4-6 个选项
  // label: 大写字母 A-F
  // text: 选项文本
  "options": [
    {"label": "A", "text": "3/8"},
    {"label": "B", "text": "3/15"},
    {"label": "C", "text": "11/15"},
    {"label": "D", "text": "7/15"}
  ],

  // 正确答案
  // 单选: 单个字母 (如 "C")
  // 多选: 逗号分隔的字母 (如 "A,D")
  "correct_answer": "C",

  // 解题说明
  // 应包含解题步骤和关键推理过程
  // 简洁但完整, 1-3 句话
  "explanation": "Find a common denominator: LCD of 5 and 3 is 15. 2/5 = 6/15, 1/3 = 5/15. 6/15 + 5/15 = 11/15."
}
```

### 7.2 ID 编号规则

- 新生成的题目 ID 从种子库已有最大序号 **+1** 开始递增
- 种子库各年级/学科已有最大序号:

| Grade | MATH | READ | LANG |
|-------|------|------|------|
| K-1 | 005 | 005 | — |
| G2 | 004 | 005 | 004 |
| G3 | 004 | 003 | 004 |
| G4 | 004 | 003 | 004 |
| G5 | 004 | 003 | 004 |
| G6 | 003 | 003 | 004 |
| G7 | 004 | 004 | 004 |
| G8 | 004 | 004 | 004 |
| G9 | 003 | 003 | 003 |
| G10 | 003 | 003 | 003 |
| G11 | 003 | 003 | 003 |
| G12 | 003 | 003 | 003 |

### 7.3 顶层 JSON 结构

最终合并后的题库文件应保持以下结构:

```json
{
  "meta": {
    "source": "TestPrep-Online (MAP-style sample questions) + AI-generated expansion",
    "source_url": "https://www.testprep-online.com/map-test-practice",
    "disclaimer": "These are MAP-style practice questions. Seed questions written by test prep experts; expanded questions generated by AI. They are NOT official NWEA questions.",
    "scraped_at": "2026-02-21",
    "generated_at": "2026-02-21",
    "total_questions": 400,
    "seed_questions": 130,
    "generated_questions": 270,
    "grade_range": "K-12",
    "subjects": ["math", "reading", "language_usage"]
  },
  "questions": [ ... ]
}
```

---

## 8. 生成目标与进度

### 8.1 总体目标

从 130 道种子题扩展至 **400+ 道**，新增约 **270+ 道**。

### 8.2 各年级/学科生成目标

| Grade | Math (现有→目标) | Reading (现有→目标) | Language (现有→目标) | 新增总计 |
|-------|-----------------|--------------------|--------------------|---------|
| K-1 | 5 → 12 | 5 → 12 | 0 → 4 | +18 |
| G2 | 4 → 12 | 5 → 12 | 4 → 10 | +21 |
| G3 | 4 → 12 | 3 → 10 | 4 → 10 | +21 |
| G4 | 4 → 12 | 3 → 10 | 4 → 10 | +21 |
| G5 | 4 → 12 | 3 → 10 | 4 → 10 | +21 |
| G6 | 3 → 12 | 3 → 10 | 4 → 10 | +22 |
| G7 | 4 → 12 | 4 → 10 | 4 → 10 | +20 |
| G8 | 4 → 12 | 4 → 10 | 4 → 10 | +20 |
| G9 | 3 → 10 | 3 → 10 | 3 → 10 | +21 |
| G10 | 3 → 10 | 3 → 10 | 3 → 10 | +21 |
| G11 | 3 → 10 | 3 → 10 | 3 → 10 | +21 |
| G12 | 3 → 10 | 3 → 10 | 3 → 10 | +21 |
| **总计** | **44 → 136** | **42 → 124** | **40 → 124** | **~248** |

> 注: 最终数量可能因质量审查有所调整，目标下限 400 道。

### 8.3 生成流程

```
Phase 1: 时事素材收集
  └─ 收集 2025-2026 年适合融入题目的事件列表
  └─ 按学科和年级分类整理

Phase 2: 批量生成
  └─ 按 grade × subject 分组
  └─ 每组 10 题/批次
  └─ 使用 few-shot prompt + 时事素材

Phase 3: 质量审查
  └─ 逐题过质量控制清单
  └─ 数学题独立验算
  └─ 阅读/语言题审查语言准确性

Phase 4: 合并与去重
  └─ 合并至统一 JSON
  └─ 检查 ID 唯一性
  └─ 检查 topic 覆盖均衡性

Phase 5: 最终验证
  └─ JSON schema 校验
  └─ 随机抽样人工复核
  └─ 更新 meta 信息
```

---

## 9. 扩展方向

### 9.1 CAT 自适应难度分层

为每道题目增加 `difficulty` 字段 (1-5 或 RIT 分数区间)，支持计算机自适应测试引擎根据学生表现动态调整题目难度:

```json
{
  "id": "G5-MATH-012",
  "difficulty": 3,
  "rit_range": [205, 215],
  ...
}
```

### 9.2 双语题库 (English / Chinese)

为中国 BASIS 学生提供中英双语版本:

```json
{
  "question": "What is 7/8 − 1/6?",
  "question_cn": "7/8 − 1/6 等于多少？",
  "explanation": "Find common denominator 24...",
  "explanation_cn": "找到公分母 24..."
}
```

### 9.3 自定义学校专属题目

根据特定 BASIS 校区的教学大纲和重点，生成针对性练习题:
- 与 BASIS 各年级课程进度对齐
- 针对学生薄弱知识点集中强化
- 支持教师自定义出题参数

### 9.4 题目标签扩展

增加更精细的元数据标签:

```json
{
  "bloom_level": "apply",        // Bloom's Taxonomy: remember/understand/apply/analyze/evaluate/create
  "common_core": "5.NF.A.1",     // Common Core State Standard alignment
  "estimated_time_seconds": 90,   // 预计作答时间
  "has_visual": false,            // 是否需要配图
  "current_events": true,         // 是否融入时事
  "event_year": 2025              // 时事年份
}
```

### 9.5 错误分析与自适应反馈

基于学生作答数据，为每个干扰项标注对应的错误类型:

```json
{
  "options": [
    {"label": "A", "text": "6/14", "error_type": "added_numerators_and_denominators"},
    {"label": "B", "text": "11/15", "error_type": null},
    {"label": "C", "text": "3/8", "error_type": "added_without_common_denominator"},
    {"label": "D", "text": "7/15", "error_type": "subtracted_instead_of_added"}
  ]
}
```

---

## 附录: 种子题库统计

### 按年级分布

| Grade | Math | Reading | Language Usage | Total |
|-------|------|---------|----------------|-------|
| K-1 | 5 | 5 | 0 | 10 |
| G2 | 4 | 5 | 4 | 13 |
| G3 | 4 | 3 | 4 | 11 |
| G4 | 4 | 3 | 4 | 11 |
| G5 | 4 | 3 | 4 | 11 |
| G6 | 3 | 3 | 4 | 10 |
| G7 | 4 | 4 | 4 | 12 |
| G8 | 4 | 4 | 4 | 12 |
| G9 | 3 | 3 | 3 | 9 |
| G10 | 3 | 3 | 3 | 9 |
| G11 | 3 | 3 | 3 | 9 |
| G12 | 3 | 3 | 3 | 9 |
| **Total** | **44** | **42** | **40** | **126** |

> 注: `meta.total_questions` 标注为 130，实际 JSON 中有 126 道题 (个别 ID 可能有跳号)。最终统计以 JSON 解析结果为准。

### 按学科 Topic 覆盖

**Math** (28 unique topics): addition_word_problem, geometry_3d_shapes, data_interpretation, missing_number, number_patterns, multiplication_visual, place_value_word_problem, equal_parts, bar_graph_reading, number_sequences, multiplication_word_problem, fractions_visual, perimeter, division_multiplication, geometry_triangles, measurement_estimation, decimals_visual, fraction_subtraction, triangle_angles, unit_conversion, decomposition_multiplication, data_representation, perimeter_area, ratio_proportion, measurement_ordering, similar_triangles, unit_rate_graph, exterior_angles, ratio_changes, linear_equations, probability_without_replacement, triangle_congruence, algebraic_evaluation, unit_cost, systems_of_equations, ordering_fractions_decimals, basic_probability, quadratic_vertex, proportional_triangles, logarithmic_equations, factoring, volume_scaling, multi_step_word_problem

**Reading** (26 unique topics): punctuation, synonyms, irregular_plurals, superlatives, text_types, conflict_resolution, text_type_identification, index_reference, text_features, antonyms, best_title, common_themes, vocabulary_in_context, theme, authors_purpose, prefix_meaning, point_of_view, informational_text, vocabulary, narrative_poetry, tone_analysis, greek_roots, figurative_language, authors_technique, poetry_form, characterization, textual_evidence, causal_relationships, thematic_synthesis, word_analysis, central_contrast, imagery_analysis, chart_analysis, dual_text_comparison, rhetorical_strategy

**Language Usage** (30 unique topics): contractions, plural_agreement, sentence_structure, supporting_details, plural_spelling, verb_tense, word_order, concluding_sentence, plural_rules, proper_nouns, subject_identification, research_writing, direct_address_punctuation, active_verbs, compound_sentences, organizational_patterns, quotation_punctuation, pronoun_usage, independent_clauses, topic_sentences, capitalization, adjective_modification, independent_dependent_clauses, thesis_statements, sentence_function, sentence_clarity, sentence_combining, pronoun_antecedent_agreement, spelling, source_evaluation, active_voice, object_pronouns, punctuation_accuracy, misplaced_modifiers, concluding_sentences, semicolons_in_lists, modifier_placement, transitions, word_choice_tone, descriptive_revision
