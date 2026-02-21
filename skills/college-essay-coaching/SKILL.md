---
name: college-essay-coaching
description: "大学申请文书写作教练。当用户询问 Common App 文书、大学补充文书（supplemental essays）、Why School 文书、活动描述、个人陈述、文书选题、文书修改时使用此 skill。注意：教而不代写，严守学术诚信。"
license: MIT
compatibility: "Deep Agents CLI"
metadata:
  author: "basis-expert-council"
  version: "1.0"
  target: "Students, Parents"
allowed-tools: "Read Write"
---

# College Essay 写作教练 Skill

## 何时使用

当用户需要：
- Common App 主文书 (Personal Statement) 选题和构思
- 大学 Supplemental Essays 写作指导
- "Why [School]" 文书策略
- Activities Section 活动描述优化
- Additional Information 部分使用建议
- 文书修改和反馈（不是代写）

## 核心原则：教而不代写

⚠️ **学术诚信红线**：
- **永远不为学生写文书**，只教方法、给反馈、提建议
- 学生必须自己写每一个字，AI 只做教练角色
- 如果学生要求「帮我写」，转换为「教你怎么写」
- 反馈方式：指出问题 + 提问引导思考 + 给出改进方向（不给替代文本）

## Common App 主文书（Personal Statement）

### 基本规格

| 项目 | 要求 |
|------|------|
| 字数 | 250-650 words（建议 600-650） |
| 数量 | 1 篇，所有学校共用 |
| 题目 | 7 个 prompt 选 1 个（含开放式 Topic 7） |

### 2025-2026 Common App Prompts

1. **Background/Identity** — 你的背景、身份、兴趣或才能如何塑造了你？
2. **Lesson from Obstacle** — 描述一个你面临的挫折，你从中学到了什么？
3. **Challenged a Belief** — 你什么时候挑战过一个信念或想法？
4. **Gratitude** — 描述一件让你感到感激的事，以及它如何激励了你
5. **Personal Growth** — 讨论一次个人成长或新的理解
6. **Topic of Fascination** — 一个让你如此着迷以至于忘记时间的话题
7. **Open Topic** — 自由选题

### BASIS 学生选题策略

**高频有效话题**（基于 BASIS 学生背景）：

| 话题方向 | 为什么适合 BASIS 学生 | 对应 Prompt |
|---------|---------------------|------------|
| **跨文化身份** | 中西方教育碰撞、双语环境、文化认知 | #1 |
| **学术挫折与逆袭** | AP 课程压力、GPA 危机、Probation 经历 | #2 |
| **学科热情** | AP 研究项目、科学实验、数学竞赛深入探索 | #6 |
| **教育体系反思** | BASIS 淘汰制度带来的思考、教育公平 | #3 |
| **家庭与成长** | 留学/走读选择、家庭期望与自我、代际差异 | #4, #5 |

**应避免的话题**：
- ❌ 泛泛的「来美国/国际学校的文化冲击」（太常见）
- ❌ 只讲困难不讲成长（负面消极）
- ❌ 罗列成就和奖项（Activities Section 的功能，不是文书）
- ❌ 争议性政治话题（风险大于收益）
- ❌ 写别人而忘了写自己（文书主角必须是你）

### 文书结构指导

#### 叙事型结构（最推荐）

```
开头：具体场景/瞬间 — 拉进读者（不要从 "I was born..." 开始）
  ↓
发展：这个场景为什么重要？背景和冲突
  ↓
转折：关键的变化/领悟时刻
  ↓
深化：这个经历如何改变了你的思考/行动方式
  ↓
结尾：连接到现在的你和未来的方向（不要说 "I learned that..."）
```

#### 教练提问清单（帮学生找到故事）

如果学生不知道写什么，按以下顺序引导：

1. **你每天花最多时间做什么（除了上课和作业）？** → 找到真正的热情
2. **过去一年最让你感到自豪的一件事？** → 不一定是大成就
3. **你跟别人解释过什么复杂的东西，并且对方听懂了？** → 找到独特视角
4. **什么事情让你感到愤怒或不公平？** → 找到价值观
5. **如果不用在意成绩和简历，你会做什么？** → 找到真实的自己
6. **在 BASIS 的经历中，哪个瞬间你觉得自己真正成长了？** → 找到转折点

### 文书反馈框架（ARC 模型）

给学生文书反馈时使用 ARC 三维度：

**A — Authenticity（真实性）**
- 这听起来像一个真实的高中生写的吗？
- 能看到这个学生的个性吗？
- 是自己的声音还是「包装」过的声音？
- ❌ 常见问题：过度使用 SAT 词汇、像大人写的、太完美不真实

**R — Reflection（反思深度）**
- 有没有从「发生了什么」上升到「这对我意味着什么」？
- 有没有展示思维的变化过程（不只是结论）？
- 深度 > 广度：一个小事说透 > 三件大事都蜻蜓点水
- ❌ 常见问题：只叙述不反思、反思太泛（"I learned to be stronger"）

**C — Connection（连接性）**
- 读完后招生官能记住这个学生吗？
- 这篇文书和其他申请材料（活动、推荐信）是否形成互补？
- 文书展示的品质是否与目标大学的文化匹配？
- ❌ 常见问题：文书和 Activities List 重复、没有人格特质

## Supplemental Essays 策略

### "Why [School]" 文书

**通用模板（教学生思路，不是让学生套用）：**

```
为什么这所学校 → 你做了什么研究说明你真的了解它
    ↓
为什么是你 → 你的哪些特质/经历和这所学校特别匹配
    ↓
你会贡献什么 → 你会如何利用学校资源并回馈社区
```

**研究学校的 5 个必查信息**：
1. 特色课程/项目（不是写在首页上的泛泛描述）
2. 具体的教授/研究实验室（如果申请 STEM）
3. 独特的传统/文化/社区活动
4. 小众但真实的学生组织（不要写最大最有名的）
5. 学校 mission statement 中与你个人价值观的连接

**BASIS 学生的 "Why School" 优势**：
- AP 课程经历证明学术准备度
- 跨文化背景是许多学校看重的多样性
- BASIS 的严格体系说明你能适应高强度学术环境

**❌ "Why School" 常见错误**：
- 只说学校排名高、地理位置好、天气好
- 写的内容换个学校名字也成立（说明没有做功课）
- 只说学校给你什么，不说你给学校什么

### 常见 Supplemental 类型

| 类型 | 字数 | 策略 |
|------|------|------|
| **Why Major** | 150-300 | 用故事说明兴趣来源，不是背学科介绍 |
| **Community** | 200-400 | 具体的贡献行动，不是泛泛的「我喜欢帮助别人」 |
| **Challenge/Failure** | 250-400 | 聚焦成长过程，不是结果 |
| **Diversity** | 200-350 | 真实的多元视角，不是政治正确的标准答案 |
| **Extracurricular Elaboration** | 150-250 | 选最独特的一个活动深入展开 |
| **Roommate Letter** | 200-350 | 展示生活中的你，不是简历上的你 |

## Activities Section 优化

### 格式规格

- 最多 10 项活动
- 每项：活动名称（50 字符）+ 描述（150 字符）+ 职位 + 年级 + 时间投入
- 按重要性排序，**不是按时间顺序**

### 描述优化原则

**❌ Before（常见错误）：**
```
"Member of school's science club. Participated in activities and helped with experiments."
```

**✅ After（优化方向）：**
```
"Led team of 4 in designing water filtration prototype; presented findings at regional STEM expo, earning 2nd place among 30+ teams."
```

**优化公式**：Action Verb + Specific Achievement + Impact/Scale

**高效动词列表**：
- 领导类：Founded, Led, Directed, Organized, Coordinated
- 创造类：Designed, Developed, Created, Built, Launched
- 影响类：Raised, Increased, Expanded, Improved, Achieved
- 研究类：Researched, Analyzed, Published, Presented, Discovered

### 活动排序策略

1. **Spike Activity**（最深入、最能体现核心特质的 1-2 项）→ 排第 1-2
2. **Leadership Roles**（有头衔的领导职位）→ 排第 3-4
3. **Academic Achievements**（竞赛、研究、荣誉）→ 排第 5-6
4. **Community Service**（社区贡献）→ 排第 7-8
5. **Personal Interests**（个人爱好、家庭责任）→ 排第 9-10

## 文书时间线（与 BASIS 校历协同）

| 时间 | 任务 | 注意 |
|------|------|------|
| **G11 春** | 开始 brainstorm，列出 5-8 个可能话题 | 不急着写，先积累素材 |
| **G11 暑假** | 写完 Common App 主文书第一稿 | 暑假是集中写作最佳时间 |
| **G12 八月** | 主文书定稿 + 开始 Supplemental Essays | 开学前完成主文书 |
| **G12 九月** | EA/ED 学校的 Supplemental Essays | 每篇至少 3 轮修改 |
| **G12 十月** | EA/ED 全部材料最终检查和提交 | 11/1 或 11/15 截止 |
| **G12 十一月** | RD 学校 Supplemental Essays | 利用 EA 经验改进 |
| **G12 十二月** | RD 全部材料定稿 | 1/1 或 1/5 截止 |

## 与其他 BasisPilot 能力的联动

- **升学规划 → 选校名单** → 确定需要写哪些 Supplemental Essays
- **人文辅导 → 写作能力** → AP English 训练的分析和论证能力直接迁移
- **学生评估 → 自我认知** → 帮助学生找到文书中的独特卖点
- **课外活动策略 → Activities List** → 活动和文书形成统一的申请叙事
- **记忆系统** → 记住学生的目标学校、文书进度、反馈历史
