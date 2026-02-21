import type { Locale } from "../types";

const assessment: Record<string, Record<Locale, string>> = {
  // Landing page - Hero
  "assessment.hero_badge": {
    "zh-CN": "免费 · 专业 · 个性化",
    en: "Free · Professional · Personalized",
    "zh-TW": "免費 · 專業 · 個性化",
  },
  "assessment.hero_title": {
    "zh-CN": "免费学科测评",
    en: "Free Subject Assessment",
    "zh-TW": "免費學科測評",
  },
  "assessment.hero_subtitle": {
    "zh-CN": "精准定位你的 BASIS 学科水平",
    en: "Pinpoint Your BASIS Academic Level",
    "zh-TW": "精準定位你的 BASIS 學科水平",
  },
  "assessment.hero_desc": {
    "zh-CN":
      "基于 BASIS 各年级真实教学进度，通过自适应测试精准诊断学科能力。零门槛、无需注册，即刻开始。",
    en: "Based on actual BASIS curriculum by grade level, our adaptive test accurately diagnoses subject proficiency. No barriers, no signup needed — start now.",
    "zh-TW":
      "基於 BASIS 各年級真實教學進度，透過自適應測試精準診斷學科能力。零門檻、無需註冊，即刻開始。",
  },
  "assessment.hero_cta": {
    "zh-CN": "立即免费测评",
    en: "Start Free Assessment",
    "zh-TW": "立即免費測評",
  },
  "assessment.hero_learn_more": {
    "zh-CN": "了解更多",
    en: "Learn More",
    "zh-TW": "了解更多",
  },

  // Assessment type cards
  "assessment.type.pre_admission": {
    "zh-CN": "入学能力预评估",
    en: "Pre-Admission Assessment",
    "zh-TW": "入學能力預評估",
  },
  "assessment.type.pre_admission_desc": {
    "zh-CN":
      "准备入学 BASIS？全面评估数学、英语和综合学术素养，了解与 BASIS 课程标准的差距。",
    en: "Preparing for BASIS? Evaluate math, English, and overall academic readiness against BASIS curriculum standards.",
    "zh-TW":
      "準備入學 BASIS？全面評估數學、英語和綜合學術素養，了解與 BASIS 課程標準的差距。",
  },
  "assessment.type.pre_admission_meta": {
    "zh-CN": "20 题 · 约 15 分钟",
    en: "20 questions · ~15 min",
    "zh-TW": "20 題 · 約 15 分鐘",
  },
  "assessment.type.pre_admission_audience": {
    "zh-CN": "适合：准新生家长",
    en: "For: Prospective families",
    "zh-TW": "適合：準新生家長",
  },
  "assessment.type.diagnostic": {
    "zh-CN": "学科诊断测评",
    en: "Subject Diagnostic",
    "zh-TW": "學科診斷測評",
  },
  "assessment.type.diagnostic_desc": {
    "zh-CN":
      "针对单一学科深度诊断，定位知识薄弱环节，生成个性化学习建议。Benchmark 后必做。",
    en: "Deep dive into a single subject to identify weak areas and generate personalized study recommendations. Essential after Benchmarks.",
    "zh-TW":
      "針對單一學科深度診斷，定位知識薄弱環節，生成個性化學習建議。Benchmark 後必做。",
  },
  "assessment.type.diagnostic_meta": {
    "zh-CN": "15 题 · 约 12 分钟",
    en: "15 questions · ~12 min",
    "zh-TW": "15 題 · 約 12 分鐘",
  },
  "assessment.type.diagnostic_audience": {
    "zh-CN": "适合：在读学生/家长",
    en: "For: Current students/parents",
    "zh-TW": "適合：在讀學生/家長",
  },
  "assessment.type.quick": {
    "zh-CN": "快速摸底",
    en: "Quick Assessment",
    "zh-TW": "快速摸底",
  },
  "assessment.type.quick_desc": {
    "zh-CN":
      "5 分钟快速了解学科水平，适合初次咨询或快速定位。即测即出结果。",
    en: "Get a quick snapshot of academic level in 5 minutes. Perfect for initial consultations or rapid assessment.",
    "zh-TW":
      "5 分鐘快速了解學科水平，適合初次諮詢或快速定位。即測即出結果。",
  },
  "assessment.type.quick_meta": {
    "zh-CN": "10 题 · 约 5 分钟",
    en: "10 questions · ~5 min",
    "zh-TW": "10 題 · 約 5 分鐘",
  },
  "assessment.type.quick_audience": {
    "zh-CN": "适合：教育顾问/快速摸底",
    en: "For: Consultants/Quick screening",
    "zh-TW": "適合：教育顧問/快速摸底",
  },
  "assessment.card_cta": {
    "zh-CN": "开始测评",
    en: "Start Now",
    "zh-TW": "開始測評",
  },

  // Trust/features section
  "assessment.trust_title": {
    "zh-CN": "为什么选择 BasisPilot 测评？",
    en: "Why BasisPilot Assessment?",
    "zh-TW": "為什麼選擇 BasisPilot 測評？",
  },
  "assessment.trust_adaptive": {
    "zh-CN": "自适应出题",
    en: "Adaptive Testing",
    "zh-TW": "自適應出題",
  },
  "assessment.trust_adaptive_desc": {
    "zh-CN": "基于 CAT 算法，题目难度实时调整，精准测量真实水平",
    en: "CAT-based algorithm adjusts difficulty in real-time for accurate measurement",
    "zh-TW": "基於 CAT 算法，題目難度即時調整，精準測量真實水平",
  },
  "assessment.trust_aligned": {
    "zh-CN": "BASIS 课程对齐",
    en: "BASIS-Aligned",
    "zh-TW": "BASIS 課程對齊",
  },
  "assessment.trust_aligned_desc": {
    "zh-CN": "题目严格对标 BASIS 各年级教学进度，超前 1-2 年的真实难度",
    en: "Questions aligned to actual BASIS curriculum — 1-2 years ahead of standard schools",
    "zh-TW": "題目嚴格對標 BASIS 各年級教學進度，超前 1-2 年的真實難度",
  },
  "assessment.trust_report": {
    "zh-CN": "详细诊断报告",
    en: "Detailed Report",
    "zh-TW": "詳細診斷報告",
  },
  "assessment.trust_report_desc": {
    "zh-CN": "多维度能力分析 + 个性化学习建议，不只是一个分数",
    en: "Multi-dimensional analysis + personalized recommendations — more than just a score",
    "zh-TW": "多維度能力分析 + 個性化學習建議，不只是一個分數",
  },
  "assessment.trust_free": {
    "zh-CN": "完全免费",
    en: "Completely Free",
    "zh-TW": "完全免費",
  },
  "assessment.trust_free_desc": {
    "zh-CN": "零门槛体验专业测评，无需注册即可开始答题",
    en: "Professional assessment with zero barriers — no signup needed to begin",
    "zh-TW": "零門檻體驗專業測評，無需註冊即可開始答題",
  },

  // Start page
  "assessment.start_title": {
    "zh-CN": "选择测评参数",
    en: "Configure Your Assessment",
    "zh-TW": "選擇測評參數",
  },
  "assessment.start_subtitle": {
    "zh-CN": "选择年级和学科，开始你的个性化测评",
    en: "Select your grade and subject to begin your personalized assessment",
    "zh-TW": "選擇年級和學科，開始你的個性化測評",
  },
  "assessment.start_grade_label": {
    "zh-CN": "年级",
    en: "Grade Level",
    "zh-TW": "年級",
  },
  "assessment.start_grade_placeholder": {
    "zh-CN": "选择年级",
    en: "Select grade",
    "zh-TW": "選擇年級",
  },
  "assessment.start_subject_label": {
    "zh-CN": "学科",
    en: "Subject",
    "zh-TW": "學科",
  },
  "assessment.start_subject_placeholder": {
    "zh-CN": "选择学科",
    en: "Select subject",
    "zh-TW": "選擇學科",
  },
  "assessment.start_campus_label": {
    "zh-CN": "校区（可选）",
    en: "Campus (Optional)",
    "zh-TW": "校區（可選）",
  },
  "assessment.start_campus_placeholder": {
    "zh-CN": "选择校区",
    en: "Select campus",
    "zh-TW": "選擇校區",
  },
  "assessment.start_btn": {
    "zh-CN": "开始测评",
    en: "Begin Assessment",
    "zh-TW": "開始測評",
  },
  "assessment.start_loading": {
    "zh-CN": "正在准备题目...",
    en: "Preparing questions...",
    "zh-TW": "正在準備題目...",
  },
  "assessment.start_back": {
    "zh-CN": "返回",
    en: "Back",
    "zh-TW": "返回",
  },
  "assessment.start_info_title": {
    "zh-CN": "测评说明",
    en: "Assessment Info",
    "zh-TW": "測評說明",
  },
  "assessment.start_info_adaptive": {
    "zh-CN": "题目难度会根据你的表现自动调整",
    en: "Question difficulty adapts based on your performance",
    "zh-TW": "題目難度會根據你的表現自動調整",
  },
  "assessment.start_info_no_penalty": {
    "zh-CN": "答错不扣分，放心作答",
    en: "No penalty for wrong answers — answer freely",
    "zh-TW": "答錯不扣分，放心作答",
  },
  "assessment.start_info_time": {
    "zh-CN": "没有单题时间限制，但建议控制在 2 分钟内",
    en: "No per-question time limit, but aim for under 2 minutes each",
    "zh-TW": "沒有單題時間限制，但建議控制在 2 分鐘內",
  },
  "assessment.start_error": {
    "zh-CN": "启动测评失败，请稍后重试",
    en: "Failed to start assessment. Please try again.",
    "zh-TW": "啟動測評失敗，請稍後重試",
  },

  // Subjects
  "assessment.subject.math": {
    "zh-CN": "数学 Mathematics",
    en: "Mathematics",
    "zh-TW": "數學 Mathematics",
  },
  "assessment.subject.english": {
    "zh-CN": "英语 English",
    en: "English Language Arts",
    "zh-TW": "英語 English",
  },
  "assessment.subject.physics": {
    "zh-CN": "物理 Physics",
    en: "Physics",
    "zh-TW": "物理 Physics",
  },
  "assessment.subject.chemistry": {
    "zh-CN": "化学 Chemistry",
    en: "Chemistry",
    "zh-TW": "化學 Chemistry",
  },
  "assessment.subject.biology": {
    "zh-CN": "生物 Biology",
    en: "Biology",
    "zh-TW": "生物 Biology",
  },
  "assessment.subject.history": {
    "zh-CN": "历史 History",
    en: "History",
    "zh-TW": "歷史 History",
  },
  "assessment.subject.academic_readiness": {
    "zh-CN": "综合学术素养",
    en: "Academic Readiness",
    "zh-TW": "綜合學術素養",
  },

  // Grades
  "assessment.grade.G5": {
    "zh-CN": "G5（五年级）",
    en: "G5 (5th Grade)",
    "zh-TW": "G5（五年級）",
  },
  "assessment.grade.G6": {
    "zh-CN": "G6（六年级）",
    en: "G6 (6th Grade)",
    "zh-TW": "G6（六年級）",
  },
  "assessment.grade.G7": {
    "zh-CN": "G7（七年级）",
    en: "G7 (7th Grade)",
    "zh-TW": "G7（七年級）",
  },
  "assessment.grade.G8": {
    "zh-CN": "G8（八年级）",
    en: "G8 (8th Grade)",
    "zh-TW": "G8（八年級）",
  },
  "assessment.grade.G9": {
    "zh-CN": "G9（九年级）",
    en: "G9 (9th Grade)",
    "zh-TW": "G9（九年級）",
  },
  "assessment.grade.G10": {
    "zh-CN": "G10（十年级）",
    en: "G10 (10th Grade)",
    "zh-TW": "G10（十年級）",
  },
  "assessment.grade.G11": {
    "zh-CN": "G11（十一年级）",
    en: "G11 (11th Grade)",
    "zh-TW": "G11（十一年級）",
  },
  "assessment.grade.G12": {
    "zh-CN": "G12（十二年级）",
    en: "G12 (12th Grade)",
    "zh-TW": "G12（十二年級）",
  },

  // Campuses
  "assessment.campus.shenzhen": {
    "zh-CN": "深圳贝赛思",
    en: "BASIS Shenzhen",
    "zh-TW": "深圳貝賽思",
  },
  "assessment.campus.guangzhou": {
    "zh-CN": "广州贝赛思",
    en: "BASIS Guangzhou",
    "zh-TW": "廣州貝賽思",
  },
  "assessment.campus.hangzhou": {
    "zh-CN": "杭州贝赛思",
    en: "BASIS Hangzhou",
    "zh-TW": "杭州貝賽思",
  },
  "assessment.campus.nanjing": {
    "zh-CN": "南京贝赛思",
    en: "BASIS Nanjing",
    "zh-TW": "南京貝賽思",
  },
  "assessment.campus.chengdu": {
    "zh-CN": "成都贝赛思",
    en: "BASIS Chengdu",
    "zh-TW": "成都貝賽思",
  },
  "assessment.campus.wuhan": {
    "zh-CN": "武汉贝赛思",
    en: "BASIS Wuhan",
    "zh-TW": "武漢貝賽思",
  },
  "assessment.campus.jinan": {
    "zh-CN": "济南贝赛思",
    en: "BASIS Jinan",
    "zh-TW": "濟南貝賽思",
  },
  "assessment.campus.other": {
    "zh-CN": "其他校区",
    en: "Other Campus",
    "zh-TW": "其他校區",
  },

  // Quiz/Take page
  "assessment.quiz.progress": {
    "zh-CN": "第 {current} 题 / 共约 {total} 题",
    en: "Question {current} of ~{total}",
    "zh-TW": "第 {current} 題 / 共約 {total} 題",
  },
  "assessment.quiz.submit_answer": {
    "zh-CN": "提交答案",
    en: "Submit Answer",
    "zh-TW": "提交答案",
  },
  "assessment.quiz.next": {
    "zh-CN": "下一题",
    en: "Next Question",
    "zh-TW": "下一題",
  },
  "assessment.quiz.finishing": {
    "zh-CN": "快完成了！",
    en: "Almost done!",
    "zh-TW": "快完成了！",
  },
  "assessment.quiz.submitting": {
    "zh-CN": "正在提交...",
    en: "Submitting...",
    "zh-TW": "正在提交...",
  },
  "assessment.quiz.completing": {
    "zh-CN": "正在生成报告...",
    en: "Generating report...",
    "zh-TW": "正在生成報告...",
  },
  "assessment.quiz.error": {
    "zh-CN": "提交失败，请重试",
    en: "Submission failed. Please try again.",
    "zh-TW": "提交失敗，請重試",
  },
  "assessment.quiz.time_spent": {
    "zh-CN": "用时",
    en: "Time",
    "zh-TW": "用時",
  },
  "assessment.quiz.correct": {
    "zh-CN": "正确!",
    en: "Correct!",
    "zh-TW": "正確!",
  },
  "assessment.quiz.incorrect": {
    "zh-CN": "不正确",
    en: "Incorrect",
    "zh-TW": "不正確",
  },
  "assessment.quiz.time_up": {
    "zh-CN": "时间到，正在生成报告...",
    en: "Time's up! Generating report...",
    "zh-TW": "時間到，正在生成報告...",
  },
  "assessment.quiz.essay_placeholder": {
    "zh-CN": "请在此输入你的论述...",
    en: "Type your essay here...",
    "zh-TW": "請在此輸入你的論述...",
  },
  "assessment.quiz.short_answer_placeholder": {
    "zh-CN": "请输入你的答案...",
    en: "Type your answer here...",
    "zh-TW": "請輸入你的答案...",
  },
  "assessment.quiz.chars": {
    "zh-CN": "字",
    en: "chars",
    "zh-TW": "字",
  },
  "assessment.quiz.scoring": {
    "zh-CN": "AI 评分中...",
    en: "AI scoring...",
    "zh-TW": "AI 評分中...",
  },
  "assessment.quiz.scoring_result": {
    "zh-CN": "评分",
    en: "Score",
    "zh-TW": "評分",
  },

  // Report page
  "assessment.report.title": {
    "zh-CN": "测评报告",
    en: "Assessment Report",
    "zh-TW": "測評報告",
  },
  "assessment.report.overall_score": {
    "zh-CN": "总分",
    en: "Overall Score",
    "zh-TW": "總分",
  },
  "assessment.report.level": {
    "zh-CN": "能力等级",
    en: "Proficiency Level",
    "zh-TW": "能力等級",
  },
  "assessment.report.grade_alignment": {
    "zh-CN": "年级对齐",
    en: "Grade Alignment",
    "zh-TW": "年級對齊",
  },
  "assessment.report.dimensions": {
    "zh-CN": "各维度得分",
    en: "Dimension Scores",
    "zh-TW": "各維度得分",
  },
  "assessment.report.recommendations": {
    "zh-CN": "个性化建议",
    en: "Personalized Recommendations",
    "zh-TW": "個性化建議",
  },
  "assessment.report.cta_title": {
    "zh-CN": "针对薄弱环节，BasisPilot 可以帮你",
    en: "BasisPilot Can Help With Your Weak Areas",
    "zh-TW": "針對薄弱環節，BasisPilot 可以幫你",
  },
  "assessment.report.cta_btn": {
    "zh-CN": "开始免费体验辅导",
    en: "Start Free Tutoring",
    "zh-TW": "開始免費體驗輔導",
  },
  "assessment.report.share_btn": {
    "zh-CN": "分享给好友也来测一测",
    en: "Share with friends",
    "zh-TW": "分享給好友也來測一測",
  },
  "assessment.report.retake_btn": {
    "zh-CN": "重新测评",
    en: "Retake Assessment",
    "zh-TW": "重新測評",
  },
  "assessment.report.login_required": {
    "zh-CN": "登录后查看完整报告",
    en: "Log in to view your full report",
    "zh-TW": "登入後查看完整報告",
  },
  "assessment.report.login_btn": {
    "zh-CN": "登录 / 注册",
    en: "Log In / Sign Up",
    "zh-TW": "登入 / 註冊",
  },
  "assessment.report.loading": {
    "zh-CN": "正在加载报告...",
    en: "Loading report...",
    "zh-TW": "正在載入報告...",
  },
  "assessment.report.error": {
    "zh-CN": "加载报告失败",
    en: "Failed to load report",
    "zh-TW": "載入報告失敗",
  },

  // Proficiency levels
  "assessment.level.below": {
    "zh-CN": "基础 (Below Grade Level)",
    en: "Below Grade Level",
    "zh-TW": "基礎 (Below Grade Level)",
  },
  "assessment.level.approaching": {
    "zh-CN": "发展中 (Approaching Grade Level)",
    en: "Approaching Grade Level",
    "zh-TW": "發展中 (Approaching Grade Level)",
  },
  "assessment.level.at": {
    "zh-CN": "达标 (At Grade Level)",
    en: "At Grade Level",
    "zh-TW": "達標 (At Grade Level)",
  },
  "assessment.level.above": {
    "zh-CN": "优秀 (Above Grade Level)",
    en: "Above Grade Level",
    "zh-TW": "優秀 (Above Grade Level)",
  },
  "assessment.level.advanced": {
    "zh-CN": "卓越 (Advanced / AP Ready)",
    en: "Advanced / AP Ready",
    "zh-TW": "卓越 (Advanced / AP Ready)",
  },

  // Nav
  "assessment.nav_brand": {
    "zh-CN": "BasisPilot",
    en: "BasisPilot",
    "zh-TW": "BasisPilot",
  },
  "assessment.nav_home": {
    "zh-CN": "首页",
    en: "Home",
    "zh-TW": "首頁",
  },
  "assessment.nav_login": {
    "zh-CN": "登录",
    en: "Log In",
    "zh-TW": "登入",
  },

  // Footer
  "assessment.footer_powered": {
    "zh-CN": "BasisPilot — AI 驱动的 BASIS 学业导航",
    en: "BasisPilot — AI-Powered BASIS Academic Navigation",
    "zh-TW": "BasisPilot — AI 驅動的 BASIS 學業導航",
  },

  // Wizard
  "assessment.wizard.title": {
    "zh-CN": "设置你的测评",
    en: "Set Up Your Assessment",
    "zh-TW": "設置你的測評",
  },
  "assessment.wizard.step_grade": {
    "zh-CN": "选择年级",
    en: "Select Grade",
    "zh-TW": "選擇年級",
  },
  "assessment.wizard.step_subject": {
    "zh-CN": "选择学科",
    en: "Select Subject",
    "zh-TW": "選擇學科",
  },
  "assessment.wizard.step_goal": {
    "zh-CN": "选择目标",
    en: "Select Goal",
    "zh-TW": "選擇目標",
  },
  "assessment.wizard.next": {
    "zh-CN": "下一步",
    en: "Next",
    "zh-TW": "下一步",
  },
  "assessment.wizard.back": {
    "zh-CN": "返回",
    en: "Back",
    "zh-TW": "返回",
  },
  "assessment.wizard.begin": {
    "zh-CN": "开始测评",
    en: "Begin Assessment",
    "zh-TW": "開始測評",
  },
  "assessment.wizard.loading": {
    "zh-CN": "正在准备题目...",
    en: "Preparing questions...",
    "zh-TW": "正在準備題目...",
  },
  "assessment.wizard.coming_soon": {
    "zh-CN": "即将上线",
    en: "Coming Soon",
    "zh-TW": "即將上線",
  },
  "assessment.wizard.goal.diagnostic": {
    "zh-CN": "学科诊断",
    en: "Subject Diagnostic",
    "zh-TW": "學科診斷",
  },
  "assessment.wizard.goal.diagnostic_desc": {
    "zh-CN": "找到知识薄弱环节，获取个性化建议",
    en: "Identify weak areas and get personalized recommendations",
    "zh-TW": "找到知識薄弱環節，獲取個性化建議",
  },
  "assessment.wizard.goal.improve": {
    "zh-CN": "提高成绩",
    en: "Improve Grade",
    "zh-TW": "提高成績",
  },
  "assessment.wizard.goal.improve_desc": {
    "zh-CN": "针对性提升，冲刺更高分数",
    en: "Targeted improvement to achieve higher scores",
    "zh-TW": "針對性提升，衝刺更高分數",
  },
  "assessment.wizard.goal.exam": {
    "zh-CN": "考试备考",
    en: "Exam Prep",
    "zh-TW": "考試備考",
  },
  "assessment.wizard.goal.exam_desc": {
    "zh-CN": "Benchmark / AP 考试前的综合检测",
    en: "Comprehensive pre-exam assessment for Benchmarks / AP tests",
    "zh-TW": "Benchmark / AP 考試前的綜合檢測",
  },
  "assessment.wizard.goal.placement": {
    "zh-CN": "分班测试",
    en: "Placement Test",
    "zh-TW": "分班測試",
  },
  "assessment.wizard.goal.placement_desc": {
    "zh-CN": "准备入学或分班考试",
    en: "Prepare for admission or placement exams",
    "zh-TW": "準備入學或分班考試",
  },

  // Quiz page
  "assessment.quiz.difficulty": {
    "zh-CN": "难度",
    en: "Difficulty",
    "zh-TW": "難度",
  },
  "assessment.quiz.easy": {
    "zh-CN": "简单",
    en: "Easy",
    "zh-TW": "簡單",
  },
  "assessment.quiz.medium": {
    "zh-CN": "中等",
    en: "Medium",
    "zh-TW": "中等",
  },
  "assessment.quiz.hard": {
    "zh-CN": "困难",
    en: "Hard",
    "zh-TW": "困難",
  },
  "assessment.quiz.correct_answer": {
    "zh-CN": "正确答案：{answer}",
    en: "Correct answer: {answer}",
    "zh-TW": "正確答案：{answer}",
  },
  "assessment.quiz.complete_title": {
    "zh-CN": "测评完成!",
    en: "Assessment Complete!",
    "zh-TW": "測評完成!",
  },
  "assessment.quiz.complete_score": {
    "zh-CN": "你答对了 {correct} / {total} 题",
    en: "You got {correct} out of {total} correct",
    "zh-TW": "你答對了 {correct} / {total} 題",
  },
  "assessment.quiz.view_report": {
    "zh-CN": "查看详细报告",
    en: "View Detailed Report",
    "zh-TW": "查看詳細報告",
  },
  "assessment.quiz.login_to_view": {
    "zh-CN": "登录后查看完整报告",
    en: "Log in to view your full report",
    "zh-TW": "登入後查看完整報告",
  },

  // Report page
  "assessment.report.generating_title": {
    "zh-CN": "正在分析你的表现...",
    en: "Analyzing your performance...",
    "zh-TW": "正在分析你的表現...",
  },
  "assessment.report.generating_tip": {
    "zh-CN": "AI 正在生成个性化诊断报告，请稍候",
    en: "AI is generating your personalized diagnostic report",
    "zh-TW": "AI 正在生成個性化診斷報告，請稍候",
  },
  "assessment.report.score_title": {
    "zh-CN": "总体得分",
    en: "Overall Score",
    "zh-TW": "總體得分",
  },
  "assessment.report.percentile": {
    "zh-CN": "超过 {pct}% 的同年级学生",
    en: "Better than {pct}% of students in your grade",
    "zh-TW": "超過 {pct}% 的同年級學生",
  },
  "assessment.report.grade_eq": {
    "zh-CN": "年级当量",
    en: "Grade Equivalent",
    "zh-TW": "年級當量",
  },
  "assessment.report.radar_title": {
    "zh-CN": "能力维度分析",
    en: "Ability Dimensions",
    "zh-TW": "能力維度分析",
  },
  "assessment.report.gap_title": {
    "zh-CN": "差距分析",
    en: "Gap Analysis",
    "zh-TW": "差距分析",
  },
  "assessment.report.gap_current": {
    "zh-CN": "当前水平",
    en: "Current Level",
    "zh-TW": "當前水平",
  },
  "assessment.report.gap_target": {
    "zh-CN": "目标水平",
    en: "Target Level",
    "zh-TW": "目標水平",
  },
  "assessment.report.heatmap_title": {
    "zh-CN": "知识点掌握情况",
    en: "Topic Mastery",
    "zh-TW": "知識點掌握情況",
  },
  "assessment.report.timeline_title": {
    "zh-CN": "进步预测",
    en: "Progress Projection",
    "zh-TW": "進步預測",
  },
  "assessment.report.timeline_with": {
    "zh-CN": "使用 BasisPilot",
    en: "With BasisPilot",
    "zh-TW": "使用 BasisPilot",
  },
  "assessment.report.timeline_without": {
    "zh-CN": "自学",
    en: "Self-study",
    "zh-TW": "自學",
  },
  "assessment.report.path_title": {
    "zh-CN": "个性化学习路径",
    en: "Personalized Learning Path",
    "zh-TW": "個性化學習路徑",
  },
  "assessment.report.week": {
    "zh-CN": "第 {n} 周",
    en: "Week {n}",
    "zh-TW": "第 {n} 週",
  },
  "assessment.report.service_title": {
    "zh-CN": "推荐方案",
    en: "Recommended Plans",
    "zh-TW": "推薦方案",
  },
  "assessment.report.service_free": {
    "zh-CN": "免费继续使用 BasisPilot",
    en: "Continue with BasisPilot Free",
    "zh-TW": "免費繼續使用 BasisPilot",
  },
  "assessment.report.service_free_desc": {
    "zh-CN": "每日 5 次对话，基础学科辅导",
    en: "5 conversations per day, basic tutoring",
    "zh-TW": "每日 5 次對話，基礎學科輔導",
  },
  "assessment.report.service_premium": {
    "zh-CN": "升级获取个性化辅导",
    en: "Upgrade for Personalized Tutoring",
    "zh-TW": "升級獲取個性化輔導",
  },
  "assessment.report.service_premium_f1": {
    "zh-CN": "无限对话",
    en: "Unlimited conversations",
    "zh-TW": "無限對話",
  },
  "assessment.report.service_premium_f2": {
    "zh-CN": "全部 6 个 AI 专家",
    en: "All 6 AI expert agents",
    "zh-TW": "全部 6 個 AI 專家",
  },
  "assessment.report.service_premium_f3": {
    "zh-CN": "个性化学习计划",
    en: "Personalized study plan",
    "zh-TW": "個性化學習計劃",
  },
  "assessment.report.service_premium_f4": {
    "zh-CN": "周报追踪",
    en: "Weekly progress tracking",
    "zh-TW": "週報追蹤",
  },
  "assessment.report.download_pdf": {
    "zh-CN": "下载 PDF 报告",
    en: "Download PDF Report",
    "zh-TW": "下載 PDF 報告",
  },
  "assessment.report.share": {
    "zh-CN": "分享报告",
    en: "Share Report",
    "zh-TW": "分享報告",
  },
  "assessment.report.copied": {
    "zh-CN": "链接已复制",
    en: "Link copied",
    "zh-TW": "連結已複製",
  },
  "assessment.report.analysis_title": {
    "zh-CN": "AI 诊断分析",
    en: "AI Diagnostic Analysis",
    "zh-TW": "AI 診斷分析",
  },
  "assessment.report.strong_topics": {
    "zh-CN": "优势领域",
    en: "Strong Areas",
    "zh-TW": "優勢領域",
  },
  "assessment.report.weak_topics": {
    "zh-CN": "需要加强",
    en: "Areas to Improve",
    "zh-TW": "需要加強",
  },
  "assessment.report.stats_accuracy": {
    "zh-CN": "正确率",
    en: "Accuracy",
    "zh-TW": "正確率",
  },
  "assessment.report.stats_questions": {
    "zh-CN": "题目数",
    en: "Questions",
    "zh-TW": "題目數",
  },
  "assessment.report.stats_time": {
    "zh-CN": "总用时",
    en: "Total Time",
    "zh-TW": "總用時",
  },
  "assessment.report.stats_avg_time": {
    "zh-CN": "平均用时",
    en: "Avg Time",
    "zh-TW": "平均用時",
  },
  "assessment.report.minutes": {
    "zh-CN": "{n} 分钟",
    en: "{n} min",
    "zh-TW": "{n} 分鐘",
  },
  "assessment.report.seconds": {
    "zh-CN": "{n} 秒",
    en: "{n}s",
    "zh-TW": "{n} 秒",
  },
};

export default assessment;
