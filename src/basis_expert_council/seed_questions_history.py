"""
BasisPilot — History Seed Questions (G5-G8)
Aligned to BASIS curriculum (US & World History, AP History readiness by G8).

Topics per grade:
  G5: ancient_civilizations, geography, early_us_history, government_basics
  G6: medieval_world, renaissance_reformation, exploration_colonialism, world_religions
  G7: us_revolution, civil_war_reconstruction, westward_expansion, industrialization
  G8: world_wars, cold_war, modern_world, historical_thinking (AP readiness)

Run: python -m src.basis_expert_council.seed_questions_history
"""

import asyncio
import json

from . import db

# ---------------------------------------------------------------------------
# G5 — Ancient & Early History
# ---------------------------------------------------------------------------

G5_QUESTIONS = [
    {
        "subject": "history", "grade_level": "G5", "topic": "ancient_civilizations",
        "subtopic": "mesopotamia", "difficulty": 0.25, "question_type": "mcq",
        "content_en": {
            "stem": "The earliest known civilization developed in Mesopotamia, located between which two rivers?",
            "options": [
                "A. Nile and Congo",
                "B. Tigris and Euphrates",
                "C. Amazon and Mississippi",
                "D. Yangtze and Yellow",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "最早的文明发源于美索不达米亚，位于哪两条河之间？",
            "options": ["A. 尼罗河和刚果河", "B. 底格里斯河和幼发拉底河", "C. 亚马逊河和密西西比河", "D. 长江和黄河"],
            "answer": "B",
        },
        "tags": ["ancient", "mesopotamia", "rivers"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "ancient_civilizations",
        "subtopic": "egypt", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "The ancient Egyptians built pyramids primarily as:",
            "options": ["A. Temples for worship", "B. Tombs for pharaohs", "C. Homes for citizens", "D. Markets for trade"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "古埃及人建造金字塔主要是作为：",
            "options": ["A. 祭祀神庙", "B. 法老的陵墓", "C. 市民的住所", "D. 贸易市场"],
            "answer": "B",
        },
        "tags": ["ancient", "egypt", "pyramids"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "ancient_civilizations",
        "subtopic": "greece", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Ancient Athens is often credited as the birthplace of:",
            "options": ["A. Monarchy", "B. Democracy", "C. Communism", "D. Feudalism"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "古代雅典常被认为是什么的发源地？",
            "options": ["A. 君主制", "B. 民主制", "C. 共产主义", "D. 封建制"],
            "answer": "B",
        },
        "tags": ["ancient", "greece", "democracy"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "ancient_civilizations",
        "subtopic": "rome", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Which was a major contribution of the Roman Empire to Western civilization?",
            "options": [
                "A. The invention of paper",
                "B. A system of laws and road networks",
                "C. The creation of democracy",
                "D. The discovery of gunpowder",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "罗马帝国对西方文明的主要贡献是什么？",
            "options": ["A. 发明纸张", "B. 法律体系和道路网络", "C. 创建民主", "D. 发现火药"],
            "answer": "B",
        },
        "tags": ["ancient", "rome", "law"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "geography",
        "subtopic": "continents", "difficulty": 0.2, "question_type": "mcq",
        "content_en": {
            "stem": "How many continents are there on Earth?",
            "options": ["A. 5", "B. 6", "C. 7", "D. 8"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "地球上有多少个大洲？",
            "options": ["A. 5", "B. 6", "C. 7", "D. 8"],
            "answer": "C",
        },
        "tags": ["geography", "continents", "basic"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "geography",
        "subtopic": "map_skills", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Lines of latitude run:",
            "options": [
                "A. North to south",
                "B. East to west (horizontally)",
                "C. Diagonally",
                "D. In circles around the poles",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "纬线的方向是：",
            "options": ["A. 从北到南", "B. 从东到西（水平方向）", "C. 对角线", "D. 围绕极点的圆圈"],
            "answer": "B",
        },
        "tags": ["geography", "latitude", "map_skills"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "early_us_history",
        "subtopic": "native_americans", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "Before European colonization, Native American groups developed diverse cultures adapted to their:",
            "options": [
                "A. Technology levels",
                "B. Local environments and geography",
                "C. Political systems only",
                "D. European influences",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在欧洲殖民之前，美洲原住民群体发展了多样的文化，适应了他们的：",
            "options": ["A. 技术水平", "B. 当地环境和地理", "C. 仅政治制度", "D. 欧洲影响"],
            "answer": "B",
        },
        "tags": ["us_history", "native_americans", "adaptation"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "early_us_history",
        "subtopic": "thirteen_colonies", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "The original 13 American colonies were established primarily by settlers from:",
            "options": ["A. Spain", "B. France", "C. England", "D. Portugal"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "最初的 13 个美国殖民地主要由哪个国家的定居者建立？",
            "options": ["A. 西班牙", "B. 法国", "C. 英国", "D. 葡萄牙"],
            "answer": "C",
        },
        "tags": ["us_history", "colonies", "England"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "government_basics",
        "subtopic": "branches", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "The three branches of the U.S. government are:",
            "options": [
                "A. Military, Judicial, Executive",
                "B. Executive, Legislative, Judicial",
                "C. Federal, State, Local",
                "D. Democratic, Republican, Independent",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "美国政府的三个分支是：",
            "options": [
                "A. 军事、司法、行政",
                "B. 行政、立法、司法",
                "C. 联邦、州、地方",
                "D. 民主党、共和党、独立",
            ],
            "answer": "B",
        },
        "tags": ["government", "three_branches", "US"],
    },
    # --- fill-in ---
    {
        "subject": "history", "grade_level": "G5", "topic": "ancient_civilizations",
        "subtopic": "china", "difficulty": 0.3, "question_type": "fill_in",
        "content_en": {
            "stem": "The Great Wall of _______ was built to protect against northern invaders.",
            "answer": "China",
        },
        "content_zh": {
            "stem": "_______ 的长城是为了抵御北方入侵者而建造的。",
            "answer": "China|中国",
        },
        "tags": ["ancient", "china", "great_wall"],
    },
    {
        "subject": "history", "grade_level": "G5", "topic": "government_basics",
        "subtopic": "declaration", "difficulty": 0.3, "question_type": "fill_in",
        "content_en": {
            "stem": "The Declaration of Independence was adopted on July 4, _____.",
            "answer": "1776",
        },
        "content_zh": {
            "stem": "《独立宣言》于 _____ 年 7 月 4 日通过。",
            "answer": "1776",
        },
        "tags": ["government", "declaration_of_independence", "date"],
    },
]

# ---------------------------------------------------------------------------
# G6 — Medieval & Early Modern World
# ---------------------------------------------------------------------------

G6_QUESTIONS = [
    {
        "subject": "history", "grade_level": "G6", "topic": "medieval_world",
        "subtopic": "feudalism", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "In the feudal system of medieval Europe, land was granted by lords to:",
            "options": ["A. Slaves", "B. Vassals in exchange for loyalty and military service", "C. Foreign merchants", "D. The church only"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在中世纪欧洲的封建制度中，领主将土地授予：",
            "options": ["A. 奴隶", "B. 封臣以换取忠诚和军事服务", "C. 外国商人", "D. 仅教会"],
            "answer": "B",
        },
        "tags": ["medieval", "feudalism", "social_structure"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "medieval_world",
        "subtopic": "black_death", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "The Black Death (1347-1351) was primarily caused by:",
            "options": [
                "A. A virus spread by mosquitoes",
                "B. Bacteria (Yersinia pestis) spread by fleas on rats",
                "C. Contaminated water supplies",
                "D. Volcanic eruptions",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "黑死病 (1347-1351) 主要由什么引起？",
            "options": [
                "A. 蚊子传播的病毒",
                "B. 老鼠身上跳蚤传播的细菌（鼠疫杆菌）",
                "C. 被污染的水源",
                "D. 火山爆发",
            ],
            "answer": "B",
        },
        "tags": ["medieval", "black_death", "plague"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "renaissance_reformation",
        "subtopic": "renaissance", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "The Renaissance began in which country around the 14th century?",
            "options": ["A. England", "B. France", "C. Italy", "D. Germany"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "文艺复兴大约在 14 世纪始于哪个国家？",
            "options": ["A. 英国", "B. 法国", "C. 意大利", "D. 德国"],
            "answer": "C",
        },
        "tags": ["renaissance", "Italy", "origins"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "renaissance_reformation",
        "subtopic": "reformation", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Martin Luther's 95 Theses (1517) primarily criticized:",
            "options": [
                "A. The feudal system",
                "B. The sale of indulgences by the Catholic Church",
                "C. The English monarchy",
                "D. Scientific discoveries",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "马丁·路德的《九十五条论纲》(1517) 主要批判了：",
            "options": ["A. 封建制度", "B. 天主教会出售赎罪券", "C. 英国君主制", "D. 科学发现"],
            "answer": "B",
        },
        "tags": ["reformation", "martin_luther", "indulgences"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "exploration_colonialism",
        "subtopic": "age_of_exploration", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "What was the primary motivation for European exploration in the 15th-16th centuries?",
            "options": [
                "A. Spreading democracy",
                "B. Finding new trade routes to Asia and acquiring resources",
                "C. Escaping religious persecution",
                "D. Scientific curiosity only",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "15-16 世纪欧洲探险的主要动机是什么？",
            "options": ["A. 传播民主", "B. 寻找通往亚洲的新贸易路线和获取资源", "C. 逃避宗教迫害", "D. 仅出于科学好奇心"],
            "answer": "B",
        },
        "tags": ["exploration", "trade_routes", "motivation"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "exploration_colonialism",
        "subtopic": "columbian_exchange", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "The Columbian Exchange refers to the transfer of plants, animals, and diseases between:",
            "options": [
                "A. Europe and Asia",
                "B. The Americas and Europe/Africa/Asia",
                "C. Africa and Australia",
                "D. China and Japan",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哥伦布大交换指的是什么之间的植物、动物和疾病的传播？",
            "options": ["A. 欧洲和亚洲", "B. 美洲与欧洲/非洲/亚洲", "C. 非洲和澳大利亚", "D. 中国和日本"],
            "answer": "B",
        },
        "tags": ["exploration", "columbian_exchange", "global_trade"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "world_religions",
        "subtopic": "major_religions", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Which religion originated in the Arabian Peninsula in the 7th century CE?",
            "options": ["A. Christianity", "B. Buddhism", "C. Islam", "D. Hinduism"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "哪个宗教起源于 7 世纪的阿拉伯半岛？",
            "options": ["A. 基督教", "B. 佛教", "C. 伊斯兰教", "D. 印度教"],
            "answer": "C",
        },
        "tags": ["world_religions", "islam", "origins"],
    },
    {
        "subject": "history", "grade_level": "G6", "topic": "world_religions",
        "subtopic": "silk_road", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "The Silk Road was important primarily because it:",
            "options": [
                "A. Was a military highway",
                "B. Facilitated trade and cultural exchange between East and West",
                "C. Was used only for transporting silk",
                "D. Connected only China and India",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "丝绸之路之所以重要，主要因为它：",
            "options": [
                "A. 是一条军事公路",
                "B. 促进了东西方之间的贸易和文化交流",
                "C. 仅用于运输丝绸",
                "D. 仅连接中国和印度",
            ],
            "answer": "B",
        },
        "tags": ["world_religions", "silk_road", "trade"],
    },
    # --- fill-in ---
    {
        "subject": "history", "grade_level": "G6", "topic": "renaissance_reformation",
        "subtopic": "printing", "difficulty": 0.4, "question_type": "fill_in",
        "content_en": {
            "stem": "Johannes _______ invented the printing press with movable type around 1440.",
            "answer": "Gutenberg",
        },
        "content_zh": {
            "stem": "约翰内斯·_______ 大约在 1440 年发明了活字印刷术。",
            "answer": "Gutenberg|古腾堡",
        },
        "tags": ["renaissance", "gutenberg", "printing_press"],
    },
]

# ---------------------------------------------------------------------------
# G7 — US History: Revolution through Industrialization
# ---------------------------------------------------------------------------

G7_QUESTIONS = [
    {
        "subject": "history", "grade_level": "G7", "topic": "us_revolution",
        "subtopic": "causes", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "\"No taxation without representation\" was a slogan protesting:",
            "options": [
                "A. French taxes on colonists",
                "B. British taxes imposed on colonists without their consent in Parliament",
                "C. State taxes on federal goods",
                "D. Taxes on Native American trade",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"无代表不纳税\" 是一句抗议什么的口号？",
            "options": [
                "A. 法国对殖民者的税收",
                "B. 英国在殖民者没有议会代表权的情况下征收的税",
                "C. 州对联邦商品的税",
                "D. 对原住民贸易的税",
            ],
            "answer": "B",
        },
        "tags": ["us_revolution", "taxation", "causes"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "us_revolution",
        "subtopic": "constitution", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "The Bill of Rights refers to:",
            "options": [
                "A. The first 10 amendments to the U.S. Constitution",
                "B. The Declaration of Independence",
                "C. The Articles of Confederation",
                "D. The Emancipation Proclamation",
            ],
            "answer": "A",
        },
        "content_zh": {
            "stem": "《权利法案》指的是：",
            "options": [
                "A. 美国宪法的前 10 条修正案",
                "B. 独立宣言",
                "C. 邦联条例",
                "D. 解放奴隶宣言",
            ],
            "answer": "A",
        },
        "tags": ["us_revolution", "bill_of_rights", "constitution"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "us_revolution",
        "subtopic": "checks_balances", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "The system of checks and balances ensures that:",
            "options": [
                "A. The president has supreme power",
                "B. No single branch of government becomes too powerful",
                "C. Only Congress can make laws",
                "D. The judiciary controls the military",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "制衡制度确保了：",
            "options": [
                "A. 总统拥有至高权力",
                "B. 政府任何一个分支都不会变得过于强大",
                "C. 只有国会才能制定法律",
                "D. 司法部门控制军队",
            ],
            "answer": "B",
        },
        "tags": ["us_revolution", "checks_balances", "government"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "civil_war_reconstruction",
        "subtopic": "causes", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "The primary cause of the U.S. Civil War was:",
            "options": [
                "A. Disputes over foreign trade",
                "B. Conflicts over slavery and states' rights",
                "C. Religious differences between North and South",
                "D. Competition for western gold",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "美国内战的主要原因是：",
            "options": [
                "A. 外贸争端",
                "B. 关于奴隶制和州权的冲突",
                "C. 南北方的宗教差异",
                "D. 争夺西部黄金",
            ],
            "answer": "B",
        },
        "tags": ["civil_war", "causes", "slavery"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "civil_war_reconstruction",
        "subtopic": "amendments", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The 13th Amendment to the U.S. Constitution:",
            "options": [
                "A. Gave women the right to vote",
                "B. Abolished slavery",
                "C. Established Prohibition",
                "D. Lowered the voting age to 18",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "美国宪法第十三修正案：",
            "options": ["A. 赋予妇女投票权", "B. 废除了奴隶制", "C. 实施禁酒令", "D. 将投票年龄降至 18 岁"],
            "answer": "B",
        },
        "tags": ["civil_war", "13th_amendment", "abolition"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "westward_expansion",
        "subtopic": "manifest_destiny", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "\"Manifest Destiny\" was the belief that:",
            "options": [
                "A. The U.S. should remain only on the East Coast",
                "B. It was America's destiny to expand westward across the continent",
                "C. European nations should control North America",
                "D. Native Americans should govern the West",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "\"天定命运\" 是一种什么信念？",
            "options": [
                "A. 美国应只留在东海岸",
                "B. 美国注定要向西扩张到整个大陆",
                "C. 欧洲国家应控制北美",
                "D. 原住民应治理西部",
            ],
            "answer": "B",
        },
        "tags": ["westward_expansion", "manifest_destiny", "belief"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "industrialization",
        "subtopic": "industrial_revolution", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "The Industrial Revolution led to major changes including:",
            "options": [
                "A. A shift from factory work to farming",
                "B. Urbanization, factory labor, and technological innovation",
                "C. The end of international trade",
                "D. A decrease in population",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "工业革命带来的重大变化包括：",
            "options": [
                "A. 从工厂劳动转向农业",
                "B. 城市化、工厂劳动和技术创新",
                "C. 国际贸易的终结",
                "D. 人口减少",
            ],
            "answer": "B",
        },
        "tags": ["industrialization", "industrial_revolution", "urbanization"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "industrialization",
        "subtopic": "immigration", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "In the late 1800s, millions of immigrants came to the U.S. primarily seeking:",
            "options": [
                "A. Religious conversion",
                "B. Economic opportunity and escape from hardship",
                "C. Military service",
                "D. Free land in the South",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "19 世纪末，数百万移民来到美国主要是为了：",
            "options": ["A. 宗教皈依", "B. 经济机会和逃离困苦", "C. 服兵役", "D. 南方的免费土地"],
            "answer": "B",
        },
        "tags": ["industrialization", "immigration", "push_pull"],
    },
    # --- fill-in ---
    {
        "subject": "history", "grade_level": "G7", "topic": "civil_war_reconstruction",
        "subtopic": "key_figure", "difficulty": 0.4, "question_type": "fill_in",
        "content_en": {
            "stem": "_______ was the president of the United States during the Civil War.",
            "answer": "Abraham Lincoln|Lincoln",
        },
        "content_zh": {
            "stem": "_______ 是美国内战期间的总统。",
            "answer": "Abraham Lincoln|Lincoln|亚伯拉罕·林肯|林肯",
        },
        "tags": ["civil_war", "lincoln", "president"],
    },
    {
        "subject": "history", "grade_level": "G7", "topic": "us_revolution",
        "subtopic": "key_date", "difficulty": 0.45, "question_type": "fill_in",
        "content_en": {
            "stem": "The U.S. Constitution was ratified in the year _____.",
            "answer": "1788",
        },
        "content_zh": {
            "stem": "美国宪法于 _____ 年批准。",
            "answer": "1788",
        },
        "tags": ["us_revolution", "constitution", "date"],
    },
]

# ---------------------------------------------------------------------------
# G8 — Modern World History (AP Readiness)
# ---------------------------------------------------------------------------

G8_QUESTIONS = [
    {
        "subject": "history", "grade_level": "G8", "topic": "world_wars",
        "subtopic": "wwi_causes", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The MAIN causes of World War I are often summarized as MANIA. The 'A' stands for:",
            "options": ["A. Agriculture", "B. Alliances", "C. Aristocracy", "D. Anarchy"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一战的主要原因常被概括为 MANIA。其中 'A' 代表：",
            "options": ["A. 农业", "B. 联盟", "C. 贵族制", "D. 无政府状态"],
            "answer": "B",
        },
        "tags": ["world_wars", "wwi", "causes", "alliances"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "world_wars",
        "subtopic": "wwii_turning_points", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "D-Day (June 6, 1944) was significant because:",
            "options": [
                "A. Japan surrendered",
                "B. Allied forces invaded Normandy, opening a Western Front against Nazi Germany",
                "C. The atomic bomb was dropped",
                "D. The Soviet Union entered the war",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "D 日（1944 年 6 月 6 日）之所以重要，因为：",
            "options": [
                "A. 日本投降",
                "B. 盟军入侵诺曼底，开辟对抗纳粹德国的西线战场",
                "C. 投下了原子弹",
                "D. 苏联参战",
            ],
            "answer": "B",
        },
        "tags": ["world_wars", "wwii", "d_day", "normandy"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "world_wars",
        "subtopic": "holocaust", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The Holocaust was the systematic genocide of approximately:",
            "options": [
                "A. 1 million people",
                "B. 6 million Jews and millions of others",
                "C. 100,000 people",
                "D. Only political prisoners",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "大屠杀是对大约多少人的系统性种族灭绝？",
            "options": [
                "A. 100 万人",
                "B. 600 万犹太人和数百万其他人",
                "C. 10 万人",
                "D. 仅政治犯",
            ],
            "answer": "B",
        },
        "tags": ["world_wars", "holocaust", "genocide"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "cold_war",
        "subtopic": "overview", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The Cold War was primarily a conflict between:",
            "options": [
                "A. The U.S. and China",
                "B. The U.S. (capitalism) and the Soviet Union (communism)",
                "C. Europe and Asia",
                "D. NATO and the United Nations",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "冷战主要是什么之间的冲突？",
            "options": [
                "A. 美国和中国",
                "B. 美国（资本主义）和苏联（共产主义）",
                "C. 欧洲和亚洲",
                "D. 北约和联合国",
            ],
            "answer": "B",
        },
        "tags": ["cold_war", "US_USSR", "capitalism_communism"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "cold_war",
        "subtopic": "berlin_wall", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The Berlin Wall fell in which year, symbolizing the end of the Cold War?",
            "options": ["A. 1975", "B. 1989", "C. 1991", "D. 2001"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "柏林墙在哪一年倒塌，象征着冷战的结束？",
            "options": ["A. 1975", "B. 1989", "C. 1991", "D. 2001"],
            "answer": "B",
        },
        "tags": ["cold_war", "berlin_wall", "1989"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "modern_world",
        "subtopic": "globalization", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Globalization has led to which of the following?",
            "options": [
                "A. Decreased international trade",
                "B. Increased economic interdependence and cultural exchange",
                "C. Less access to technology",
                "D. Fewer multinational corporations",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "全球化导致了以下哪种情况？",
            "options": [
                "A. 国际贸易减少",
                "B. 经济相互依存和文化交流增加",
                "C. 技术获取减少",
                "D. 跨国公司减少",
            ],
            "answer": "B",
        },
        "tags": ["modern_world", "globalization", "interdependence"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "modern_world",
        "subtopic": "civil_rights", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "The Civil Rights Act of 1964 was significant because it:",
            "options": [
                "A. Gave women the right to vote",
                "B. Outlawed discrimination based on race, color, religion, sex, or national origin",
                "C. Ended the Vietnam War",
                "D. Established Social Security",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "1964 年的《民权法案》之所以重要，因为它：",
            "options": [
                "A. 赋予妇女投票权",
                "B. 禁止基于种族、肤色、宗教、性别或国籍的歧视",
                "C. 结束了越南战争",
                "D. 建立了社会保障制度",
            ],
            "answer": "B",
        },
        "tags": ["modern_world", "civil_rights", "1964"],
    },
    # --- historical_thinking (AP readiness) ---
    {
        "subject": "history", "grade_level": "G8", "topic": "historical_thinking",
        "subtopic": "primary_secondary", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A diary written by a soldier during World War II is an example of a:",
            "options": ["A. Secondary source", "B. Primary source", "C. Tertiary source", "D. Fictional source"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "二战期间一名士兵写的日记是什么的例子？",
            "options": ["A. 二手资料", "B. 一手资料", "C. 三次文献", "D. 虚构作品"],
            "answer": "B",
        },
        "tags": ["historical_thinking", "primary_source", "evidence"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "historical_thinking",
        "subtopic": "causation", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "When analyzing historical causation, historians should consider:",
            "options": [
                "A. Only the most recent event before the outcome",
                "B. Both immediate triggers and long-term underlying causes",
                "C. Only economic factors",
                "D. Only the perspectives of leaders",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在分析历史因果关系时，历史学家应该考虑：",
            "options": [
                "A. 仅仅是结果之前最近的事件",
                "B. 直接导火索和长期根本原因",
                "C. 仅经济因素",
                "D. 仅领导人的观点",
            ],
            "answer": "B",
        },
        "tags": ["historical_thinking", "causation", "analysis"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "historical_thinking",
        "subtopic": "dbq_skills", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "In a Document-Based Question (DBQ) essay, you should:",
            "options": [
                "A. Summarize each document separately",
                "B. Develop a thesis and use documents as evidence to support your argument",
                "C. Only quote the documents without analysis",
                "D. Ignore documents that contradict your thesis",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在材料分析题（DBQ）作文中，你应该：",
            "options": [
                "A. 分别总结每份文件",
                "B. 提出论点并使用文件作为证据支持你的论证",
                "C. 只引用文件而不分析",
                "D. 忽略与你论点矛盾的文件",
            ],
            "answer": "B",
        },
        "tags": ["historical_thinking", "DBQ", "ap_readiness"],
    },
    # --- fill-in ---
    {
        "subject": "history", "grade_level": "G8", "topic": "world_wars",
        "subtopic": "wwii_end", "difficulty": 0.5, "question_type": "fill_in",
        "content_en": {
            "stem": "World War II ended in the year _____.",
            "answer": "1945",
        },
        "content_zh": {
            "stem": "第二次世界大战于 _____ 年结束。",
            "answer": "1945",
        },
        "tags": ["world_wars", "wwii", "date"],
    },
    {
        "subject": "history", "grade_level": "G8", "topic": "cold_war",
        "subtopic": "ussr_collapse", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "The Soviet Union officially dissolved in December _____.",
            "answer": "1991",
        },
        "content_zh": {
            "stem": "苏联于 _____ 年 12 月正式解体。",
            "answer": "1991",
        },
        "tags": ["cold_war", "soviet_union", "dissolution"],
    },
]

# ---------------------------------------------------------------------------
ALL_HISTORY_QUESTIONS = G5_QUESTIONS + G6_QUESTIONS + G7_QUESTIONS + G8_QUESTIONS


async def seed() -> int:
    await db.init_schema()
    count = await db.bulk_insert_questions(ALL_HISTORY_QUESTIONS)
    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} history questions (G5-G8)")
        await db.close_pool()

    asyncio.run(main())
