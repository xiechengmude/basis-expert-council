"""
BasisPilot — Math Seed Questions (G5-G8)
Aligned to BASIS curriculum (1-2 years ahead of typical US public schools).

Run: python -m src.basis_expert_council.seed_questions_math
"""

import asyncio
import json

from . import db

# ---------------------------------------------------------------------------
# G5 — Pre-Algebra
# ---------------------------------------------------------------------------

G5_QUESTIONS = [
    {
        "subject": "math", "grade_level": "G5", "topic": "integers",
        "subtopic": "negative_numbers", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "What is the value of -8 + 5?",
            "options": ["A. -13", "B. -3", "C. 3", "D. 13"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "-8 + 5 的值是多少？",
            "options": ["A. -13", "B. -3", "C. 3", "D. 13"],
            "answer": "B",
        },
        "tags": ["integers", "addition", "negative_numbers"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "integers",
        "subtopic": "multiplication", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "What is (-6) × 4?",
            "options": ["A. -24", "B. -10", "C. 10", "D. 24"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "(-6) × 4 等于多少？",
            "options": ["A. -24", "B. -10", "C. 10", "D. 24"],
            "answer": "A",
        },
        "tags": ["integers", "multiplication"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "fractions",
        "subtopic": "addition", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "What is 2/3 + 1/4?",
            "options": ["A. 3/7", "B. 11/12", "C. 8/12", "D. 1"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "2/3 + 1/4 等于多少？",
            "options": ["A. 3/7", "B. 11/12", "C. 8/12", "D. 1"],
            "answer": "B",
        },
        "tags": ["fractions", "addition", "common_denominator"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "fractions",
        "subtopic": "division", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "What is 3/5 ÷ 2/3?",
            "options": ["A. 6/15", "B. 9/10", "C. 2/5", "D. 5/6"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "3/5 ÷ 2/3 等于多少？",
            "options": ["A. 6/15", "B. 9/10", "C. 2/5", "D. 5/6"],
            "answer": "B",
        },
        "tags": ["fractions", "division", "reciprocal"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "decimals",
        "subtopic": "operations", "difficulty": 0.35, "question_type": "fill_in",
        "content_en": {
            "stem": "Calculate: 3.6 × 0.5 = ?",
            "answer": "1.8",
        },
        "content_zh": {
            "stem": "计算：3.6 × 0.5 = ?",
            "answer": "1.8",
        },
        "tags": ["decimals", "multiplication"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "ratios",
        "subtopic": "proportions", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "If the ratio of boys to girls in a class is 3:5, and there are 24 students total, how many girls are there?",
            "options": ["A. 9", "B. 12", "C. 15", "D. 18"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "班级中男女生比例为 3:5，全班共 24 人，女生有多少人？",
            "options": ["A. 9 人", "B. 12 人", "C. 15 人", "D. 18 人"],
            "answer": "C",
        },
        "tags": ["ratios", "proportions", "word_problem"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "expressions",
        "subtopic": "order_of_operations", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Evaluate: 3 + 4 × 2 - 1",
            "options": ["A. 10", "B. 13", "C. 14", "D. 8"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "计算：3 + 4 × 2 - 1",
            "options": ["A. 10", "B. 13", "C. 14", "D. 8"],
            "answer": "A",
        },
        "tags": ["expressions", "order_of_operations", "PEMDAS"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "expressions",
        "subtopic": "variables", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "If x = 4, what is the value of 3x + 7?",
            "options": ["A. 14", "B. 17", "C. 19", "D. 21"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "当 x = 4 时，3x + 7 等于多少？",
            "options": ["A. 14", "B. 17", "C. 19", "D. 21"],
            "answer": "C",
        },
        "tags": ["expressions", "variables", "substitution"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "geometry",
        "subtopic": "area", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "A triangle has a base of 10 cm and a height of 6 cm. What is its area?",
            "options": ["A. 16 cm²", "B. 30 cm²", "C. 60 cm²", "D. 20 cm²"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个三角形底边 10 厘米，高 6 厘米，面积是多少？",
            "options": ["A. 16 cm²", "B. 30 cm²", "C. 60 cm²", "D. 20 cm²"],
            "answer": "B",
        },
        "tags": ["geometry", "area", "triangle"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "word_problems",
        "subtopic": "multi_step", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A store sells pencils for $0.75 each. If Sarah has $5.00 and buys as many pencils as she can, how much change will she receive?",
            "options": ["A. $0.25", "B. $0.50", "C. $0.75", "D. $0.00"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "商店每支铅笔 $0.75。Sarah 有 $5.00，她买尽可能多的铅笔后还剩多少钱？",
            "options": ["A. $0.25", "B. $0.50", "C. $0.75", "D. $0.00"],
            "answer": "B",
        },
        "tags": ["word_problems", "division", "remainder"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "integers",
        "subtopic": "absolute_value", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Which of the following has the greatest absolute value?",
            "options": ["A. -12", "B. 8", "C. -5", "D. 10"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "以下哪个数的绝对值最大？",
            "options": ["A. -12", "B. 8", "C. -5", "D. 10"],
            "answer": "A",
        },
        "tags": ["integers", "absolute_value"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "ratios",
        "subtopic": "percents", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "What is 25% of 80?",
            "answer": "20",
        },
        "content_zh": {
            "stem": "80 的 25% 是多少？",
            "answer": "20",
        },
        "tags": ["ratios", "percents"],
    },
    # --- G5 新增题 (13 道，扩充至 25 道) ---
    {
        "subject": "math", "grade_level": "G5", "topic": "integers",
        "subtopic": "order_of_operations", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Evaluate: (-3) × (-4) + 2",
            "options": ["A. 14", "B. 10", "C. -10", "D. -14"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "计算：(-3) × (-4) + 2",
            "options": ["A. 14", "B. 10", "C. -10", "D. -14"],
            "answer": "A",
        },
        "tags": ["integers", "multiplication", "order_of_operations"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "fractions",
        "subtopic": "multiplication", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "What is 3/4 × 2/5?",
            "options": ["A. 6/20", "B. 3/10", "C. 5/9", "D. 6/9"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "3/4 × 2/5 等于多少？",
            "options": ["A. 6/20", "B. 3/10", "C. 5/9", "D. 6/9"],
            "answer": "B",
        },
        "tags": ["fractions", "multiplication"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "fractions",
        "subtopic": "mixed_numbers", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Convert 2 3/8 to an improper fraction.",
            "options": ["A. 11/8", "B. 19/8", "C. 16/8", "D. 13/8"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "将 2 又 3/8 转换为假分数。",
            "options": ["A. 11/8", "B. 19/8", "C. 16/8", "D. 13/8"],
            "answer": "B",
        },
        "tags": ["fractions", "mixed_numbers", "conversion"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "decimals",
        "subtopic": "division", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "What is 7.5 ÷ 0.25?",
            "options": ["A. 3", "B. 30", "C. 0.3", "D. 300"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "7.5 ÷ 0.25 等于多少？",
            "options": ["A. 3", "B. 30", "C. 0.3", "D. 300"],
            "answer": "B",
        },
        "tags": ["decimals", "division"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "decimals",
        "subtopic": "fraction_conversion", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which fraction is equivalent to 0.375?",
            "options": ["A. 3/8", "B. 3/5", "C. 3/10", "D. 37/100"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "0.375 等于哪个分数？",
            "options": ["A. 3/8", "B. 3/5", "C. 3/10", "D. 37/100"],
            "answer": "A",
        },
        "tags": ["decimals", "fractions", "conversion"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "ratios",
        "subtopic": "unit_rate", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "A car travels 240 miles in 4 hours. What is the unit rate in miles per hour?",
            "options": ["A. 40 mph", "B. 50 mph", "C. 60 mph", "D. 80 mph"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一辆车 4 小时行驶 240 英里，单位速率是多少？",
            "options": ["A. 40 英里/时", "B. 50 英里/时", "C. 60 英里/时", "D. 80 英里/时"],
            "answer": "C",
        },
        "tags": ["ratios", "unit_rate", "speed"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "geometry",
        "subtopic": "perimeter", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "A rectangle has length 12 cm and width 7 cm. What is its perimeter?",
            "options": ["A. 19 cm", "B. 38 cm", "C. 84 cm", "D. 26 cm"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "长方形长 12 厘米、宽 7 厘米，周长是多少？",
            "options": ["A. 19 cm", "B. 38 cm", "C. 84 cm", "D. 26 cm"],
            "answer": "B",
        },
        "tags": ["geometry", "perimeter", "rectangle"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "geometry",
        "subtopic": "volume", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A rectangular prism has length 5 cm, width 3 cm, and height 4 cm. What is its volume?",
            "options": ["A. 12 cm³", "B. 60 cm³", "C. 30 cm³", "D. 24 cm³"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "长方体长 5 厘米、宽 3 厘米、高 4 厘米，体积是多少？",
            "options": ["A. 12 cm³", "B. 60 cm³", "C. 30 cm³", "D. 24 cm³"],
            "answer": "B",
        },
        "tags": ["geometry", "volume", "rectangular_prism"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "expressions",
        "subtopic": "distributive", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Use the distributive property to expand: 4(3x + 2)",
            "options": ["A. 12x + 2", "B. 12x + 8", "C. 7x + 6", "D. 12x + 6"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "用分配律展开：4(3x + 2)",
            "options": ["A. 12x + 2", "B. 12x + 8", "C. 7x + 6", "D. 12x + 6"],
            "answer": "B",
        },
        "tags": ["expressions", "distributive_property"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "word_problems",
        "subtopic": "fractions", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A recipe requires 2/3 cup of sugar. If you want to make 1.5 times the recipe, how much sugar do you need?",
            "options": ["A. 3/4 cup", "B. 1 cup", "C. 5/6 cup", "D. 2/3 cup"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个食谱需要 2/3 杯糖。如果要做 1.5 倍的量，需要多少糖？",
            "options": ["A. 3/4 杯", "B. 1 杯", "C. 5/6 杯", "D. 2/3 杯"],
            "answer": "B",
        },
        "tags": ["word_problems", "fractions", "multiplication"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "integers",
        "subtopic": "number_line", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Which number is farthest from 0 on a number line?",
            "options": ["A. -7", "B. 4", "C. -3", "D. 6"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "在数轴上，哪个数离 0 最远？",
            "options": ["A. -7", "B. 4", "C. -3", "D. 6"],
            "answer": "A",
        },
        "tags": ["integers", "number_line", "absolute_value"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "data_analysis",
        "subtopic": "mean", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Find the mean of: 12, 15, 18, 21, 24",
            "options": ["A. 15", "B. 18", "C. 20", "D. 21"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "求以下数据的平均值：12, 15, 18, 21, 24",
            "options": ["A. 15", "B. 18", "C. 20", "D. 21"],
            "answer": "B",
        },
        "tags": ["data_analysis", "mean", "average"],
    },
    {
        "subject": "math", "grade_level": "G5", "topic": "expressions",
        "subtopic": "inequalities_basic", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which value of n makes 2n + 3 > 11 true?",
            "options": ["A. n = 3", "B. n = 4", "C. n = 5", "D. n = 2"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个 n 的值使 2n + 3 > 11 成立？",
            "options": ["A. n = 3", "B. n = 4", "C. n = 5", "D. n = 2"],
            "answer": "C",
        },
        "tags": ["expressions", "inequalities", "substitution"],
    },
]

# ---------------------------------------------------------------------------
# G6 — Algebra I
# ---------------------------------------------------------------------------

G6_QUESTIONS = [
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_equations",
        "subtopic": "one_variable", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Solve for x: 2x + 5 = 13",
            "options": ["A. x = 3", "B. x = 4", "C. x = 5", "D. x = 9"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "解方程：2x + 5 = 13",
            "options": ["A. x = 3", "B. x = 4", "C. x = 5", "D. x = 9"],
            "answer": "B",
        },
        "tags": ["linear_equations", "solving"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_equations",
        "subtopic": "two_step", "difficulty": 0.45, "question_type": "fill_in",
        "content_en": {
            "stem": "Solve for x: 3(x - 2) = 15. What is x?",
            "answer": "7",
        },
        "content_zh": {
            "stem": "解方程：3(x - 2) = 15，x 等于多少？",
            "answer": "7",
        },
        "tags": ["linear_equations", "distributive_property"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "inequalities",
        "subtopic": "one_variable", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which value of x satisfies the inequality 3x - 7 > 8?",
            "options": ["A. x = 3", "B. x = 4", "C. x = 5", "D. x = 6"],
            "answer": "D",
        },
        "content_zh": {
            "stem": "下列哪个 x 的值满足不等式 3x - 7 > 8？",
            "options": ["A. x = 3", "B. x = 4", "C. x = 5", "D. x = 6"],
            "answer": "D",
        },
        "tags": ["inequalities", "solving"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_functions",
        "subtopic": "slope", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "What is the slope of the line passing through points (2, 3) and (6, 11)?",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "过点 (2, 3) 和 (6, 11) 的直线斜率是多少？",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "answer": "B",
        },
        "tags": ["linear_functions", "slope", "coordinate_geometry"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_functions",
        "subtopic": "graphing", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The equation y = 2x - 3 represents a line. What is the y-intercept?",
            "options": ["A. 2", "B. -3", "C. 3", "D. -2"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "方程 y = 2x - 3 表示一条直线，y 截距是多少？",
            "options": ["A. 2", "B. -3", "C. 3", "D. -2"],
            "answer": "B",
        },
        "tags": ["linear_functions", "y_intercept", "slope_intercept"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "systems",
        "subtopic": "substitution", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Solve the system: y = x + 2 and y = 3x - 4. What is x?",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "解方程组：y = x + 2 和 y = 3x - 4，x 等于多少？",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "answer": "C",
        },
        "tags": ["systems", "substitution"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "exponents",
        "subtopic": "rules", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Simplify: 2³ × 2⁴",
            "options": ["A. 2⁷", "B. 2¹²", "C. 4⁷", "D. 4¹²"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "化简：2³ × 2⁴",
            "options": ["A. 2⁷", "B. 2¹²", "C. 4⁷", "D. 4¹²"],
            "answer": "A",
        },
        "tags": ["exponents", "product_rule"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "polynomials",
        "subtopic": "combining", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Simplify: (3x² + 2x - 5) + (x² - 4x + 3)",
            "options": ["A. 4x² - 2x - 2", "B. 4x² + 6x - 2", "C. 3x² - 2x - 2", "D. 4x² - 2x + 8"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "化简：(3x² + 2x - 5) + (x² - 4x + 3)",
            "options": ["A. 4x² - 2x - 2", "B. 4x² + 6x - 2", "C. 3x² - 2x - 2", "D. 4x² - 2x + 8"],
            "answer": "A",
        },
        "tags": ["polynomials", "combining_like_terms"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "word_problems",
        "subtopic": "linear_application", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A taxi charges $3.00 base fare plus $2.50 per mile. If the total fare is $15.50, how many miles was the trip?",
            "options": ["A. 4 miles", "B. 5 miles", "C. 6 miles", "D. 7 miles"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "出租车起步价 $3.00，每英里 $2.50。如果总费用 $15.50，行驶了多少英里？",
            "options": ["A. 4 英里", "B. 5 英里", "C. 6 英里", "D. 7 英里"],
            "answer": "B",
        },
        "tags": ["word_problems", "linear_equations", "application"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "polynomials",
        "subtopic": "factoring_basics", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "Factor completely: x² + 5x + 6",
            "options": ["A. (x+1)(x+6)", "B. (x+2)(x+3)", "C. (x+3)(x+3)", "D. (x-2)(x-3)"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "完全因式分解：x² + 5x + 6",
            "options": ["A. (x+1)(x+6)", "B. (x+2)(x+3)", "C. (x+3)(x+3)", "D. (x-2)(x-3)"],
            "answer": "B",
        },
        "tags": ["polynomials", "factoring", "trinomials"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "radicals",
        "subtopic": "square_roots", "difficulty": 0.4, "question_type": "fill_in",
        "content_en": {
            "stem": "What is √144?",
            "answer": "12",
        },
        "content_zh": {
            "stem": "√144 等于多少？",
            "answer": "12",
        },
        "tags": ["radicals", "square_roots", "perfect_squares"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "quadratics",
        "subtopic": "solving", "difficulty": 0.75, "question_type": "mcq",
        "content_en": {
            "stem": "Solve: x² - 9 = 0. What are the solutions?",
            "options": ["A. x = 3 only", "B. x = -3 only", "C. x = 3 or x = -3", "D. x = 9"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "解方程：x² - 9 = 0，解是什么？",
            "options": ["A. 仅 x = 3", "B. 仅 x = -3", "C. x = 3 或 x = -3", "D. x = 9"],
            "answer": "C",
        },
        "tags": ["quadratics", "difference_of_squares", "factoring"],
    },
    # --- G6 新增题 (13 道，扩充至 25 道) ---
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_equations",
        "subtopic": "fractions", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Solve for x: x/3 + 5 = 9",
            "options": ["A. x = 4", "B. x = 12", "C. x = 15", "D. x = 42"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "解方程：x/3 + 5 = 9",
            "options": ["A. x = 4", "B. x = 12", "C. x = 15", "D. x = 42"],
            "answer": "B",
        },
        "tags": ["linear_equations", "fractions", "solving"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_equations",
        "subtopic": "variables_both_sides", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Solve: 5x - 3 = 2x + 9",
            "options": ["A. x = 2", "B. x = 3", "C. x = 4", "D. x = 6"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "解方程：5x - 3 = 2x + 9",
            "options": ["A. x = 2", "B. x = 3", "C. x = 4", "D. x = 6"],
            "answer": "C",
        },
        "tags": ["linear_equations", "variables_both_sides"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "inequalities",
        "subtopic": "graphing", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Which inequality represents 'x is at least 7'?",
            "options": ["A. x > 7", "B. x < 7", "C. x ≥ 7", "D. x ≤ 7"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个不等式表示'x 至少为 7'？",
            "options": ["A. x > 7", "B. x < 7", "C. x ≥ 7", "D. x ≤ 7"],
            "answer": "C",
        },
        "tags": ["inequalities", "interpretation"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "exponents",
        "subtopic": "negative_exponents", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "What is 5⁻²?",
            "options": ["A. -25", "B. -10", "C. 1/25", "D. 1/10"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "5⁻² 等于多少？",
            "options": ["A. -25", "B. -10", "C. 1/25", "D. 1/10"],
            "answer": "C",
        },
        "tags": ["exponents", "negative_exponents"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "exponents",
        "subtopic": "scientific_notation", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Write 0.00045 in scientific notation.",
            "options": ["A. 4.5 × 10⁻⁴", "B. 45 × 10⁻⁵", "C. 4.5 × 10⁻³", "D. 4.5 × 10⁴"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "将 0.00045 用科学计数法表示。",
            "options": ["A. 4.5 × 10⁻⁴", "B. 45 × 10⁻⁵", "C. 4.5 × 10⁻³", "D. 4.5 × 10⁴"],
            "answer": "A",
        },
        "tags": ["exponents", "scientific_notation"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "linear_functions",
        "subtopic": "table_to_equation", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A table shows: x = 1 → y = 5, x = 2 → y = 8, x = 3 → y = 11. What is the equation?",
            "options": ["A. y = 3x + 2", "B. y = 2x + 3", "C. y = 5x", "D. y = x + 4"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "表格显示：x = 1 → y = 5，x = 2 → y = 8，x = 3 → y = 11。方程是什么？",
            "options": ["A. y = 3x + 2", "B. y = 2x + 3", "C. y = 5x", "D. y = x + 4"],
            "answer": "A",
        },
        "tags": ["linear_functions", "patterns", "equations"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "polynomials",
        "subtopic": "multiplication", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Expand: (x + 3)(x - 5)",
            "options": ["A. x² - 2x - 15", "B. x² + 2x - 15", "C. x² - 8x - 15", "D. x² - 2x + 15"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "展开：(x + 3)(x - 5)",
            "options": ["A. x² - 2x - 15", "B. x² + 2x - 15", "C. x² - 8x - 15", "D. x² - 2x + 15"],
            "answer": "A",
        },
        "tags": ["polynomials", "multiplication", "FOIL"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "radicals",
        "subtopic": "simplifying", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Simplify: √50",
            "options": ["A. 5√2", "B. 2√5", "C. 25", "D. 10√5"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "化简：√50",
            "options": ["A. 5√2", "B. 2√5", "C. 25", "D. 10√5"],
            "answer": "A",
        },
        "tags": ["radicals", "simplifying"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "systems",
        "subtopic": "elimination", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "Solve: 2x + y = 10, x - y = 2. What is x?",
            "options": ["A. 3", "B. 4", "C. 5", "D. 6"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "解方程组：2x + y = 10, x - y = 2，x 等于多少？",
            "options": ["A. 3", "B. 4", "C. 5", "D. 6"],
            "answer": "B",
        },
        "tags": ["systems", "elimination"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "ratios",
        "subtopic": "proportional_reasoning", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "If 3 notebooks cost $7.50, how much do 5 notebooks cost?",
            "options": ["A. $10.00", "B. $12.50", "C. $11.25", "D. $15.00"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "如果 3 本笔记本 $7.50，5 本笔记本多少钱？",
            "options": ["A. $10.00", "B. $12.50", "C. $11.25", "D. $15.00"],
            "answer": "B",
        },
        "tags": ["ratios", "proportional_reasoning", "unit_rate"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "word_problems",
        "subtopic": "percent_change", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A shirt originally costs $40. It is on sale for 25% off. What is the sale price?",
            "options": ["A. $10", "B. $25", "C. $30", "D. $35"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一件衬衫原价 $40，打七五折。售价是多少？",
            "options": ["A. $10", "B. $25", "C. $30", "D. $35"],
            "answer": "C",
        },
        "tags": ["word_problems", "percent", "discount"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "data_analysis",
        "subtopic": "probability", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "A bag has 3 red, 5 blue, and 2 green marbles. What is the probability of drawing a blue marble?",
            "options": ["A. 1/2", "B. 3/10", "C. 1/5", "D. 2/5"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "袋子里有 3 个红球、5 个蓝球和 2 个绿球。抽到蓝球的概率是多少？",
            "options": ["A. 1/2", "B. 3/10", "C. 1/5", "D. 2/5"],
            "answer": "A",
        },
        "tags": ["data_analysis", "probability"],
    },
    {
        "subject": "math", "grade_level": "G6", "topic": "coordinate_geometry",
        "subtopic": "midpoint", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "What is the midpoint of the segment connecting (2, 8) and (6, 4)?",
            "options": ["A. (4, 6)", "B. (3, 5)", "C. (8, 12)", "D. (4, 12)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "连接 (2, 8) 和 (6, 4) 的线段的中点坐标是什么？",
            "options": ["A. (4, 6)", "B. (3, 5)", "C. (8, 12)", "D. (4, 12)"],
            "answer": "A",
        },
        "tags": ["coordinate_geometry", "midpoint"],
    },
]

# ---------------------------------------------------------------------------
# G7 — Geometry
# ---------------------------------------------------------------------------

G7_QUESTIONS = [
    {
        "subject": "math", "grade_level": "G7", "topic": "angles",
        "subtopic": "complementary_supplementary", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Two angles are supplementary. One angle measures 65°. What is the measure of the other angle?",
            "options": ["A. 25°", "B. 115°", "C. 125°", "D. 295°"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两个角互补，其中一个角为 65°，另一个角是多少度？",
            "options": ["A. 25°", "B. 115°", "C. 125°", "D. 295°"],
            "answer": "B",
        },
        "tags": ["angles", "supplementary"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "triangles",
        "subtopic": "angle_sum", "difficulty": 0.35, "question_type": "fill_in",
        "content_en": {
            "stem": "A triangle has angles of 45° and 70°. What is the measure of the third angle?",
            "answer": "65",
        },
        "content_zh": {
            "stem": "三角形的两个角分别为 45° 和 70°，第三个角是多少度？",
            "answer": "65",
        },
        "tags": ["triangles", "angle_sum"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "triangles",
        "subtopic": "pythagorean_theorem", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "A right triangle has legs of length 3 and 4. What is the length of the hypotenuse?",
            "options": ["A. 5", "B. 6", "C. 7", "D. 25"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "直角三角形两条直角边长为 3 和 4，斜边长是多少？",
            "options": ["A. 5", "B. 6", "C. 7", "D. 25"],
            "answer": "A",
        },
        "tags": ["triangles", "pythagorean_theorem"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "triangles",
        "subtopic": "congruence", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Which of the following is NOT a valid triangle congruence criterion?",
            "options": ["A. SSS", "B. SAS", "C. ASA", "D. SSA"],
            "answer": "D",
        },
        "content_zh": {
            "stem": "以下哪个不是有效的三角形全等判定条件？",
            "options": ["A. SSS (边边边)", "B. SAS (边角边)", "C. ASA (角边角)", "D. SSA (边边角)"],
            "answer": "D",
        },
        "tags": ["triangles", "congruence"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "parallel_lines",
        "subtopic": "transversals", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Two parallel lines are cut by a transversal. If one of the alternate interior angles is 55°, what is the other alternate interior angle?",
            "options": ["A. 35°", "B. 55°", "C. 125°", "D. 145°"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两条平行线被一条截线所截。如果一个内错角为 55°，另一个内错角是多少？",
            "options": ["A. 35°", "B. 55°", "C. 125°", "D. 145°"],
            "answer": "B",
        },
        "tags": ["parallel_lines", "transversals", "alternate_interior"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "circles",
        "subtopic": "circumference", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "A circle has a radius of 7 cm. What is its circumference? (Use π ≈ 3.14)",
            "options": ["A. 21.98 cm", "B. 43.96 cm", "C. 153.86 cm", "D. 14 cm"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个圆的半径为 7 厘米，周长是多少？(π ≈ 3.14)",
            "options": ["A. 21.98 cm", "B. 43.96 cm", "C. 153.86 cm", "D. 14 cm"],
            "answer": "B",
        },
        "tags": ["circles", "circumference"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "area",
        "subtopic": "composite_shapes", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A rectangular garden is 12 m by 8 m. A circular fountain with radius 2 m is in the center. What is the area of the garden excluding the fountain? (Use π ≈ 3.14)",
            "options": ["A. 83.44 m²", "B. 96 m²", "C. 108.56 m²", "D. 70.88 m²"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "一个长方形花园长 12 米、宽 8 米，中间有一个半径 2 米的圆形喷泉。花园除去喷泉的面积是多少？(π ≈ 3.14)",
            "options": ["A. 83.44 m²", "B. 96 m²", "C. 108.56 m²", "D. 70.88 m²"],
            "answer": "A",
        },
        "tags": ["area", "composite_shapes", "circles"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "similarity",
        "subtopic": "proportions", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Two similar triangles have a scale factor of 3:5. If the shorter side of the smaller triangle is 9 cm, what is the corresponding side of the larger triangle?",
            "options": ["A. 12 cm", "B. 15 cm", "C. 18 cm", "D. 27 cm"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两个相似三角形的比例因子为 3:5。小三角形的短边为 9 厘米，大三角形对应边是多少？",
            "options": ["A. 12 cm", "B. 15 cm", "C. 18 cm", "D. 27 cm"],
            "answer": "B",
        },
        "tags": ["similarity", "proportions", "scale_factor"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "volume",
        "subtopic": "prisms_cylinders", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A cylinder has radius 3 cm and height 10 cm. What is its volume? (Use π ≈ 3.14)",
            "options": ["A. 94.2 cm³", "B. 188.4 cm³", "C. 282.6 cm³", "D. 28.26 cm³"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一个圆柱体半径 3 厘米、高 10 厘米，体积是多少？(π ≈ 3.14)",
            "options": ["A. 94.2 cm³", "B. 188.4 cm³", "C. 282.6 cm³", "D. 28.26 cm³"],
            "answer": "C",
        },
        "tags": ["volume", "cylinders"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "coordinate_geometry",
        "subtopic": "distance", "difficulty": 0.65, "question_type": "fill_in",
        "content_en": {
            "stem": "What is the distance between points (1, 2) and (4, 6)?",
            "answer": "5",
        },
        "content_zh": {
            "stem": "点 (1, 2) 和点 (4, 6) 之间的距离是多少？",
            "answer": "5",
        },
        "tags": ["coordinate_geometry", "distance_formula", "pythagorean_theorem"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "transformations",
        "subtopic": "reflections", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Point A(3, -2) is reflected over the x-axis. What are the coordinates of the reflected point?",
            "options": ["A. (-3, -2)", "B. (3, 2)", "C. (-3, 2)", "D. (3, -2)"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "点 A(3, -2) 关于 x 轴对称，对称点的坐标是多少？",
            "options": ["A. (-3, -2)", "B. (3, 2)", "C. (-3, 2)", "D. (3, -2)"],
            "answer": "B",
        },
        "tags": ["transformations", "reflections", "coordinate_geometry"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "proofs",
        "subtopic": "reasoning", "difficulty": 0.75, "question_type": "mcq",
        "content_en": {
            "stem": "In a proof, you know that angle A ≅ angle B and angle B ≅ angle C. Which property allows you to conclude angle A ≅ angle C?",
            "options": ["A. Reflexive Property", "B. Symmetric Property", "C. Transitive Property", "D. Addition Property"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "在证明中，已知∠A ≅ ∠B 且 ∠B ≅ ∠C，根据什么性质可以得出 ∠A ≅ ∠C？",
            "options": ["A. 自反性", "B. 对称性", "C. 传递性", "D. 加法性质"],
            "answer": "C",
        },
        "tags": ["proofs", "reasoning", "properties_of_congruence"],
    },
    # --- G7 新增题 (13 道，扩充至 25 道) ---
    {
        "subject": "math", "grade_level": "G7", "topic": "angles",
        "subtopic": "vertical_angles", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Two lines intersect. One angle measures 130°. What is the measure of the vertical angle?",
            "options": ["A. 50°", "B. 130°", "C. 180°", "D. 260°"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两条直线相交，一个角为 130°，对顶角是多少度？",
            "options": ["A. 50°", "B. 130°", "C. 180°", "D. 260°"],
            "answer": "B",
        },
        "tags": ["angles", "vertical_angles"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "triangles",
        "subtopic": "exterior_angle", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "In a triangle, two interior angles measure 50° and 60°. What is the exterior angle adjacent to the third interior angle?",
            "options": ["A. 70°", "B. 110°", "C. 120°", "D. 130°"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "三角形的两个内角分别为 50° 和 60°，第三个内角的邻补角（外角）是多少度？",
            "options": ["A. 70°", "B. 110°", "C. 120°", "D. 130°"],
            "answer": "B",
        },
        "tags": ["triangles", "exterior_angle_theorem"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "triangles",
        "subtopic": "pythagorean_theorem", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A right triangle has a hypotenuse of 13 and one leg of 5. What is the other leg?",
            "options": ["A. 8", "B. 10", "C. 12", "D. 14"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "直角三角形斜边为 13，一条直角边为 5，另一条直角边是多少？",
            "options": ["A. 8", "B. 10", "C. 12", "D. 14"],
            "answer": "C",
        },
        "tags": ["triangles", "pythagorean_theorem"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "circles",
        "subtopic": "area", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "A circle has a diameter of 10 cm. What is its area? (Use π ≈ 3.14)",
            "options": ["A. 31.4 cm²", "B. 78.5 cm²", "C. 314 cm²", "D. 15.7 cm²"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个圆的直径为 10 厘米，面积是多少？(π ≈ 3.14)",
            "options": ["A. 31.4 cm²", "B. 78.5 cm²", "C. 314 cm²", "D. 15.7 cm²"],
            "answer": "B",
        },
        "tags": ["circles", "area"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "area",
        "subtopic": "trapezoid", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "A trapezoid has bases of 8 cm and 12 cm, and a height of 5 cm. What is its area?",
            "options": ["A. 40 cm²", "B. 50 cm²", "C. 60 cm²", "D. 100 cm²"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "梯形的上底 8 厘米、下底 12 厘米、高 5 厘米，面积是多少？",
            "options": ["A. 40 cm²", "B. 50 cm²", "C. 60 cm²", "D. 100 cm²"],
            "answer": "B",
        },
        "tags": ["area", "trapezoid"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "volume",
        "subtopic": "cone", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A cone has radius 4 cm and height 9 cm. What is its volume? (Use π ≈ 3.14)",
            "options": ["A. 150.72 cm³", "B. 452.16 cm³", "C. 113.04 cm³", "D. 75.36 cm³"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "圆锥底面半径 4 厘米、高 9 厘米，体积是多少？(π ≈ 3.14)",
            "options": ["A. 150.72 cm³", "B. 452.16 cm³", "C. 113.04 cm³", "D. 75.36 cm³"],
            "answer": "A",
        },
        "tags": ["volume", "cone"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "surface_area",
        "subtopic": "rectangular_prism", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "A rectangular prism has dimensions 3 × 4 × 5. What is its surface area?",
            "options": ["A. 60", "B. 94", "C. 120", "D. 47"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "长方体的长宽高为 3 × 4 × 5，表面积是多少？",
            "options": ["A. 60", "B. 94", "C. 120", "D. 47"],
            "answer": "B",
        },
        "tags": ["surface_area", "rectangular_prism"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "parallel_lines",
        "subtopic": "corresponding_angles", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Two parallel lines are cut by a transversal. A pair of corresponding angles are formed. If one is 72°, the other is:",
            "options": ["A. 18°", "B. 72°", "C. 108°", "D. 288°"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两条平行线被截线所截，一对同位角中一个为 72°，另一个是：",
            "options": ["A. 18°", "B. 72°", "C. 108°", "D. 288°"],
            "answer": "B",
        },
        "tags": ["parallel_lines", "corresponding_angles"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "similarity",
        "subtopic": "area_ratio", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "Two similar figures have a linear scale factor of 2:3. What is the ratio of their areas?",
            "options": ["A. 2:3", "B. 4:9", "C. 8:27", "D. 4:6"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两个相似图形的线性比例因子为 2:3，它们面积的比是多少？",
            "options": ["A. 2:3", "B. 4:9", "C. 8:27", "D. 4:6"],
            "answer": "B",
        },
        "tags": ["similarity", "area_ratio"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "coordinate_geometry",
        "subtopic": "midpoint", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "What is the midpoint of the segment with endpoints (0, 4) and (6, 10)?",
            "options": ["A. (3, 7)", "B. (6, 14)", "C. (3, 14)", "D. (6, 7)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "端点为 (0, 4) 和 (6, 10) 的线段的中点是什么？",
            "options": ["A. (3, 7)", "B. (6, 14)", "C. (3, 14)", "D. (6, 7)"],
            "answer": "A",
        },
        "tags": ["coordinate_geometry", "midpoint"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "transformations",
        "subtopic": "rotations", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Point P(2, 3) is rotated 90° counterclockwise about the origin. What are the new coordinates?",
            "options": ["A. (-3, 2)", "B. (3, -2)", "C. (-2, -3)", "D. (-2, 3)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "点 P(2, 3) 绕原点逆时针旋转 90°，新坐标是什么？",
            "options": ["A. (-3, 2)", "B. (3, -2)", "C. (-2, -3)", "D. (-2, 3)"],
            "answer": "A",
        },
        "tags": ["transformations", "rotations"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "data_analysis",
        "subtopic": "box_plot", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In a box plot, the interquartile range (IQR) represents the range of the middle ___% of the data.",
            "options": ["A. 25%", "B. 50%", "C. 75%", "D. 100%"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在箱线图中，四分位距（IQR）表示中间 ___% 数据的范围。",
            "options": ["A. 25%", "B. 50%", "C. 75%", "D. 100%"],
            "answer": "B",
        },
        "tags": ["data_analysis", "box_plot", "IQR"],
    },
    {
        "subject": "math", "grade_level": "G7", "topic": "word_problems",
        "subtopic": "geometry_application", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "A ladder 10 feet long leans against a wall. The base is 6 feet from the wall. How high up the wall does the ladder reach?",
            "options": ["A. 4 ft", "B. 6 ft", "C. 8 ft", "D. 10 ft"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一架 10 英尺长的梯子靠在墙上，底部离墙 6 英尺。梯子能到达多高？",
            "options": ["A. 4 ft", "B. 6 ft", "C. 8 ft", "D. 10 ft"],
            "answer": "C",
        },
        "tags": ["word_problems", "pythagorean_theorem", "application"],
    },
]

# ---------------------------------------------------------------------------
# G8 — Algebra II / Pre-Calculus
# ---------------------------------------------------------------------------

G8_QUESTIONS = [
    {
        "subject": "math", "grade_level": "G8", "topic": "quadratics",
        "subtopic": "factoring", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Factor: x² - 5x + 6",
            "options": ["A. (x-1)(x-6)", "B. (x-2)(x-3)", "C. (x+2)(x+3)", "D. (x-2)(x+3)"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "因式分解：x² - 5x + 6",
            "options": ["A. (x-1)(x-6)", "B. (x-2)(x-3)", "C. (x+2)(x+3)", "D. (x-2)(x+3)"],
            "answer": "B",
        },
        "tags": ["quadratics", "factoring"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "quadratics",
        "subtopic": "quadratic_formula", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Use the quadratic formula to solve x² + 2x - 8 = 0. What are the solutions?",
            "options": ["A. x = 2, x = -4", "B. x = -2, x = 4", "C. x = 1, x = -8", "D. x = 4, x = -2"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "用求根公式解方程 x² + 2x - 8 = 0，解是什么？",
            "options": ["A. x = 2, x = -4", "B. x = -2, x = 4", "C. x = 1, x = -8", "D. x = 4, x = -2"],
            "answer": "A",
        },
        "tags": ["quadratics", "quadratic_formula"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "functions",
        "subtopic": "domain_range", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "What is the domain of f(x) = √(x - 3)?",
            "options": ["A. x ≥ 0", "B. x ≥ 3", "C. x > 3", "D. All real numbers"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "函数 f(x) = √(x - 3) 的定义域是什么？",
            "options": ["A. x ≥ 0", "B. x ≥ 3", "C. x > 3", "D. 所有实数"],
            "answer": "B",
        },
        "tags": ["functions", "domain", "square_root"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "exponential",
        "subtopic": "growth_decay", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A population of bacteria doubles every 3 hours. Starting with 100 bacteria, how many will there be after 9 hours?",
            "options": ["A. 300", "B. 400", "C. 600", "D. 800"],
            "answer": "D",
        },
        "content_zh": {
            "stem": "一种细菌每 3 小时翻倍。初始 100 个细菌，9 小时后有多少个？",
            "options": ["A. 300", "B. 400", "C. 600", "D. 800"],
            "answer": "D",
        },
        "tags": ["exponential", "growth", "word_problem"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "logarithms",
        "subtopic": "basics", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "What is log₂(32)?",
            "options": ["A. 3", "B. 4", "C. 5", "D. 6"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "log₂(32) 等于多少？",
            "options": ["A. 3", "B. 4", "C. 5", "D. 6"],
            "answer": "C",
        },
        "tags": ["logarithms", "basics"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "polynomials",
        "subtopic": "long_division", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "When (x³ + 2x² - 5x + 2) is divided by (x - 1), what is the remainder?",
            "options": ["A. 0", "B. 1", "C. -2", "D. 2"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "(x³ + 2x² - 5x + 2) 除以 (x - 1) 的余数是多少？",
            "options": ["A. 0", "B. 1", "C. -2", "D. 2"],
            "answer": "A",
        },
        "tags": ["polynomials", "division", "remainder_theorem"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "trigonometry",
        "subtopic": "right_triangles", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "In a right triangle, the side opposite to a 30° angle is 5 cm. What is the hypotenuse?",
            "options": ["A. 5√3 cm", "B. 10 cm", "C. 5√2 cm", "D. 15 cm"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在直角三角形中，30° 角的对边长 5 厘米，斜边长是多少？",
            "options": ["A. 5√3 cm", "B. 10 cm", "C. 5√2 cm", "D. 15 cm"],
            "answer": "B",
        },
        "tags": ["trigonometry", "right_triangles", "special_angles"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "sequences",
        "subtopic": "arithmetic", "difficulty": 0.5, "question_type": "fill_in",
        "content_en": {
            "stem": "In the arithmetic sequence 3, 7, 11, 15, ..., what is the 10th term?",
            "answer": "39",
        },
        "content_zh": {
            "stem": "等差数列 3, 7, 11, 15, ... 的第 10 项是多少？",
            "answer": "39",
        },
        "tags": ["sequences", "arithmetic", "nth_term"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "complex_numbers",
        "subtopic": "basics", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Simplify: (3 + 2i) + (1 - 5i)",
            "options": ["A. 4 + 3i", "B. 4 - 3i", "C. 2 + 7i", "D. 2 - 3i"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "化简：(3 + 2i) + (1 - 5i)",
            "options": ["A. 4 + 3i", "B. 4 - 3i", "C. 2 + 7i", "D. 2 - 3i"],
            "answer": "B",
        },
        "tags": ["complex_numbers", "addition"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "rational_expressions",
        "subtopic": "simplifying", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Simplify: (x² - 4) / (x + 2)",
            "options": ["A. x + 2", "B. x - 2", "C. x² - 2", "D. (x-4)/(x+2)"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "化简：(x² - 4) / (x + 2)",
            "options": ["A. x + 2", "B. x - 2", "C. x² - 2", "D. (x-4)/(x+2)"],
            "answer": "B",
        },
        "tags": ["rational_expressions", "simplifying", "factoring"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "conic_sections",
        "subtopic": "parabola", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "What is the vertex of the parabola y = (x - 3)² + 5?",
            "options": ["A. (3, 5)", "B. (-3, 5)", "C. (3, -5)", "D. (-3, -5)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "抛物线 y = (x - 3)² + 5 的顶点坐标是什么？",
            "options": ["A. (3, 5)", "B. (-3, 5)", "C. (3, -5)", "D. (-3, -5)"],
            "answer": "A",
        },
        "tags": ["conic_sections", "parabola", "vertex_form"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "functions",
        "subtopic": "composition", "difficulty": 0.75, "question_type": "mcq",
        "content_en": {
            "stem": "If f(x) = 2x + 1 and g(x) = x², what is f(g(3))?",
            "options": ["A. 19", "B. 49", "C. 13", "D. 7"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "如果 f(x) = 2x + 1，g(x) = x²，那么 f(g(3)) 等于多少？",
            "options": ["A. 19", "B. 49", "C. 13", "D. 7"],
            "answer": "A",
        },
        "tags": ["functions", "composition"],
    },
    # --- G8 新增题 (13 道，扩充至 25 道) ---
    {
        "subject": "math", "grade_level": "G8", "topic": "quadratics",
        "subtopic": "completing_square", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Complete the square: x² + 6x + __ = (x + __)²",
            "options": ["A. 9, 3", "B. 36, 6", "C. 12, 6", "D. 3, 9"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "配方：x² + 6x + __ = (x + __)²",
            "options": ["A. 9, 3", "B. 36, 6", "C. 12, 6", "D. 3, 9"],
            "answer": "A",
        },
        "tags": ["quadratics", "completing_the_square"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "quadratics",
        "subtopic": "discriminant", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "For the equation 2x² + 3x + 5 = 0, the discriminant is:",
            "options": ["A. -31", "B. 49", "C. 31", "D. -49"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "方程 2x² + 3x + 5 = 0 的判别式是：",
            "options": ["A. -31", "B. 49", "C. 31", "D. -49"],
            "answer": "A",
        },
        "tags": ["quadratics", "discriminant"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "functions",
        "subtopic": "inverse", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "If f(x) = 3x - 6, what is f⁻¹(x)?",
            "options": ["A. (x + 6)/3", "B. (x - 6)/3", "C. 3x + 6", "D. x/3 + 6"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "如果 f(x) = 3x - 6，那么 f⁻¹(x) 是什么？",
            "options": ["A. (x + 6)/3", "B. (x - 6)/3", "C. 3x + 6", "D. x/3 + 6"],
            "answer": "A",
        },
        "tags": ["functions", "inverse"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "exponential",
        "subtopic": "equations", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Solve: 3ˣ = 81",
            "options": ["A. x = 3", "B. x = 4", "C. x = 27", "D. x = 9"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "解方程：3ˣ = 81",
            "options": ["A. x = 3", "B. x = 4", "C. x = 27", "D. x = 9"],
            "answer": "B",
        },
        "tags": ["exponential", "equations"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "logarithms",
        "subtopic": "properties", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Simplify: log₃(9) + log₃(3)",
            "options": ["A. 2", "B. 3", "C. 5", "D. 6"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "化简：log₃(9) + log₃(3)",
            "options": ["A. 2", "B. 3", "C. 5", "D. 6"],
            "answer": "B",
        },
        "tags": ["logarithms", "properties", "product_rule"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "trigonometry",
        "subtopic": "sohcahtoa", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In a right triangle, sin(θ) = opposite/hypotenuse. If the opposite side is 3 and the hypotenuse is 5, what is cos(θ)?",
            "options": ["A. 3/5", "B. 4/5", "C. 3/4", "D. 5/3"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在直角三角形中，sin(θ) = 对边/斜边。若对边为 3、斜边为 5，cos(θ) 等于多少？",
            "options": ["A. 3/5", "B. 4/5", "C. 3/4", "D. 5/3"],
            "answer": "B",
        },
        "tags": ["trigonometry", "sohcahtoa", "cos"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "sequences",
        "subtopic": "geometric", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "In the geometric sequence 2, 6, 18, 54, ..., what is the common ratio?",
            "options": ["A. 2", "B. 3", "C. 4", "D. 6"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "等比数列 2, 6, 18, 54, ... 的公比是多少？",
            "options": ["A. 2", "B. 3", "C. 4", "D. 6"],
            "answer": "B",
        },
        "tags": ["sequences", "geometric", "common_ratio"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "polynomials",
        "subtopic": "synthetic_division", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "If (x - 2) is a factor of x³ - 6x² + 11x - 6, what are the other factors?",
            "options": ["A. (x-1)(x-3)", "B. (x+1)(x+3)", "C. (x-2)(x-3)", "D. (x-1)(x+3)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "如果 (x - 2) 是 x³ - 6x² + 11x - 6 的因式，其他因式是什么？",
            "options": ["A. (x-1)(x-3)", "B. (x+1)(x+3)", "C. (x-2)(x-3)", "D. (x-1)(x+3)"],
            "answer": "A",
        },
        "tags": ["polynomials", "synthetic_division", "factoring"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "complex_numbers",
        "subtopic": "multiplication", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "Multiply: (2 + 3i)(1 - i)",
            "options": ["A. 5 + i", "B. -1 + 5i", "C. 5 - i", "D. -1 - i"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "计算：(2 + 3i)(1 - i)",
            "options": ["A. 5 + i", "B. -1 + 5i", "C. 5 - i", "D. -1 - i"],
            "answer": "A",
        },
        "tags": ["complex_numbers", "multiplication"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "rational_expressions",
        "subtopic": "addition", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Add: 1/(x+1) + 1/(x-1)",
            "options": ["A. 2x/(x²-1)", "B. 2/(x²-1)", "C. 2/(2x)", "D. 1/(x²-1)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "计算：1/(x+1) + 1/(x-1)",
            "options": ["A. 2x/(x²-1)", "B. 2/(x²-1)", "C. 2/(2x)", "D. 1/(x²-1)"],
            "answer": "A",
        },
        "tags": ["rational_expressions", "addition", "common_denominator"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "conic_sections",
        "subtopic": "circle_equation", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "What is the center and radius of the circle (x-2)² + (y+3)² = 16?",
            "options": ["A. Center (2,-3), r=4", "B. Center (-2,3), r=4", "C. Center (2,-3), r=16", "D. Center (2,3), r=4"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "圆 (x-2)² + (y+3)² = 16 的圆心和半径是什么？",
            "options": ["A. 圆心 (2,-3), r=4", "B. 圆心 (-2,3), r=4", "C. 圆心 (2,-3), r=16", "D. 圆心 (2,3), r=4"],
            "answer": "A",
        },
        "tags": ["conic_sections", "circle", "standard_form"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "systems",
        "subtopic": "three_variables", "difficulty": 0.8, "question_type": "mcq",
        "content_en": {
            "stem": "In a system of equations: x + y + z = 6, x - y = 2, y + z = 3. What is x?",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "方程组：x + y + z = 6, x - y = 2, y + z = 3，x 等于多少？",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "answer": "C",
        },
        "tags": ["systems", "three_variables"],
    },
    {
        "subject": "math", "grade_level": "G8", "topic": "word_problems",
        "subtopic": "exponential_application", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "An investment of $1000 grows at 5% annual compound interest. What is the value after 2 years?",
            "options": ["A. $1100.00", "B. $1102.50", "C. $1050.00", "D. $1105.00"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "$1000 的投资以年利率 5% 复利增长，2 年后价值多少？",
            "options": ["A. $1100.00", "B. $1102.50", "C. $1050.00", "D. $1105.00"],
            "answer": "B",
        },
        "tags": ["word_problems", "compound_interest", "exponential"],
    },
]

# ---------------------------------------------------------------------------
# All questions combined
# ---------------------------------------------------------------------------

ALL_MATH_QUESTIONS = G5_QUESTIONS + G6_QUESTIONS + G7_QUESTIONS + G8_QUESTIONS


async def seed() -> int:
    """Insert all seed questions into the database. Returns count inserted."""
    await db.init_schema()
    count = await db.bulk_insert_questions(ALL_MATH_QUESTIONS)
    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} math questions (G5-G8)")
        await db.close_pool()

    asyncio.run(main())
