---
name: basis-admission-prep
description: "BASIS 入学考试备考指导。当用户询问贝赛思入学考试、入学备考策略、MAP 阅读备考、数学自命题准备、入学写作训练、面试准备、入学模拟测试时使用此 skill。"
license: MIT
compatibility: "Deep Agents CLI"
metadata:
  author: "basis-expert-council"
  version: "1.0"
  target: "Students, Parents"
  grades: "G2-G9"
  category: "admission_prep"
allowed-tools: "Read Write"
---

# BASIS 入学考试备考指导 Skill

## 何时使用

当用户需要：
- BASIS 入学考试备考规划与策略
- MAP 阅读考试备考
- 数学自命题考试准备
- 入学写作考试训练
- 口语面试准备
- 入学考试模拟测评
- 各年级入学考试考点咨询

> **注意分工**：本 skill 负责"入学考试备考"。入学后的学校适应与衔接请转交 `new-student-onboarding` skill；具体学科深度辅导请转交 `math-tutoring` 或 `humanities-tutoring` skill。

---

## 模块 1: 考试全景图

### 考试科目与结构（2025 最新）

| 科目 | 时长 | 题量 | 题型 | 系统 |
|------|------|------|------|------|
| **MAP 阅读** | ~2 小时 | 40 题（2025 年由 20 题翻倍） | 选择题（自适应） | NWEA MAP 机考 |
| **数学自命题** | ~60 分钟 | ~30 题 | 计算题 70% + 几何 20% + 文字题 10% | 贝赛思自主命题（英文卷） |
| **英文写作** | 30 分钟 | 1 篇 | 议论文/记叙文/文学分析 | 纸笔 |
| **口语面试** | ~15 分钟 | — | 自我介绍 + 互动问答 + 看图说话 | 外教一对一 |

> 2022 年起，G2 以上数学已从 MAP 系统改为**贝赛思自主命题**，难度更大。

### 2025 年最新变化
- MAP 阅读题量翻倍：20 题 → **40 题**，时长 ~50 分钟 → **~2 小时**
- 口语面试新增题型：**选词填空**（语法填空）+ **朗读文段**（考察语音语调、连读弱读）
- 据学员反馈，MAP 高分学生**原题率高达 80%+**

### 各年级难度总览

| 年级段 | 数学难度 | 英语难度 | 写作难度 |
|--------|----------|----------|----------|
| G2-G3 | 常规（进位/借位重点） | 基础词汇 + 简单阅读 | 看图写作 |
| G4-G5 | 中等偏难（超前 1-2 年级） | 3000-4500 词汇量 | 五段式议论文 |
| G6-G7 | 难（代数 + 几何综合） | 5000-7000 词汇量 | 议论文 + 对比 |
| G8-G9 | 高难度（三角/复数/概率） | 超大学六级词汇要求 | 文学分析 |

---

## 模块 2: 数学自命题备考

教材体系对标 **Saxon Math**，难度比公立学校**超前 1-2 个年级**。全英文卷面，必须掌握英文数学术语。

### G2-G3 考点清单
- 加减乘除竖式计算（重点：进位 carry / 借位 borrow）
- 乘除逆反运算（如"一个数 ×4 = 20，求该数"）
- 简单几何图形识别
- 基础文字题（英文理解 + 计算）

**G2-G3 核心术语表：**

| 英文术语 | 中文 | 英文术语 | 中文 |
|----------|------|----------|------|
| addition | 加法 | subtraction | 减法 |
| sum | 和 | difference | 差 |
| multiplication | 乘法 | division | 除法 |
| product | 积 | quotient | 商 |
| divisor | 除数 | dividend | 被除数 |
| remainder | 余数 | carry | 进位 |
| borrow | 借位 | digit | 数位 |
| even number | 偶数 | odd number | 奇数 |

### G4-G5 考点清单
- 小数 / 分数 / 带分数四则运算
- 混合运算（先乘除后加减）
- 简单一次方程
- 负数运算
- 平面图形面积
- 占比类文字题
- 次方运算、百分比应用题
- 单位换算、科学计数法

**G4-G5 核心术语表：**

| 英文术语 | 中文 | 英文术语 | 中文 |
|----------|------|----------|------|
| fraction | 分数 | decimal | 小数 |
| numerator | 分子 | denominator | 分母 |
| mixed number | 带分数 | improper fraction | 假分数 |
| simplify / reduce | 约分 | equivalent fraction | 等价分数 |
| negative number | 负数 | absolute value | 绝对值 |
| exponent / power | 指数/幂 | equation | 方程 |
| variable | 变量 | perimeter | 周长 |
| area | 面积 | percentage | 百分比 |
| ratio | 比率 | proportion | 比例 |
| scientific notation | 科学计数法 | unit conversion | 单位换算 |

**G4-G5 典型样题**：
- 分数乘法：分子相乘、分母相乘、约分
- 小数乘法：注意小数点位数还原
- 百分比应用："A store has a 30% off sale. If the original price is $45, what is the sale price?"

### G6-G7 考点清单
- 解方程、化简代数式
- 指数运算
- 不等式
- 圆 / 立体图形的体积 / 表面积 / 周长
- 文字嵌套几何题（根据文字描述构建图形再解题）

**G6-G7 核心术语表：**

| 英文术语 | 中文 | 英文术语 | 中文 |
|----------|------|----------|------|
| algebra | 代数 | expression | 表达式 |
| coefficient | 系数 | constant | 常数 |
| inequality | 不等式 | linear equation | 一次方程 |
| slope | 斜率 | intercept | 截距 |
| radius | 半径 | diameter | 直径 |
| circumference | 周长（圆） | volume | 体积 |
| surface area | 表面积 | cylinder | 圆柱 |
| cone | 圆锥 | sphere | 球体 |
| coordinate plane | 坐标平面 | parallel | 平行 |
| perpendicular | 垂直 | congruent | 全等 |

### G8-G9 考点清单
- 二次方程
- 根式与分式
- 三角函数
- 复数
- 二次函数图像
- 概率
- 勾股定理应用

**G8-G9 核心术语表：**

| 英文术语 | 中文 | 英文术语 | 中文 |
|----------|------|----------|------|
| quadratic equation | 二次方程 | polynomial | 多项式 |
| square root / radical | 平方根/根式 | rational expression | 分式 |
| complex number | 复数 | imaginary number | 虚数 |
| trigonometry | 三角函数 | sine / cosine / tangent | 正弦/余弦/正切 |
| Pythagorean theorem | 勾股定理 | hypotenuse | 斜边 |
| probability | 概率 | permutation | 排列 |
| combination | 组合 | parabola | 抛物线 |
| vertex | 顶点 | axis of symmetry | 对称轴 |
| domain | 定义域 | range | 值域 |
| asymptote | 渐近线 | logarithm | 对数 |

### 数学常见失分点与应对

| 失分点 | 原因 | 应对策略 |
|--------|------|----------|
| 竖式进位/借位出错 | 计算粗心 | 每题验算，养成逆运算检查习惯 |
| 分数约分遗漏 | 结果未化简 | 最后一步始终检查是否最简分数 |
| 文字题理解偏差 | 英文阅读能力不足 | 专练英文数学文字题，标注关键词 |
| 文字嵌套几何题 | 无法将文字转化为图形 | 先画图再解题，练习"读题→画图→列式"三步法 |
| 单位换算出错 | 英制/公制混淆 | 背熟英制单位（inch, foot, yard, mile, ounce, pound） |

### 推荐教材与资源
- **Saxon Math** 系列（对标 BASIS 教材体系）
- **Art of Problem Solving (AoPS)** 系列（拔高训练）
- **AMC 8 / AMC 10 真题**（竞赛难度训练）
- **Khan Academy**（英文数学视频 + 练习）

---

## 模块 3: MAP 阅读备考

### 三大题型与策略

**1. 词汇题（Vocabulary）**
- 考查方式：结合语境理解生词（context clues）
- 策略：不要只背单词表，要练习"根据上下文猜词义"
- 重点技巧：词根词缀法（prefix, suffix, root）、同义词替换法

**2. 文学类文本（Literary Text）**
- 考查内容：小说、诗歌、戏剧鉴赏
- 重点：作者写作手法（author's craft）、修辞手法（figurative language）、写作目的（author's purpose）
- 策略：先读问题再读文章，标注关键句

**3. 信息类文本（Informational Text）**
- 考查内容：判断文章目的和组织结构（高频考点）
- 重点：主旨大意（main idea）、细节推断（inference）、文本结构（text structure）
- 策略：关注首尾段、转折词、标题和小标题

### 词汇量阶梯目标

| 年级段 | 目标词汇量 | 对标水平 | 每日新词目标 |
|--------|-----------|----------|-------------|
| G3-G4 | 3,000+ | 已超公立高中要求 | 8-10 词 |
| G5-G6 | 4,000-5,000 | 接近大学四级 | 10-12 词 |
| G6-G7 | 5,000-6,000 | 大学四六级之间 | 12-15 词 |
| G8-G9 | 6,000-7,000+ | 超大学六级 | 15-20 词 |

### 自适应考试应对技巧
- MAP 是自适应考试：答对则难度上升，答错则下降
- **不要在简单题上浪费时间**：快速确认答案，节省时间给难题
- **不要因为题目变难而慌张**：题目变难说明你答对了，这是好事
- **每题都要作答**：不答题等于答错，猜测也比空白好
- **注意时间分配**：40 题 / 2 小时 = 平均每题 3 分钟

### 推荐阅读材料分级表

| 年级段 | 推荐材料 | 类型 |
|--------|----------|------|
| G2-G3 | Magic Tree House, Junie B. Jones | 章节书入门 |
| G4-G5 | Percy Jackson, Harry Potter (1-3), Newsela (Grade 4-5) | 小说 + 学术文章 |
| G6-G7 | The Giver, Holes, Wonder, National Geographic articles | 文学 + 非虚构 |
| G8-G9 | To Kill a Mockingbird, Animal Farm, The Economist (selected) | 经典文学 + 时事 |

---

## 模块 4: 英文写作备考

### 各年级写作题型表

| 年级段 | 题型 | 字数要求 | 评分重点 |
|--------|------|----------|----------|
| G2-G3 | 看图写作 | 50-100 词 | 描述完整性、基础语法 |
| G4-G5 | 记叙文 / 议论文 | 150-250 词 | 五段式结构、逻辑连贯 |
| G6-G7 | 议论文 | 250-350 词 | 论点清晰、论据充分、过渡句 |
| G8 | 议论文 / 书信体 | 300-400 词 | 观点深度、用词准确 |
| G9 | 文学分析 | 350-500 词 | 分析深度、文学术语运用 |

### 真题 Prompt 库

**G2-G3 真题：**
1. "Look at the picture (a boy's birthday party). Describe what you see and what is happening."（看图写作）

**G4-G5 真题：**
2. "Describe a time when you failed or faced a setback."（记叙文）
3. "What is the thing you are most afraid of? How did you overcome it?"（记叙文）
4. "Describe a rule in your family that you don't like. Give three reasons why it should be changed."（五段式议论文，2022 真题）

**G6-G7 真题：**
5. "Should students be given homework during school breaks?"（议论文）
6. "Choose a city for a school trip (Xi'an / Guilin / Cairns). Give three reasons for your choice."（五段式议论文）

**G8 真题：**
7. "Choose a medical or scientific problem. Explain why it is more important than others."（议论文）
8. "Write a letter to Elon Musk explaining why you should be a member of the Mars colony."（议论文/书信体）
9. "What is the most popular thing recently?"（议论文）
10. "Which virus is the scariest?"（议论文）

**G9 真题：**
11. "Analyze the characterization in *The Colour of Magic* — identify direct and indirect characterization, analyze dialogue, and discuss the effect of literary devices."（文学分析）

### 五段式议论文模板（G4-G8 通用）

```
Paragraph 1 — Introduction
  - Hook（引起注意的开头句）
  - Background（简要背景信息）
  - Thesis Statement（明确表达你的观点）

Paragraph 2 — Reason 1
  - Topic Sentence（第一个理由）
  - Evidence / Example（具体证据或例子）
  - Explanation（解释为什么这个理由支持你的观点）

Paragraph 3 — Reason 2
  - Topic Sentence（第二个理由）
  - Evidence / Example
  - Explanation

Paragraph 4 — Reason 3 OR Counterargument
  - 可选：第三个理由，或反驳对方观点再回到自己立场
  - Evidence / Example
  - Explanation

Paragraph 5 — Conclusion
  - Restate Thesis（重申观点，换一种说法）
  - Summarize Reasons（总结理由）
  - Call to Action / Final Thought（号召行动或留下思考）
```

### 写作评分维度

| 维度 | 权重 | 评分标准 |
|------|------|----------|
| **Ideas & Content** | 30% | 观点明确、论据充分、有深度 |
| **Organization** | 25% | 结构清晰、段落过渡自然 |
| **Voice & Tone** | 15% | 语气得体、有个人风格 |
| **Word Choice** | 15% | 用词准确、丰富、避免重复 |
| **Conventions** | 15% | 拼写、语法、标点正确 |

### G9 文学分析框架（SOAPSTone）

| 要素 | 含义 | 分析要点 |
|------|------|----------|
| **S** — Speaker | 叙述者/说话者 | 谁在讲述？第几人称？可靠叙述者？ |
| **O** — Occasion | 场景/背景 | 写作的时代背景和具体情境 |
| **A** — Audience | 读者/受众 | 目标读者是谁？如何影响写作策略？ |
| **P** — Purpose | 目的 | 作者写作的目的（说服/告知/娱乐/批判） |
| **S** — Subject | 主题 | 文本的核心主题是什么？ |
| **Tone** — Tone | 语气 | 作者的态度（讽刺/严肃/幽默/悲伤） |

---

## 模块 5: 口语面试备考

### 三环节结构

| 环节 | 时长 | 内容 | 评分重点 |
|------|------|------|----------|
| 自我介绍 | 2-3 分钟 | 姓名、年龄、学校、爱好、特长 | 流利度、自信心 |
| 互动问答 | 5-8 分钟 | 学校相关、个人经历、观点表达 | 逻辑性、词汇量 |
| 看图说话 | 5 分钟 | 描述图片 + 推断 + 发表观点 | 描述能力、想象力 |

### 面试真题库

**自我介绍 & 基础问答类：**
1. "Tell me about yourself — your name, age, and where you're from."
2. "What are your favorite foods / subjects / books?"
3. "What do you usually do on weekends?"
4. "What is the most memorable place you have visited?"
5. "Tell me about your family — do you have siblings or pets?"

**学校相关类：**
6. "What is your favorite subject and why?"
7. "How did today's exam feel?"
8. "Why do you want to join BASIS?"
9. "What university do you hope to attend? What do you want to study?"
10. "What would you change about your current school?"

**个人经历 & 观点类：**
11. "Tell me about a challenge you faced and how you overcame it."
12. "What is your biggest achievement?"
13. "If you could have any superpower, what would it be and why?"
14. "What do you want to be when you grow up?"
15. "Describe your best friend."

**看图说话类（Picture Description）：**
16. 职业类图片 — 描述图中人物的职业和他们正在做什么
17. 自然灾害类 — 如洪水救援、建筑损毁场景
18. 情景类 — 老人与猫、心形树叶、海滩场景
19. 连续故事图 — "几个人在森林里发现飞机并救出两人"（2024 真题，三幅连续图）
20. 校园生活类 — 课堂、操场、图书馆场景

### 看图说话应答框架

```
Step 1 — 描述（Describe）
  "In this picture, I can see..."
  "There is/are... in the picture."
  描述人物、地点、动作、表情

Step 2 — 推断（Infer）
  "I think this is happening because..."
  "It seems like..."
  推断原因、情感、背景故事

Step 3 — 观点（Opinion）
  "In my opinion..."
  "This reminds me of..."
  "If I were in this situation, I would..."
  表达个人看法或联系自身经验
```

### 2025 年新增题型应对

**选词填空（Word Selection）：**
- 本质是语法填空，考查词性判断和语法搭配
- 应对：加强英语语法基础，特别是动词时态、介词搭配、冠词用法
- 练习方式：完形填空（cloze test）练习

**朗读文段（Oral Reading）：**
- 考查语音语调、连读弱读、意群停顿
- 应对：每天大声朗读英文文章 10-15 分钟
- 重点：意群断句（sense groups）、重音（stress）、连读（linking）
- 练习材料：BBC Learning English, VOA Special English

---

## 模块 6: 备考时间线模板

### 考前 3 个月计划

| 阶段 | 时间 | 重点任务 | 联动 Skill |
|------|------|----------|------------|
| **基础夯实期** | 第 1 个月 | 词汇积累 + 数学查缺补漏 + 写作结构入门 | `math-tutoring` |
| **强化突破期** | 第 2 个月 | MAP 阅读专练 + 数学限时训练 + 写作实战 | `humanities-tutoring` |
| **冲刺模拟期** | 第 3 个月（考前） | 全真模拟 + 口语面试练习 + 查漏补缺 | 本 skill |

### 每日时间分配建议（2-3 小时）

| 时间 | 内容 | 说明 |
|------|------|------|
| 40 分钟 | 数学练习 | 对标年级考点刷题，全英文卷面 |
| 40 分钟 | 英文阅读 | MAP 阅读真题 / 分级阅读材料 |
| 30 分钟 | 词汇积累 | 学术词汇 + 数学英文术语 |
| 20 分钟 | 写作练习 | 每两天完成一篇完整作文 |
| 15 分钟 | 口语练习 | 自我介绍 / 看图说话 / 朗读 |

### 考前 1 个月冲刺

- **每周完成 1 套完整模拟卷**（数学 + 阅读 + 写作）
- **每周 2 次口语面试模拟**（家长或老师扮演面试官）
- **重点突破薄弱环节**：根据模拟结果调整复习重点
- **整理错题本**：分类标注错因（计算失误 / 概念不清 / 英文理解 / 时间不够）

### 考前 1 周安排

| 天数 | 安排 |
|------|------|
| Day 7-5 | 回顾错题本，重点练习高频失分题型 |
| Day 4-3 | 做一套完整模拟卷，计时练习 |
| Day 2 | 轻度复习，重点看数学术语表和写作模板 |
| Day 1 | 休息调整，准备考试用品，早睡 |

---

## 模块 7: 中国学生常见问题与应对

### 四大典型障碍

**1. 数学英文术语障碍**
- 表现：数学能力足够，但看不懂英文题目
- 应对：按年级段背诵本 skill 中的术语表，每天用英文做 5 道数学题
- 时间线：术语积累需要至少 4-6 周

**2. 写作逻辑结构差距**
- 表现：能写出句子但缺乏段落结构和逻辑衔接
- 应对：熟练掌握五段式议论文模板，每周写 2-3 篇练习
- 关键：先学结构再提升内容深度

**3. 口语表达流利度不足**
- 表现：能读写但不敢开口或说话断断续续
- 应对：每天 15 分钟英文朗读 + 每周 2 次模拟面试
- 技巧：用"填充词"（Well, Actually, I think...）避免冷场

**4. MAP 阅读速度不足**
- 表现：能理解文章但做不完题
- 应对：练习略读（skimming）和扫读（scanning）技巧
- 目标：平均每题控制在 3 分钟以内

### 家长高频 FAQ

**Q: 孩子几年级开始准备入学考试最合适？**
A: 建议至少提前 **6 个月** 开始准备。G2-G3 准备周期可短些（3 个月），G6 以上建议 6-12 个月。

**Q: 数学能力很强但英语一般，能通过吗？**
A: 数学只占一科，MAP 阅读和写作对英语要求很高。中国学生数学通常不是问题，**英语才是决定录取的关键**。建议将 60% 备考时间投入英语。

**Q: 需要报机构培训班吗？**
A: 如果家长能按本备考计划执行，自主备考完全可行。但如果孩子自律性不足或英语基础较弱，结构化的培训课程会有帮助。关键是**有没有系统的练习计划**，而非机构本身。

**Q: 考试可以重考吗？**
A: 通常每个申请季有 1-2 次考试机会。部分校区允许补考，但第一次成绩印象很重要。建议**一次性准备充分**。

**Q: MAP 阅读有原题吗？可以刷真题吗？**
A: 据反馈，MAP 高分学生原题率高达 80%+。建议通过 MAP 在线练习平台和历年真题合集进行刷题。但注意 MAP 是自适应的，题库庞大，不能只依赖刷题。

**Q: 口语面试权重大吗？**
A: 面试是综合评估的一部分，虽然不像笔试有明确分数线，但表现差会显著降低录取几率。特别是高年级（G6+），面试中的思维深度和表达能力越来越重要。
