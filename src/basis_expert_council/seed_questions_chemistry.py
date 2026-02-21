"""
BasisPilot — Chemistry Seed Questions (G5-G8)
Aligned to BASIS curriculum (accelerated science, AP Chemistry readiness by G8).

Topics per grade:
  G5: states_of_matter, mixtures_solutions, physical_chemical_changes, elements_compounds
  G6: atomic_structure, periodic_table, chemical_reactions, acids_bases
  G7: bonding, stoichiometry_intro, solutions_concentration, gas_laws
  G8: mole_concept, reaction_types, thermochemistry, equilibrium (AP readiness)

Run: python -m src.basis_expert_council.seed_questions_chemistry
"""

import asyncio
import json

from . import db

# ---------------------------------------------------------------------------
# G5 — Foundations of Chemistry
# ---------------------------------------------------------------------------

G5_QUESTIONS = [
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "states_of_matter",
        "subtopic": "solid_liquid_gas", "difficulty": 0.2, "question_type": "mcq",
        "content_en": {
            "stem": "Which state of matter has a definite shape and a definite volume?",
            "options": ["A. Gas", "B. Liquid", "C. Solid", "D. Plasma"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪种物质状态有固定的形状和固定的体积？",
            "options": ["A. 气态", "B. 液态", "C. 固态", "D. 等离子态"],
            "answer": "C",
        },
        "tags": ["matter", "states", "solid"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "states_of_matter",
        "subtopic": "phase_changes", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "When ice melts into water, the process is called:",
            "options": ["A. Evaporation", "B. Condensation", "C. Melting (fusion)", "D. Sublimation"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "冰变成水的过程叫做：",
            "options": ["A. 蒸发", "B. 凝结", "C. 熔化", "D. 升华"],
            "answer": "C",
        },
        "tags": ["matter", "phase_change", "melting"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "states_of_matter",
        "subtopic": "sublimation", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Dry ice (solid CO₂) turns directly into gas without becoming liquid. This process is called:",
            "options": ["A. Melting", "B. Evaporation", "C. Condensation", "D. Sublimation"],
            "answer": "D",
        },
        "content_zh": {
            "stem": "干冰（固态 CO₂）直接变成气体而不经过液态，这个过程叫做：",
            "options": ["A. 熔化", "B. 蒸发", "C. 凝结", "D. 升华"],
            "answer": "D",
        },
        "tags": ["matter", "sublimation", "CO2"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "mixtures_solutions",
        "subtopic": "mixture_vs_compound", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Salt water is an example of a:",
            "options": ["A. Element", "B. Compound", "C. Mixture", "D. Pure substance"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "盐水是什么的例子？",
            "options": ["A. 元素", "B. 化合物", "C. 混合物", "D. 纯净物"],
            "answer": "C",
        },
        "tags": ["mixtures", "solution", "classification"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "mixtures_solutions",
        "subtopic": "separation", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which method can separate sand from water?",
            "options": ["A. Evaporation", "B. Filtration", "C. Magnetism", "D. Condensation"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪种方法可以将沙子从水中分离？",
            "options": ["A. 蒸发", "B. 过滤", "C. 磁力", "D. 凝结"],
            "answer": "B",
        },
        "tags": ["mixtures", "separation", "filtration"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "physical_chemical_changes",
        "subtopic": "identifying_changes", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Which is an example of a chemical change?",
            "options": [
                "A. Cutting paper",
                "B. Melting ice",
                "C. Burning wood",
                "D. Dissolving sugar in water",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "以下哪个是化学变化的例子？",
            "options": ["A. 剪纸", "B. 冰融化", "C. 木头燃烧", "D. 糖溶于水"],
            "answer": "C",
        },
        "tags": ["changes", "chemical_change", "combustion"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "physical_chemical_changes",
        "subtopic": "signs_chemical", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which is NOT a sign that a chemical reaction has occurred?",
            "options": [
                "A. Color change",
                "B. Gas production (bubbles)",
                "C. Change in shape",
                "D. Temperature change",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "以下哪个不是化学反应发生的标志？",
            "options": ["A. 颜色变化", "B. 产生气体（冒泡）", "C. 形状变化", "D. 温度变化"],
            "answer": "C",
        },
        "tags": ["changes", "chemical_reaction", "signs"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "elements_compounds",
        "subtopic": "elements", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "An element is a substance made of only one type of:",
            "options": ["A. Molecule", "B. Compound", "C. Atom", "D. Mixture"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "元素是由一种什么组成的物质？",
            "options": ["A. 分子", "B. 化合物", "C. 原子", "D. 混合物"],
            "answer": "C",
        },
        "tags": ["elements", "atom", "definition"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "elements_compounds",
        "subtopic": "water_formula", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "The chemical formula for water is H₂O. This means each water molecule contains:",
            "options": [
                "A. 2 oxygen atoms and 1 hydrogen atom",
                "B. 2 hydrogen atoms and 1 oxygen atom",
                "C. 1 hydrogen atom and 2 oxygen atoms",
                "D. 3 hydrogen atoms",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "水的化学式是 H₂O，这意味着每个水分子包含：",
            "options": [
                "A. 2 个氧原子和 1 个氢原子",
                "B. 2 个氢原子和 1 个氧原子",
                "C. 1 个氢原子和 2 个氧原子",
                "D. 3 个氢原子",
            ],
            "answer": "B",
        },
        "tags": ["elements_compounds", "chemical_formula", "water"],
    },
    # --- fill-in ---
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "states_of_matter",
        "subtopic": "boiling_point", "difficulty": 0.3, "question_type": "fill_in",
        "content_en": {
            "stem": "Water boils at ____ °C at standard atmospheric pressure.",
            "answer": "100",
        },
        "content_zh": {
            "stem": "在标准大气压下，水的沸点是 ____ °C。",
            "answer": "100",
        },
        "tags": ["matter", "boiling_point", "water"],
    },
    {
        "subject": "chemistry", "grade_level": "G5", "topic": "elements_compounds",
        "subtopic": "symbol", "difficulty": 0.25, "question_type": "fill_in",
        "content_en": {
            "stem": "The chemical symbol for gold is ____.",
            "answer": "Au",
        },
        "content_zh": {
            "stem": "金的化学符号是 ____。",
            "answer": "Au",
        },
        "tags": ["elements", "symbol", "gold"],
    },
]

# ---------------------------------------------------------------------------
# G6 — Atomic Structure & Reactions
# ---------------------------------------------------------------------------

G6_QUESTIONS = [
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "atomic_structure",
        "subtopic": "subatomic_particles", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which subatomic particle has a negative charge?",
            "options": ["A. Proton", "B. Neutron", "C. Electron", "D. Nucleus"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪种亚原子粒子带负电？",
            "options": ["A. 质子", "B. 中子", "C. 电子", "D. 原子核"],
            "answer": "C",
        },
        "tags": ["atomic_structure", "electron", "charge"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "atomic_structure",
        "subtopic": "atomic_number", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "The atomic number of an element tells you the number of:",
            "options": ["A. Neutrons", "B. Protons", "C. Electrons in the outer shell", "D. Total particles"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "元素的原子序数告诉你什么的数量？",
            "options": ["A. 中子", "B. 质子", "C. 外层电子", "D. 总粒子数"],
            "answer": "B",
        },
        "tags": ["atomic_structure", "atomic_number", "protons"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "atomic_structure",
        "subtopic": "isotopes", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Isotopes of the same element have the same number of protons but different numbers of:",
            "options": ["A. Electrons", "B. Protons", "C. Neutrons", "D. Energy levels"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "同一元素的同位素具有相同数量的质子，但不同数量的：",
            "options": ["A. 电子", "B. 质子", "C. 中子", "D. 能级"],
            "answer": "C",
        },
        "tags": ["atomic_structure", "isotopes", "neutrons"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "periodic_table",
        "subtopic": "groups", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Elements in the same group (column) of the periodic table have similar:",
            "options": [
                "A. Atomic mass",
                "B. Number of protons",
                "C. Chemical properties",
                "D. Number of neutrons",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "周期表中同一族（列）的元素具有相似的：",
            "options": ["A. 原子质量", "B. 质子数", "C. 化学性质", "D. 中子数"],
            "answer": "C",
        },
        "tags": ["periodic_table", "groups", "properties"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "periodic_table",
        "subtopic": "metals_nonmetals", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which property is typical of metals?",
            "options": [
                "A. Brittle and dull",
                "B. Poor conductors of heat",
                "C. Good conductors of electricity",
                "D. Low melting points",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "以下哪项是金属的典型特性？",
            "options": ["A. 脆而无光泽", "B. 热的不良导体", "C. 电的良导体", "D. 低熔点"],
            "answer": "C",
        },
        "tags": ["periodic_table", "metals", "properties"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "chemical_reactions",
        "subtopic": "balancing", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In the reaction: _H₂ + _O₂ → _H₂O, what are the correct coefficients?",
            "options": ["A. 1, 1, 1", "B. 2, 1, 2", "C. 2, 2, 2", "D. 1, 2, 1"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在反应 _H₂ + _O₂ → _H₂O 中，正确的系数是：",
            "options": ["A. 1, 1, 1", "B. 2, 1, 2", "C. 2, 2, 2", "D. 1, 2, 1"],
            "answer": "B",
        },
        "tags": ["chemical_reactions", "balancing", "water"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "chemical_reactions",
        "subtopic": "conservation_mass", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "In a chemical reaction, the total mass of reactants equals the total mass of products. This is the Law of:",
            "options": [
                "A. Conservation of Energy",
                "B. Conservation of Mass",
                "C. Thermodynamics",
                "D. Definite Proportions",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在化学反应中，反应物的总质量等于产物的总质量。这是：",
            "options": ["A. 能量守恒定律", "B. 质量守恒定律", "C. 热力学定律", "D. 定比定律"],
            "answer": "B",
        },
        "tags": ["chemical_reactions", "conservation_of_mass", "law"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "acids_bases",
        "subtopic": "pH_scale", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "A solution with a pH of 3 is:",
            "options": ["A. Neutral", "B. Basic (alkaline)", "C. Acidic", "D. Neither acidic nor basic"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "pH 为 3 的溶液是：",
            "options": ["A. 中性的", "B. 碱性的", "C. 酸性的", "D. 既不酸也不碱"],
            "answer": "C",
        },
        "tags": ["acids_bases", "pH", "acidic"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "acids_bases",
        "subtopic": "neutralization", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "When an acid reacts with a base, the products are typically:",
            "options": [
                "A. Two acids",
                "B. Salt and water",
                "C. A gas and a solid",
                "D. Two bases",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "酸和碱反应时，产物通常是：",
            "options": ["A. 两种酸", "B. 盐和水", "C. 气体和固体", "D. 两种碱"],
            "answer": "B",
        },
        "tags": ["acids_bases", "neutralization", "salt"],
    },
    # --- fill-in ---
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "periodic_table",
        "subtopic": "element_lookup", "difficulty": 0.35, "question_type": "fill_in",
        "content_en": {
            "stem": "The chemical symbol for sodium is ____.",
            "answer": "Na",
        },
        "content_zh": {
            "stem": "钠的化学符号是 ____。",
            "answer": "Na",
        },
        "tags": ["periodic_table", "symbol", "sodium"],
    },
    {
        "subject": "chemistry", "grade_level": "G6", "topic": "acids_bases",
        "subtopic": "neutral_pH", "difficulty": 0.3, "question_type": "fill_in",
        "content_en": {
            "stem": "Pure water has a pH of ____.",
            "answer": "7",
        },
        "content_zh": {
            "stem": "纯水的 pH 值是 ____。",
            "answer": "7",
        },
        "tags": ["acids_bases", "pH", "neutral"],
    },
]

# ---------------------------------------------------------------------------
# G7 — Bonding, Stoichiometry & Gas Laws
# ---------------------------------------------------------------------------

G7_QUESTIONS = [
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "bonding",
        "subtopic": "ionic_bond", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "An ionic bond is formed when:",
            "options": [
                "A. Two atoms share electrons",
                "B. One atom transfers electrons to another",
                "C. Atoms share a proton",
                "D. Two metals combine",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "离子键形成于：",
            "options": ["A. 两个原子共享电子", "B. 一个原子将电子转移给另一个", "C. 原子共享质子", "D. 两种金属结合"],
            "answer": "B",
        },
        "tags": ["bonding", "ionic_bond", "electron_transfer"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "bonding",
        "subtopic": "covalent_bond", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In a covalent bond, atoms:",
            "options": [
                "A. Transfer electrons",
                "B. Share electrons",
                "C. Lose all electrons",
                "D. Gain protons",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在共价键中，原子：",
            "options": ["A. 转移电子", "B. 共享电子", "C. 失去所有电子", "D. 获得质子"],
            "answer": "B",
        },
        "tags": ["bonding", "covalent_bond", "electron_sharing"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "bonding",
        "subtopic": "valence_electrons", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "An atom with 7 valence electrons will most likely:",
            "options": [
                "A. Lose 7 electrons",
                "B. Gain 1 electron to fill its outer shell",
                "C. Share no electrons",
                "D. Become a positive ion",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个有 7 个价电子的原子最可能：",
            "options": ["A. 失去 7 个电子", "B. 获得 1 个电子以填满外层", "C. 不共享电子", "D. 成为正离子"],
            "answer": "B",
        },
        "tags": ["bonding", "valence_electrons", "octet_rule"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "stoichiometry_intro",
        "subtopic": "molar_mass", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The molar mass of water (H₂O) is approximately: (H = 1 g/mol, O = 16 g/mol)",
            "options": ["A. 17 g/mol", "B. 18 g/mol", "C. 20 g/mol", "D. 16 g/mol"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "水 (H₂O) 的摩尔质量大约是：（H = 1 g/mol, O = 16 g/mol）",
            "options": ["A. 17 g/mol", "B. 18 g/mol", "C. 20 g/mol", "D. 16 g/mol"],
            "answer": "B",
        },
        "tags": ["stoichiometry", "molar_mass", "calculation"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "stoichiometry_intro",
        "subtopic": "mole_concept", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "One mole of any substance contains approximately how many particles?",
            "options": ["A. 6.02 × 10²³", "B. 6.02 × 10²²", "C. 3.14 × 10²³", "D. 1.00 × 10²⁴"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "一摩尔的任何物质大约包含多少个粒子？",
            "options": ["A. 6.02 × 10²³", "B. 6.02 × 10²²", "C. 3.14 × 10²³", "D. 1.00 × 10²⁴"],
            "answer": "A",
        },
        "tags": ["stoichiometry", "avogadro", "mole"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "solutions_concentration",
        "subtopic": "solubility", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Which factor generally increases the solubility of a solid in water?",
            "options": [
                "A. Decreasing temperature",
                "B. Increasing temperature",
                "C. Increasing pressure",
                "D. Decreasing the amount of solvent",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个因素通常会增加固体在水中的溶解度？",
            "options": ["A. 降低温度", "B. 升高温度", "C. 增加压力", "D. 减少溶剂量"],
            "answer": "B",
        },
        "tags": ["solutions", "solubility", "temperature"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "solutions_concentration",
        "subtopic": "concentration", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "If you dissolve 10 g of salt in 90 g of water, the mass percent concentration is:",
            "options": ["A. 10%", "B. 11.1%", "C. 90%", "D. 9%"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "将 10 g 盐溶解在 90 g 水中，质量分数浓度为：",
            "options": ["A. 10%", "B. 11.1%", "C. 90%", "D. 9%"],
            "answer": "A",
        },
        "tags": ["solutions", "concentration", "mass_percent"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "gas_laws",
        "subtopic": "boyles_law", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Boyle's Law states that at constant temperature, the volume of a gas is inversely proportional to its:",
            "options": ["A. Temperature", "B. Pressure", "C. Number of moles", "D. Mass"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "波义耳定律指出，在恒温条件下，气体体积与什么成反比？",
            "options": ["A. 温度", "B. 压力", "C. 摩尔数", "D. 质量"],
            "answer": "B",
        },
        "tags": ["gas_laws", "boyles_law", "pressure_volume"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "gas_laws",
        "subtopic": "charles_law", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "According to Charles's Law, when the temperature of a gas increases (at constant pressure), the volume:",
            "options": ["A. Decreases", "B. Stays the same", "C. Increases", "D. Becomes zero"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "根据查理定律，当气体温度升高（压力恒定时），体积会：",
            "options": ["A. 减小", "B. 不变", "C. 增大", "D. 变为零"],
            "answer": "C",
        },
        "tags": ["gas_laws", "charles_law", "temperature_volume"],
    },
    # --- fill-in ---
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "stoichiometry_intro",
        "subtopic": "molar_mass_calc", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "The molar mass of CO₂ is ____ g/mol. (C = 12, O = 16)",
            "answer": "44",
        },
        "content_zh": {
            "stem": "CO₂ 的摩尔质量是 ____ g/mol。（C = 12, O = 16）",
            "answer": "44",
        },
        "tags": ["stoichiometry", "molar_mass", "CO2"],
    },
    {
        "subject": "chemistry", "grade_level": "G7", "topic": "gas_laws",
        "subtopic": "boyles_calc", "difficulty": 0.6, "question_type": "fill_in",
        "content_en": {
            "stem": "P₁V₁ = P₂V₂. If P₁ = 2 atm, V₁ = 6 L, P₂ = 3 atm, then V₂ = ____ L.",
            "answer": "4",
        },
        "content_zh": {
            "stem": "P₁V₁ = P₂V₂。若 P₁ = 2 atm，V₁ = 6 L，P₂ = 3 atm，则 V₂ = ____ L。",
            "answer": "4",
        },
        "tags": ["gas_laws", "boyles_law", "calculation"],
    },
]

# ---------------------------------------------------------------------------
# G8 — AP Chemistry Readiness
# ---------------------------------------------------------------------------

G8_QUESTIONS = [
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "mole_concept",
        "subtopic": "mole_conversions", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "How many moles are in 36 g of water (H₂O)? (Molar mass = 18 g/mol)",
            "options": ["A. 0.5 mol", "B. 1 mol", "C. 2 mol", "D. 18 mol"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "36 g 水 (H₂O) 中有多少摩尔？（摩尔质量 = 18 g/mol）",
            "options": ["A. 0.5 mol", "B. 1 mol", "C. 2 mol", "D. 18 mol"],
            "answer": "C",
        },
        "tags": ["mole_concept", "mole_conversion", "calculation"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "mole_concept",
        "subtopic": "molarity", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "A solution contains 0.5 moles of NaCl dissolved in 2 liters of water. The molarity is:",
            "options": ["A. 1.0 M", "B. 0.25 M", "C. 0.5 M", "D. 2.5 M"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "溶液中含有 0.5 摩尔 NaCl 溶解在 2 升水中，摩尔浓度为：",
            "options": ["A. 1.0 M", "B. 0.25 M", "C. 0.5 M", "D. 2.5 M"],
            "answer": "B",
        },
        "tags": ["mole_concept", "molarity", "concentration"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "reaction_types",
        "subtopic": "synthesis", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "2Na + Cl₂ → 2NaCl is an example of which type of reaction?",
            "options": ["A. Decomposition", "B. Synthesis (combination)", "C. Single replacement", "D. Combustion"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "2Na + Cl₂ → 2NaCl 是哪种类型的反应？",
            "options": ["A. 分解反应", "B. 化合反应", "C. 单置换反应", "D. 燃烧反应"],
            "answer": "B",
        },
        "tags": ["reaction_types", "synthesis", "combination"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "reaction_types",
        "subtopic": "redox", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "In a redox reaction, the substance that loses electrons is:",
            "options": ["A. Reduced", "B. Oxidized", "C. Neutralized", "D. Catalyzed"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在氧化还原反应中，失去电子的物质被：",
            "options": ["A. 还原", "B. 氧化", "C. 中和", "D. 催化"],
            "answer": "B",
        },
        "tags": ["reaction_types", "redox", "oxidation"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "reaction_types",
        "subtopic": "endothermic_exothermic", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "An ice pack getting cold when activated is an example of:",
            "options": [
                "A. An exothermic reaction",
                "B. An endothermic reaction",
                "C. A nuclear reaction",
                "D. No reaction",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "冰袋激活后变冷是什么类型反应的例子？",
            "options": ["A. 放热反应", "B. 吸热反应", "C. 核反应", "D. 没有反应"],
            "answer": "B",
        },
        "tags": ["reaction_types", "endothermic", "energy"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "thermochemistry",
        "subtopic": "enthalpy", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "If ΔH for a reaction is negative, the reaction is:",
            "options": ["A. Endothermic", "B. Exothermic", "C. At equilibrium", "D. Not spontaneous"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "如果反应的 ΔH 为负值，该反应为：",
            "options": ["A. 吸热反应", "B. 放热反应", "C. 处于平衡", "D. 非自发的"],
            "answer": "B",
        },
        "tags": ["thermochemistry", "enthalpy", "exothermic"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "thermochemistry",
        "subtopic": "specific_heat", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "q = mcΔT. How much heat is needed to raise 100 g of water by 10°C? (c = 4.18 J/g°C)",
            "options": ["A. 418 J", "B. 4180 J", "C. 41.8 J", "D. 41800 J"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "q = mcΔT。将 100 g 水升高 10°C 需要多少热量？（c = 4.18 J/g°C）",
            "options": ["A. 418 J", "B. 4180 J", "C. 41.8 J", "D. 41800 J"],
            "answer": "B",
        },
        "tags": ["thermochemistry", "specific_heat", "calculation"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "equilibrium",
        "subtopic": "le_chatelier", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "According to Le Chatelier's Principle, if the concentration of a reactant is increased, the equilibrium will shift:",
            "options": [
                "A. Toward the reactants",
                "B. Toward the products",
                "C. Not at all",
                "D. In a random direction",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "根据勒夏特列原理，如果增加反应物的浓度，平衡将向哪个方向移动？",
            "options": ["A. 向反应物方向", "B. 向产物方向", "C. 不移动", "D. 随机方向"],
            "answer": "B",
        },
        "tags": ["equilibrium", "le_chatelier", "concentration"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "equilibrium",
        "subtopic": "Keq", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "If Keq >> 1 for a reaction, this means:",
            "options": [
                "A. Products are favored at equilibrium",
                "B. Reactants are favored at equilibrium",
                "C. The reaction does not occur",
                "D. The reaction is very slow",
            ],
            "answer": "A",
        },
        "content_zh": {
            "stem": "如果一个反应的 Keq >> 1，这意味着：",
            "options": ["A. 平衡时产物占优", "B. 平衡时反应物占优", "C. 反应不发生", "D. 反应非常慢"],
            "answer": "A",
        },
        "tags": ["equilibrium", "Keq", "equilibrium_constant"],
    },
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "equilibrium",
        "subtopic": "catalyst", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A catalyst speeds up a reaction by:",
            "options": [
                "A. Increasing the temperature",
                "B. Lowering the activation energy",
                "C. Adding more reactants",
                "D. Changing the equilibrium position",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "催化剂通过什么方式加速反应？",
            "options": ["A. 提高温度", "B. 降低活化能", "C. 增加反应物", "D. 改变平衡位置"],
            "answer": "B",
        },
        "tags": ["equilibrium", "catalyst", "activation_energy"],
    },
    # --- fill-in ---
    {
        "subject": "chemistry", "grade_level": "G8", "topic": "mole_concept",
        "subtopic": "mole_calc", "difficulty": 0.6, "question_type": "fill_in",
        "content_en": {
            "stem": "How many moles are in 88 g of CO₂? (Molar mass = 44 g/mol) Answer: ____ mol.",
            "answer": "2",
        },
        "content_zh": {
            "stem": "88 g CO₂ 中有多少摩尔？（摩尔质量 = 44 g/mol）答：____ mol。",
            "answer": "2",
        },
        "tags": ["mole_concept", "calculation"],
    },
]

# ---------------------------------------------------------------------------
ALL_CHEMISTRY_QUESTIONS = G5_QUESTIONS + G6_QUESTIONS + G7_QUESTIONS + G8_QUESTIONS


async def seed() -> int:
    await db.init_schema()
    count = await db.bulk_insert_questions(ALL_CHEMISTRY_QUESTIONS)
    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} chemistry questions (G5-G8)")
        await db.close_pool()

    asyncio.run(main())
