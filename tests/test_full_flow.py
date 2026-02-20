"""
BASIS Expert Council — 全流程测试
使用自定义 OpenAI 兼容 API 接入 Claude Sonnet
教学问题 10 个 + 商务成单问题 10 个
"""

import os
import json
import time
from openai import OpenAI
from pathlib import Path

# ========== 配置 ==========
API_KEY = os.getenv("OPENAI_API_KEY", "sk-wh9g5NFMvqzaFAiJdClJNw")
BASE_URL = os.getenv("OPENAI_BASE_URL", "http://150.109.16.195:8600/v1")
MODEL = "claude-sonnet-4-5-20250929"

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# ========== 加载知识库 ==========
def load_knowledge():
    """加载 AGENTS.md + 所有 Skills 作为系统知识"""
    knowledge = ""

    # 主 Agent 指令
    agents_md = PROJECT_ROOT / "AGENTS.md"
    if agents_md.exists():
        knowledge += agents_md.read_text(encoding="utf-8") + "\n\n"

    # 所有 Skills
    skills_dir = PROJECT_ROOT / "skills"
    if skills_dir.exists():
        for skill_dir in sorted(skills_dir.iterdir()):
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                knowledge += f"\n\n---\n# SKILL: {skill_dir.name}\n"
                knowledge += skill_md.read_text(encoding="utf-8")

    # 所有 Subagents
    agents_dir = PROJECT_ROOT / "agents"
    if agents_dir.exists():
        for agent_dir in sorted(agents_dir.iterdir()):
            agent_md = agent_dir / "AGENTS.md"
            if agent_md.exists():
                knowledge += f"\n\n---\n# SUBAGENT: {agent_dir.name}\n"
                knowledge += agent_md.read_text(encoding="utf-8")

    return knowledge


# ========== 测试问题 ==========
TEACHING_QUESTIONS = [
    # 数学
    "我孩子在 BASIS G7 学 Geometry，Proofs 那章完全看不懂，怎么辅导？",
    "AP Calculus BC 的 Taylor Series 怎么理解？请用中英双语讲解。",

    # 科学
    "请帮我生成一份 G9 Biology 细胞呼吸 (Cellular Respiration) 的 Lab Report 模板。",
    "AP Chemistry 的化学平衡 (Equilibrium) 和 Le Chatelier 原理怎么教？我是中文母语教师。",

    # 人文
    "孩子在 BASIS G10 的 AP English Language 课上要写 Rhetorical Analysis，完全不会，怎么入门？",
    "AP World History 的 DBQ 怎么写才能拿 6-7 分？给我一个详细的写作框架。",

    # 教学设计
    "我是一名中文母语的数学老师，下周要教 BASIS G8 的 Quadratic Functions，帮我生成一份全英文教案。",

    # 学生评估
    "有一个准备转入 BASIS 深圳 G6 的学生，英语中等偏上，数学较好，帮我做一个评估和衔接方案。",

    # 词汇
    "帮我生成 AP Physics 1 力学 (Mechanics) 单元的学术词汇表，要中英对照。",

    # AP 规划
    "孩子现在 BASIS G9，成绩中上，目标美国 Top 30，帮我规划 G10-G12 的 AP 选课方案。",
]

BUSINESS_QUESTIONS = [
    # 家长心理
    "有个家长说'别的机构我们都试过了，没效果'，我该怎么回应才能签下来？",
    "一个 BASIS 深圳的家长，孩子 G8 成绩掉到 C，很焦虑但嫌我们贵，怎么处理？",

    # 销售转化
    "我们刚开业，第一个月怎么快速获取 20 个 BASIS 家长的联系方式？",
    "家长第一次咨询后说'我回去和孩子爸爸商量一下'，怎么跟进才不会丢单？",

    # 定价策略
    "我们 1 对 1 辅导定价 1000 元/小时，有家长反映太贵。该降价还是换策略？",

    # 市场分析
    "我们在深圳做 BASIS 辅导，广州也有 BASIS 校区，是否应该扩张？帮我分析利弊。",

    # B 端合作
    "有一个 BASIS 离职的科学老师想合作，我应该给什么样的合作方案？",

    # 竞品
    "犀牛教育和翰林学院也做 AP 辅导，我们怎么跟他们竞争？",

    # 续费
    "学期快结束了，怎么让现有的 15 个学生续费下学期？给我一套完整的续费方案。",

    # 商业模式
    "我想在暑假推出一个 BASIS 新生衔接班，帮我设计完整的产品方案（内容+定价+营销）。",
]


# ========== 运行测试 ==========
def run_test(client, system_prompt, question, question_idx, category):
    """运行单个测试"""
    print(f"\n{'='*70}")
    print(f"[{category} Q{question_idx}] {question}")
    print(f"{'='*70}")

    start_time = time.time()

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
            max_tokens=2000,
            temperature=0.7,
        )

        elapsed = time.time() - start_time
        answer = response.choices[0].message.content
        tokens_used = response.usage.total_tokens if response.usage else "N/A"

        print(f"\n{answer}")
        print(f"\n--- [{elapsed:.1f}s | {tokens_used} tokens] ---")

        return {
            "category": category,
            "question_idx": question_idx,
            "question": question,
            "answer": answer,
            "elapsed": elapsed,
            "tokens": tokens_used,
            "status": "success",
        }

    except Exception as e:
        elapsed = time.time() - start_time
        print(f"\n❌ ERROR: {e}")
        return {
            "category": category,
            "question_idx": question_idx,
            "question": question,
            "answer": str(e),
            "elapsed": elapsed,
            "tokens": 0,
            "status": "error",
        }


def main():
    print("=" * 70)
    print("  BASIS 教育专家智囊团 — 全流程测试")
    print(f"  Model: {MODEL}")
    print(f"  API: {BASE_URL}")
    print("=" * 70)

    # 初始化客户端
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

    # 加载知识库
    print("\n📚 加载知识库...")
    knowledge = load_knowledge()
    print(f"   知识库大小: {len(knowledge):,} 字符")

    system_prompt = knowledge

    results = []

    # 教学测试
    print(f"\n{'#'*70}")
    print(f"#  第一部分：教学问题测试（{len(TEACHING_QUESTIONS)} 题）")
    print(f"{'#'*70}")

    for i, q in enumerate(TEACHING_QUESTIONS, 1):
        result = run_test(client, system_prompt, q, i, "教学")
        results.append(result)

    # 商务测试
    print(f"\n{'#'*70}")
    print(f"#  第二部分：商务成单问题测试（{len(BUSINESS_QUESTIONS)} 题）")
    print(f"{'#'*70}")

    for i, q in enumerate(BUSINESS_QUESTIONS, 1):
        result = run_test(client, system_prompt, q, i, "商务")
        results.append(result)

    # 输出汇总
    print(f"\n\n{'='*70}")
    print("  测试汇总")
    print(f"{'='*70}")

    teaching_results = [r for r in results if r["category"] == "教学"]
    business_results = [r for r in results if r["category"] == "商务"]

    teaching_ok = sum(1 for r in teaching_results if r["status"] == "success")
    business_ok = sum(1 for r in business_results if r["status"] == "success")

    teaching_time = sum(r["elapsed"] for r in teaching_results)
    business_time = sum(r["elapsed"] for r in business_results)

    print(f"\n  教学问题: {teaching_ok}/{len(teaching_results)} 成功 | 总耗时 {teaching_time:.1f}s")
    print(f"  商务问题: {business_ok}/{len(business_results)} 成功 | 总耗时 {business_time:.1f}s")
    print(f"  总计:     {teaching_ok+business_ok}/{len(results)} 成功 | 总耗时 {teaching_time+business_time:.1f}s")

    # 保存结果
    output_file = PROJECT_ROOT / "tests" / "test_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n  结果已保存至: {output_file}")


if __name__ == "__main__":
    main()
