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
