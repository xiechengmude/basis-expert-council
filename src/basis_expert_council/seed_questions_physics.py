"""
BasisPilot — Physics Seed Questions (G5-G8)
Aligned to BASIS curriculum (advanced science track, AP Physics readiness by G8).

Topics per grade:
  G5: forces_motion, energy, simple_machines, properties_of_matter
  G6: newtons_laws, waves_sound, light_optics, heat_temperature
  G7: electricity, magnetism, work_power, thermodynamics
  G8: kinematics, momentum, circuits, modern_physics (AP readiness)

Run: python -m src.basis_expert_council.seed_questions_physics
"""

import asyncio
import json

from . import db

# ---------------------------------------------------------------------------
# G5 — Foundations of Physical Science
# ---------------------------------------------------------------------------

G5_QUESTIONS = [
    {
        "subject": "physics", "grade_level": "G5", "topic": "forces_motion",
        "subtopic": "gravity", "difficulty": 0.25, "question_type": "mcq",
        "content_en": {
            "stem": "What force pulls objects toward the center of the Earth?",
            "options": ["A. Magnetism", "B. Friction", "C. Gravity", "D. Tension"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "什么力将物体拉向地球中心？",
            "options": ["A. 磁力", "B. 摩擦力", "C. 重力", "D. 张力"],
            "answer": "C",
        },
        "tags": ["forces", "gravity", "fundamentals"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "forces_motion",
        "subtopic": "friction", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "A hockey puck slides farther on ice than on carpet. This is because:",
            "options": [
                "A. Ice has more gravity",
                "B. Carpet has less friction",
                "C. Ice has less friction than carpet",
                "D. The puck is heavier on carpet",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "冰球在冰面上比在地毯上滑得更远，因为：",
            "options": [
                "A. 冰面有更多重力",
                "B. 地毯摩擦力更小",
                "C. 冰面比地毯摩擦力更小",
                "D. 冰球在地毯上更重",
            ],
            "answer": "C",
        },
        "tags": ["forces", "friction", "surfaces"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "forces_motion",
        "subtopic": "balanced_forces", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Two teams are pulling a rope with equal force in opposite directions. The rope does not move. This is an example of:",
            "options": ["A. Unbalanced forces", "B. Balanced forces", "C. Gravity", "D. Acceleration"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "两队人用相等的力向相反方向拉绳子，绳子不动。这是什么的例子？",
            "options": ["A. 非平衡力", "B. 平衡力", "C. 重力", "D. 加速度"],
            "answer": "B",
        },
        "tags": ["forces", "balanced_forces", "tug_of_war"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "forces_motion",
        "subtopic": "speed", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "A car travels 120 km in 2 hours. What is its average speed?",
            "options": ["A. 240 km/h", "B. 60 km/h", "C. 120 km/h", "D. 30 km/h"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一辆车 2 小时行驶了 120 公里。它的平均速度是多少？",
            "options": ["A. 240 km/h", "B. 60 km/h", "C. 120 km/h", "D. 30 km/h"],
            "answer": "B",
        },
        "tags": ["forces_motion", "speed", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "energy",
        "subtopic": "forms_of_energy", "difficulty": 0.25, "question_type": "mcq",
        "content_en": {
            "stem": "A ball sitting at the top of a hill has what type of energy?",
            "options": ["A. Kinetic energy", "B. Potential energy", "C. Thermal energy", "D. Chemical energy"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个球放在山顶上，它具有什么类型的能量？",
            "options": ["A. 动能", "B. 势能", "C. 热能", "D. 化学能"],
            "answer": "B",
        },
        "tags": ["energy", "potential_energy", "gravitational"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "energy",
        "subtopic": "energy_transformation", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "When you turn on a flashlight, what energy transformation occurs?",
            "options": [
                "A. Light → Chemical",
                "B. Chemical → Electrical → Light",
                "C. Kinetic → Light",
                "D. Thermal → Chemical",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "打开手电筒时发生了什么能量转化？",
            "options": [
                "A. 光能 → 化学能",
                "B. 化学能 → 电能 → 光能",
                "C. 动能 → 光能",
                "D. 热能 → 化学能",
            ],
            "answer": "B",
        },
        "tags": ["energy", "transformation", "battery"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "energy",
        "subtopic": "conservation", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "According to the law of conservation of energy, energy can be:",
            "options": [
                "A. Created but not destroyed",
                "B. Destroyed but not created",
                "C. Neither created nor destroyed, only transformed",
                "D. Both created and destroyed",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "根据能量守恒定律，能量可以：",
            "options": [
                "A. 被创造但不能被消灭",
                "B. 被消灭但不能被创造",
                "C. 既不能被创造也不能被消灭，只能转化",
                "D. 既能被创造也能被消灭",
            ],
            "answer": "C",
        },
        "tags": ["energy", "conservation", "law"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "simple_machines",
        "subtopic": "lever", "difficulty": 0.3, "question_type": "mcq",
        "content_en": {
            "stem": "A seesaw is an example of which simple machine?",
            "options": ["A. Pulley", "B. Lever", "C. Wheel and axle", "D. Inclined plane"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "跷跷板是哪种简单机械的例子？",
            "options": ["A. 滑轮", "B. 杠杆", "C. 轮轴", "D. 斜面"],
            "answer": "B",
        },
        "tags": ["simple_machines", "lever"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "simple_machines",
        "subtopic": "inclined_plane", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Using a ramp to load a heavy box onto a truck reduces the amount of:",
            "options": ["A. Work done", "B. Force needed", "C. Distance traveled", "D. Weight of the box"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "用斜坡将重箱子装上卡车，可以减少所需的：",
            "options": ["A. 做的功", "B. 所需的力", "C. 移动的距离", "D. 箱子的重量"],
            "answer": "B",
        },
        "tags": ["simple_machines", "inclined_plane", "mechanical_advantage"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "properties_of_matter",
        "subtopic": "density", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "A wooden block floats in water while an iron block sinks. This is because:",
            "options": [
                "A. Wood is bigger than iron",
                "B. Wood is less dense than water; iron is more dense",
                "C. Iron is lighter than wood",
                "D. Water pushes iron down",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "木块在水中浮起而铁块下沉，因为：",
            "options": [
                "A. 木块比铁块大",
                "B. 木块密度小于水，铁块密度大于水",
                "C. 铁比木头轻",
                "D. 水把铁推下去",
            ],
            "answer": "B",
        },
        "tags": ["matter", "density", "buoyancy"],
    },
    # --- fill-in ---
    {
        "subject": "physics", "grade_level": "G5", "topic": "forces_motion",
        "subtopic": "speed_calculation", "difficulty": 0.35, "question_type": "fill_in",
        "content_en": {
            "stem": "Speed = Distance ÷ Time. If a runner covers 100 meters in 10 seconds, the speed is ____ m/s.",
            "answer": "10",
        },
        "content_zh": {
            "stem": "速度 = 距离 ÷ 时间。如果跑步者 10 秒跑了 100 米，速度是 ____ m/s。",
            "answer": "10",
        },
        "tags": ["forces_motion", "speed", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G5", "topic": "energy",
        "subtopic": "kinetic_potential", "difficulty": 0.3, "question_type": "fill_in",
        "content_en": {
            "stem": "A moving bicycle has _______ energy.",
            "answer": "kinetic",
        },
        "content_zh": {
            "stem": "一辆行驶中的自行车具有_______能。",
            "answer": "kinetic|动",
        },
        "tags": ["energy", "kinetic_energy"],
    },
]

# ---------------------------------------------------------------------------
# G6 — Newton's Laws, Waves & Light
# ---------------------------------------------------------------------------

G6_QUESTIONS = [
    {
        "subject": "physics", "grade_level": "G6", "topic": "newtons_laws",
        "subtopic": "first_law", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "Newton's First Law states that an object at rest will stay at rest unless acted upon by:",
            "options": [
                "A. Gravity only",
                "B. An unbalanced force",
                "C. A balanced force",
                "D. Friction only",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "牛顿第一定律指出，静止的物体将保持静止，除非受到：",
            "options": ["A. 仅重力", "B. 非平衡力", "C. 平衡力", "D. 仅摩擦力"],
            "answer": "B",
        },
        "tags": ["newtons_laws", "inertia", "first_law"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "newtons_laws",
        "subtopic": "second_law", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "According to F = ma, if you double the force applied to an object (mass stays the same), the acceleration will:",
            "options": ["A. Stay the same", "B. Double", "C. Be cut in half", "D. Quadruple"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "根据 F = ma，如果将施加在物体上的力加倍（质量不变），加速度将：",
            "options": ["A. 不变", "B. 加倍", "C. 减半", "D. 变为四倍"],
            "answer": "B",
        },
        "tags": ["newtons_laws", "second_law", "F_equals_ma"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "newtons_laws",
        "subtopic": "third_law", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "When you push against a wall, the wall pushes back with equal force. This is an example of:",
            "options": [
                "A. Newton's First Law",
                "B. Newton's Second Law",
                "C. Newton's Third Law",
                "D. The law of gravity",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "当你推墙时，墙以相等的力推回来。这是什么的例子？",
            "options": ["A. 牛顿第一定律", "B. 牛顿第二定律", "C. 牛顿第三定律", "D. 万有引力定律"],
            "answer": "C",
        },
        "tags": ["newtons_laws", "third_law", "action_reaction"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "newtons_laws",
        "subtopic": "mass_vs_weight", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "An astronaut has a mass of 70 kg on Earth. On the Moon, their mass is:",
            "options": ["A. 0 kg", "B. 70 kg", "C. 11.5 kg", "D. 420 kg"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个宇航员在地球上质量为 70 kg。在月球上，他的质量是：",
            "options": ["A. 0 kg", "B. 70 kg", "C. 11.5 kg", "D. 420 kg"],
            "answer": "B",
        },
        "tags": ["newtons_laws", "mass", "weight", "gravity"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "waves_sound",
        "subtopic": "wave_properties", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "The distance from one wave crest to the next is called the:",
            "options": ["A. Amplitude", "B. Frequency", "C. Wavelength", "D. Period"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "从一个波峰到下一个波峰的距离叫做：",
            "options": ["A. 振幅", "B. 频率", "C. 波长", "D. 周期"],
            "answer": "C",
        },
        "tags": ["waves", "wavelength", "properties"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "waves_sound",
        "subtopic": "sound_medium", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "Sound travels fastest through:",
            "options": ["A. Air", "B. Water", "C. Steel", "D. A vacuum"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "声音在以下哪种介质中传播最快？",
            "options": ["A. 空气", "B. 水", "C. 钢铁", "D. 真空"],
            "answer": "C",
        },
        "tags": ["waves", "sound", "medium"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "waves_sound",
        "subtopic": "frequency_pitch", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "A higher frequency sound wave produces a:",
            "options": ["A. Louder sound", "B. Softer sound", "C. Higher pitch", "D. Lower pitch"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "频率更高的声波产生：",
            "options": ["A. 更响的声音", "B. 更轻的声音", "C. 更高的音调", "D. 更低的音调"],
            "answer": "C",
        },
        "tags": ["waves", "sound", "frequency", "pitch"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "light_optics",
        "subtopic": "reflection", "difficulty": 0.35, "question_type": "mcq",
        "content_en": {
            "stem": "When light bounces off a mirror, this is called:",
            "options": ["A. Refraction", "B. Reflection", "C. Diffraction", "D. Absorption"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "光从镜面弹回来，这叫做：",
            "options": ["A. 折射", "B. 反射", "C. 衍射", "D. 吸收"],
            "answer": "B",
        },
        "tags": ["light", "reflection", "mirror"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "light_optics",
        "subtopic": "refraction", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "A straw in a glass of water appears bent at the surface. This happens because of:",
            "options": ["A. Reflection", "B. Refraction", "C. Absorption", "D. Diffraction"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "水杯中的吸管在水面处看起来弯曲了，这是因为：",
            "options": ["A. 反射", "B. 折射", "C. 吸收", "D. 衍射"],
            "answer": "B",
        },
        "tags": ["light", "refraction", "optics"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "light_optics",
        "subtopic": "electromagnetic_spectrum", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Which type of electromagnetic wave has the most energy?",
            "options": ["A. Radio waves", "B. Microwaves", "C. Visible light", "D. Gamma rays"],
            "answer": "D",
        },
        "content_zh": {
            "stem": "哪种电磁波能量最高？",
            "options": ["A. 无线电波", "B. 微波", "C. 可见光", "D. 伽马射线"],
            "answer": "D",
        },
        "tags": ["light", "electromagnetic_spectrum", "energy"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "heat_temperature",
        "subtopic": "conduction", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "A metal spoon in hot soup gets warm because of:",
            "options": ["A. Convection", "B. Radiation", "C. Conduction", "D. Evaporation"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "放在热汤里的金属勺子变热是因为：",
            "options": ["A. 对流", "B. 辐射", "C. 传导", "D. 蒸发"],
            "answer": "C",
        },
        "tags": ["heat", "conduction", "thermal_transfer"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "heat_temperature",
        "subtopic": "heat_transfer", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Heat from the Sun reaches Earth primarily through:",
            "options": ["A. Conduction", "B. Convection", "C. Radiation", "D. Evaporation"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "太阳的热量主要通过什么方式到达地球？",
            "options": ["A. 传导", "B. 对流", "C. 辐射", "D. 蒸发"],
            "answer": "C",
        },
        "tags": ["heat", "radiation", "sun"],
    },
    # --- fill-in ---
    {
        "subject": "physics", "grade_level": "G6", "topic": "newtons_laws",
        "subtopic": "F_equals_ma", "difficulty": 0.5, "question_type": "fill_in",
        "content_en": {
            "stem": "F = ma. A 5 kg object accelerates at 3 m/s². The force is ____ N.",
            "answer": "15",
        },
        "content_zh": {
            "stem": "F = ma。一个 5 kg 的物体以 3 m/s² 加速，力为 ____ N。",
            "answer": "15",
        },
        "tags": ["newtons_laws", "second_law", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G6", "topic": "waves_sound",
        "subtopic": "wave_equation", "difficulty": 0.5, "question_type": "fill_in",
        "content_en": {
            "stem": "Wave speed = frequency × wavelength. A wave with frequency 10 Hz and wavelength 2 m has speed ____ m/s.",
            "answer": "20",
        },
        "content_zh": {
            "stem": "波速 = 频率 × 波长。频率 10 Hz、波长 2 m 的波速度为 ____ m/s。",
            "answer": "20",
        },
        "tags": ["waves", "wave_equation", "calculation"],
    },
]

# ---------------------------------------------------------------------------
# G7 — Electricity, Magnetism & Thermodynamics
# ---------------------------------------------------------------------------

G7_QUESTIONS = [
    {
        "subject": "physics", "grade_level": "G7", "topic": "electricity",
        "subtopic": "current_voltage", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "According to Ohm's Law (V = IR), if the voltage is 12V and the resistance is 4Ω, the current is:",
            "options": ["A. 48 A", "B. 3 A", "C. 16 A", "D. 0.33 A"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "根据欧姆定律 V = IR，如果电压为 12V，电阻为 4Ω，电流为：",
            "options": ["A. 48 A", "B. 3 A", "C. 16 A", "D. 0.33 A"],
            "answer": "B",
        },
        "tags": ["electricity", "ohms_law", "current"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "electricity",
        "subtopic": "series_parallel", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "In a series circuit with three light bulbs, if one bulb burns out:",
            "options": [
                "A. The other two stay on",
                "B. All bulbs go out",
                "C. The other two get brighter",
                "D. Nothing changes",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在一个串联电路中有三个灯泡，如果一个灯泡烧了：",
            "options": ["A. 其他两个继续亮", "B. 所有灯泡都灭了", "C. 其他两个变得更亮", "D. 没有变化"],
            "answer": "B",
        },
        "tags": ["electricity", "series_circuit", "circuit"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "electricity",
        "subtopic": "static_electricity", "difficulty": 0.4, "question_type": "mcq",
        "content_en": {
            "stem": "When you rub a balloon on your hair, electrons transfer from your hair to the balloon. The balloon becomes:",
            "options": ["A. Positively charged", "B. Negatively charged", "C. Neutral", "D. Magnetic"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "用气球摩擦头发时，电子从头发转移到气球上。气球变成：",
            "options": ["A. 带正电", "B. 带负电", "C. 中性", "D. 有磁性"],
            "answer": "B",
        },
        "tags": ["electricity", "static", "charge_transfer"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "electricity",
        "subtopic": "power", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Electrical power (P) is calculated as P = V × I. A device using 120V and 2A consumes:",
            "options": ["A. 60 W", "B. 240 W", "C. 122 W", "D. 0.017 W"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "电功率 P = V × I。一个使用 120V 和 2A 的设备消耗：",
            "options": ["A. 60 W", "B. 240 W", "C. 122 W", "D. 0.017 W"],
            "answer": "B",
        },
        "tags": ["electricity", "power", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "magnetism",
        "subtopic": "magnetic_fields", "difficulty": 0.45, "question_type": "mcq",
        "content_en": {
            "stem": "Magnetic field lines around a bar magnet go from:",
            "options": [
                "A. South pole to north pole outside the magnet",
                "B. North pole to south pole outside the magnet",
                "C. East to west",
                "D. They don't have a direction",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "条形磁铁周围的磁力线在磁铁外部从：",
            "options": ["A. 南极到北极", "B. 北极到南极", "C. 东到西", "D. 没有方向"],
            "answer": "B",
        },
        "tags": ["magnetism", "magnetic_field", "poles"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "magnetism",
        "subtopic": "electromagnet", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "How can you make an electromagnet stronger?",
            "options": [
                "A. Use fewer coils of wire",
                "B. Decrease the current",
                "C. Increase the number of coils and the current",
                "D. Remove the iron core",
            ],
            "answer": "C",
        },
        "content_zh": {
            "stem": "如何使电磁铁更强？",
            "options": ["A. 减少线圈数", "B. 减小电流", "C. 增加线圈数和电流", "D. 去掉铁芯"],
            "answer": "C",
        },
        "tags": ["magnetism", "electromagnet"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "work_power",
        "subtopic": "work_formula", "difficulty": 0.5, "question_type": "mcq",
        "content_en": {
            "stem": "Work = Force × Distance. If you push a box with 50 N of force over 3 m, the work done is:",
            "options": ["A. 150 J", "B. 53 J", "C. 16.7 J", "D. 15 J"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "功 = 力 × 距离。如果你用 50 N 的力推箱子移动 3 m，做的功是：",
            "options": ["A. 150 J", "B. 53 J", "C. 16.7 J", "D. 15 J"],
            "answer": "A",
        },
        "tags": ["work", "force", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "work_power",
        "subtopic": "efficiency", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A machine does 200 J of useful work but requires 250 J of input energy. Its efficiency is:",
            "options": ["A. 125%", "B. 80%", "C. 50%", "D. 45%"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一台机器做了 200 J 的有用功，但需要 250 J 的输入能量。它的效率是：",
            "options": ["A. 125%", "B. 80%", "C. 50%", "D. 45%"],
            "answer": "B",
        },
        "tags": ["work_power", "efficiency", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "thermodynamics",
        "subtopic": "specific_heat", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Water has a high specific heat capacity. This means:",
            "options": [
                "A. Water heats up and cools down quickly",
                "B. Water heats up and cools down slowly",
                "C. Water cannot absorb heat",
                "D. Water is always at the same temperature",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "水有很高的比热容。这意味着：",
            "options": [
                "A. 水升温和降温都很快",
                "B. 水升温和降温都很慢",
                "C. 水不能吸收热量",
                "D. 水温度始终不变",
            ],
            "answer": "B",
        },
        "tags": ["thermodynamics", "specific_heat", "water"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "thermodynamics",
        "subtopic": "laws", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "The Second Law of Thermodynamics states that heat naturally flows from:",
            "options": [
                "A. Cold objects to hot objects",
                "B. Hot objects to cold objects",
                "C. In any direction equally",
                "D. Only through conductors",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "热力学第二定律指出，热量自然从：",
            "options": ["A. 冷物体流向热物体", "B. 热物体流向冷物体", "C. 任何方向均匀流动", "D. 仅通过导体流动"],
            "answer": "B",
        },
        "tags": ["thermodynamics", "second_law", "heat_flow"],
    },
    # --- fill-in ---
    {
        "subject": "physics", "grade_level": "G7", "topic": "electricity",
        "subtopic": "ohms_law", "difficulty": 0.5, "question_type": "fill_in",
        "content_en": {
            "stem": "V = IR. If I = 5A and R = 6Ω, then V = ____ V.",
            "answer": "30",
        },
        "content_zh": {
            "stem": "V = IR。若 I = 5A，R = 6Ω，则 V = ____ V。",
            "answer": "30",
        },
        "tags": ["electricity", "ohms_law", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G7", "topic": "work_power",
        "subtopic": "power_calculation", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "Power = Work ÷ Time. If 600 J of work is done in 30 seconds, the power is ____ W.",
            "answer": "20",
        },
        "content_zh": {
            "stem": "功率 = 功 ÷ 时间。如果 30 秒内做了 600 J 的功，功率为 ____ W。",
            "answer": "20",
        },
        "tags": ["work_power", "power", "calculation"],
    },
]

# ---------------------------------------------------------------------------
# G8 — AP Physics Readiness
# ---------------------------------------------------------------------------

G8_QUESTIONS = [
    {
        "subject": "physics", "grade_level": "G8", "topic": "kinematics",
        "subtopic": "displacement", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "A car starts from rest and accelerates at 2 m/s² for 5 seconds. Its final velocity is:",
            "options": ["A. 2.5 m/s", "B. 7 m/s", "C. 10 m/s", "D. 25 m/s"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "一辆车从静止开始以 2 m/s² 加速 5 秒，其最终速度为：",
            "options": ["A. 2.5 m/s", "B. 7 m/s", "C. 10 m/s", "D. 25 m/s"],
            "answer": "C",
        },
        "tags": ["kinematics", "acceleration", "velocity"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "kinematics",
        "subtopic": "free_fall", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "Ignoring air resistance, a ball dropped from a building falls with an acceleration of approximately:",
            "options": ["A. 9.8 m/s", "B. 9.8 m/s²", "C. 9.8 km/h", "D. 0 m/s²"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "忽略空气阻力，从楼上落下的球以大约多少的加速度下落？",
            "options": ["A. 9.8 m/s", "B. 9.8 m/s²", "C. 9.8 km/h", "D. 0 m/s²"],
            "answer": "B",
        },
        "tags": ["kinematics", "free_fall", "gravity"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "kinematics",
        "subtopic": "projectile", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "A ball is thrown horizontally from a cliff. Which statement is correct?",
            "options": [
                "A. Horizontal and vertical velocities both increase",
                "B. Horizontal velocity stays constant; vertical velocity increases",
                "C. Both velocities stay constant",
                "D. Horizontal velocity increases; vertical stays constant",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个球从悬崖水平抛出。以下哪个说法正确？",
            "options": [
                "A. 水平和垂直速度都增大",
                "B. 水平速度不变，垂直速度增大",
                "C. 两个速度都不变",
                "D. 水平速度增大，垂直速度不变",
            ],
            "answer": "B",
        },
        "tags": ["kinematics", "projectile_motion"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "momentum",
        "subtopic": "conservation", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "A 2 kg ball moving at 3 m/s collides with a stationary 1 kg ball. If they stick together, their combined velocity is:",
            "options": ["A. 3 m/s", "B. 2 m/s", "C. 1.5 m/s", "D. 6 m/s"],
            "answer": "B",
        },
        "content_zh": {
            "stem": "一个 2 kg 的球以 3 m/s 撞击一个静止的 1 kg 的球。如果它们粘在一起，合并后的速度是：",
            "options": ["A. 3 m/s", "B. 2 m/s", "C. 1.5 m/s", "D. 6 m/s"],
            "answer": "B",
        },
        "tags": ["momentum", "conservation", "collision"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "momentum",
        "subtopic": "impulse", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Which scenario involves the greatest change in momentum (impulse)?",
            "options": [
                "A. A 1 kg ball going from 0 to 5 m/s",
                "B. A 2 kg ball going from 0 to 5 m/s",
                "C. A 1 kg ball going from 5 to 10 m/s",
                "D. A 0.5 kg ball going from 0 to 10 m/s",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "哪种情况动量变化（冲量）最大？",
            "options": [
                "A. 1 kg 球从 0 加速到 5 m/s",
                "B. 2 kg 球从 0 加速到 5 m/s",
                "C. 1 kg 球从 5 加速到 10 m/s",
                "D. 0.5 kg 球从 0 加速到 10 m/s",
            ],
            "answer": "B",
        },
        "tags": ["momentum", "impulse", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "circuits",
        "subtopic": "parallel_resistance", "difficulty": 0.65, "question_type": "mcq",
        "content_en": {
            "stem": "Two 6Ω resistors are connected in parallel. The total resistance is:",
            "options": ["A. 12 Ω", "B. 6 Ω", "C. 3 Ω", "D. 0.33 Ω"],
            "answer": "C",
        },
        "content_zh": {
            "stem": "两个 6Ω 电阻并联连接，总电阻为：",
            "options": ["A. 12 Ω", "B. 6 Ω", "C. 3 Ω", "D. 0.33 Ω"],
            "answer": "C",
        },
        "tags": ["circuits", "parallel", "resistance"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "circuits",
        "subtopic": "series_resistance", "difficulty": 0.55, "question_type": "mcq",
        "content_en": {
            "stem": "Three resistors of 2Ω, 3Ω, and 5Ω are connected in series. The total resistance is:",
            "options": ["A. 10 Ω", "B. 0.97 Ω", "C. 3.33 Ω", "D. 30 Ω"],
            "answer": "A",
        },
        "content_zh": {
            "stem": "三个电阻 2Ω、3Ω 和 5Ω 串联连接，总电阻为：",
            "options": ["A. 10 Ω", "B. 0.97 Ω", "C. 3.33 Ω", "D. 30 Ω"],
            "answer": "A",
        },
        "tags": ["circuits", "series", "resistance"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "modern_physics",
        "subtopic": "atomic_model", "difficulty": 0.6, "question_type": "mcq",
        "content_en": {
            "stem": "In Bohr's model of the atom, electrons:",
            "options": [
                "A. Are embedded in a positive 'pudding'",
                "B. Orbit the nucleus in fixed energy levels",
                "C. Move randomly inside the nucleus",
                "D. Do not exist",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "在玻尔原子模型中，电子：",
            "options": [
                "A. 嵌在正的'布丁'中",
                "B. 在固定能级上围绕原子核运动",
                "C. 在原子核内随机运动",
                "D. 不存在",
            ],
            "answer": "B",
        },
        "tags": ["modern_physics", "atomic_model", "Bohr"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "modern_physics",
        "subtopic": "nuclear", "difficulty": 0.7, "question_type": "mcq",
        "content_en": {
            "stem": "Nuclear fission is the process of:",
            "options": [
                "A. Combining small nuclei into larger ones",
                "B. Splitting a large nucleus into smaller ones",
                "C. Electrons leaving an atom",
                "D. Protons converting to neutrons",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "核裂变是什么过程？",
            "options": [
                "A. 将小原子核合并成大的",
                "B. 将大原子核分裂成小的",
                "C. 电子离开原子",
                "D. 质子转化为中子",
            ],
            "answer": "B",
        },
        "tags": ["modern_physics", "nuclear_fission"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "modern_physics",
        "subtopic": "E_equals_mc2", "difficulty": 0.75, "question_type": "mcq",
        "content_en": {
            "stem": "Einstein's equation E = mc² demonstrates that:",
            "options": [
                "A. Energy and mass are unrelated",
                "B. A small amount of mass can be converted into a large amount of energy",
                "C. Energy cannot be created from mass",
                "D. The speed of light is variable",
            ],
            "answer": "B",
        },
        "content_zh": {
            "stem": "爱因斯坦的方程 E = mc² 说明：",
            "options": [
                "A. 能量和质量无关",
                "B. 少量质量可以转化为大量能量",
                "C. 能量不能从质量中产生",
                "D. 光速是可变的",
            ],
            "answer": "B",
        },
        "tags": ["modern_physics", "relativity", "mass_energy"],
    },
    # --- fill-in ---
    {
        "subject": "physics", "grade_level": "G8", "topic": "kinematics",
        "subtopic": "displacement_calc", "difficulty": 0.6, "question_type": "fill_in",
        "content_en": {
            "stem": "d = v₀t + ½at². If v₀ = 0, a = 10 m/s², t = 3 s, then d = ____ m.",
            "answer": "45",
        },
        "content_zh": {
            "stem": "d = v₀t + ½at²。若 v₀ = 0，a = 10 m/s²，t = 3 s，则 d = ____ m。",
            "answer": "45",
        },
        "tags": ["kinematics", "displacement", "calculation"],
    },
    {
        "subject": "physics", "grade_level": "G8", "topic": "momentum",
        "subtopic": "momentum_calc", "difficulty": 0.55, "question_type": "fill_in",
        "content_en": {
            "stem": "Momentum p = mv. A 4 kg object moving at 5 m/s has momentum = ____ kg·m/s.",
            "answer": "20",
        },
        "content_zh": {
            "stem": "动量 p = mv。一个 4 kg 的物体以 5 m/s 运动，动量 = ____ kg·m/s。",
            "answer": "20",
        },
        "tags": ["momentum", "calculation"],
    },
]

# ---------------------------------------------------------------------------
ALL_PHYSICS_QUESTIONS = G5_QUESTIONS + G6_QUESTIONS + G7_QUESTIONS + G8_QUESTIONS


async def seed() -> int:
    """Insert all seed questions into the database. Returns count inserted."""
    await db.init_schema()
    count = await db.bulk_insert_questions(ALL_PHYSICS_QUESTIONS)
    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} physics questions (G5-G8)")
        await db.close_pool()

    asyncio.run(main())
