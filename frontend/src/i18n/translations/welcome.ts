import type { Locale } from "../types";

const welcome: Record<string, Record<Locale, string>> = {
  "welcome.title": {
    "zh-CN": "BasisPilot · 贝领",
    en: "BasisPilot",
    "zh-TW": "BasisPilot · 貝領",
  },
  "welcome.subtitle": {
    "zh-CN": "Your AI Co-Pilot Through BASIS — 学科辅导、选课规划、升学策略",
    en: "Your AI Co-Pilot Through BASIS — Tutoring, Course Planning, College Strategy",
    "zh-TW": "Your AI Co-Pilot Through BASIS — 學科輔導、選課規劃、升學策略",
  },
  "welcome.role.parent": {
    "zh-CN": "家长",
    en: "Parents",
    "zh-TW": "家長",
  },
  "welcome.role.student": {
    "zh-CN": "学生",
    en: "Students",
    "zh-TW": "學生",
  },
  "welcome.role.teacher": {
    "zh-CN": "教师",
    en: "Teachers",
    "zh-TW": "教師",
  },
  // Parent scenarios
  "welcome.parent.admissionPrep.title": {
    "zh-CN": "入学备考",
    en: "Admission Prep",
    "zh-TW": "入學備考",
  },
  "welcome.parent.admissionPrep.desc": {
    "zh-CN": "制定 BASIS 入学准备方案，评估孩子当前水平",
    en: "Create a BASIS admission plan, assess your child's current level",
    "zh-TW": "制定 BASIS 入學準備方案，評估孩子當前水平",
  },
  "welcome.parent.admissionPrep.prompt": {
    "zh-CN": "我的孩子准备申请 BASIS，请帮我制定入学准备方案，包括需要达到的学术水平、英语能力要求、以及备考时间规划。",
    en: "My child is preparing to apply to BASIS. Please help me create an admission preparation plan, including the required academic level, English proficiency requirements, and a study timeline.",
    "zh-TW": "我的孩子準備申請 BASIS，請幫我制定入學準備方案，包括需要達到的學術水平、英語能力要求、以及備考時間規劃。",
  },
  "welcome.parent.gradeDiagnosis.title": {
    "zh-CN": "成绩诊断",
    en: "Grade Diagnosis",
    "zh-TW": "成績診斷",
  },
  "welcome.parent.gradeDiagnosis.desc": {
    "zh-CN": "评估学术水平，找出薄弱环节和提升方向",
    en: "Assess academic level, identify weaknesses and improvement areas",
    "zh-TW": "評估學術水平，找出薄弱環節和提升方向",
  },
  "welcome.parent.gradeDiagnosis.prompt": {
    "zh-CN": "请帮我评估孩子目前的学术水平，诊断各学科的优势和薄弱环节，并给出针对性的提升建议。",
    en: "Please help me assess my child's current academic level, diagnose strengths and weaknesses across subjects, and provide targeted improvement suggestions.",
    "zh-TW": "請幫我評估孩子目前的學術水平，診斷各學科的優勢和薄弱環節，並給出針對性的提升建議。",
  },
  "welcome.parent.apSelection.title": {
    "zh-CN": "AP 选课",
    en: "AP Course Selection",
    "zh-TW": "AP 選課",
  },
  "welcome.parent.apSelection.desc": {
    "zh-CN": "根据孩子情况推荐最优 AP 选课组合",
    en: "Recommend the best AP course combination for your child",
    "zh-TW": "根據孩子情況推薦最優 AP 選課組合",
  },
  "welcome.parent.apSelection.prompt": {
    "zh-CN": "孩子明年要选 AP 课程了，请根据他的学术兴趣和能力帮我推荐最合适的 AP 选课组合和备考策略。",
    en: "My child needs to select AP courses for next year. Based on their academic interests and abilities, please recommend the best AP course combination and preparation strategy.",
    "zh-TW": "孩子明年要選 AP 課程了，請根據他的學術興趣和能力幫我推薦最合適的 AP 選課組合和備考策略。",
  },
  "welcome.parent.probation.title": {
    "zh-CN": "保级方案",
    en: "Probation Recovery",
    "zh-TW": "保級方案",
  },
  "welcome.parent.probation.desc": {
    "zh-CN": "面临 Academic Probation？紧急制定恢复计划",
    en: "Facing Academic Probation? Create an emergency recovery plan",
    "zh-TW": "面臨 Academic Probation？緊急制定恢復計劃",
  },
  "welcome.parent.probation.prompt": {
    "zh-CN": "孩子成绩下滑，面临 Academic Probation，请帮我评估当前情况并制定紧急恢复计划。",
    en: "My child's grades are declining and they're facing Academic Probation. Please help me assess the situation and create an emergency recovery plan.",
    "zh-TW": "孩子成績下滑，面臨 Academic Probation，請幫我評估當前情況並制定緊急恢復計劃。",
  },
  // Student scenarios
  "welcome.student.math.title": {
    "zh-CN": "数学辅导",
    en: "Math Tutoring",
    "zh-TW": "數學輔導",
  },
  "welcome.student.math.desc": {
    "zh-CN": "Algebra, Calculus, Statistics — any math topic",
    en: "Algebra, Calculus, Statistics — any math topic",
    "zh-TW": "Algebra, Calculus, Statistics — any math topic",
  },
  "welcome.student.math.prompt": {
    "zh-CN": "I need help with math. Can you help me understand the topic I'm struggling with and walk me through some practice problems?",
    en: "I need help with math. Can you help me understand the topic I'm struggling with and walk me through some practice problems?",
    "zh-TW": "I need help with math. Can you help me understand the topic I'm struggling with and walk me through some practice problems?",
  },
  "welcome.student.science.title": {
    "zh-CN": "科学辅导",
    en: "Science Tutoring",
    "zh-TW": "科學輔導",
  },
  "welcome.student.science.desc": {
    "zh-CN": "Physics, Chemistry, Biology — lab reports & concepts",
    en: "Physics, Chemistry, Biology — lab reports & concepts",
    "zh-TW": "Physics, Chemistry, Biology — lab reports & concepts",
  },
  "welcome.student.science.prompt": {
    "zh-CN": "I need help with science. Can you explain the concept I'm studying and help me prepare for my upcoming test?",
    en: "I need help with science. Can you explain the concept I'm studying and help me prepare for my upcoming test?",
    "zh-TW": "I need help with science. Can you explain the concept I'm studying and help me prepare for my upcoming test?",
  },
  "welcome.student.humanities.title": {
    "zh-CN": "人文辅导",
    en: "Humanities Tutoring",
    "zh-TW": "人文輔導",
  },
  "welcome.student.humanities.desc": {
    "zh-CN": "English, History, Essay writing & analysis",
    en: "English, History, Essay writing & analysis",
    "zh-TW": "English, History, Essay writing & analysis",
  },
  "welcome.student.humanities.prompt": {
    "zh-CN": "I need help with humanities. Can you help me with my reading analysis, essay structure, or historical argumentation?",
    en: "I need help with humanities. Can you help me with my reading analysis, essay structure, or historical argumentation?",
    "zh-TW": "I need help with humanities. Can you help me with my reading analysis, essay structure, or historical argumentation?",
  },
  "welcome.student.apPrep.title": {
    "zh-CN": "AP 备考",
    en: "AP Exam Prep",
    "zh-TW": "AP 備考",
  },
  "welcome.student.apPrep.desc": {
    "zh-CN": "AP exam strategies, FRQ practice, review plans",
    en: "AP exam strategies, FRQ practice, review plans",
    "zh-TW": "AP exam strategies, FRQ practice, review plans",
  },
  "welcome.student.apPrep.prompt": {
    "zh-CN": "I'm preparing for my AP exam and need a study plan. Can you help me review key concepts and practice with sample questions?",
    en: "I'm preparing for my AP exam and need a study plan. Can you help me review key concepts and practice with sample questions?",
    "zh-TW": "I'm preparing for my AP exam and need a study plan. Can you help me review key concepts and practice with sample questions?",
  },
  // Teacher scenarios
  "welcome.teacher.lessonPlan.title": {
    "zh-CN": "教案生成",
    en: "Lesson Plan",
    "zh-TW": "教案生成",
  },
  "welcome.teacher.lessonPlan.desc": {
    "zh-CN": "生成符合 BASIS 标准的学科教案",
    en: "Generate lesson plans that meet BASIS standards",
    "zh-TW": "生成符合 BASIS 標準的學科教案",
  },
  "welcome.teacher.lessonPlan.prompt": {
    "zh-CN": "请帮我生成一份符合 BASIS 标准的教案，包括教学目标、课堂活动设计、评估方式和差异化教学策略。",
    en: "Please help me generate a lesson plan that meets BASIS standards, including learning objectives, classroom activity design, assessment methods, and differentiated instruction strategies.",
    "zh-TW": "請幫我生成一份符合 BASIS 標準的教案，包括教學目標、課堂活動設計、評估方式和差異化教學策略。",
  },
  "welcome.teacher.emi.title": {
    "zh-CN": "EMI 教学法",
    en: "EMI Pedagogy",
    "zh-TW": "EMI 教學法",
  },
  "welcome.teacher.emi.desc": {
    "zh-CN": "English as Medium of Instruction 教学指导",
    en: "English as Medium of Instruction teaching guidance",
    "zh-TW": "English as Medium of Instruction 教學指導",
  },
  "welcome.teacher.emi.prompt": {
    "zh-CN": "请给我 EMI 教学法指导，帮助我在全英文教学环境下有效地传授学科知识，同时支持不同英语水平的学生。",
    en: "Please provide EMI pedagogy guidance to help me effectively teach subject knowledge in an English-medium environment while supporting students with varying English proficiency levels.",
    "zh-TW": "請給我 EMI 教學法指導，幫助我在全英文教學環境下有效地傳授學科知識，同時支持不同英語水平的學生。",
  },
};

export default welcome;
