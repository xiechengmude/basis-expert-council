"""
BasisPilot — English Seed Questions (G5-G8)
Aligned to BASIS curriculum (advanced ELA: grammar, reading comprehension,
vocabulary, writing conventions, literary analysis).

Topics per grade:
  G5: grammar_fundamentals, vocabulary, reading_comprehension, writing_conventions
  G6: grammar_advanced, vocabulary_context, reading_analysis, writing_craft
  G7: literary_analysis, rhetoric, grammar_mastery, vocabulary_advanced
  G8: ap_readiness, critical_reading, argumentation, style_analysis

Run: python -m src.basis_expert_council.seed_questions_english
"""

import asyncio
import json

from . import db

# ---------------------------------------------------------------------------
# G5 — Grammar & Reading Foundations
# ---------------------------------------------------------------------------

G5_QUESTIONS = [
    # --- grammar_fundamentals ---
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "parts_of_speech", "difficulty": 0.25, "question_type": "mcq",
        "content_en": {
            "stem": "Which word in the sentence is an adverb?\n\"She quickly finished her homework.\"",
            "options": ["A. She", "B. quickly", "C. finished", "D. homework"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "下列句子中哪个词是副词？\n\"She quickly finished her homework.\"",
            "options": ["A. She", "B. quickly", "C. finished", "D. homework"],
            "answer": "B",
        },
        "tags": ["grammar", "adverb", "parts_of_speech"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "subject_verb_agreement", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Choose the correct sentence.",
            "options": [
                "A. The dogs runs in the park.",
                "B. The dogs run in the park.",
                "C. The dogs running in the park.",
                "D. The dogs is running in the park.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "选出语法正确的句子。",
            "options": [
                "A. The dogs runs in the park.",
                "B. The dogs run in the park.",
                "C. The dogs running in the park.",
                "D. The dogs is running in the park.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "subject_verb_agreement"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "pronoun_reference", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Choose the sentence with the correct pronoun usage.",
            "options": [
                "A. Him and me went to the store.",
                "B. He and I went to the store.",
                "C. He and me went to the store.",
                "D. Him and I went to the store.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "选出代词使用正确的句子。",
            "options": [
                "A. Him and me went to the store.",
                "B. He and I went to the store.",
                "C. He and me went to the store.",
                "D. Him and I went to the store.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "pronoun", "subject_pronoun"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "tense_consistency", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence uses verb tenses correctly?",
            "options": [
                "A. She walked to school and eats her lunch there.",
                "B. She walked to school and ate her lunch there.",
                "C. She walks to school and ate her lunch there.",
                "D. She walking to school and eats her lunch there.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子的动词时态使用正确？",
            "options": [
                "A. She walked to school and eats her lunch there.",
                "B. She walked to school and ate her lunch there.",
                "C. She walks to school and ate her lunch there.",
                "D. She walking to school and eats her lunch there.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "verb_tense", "consistency"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "comma_rules", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Where should a comma be placed in the following sentence?\n\"After the game we went out for pizza.\"",
            "options": [
                "A. After the, game we went out for pizza.",
                "B. After the game, we went out for pizza.",
                "C. After the game we, went out for pizza.",
                "D. No comma is needed.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "以下句子逗号应放在哪里？\n\"After the game we went out for pizza.\"",
            "options": [
                "A. After the, game we went out for pizza.",
                "B. After the game, we went out for pizza.",
                "C. After the game we, went out for pizza.",
                "D. 不需要逗号。",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "comma", "introductory_phrase"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "possessives", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence correctly uses the possessive form?",
            "options": [
                "A. The childrens' toys were scattered everywhere.",
                "B. The children's toys were scattered everywhere.",
                "C. The childrens toys were scattered everywhere.",
                "D. The children toys were scattered everywhere.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子正确使用了所有格？",
            "options": [
                "A. The childrens' toys were scattered everywhere.",
                "B. The children's toys were scattered everywhere.",
                "C. The childrens toys were scattered everywhere.",
                "D. The children toys were scattered everywhere.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "possessive", "irregular_plural"],
    },
    # --- vocabulary ---
    {
        "subject": "english", "grade_level": "G5", "topic": "vocabulary",
        "subtopic": "word_meaning", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "What does the word \"reluctant\" most likely mean?\n\"She was reluctant to jump into the cold pool.\"",
            "options": ["A. Eager", "B. Unwilling", "C. Excited", "D. Confused"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"reluctant\" 在下列句子中最可能的意思是什么？\n\"She was reluctant to jump into the cold pool.\"",
            "options": ["A. 渴望的", "B. 不情愿的", "C. 兴奋的", "D. 困惑的"],
            "answer": "B",
        },
        "tags": ["vocabulary", "context_clues"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "vocabulary",
        "subtopic": "synonyms", "difficulty": 0.25, "question_type": "mcq",
        "content_en": {
            "stem": "Which word is a synonym for \"enormous\"?",
            "options": ["A. Tiny", "B. Huge", "C. Average", "D. Narrow"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个词是 \"enormous\" 的同义词？",
            "options": ["A. Tiny", "B. Huge", "C. Average", "D. Narrow"],
            "answer": "B",
        },
        "tags": ["vocabulary", "synonyms"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "vocabulary",
        "subtopic": "prefixes", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "The prefix \"un-\" in \"unhappy\" means:",
            "options": ["A. Again", "B. Not", "C. Before", "D. After"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"unhappy\" 中的前缀 \"un-\" 表示：",
            "options": ["A. 再次", "B. 不/没有", "C. 在……之前", "D. 在……之后"],
            "answer": "B",
        },
        "tags": ["vocabulary", "prefix", "word_parts"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "vocabulary",
        "subtopic": "context_clues", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "\"The arid desert had not seen rain in months.\"\nWhat does \"arid\" mean?",
            "options": ["A. Wet", "B. Cold", "C. Dry", "D. Beautiful"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "\"The arid desert had not seen rain in months.\"\n\"arid\" 是什么意思？",
            "options": ["A. 潮湿的", "B. 寒冷的", "C. 干燥的", "D. 美丽的"],
            "answer": "C",
        },
        "tags": ["vocabulary", "context_clues", "adjective"],
    },
    # --- reading_comprehension ---
    {
        "subject": "english", "grade_level": "G5", "topic": "reading_comprehension",
        "subtopic": "main_idea", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Read the passage:\n\"Honeybees are important pollinators. They visit flowers to collect nectar and spread pollen from one plant to another. Without bees, many fruits and vegetables would not grow.\"\n\nWhat is the main idea?",
            "options": [
                "A. Bees like to eat nectar.",
                "B. Honeybees play an important role in helping plants grow.",
                "C. Fruits and vegetables are healthy foods.",
                "D. Flowers are colorful and attract insects.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "阅读段落：\n\"Honeybees are important pollinators. They visit flowers to collect nectar and spread pollen from one plant to another. Without bees, many fruits and vegetables would not grow.\"\n\n文章的主旨是什么？",
            "options": [
                "A. 蜜蜂喜欢吃花蜜。",
                "B. 蜜蜂在帮助植物生长中扮演重要角色。",
                "C. 水果和蔬菜是健康食物。",
                "D. 花朵颜色鲜艳，吸引昆虫。",
            ],
            "answer": "B",
        },
        "tags": ["reading", "main_idea", "nonfiction"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "reading_comprehension",
        "subtopic": "inference", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "\"Maria stared at the clock, tapping her foot. She checked her phone for the third time and sighed heavily.\"\n\nHow is Maria most likely feeling?",
            "options": ["A. Relaxed", "B. Impatient", "C. Sleepy", "D. Frightened"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"Maria stared at the clock, tapping her foot. She checked her phone for the third time and sighed heavily.\"\n\nMaria 最可能的感受是什么？",
            "options": ["A. 放松的", "B. 不耐烦的", "C. 困倦的", "D. 害怕的"],
            "answer": "B",
        },
        "tags": ["reading", "inference", "character_emotion"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "reading_comprehension",
        "subtopic": "sequence", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "\"First, Tom mixed the flour and sugar. Next, he added eggs and milk. Then he poured the batter into a pan and baked it.\"\n\nWhat did Tom do right after adding eggs and milk?",
            "options": [
                "A. Mixed flour and sugar",
                "B. Poured the batter into a pan",
                "C. Ate the cake",
                "D. Went to the store",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"First, Tom mixed the flour and sugar. Next, he added eggs and milk. Then he poured the batter into a pan and baked it.\"\n\nTom 在加完鸡蛋和牛奶后做了什么？",
            "options": [
                "A. 混合面粉和糖",
                "B. 把面糊倒进烤盘",
                "C. 吃了蛋糕",
                "D. 去了商店",
            ],
            "answer": "B",
        },
        "tags": ["reading", "sequence", "order_of_events"],
    },
    # --- writing_conventions ---
    {
        "subject": "english", "grade_level": "G5", "topic": "writing_conventions",
        "subtopic": "capitalization", "difficulty": 0.2, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence is capitalized correctly?",
            "options": [
                "A. we visited the grand canyon in arizona.",
                "B. We visited the Grand Canyon in Arizona.",
                "C. We Visited The Grand Canyon In Arizona.",
                "D. We visited the grand canyon in Arizona.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子的大写使用正确？",
            "options": [
                "A. we visited the grand canyon in arizona.",
                "B. We visited the Grand Canyon in Arizona.",
                "C. We Visited The Grand Canyon In Arizona.",
                "D. We visited the grand canyon in Arizona.",
            ],
            "answer": "B",
        },
        "tags": ["writing", "capitalization", "proper_nouns"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "writing_conventions",
        "subtopic": "sentence_types", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Which of the following is a compound sentence?",
            "options": [
                "A. I like pizza.",
                "B. I like pizza, and she likes pasta.",
                "C. Because I like pizza, I ordered some.",
                "D. The pizza with extra cheese.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "以下哪个是并列句（compound sentence）？",
            "options": [
                "A. I like pizza.",
                "B. I like pizza, and she likes pasta.",
                "C. Because I like pizza, I ordered some.",
                "D. The pizza with extra cheese.",
            ],
            "answer": "B",
        },
        "tags": ["writing", "sentence_types", "compound_sentence"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "writing_conventions",
        "subtopic": "run_on_sentences", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Which of the following is a run-on sentence?",
            "options": [
                "A. I went to the store, and I bought some milk.",
                "B. I went to the store I bought some milk.",
                "C. I went to the store. I bought some milk.",
                "D. After going to the store, I bought some milk.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "以下哪个是连写句（run-on sentence）？",
            "options": [
                "A. I went to the store, and I bought some milk.",
                "B. I went to the store I bought some milk.",
                "C. I went to the store. I bought some milk.",
                "D. After going to the store, I bought some milk.",
            ],
            "answer": "B",
        },
        "tags": ["writing", "run_on", "sentence_structure"],
    },
    # --- fill-in ---
    {
        "subject": "english", "grade_level": "G5", "topic": "vocabulary",
        "subtopic": "antonyms", "difficulty": 0.25, "question_type": "fill_in",
        "content_en": {
            "stem": "Write an antonym (opposite) for the word \"ancient\".",
            "answer": "modern|new|recent",
        },
        "content_zh": {
            "stem": "写出 \"ancient\" 的反义词。",
            "answer": "modern|new|recent",
        },
        "tags": ["vocabulary", "antonyms"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "irregular_verbs", "difficulty": 0.35, "question_type": "fill_in",
        "content_en": {
            "stem": "Complete with the correct past tense: \"Yesterday, I _____ (go) to the library.\"",
            "answer": "went",
        },
        "content_zh": {
            "stem": "用正确的过去时填空：\"Yesterday, I _____ (go) to the library.\"",
            "answer": "went",
        },
        "tags": ["grammar", "irregular_verbs", "past_tense"],
    },
    {
        "subject": "english", "grade_level": "G5", "topic": "grammar_fundamentals",
        "subtopic": "homophones", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Choose the correct word to complete the sentence:\n\"_____ going to the park after school.\"",
            "options": ["A. Their", "B. There", "C. They're", "D. Theyre"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "选择正确的词完成句子：\n\"_____ going to the park after school.\"",
            "options": ["A. Their", "B. There", "C. They're", "D. Theyre"],
            "answer": "C",
        },
        "tags": ["grammar", "homophones", "they_re"],
    },
]

# ---------------------------------------------------------------------------
# G6 — Intermediate Grammar & Reading Analysis
# ---------------------------------------------------------------------------

G6_QUESTIONS = [
    # --- grammar_advanced ---
    {
        "subject": "english", "grade_level": "G6", "topic": "grammar_advanced",
        "subtopic": "relative_clauses", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence correctly uses a relative clause?",
            "options": [
                "A. The book who I read was exciting.",
                "B. The book that I read was exciting.",
                "C. The book what I read was exciting.",
                "D. The book whom I read was exciting.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子正确使用了关系从句？",
            "options": [
                "A. The book who I read was exciting.",
                "B. The book that I read was exciting.",
                "C. The book what I read was exciting.",
                "D. The book whom I read was exciting.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "relative_clause", "that_which"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "grammar_advanced",
        "subtopic": "active_passive_voice", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence is in the passive voice?",
            "options": [
                "A. The cat chased the mouse.",
                "B. The mouse was chased by the cat.",
                "C. The cat is chasing the mouse.",
                "D. The mouse ran from the cat.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子是被动语态？",
            "options": [
                "A. The cat chased the mouse.",
                "B. The mouse was chased by the cat.",
                "C. The cat is chasing the mouse.",
                "D. The mouse ran from the cat.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "passive_voice", "active_passive"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "grammar_advanced",
        "subtopic": "parallel_structure", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence uses correct parallel structure?",
            "options": [
                "A. She likes swimming, to run, and biking.",
                "B. She likes swimming, running, and biking.",
                "C. She likes to swim, running, and to bike.",
                "D. She likes swim, run, and to bike.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子使用了正确的平行结构？",
            "options": [
                "A. She likes swimming, to run, and biking.",
                "B. She likes swimming, running, and biking.",
                "C. She likes to swim, running, and to bike.",
                "D. She likes swim, run, and to bike.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "parallel_structure"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "grammar_advanced",
        "subtopic": "modifier_placement", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence avoids a dangling modifier?",
            "options": [
                "A. Walking to school, the rain started to fall.",
                "B. Walking to school, I got caught in the rain.",
                "C. Walking to school, my backpack got wet.",
                "D. Walking to school, the bus drove by.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子避免了悬垂修饰语？",
            "options": [
                "A. Walking to school, the rain started to fall.",
                "B. Walking to school, I got caught in the rain.",
                "C. Walking to school, my backpack got wet.",
                "D. Walking to school, the bus drove by.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "dangling_modifier", "modifier_placement"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "grammar_advanced",
        "subtopic": "semicolons", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence correctly uses a semicolon?",
            "options": [
                "A. I love reading; and writing.",
                "B. I love reading; it helps me relax.",
                "C. I love; reading and writing.",
                "D. I love reading, it helps me relax.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子正确使用了分号？",
            "options": [
                "A. I love reading; and writing.",
                "B. I love reading; it helps me relax.",
                "C. I love; reading and writing.",
                "D. I love reading, it helps me relax.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "semicolon", "punctuation"],
    },
    # --- vocabulary_context ---
    {
        "subject": "english", "grade_level": "G6", "topic": "vocabulary_context",
        "subtopic": "greek_latin_roots", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "The Latin root \"bene\" means \"good.\" Which word most likely means \"a helpful or good act\"?",
            "options": ["A. Benefit", "B. Beneath", "C. Bench", "D. Bend"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "拉丁词根 \"bene\" 意为 \"好\"。哪个词最可能表示 \"有益的行为\"？",
            "options": ["A. Benefit", "B. Beneath", "C. Bench", "D. Bend"],
            "answer": "A",
        },
        "tags": ["vocabulary", "latin_roots", "word_origins"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "vocabulary_context",
        "subtopic": "connotation", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which word has the most negative connotation?",
            "options": ["A. Thrifty", "B. Economical", "C. Cheap", "D. Frugal"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个词的消极含义最强？",
            "options": ["A. Thrifty（节俭的）", "B. Economical（经济的）", "C. Cheap（廉价的/小气的）", "D. Frugal（节约的）"],
            "answer": "C",
        },
        "tags": ["vocabulary", "connotation", "word_choice"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "vocabulary_context",
        "subtopic": "figurative_language", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "\"Time is money.\"\nThis is an example of:",
            "options": ["A. Simile", "B. Metaphor", "C. Personification", "D. Hyperbole"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"Time is money.\"\n这是哪种修辞手法？",
            "options": ["A. 明喻 (Simile)", "B. 隐喻 (Metaphor)", "C. 拟人 (Personification)", "D. 夸张 (Hyperbole)"],
            "answer": "B",
        },
        "tags": ["vocabulary", "figurative_language", "metaphor"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "vocabulary_context",
        "subtopic": "academic_vocabulary", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "\"The scientist wanted to verify her hypothesis before publishing.\"\nWhat does \"verify\" mean?",
            "options": ["A. Ignore", "B. Confirm", "C. Change", "D. Destroy"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"The scientist wanted to verify her hypothesis before publishing.\"\n\"verify\" 是什么意思？",
            "options": ["A. 忽视", "B. 证实", "C. 改变", "D. 摧毁"],
            "answer": "B",
        },
        "tags": ["vocabulary", "academic_vocabulary"],
    },
    # --- reading_analysis ---
    {
        "subject": "english", "grade_level": "G6", "topic": "reading_analysis",
        "subtopic": "authors_purpose", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "An article describes the effects of plastic pollution on ocean wildlife and urges readers to reduce plastic use.\n\nWhat is the author's primary purpose?",
            "options": ["A. To entertain", "B. To inform and persuade", "C. To describe a vacation", "D. To tell a fictional story"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一篇文章描述了塑料污染对海洋野生动物的影响，并呼吁读者减少塑料使用。\n\n作者的主要目的是什么？",
            "options": ["A. 娱乐读者", "B. 传递信息并说服读者", "C. 描述一次假期", "D. 讲述虚构故事"],
            "answer": "B",
        },
        "tags": ["reading", "authors_purpose", "persuasion"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "reading_analysis",
        "subtopic": "text_structure", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "A passage states: \"Unlike reptiles, which are cold-blooded, mammals are warm-blooded and can regulate their body temperature.\"\n\nWhat text structure does this passage use?",
            "options": ["A. Cause and effect", "B. Chronological order", "C. Compare and contrast", "D. Problem and solution"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一段文字写道：\"Unlike reptiles, which are cold-blooded, mammals are warm-blooded and can regulate their body temperature.\"\n\n这段文字使用了什么文章结构？",
            "options": ["A. 因果关系", "B. 时间顺序", "C. 对比比较", "D. 问题与解决"],
            "answer": "C",
        },
        "tags": ["reading", "text_structure", "compare_contrast"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "reading_analysis",
        "subtopic": "point_of_view", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "\"I couldn't believe my eyes when I saw the northern lights for the first time.\"\n\nWhat point of view is this written in?",
            "options": ["A. First person", "B. Second person", "C. Third person limited", "D. Third person omniscient"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "\"I couldn't believe my eyes when I saw the northern lights for the first time.\"\n\n这段文字使用了什么人称视角？",
            "options": ["A. 第一人称", "B. 第二人称", "C. 第三人称有限视角", "D. 第三人称全知视角"],
            "answer": "A",
        },
        "tags": ["reading", "point_of_view", "first_person"],
    },
    # --- writing_craft ---
    {
        "subject": "english", "grade_level": "G6", "topic": "writing_craft",
        "subtopic": "thesis_statement", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which is the strongest thesis statement for a persuasive essay about school uniforms?",
            "options": [
                "A. School uniforms are interesting.",
                "B. This essay is about school uniforms.",
                "C. School uniforms reduce bullying and help students focus on learning rather than fashion.",
                "D. Some people like school uniforms and some don't.",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "以下哪个是关于校服的议论文最有力的论点句（thesis statement）？",
            "options": [
                "A. School uniforms are interesting.",
                "B. This essay is about school uniforms.",
                "C. School uniforms reduce bullying and help students focus on learning rather than fashion.",
                "D. Some people like school uniforms and some don't.",
            ],
            "answer": "C",
        },
        "tags": ["writing", "thesis_statement", "persuasive"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "writing_craft",
        "subtopic": "transition_words", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Which transition word best shows contrast?\n\"The experiment seemed simple; _______, the results were unexpected.\"",
            "options": ["A. Furthermore", "B. However", "C. Similarly", "D. Therefore"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个过渡词最能表示转折？\n\"The experiment seemed simple; _______, the results were unexpected.\"",
            "options": ["A. Furthermore", "B. However", "C. Similarly", "D. Therefore"],
            "answer": "B",
        },
        "tags": ["writing", "transitions", "contrast"],
    },
    # --- fill-in ---
    {
        "subject": "english", "grade_level": "G6", "topic": "grammar_advanced",
        "subtopic": "who_whom", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "Fill in the blank: \"To ______ should I address the letter?\"",
            "answer": "whom",
        },
        "content_zh": {
            "stem": "填空：\"To ______ should I address the letter?\"",
            "answer": "whom",
        },
        "tags": ["grammar", "who_whom", "pronoun_case"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "vocabulary_context",
        "subtopic": "suffixes", "difficulty": 0.4, "question_type": "fill_in",
        "content_en": {
            "stem": "Add a suffix to \"hope\" to make it mean \"full of hope.\"",
            "answer": "hopeful",
        },
        "content_zh": {
            "stem": "给 \"hope\" 加后缀，使其表示 \"充满希望的\"。",
            "answer": "hopeful",
        },
        "tags": ["vocabulary", "suffix", "word_formation"],
    },
    {
        "subject": "english", "grade_level": "G6", "topic": "writing_craft",
        "subtopic": "conciseness", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence is most concise?",
            "options": [
                "A. Due to the fact that it was raining, we stayed inside.",
                "B. Because it was raining, we stayed inside.",
                "C. It was raining outside and so for that reason we decided to stay inside.",
                "D. The reason we stayed inside was because of the fact that rain was falling.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子最简洁？",
            "options": [
                "A. Due to the fact that it was raining, we stayed inside.",
                "B. Because it was raining, we stayed inside.",
                "C. It was raining outside and so for that reason we decided to stay inside.",
                "D. The reason we stayed inside was because of the fact that rain was falling.",
            ],
            "answer": "B",
        },
        "tags": ["writing", "conciseness", "wordiness"],
    },
]

# ---------------------------------------------------------------------------
# G7 — Literary Analysis & Rhetoric
# ---------------------------------------------------------------------------

G7_QUESTIONS = [
    # --- literary_analysis ---
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "theme", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In a story, a character gives up a prized possession to help a stranger. The character later realizes the act of giving brought more happiness than owning the object.\n\nWhat is the theme?",
            "options": [
                "A. Money can buy happiness.",
                "B. Strangers should not be trusted.",
                "C. True fulfillment comes from generosity, not possessions.",
                "D. It is better to keep what you have.",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "故事中，一个角色放弃了珍贵的物品来帮助陌生人。后来他意识到给予的行为比拥有物品带来了更多的快乐。\n\n这个故事的主题是什么？",
            "options": [
                "A. 金钱可以买到幸福。",
                "B. 不应该信任陌生人。",
                "C. 真正的满足来自慷慨，而非物质。",
                "D. 保住自己拥有的东西更好。",
            ],
            "answer": "C",
        },
        "tags": ["literary_analysis", "theme", "generosity"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "symbolism", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "In a novel, a character repeatedly looks at a broken clock on the wall. The clock never moves.\n\nThe broken clock most likely symbolizes:",
            "options": [
                "A. The character's love of antiques",
                "B. A feeling of being stuck or unable to move forward",
                "C. The character's punctuality",
                "D. The need to buy new furniture",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "小说中，一个角色反复看着墙上坏掉的钟。钟从不走动。\n\n坏掉的钟最可能象征着：",
            "options": [
                "A. 角色对古董的热爱",
                "B. 一种停滞不前的感觉",
                "C. 角色的守时",
                "D. 需要买新家具",
            ],
            "answer": "B",
        },
        "tags": ["literary_analysis", "symbolism", "interpretation"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "characterization", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "\"Instead of telling his friend the truth, Jake smiled and said everything was fine.\"\n\nThis is an example of what type of characterization?",
            "options": [
                "A. Direct characterization",
                "B. Indirect characterization",
                "C. Static characterization",
                "D. Flat characterization",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"Instead of telling his friend the truth, Jake smiled and said everything was fine.\"\n\n这是哪种类型的人物塑造？",
            "options": [
                "A. 直接描写",
                "B. 间接描写",
                "C. 静态人物",
                "D. 扁平人物",
            ],
            "answer": "B",
        },
        "tags": ["literary_analysis", "characterization", "indirect"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "irony", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A fire station burns down.\n\nThis is an example of:",
            "options": ["A. Verbal irony", "B. Dramatic irony", "C. Situational irony", "D. Sarcasm"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一个消防站被烧毁了。\n\n这是哪种类型的反讽？",
            "options": ["A. 言语反讽", "B. 戏剧反讽", "C. 情境反讽", "D. 讽刺"],
            "answer": "C",
        },
        "tags": ["literary_analysis", "irony", "situational_irony"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "conflict", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "A character must decide between following family tradition and pursuing a personal dream.\n\nWhat type of conflict is this?",
            "options": [
                "A. Character vs. Nature",
                "B. Character vs. Society",
                "C. Character vs. Self",
                "D. Character vs. Technology",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一个角色必须在遵循家庭传统和追求个人梦想之间做出选择。\n\n这是哪种类型的冲突？",
            "options": [
                "A. 人与自然",
                "B. 人与社会",
                "C. 人与自我",
                "D. 人与科技",
            ],
            "answer": "C",
        },
        "tags": ["literary_analysis", "conflict", "internal_conflict"],
    },
    # --- rhetoric ---
    {
        "subject": "english", "grade_level": "G7", "topic": "rhetoric",
        "subtopic": "ethos_pathos_logos", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "\"As a doctor with 20 years of experience, I strongly recommend regular exercise.\"\n\nThis statement primarily uses which rhetorical appeal?",
            "options": ["A. Ethos (credibility)", "B. Pathos (emotion)", "C. Logos (logic)", "D. Kairos (timing)"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "\"As a doctor with 20 years of experience, I strongly recommend regular exercise.\"\n\n这句话主要使用了哪种修辞手法？",
            "options": ["A. Ethos（可信度）", "B. Pathos（情感）", "C. Logos（逻辑）", "D. Kairos（时机）"],
            "answer": "A",
        },
        "tags": ["rhetoric", "ethos", "persuasion"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "rhetoric",
        "subtopic": "ethos_pathos_logos", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "\"Studies show that students who sleep 8 hours perform 25% better on exams than those who sleep only 5 hours.\"\n\nThis statement primarily uses which rhetorical appeal?",
            "options": ["A. Ethos", "B. Pathos", "C. Logos", "D. Repetition"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "\"Studies show that students who sleep 8 hours perform 25% better on exams than those who sleep only 5 hours.\"\n\n这句话主要使用了哪种修辞手法？",
            "options": ["A. Ethos（可信度）", "B. Pathos（情感）", "C. Logos（逻辑）", "D. 重复"],
            "answer": "C",
        },
        "tags": ["rhetoric", "logos", "evidence"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "rhetoric",
        "subtopic": "logical_fallacy", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "\"Everyone is buying this phone, so it must be the best one.\"\n\nThis is an example of which logical fallacy?",
            "options": ["A. Straw man", "B. Bandwagon", "C. Ad hominem", "D. Slippery slope"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"Everyone is buying this phone, so it must be the best one.\"\n\n这是哪种逻辑谬误？",
            "options": ["A. 稻草人谬误", "B. 从众谬误", "C. 人身攻击", "D. 滑坡谬误"],
            "answer": "B",
        },
        "tags": ["rhetoric", "logical_fallacy", "bandwagon"],
    },
    # --- grammar_mastery ---
    {
        "subject": "english", "grade_level": "G7", "topic": "grammar_mastery",
        "subtopic": "subjunctive_mood", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence correctly uses the subjunctive mood?",
            "options": [
                "A. If I was rich, I would travel the world.",
                "B. If I were rich, I would travel the world.",
                "C. If I am rich, I would travel the world.",
                "D. If I be rich, I would travel the world.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子正确使用了虚拟语气？",
            "options": [
                "A. If I was rich, I would travel the world.",
                "B. If I were rich, I would travel the world.",
                "C. If I am rich, I would travel the world.",
                "D. If I be rich, I would travel the world.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "subjunctive_mood", "conditionals"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "grammar_mastery",
        "subtopic": "colon_usage", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence correctly uses a colon?",
            "options": [
                "A. I need to buy: eggs, milk, and bread.",
                "B. I need to buy the following items: eggs, milk, and bread.",
                "C. I need: to buy eggs, milk, and bread.",
                "D. I: need to buy eggs, milk, and bread.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪个句子正确使用了冒号？",
            "options": [
                "A. I need to buy: eggs, milk, and bread.",
                "B. I need to buy the following items: eggs, milk, and bread.",
                "C. I need: to buy eggs, milk, and bread.",
                "D. I: need to buy eggs, milk, and bread.",
            ],
            "answer": "B",
        },
        "tags": ["grammar", "colon", "punctuation"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "grammar_mastery",
        "subtopic": "appositives", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which sentence correctly punctuates an appositive?",
            "options": [
                "A. My brother, an engineer works in Boston.",
                "B. My brother an engineer, works in Boston.",
                "C. My brother, an engineer, works in Boston.",
                "D. My brother an engineer works in Boston.",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个句子正确地标点了同位语？",
            "options": [
                "A. My brother, an engineer works in Boston.",
                "B. My brother an engineer, works in Boston.",
                "C. My brother, an engineer, works in Boston.",
                "D. My brother an engineer works in Boston.",
            ],
            "answer": "C",
        },
        "tags": ["grammar", "appositive", "punctuation"],
    },
    # --- vocabulary_advanced ---
    {
        "subject": "english", "grade_level": "G7", "topic": "vocabulary_advanced",
        "subtopic": "tone_words", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "\"The politician delivered her speech with a sardonic grin, mocking her opponent's failed promises.\"\n\nThe word \"sardonic\" most nearly means:",
            "options": ["A. Joyful", "B. Mocking or cynical", "C. Nervous", "D. Respectful"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"The politician delivered her speech with a sardonic grin, mocking her opponent's failed promises.\"\n\n\"sardonic\" 最接近的意思是：",
            "options": ["A. 快乐的", "B. 嘲讽的", "C. 紧张的", "D. 尊重的"],
            "answer": "B",
        },
        "tags": ["vocabulary", "tone_words", "context_clues"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "vocabulary_advanced",
        "subtopic": "sat_vocabulary", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "\"Her eloquent speech captivated the entire audience.\"\n\nThe word \"eloquent\" means:",
            "options": ["A. Boring", "B. Fluent and persuasive", "C. Loud", "D. Brief"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"Her eloquent speech captivated the entire audience.\"\n\n\"eloquent\" 的意思是：",
            "options": ["A. 无聊的", "B. 雄辩的、有说服力的", "C. 大声的", "D. 简短的"],
            "answer": "B",
        },
        "tags": ["vocabulary", "sat_vocabulary", "eloquent"],
    },
    # --- fill-in ---
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "figurative_language", "difficulty": 0.45, "question_type": "fill_in",
        "content_en": {
            "stem": "\"The wind whispered through the trees.\"\nThis is an example of what literary device?",
            "answer": "personification",
        },
        "content_zh": {
            "stem": "\"The wind whispered through the trees.\"\n这是哪种修辞手法？",
            "answer": "personification|拟人",
        },
        "tags": ["literary_analysis", "personification", "figurative_language"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "vocabulary_advanced",
        "subtopic": "word_formation", "difficulty": 0.5, "question_type": "fill_in",
        "content_en": {
            "stem": "The noun form of \"curious\" is _______.",
            "answer": "curiosity",
        },
        "content_zh": {
            "stem": "\"curious\" 的名词形式是 _______。",
            "answer": "curiosity",
        },
        "tags": ["vocabulary", "word_formation", "noun"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "rhetoric",
        "subtopic": "rhetorical_devices", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "\"I have a dream that one day... I have a dream that... I have a dream today!\"\n\nMartin Luther King Jr.'s use of \"I have a dream\" is an example of:",
            "options": ["A. Alliteration", "B. Anaphora", "C. Onomatopoeia", "D. Oxymoron"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"I have a dream that one day... I have a dream that... I have a dream today!\"\n\n马丁·路德·金反复使用 \"I have a dream\" 是哪种修辞手法？",
            "options": ["A. 头韵 (Alliteration)", "B. 首语重复 (Anaphora)", "C. 拟声 (Onomatopoeia)", "D. 矛盾修辞 (Oxymoron)"],
            "answer": "B",
        },
        "tags": ["rhetoric", "anaphora", "rhetorical_devices"],
    },
    {
        "subject": "english", "grade_level": "G7", "topic": "literary_analysis",
        "subtopic": "allusion", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "\"He had the Midas touch — every business he started turned to gold.\"\n\nThe reference to \"Midas\" is an example of:",
            "options": ["A. Metaphor", "B. Allusion", "C. Hyperbole", "D. Simile"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"He had the Midas touch — every business he started turned to gold.\"\n\n提到 \"Midas\" 是哪种修辞手法？",
            "options": ["A. 隐喻", "B. 典故 (Allusion)", "C. 夸张", "D. 明喻"],
            "answer": "B",
        },
        "tags": ["literary_analysis", "allusion", "mythology"],
    },
]

# ---------------------------------------------------------------------------
# G8 — AP Readiness & Critical Reading
# ---------------------------------------------------------------------------

G8_QUESTIONS = [
    # --- critical_reading ---
    {
        "subject": "english", "grade_level": "G8", "topic": "critical_reading",
        "subtopic": "evidence_based", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A passage argues that renewable energy is essential for the future. Which of the following would BEST strengthen the author's argument?",
            "options": [
                "A. A quote from a celebrity who supports solar panels",
                "B. A statistic showing renewable energy costs have dropped 70% in 10 years",
                "C. A personal story about someone who likes hiking",
                "D. A description of how coal was used in the 1800s",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一篇文章论证可再生能源对未来至关重要。以下哪项最能增强作者的论点？",
            "options": [
                "A. 一位名人支持太阳能板的引述",
                "B. 一项统计数据显示可再生能源成本在10年内下降了70%",
                "C. 一个喜欢徒步旅行的人的个人故事",
                "D. 关于 1800 年代煤炭使用方式的描述",
            ],
            "answer": "B",
        },
        "tags": ["critical_reading", "evidence", "argument_strength"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "critical_reading",
        "subtopic": "bias_detection", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "\"Organic food is clearly the only healthy choice. Anyone who eats processed food simply doesn't care about their health.\"\n\nWhich type of bias does this statement demonstrate?",
            "options": [
                "A. Confirmation bias",
                "B. False dilemma (either/or fallacy)",
                "C. Anchoring bias",
                "D. Availability bias",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"Organic food is clearly the only healthy choice. Anyone who eats processed food simply doesn't care about their health.\"\n\n这段话展示了哪种偏见？",
            "options": [
                "A. 确认偏误",
                "B. 非此即彼谬误",
                "C. 锚定偏误",
                "D. 可得性偏误",
            ],
            "answer": "B",
        },
        "tags": ["critical_reading", "bias", "logical_fallacy"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "critical_reading",
        "subtopic": "author_tone", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "\"Oh sure, let's just ignore decades of scientific research because someone read a blog post. That makes perfect sense.\"\n\nThe author's tone is best described as:",
            "options": ["A. Enthusiastic", "B. Objective", "C. Sarcastic", "D. Melancholy"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "\"Oh sure, let's just ignore decades of scientific research because someone read a blog post. That makes perfect sense.\"\n\n作者的语气最好描述为：",
            "options": ["A. 热情的", "B. 客观的", "C. 讽刺的", "D. 忧郁的"],
            "answer": "C",
        },
        "tags": ["critical_reading", "tone", "sarcasm"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "critical_reading",
        "subtopic": "counterargument", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "In a persuasive essay, which is the BEST way to handle a counterargument?",
            "options": [
                "A. Ignore it completely.",
                "B. Acknowledge it and then refute it with evidence.",
                "C. Insult the people who hold that view.",
                "D. Agree with it and change your thesis.",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在议论文中，处理反面论点的最佳方式是？",
            "options": [
                "A. 完全忽略它。",
                "B. 承认它，然后用证据反驳它。",
                "C. 侮辱持有该观点的人。",
                "D. 同意它并改变你的论点。",
            ],
            "answer": "B",
        },
        "tags": ["critical_reading", "counterargument", "argumentation"],
    },
    # --- argumentation ---
    {
        "subject": "english", "grade_level": "G8", "topic": "argumentation",
        "subtopic": "claim_evidence_reasoning", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Which of the following correctly demonstrates the Claim-Evidence-Reasoning (CER) structure?",
            "options": [
                "A. Claim: Dogs are loyal. Evidence: My dog follows me everywhere. Reasoning: This shows dogs form strong bonds with their owners.",
                "B. Claim: Dogs are loyal. Evidence: Cats are independent. Reasoning: Therefore, dogs are better pets.",
                "C. Claim: Dogs are loyal. Evidence: Dogs have four legs. Reasoning: Four-legged animals are loyal.",
                "D. Claim: Dogs are loyal. Evidence: I like dogs. Reasoning: Because I said so.",
            ],
            "answer": "A",
        },
        "content_zh": {
            "stem": "以下哪项正确展示了 CER（论点-证据-推理）结构？",
            "options": [
                "A. 论点：狗很忠诚。证据：我的狗到处跟着我。推理：这说明狗与主人形成强烈的情感纽带。",
                "B. 论点：狗很忠诚。证据：猫很独立。推理：因此，狗是更好的宠物。",
                "C. 论点：狗很忠诚。证据：狗有四条腿。推理：四条腿的动物都很忠诚。",
                "D. 论点：狗很忠诚。证据：我喜欢狗。推理：因为我说的。",
            ],
            "answer": "A",
        },
        "tags": ["argumentation", "CER", "claim_evidence_reasoning"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "argumentation",
        "subtopic": "source_evaluation", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Which source would be MOST credible for a research paper on climate change?",
            "options": [
                "A. A Wikipedia article",
                "B. A peer-reviewed study published in Nature",
                "C. A social media post from a popular influencer",
                "D. An opinion column in a local newspaper",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "以下哪个来源对于关于气候变化的研究论文最可信？",
            "options": [
                "A. 维基百科文章",
                "B. 发表在《Nature》上的同行评审研究",
                "C. 知名网红的社交媒体帖子",
                "D. 地方报纸的观点专栏",
            ],
            "answer": "B",
        },
        "tags": ["argumentation", "source_evaluation", "credibility"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "argumentation",
        "subtopic": "logical_fallacy", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "\"If we allow students to use phones in class, next they'll want to play video games, and eventually no one will study at all.\"\n\nThis is an example of:",
            "options": ["A. Ad hominem", "B. Red herring", "C. Slippery slope", "D. Straw man"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "\"如果我们允许学生在课堂上使用手机，接下来他们会想玩电子游戏，最终没有人会学习了。\"\n\n这是哪种逻辑谬误？",
            "options": ["A. 人身攻击", "B. 红鲱鱼谬误", "C. 滑坡谬误", "D. 稻草人谬误"],
            "answer": "C",
        },
        "tags": ["argumentation", "slippery_slope", "logical_fallacy"],
    },
    # --- style_analysis ---
    {
        "subject": "english", "grade_level": "G8", "topic": "style_analysis",
        "subtopic": "diction", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Compare these two sentences:\n1. \"The child walked into the room.\"\n2. \"The child crept into the room.\"\n\nHow does the word \"crept\" change the meaning?",
            "options": [
                "A. It suggests the child was running.",
                "B. It suggests the child moved quietly and cautiously.",
                "C. It suggests the child was happy.",
                "D. It has the same meaning as \"walked.\"",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "比较这两个句子：\n1. \"The child walked into the room.\"\n2. \"The child crept into the room.\"\n\n\"crept\" 如何改变了句意？",
            "options": [
                "A. 暗示孩子在跑。",
                "B. 暗示孩子悄悄地、小心翼翼地移动。",
                "C. 暗示孩子很开心。",
                "D. 与 \"walked\" 意思相同。",
            ],
            "answer": "B",
        },
        "tags": ["style_analysis", "diction", "word_choice"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "style_analysis",
        "subtopic": "syntax", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "\"He ran. He hid. He waited.\"\n\nThe author's use of short, simple sentences creates a feeling of:",
            "options": ["A. Relaxation", "B. Humor", "C. Tension and urgency", "D. Confusion"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "\"He ran. He hid. He waited.\"\n\n作者使用简短的句子营造了什么氛围？",
            "options": ["A. 放松", "B. 幽默", "C. 紧张和紧迫感", "D. 困惑"],
            "answer": "C",
        },
        "tags": ["style_analysis", "syntax", "sentence_length"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "style_analysis",
        "subtopic": "imagery", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "\"The golden sun melted into the horizon, painting the clouds in shades of crimson and amber.\"\n\nWhich sense does this imagery primarily appeal to?",
            "options": ["A. Hearing", "B. Taste", "C. Sight", "D. Touch"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "\"The golden sun melted into the horizon, painting the clouds in shades of crimson and amber.\"\n\n这段意象主要诉诸哪种感官？",
            "options": ["A. 听觉", "B. 味觉", "C. 视觉", "D. 触觉"],
            "answer": "C",
        },
        "tags": ["style_analysis", "imagery", "visual"],
    },
    # --- ap_readiness ---
    {
        "subject": "english", "grade_level": "G8", "topic": "ap_readiness",
        "subtopic": "rhetorical_analysis", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "In analyzing a speech, which question is MOST relevant to a rhetorical analysis?",
            "options": [
                "A. When was the speech given?",
                "B. How does the speaker use language to persuade the audience?",
                "C. How many paragraphs does the speech have?",
                "D. What font was the speech printed in?",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在分析一篇演讲时，以下哪个问题与修辞分析最相关？",
            "options": [
                "A. 演讲是什么时候发表的？",
                "B. 演讲者如何运用语言来说服听众？",
                "C. 演讲有多少段落？",
                "D. 演讲稿使用了什么字体？",
            ],
            "answer": "B",
        },
        "tags": ["ap_readiness", "rhetorical_analysis"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "ap_readiness",
        "subtopic": "synthesis", "difficulty": 0.75, "question_type": "mcq",
        "content_en": {
            "stem": "When writing a synthesis essay, you should:",
            "options": [
                "A. Summarize each source in separate paragraphs",
                "B. Integrate multiple sources to support your own argument",
                "C. Only use one source and analyze it in depth",
                "D. Copy the sources' conclusions as your thesis",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "写综合分析文章（synthesis essay）时，你应该：",
            "options": [
                "A. 在各个段落分别总结每个来源",
                "B. 整合多个来源以支持自己的论点",
                "C. 只使用一个来源并深入分析",
                "D. 将来源的结论直接作为你的论点",
            ],
            "answer": "B",
        },
        "tags": ["ap_readiness", "synthesis", "essay"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "ap_readiness",
        "subtopic": "close_reading", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "\"It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.\"\n— Charles Dickens, A Tale of Two Cities\n\nThe author uses which two literary devices in this opening?",
            "options": [
                "A. Simile and metaphor",
                "B. Anaphora and antithesis",
                "C. Onomatopoeia and alliteration",
                "D. Hyperbole and understatement",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.\"\n— 狄更斯《双城记》\n\n作者在这个开头使用了哪两种修辞手法？",
            "options": [
                "A. 明喻和隐喻",
                "B. 首语重复和对比",
                "C. 拟声和头韵",
                "D. 夸张和低调陈述",
            ],
            "answer": "B",
        },
        "tags": ["ap_readiness", "anaphora", "antithesis", "Dickens"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "ap_readiness",
        "subtopic": "literary_criticism", "difficulty": 0.8, "question_type": "mcq",
        "content_en": {
            "stem": "A literary critic examines how a novel reflects the social class struggles of its time period.\n\nThis approach is best described as:",
            "options": [
                "A. Formalist criticism",
                "B. Marxist criticism",
                "C. Psychoanalytic criticism",
                "D. Feminist criticism",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一位文学评论家研究一部小说如何反映其时代的社会阶级斗争。\n\n这种方法最好描述为：",
            "options": [
                "A. 形式主义批评",
                "B. 马克思主义批评",
                "C. 精神分析批评",
                "D. 女性主义批评",
            ],
            "answer": "B",
        },
        "tags": ["ap_readiness", "literary_criticism", "marxist"],
    },
    # --- fill-in ---
    {
        "subject": "english", "grade_level": "G8", "topic": "style_analysis",
        "subtopic": "literary_terms", "difficulty": 0.6, "question_type": "fill_in",
        "content_en": {
            "stem": "A story that takes place in a dystopian future where books are banned is an example of what genre?",
            "answer": "dystopian fiction|dystopia|science fiction|dystopian",
        },
        "content_zh": {
            "stem": "一个故事发生在禁止书籍的反乌托邦未来，这属于什么体裁？",
            "answer": "dystopian fiction|dystopia|science fiction|dystopian|反乌托邦|科幻",
        },
        "tags": ["style_analysis", "genre", "dystopian"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "vocabulary_advanced",
        "subtopic": "sat_vocabulary", "difficulty": 0.65, "question_type": "fill_in",
        "content_en": {
            "stem": "Complete the sentence with a word meaning \"existing everywhere\":\n\"The use of smartphones has become _______ in modern society.\"",
            "answer": "ubiquitous|pervasive|omnipresent",
        },
        "content_zh": {
            "stem": "用一个表示 \"无处不在\" 的词完成句子：\n\"The use of smartphones has become _______ in modern society.\"",
            "answer": "ubiquitous|pervasive|omnipresent",
        },
        "tags": ["vocabulary", "sat_vocabulary", "ubiquitous"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "critical_reading",
        "subtopic": "inference_advanced", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "Read the passage:\n\"The committee met behind closed doors for six hours. When the members finally emerged, none would speak to the press. The chairman's jaw was clenched, and two members left through a side exit.\"\n\nWhat can you infer about the meeting?",
            "options": [
                "A. The meeting was productive and positive.",
                "B. The committee reached a quick agreement.",
                "C. The meeting was tense and likely contentious.",
                "D. The members enjoyed a long lunch.",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "阅读段落：\n\"The committee met behind closed doors for six hours. When the members finally emerged, none would speak to the press. The chairman's jaw was clenched, and two members left through a side exit.\"\n\n你能从会议中推断出什么？",
            "options": [
                "A. 会议富有成效且积极。",
                "B. 委员会很快达成了共识。",
                "C. 会议气氛紧张，可能存在争议。",
                "D. 成员们享用了一顿漫长的午餐。",
            ],
            "answer": "C",
        },
        "tags": ["critical_reading", "inference", "text_evidence"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "argumentation",
        "subtopic": "concession_rebuttal", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "\"While some argue that homework builds discipline, studies consistently show that excessive homework leads to burnout without improving academic outcomes.\"\n\nThis sentence demonstrates:",
            "options": [
                "A. A thesis statement only",
                "B. A concession followed by a rebuttal",
                "C. An emotional appeal",
                "D. A logical fallacy",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"While some argue that homework builds discipline, studies consistently show that excessive homework leads to burnout without improving academic outcomes.\"\n\n这个句子展示了：",
            "options": [
                "A. 仅仅是论点陈述",
                "B. 先让步后反驳",
                "C. 情感诉求",
                "D. 逻辑谬误",
            ],
            "answer": "B",
        },
        "tags": ["argumentation", "concession", "rebuttal"],
    },
    {
        "subject": "english", "grade_level": "G8", "topic": "ap_readiness",
        "subtopic": "annotation", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "When annotating a text for AP English, which strategy is MOST effective?",
            "options": [
                "A. Highlighting every sentence in the text",
                "B. Writing questions, observations, and connections in the margins",
                "C. Underlining only vocabulary words you don't know",
                "D. Copying the text word for word in a notebook",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "为 AP English 做文本标注时，哪种策略最有效？",
            "options": [
                "A. 高亮文本中的每一个句子",
                "B. 在边注中写下问题、观察和联系",
                "C. 只划出你不认识的词汇",
                "D. 在笔记本上逐字抄写文本",
            ],
            "answer": "B",
        },
        "tags": ["ap_readiness", "annotation", "study_skills"],
    },
]

# ---------------------------------------------------------------------------
# All questions combined
# ---------------------------------------------------------------------------

ALL_ENGLISH_QUESTIONS = G5_QUESTIONS + G6_QUESTIONS + G7_QUESTIONS + G8_QUESTIONS


async def seed() -> int:
    """Insert all seed questions into the database. Returns count inserted."""
    await db.init_schema()
    count = await db.bulk_insert_questions(ALL_ENGLISH_QUESTIONS)
    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} English questions (G5-G8)")
        await db.close_pool()

    asyncio.run(main())
