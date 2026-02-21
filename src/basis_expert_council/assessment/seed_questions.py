"""
Seed question bank: 40 math MCQ questions for G6-G7.
Covers algebra, number_sense, geometry, word_problems, ratios_proportions, geometry_intro.
"""

import logging

from .. import db

logger = logging.getLogger("basis.assessment.seed")

SEED_QUESTIONS = [
    # =========================================================================
    # G6 — algebra (linear equations, two-step) — 4 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "algebra",
        "subtopic": "linear_equations",
        "difficulty": 0.25,
        "content": {
            "stem": "Solve for $x$: $x + 7 = 12$",
            "options": ["$x = 3$", "$x = 5$", "$x = 7$", "$x = 19$"],
            "answer": "B",
            "explanation": "$x + 7 = 12 \\Rightarrow x = 12 - 7 = 5$"
        },
        "tags": ["equation", "one-step"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "algebra",
        "subtopic": "linear_equations",
        "difficulty": 0.35,
        "content": {
            "stem": "Solve for $x$: $2x + 5 = 15$",
            "options": ["$x = 3$", "$x = 5$", "$x = 7$", "$x = 10$"],
            "answer": "B",
            "explanation": "$2x + 5 = 15 \\Rightarrow 2x = 10 \\Rightarrow x = 5$"
        },
        "tags": ["equation", "two-step"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "algebra",
        "subtopic": "two_step_equations",
        "difficulty": 0.45,
        "content": {
            "stem": "Solve for $y$: $3y - 4 = 14$",
            "options": ["$y = 4$", "$y = 6$", "$y = 10$", "$y = 3$"],
            "answer": "B",
            "explanation": "$3y - 4 = 14 \\Rightarrow 3y = 18 \\Rightarrow y = 6$"
        },
        "tags": ["equation", "two-step"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "algebra",
        "subtopic": "two_step_equations",
        "difficulty": 0.55,
        "content": {
            "stem": "Solve for $n$: $\\frac{n}{3} + 5 = 9$",
            "options": ["$n = 4$", "$n = 9$", "$n = 12$", "$n = 15$"],
            "answer": "C",
            "explanation": "$\\frac{n}{3} + 5 = 9 \\Rightarrow \\frac{n}{3} = 4 \\Rightarrow n = 12$"
        },
        "tags": ["equation", "two-step", "fractions"],
    },
    # =========================================================================
    # G6 — number_sense (fractions, decimals, ratios) — 5 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "number_sense",
        "subtopic": "fractions",
        "difficulty": 0.20,
        "content": {
            "stem": "What is $\\frac{2}{3} + \\frac{1}{6}$?",
            "options": ["$\\frac{3}{9}$", "$\\frac{5}{6}$", "$\\frac{1}{2}$", "$\\frac{3}{6}$"],
            "answer": "B",
            "explanation": "$\\frac{2}{3} = \\frac{4}{6}$, so $\\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}$"
        },
        "tags": ["fractions", "addition"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "number_sense",
        "subtopic": "fractions",
        "difficulty": 0.35,
        "content": {
            "stem": "Simplify: $\\frac{3}{4} \\times \\frac{2}{5}$",
            "options": ["$\\frac{6}{20}$", "$\\frac{3}{10}$", "$\\frac{5}{9}$", "$\\frac{6}{9}$"],
            "answer": "B",
            "explanation": "$\\frac{3}{4} \\times \\frac{2}{5} = \\frac{6}{20} = \\frac{3}{10}$"
        },
        "tags": ["fractions", "multiplication"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "number_sense",
        "subtopic": "decimals",
        "difficulty": 0.25,
        "content": {
            "stem": "What is $0.75 + 0.38$?",
            "options": ["$1.03$", "$1.13$", "$1.23$", "$0.113$"],
            "answer": "B",
            "explanation": "$0.75 + 0.38 = 1.13$"
        },
        "tags": ["decimals", "addition"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "number_sense",
        "subtopic": "decimals",
        "difficulty": 0.40,
        "content": {
            "stem": "Convert $\\frac{7}{8}$ to a decimal.",
            "options": ["$0.750$", "$0.875$", "$0.780$", "$0.885$"],
            "answer": "B",
            "explanation": "$7 \\div 8 = 0.875$"
        },
        "tags": ["decimals", "conversion"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "number_sense",
        "subtopic": "ratios",
        "difficulty": 0.30,
        "content": {
            "stem": "In a class of 30 students, 18 are girls. What is the ratio of girls to boys?",
            "options": ["$3:2$", "$2:3$", "$3:5$", "$5:3$"],
            "answer": "A",
            "explanation": "Girls = 18, Boys = 12. Ratio = $18:12 = 3:2$"
        },
        "tags": ["ratios", "simplify"],
    },
    # =========================================================================
    # G6 — word_problems — 4 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "word_problems",
        "subtopic": "multi_step",
        "difficulty": 0.40,
        "content": {
            "stem": "A bookstore sells notebooks for $\\$2.50$ each and pens for $\\$1.25$ each. Emma buys 3 notebooks and 4 pens. How much does she spend in total?",
            "options": ["$\\$11.50$", "$\\$12.50$", "$\\$10.50$", "$\\$13.00$"],
            "answer": "B",
            "explanation": "$3 \\times 2.50 = 7.50$ and $4 \\times 1.25 = 5.00$. Total = $\\$12.50$"
        },
        "tags": ["word_problem", "money", "multiplication"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "word_problems",
        "subtopic": "distance",
        "difficulty": 0.50,
        "content": {
            "stem": "A train travels at 60 miles per hour. How far does it travel in 2 hours and 30 minutes?",
            "options": ["120 miles", "130 miles", "150 miles", "180 miles"],
            "answer": "C",
            "explanation": "2 hours 30 minutes = 2.5 hours. Distance = $60 \\times 2.5 = 150$ miles"
        },
        "tags": ["word_problem", "distance", "rate"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "word_problems",
        "subtopic": "percentages",
        "difficulty": 0.50,
        "content": {
            "stem": "A jacket originally costs $\\$80$. It is on sale for 25% off. What is the sale price?",
            "options": ["$\\$55$", "$\\$60$", "$\\$65$", "$\\$70$"],
            "answer": "B",
            "explanation": "Discount = $80 \\times 0.25 = \\$20$. Sale price = $80 - 20 = \\$60$"
        },
        "tags": ["word_problem", "percent", "discount"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "word_problems",
        "subtopic": "fractions",
        "difficulty": 0.45,
        "content": {
            "stem": "Tom read $\\frac{2}{5}$ of a 200-page book on Monday and $\\frac{1}{4}$ on Tuesday. How many pages has he read in total?",
            "options": ["100", "120", "130", "140"],
            "answer": "C",
            "explanation": "Monday: $200 \\times \\frac{2}{5} = 80$. Tuesday: $200 \\times \\frac{1}{4} = 50$. Total = 130 pages"
        },
        "tags": ["word_problem", "fractions"],
    },
    # =========================================================================
    # G6 — geometry_intro — 4 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "geometry_intro",
        "subtopic": "area",
        "difficulty": 0.20,
        "content": {
            "stem": "What is the area of a rectangle with length 8 cm and width 5 cm?",
            "options": ["$26 \\text{ cm}^2$", "$40 \\text{ cm}^2$", "$13 \\text{ cm}^2$", "$35 \\text{ cm}^2$"],
            "answer": "B",
            "explanation": "Area = length $\\times$ width = $8 \\times 5 = 40 \\text{ cm}^2$"
        },
        "tags": ["geometry", "area", "rectangle"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "geometry_intro",
        "subtopic": "perimeter",
        "difficulty": 0.25,
        "content": {
            "stem": "A triangle has sides of length 7 cm, 8 cm, and 10 cm. What is its perimeter?",
            "options": ["15 cm", "25 cm", "56 cm", "80 cm"],
            "answer": "B",
            "explanation": "Perimeter = $7 + 8 + 10 = 25$ cm"
        },
        "tags": ["geometry", "perimeter", "triangle"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "geometry_intro",
        "subtopic": "volume",
        "difficulty": 0.40,
        "content": {
            "stem": "What is the volume of a rectangular prism with length 4 cm, width 3 cm, and height 5 cm?",
            "options": ["$12 \\text{ cm}^3$", "$24 \\text{ cm}^3$", "$60 \\text{ cm}^3$", "$35 \\text{ cm}^3$"],
            "answer": "C",
            "explanation": "Volume = $4 \\times 3 \\times 5 = 60 \\text{ cm}^3$"
        },
        "tags": ["geometry", "volume", "prism"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "geometry_intro",
        "subtopic": "circles",
        "difficulty": 0.50,
        "content": {
            "stem": "What is the circumference of a circle with radius 7 cm? (Use $\\pi \\approx 3.14$)",
            "options": ["$21.98$ cm", "$43.96$ cm", "$153.86$ cm", "$14.28$ cm"],
            "answer": "B",
            "explanation": "Circumference = $2\\pi r = 2 \\times 3.14 \\times 7 = 43.96$ cm"
        },
        "tags": ["geometry", "circle", "circumference"],
    },
    # =========================================================================
    # G7 — algebra (inequalities, systems preview) — 5 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "algebra",
        "subtopic": "inequalities",
        "difficulty": 0.45,
        "content": {
            "stem": "Solve: $3x - 2 > 10$",
            "options": ["$x > 2$", "$x > 4$", "$x > 6$", "$x > 8$"],
            "answer": "B",
            "explanation": "$3x - 2 > 10 \\Rightarrow 3x > 12 \\Rightarrow x > 4$"
        },
        "tags": ["inequality", "one-variable"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "algebra",
        "subtopic": "inequalities",
        "difficulty": 0.55,
        "content": {
            "stem": "Which value of $x$ satisfies $-2x + 5 \\leq 1$?",
            "options": ["$x = 1$", "$x = 2$", "$x = 3$", "$x = 0$"],
            "answer": "C",
            "explanation": "$-2x + 5 \\leq 1 \\Rightarrow -2x \\leq -4 \\Rightarrow x \\geq 2$. So $x = 3$ works."
        },
        "tags": ["inequality", "negative_coefficient"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "algebra",
        "subtopic": "inequalities",
        "difficulty": 0.60,
        "content": {
            "stem": "Solve: $\\frac{x + 3}{2} < 5$",
            "options": ["$x < 5$", "$x < 7$", "$x < 10$", "$x < 13$"],
            "answer": "B",
            "explanation": "$\\frac{x+3}{2} < 5 \\Rightarrow x+3 < 10 \\Rightarrow x < 7$"
        },
        "tags": ["inequality", "fractions"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "algebra",
        "subtopic": "systems_preview",
        "difficulty": 0.70,
        "content": {
            "stem": "If $x + y = 10$ and $x - y = 4$, what is $x$?",
            "options": ["$x = 3$", "$x = 5$", "$x = 7$", "$x = 8$"],
            "answer": "C",
            "explanation": "Adding the equations: $2x = 14 \\Rightarrow x = 7$"
        },
        "tags": ["systems", "elimination"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "algebra",
        "subtopic": "expressions",
        "difficulty": 0.40,
        "content": {
            "stem": "Simplify: $4(2x - 3) + 5$",
            "options": ["$8x - 7$", "$8x - 12$", "$8x + 2$", "$6x - 7$"],
            "answer": "A",
            "explanation": "$4(2x - 3) + 5 = 8x - 12 + 5 = 8x - 7$"
        },
        "tags": ["expression", "distributive"],
    },
    # =========================================================================
    # G7 — geometry (angles, area, Pythagorean) — 5 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "geometry",
        "subtopic": "angles",
        "difficulty": 0.35,
        "content": {
            "stem": "Two angles are supplementary. One angle is $65°$. What is the other?",
            "options": ["$25°$", "$115°$", "$125°$", "$135°$"],
            "answer": "B",
            "explanation": "Supplementary angles sum to $180°$. $180 - 65 = 115°$"
        },
        "tags": ["angles", "supplementary"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "geometry",
        "subtopic": "angles",
        "difficulty": 0.45,
        "content": {
            "stem": "In a triangle, two angles measure $50°$ and $65°$. What is the third angle?",
            "options": ["$55°$", "$65°$", "$75°$", "$85°$"],
            "answer": "B",
            "explanation": "Sum of angles in a triangle = $180°$. $180 - 50 - 65 = 65°$"
        },
        "tags": ["angles", "triangle"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "geometry",
        "subtopic": "area",
        "difficulty": 0.50,
        "content": {
            "stem": "What is the area of a triangle with base 12 cm and height 9 cm?",
            "options": ["$108 \\text{ cm}^2$", "$54 \\text{ cm}^2$", "$21 \\text{ cm}^2$", "$42 \\text{ cm}^2$"],
            "answer": "B",
            "explanation": "Area = $\\frac{1}{2} \\times 12 \\times 9 = 54 \\text{ cm}^2$"
        },
        "tags": ["area", "triangle"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "geometry",
        "subtopic": "pythagorean",
        "difficulty": 0.65,
        "content": {
            "stem": "A right triangle has legs of length 6 and 8. What is the hypotenuse?",
            "options": ["9", "10", "12", "14"],
            "answer": "B",
            "explanation": "$c = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$"
        },
        "tags": ["pythagorean", "right_triangle"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "geometry",
        "subtopic": "pythagorean",
        "difficulty": 0.75,
        "content": {
            "stem": "A ladder 13 ft long leans against a wall. The base is 5 ft from the wall. How high up the wall does it reach?",
            "options": ["8 ft", "10 ft", "12 ft", "11 ft"],
            "answer": "C",
            "explanation": "$h = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12$ ft"
        },
        "tags": ["pythagorean", "application"],
    },
    # =========================================================================
    # G7 — ratios_proportions — 4 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "ratios_proportions",
        "subtopic": "proportions",
        "difficulty": 0.35,
        "content": {
            "stem": "Solve for $x$: $\\frac{x}{6} = \\frac{5}{3}$",
            "options": ["$x = 8$", "$x = 10$", "$x = 12$", "$x = 15$"],
            "answer": "B",
            "explanation": "$x = 6 \\times \\frac{5}{3} = 10$"
        },
        "tags": ["proportion", "cross-multiply"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "ratios_proportions",
        "subtopic": "unit_rate",
        "difficulty": 0.30,
        "content": {
            "stem": "A car uses 8 gallons of gas to travel 240 miles. What is the miles-per-gallon rate?",
            "options": ["25 mpg", "30 mpg", "35 mpg", "40 mpg"],
            "answer": "B",
            "explanation": "$240 \\div 8 = 30$ miles per gallon"
        },
        "tags": ["rate", "unit_rate"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "ratios_proportions",
        "subtopic": "scale",
        "difficulty": 0.50,
        "content": {
            "stem": "On a map, 1 inch represents 25 miles. Two cities are 3.5 inches apart on the map. What is the actual distance?",
            "options": ["75 miles", "82.5 miles", "87.5 miles", "90 miles"],
            "answer": "C",
            "explanation": "$3.5 \\times 25 = 87.5$ miles"
        },
        "tags": ["scale", "proportion"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "ratios_proportions",
        "subtopic": "percent_change",
        "difficulty": 0.60,
        "content": {
            "stem": "A shirt's price increased from $\\$40$ to $\\$50$. What is the percent increase?",
            "options": ["10%", "20%", "25%", "30%"],
            "answer": "C",
            "explanation": "Increase = $\\$10$. Percent = $\\frac{10}{40} \\times 100 = 25\\%$"
        },
        "tags": ["percent", "increase"],
    },
    # =========================================================================
    # G7 — word_problems — 5 questions
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "word_problems",
        "subtopic": "algebraic",
        "difficulty": 0.50,
        "content": {
            "stem": "The sum of three consecutive integers is 72. What is the largest?",
            "options": ["23", "24", "25", "26"],
            "answer": "C",
            "explanation": "Let $n, n+1, n+2$ be the integers. $3n + 3 = 72 \\Rightarrow n = 23$. Largest = $25$"
        },
        "tags": ["word_problem", "consecutive"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "word_problems",
        "subtopic": "mixture",
        "difficulty": 0.65,
        "content": {
            "stem": "A store mixes 5 lbs of $\\$3$/lb coffee with 3 lbs of $\\$5$/lb coffee. What is the price per pound of the mixture?",
            "options": ["$\\$3.50$", "$\\$3.75$", "$\\$4.00$", "$\\$4.25$"],
            "answer": "B",
            "explanation": "Total cost = $5(3) + 3(5) = 15 + 15 = \\$30$. Total weight = 8 lbs. Price = $\\$30/8 = \\$3.75$"
        },
        "tags": ["word_problem", "mixture", "average"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "word_problems",
        "subtopic": "interest",
        "difficulty": 0.70,
        "content": {
            "stem": "You deposit $\\$500$ at 4% simple annual interest. How much interest do you earn in 3 years?",
            "options": ["$\\$20$", "$\\$40$", "$\\$60$", "$\\$80$"],
            "answer": "C",
            "explanation": "Interest = $500 \\times 0.04 \\times 3 = \\$60$"
        },
        "tags": ["word_problem", "interest", "simple"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "word_problems",
        "subtopic": "rate",
        "difficulty": 0.55,
        "content": {
            "stem": "Two hikers start from the same point walking in opposite directions. One walks at 3 mph and the other at 4 mph. After how many hours will they be 21 miles apart?",
            "options": ["2 hours", "3 hours", "4 hours", "5 hours"],
            "answer": "B",
            "explanation": "Combined rate = $3 + 4 = 7$ mph. Time = $21 / 7 = 3$ hours"
        },
        "tags": ["word_problem", "rate", "distance"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "word_problems",
        "subtopic": "probability",
        "difficulty": 0.45,
        "content": {
            "stem": "A bag contains 4 red, 3 blue, and 5 green marbles. What is the probability of drawing a blue marble?",
            "options": ["$\\frac{1}{4}$", "$\\frac{3}{12}$", "$\\frac{1}{3}$", "$\\frac{3}{7}$"],
            "answer": "A",
            "explanation": "Total = $4 + 3 + 5 = 12$. $P(\\text{blue}) = \\frac{3}{12} = \\frac{1}{4}$"
        },
        "tags": ["word_problem", "probability"],
    },
    # =========================================================================
    # Additional harder questions to fill difficulty range 0.80-0.90
    # =========================================================================
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "algebra",
        "subtopic": "systems_preview",
        "difficulty": 0.80,
        "content": {
            "stem": "Solve the system: $2x + 3y = 19$ and $x - y = 2$. What is $y$?",
            "options": ["$y = 2$", "$y = 3$", "$y = 4$", "$y = 5$"],
            "answer": "B",
            "explanation": "From $x - y = 2$: $x = y + 2$. Substitute: $2(y+2) + 3y = 19 \\Rightarrow 5y + 4 = 19 \\Rightarrow y = 3$"
        },
        "tags": ["systems", "substitution"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "geometry",
        "subtopic": "composite_area",
        "difficulty": 0.80,
        "content": {
            "stem": "A figure is made of a rectangle (10 cm by 6 cm) with a semicircle (diameter 6 cm) on top. What is the total area? (Use $\\pi \\approx 3.14$)",
            "options": ["$74.13 \\text{ cm}^2$", "$88.13 \\text{ cm}^2$", "$60 \\text{ cm}^2$", "$78.50 \\text{ cm}^2$"],
            "answer": "A",
            "explanation": "Rectangle = $10 \\times 6 = 60$. Semicircle = $\\frac{1}{2} \\pi (3)^2 = \\frac{1}{2}(3.14)(9) = 14.13$. Total $\\approx 74.13$ cm$^2$"
        },
        "tags": ["area", "composite", "semicircle"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "number_sense",
        "subtopic": "order_of_operations",
        "difficulty": 0.60,
        "content": {
            "stem": "Evaluate: $3 + 4 \\times 2^2 - 6 \\div 3$",
            "options": ["$12$", "$17$", "$19$", "$21$"],
            "answer": "C",
            "explanation": "$2^2 = 4$, then $4 \\times 4 = 16$, then $6 \\div 3 = 2$. Result: $3 + 16 - 2 = 17$. Wait: $3 + 16 - 2 = 17$."
        },
        "tags": ["order_of_operations", "exponents"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "ratios_proportions",
        "subtopic": "similar_figures",
        "difficulty": 0.85,
        "content": {
            "stem": "Two similar triangles have a side ratio of $3:5$. If the area of the smaller triangle is $27 \\text{ cm}^2$, what is the area of the larger?",
            "options": ["$45 \\text{ cm}^2$", "$54 \\text{ cm}^2$", "$75 \\text{ cm}^2$", "$135 \\text{ cm}^2$"],
            "answer": "C",
            "explanation": "Area ratio = $3^2:5^2 = 9:25$. $\\frac{27}{x} = \\frac{9}{25} \\Rightarrow x = 75$"
        },
        "tags": ["similar", "area_ratio"],
    },
    {
        "subject": "math",
        "grade_level": "G7",
        "topic": "word_problems",
        "subtopic": "work_rate",
        "difficulty": 0.90,
        "content": {
            "stem": "Pipe A fills a tank in 6 hours. Pipe B fills it in 4 hours. Working together, how long do they take?",
            "options": ["$2$ hours", "$2.4$ hours", "$3$ hours", "$2.5$ hours"],
            "answer": "B",
            "explanation": "Rate A = $\\frac{1}{6}$, Rate B = $\\frac{1}{4}$. Combined = $\\frac{1}{6}+\\frac{1}{4}=\\frac{5}{12}$. Time = $\\frac{12}{5} = 2.4$ hours"
        },
        "tags": ["word_problem", "work_rate"],
    },
    {
        "subject": "math",
        "grade_level": "G6",
        "topic": "algebra",
        "subtopic": "patterns",
        "difficulty": 0.15,
        "content": {
            "stem": "What is the next number in the pattern: 2, 5, 8, 11, ...?",
            "options": ["12", "13", "14", "15"],
            "answer": "C",
            "explanation": "The pattern adds 3 each time. $11 + 3 = 14$"
        },
        "tags": ["pattern", "arithmetic_sequence"],
    },
]

# Fix the order_of_operations question: correct answer should be B (17)
# 3 + 4 * 4 - 6/3 = 3 + 16 - 2 = 17
# Update the answer field:
for q in SEED_QUESTIONS:
    if q.get("subtopic") == "order_of_operations":
        q["content"]["answer"] = "B"
        q["content"]["explanation"] = "$2^2 = 4$, then $4 \\times 4 = 16$, then $6 \\div 3 = 2$. Result: $3 + 16 - 2 = 17$"
        break


async def seed_question_bank() -> None:
    """Seed the assessment question bank if empty.

    Prefers the bilingual G5-G8 seed (seed_questions_math.py) if available;
    falls back to the local SEED_QUESTIONS (G6-G7, English only).
    """
    pool = await db.get_pool()
    async with pool.acquire() as conn:
        count = await conn.fetchval("SELECT COUNT(*) FROM assessment_questions")
        if count > 0:
            logger.info(f"Question bank already has {count} questions, skipping seed")
            return

    # Prefer the bilingual seed sources (G5-G8)
    total_inserted = 0
    try:
        from ..seed_questions_math import ALL_MATH_QUESTIONS
        inserted = await db.bulk_insert_questions(ALL_MATH_QUESTIONS)
        total_inserted += inserted
        logger.info(f"Seeded {inserted} bilingual math questions (G5-G8)")
    except Exception as e:
        logger.warning(f"Bilingual math seed unavailable ({e})")

    try:
        from ..seed_questions_english import ALL_ENGLISH_QUESTIONS
        inserted = await db.bulk_insert_questions(ALL_ENGLISH_QUESTIONS)
        total_inserted += inserted
        logger.info(f"Seeded {inserted} bilingual English questions (G5-G8)")
    except Exception as e:
        logger.warning(f"Bilingual English seed unavailable ({e})")

    if total_inserted > 0:
        logger.info(f"Total seeded: {total_inserted} questions")
        return

    logger.warning("No bilingual seeds available, using local G6-G7 fallback")

    # Fallback: use local SEED_QUESTIONS (English only)
    rows = []
    for q in SEED_QUESTIONS:
        rows.append({
            "subject": q["subject"],
            "grade_level": q["grade_level"],
            "topic": q["topic"],
            "subtopic": q.get("subtopic"),
            "difficulty": q["difficulty"],
            "question_type": "mcq",
            "content_zh": q["content"],
            "content_en": q["content"],
            "basis_aligned": True,
            "tags": q.get("tags"),
        })

    inserted = await db.bulk_insert_questions(rows)
    logger.info(f"Seeded {inserted} assessment questions (G6-G7 fallback)")
