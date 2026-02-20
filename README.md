# BASIS Expert Council — 贝赛思教育专家智囊团

基于 [DeepAgents](https://github.com/langchain-ai/deepagents) / LangGraph 架构构建的 AI 教育专家系统，专注于 **BASIS（贝赛思）国际学校教育体系**。

## 解决什么问题

> 中国国际教育市场面临严重的 **师资瓶颈**：能用英语教授学科内容的合格教师极度稀缺。

本项目通过 AI 将 BASIS 教学经验"封装"成可复用的智能体，让普通教师 + AI 系统 ≈ 有经验的 BASIS 教师。

## 架构

```
basis-expert-council/
├── AGENTS.md                          # 主智能体身份和核心知识
├── agents/                            # 子智能体（学科专家）
│   ├── math-expert/AGENTS.md          #   数学专家
│   ├── science-expert/AGENTS.md       #   科学专家（物理/化学/生物）
│   ├── humanities-expert/AGENTS.md    #   人文专家（ELA/History）
│   └── curriculum-advisor/AGENTS.md   #   课程规划与升学顾问
├── skills/                            # Skills（教学能力模块）
│   ├── math-tutoring/SKILL.md         #   数学辅导
│   ├── science-tutoring/SKILL.md      #   科学辅导
│   ├── humanities-tutoring/SKILL.md   #   人文辅导
│   ├── lesson-planning/SKILL.md       #   教案生成
│   ├── ap-exam-prep/SKILL.md          #   AP 考试备考
│   ├── academic-vocabulary/SKILL.md   #   学术英语词汇
│   ├── student-assessment/SKILL.md    #   学生水平评估
│   └── new-student-onboarding/SKILL.md #  新生衔接
├── src/basis_expert_council/
│   ├── __init__.py
│   └── agent.py                       # 主程序入口
└── pyproject.toml
```

### 智能体协作模式

```
                    ┌──────────────────────┐
                    │   BASIS 专家智囊团    │
                    │   (Main Agent)       │
                    │   AGENTS.md          │
                    └──────┬───────────────┘
                           │
              ┌────────────┼────────────┬──────────────┐
              ▼            ▼            ▼              ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
        │ 数学专家  │ │ 科学专家  │ │ 人文专家  │ │ 课程规划顾问  │
        │ Math     │ │ Science  │ │ Humanities│ │ Curriculum   │
        └──────────┘ └──────────┘ └──────────┘ └──────────────┘

Skills 层（按需加载）:
  [数学辅导] [科学辅导] [人文辅导] [教案生成]
  [AP备考] [学术词汇] [学生评估] [新生衔接]
```

## 功能覆盖

| 能力 | 说明 |
|------|------|
| **学科辅导** | 数学/科学/人文全科，中英双语讲解 |
| **教案生成** | 符合 BASIS 标准的全英文教案 |
| **AP 备考** | 全科 AP 考试策略、FRQ 写作训练 |
| **学术词汇** | 按学科/年级生成词汇表 |
| **学生评估** | 水平诊断 + 个性化学习计划 |
| **新生衔接** | 入学准备、转学适应方案 |
| **EMI 教学法** | 指导中文母语教师英语学科教学 |
| **升学规划** | AP 选课、GPA 管理、大学申请策略 |

## 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/xiechengmude/basis-expert-council.git
cd basis-expert-council

# 安装依赖
pip install -e .

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 ANTHROPIC_API_KEY
```

### 运行

```bash
# CLI 模式
basis-expert

# 或直接运行
python -m basis_expert_council.agent
```

### 使用示例

```
你: 我孩子下学期要转入 BASIS 深圳 G7，现在该怎么准备？

BASIS 专家: 从 G7 转入 BASIS 是一个关键节点，因为这是 Middle School 的开始，
全部由 Subject Expert Teachers (SET) 授课...
[详细的衔接方案]

你: AP Calculus AB 的 FRQ 怎么拿高分？

BASIS 专家: AP Calculus AB 的 FRQ 部分占总分 50%，共 6 题...
[委派给数学专家子智能体，给出详细备考策略]

你: 帮我生成一份 G8 物理 Mechanics 的教案

BASIS 专家: [委派给科学专家 + 教案生成 Skill，输出标准 BASIS 教案]
```

## 技术栈

- **AI 框架**: [DeepAgents](https://github.com/langchain-ai/deepagents) + [LangGraph](https://github.com/langchain-ai/langgraph)
- **LLM**: Claude (Anthropic)
- **架构模式**: Multi-Agent + Skills + Middleware

## License

MIT
