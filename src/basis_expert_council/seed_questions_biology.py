"""
BasisPilot — Biology Seed Questions (G5-G8)
Aligned to BASIS curriculum (AP Biology readiness by G8).

Topics per grade:
  G5: cells, ecosystems, body_systems, classification
  G6: cell_processes, genetics_intro, evolution_intro, ecology
  G7: dna_rna, heredity, natural_selection, human_systems
  G8: molecular_biology, evolution_advanced, ecology_advanced, bioethics (AP readiness)

Run: python -m src.basis_expert_council.seed_questions_biology
"""

import asyncio
import json

from . import db

# ---------------------------------------------------------------------------
# G5 — Foundations of Life Science
# ---------------------------------------------------------------------------

G5_QUESTIONS = [
    {
        "subject": "biology", "grade_level": "G5", "topic": "cells",
        "subtopic": "cell_theory", "difficulty": 0.25, "question_type": "mcq",
        "content_en": {
            "stem": "What is the basic unit of all living things?",
            "options": ["A. Atom", "B. Molecule", "C. Cell", "D. Organ"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "所有生物的基本单位是什么？",
            "options": ["A. 原子", "B. 分子", "C. 细胞", "D. 器官"],
            "answer": "C",
        },
        "tags": ["cells", "cell_theory", "fundamentals"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "cells",
        "subtopic": "plant_animal", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Which structure is found in plant cells but NOT in animal cells?",
            "options": ["A. Nucleus", "B. Cell membrane", "C. Cell wall", "D. Mitochondria"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪种结构存在于植物细胞中但不存在于动物细胞中？",
            "options": ["A. 细胞核", "B. 细胞膜", "C. 细胞壁", "D. 线粒体"],
            "answer": "C",
        },
        "tags": ["cells", "plant_animal", "cell_wall"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "cells",
        "subtopic": "organelles", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Which organelle is known as the 'powerhouse' of the cell?",
            "options": ["A. Nucleus", "B. Ribosome", "C. Mitochondria", "D. Golgi apparatus"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个细胞器被称为细胞的'发电站'？",
            "options": ["A. 细胞核", "B. 核糖体", "C. 线粒体", "D. 高尔基体"],
            "answer": "C",
        },
        "tags": ["cells", "organelles", "mitochondria"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "ecosystems",
        "subtopic": "food_chain", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "In a food chain: grass → rabbit → fox, the rabbit is a:",
            "options": ["A. Producer", "B. Primary consumer", "C. Secondary consumer", "D. Decomposer"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在食物链：草 → 兔子 → 狐狸 中，兔子是：",
            "options": ["A. 生产者", "B. 初级消费者", "C. 次级消费者", "D. 分解者"],
            "answer": "B",
        },
        "tags": ["ecosystems", "food_chain", "consumer"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "ecosystems",
        "subtopic": "energy_flow", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "In an ecosystem, energy flows from:",
            "options": [
                "A. Consumers to producers",
                "B. Producers to consumers to decomposers",
                "C. Decomposers to producers",
                "D. All organisms equally",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在生态系统中，能量从：",
            "options": [
                "A. 消费者流向生产者",
                "B. 生产者流向消费者再到分解者",
                "C. 分解者流向生产者",
                "D. 所有生物平等流动",
            ],
            "answer": "B",
        },
        "tags": ["ecosystems", "energy_flow", "trophic_levels"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "body_systems",
        "subtopic": "circulatory", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "The main function of the circulatory system is to:",
            "options": [
                "A. Break down food",
                "B. Transport blood, oxygen, and nutrients throughout the body",
                "C. Support the body's structure",
                "D. Send messages to the brain",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "循环系统的主要功能是：",
            "options": [
                "A. 分解食物",
                "B. 将血液、氧气和营养物质输送到全身",
                "C. 支撑身体结构",
                "D. 向大脑发送信息",
            ],
            "answer": "B",
        },
        "tags": ["body_systems", "circulatory", "function"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "body_systems",
        "subtopic": "respiratory", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Gas exchange in humans occurs primarily in the:",
            "options": ["A. Heart", "B. Stomach", "C. Lungs (alveoli)", "D. Kidneys"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "人体的气体交换主要发生在：",
            "options": ["A. 心脏", "B. 胃", "C. 肺（肺泡）", "D. 肾脏"],
            "answer": "C",
        },
        "tags": ["body_systems", "respiratory", "gas_exchange"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "classification",
        "subtopic": "kingdoms", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Which kingdom includes organisms that make their own food through photosynthesis?",
            "options": ["A. Animalia", "B. Fungi", "C. Plantae", "D. Protista"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个界包括通过光合作用自己制造食物的生物？",
            "options": ["A. 动物界", "B. 真菌界", "C. 植物界", "D. 原生生物界"],
            "answer": "C",
        },
        "tags": ["classification", "kingdoms", "plantae"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "classification",
        "subtopic": "taxonomy", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "The correct order of classification from broadest to most specific is:",
            "options": [
                "A. Species, Genus, Family, Order, Class, Phylum, Kingdom",
                "B. Kingdom, Phylum, Class, Order, Family, Genus, Species",
                "C. Kingdom, Class, Phylum, Order, Family, Species, Genus",
                "D. Species, Kingdom, Phylum, Class, Order, Genus, Family",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "从最广到最具体的正确分类顺序是：",
            "options": [
                "A. 种、属、科、目、纲、门、界",
                "B. 界、门、纲、目、科、属、种",
                "C. 界、纲、门、目、科、种、属",
                "D. 种、界、门、纲、目、属、科",
            ],
            "answer": "B",
        },
        "tags": ["classification", "taxonomy", "hierarchy"],
    },
    # --- fill-in ---
    {
        "subject": "biology", "grade_level": "G5", "topic": "cells",
        "subtopic": "photosynthesis", "difficulty": 0.35, "question_type": "fill_in",
        "content_en": {
            "stem": "The process by which plants convert sunlight into food (glucose) is called _______.",
            "answer": "photosynthesis",
        },
        "content_zh": {
            "stem": "植物将阳光转化为食物（葡萄糖）的过程叫做_______。",
            "answer": "photosynthesis|光合作用",
        },
        "tags": ["cells", "photosynthesis"],
    },
    {
        "subject": "biology", "grade_level": "G5", "topic": "ecosystems",
        "subtopic": "producers", "difficulty": 0.25, "question_type": "fill_in",
        "content_en": {
            "stem": "In an ecosystem, organisms that make their own food are called _______.",
            "answer": "producers|autotrophs",
        },
        "content_zh": {
            "stem": "在生态系统中，能自己制造食物的生物叫做_______。",
            "answer": "producers|autotrophs|生产者|自养生物",
        },
        "tags": ["ecosystems", "producers", "autotrophs"],
    },
]

# ---------------------------------------------------------------------------
# G6 — Cell Processes, Genetics & Ecology
# ---------------------------------------------------------------------------

G6_QUESTIONS = [
    {
        "subject": "biology", "grade_level": "G6", "topic": "cell_processes",
        "subtopic": "mitosis", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Mitosis results in:",
            "options": [
                "A. Four genetically different cells",
                "B. Two genetically identical cells",
                "C. One large cell",
                "D. Two genetically different cells",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "有丝分裂的结果是：",
            "options": ["A. 四个遗传不同的细胞", "B. 两个遗传相同的细胞", "C. 一个大细胞", "D. 两个遗传不同的细胞"],
            "answer": "B",
        },
        "tags": ["cell_processes", "mitosis", "cell_division"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "cell_processes",
        "subtopic": "photosynthesis_equation", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "The equation for photosynthesis is: CO₂ + H₂O + Light → Glucose + ____",
            "options": ["A. Nitrogen", "B. Carbon dioxide", "C. Oxygen", "D. Water"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "光合作用方程式：CO₂ + H₂O + 光 → 葡萄糖 + ____",
            "options": ["A. 氮气", "B. 二氧化碳", "C. 氧气", "D. 水"],
            "answer": "C",
        },
        "tags": ["cell_processes", "photosynthesis", "equation"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "cell_processes",
        "subtopic": "cellular_respiration", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Cellular respiration converts glucose and oxygen into:",
            "options": [
                "A. Light and water",
                "B. CO₂, water, and ATP (energy)",
                "C. Protein and fat",
                "D. Glucose and oxygen",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "细胞呼吸将葡萄糖和氧气转化为：",
            "options": [
                "A. 光和水",
                "B. CO₂、水和 ATP（能量）",
                "C. 蛋白质和脂肪",
                "D. 葡萄糖和氧气",
            ],
            "answer": "B",
        },
        "tags": ["cell_processes", "respiration", "ATP"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "genetics_intro",
        "subtopic": "dominant_recessive", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "If brown eyes (B) are dominant over blue eyes (b), what is the genotype of a person with blue eyes?",
            "options": ["A. BB", "B. Bb", "C. bb", "D. Either BB or Bb"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "如果棕色眼睛 (B) 对蓝色眼睛 (b) 是显性的，蓝色眼睛的人的基因型是什么？",
            "options": ["A. BB", "B. Bb", "C. bb", "D. BB 或 Bb"],
            "answer": "C",
        },
        "tags": ["genetics", "dominant_recessive", "genotype"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "genetics_intro",
        "subtopic": "punnett_square", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Two parents are both heterozygous (Bb) for eye color. What percentage of offspring will likely have blue eyes (bb)?",
            "options": ["A. 0%", "B. 25%", "C. 50%", "D. 75%"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两个父母的眼睛颜色都是杂合子 (Bb)。后代中大约有多少可能是蓝色眼睛 (bb)？",
            "options": ["A. 0%", "B. 25%", "C. 50%", "D. 75%"],
            "answer": "B",
        },
        "tags": ["genetics", "punnett_square", "probability"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "evolution_intro",
        "subtopic": "adaptation", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "A cactus has thick stems to store water and spines instead of leaves. These are examples of:",
            "options": ["A. Mutations", "B. Adaptations", "C. Fossils", "D. Decomposition"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "仙人掌有储水的粗茎和代替叶子的刺。这些是什么的例子？",
            "options": ["A. 突变", "B. 适应", "C. 化石", "D. 分解"],
            "answer": "B",
        },
        "tags": ["evolution", "adaptation", "desert"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "evolution_intro",
        "subtopic": "fossil_evidence", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Fossils provide evidence for evolution because they show:",
            "options": [
                "A. That organisms have never changed",
                "B. How organisms have changed over time",
                "C. That all organisms are identical",
                "D. That evolution is not real",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "化石为进化提供证据，因为它们显示了：",
            "options": [
                "A. 生物从未改变",
                "B. 生物如何随时间改变",
                "C. 所有生物都是相同的",
                "D. 进化不是真实的",
            ],
            "answer": "B",
        },
        "tags": ["evolution", "fossils", "evidence"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "ecology",
        "subtopic": "symbiosis", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "A clownfish lives among sea anemone tentacles. The clownfish gets protection, and the anemone gets food scraps. This is an example of:",
            "options": ["A. Parasitism", "B. Commensalism", "C. Mutualism", "D. Competition"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "小丑鱼生活在海葵触手中，小丑鱼获得保护，海葵获得食物残渣。这是什么的例子？",
            "options": ["A. 寄生", "B. 偏利共生", "C. 互利共生", "D. 竞争"],
            "answer": "C",
        },
        "tags": ["ecology", "symbiosis", "mutualism"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "ecology",
        "subtopic": "biomes", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which biome has the greatest biodiversity?",
            "options": ["A. Desert", "B. Tundra", "C. Tropical rainforest", "D. Grassland"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个生物群落具有最大的生物多样性？",
            "options": ["A. 沙漠", "B. 冻原", "C. 热带雨林", "D. 草原"],
            "answer": "C",
        },
        "tags": ["ecology", "biomes", "biodiversity"],
    },
    # --- fill-in ---
    {
        "subject": "biology", "grade_level": "G6", "topic": "cell_processes",
        "subtopic": "organelle_function", "difficulty": 0.4, "question_type": "fill_in",
        "content_en": {
            "stem": "The organelle where photosynthesis takes place in plant cells is the _______.",
            "answer": "chloroplast",
        },
        "content_zh": {
            "stem": "植物细胞中进行光合作用的细胞器是_______。",
            "answer": "chloroplast|叶绿体",
        },
        "tags": ["cell_processes", "chloroplast", "photosynthesis"],
    },
    {
        "subject": "biology", "grade_level": "G6", "topic": "genetics_intro",
        "subtopic": "terminology", "difficulty": 0.4, "question_type": "fill_in",
        "content_en": {
            "stem": "An organism with two different alleles for a trait (e.g., Bb) is called _______.",
            "answer": "heterozygous",
        },
        "content_zh": {
            "stem": "一个有两个不同等位基因的生物（如 Bb）叫做_______。",
            "answer": "heterozygous|杂合子",
        },
        "tags": ["genetics", "heterozygous", "terminology"],
    },
]

# ---------------------------------------------------------------------------
# G7 — DNA, Heredity & Natural Selection
# ---------------------------------------------------------------------------

G7_QUESTIONS = [
    {
        "subject": "biology", "grade_level": "G7", "topic": "dna_rna",
        "subtopic": "dna_structure", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "DNA is shaped like a:",
            "options": ["A. Single strand", "B. Double helix", "C. Triple helix", "D. Flat sheet"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "DNA 的形状像：",
            "options": ["A. 单链", "B. 双螺旋", "C. 三螺旋", "D. 平面"],
            "answer": "B",
        },
        "tags": ["dna_rna", "dna_structure", "double_helix"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "dna_rna",
        "subtopic": "base_pairing", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In DNA, adenine (A) always pairs with:",
            "options": ["A. Guanine (G)", "B. Cytosine (C)", "C. Thymine (T)", "D. Uracil (U)"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "在 DNA 中，腺嘌呤 (A) 总是与什么配对？",
            "options": ["A. 鸟嘌呤 (G)", "B. 胞嘧啶 (C)", "C. 胸腺嘧啶 (T)", "D. 尿嘧啶 (U)"],
            "answer": "C",
        },
        "tags": ["dna_rna", "base_pairing", "complementary"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "dna_rna",
        "subtopic": "rna_vs_dna", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Which is a difference between RNA and DNA?",
            "options": [
                "A. RNA is double-stranded; DNA is single-stranded",
                "B. RNA contains uracil; DNA contains thymine",
                "C. RNA is found only in the nucleus; DNA is found only in the cytoplasm",
                "D. RNA has deoxyribose sugar; DNA has ribose sugar",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "RNA 和 DNA 的一个区别是什么？",
            "options": [
                "A. RNA 是双链；DNA 是单链",
                "B. RNA 含尿嘧啶；DNA 含胸腺嘧啶",
                "C. RNA 只在细胞核中；DNA 只在细胞质中",
                "D. RNA 含脱氧核糖；DNA 含核糖",
            ],
            "answer": "B",
        },
        "tags": ["dna_rna", "RNA_vs_DNA", "uracil"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "heredity",
        "subtopic": "meiosis", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Meiosis produces:",
            "options": [
                "A. 2 identical diploid cells",
                "B. 4 genetically unique haploid cells",
                "C. 2 haploid cells",
                "D. 4 identical diploid cells",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "减数分裂产生：",
            "options": [
                "A. 2 个相同的二倍体细胞",
                "B. 4 个遗传独特的单倍体细胞",
                "C. 2 个单倍体细胞",
                "D. 4 个相同的二倍体细胞",
            ],
            "answer": "B",
        },
        "tags": ["heredity", "meiosis", "gametes"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "heredity",
        "subtopic": "sex_linked", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Color blindness is a sex-linked recessive trait carried on the X chromosome. A carrier mother (XᴮXᵇ) and a normal father (XᴮY) have a son. What is the probability the son is color blind?",
            "options": ["A. 0%", "B. 25%", "C. 50%", "D. 100%"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "色盲是 X 染色体上的伴性隐性遗传。携带者母亲 (XᴮXᵇ) 和正常父亲 (XᴮY) 生了一个儿子。儿子色盲的概率是多少？",
            "options": ["A. 0%", "B. 25%", "C. 50%", "D. 100%"],
            "answer": "C",
        },
        "tags": ["heredity", "sex_linked", "color_blindness"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "natural_selection",
        "subtopic": "darwin", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "According to Darwin's theory of natural selection, which organisms are most likely to survive and reproduce?",
            "options": [
                "A. The largest organisms",
                "B. Those best adapted to their environment",
                "C. The fastest organisms",
                "D. The most aggressive organisms",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "根据达尔文的自然选择理论，哪些生物最有可能存活和繁殖？",
            "options": [
                "A. 最大的生物",
                "B. 最适应环境的生物",
                "C. 最快的生物",
                "D. 最具攻击性的生物",
            ],
            "answer": "B",
        },
        "tags": ["natural_selection", "darwin", "fitness"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "natural_selection",
        "subtopic": "speciation", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "When a population is geographically separated and evolves into two distinct species, this is called:",
            "options": [
                "A. Sympatric speciation",
                "B. Allopatric speciation",
                "C. Artificial selection",
                "D. Gene flow",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "当一个种群在地理上被隔离并演化为两个不同的物种时，这叫做：",
            "options": ["A. 同域物种形成", "B. 异域物种形成", "C. 人工选择", "D. 基因流动"],
            "answer": "B",
        },
        "tags": ["natural_selection", "speciation", "geographic_isolation"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "human_systems",
        "subtopic": "nervous_system", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "The basic functional unit of the nervous system is the:",
            "options": ["A. Organ", "B. Neuron", "C. Blood cell", "D. Muscle fiber"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "神经系统的基本功能单位是：",
            "options": ["A. 器官", "B. 神经元", "C. 血细胞", "D. 肌肉纤维"],
            "answer": "B",
        },
        "tags": ["human_systems", "nervous_system", "neuron"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "human_systems",
        "subtopic": "immune_system", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Vaccines help the immune system by:",
            "options": [
                "A. Killing all bacteria in the body",
                "B. Introducing a weakened form of a pathogen so the body can build immunity",
                "C. Replacing white blood cells",
                "D. Providing antibiotics",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "疫苗通过什么方式帮助免疫系统？",
            "options": [
                "A. 杀死体内所有细菌",
                "B. 引入弱化的病原体让身体建立免疫力",
                "C. 替换白细胞",
                "D. 提供抗生素",
            ],
            "answer": "B",
        },
        "tags": ["human_systems", "immune_system", "vaccines"],
    },
    # --- fill-in ---
    {
        "subject": "biology", "grade_level": "G7", "topic": "dna_rna",
        "subtopic": "codon", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "A sequence of three mRNA bases that codes for one amino acid is called a _______.",
            "answer": "codon",
        },
        "content_zh": {
            "stem": "编码一个氨基酸的三个 mRNA 碱基序列叫做_______。",
            "answer": "codon|密码子",
        },
        "tags": ["dna_rna", "codon", "translation"],
    },
    {
        "subject": "biology", "grade_level": "G7", "topic": "heredity",
        "subtopic": "chromosome_number", "difficulty": 0.45, "question_type": "fill_in",
        "content_en": {
            "stem": "Human body cells contain ____ pairs of chromosomes (total 46).",
            "answer": "23",
        },
        "content_zh": {
            "stem": "人类体细胞包含 ____ 对染色体（共 46 条）。",
            "answer": "23",
        },
        "tags": ["heredity", "chromosomes", "human"],
    },
]

# ---------------------------------------------------------------------------
# G8 — AP Biology Readiness
# ---------------------------------------------------------------------------

G8_QUESTIONS = [
    {
        "subject": "biology", "grade_level": "G8", "topic": "molecular_biology",
        "subtopic": "protein_synthesis", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "The correct sequence of protein synthesis is:",
            "options": [
                "A. Translation → Transcription",
                "B. Transcription → Translation",
                "C. Replication → Translation",
                "D. Translation → Replication",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "蛋白质合成的正确顺序是：",
            "options": [
                "A. 翻译 → 转录",
                "B. 转录 → 翻译",
                "C. 复制 → 翻译",
                "D. 翻译 → 复制",
            ],
            "answer": "B",
        },
        "tags": ["molecular_biology", "protein_synthesis", "central_dogma"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "molecular_biology",
        "subtopic": "mutations", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A frameshift mutation occurs when:",
            "options": [
                "A. One base is substituted for another",
                "B. A base is inserted or deleted, shifting the reading frame",
                "C. An entire chromosome is duplicated",
                "D. Proteins fold incorrectly",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "移码突变发生在：",
            "options": [
                "A. 一个碱基被另一个替换",
                "B. 一个碱基被插入或删除，导致阅读框移位",
                "C. 整条染色体被复制",
                "D. 蛋白质折叠错误",
            ],
            "answer": "B",
        },
        "tags": ["molecular_biology", "mutation", "frameshift"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "molecular_biology",
        "subtopic": "enzymes", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Enzymes speed up chemical reactions by:",
            "options": [
                "A. Increasing the temperature",
                "B. Lowering the activation energy",
                "C. Adding more reactants",
                "D. Creating new molecules",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "酶通过什么方式加速化学反应？",
            "options": ["A. 升高温度", "B. 降低活化能", "C. 增加反应物", "D. 创造新分子"],
            "answer": "B",
        },
        "tags": ["molecular_biology", "enzymes", "activation_energy"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "evolution_advanced",
        "subtopic": "evidence", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Homologous structures (e.g., human arm and whale flipper) provide evidence for evolution because they suggest:",
            "options": [
                "A. The organisms live in the same environment",
                "B. A common ancestor",
                "C. The organisms have identical DNA",
                "D. Convergent evolution",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "同源结构（如人的手臂和鲸鱼的鳍）为进化提供证据，因为它们暗示了：",
            "options": ["A. 这些生物生活在相同环境中", "B. 共同的祖先", "C. 这些生物有相同的 DNA", "D. 趋同进化"],
            "answer": "B",
        },
        "tags": ["evolution", "homologous_structures", "common_ancestor"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "evolution_advanced",
        "subtopic": "hardy_weinberg", "difficulty": 0.75, "question_type": "mcq",
        "content_en": {
            "stem": "Hardy-Weinberg equilibrium is maintained when there is NO:",
            "options": [
                "A. Sexual reproduction",
                "B. Mutation, selection, genetic drift, or gene flow",
                "C. Large population size",
                "D. Random mating",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哈迪-温伯格平衡在没有什么的情况下保持？",
            "options": [
                "A. 有性生殖",
                "B. 突变、选择、遗传漂变或基因流动",
                "C. 大种群",
                "D. 随机交配",
            ],
            "answer": "B",
        },
        "tags": ["evolution", "hardy_weinberg", "population_genetics"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "ecology_advanced",
        "subtopic": "nitrogen_cycle", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "In the nitrogen cycle, nitrogen-fixing bacteria convert atmospheric N₂ into:",
            "options": ["A. Oxygen", "B. Ammonia (NH₃)", "C. Carbon dioxide", "D. Water"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在氮循环中，固氮细菌将大气中的 N₂ 转化为：",
            "options": ["A. 氧气", "B. 氨 (NH₃)", "C. 二氧化碳", "D. 水"],
            "answer": "B",
        },
        "tags": ["ecology", "nitrogen_cycle", "bacteria"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "ecology_advanced",
        "subtopic": "population_dynamics", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "The maximum population size that an environment can sustain indefinitely is called the:",
            "options": ["A. Growth rate", "B. Carrying capacity", "C. Birth rate", "D. Density"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个环境能长期维持的最大种群数量叫做：",
            "options": ["A. 增长率", "B. 环境容纳量（承载力）", "C. 出生率", "D. 密度"],
            "answer": "B",
        },
        "tags": ["ecology", "carrying_capacity", "population"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "ecology_advanced",
        "subtopic": "succession", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "The first organisms to colonize a barren environment (such as after a volcanic eruption) are called:",
            "options": ["A. Climax species", "B. Pioneer species", "C. Keystone species", "D. Invasive species"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "最先在荒芜环境（如火山爆发后）定居的生物叫做：",
            "options": ["A. 顶极种", "B. 先锋种", "C. 关键种", "D. 入侵种"],
            "answer": "B",
        },
        "tags": ["ecology", "succession", "pioneer_species"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "bioethics",
        "subtopic": "genetic_engineering", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "CRISPR-Cas9 is a tool used for:",
            "options": [
                "A. Observing cells under a microscope",
                "B. Editing specific genes in an organism's DNA",
                "C. Measuring blood pressure",
                "D. Classifying organisms",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "CRISPR-Cas9 是用于什么的工具？",
            "options": [
                "A. 在显微镜下观察细胞",
                "B. 编辑生物体 DNA 中的特定基因",
                "C. 测量血压",
                "D. 对生物进行分类",
            ],
            "answer": "B",
        },
        "tags": ["bioethics", "CRISPR", "gene_editing"],
    },
    # --- fill-in ---
    {
        "subject": "biology", "grade_level": "G8", "topic": "molecular_biology",
        "subtopic": "central_dogma", "difficulty": 0.6, "question_type": "fill_in",
        "content_en": {
            "stem": "The Central Dogma of molecular biology is: DNA → RNA → _______.",
            "answer": "Protein|protein",
        },
        "content_zh": {
            "stem": "分子生物学的中心法则是：DNA → RNA → _______。",
            "answer": "Protein|protein|蛋白质",
        },
        "tags": ["molecular_biology", "central_dogma"],
    },
    {
        "subject": "biology", "grade_level": "G8", "topic": "ecology_advanced",
        "subtopic": "carbon_cycle", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "Plants remove CO₂ from the atmosphere through the process of _______.",
            "answer": "photosynthesis",
        },
        "content_zh": {
            "stem": "植物通过_______过程从大气中移除 CO₂。",
            "answer": "photosynthesis|光合作用",
        },
        "tags": ["ecology", "carbon_cycle", "photosynthesis"],
    },
]

# ---------------------------------------------------------------------------
ALL_BIOLOGY_QUESTIONS = G5_QUESTIONS + G6_QUESTIONS + G7_QUESTIONS + G8_QUESTIONS


async def seed() -> int:
    await db.init_schema()
    count = await db.bulk_insert_questions(ALL_BIOLOGY_QUESTIONS)
    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} biology questions (G5-G8)")
        await db.close_pool()

    asyncio.run(main())
