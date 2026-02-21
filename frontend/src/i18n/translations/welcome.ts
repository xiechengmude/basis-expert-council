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
  // Teacher scenarios (conversion/trust-focused — help teachers communicate with parents)
  "welcome.teacher.lessonPlan.title": {
    "zh-CN": "试听课设计",
    en: "Trial Lesson Design",
    "zh-TW": "試聽課設計",
  },
  "welcome.teacher.lessonPlan.desc": {
    "zh-CN": "设计让家长当场心动的试听课 — 用教学实力赢得信任",
    en: "Design trial lessons that impress parents on the spot — win trust through teaching quality",
    "zh-TW": "設計讓家長當場心動的試聽課 — 用教學實力贏得信任",
  },
  "welcome.teacher.lessonPlan.prompt": {
    "zh-CN": "我需要设计一堂让家长「当场心动」的试听课/公开课。科目：[  ]，年级：[  ]，课题：[  ]。\n\n核心目标：这节课不仅要教好内容，更要让旁听的家长感受到「这就是我想让孩子接受的教育」。\n\n背景：BASIS 家长每年花 32.7 万学费，85% 在偷偷补课但不满意现有机构，他们最怕的是「花了钱看不到效果」。\n\n请帮我设计：\n1）课堂亮点三板斧 — 3 个能让家长「哇」出声的教学环节（不是花架子，是真正展示教学深度的设计）\n2）学生互动设计 — 如何让学生在课堂上展现进步和思考过程（家长最想看到孩子的变化）\n3）刻意展示专业度 — 如何自然地体现「我比其他老师更懂 BASIS 体系」（课程衔接、AP预备、知识断层修补等）\n4）课后 3 分钟家长话术 — 课程结束后如何跟家长简短交流，自然种草后续课程\n5）课后跟进微信模板 — 课后发给家长的消息（包含学生表现亮点 + 后续建议 + 行动号召）",
    en: "I need to design a trial/open class that makes parents want to sign up immediately. Subject: [ ], Grade: [ ], Topic: [ ].\n\nCore goal: This class should not only teach well, but make observing parents feel 'this is the education I want for my child.'\n\nContext: BASIS parents spend 327K/year on tuition, 85% secretly tutor but aren't satisfied with current providers. Their biggest fear: 'spending money with no visible results.'\n\nPlease design:\n1) Three classroom 'wow moments' — teaching segments that genuinely impress parents (not gimmicks, real depth)\n2) Student interaction design — how to showcase student progress and thinking process (parents want to see change)\n3) Expertise display — how to naturally demonstrate 'I understand BASIS better than others' (curriculum alignment, AP preparation, knowledge gap bridging)\n4) Post-class 3-minute parent talk — brief exchange after class that naturally seeds interest in continued lessons\n5) Follow-up WeChat message template — post-class message to parents (student highlights + recommendations + call to action)",
    "zh-TW": "我需要設計一堂讓家長「當場心動」的試聽課/公開課。科目：[  ]，年級：[  ]，課題：[  ]。\n\n核心目標：這節課不僅要教好內容，更要讓旁聽的家長感受到「這就是我想讓孩子接受的教育」。\n\n背景：BASIS 家長每年花 32.7 萬學費，85% 在偷偷補課但不滿意現有機構，他們最怕的是「花了錢看不到效果」。\n\n請幫我設計：\n1）課堂亮點三板斧 — 3 個能讓家長「哇」出聲的教學環節（不是花架子，是真正展示教學深度的設計）\n2）學生互動設計 — 如何讓學生在課堂上展現進步和思考過程（家長最想看到孩子的變化）\n3）刻意展示專業度 — 如何自然地體現「我比其他老師更懂 BASIS 體系」（課程銜接、AP預備、知識斷層修補等）\n4）課後 3 分鐘家長話術 — 課程結束後如何跟家長簡短交流，自然種草後續課程\n5）課後跟進微信模板 — 課後發給家長的消息（包含學生表現亮點 + 後續建議 + 行動號召）",
  },
  "welcome.teacher.emi.title": {
    "zh-CN": "家长沟通话术",
    en: "Parent Communication",
    "zh-TW": "家長溝通話術",
  },
  "welcome.teacher.emi.desc": {
    "zh-CN": "针对不同类型家长的沟通策略 — 用专业度建立长期信任",
    en: "Communication strategies for different parent types — build lasting trust through expertise",
    "zh-TW": "針對不同類型家長的溝通策略 — 用專業度建立長期信任",
  },
  "welcome.teacher.emi.prompt": {
    "zh-CN": "我需要和一位 BASIS 家长沟通。家长类型：[焦虑型/理性型/冷淡型/质疑型]，孩子年级：[  ]，科目：[  ]，当前情况：[  ]。\n\n作为 BasisPilot 的教学老师，我的沟通核心不只是教学反馈，更是「让家长信任我 → 信任平台 → 持续付费」。\n\n请帮我准备：\n1）家长画像分析 — 根据类型判断这位家长最核心的焦虑/需求（用 85% 家长补课、68% GPA 下滑等数据佐证）\n2）沟通话术（分场景）：\n   - 首次课后反馈：如何让家长觉得「这个老师真的懂我的孩子」\n   - 定期进度汇报：如何用数据化语言展示进步（而不是空洞的「孩子很努力」）\n   - 坏消息传递：当学生表现不佳时，如何说「问题在哪」而不引起家长反感，反而加深信任\n   - 续费前沟通：如何在日常教学沟通中自然铺垫续费话题\n3）微信沟通模板 — 5 个场景的标准消息模板（课后反馈/周报/月度总结/考试前/续费期）\n4）避雷清单 — 哪些话绝对不能说（会触发家长退费/投诉的话术陷阱）",
    en: "I need to communicate with a BASIS parent. Parent type: [anxious/analytical/cold/skeptical], child's grade: [ ], subject: [ ], current situation: [ ].\n\nAs a BasisPilot teacher, my communication goal isn't just teaching feedback — it's 'build parent trust in me → trust in the platform → continued payment.'\n\nPlease prepare:\n1) Parent profile analysis — based on type, identify their core anxiety/need (backed by 85% tutoring rate, 68% GPA decline data)\n2) Communication scripts (by scenario):\n   - Post-first-class feedback: how to make parents feel 'this teacher truly understands my child'\n   - Regular progress update: how to show improvement with data (not empty 'your child is working hard')\n   - Bad news delivery: how to report poor performance without triggering defensiveness, actually deepening trust\n   - Pre-renewal communication: how to naturally set up renewal discussions in routine teaching updates\n3) WeChat message templates — 5 scenario templates (post-class feedback/weekly report/monthly summary/pre-exam/renewal period)\n4) Red flags checklist — what NEVER to say (phrases that trigger refund requests or complaints)",
    "zh-TW": "我需要和一位 BASIS 家長溝通。家長類型：[焦慮型/理性型/冷淡型/質疑型]，孩子年級：[  ]，科目：[  ]，當前情況：[  ]。\n\n作為 BasisPilot 的教學老師，我的溝通核心不只是教學反饋，更是「讓家長信任我 → 信任平台 → 持續付費」。\n\n請幫我準備：\n1）家長畫像分析 — 根據類型判斷這位家長最核心的焦慮/需求（用 85% 家長補課、68% GPA 下滑等數據佐證）\n2）溝通話術（分場景）：\n   - 首次課後反饋：如何讓家長覺得「這個老師真的懂我的孩子」\n   - 定期進度匯報：如何用數據化語言展示進步（而不是空洞的「孩子很努力」）\n   - 壞消息傳遞：當學生表現不佳時，如何說「問題在哪」而不引起家長反感，反而加深信任\n   - 續費前溝通：如何在日常教學溝通中自然鋪墊續費話題\n3）微信溝通模板 — 5 個場景的標準消息模板（課後反饋/週報/月度總結/考試前/續費期）\n4）避雷清單 — 哪些話絕對不能說（會觸發家長退費/投訴的話術陷阱）",
  },
  // Parent — College Planning (new)
  "welcome.parent.collegePlan.title": {
    "zh-CN": "升学规划",
    en: "College Planning",
    "zh-TW": "升學規劃",
  },
  "welcome.parent.collegePlan.desc": {
    "zh-CN": "从 GPA 管理到文书策略，一站式名校申请规划",
    en: "From GPA management to essay strategy — one-stop college application planning",
    "zh-TW": "從 GPA 管理到文書策略，一站式名校申請規劃",
  },
  "welcome.parent.collegePlan.prompt": {
    "zh-CN": "我想为孩子做一份完整的升学规划。请根据他目前的年级、GPA 和课外活动情况，帮我制定从现在到大学申请的完整时间线，包括标化考试安排、课外活动提升建议和文书准备策略。",
    en: "I want to create a comprehensive college planning roadmap for my child. Based on their current grade level, GPA, and extracurricular activities, please help me develop a complete timeline from now until college applications, including standardized test scheduling, extracurricular enhancement suggestions, and essay preparation strategy.",
    "zh-TW": "我想為孩子做一份完整的升學規劃。請根據他目前的年級、GPA 和課外活動情況，幫我制定從現在到大學申請的完整時間線，包括標化考試安排、課外活動提升建議和文書準備策略。",
  },
  // Student — Homework Help (new)
  "welcome.student.homework.title": {
    "zh-CN": "作业辅导",
    en: "Homework Help",
    "zh-TW": "作業輔導",
  },
  "welcome.student.homework.desc": {
    "zh-CN": "不会的题目拍照问，逐步讲解解题思路",
    en: "Stuck on a problem? Get step-by-step explanations",
    "zh-TW": "不會的題目拍照問，逐步講解解題思路",
  },
  "welcome.student.homework.prompt": {
    "zh-CN": "I'm stuck on my homework and need help. Can you walk me through this problem step by step and explain the concepts behind it?",
    en: "I'm stuck on my homework and need help. Can you walk me through this problem step by step and explain the concepts behind it?",
    "zh-TW": "I'm stuck on my homework and need help. Can you walk me through this problem step by step and explain the concepts behind it?",
  },
  // Student — Exam Cram (new)
  "welcome.student.examCram.title": {
    "zh-CN": "考前冲刺",
    en: "Exam Cram",
    "zh-TW": "考前衝刺",
  },
  "welcome.student.examCram.desc": {
    "zh-CN": "考试倒计时！快速梳理重点、模拟练习",
    en: "Exam countdown! Quick review of key points & practice",
    "zh-TW": "考試倒計時！快速梳理重點、模擬練習",
  },
  "welcome.student.examCram.prompt": {
    "zh-CN": "I have an exam coming up soon and need to review quickly. Please help me identify the most important concepts, create a focused study plan, and quiz me on key topics.",
    en: "I have an exam coming up soon and need to review quickly. Please help me identify the most important concepts, create a focused study plan, and quiz me on key topics.",
    "zh-TW": "I have an exam coming up soon and need to review quickly. Please help me identify the most important concepts, create a focused study plan, and quiz me on key topics.",
  },
  // Consultant role
  "welcome.role.consultant": {
    "zh-CN": "顾问",
    en: "Consultants",
    "zh-TW": "顧問",
  },
  // ── Consultant lifecycle: 6 stages (data-driven, conversion-focused) ──
  // Market data ammo: 68% GPA滑坡, 85%偷偷补课, 42%开学3月求助, 65%知识断层, 32.7万学费, ~0同步辅导, 10:1录取比
  // Stage 1: 客户背调 (Lead Research / Pre-Contact)
  "welcome.consultant.leadResearch.title": {
    "zh-CN": "客户背调",
    en: "Lead Research",
    "zh-TW": "客戶背調",
  },
  "welcome.consultant.leadResearch.desc": {
    "zh-CN": "68% 新生首年 GPA 下滑 — 提前锁定家长焦虑点",
    en: "68% of new students see GPA drops in year 1 — identify anxiety triggers early",
    "zh-TW": "68% 新生首年 GPA 下滑 — 提前鎖定家長焦慮點",
  },
  "welcome.consultant.leadResearch.prompt": {
    "zh-CN": "我即将联系一位 BASIS 家长，已知信息：孩子年级 [  ]，校区 [  ]，来源渠道 [  ]，备注 [  ]。\n\n请基于以下市场数据帮我做精准画像分析：\n- BASIS 68% 的学生首年 GPA 下滑\n- 85% 的家长在偷偷补课\n- 42% 的家长在开学 3 个月内就开始找辅导\n- 65% 新生存在知识断层\n- 学费高达 32.7 万/年，家长 ROI 焦虑极强\n- 市场上几乎没有 BASIS 课程同步辅导机构\n\n请帮我：\n1）根据孩子年级判断该家庭最可能的 TOP 3 焦虑点（用数据说话）\n2）准备 3 个能精准戳中痛点的开场话题（不要泛泛而谈）\n3）预判家长会问的尖锐问题（价格/效果/AI可靠性）并准备带数据的回答\n4）给出本次沟通的转化目标（试听/诊断/付费）和关键话术节点",
    en: "I'm about to contact a BASIS parent. Known info: child's grade [ ], campus [ ], lead source [ ], notes [ ].\n\nPlease build a precision profile based on these market facts:\n- 68% of BASIS students experience GPA decline in year 1\n- 85% of parents secretly hire tutors\n- 42% seek tutoring within 3 months of enrollment\n- 65% of new students face knowledge gaps\n- Tuition is 327K RMB/year — extreme ROI anxiety\n- Nearly zero institutions offer BASIS curriculum-sync tutoring\n\nPlease help me:\n1) Based on the child's grade, predict TOP 3 anxiety triggers (with data backing)\n2) Prepare 3 opening topics that precisely hit pain points (no generic talk)\n3) Anticipate tough questions (price/effectiveness/AI reliability) with data-backed answers\n4) Set the conversion goal (trial/diagnosis/paid) and key script milestones",
    "zh-TW": "我即將聯繫一位 BASIS 家長，已知信息：孩子年級 [  ]，校區 [  ]，來源渠道 [  ]，備註 [  ]。\n\n請基於以下市場數據幫我做精準畫像分析：\n- BASIS 68% 的學生首年 GPA 下滑\n- 85% 的家長在偷偷補課\n- 42% 的家長在開學 3 個月內就開始找輔導\n- 65% 新生存在知識斷層\n- 學費高達 32.7 萬/年，家長 ROI 焦慮極強\n- 市場上幾乎沒有 BASIS 課程同步輔導機構\n\n請幫我：\n1）根據孩子年級判斷該家庭最可能的 TOP 3 焦慮點（用數據說話）\n2）準備 3 個能精準戳中痛點的開場話題（不要泛泛而談）\n3）預判家長會問的尖銳問題（價格/效果/AI可靠性）並準備帶數據的回答\n4）給出本次溝通的轉化目標（試聽/診斷/付費）和關鍵話術節點",
  },
  // Stage 2: 破冰沟通 (First Contact / Icebreaker)
  "welcome.consultant.icebreaker.title": {
    "zh-CN": "破冰沟通",
    en: "First Contact",
    "zh-TW": "破冰溝通",
  },
  "welcome.consultant.icebreaker.desc": {
    "zh-CN": "32.7万学费花出去了 — 用共鸣打开家长心防",
    en: "327K tuition already spent — use empathy to open the conversation",
    "zh-TW": "32.7萬學費花出去了 — 用共鳴打開家長心防",
  },
  "welcome.consultant.icebreaker.prompt": {
    "zh-CN": "我是 BasisPilot 课程顾问，即将和一位 BASIS 家长首次沟通。家长背景：[请补充]。\n\n核心策略：利用家长的沉没成本焦虑（32.7万/年学费）和信息不对称（85%家长在补课但不公开讨论）来建立信任。\n\n请帮我准备：\n1）30 秒自我介绍话术 — 要传达「我们专注 BASIS 体系，不是泛泛的国际课程机构」的稀缺定位\n2）3 种破冰话术，分别针对：\n   - 焦虑型（「孩子跟不上怎么办」）→ 用 68% GPA 滑坡数据共情\n   - 理性型（「先了解一下」）→ 用市场空白数据（~0 同步辅导机构）建立专业度\n   - 观望型（「还在考虑要不要补」）→ 用 42% 开学 3 月内求助数据制造紧迫感\n3）如何在前 5 分钟内自然引出孩子的具体学业困难，让家长主动倾诉\n4）本次沟通的节奏脚本：开场→共情→挖痛点→种草→约试听，每阶段话术",
    en: "I'm a BasisPilot consultant about to have a first call with a BASIS parent. Background: [please add].\n\nCore strategy: Leverage sunk-cost anxiety (327K/year tuition) and information asymmetry (85% parents secretly tutoring) to build trust.\n\nPlease prepare:\n1) 30-second intro — convey our unique 'BASIS-only' positioning (not a generic tutoring company)\n2) 3 icebreaker scripts for:\n   - Anxious type ('my child is falling behind') → empathize with 68% GPA decline data\n   - Analytical type ('just exploring') → establish credibility with market gap data (~0 sync tutoring providers)\n   - Wait-and-see type ('not sure if we need tutoring') → create urgency with 42% seek-help-within-3-months data\n3) How to get the parent talking about their child's specific struggles within the first 5 minutes\n4) Call flow script: opener → empathy → dig pain → seed interest → book trial, with scripts per stage",
    "zh-TW": "我是 BasisPilot 課程顧問，即將和一位 BASIS 家長首次溝通。家長背景：[請補充]。\n\n核心策略：利用家長的沉沒成本焦慮（32.7萬/年學費）和信息不對稱（85%家長在補課但不公開討論）來建立信任。\n\n請幫我準備：\n1）30 秒自我介紹話術 — 要傳達「我們專注 BASIS 體系，不是泛泛的國際課程機構」的稀缺定位\n2）3 種破冰話術，分別針對：\n   - 焦慮型（「孩子跟不上怎麼辦」）→ 用 68% GPA 滑坡數據共情\n   - 理性型（「先了解一下」）→ 用市場空白數據（~0 同步輔導機構）建立專業度\n   - 觀望型（「還在考慮要不要補」）→ 用 42% 開學 3 月內求助數據製造緊迫感\n3）如何在前 5 分鐘內自然引出孩子的具體學業困難，讓家長主動傾訴\n4）本次溝通的節奏腳本：開場→共情→挖痛點→種草→約試聽，每階段話術",
  },
  // Stage 3: 需求诊断 (Needs Assessment / Discovery)
  "welcome.consultant.needsAssess.title": {
    "zh-CN": "需求诊断",
    en: "Needs Assessment",
    "zh-TW": "需求診斷",
  },
  "welcome.consultant.needsAssess.desc": {
    "zh-CN": "85% 的家长都在补课 — 精准定位这个家庭的紧急程度",
    en: "85% of parents are tutoring — pinpoint this family's urgency level",
    "zh-TW": "85% 的家長都在補課 — 精準定位這個家庭的緊急程度",
  },
  "welcome.consultant.needsAssess.prompt": {
    "zh-CN": "我需要为一位 BASIS 家长做需求诊断以推动成交。已知信息：孩子年级 [  ]，目前 GPA [  ]，主要困难 [  ]，家长最关心的问题 [  ]。\n\n背景数据（用于内部判断，不要直接念给家长）：\n- 68% 首年 GPA 下滑 → GPA < 3.0 的属于高危\n- 65% 新生知识断层 → 转入生前 6 个月是黄金干预期\n- 58% 高二学生课程衔接困境 → G10-11 是 AP 压力爆发期\n- 学费 32.7 万 → 家长对 ROI 极度敏感\n\n请帮我：\n1）基于年级 + GPA 判断紧急程度（红/黄/绿），并给出话术让家长感知紧迫性\n2）分析核心需求 vs 隐性需求（家长说的 vs 家长真正怕的）\n3）设计 5 个「诊断式提问」— 每个问题都能加深家长的焦虑感并自然导向我们的解决方案\n4）推荐服务套餐时的定价锚定策略 — 如何让家长觉得「相比 32.7 万学费，这笔钱花得值」\n5）诊断结束后的转化话术 — 如何从「了解情况」自然过渡到「约试听/付费诊断」",
    en: "I need to do a needs assessment for a BASIS parent to drive conversion. Known info: child's grade [ ], current GPA [ ], main challenges [ ], parent's top concern [ ].\n\nMarket data (for internal analysis, don't recite to parents):\n- 68% GPA decline in year 1 → GPA < 3.0 is high-risk\n- 65% new student knowledge gaps → first 6 months is the golden intervention window\n- 58% G10-11 students struggle with course transitions → AP pressure explosion period\n- 327K/year tuition → parents are extremely ROI-sensitive\n\nPlease help me:\n1) Assess urgency (red/yellow/green) based on grade + GPA, with scripts to make the parent feel the urgency\n2) Analyze core needs vs hidden needs (what they say vs what they actually fear)\n3) Design 5 'diagnostic questions' — each should deepen anxiety and naturally lead to our solution\n4) Pricing anchor strategy — how to make parents feel 'compared to 327K tuition, this is a no-brainer'\n5) Post-diagnosis conversion script — transition from 'understanding the situation' to 'book trial / paid assessment'",
    "zh-TW": "我需要為一位 BASIS 家長做需求診斷以推動成交。已知信息：孩子年級 [  ]，目前 GPA [  ]，主要困難 [  ]，家長最關心的問題 [  ]。\n\n背景數據（用於內部判斷，不要直接念給家長）：\n- 68% 首年 GPA 下滑 → GPA < 3.0 的屬於高危\n- 65% 新生知識斷層 → 轉入生前 6 個月是黃金干預期\n- 58% 高二學生課程銜接困境 → G10-11 是 AP 壓力爆發期\n- 學費 32.7 萬 → 家長對 ROI 極度敏感\n\n請幫我：\n1）基於年級 + GPA 判斷緊急程度（紅/黃/綠），並給出話術讓家長感知緊迫性\n2）分析核心需求 vs 隱性需求（家長說的 vs 家長真正怕的）\n3）設計 5 個「診斷式提問」— 每個問題都能加深家長的焦慮感並自然導向我們的解決方案\n4）推薦服務套餐時的定價錨定策略 — 如何讓家長覺得「相比 32.7 萬學費，這筆錢花得值」\n5）診斷結束後的轉化話術 — 如何從「了解情況」自然過渡到「約試聽/付費診斷」",
  },
  // Stage 4: 异议处理 (Objection Handling)
  "welcome.consultant.objection.title": {
    "zh-CN": "异议处理",
    en: "Objection Handling",
    "zh-TW": "異議處理",
  },
  "welcome.consultant.objection.desc": {
    "zh-CN": "市场上 ~0 家做 BASIS 同步辅导 — 用稀缺性击穿犹豫",
    en: "~0 providers offer BASIS sync tutoring — use scarcity to break hesitation",
    "zh-TW": "市場上 ~0 家做 BASIS 同步輔導 — 用稀缺性擊穿猶豫",
  },
  "welcome.consultant.objection.prompt": {
    "zh-CN": "家长提出了以下异议：[请描述，如「太贵了」「AI不靠谱」「已经请了家教」「孩子不配合」「再考虑看看」等]\n\n请针对这个异议，结合以下数据弹药库生成应对方案：\n\n数据弹药（按需使用）：\n- 「太贵」→ 32.7 万/年学费，辅导费仅占学费的 X%，是保护学费投资的保险\n- 「AI不靠谱」→ 市场上 85% 家长在找人工家教，但懂 BASIS 体系的老师几乎没有，AI 反而能覆盖 38 门 AP 全科\n- 「已有家教」→ 市场调研显示师资严重短缺且质量参差，问家长：您的家教教过 BASIS 体系吗？\n- 「不急」→ 42% 家长开学 3 个月内就开始找辅导，68% 首年 GPA 滑坡，越早干预效果越好\n- 「再考虑」→ 每天都有新家长在咨询，名额有限\n\n请帮我：\n1）分析异议背后的真实恐惧（不是表面意思）\n2）给出 3 种话术（温和→中等→强势），每种都带具体数据\n3）如果家长连续拒绝 2 次，给出「退一步进两步」策略（免费诊断/体验课/资料包）\n4）话术结尾必须引导到下一步行动（约时间/发资料/加微信）",
    en: "A parent raised this objection: [describe, e.g. 'too expensive', 'AI is unreliable', 'already have a tutor', 'child won't cooperate', 'need to think about it']\n\nPlease generate counter-strategies using this data arsenal:\n\nData ammo (use as needed):\n- 'Too expensive' → 327K/year tuition; tutoring is X% of tuition cost, it's insurance protecting that investment\n- 'AI unreliable' → 85% of parents seek human tutors, but teachers who know BASIS are nearly nonexistent; AI covers all 38 AP subjects\n- 'Already have a tutor' → Market research shows severe teacher shortage with inconsistent quality. Ask: does your tutor know the BASIS system?\n- 'Not urgent' → 42% of parents seek help within 3 months; 68% see GPA decline in year 1; earlier intervention = better results\n- 'Need to think' → New parents inquire every day; limited spots available\n\nPlease:\n1) Analyze the real fear behind the objection (not the surface meaning)\n2) Provide 3 scripts (soft → medium → assertive), each with specific data points\n3) If parent rejects twice, give a 'step back to leap forward' strategy (free diagnosis/trial/resource pack)\n4) Every script must end with a next-action call (schedule time/send materials/add on WeChat)",
    "zh-TW": "家長提出了以下異議：[請描述，如「太貴了」「AI不靠譜」「已經請了家教」「孩子不配合」「再考慮看看」等]\n\n請針對這個異議，結合以下數據彈藥庫生成應對方案：\n\n數據彈藥（按需使用）：\n- 「太貴」→ 32.7 萬/年學費，輔導費僅佔學費的 X%，是保護學費投資的保險\n- 「AI不靠譜」→ 市場上 85% 家長在找人工家教，但懂 BASIS 體系的老師幾乎沒有，AI 反而能覆蓋 38 門 AP 全科\n- 「已有家教」→ 市場調研顯示師資嚴重短缺且質量參差，問家長：您的家教教過 BASIS 體系嗎？\n- 「不急」→ 42% 家長開學 3 個月內就開始找輔導，68% 首年 GPA 滑坡，越早干預效果越好\n- 「再考慮」→ 每天都有新家長在諮詢，名額有限\n\n請幫我：\n1）分析異議背後的真實恐懼（不是表面意思）\n2）給出 3 種話術（溫和→中等→強勢），每種都帶具體數據\n3）如果家長連續拒絕 2 次，給出「退一步進兩步」策略（免費診斷/體驗課/資料包）\n4）話術結尾必須引導到下一步行動（約時間/發資料/加微信）",
  },
  // Stage 5: 成交推进 (Closing / Conversion)
  "welcome.consultant.closing.title": {
    "zh-CN": "成交推进",
    en: "Closing Strategy",
    "zh-TW": "成交推進",
  },
  "welcome.consultant.closing.desc": {
    "zh-CN": "42% 家长开学 3 月内找辅导 — 抓住窗口期促成签约",
    en: "42% seek help within 3 months of enrollment — close in the window",
    "zh-TW": "42% 家長開學 3 月內找輔導 — 抓住窗口期促成簽約",
  },
  "welcome.consultant.closing.prompt": {
    "zh-CN": "一位 BASIS 家长处于阶段：[试听前 / 试听后 / 二次跟进 / 犹豫期]。家长情况：[补充]。\n\n成交心理学工具箱：\n- 损失厌恶：「每耽误一天，GPA 恢复难度就增加一分。68% 的学生首年 GPA 滑坡，等到成绩单出来再补就晚了」\n- 社会认同：「您知道吗？85% 的 BASIS 家长都在给孩子补课，只是不公开说」\n- 稀缺性：「目前深圳市场上几乎没有专门做 BASIS 课程同步辅导的机构，我们的名额确实有限」\n- 沉没成本：「您已经为 BASIS 投入了 30 多万学费，这笔辅导费是保护那笔投资的最小成本」\n- 时间锚定：「42% 的家长在开学 3 个月内就开始找辅导，说明问题发现得越早，解决成本越低」\n\n请帮我：\n1）根据家长当前阶段，选择最有效的 2 个心理工具，生成完整话术\n2）设计从「犹豫」到「行动」的临门一脚话术（限时优惠/名额有限/免费加赠）\n3）如果家长说「再考虑」— 给出 3 套不同强度的挽回方案\n4）签约后的第一句话 — 让家长感到「做了正确决定」的确认话术",
    en: "A BASIS parent is at stage: [pre-trial / post-trial / second follow-up / decision period]. Profile: [add info].\n\nPsychological closing toolkit:\n- Loss aversion: 'Every day delayed makes GPA recovery harder. 68% see decline in year 1 — waiting for the report card is too late'\n- Social proof: 'Did you know 85% of BASIS parents are secretly tutoring? They just don't talk about it'\n- Scarcity: 'There are virtually zero institutions offering BASIS curriculum-sync tutoring in Shenzhen. Our spots are genuinely limited'\n- Sunk cost: 'You've invested 327K in BASIS tuition. This tutoring fee is the minimum cost to protect that investment'\n- Time anchor: '42% of parents seek help within 3 months. The earlier the intervention, the lower the cost'\n\nPlease:\n1) Based on current stage, pick the 2 most effective psychological tools and generate full scripts\n2) Design the 'final push' script (limited-time offer / limited spots / free bonus)\n3) If parent says 'let me think' — provide 3 escalating recovery plans\n4) Post-signing first message — confirmation script that makes parent feel they made the right choice",
    "zh-TW": "一位 BASIS 家長處於階段：[試聽前 / 試聽後 / 二次跟進 / 猶豫期]。家長情況：[補充]。\n\n成交心理學工具箱：\n- 損失厭惡：「每耽誤一天，GPA 恢復難度就增加一分。68% 的學生首年 GPA 滑坡，等到成績單出來再補就晚了」\n- 社會認同：「您知道嗎？85% 的 BASIS 家長都在給孩子補課，只是不公開說」\n- 稀缺性：「目前深圳市場上幾乎沒有專門做 BASIS 課程同步輔導的機構，我們的名額確實有限」\n- 沉沒成本：「您已經為 BASIS 投入了 30 多萬學費，這筆輔導費是保護那筆投資的最小成本」\n- 時間錨定：「42% 的家長在開學 3 個月內就開始找輔導，說明問題發現得越早，解決成本越低」\n\n請幫我：\n1）根據家長當前階段，選擇最有效的 2 個心理工具，生成完整話術\n2）設計從「猶豫」到「行動」的臨門一腳話術（限時優惠/名額有限/免費加贈）\n3）如果家長說「再考慮」— 給出 3 套不同強度的挽回方案\n4）簽約後的第一句話 — 讓家長感到「做了正確決定」的確認話術",
  },
  // Stage 6: 售后答疑 (After-Sales / Retention)
  "welcome.consultant.afterSales.title": {
    "zh-CN": "售后续费",
    en: "Retention & Upsell",
    "zh-TW": "售後續費",
  },
  "welcome.consultant.afterSales.desc": {
    "zh-CN": "签约不是终点 — 用效果数据推动续费和转介绍",
    en: "Signing isn't the end — use results data to drive renewal & referrals",
    "zh-TW": "簽約不是終點 — 用效果數據推動續費和轉介紹",
  },
  "welcome.consultant.afterSales.prompt": {
    "zh-CN": "一位已签约家长遇到以下情况：[使用疑问 / 效果质疑 / 续费到期 / 转介绍意向 / 投诉 / 其他]。具体：[  ]。\n\n续费/转介绍核心逻辑：\n- 效果可视化：用 GPA 变化趋势、答题正确率、学习时长等数据让家长「看到」投资回报\n- 恐惧延续：「停课后 GPA 回落的风险很高，85% 的 BASIS 家长持续补课是有原因的」\n- 社交裂变：「您推荐的朋友报名，双方各享 XX 优惠。大部分家长都是通过口碑了解我们的」\n\n请帮我：\n1）分析家长当前情绪状态（满意/中立/不满），给出对应沟通策略\n2）准备带数据的效果报告话术 — 让家长觉得「钱花得值」\n3）续费话术：如何从「服务跟进」自然过渡到「续费引导」（不能太生硬）\n4）转介绍激活话术：如何让满意的家长主动帮我们推荐（给出具体台词）\n5）如果是投诉/不满 — 先共情再用数据化解，最终目标仍是留住客户",
    en: "A signed parent has this situation: [usage question / questioning results / renewal due / referral interest / complaint / other]. Details: [ ].\n\nRenewal/referral logic:\n- Visualize results: Use GPA trends, accuracy rates, study hours to show ROI\n- Sustain urgency: 'Risk of GPA regression after stopping is high — 85% of BASIS parents continue tutoring for a reason'\n- Social leverage: 'When your referral signs up, both of you get XX discount. Most parents find us through word-of-mouth'\n\nPlease:\n1) Assess parent's emotional state (satisfied/neutral/dissatisfied) and matching strategy\n2) Prepare data-driven results report script — make parent feel 'money well spent'\n3) Renewal script: transition from 'service follow-up' to 'renewal guidance' naturally\n4) Referral activation script: specific lines to get satisfied parents to actively recommend us\n5) If complaint — empathize first, then use data to resolve; ultimate goal is still retention",
    "zh-TW": "一位已簽約家長遇到以下情況：[使用疑問 / 效果質疑 / 續費到期 / 轉介紹意向 / 投訴 / 其他]。具體：[  ]。\n\n續費/轉介紹核心邏輯：\n- 效果可視化：用 GPA 變化趨勢、答題正確率、學習時長等數據讓家長「看到」投資回報\n- 恐懼延續：「停課後 GPA 回落的風險很高，85% 的 BASIS 家長持續補課是有原因的」\n- 社交裂變：「您推薦的朋友報名，雙方各享 XX 優惠。大部分家長都是通過口碑了解我們的」\n\n請幫我：\n1）分析家長當前情緒狀態（滿意/中立/不滿），給出對應溝通策略\n2）準備帶數據的效果報告話術 — 讓家長覺得「錢花得值」\n3）續費話術：如何從「服務跟進」自然過渡到「續費引導」（不能太生硬）\n4）轉介紹激活話術：如何讓滿意的家長主動幫我們推薦（給出具體台詞）\n5）如果是投訴/不滿 — 先共情再用數據化解，最終目標仍是留住客戶",
  },

  // ══════════════════════════════════════════
  // Tags for all scenario cards
  // ══════════════════════════════════════════

  // Parent tags
  "welcome.parent.admissionPrep.tag": { "zh-CN": "新生必备", en: "Essential", "zh-TW": "新生必備" },
  "welcome.parent.gradeDiagnosis.tag": { "zh-CN": "AI 诊断", en: "AI-Powered", "zh-TW": "AI 診斷" },
  "welcome.parent.apSelection.tag": { "zh-CN": "38 门 AP", en: "38 APs", "zh-TW": "38 門 AP" },
  "welcome.parent.probation.tag": { "zh-CN": "紧急干预", en: "Urgent", "zh-TW": "緊急干預" },
  "welcome.parent.collegePlan.tag": { "zh-CN": "全周期", en: "Full Cycle", "zh-TW": "全週期" },
  "welcome.parent.schoolCompare.tag": { "zh-CN": "择校必看", en: "Must-Read", "zh-TW": "擇校必看" },
  "welcome.parent.summerPlan.tag": { "zh-CN": "假期规划", en: "Break Plan", "zh-TW": "假期規劃" },

  // Student tags
  "welcome.student.homework.tag": { "zh-CN": "每日高频", en: "Daily Use", "zh-TW": "每日高頻" },
  "welcome.student.math.tag": { "zh-CN": "学科辅导", en: "Subject", "zh-TW": "學科輔導" },
  "welcome.student.science.tag": { "zh-CN": "学科辅导", en: "Subject", "zh-TW": "學科輔導" },
  "welcome.student.humanities.tag": { "zh-CN": "学科辅导", en: "Subject", "zh-TW": "學科輔導" },
  "welcome.student.apPrep.tag": { "zh-CN": "考季刚需", en: "Exam Season", "zh-TW": "考季剛需" },
  "welcome.student.examCram.tag": { "zh-CN": "考前突击", en: "Last Minute", "zh-TW": "考前突擊" },
  "welcome.student.essayReview.tag": { "zh-CN": "写作提分", en: "Writing", "zh-TW": "寫作提分" },
  "welcome.student.studyPlan.tag": { "zh-CN": "自律神器", en: "Planner", "zh-TW": "自律神器" },

  // Teacher tags
  "welcome.teacher.lessonPlan.tag": { "zh-CN": "试听转化", en: "Convert Trial", "zh-TW": "試聽轉化" },
  "welcome.teacher.emi.tag": { "zh-CN": "信任建立", en: "Trust Build", "zh-TW": "信任建立" },
  "welcome.teacher.diffInstruction.tag": { "zh-CN": "续费利器", en: "Retention", "zh-TW": "續費利器" },
  "welcome.teacher.parentMeeting.tag": { "zh-CN": "家校共赢", en: "Win-Win", "zh-TW": "家校共贏" },
  "welcome.teacher.strugglingStudent.tag": { "zh-CN": "危机转商机", en: "Crisis→Opp", "zh-TW": "危機轉商機" },
  "welcome.teacher.classroomWow.tag": { "zh-CN": "口碑驱动", en: "Word of Mouth", "zh-TW": "口碑驅動" },

  // Consultant tags
  "welcome.consultant.leadResearch.tag": { "zh-CN": "第1步", en: "Step 1", "zh-TW": "第1步" },
  "welcome.consultant.icebreaker.tag": { "zh-CN": "第2步", en: "Step 2", "zh-TW": "第2步" },
  "welcome.consultant.needsAssess.tag": { "zh-CN": "第3步", en: "Step 3", "zh-TW": "第3步" },
  "welcome.consultant.objection.tag": { "zh-CN": "第4步", en: "Step 4", "zh-TW": "第4步" },
  "welcome.consultant.closing.tag": { "zh-CN": "第5步", en: "Step 5", "zh-TW": "第5步" },
  "welcome.consultant.afterSales.tag": { "zh-CN": "第6步", en: "Step 6", "zh-TW": "第6步" },

  // ══════════════════════════════════════════
  // New scenarios: Parent — School Comparison
  // ══════════════════════════════════════════
  "welcome.parent.schoolCompare.title": {
    "zh-CN": "择校对比",
    en: "School Comparison",
    "zh-TW": "擇校對比",
  },
  "welcome.parent.schoolCompare.desc": {
    "zh-CN": "BASIS vs IB vs A-Level，哪个体系最适合我的孩子？",
    en: "BASIS vs IB vs A-Level — which system fits your child best?",
    "zh-TW": "BASIS vs IB vs A-Level，哪個體系最適合我的孩子？",
  },
  "welcome.parent.schoolCompare.prompt": {
    "zh-CN": "我在纠结孩子应该选 BASIS 还是其他国际学校体系（IB / A-Level / 美高 AP）。孩子目前情况：年级 [  ]，性格特点 [  ]，学术强项 [  ]，家庭目标 [  ]。请帮我从课程难度、升学优势、孩子适配度、家庭投入等维度做一个全面的对比分析，并给出明确建议。",
    en: "I'm deciding between BASIS and other international school systems (IB / A-Level / US AP) for my child. Current situation: grade [ ], personality [ ], academic strengths [ ], family goals [ ]. Please provide a comprehensive comparison across curriculum difficulty, college advantages, child fit, and family investment, with a clear recommendation.",
    "zh-TW": "我在糾結孩子應該選 BASIS 還是其他國際學校體系（IB / A-Level / 美高 AP）。孩子目前情況：年級 [  ]，性格特點 [  ]，學術強項 [  ]，家庭目標 [  ]。請幫我從課程難度、升學優勢、孩子適配度、家庭投入等維度做一個全面的對比分析，並給出明確建議。",
  },
  // New scenarios: Parent — Summer / Break Planning
  "welcome.parent.summerPlan.title": {
    "zh-CN": "假期规划",
    en: "Break Planning",
    "zh-TW": "假期規劃",
  },
  "welcome.parent.summerPlan.desc": {
    "zh-CN": "暑假/寒假怎么安排？弯道超车还是查漏补缺",
    en: "Summer/winter break plan — catch up or get ahead",
    "zh-TW": "暑假/寒假怎麼安排？彎道超車還是查漏補缺",
  },
  "welcome.parent.summerPlan.prompt": {
    "zh-CN": "孩子即将进入 [暑假/寒假]，目前年级 [  ]，学术情况 [  ]。请帮我制定一份假期学习规划，包括：1）需要巩固的薄弱科目安排，2）下学期预习重点，3）课外活动/竞赛/夏校推荐，4）每日时间安排建议（学习与休息平衡），5）开学前的自测方案。",
    en: "My child is about to enter [summer/winter] break, currently in grade [ ], academic status [ ]. Please create a break study plan including: 1) Schedule for weak subjects that need reinforcement, 2) Key topics to preview for next semester, 3) Extracurricular/competition/summer program recommendations, 4) Daily schedule suggestion (study-rest balance), 5) Pre-semester self-assessment plan.",
    "zh-TW": "孩子即將進入 [暑假/寒假]，目前年級 [  ]，學術情況 [  ]。請幫我制定一份假期學習規劃，包括：1）需要鞏固的薄弱科目安排，2）下學期預習重點，3）課外活動/競賽/夏校推薦，4）每日時間安排建議（學習與休息平衡），5）開學前的自測方案。",
  },

  // ══════════════════════════════════════════
  // New scenarios: Student — Essay Review
  // ══════════════════════════════════════════
  "welcome.student.essayReview.title": {
    "zh-CN": "Essay 批改",
    en: "Essay Review",
    "zh-TW": "Essay 批改",
  },
  "welcome.student.essayReview.desc": {
    "zh-CN": "论文/作文润色、结构优化、论点加强",
    en: "Polish essays, improve structure & strengthen arguments",
    "zh-TW": "論文/作文潤色、結構優化、論點加強",
  },
  "welcome.student.essayReview.prompt": {
    "zh-CN": "I wrote an essay and need feedback. Please review it for: 1) Thesis clarity and argument strength, 2) Essay structure and paragraph organization, 3) Evidence usage and analysis quality, 4) Grammar and style improvements, 5) A specific score estimate if this is a rubric-based assignment. Here is my essay:\n\n[paste your essay here]",
    en: "I wrote an essay and need feedback. Please review it for: 1) Thesis clarity and argument strength, 2) Essay structure and paragraph organization, 3) Evidence usage and analysis quality, 4) Grammar and style improvements, 5) A specific score estimate if this is a rubric-based assignment. Here is my essay:\n\n[paste your essay here]",
    "zh-TW": "I wrote an essay and need feedback. Please review it for: 1) Thesis clarity and argument strength, 2) Essay structure and paragraph organization, 3) Evidence usage and analysis quality, 4) Grammar and style improvements, 5) A specific score estimate if this is a rubric-based assignment. Here is my essay:\n\n[paste your essay here]",
  },
  // New scenarios: Student — Study Plan
  "welcome.student.studyPlan.title": {
    "zh-CN": "学习计划",
    en: "Study Plan",
    "zh-TW": "學習計劃",
  },
  "welcome.student.studyPlan.desc": {
    "zh-CN": "定制每周学习计划，管理时间、提高效率",
    en: "Custom weekly plan — manage time & boost productivity",
    "zh-TW": "定制每週學習計劃，管理時間、提高效率",
  },
  "welcome.student.studyPlan.prompt": {
    "zh-CN": "I need help creating a weekly study plan. My current courses are [ ], my weakest subject is [ ], and I have [ ] hours available for studying each day after school. Please create a detailed weekly schedule that balances all subjects, prioritizes weak areas, includes breaks, and builds in review sessions.",
    en: "I need help creating a weekly study plan. My current courses are [ ], my weakest subject is [ ], and I have [ ] hours available for studying each day after school. Please create a detailed weekly schedule that balances all subjects, prioritizes weak areas, includes breaks, and builds in review sessions.",
    "zh-TW": "I need help creating a weekly study plan. My current courses are [ ], my weakest subject is [ ], and I have [ ] hours available for studying each day after school. Please create a detailed weekly schedule that balances all subjects, prioritizes weak areas, includes breaks, and builds in review sessions.",
  },

  // ══════════════════════════════════════════
  // New scenarios: Teacher — Differentiated Instruction
  // ══════════════════════════════════════════
  "welcome.teacher.diffInstruction.title": {
    "zh-CN": "学情汇报",
    en: "Progress Reporting",
    "zh-TW": "學情匯報",
  },
  "welcome.teacher.diffInstruction.desc": {
    "zh-CN": "用数据化的进步报告让家长「看见」投资回报 — 续费的最强武器",
    en: "Data-driven progress reports that show parents ROI — the strongest renewal tool",
    "zh-TW": "用數據化的進步報告讓家長「看見」投資回報 — 續費的最強武器",
  },
  "welcome.teacher.diffInstruction.prompt": {
    "zh-CN": "我需要为一位学生准备学情汇报/进步报告。学生年级：[  ]，科目：[  ]，辅导时长：[  ]，当前情况：[  ]。\n\n核心目标：这份报告不是给学校交差的，而是让家长觉得「这笔钱花得太值了」→ 主动续费 + 推荐朋友。\n\n背景：BASIS 家长花 32.7 万/年学费，对 ROI 极度敏感。85% 在补课但只有看到明确进步才会续费。\n\n请帮我生成：\n1）进步数据可视化方案 — 如何把「做了 50 道题」「上了 10 节课」转化为家长能理解的进步指标（正确率变化、知识点掌握率、与 BASIS 大纲进度的同步率等）\n2）「前后对比」话术 — 3 组对比句式，让家长直观感受变化（不能是「进步很大」这种空话）\n3）隐性种草下一阶段 — 如何在汇报进步的同时，自然植入「还有哪些可以更好」→ 续费动机\n4）如果进步不明显 — 如何诚实但不引起恐慌地呈现，同时给出「如果继续辅导，预期改善方向」\n5）汇报结尾的行动引导 — 一句话引导家长做出下一步（续费/加课/推荐朋友）",
    en: "I need to prepare a progress report for a student. Grade: [ ], Subject: [ ], Tutoring duration: [ ], Current situation: [ ].\n\nCore goal: This report isn't for school records — it's to make parents feel 'this money was so well spent' → voluntary renewal + friend referrals.\n\nContext: BASIS parents pay 327K/year tuition, extremely ROI-sensitive. 85% are tutoring but only renew when they see clear progress.\n\nPlease generate:\n1) Progress data visualization — how to convert '50 problems done' and '10 sessions completed' into parent-understandable metrics (accuracy trends, mastery rates, sync rate with BASIS curriculum)\n2) 'Before vs. after' talking points — 3 comparison statements that show tangible change (not vague 'great improvement')\n3) Subtle seeding of next phase — how to naturally introduce 'areas that could be even better' while reporting progress → renewal motivation\n4) If progress is limited — how to present honestly without causing panic, with expected improvement direction if tutoring continues\n5) Report closing action prompt — one sentence guiding parent to next step (renew/add sessions/refer a friend)",
    "zh-TW": "我需要為一位學生準備學情匯報/進步報告。學生年級：[  ]，科目：[  ]，輔導時長：[  ]，當前情況：[  ]。\n\n核心目標：這份報告不是給學校交差的，而是讓家長覺得「這筆錢花得太值了」→ 主動續費 + 推薦朋友。\n\n背景：BASIS 家長花 32.7 萬/年學費，對 ROI 極度敏感。85% 在補課但只有看到明確進步才會續費。\n\n請幫我生成：\n1）進步數據可視化方案 — 如何把「做了 50 道題」「上了 10 節課」轉化為家長能理解的進步指標（正確率變化、知識點掌握率、與 BASIS 大綱進度的同步率等）\n2）「前後對比」話術 — 3 組對比句式，讓家長直觀感受變化（不能是「進步很大」這種空話）\n3）隱性種草下一階段 — 如何在匯報進步的同時，自然植入「還有哪些可以更好」→ 續費動機\n4）如果進步不明顯 — 如何誠實但不引起恐慌地呈現，同時給出「如果繼續輔導，預期改善方向」\n5）匯報結尾的行動引導 — 一句話引導家長做出下一步（續費/加課/推薦朋友）",
  },
  // Teacher — Parent Meeting → conversion-focused
  "welcome.teacher.parentMeeting.title": {
    "zh-CN": "家长会转化",
    en: "Parent Meeting Conversion",
    "zh-TW": "家長會轉化",
  },
  "welcome.teacher.parentMeeting.desc": {
    "zh-CN": "把每次家长会变成信任加固 + 续费/转介绍的黄金机会",
    en: "Turn every parent meeting into a trust-building + renewal/referral opportunity",
    "zh-TW": "把每次家長會變成信任加固 + 續費/轉介紹的黃金機會",
  },
  "welcome.teacher.parentMeeting.prompt": {
    "zh-CN": "我需要准备一场家长会/一对一家长面谈。学生情况：[  ]，会议目的：[定期反馈/成绩问题/续费沟通/其他]。\n\n核心逻辑：家长会不只是汇报学情，而是「用专业度赢得信任 → 用信任推动续费 → 用满意度激发转介绍」的三步走。\n\n请帮我准备：\n1）开场 2 分钟 — 如何用一个具体的「孩子进步细节」拉近距离（不是泛泛的夸奖，是让家长觉得「这个老师真的在关注我的孩子」）\n2）学情展示 5 分钟 — 用数据说话的进步汇报（参考 85% 家长在补课的大环境，暗示「您的选择是对的」）\n3）问题沟通 3 分钟 — 如何把「孩子还有不足」说成「下一阶段的增长点」（既诚实又不让家长觉得白花钱了）\n4）续费/加课铺垫 2 分钟 — 如何从学情自然过渡到续费建议（不生硬，让家长主动问「那下一步怎么安排？」）\n5）转介绍种草 1 分钟 — 最后一分钟如何自然植入「您身边有朋友也在 BASIS 吗？」\n6）会后微信跟进模板 — 会议记录 + 感谢 + 行动项 + 转介绍暗示",
    en: "I need to prepare for a parent meeting / one-on-one parent conference. Student info: [ ], Meeting purpose: [regular feedback / grade issues / renewal discussion / other].\n\nCore logic: Parent meetings aren't just progress reports — they're a three-step process: 'win trust through expertise → leverage trust for renewal → convert satisfaction into referrals.'\n\nPlease prepare:\n1) Opening 2 minutes — how to use a specific 'child's progress detail' to build rapport (not generic praise — make the parent feel 'this teacher really pays attention to my child')\n2) Progress presentation 5 minutes — data-driven progress report (reference the 85% tutoring rate environment, subtly affirm 'you made the right choice')\n3) Issue communication 3 minutes — how to frame 'areas for improvement' as 'next growth opportunities' (honest yet doesn't make parent feel money was wasted)\n4) Renewal/upsell setup 2 minutes — how to naturally transition from progress to renewal suggestion (not pushy — make parent ask 'so what's the next step?')\n5) Referral seeding 1 minute — how to naturally drop 'do any of your friends also have kids at BASIS?'\n6) Post-meeting WeChat follow-up template — meeting notes + thanks + action items + referral hint",
    "zh-TW": "我需要準備一場家長會/一對一家長面談。學生情況：[  ]，會議目的：[定期反饋/成績問題/續費溝通/其他]。\n\n核心邏輯：家長會不只是匯報學情，而是「用專業度贏得信任 → 用信任推動續費 → 用滿意度激發轉介紹」的三步走。\n\n請幫我準備：\n1）開場 2 分鐘 — 如何用一個具體的「孩子進步細節」拉近距離（不是泛泛的誇獎，是讓家長覺得「這個老師真的在關注我的孩子」）\n2）學情展示 5 分鐘 — 用數據說話的進步匯報（參考 85% 家長在補課的大環境，暗示「您的選擇是對的」）\n3）問題溝通 3 分鐘 — 如何把「孩子還有不足」說成「下一階段的增長點」（既誠實又不讓家長覺得白花錢了）\n4）續費/加課鋪墊 2 分鐘 — 如何從學情自然過渡到續費建議（不生硬，讓家長主動問「那下一步怎麼安排？」）\n5）轉介紹種草 1 分鐘 — 最後一分鐘如何自然植入「您身邊有朋友也在 BASIS 嗎？」\n6）會後微信跟進模板 — 會議記錄 + 感謝 + 行動項 + 轉介紹暗示",
  },

  // Teacher — Struggling Student Communication (new)
  "welcome.teacher.strugglingStudent.title": {
    "zh-CN": "学困生沟通",
    en: "Struggling Student Talk",
    "zh-TW": "學困生溝通",
  },
  "welcome.teacher.strugglingStudent.desc": {
    "zh-CN": "学生成绩下滑时的家长沟通 — 把危机变成深度绑定的机会",
    en: "Parent communication when grades drop — turn crisis into deeper engagement",
    "zh-TW": "學生成績下滑時的家長溝通 — 把危機變成深度綁定的機會",
  },
  "welcome.teacher.strugglingStudent.prompt": {
    "zh-CN": "我带的一个学生成绩下滑了，需要和家长沟通。年级：[  ]，科目：[  ]，成绩变化：[  ]，下滑原因分析：[  ]。\n\n核心思路：成绩下滑是「危机」，但处理好了反而是加深信任、增加课时的最佳时机。68% 的 BASIS 新生首年 GPA 下滑，这不是个例。\n\n请帮我准备：\n1）开场破冰 — 如何在传递坏消息前先建立安全感（不是避重就轻，而是让家长感到「这个老师站在我这边」）\n2）问题归因话术 — 如何解释成绩下滑（归因到 BASIS 体系的客观难度 + 知识断层 + 适应期，而非教学质量问题）\n   - 数据支撑：「65% 新生存在知识断层」「58% G10-11 课程衔接困难」→ 这是普遍现象，不是你孩子的问题\n3）解决方案呈现 — 先给出免费的「加餐方案」（额外的作业点评/知识点梳理），再建议加课时（让家长觉得你真心帮孩子，不是在推销）\n4）情绪安抚话术 — 如果家长反应激烈（愤怒/焦虑/质疑教学质量），3 种情绪对应的安抚和引导话术\n5）化危为机的加课话术 — 如何把「需要补救」转化为「需要加大投入」的合理建议",
    en: "One of my students has declining grades and I need to talk to their parent. Grade: [ ], Subject: [ ], Grade change: [ ], Analysis of decline: [ ].\n\nCore approach: Grade decline is a 'crisis', but handled well it becomes the best opportunity to deepen trust and increase lesson hours. 68% of BASIS freshmen experience GPA decline in year 1 — this is not unique.\n\nPlease prepare:\n1) Opening icebreaker — how to create safety before delivering bad news (not sugarcoating, but making parent feel 'this teacher is on my side')\n2) Attribution framing — how to explain the decline (attribute to BASIS system difficulty + knowledge gaps + adjustment period, NOT teaching quality)\n   - Data support: '65% of new students have knowledge gaps', '58% of G10-11 struggle with course transitions' → this is common, not your child's fault\n3) Solution presentation — first offer free 'extra support' (homework review/concept mapping), then suggest additional sessions (parent should feel you genuinely care, not upselling)\n4) Emotional management scripts — if parent reacts strongly (angry/anxious/questioning quality), 3 scripts matching each emotional state\n5) Crisis-to-opportunity upsell — how to reframe 'needs remediation' as 'needs increased investment'",
    "zh-TW": "我帶的一個學生成績下滑了，需要和家長溝通。年級：[  ]，科目：[  ]，成績變化：[  ]，下滑原因分析：[  ]。\n\n核心思路：成績下滑是「危機」，但處理好了反而是加深信任、增加課時的最佳時機。68% 的 BASIS 新生首年 GPA 下滑，這不是個例。\n\n請幫我準備：\n1）開場破冰 — 如何在傳遞壞消息前先建立安全感（不是避重就輕，而是讓家長感到「這個老師站在我這邊」）\n2）問題歸因話術 — 如何解釋成績下滑（歸因到 BASIS 體系的客觀難度 + 知識斷層 + 適應期，而非教學質量問題）\n   - 數據支撐：「65% 新生存在知識斷層」「58% G10-11 課程銜接困難」→ 這是普遍現象，不是你孩子的問題\n3）解決方案呈現 — 先給出免費的「加餐方案」（額外的作業點評/知識點梳理），再建議加課時（讓家長覺得你真心幫孩子，不是在推銷）\n4）情緒安撫話術 — 如果家長反應激烈（憤怒/焦慮/質疑教學質量），3 種情緒對應的安撫和引導話術\n5）化危為機的加課話術 — 如何把「需要補救」轉化為「需要加大投入」的合理建議",
  },
  // Teacher — Classroom Highlights / Word-of-Mouth (new)
  "welcome.teacher.classroomWow.title": {
    "zh-CN": "课堂亮点",
    en: "Classroom Highlights",
    "zh-TW": "課堂亮點",
  },
  "welcome.teacher.classroomWow.desc": {
    "zh-CN": "让学生回家主动说「今天课太好了」— 口碑裂变从课堂开始",
    en: "Make students go home saying 'today's class was amazing' — word-of-mouth starts here",
    "zh-TW": "讓學生回家主動說「今天課太好了」— 口碑裂變從課堂開始",
  },
  "welcome.teacher.classroomWow.prompt": {
    "zh-CN": "我需要设计一堂让学生回家「主动跟家长分享」的课程。科目：[  ]，年级：[  ]，课题：[  ]。\n\n核心目标：口碑转介绍是最低成本的获客方式。当学生回家兴奋地说「今天老师教了一个超酷的东西」，家长会：1）觉得钱花得值 → 续费，2）跟其他家长分享 → 新客。\n\n请帮我设计：\n1）「回家能讲」的知识设计 — 如何把课程内容包装成学生能在饭桌上复述给家长听的故事/发现/成就感\n   - 不是表演式教学，而是让学生真正觉得「我今天学到了很厉害的东西」\n2）成就感触发器 — 3 个让学生体验到「我好厉害」的课堂环节设计（对比前后能力差、挑战 → 突破 → 庆祝）\n3）家长可见的「彩蛋」 — 如何在课后自然地让成果可视化（课后作品照片、小测成绩截图、进步对比图），方便学生/家长发朋友圈\n4）学生口碑话术引导 — 如何在课程尾声用一句话让学生主动回家分享（「今天回家问问爸妈，他们知不知道 [课程中的有趣知识点]？」）\n5）朋友圈素材设计 — 一条家长可以直接转发的朋友圈文案 + 配图建议（自然不做作，展示孩子进步）",
    en: "I need to design a lesson that makes students go home and 'voluntarily share with parents.' Subject: [ ], Grade: [ ], Topic: [ ].\n\nCore goal: Word-of-mouth referrals are the lowest-cost acquisition channel. When a student goes home excited saying 'my teacher taught something super cool today,' parents will: 1) feel money well spent → renew, 2) share with other parents → new leads.\n\nPlease design:\n1) 'Dinner-table stories' — how to package content so students can retell it to parents as a story/discovery/achievement\n   - Not performative teaching, but making students genuinely feel 'I learned something impressive today'\n2) Achievement triggers — 3 classroom moments that make students feel 'I'm awesome' (before/after contrast, challenge → breakthrough → celebration)\n3) Parent-visible 'Easter eggs' — how to naturally make results visible after class (photos of student work, quiz score screenshots, progress comparisons) for easy WeChat Moments sharing\n4) Student word-of-mouth prompt — one sentence at the end of class to trigger sharing ('go home and ask your parents if they know [interesting fact from today's lesson]!')\n5) WeChat Moments template — a ready-to-forward post for parents (natural, not salesy, showcasing child's progress)",
    "zh-TW": "我需要設計一堂讓學生回家「主動跟家長分享」的課程。科目：[  ]，年級：[  ]，課題：[  ]。\n\n核心目標：口碑轉介紹是最低成本的獲客方式。當學生回家興奮地說「今天老師教了一個超酷的東西」，家長會：1）覺得錢花得值 → 續費，2）跟其他家長分享 → 新客。\n\n請幫我設計：\n1）「回家能講」的知識設計 — 如何把課程內容包裝成學生能在飯桌上複述給家長聽的故事/發現/成就感\n   - 不是表演式教學，而是讓學生真正覺得「我今天學到了很厲害的東西」\n2）成就感觸發器 — 3 個讓學生體驗到「我好厲害」的課堂環節設計（對比前後能力差、挑戰 → 突破 → 慶祝）\n3）家長可見的「彩蛋」 — 如何在課後自然地讓成果可視化（課後作品照片、小測成績截圖、進步對比圖），方便學生/家長發朋友圈\n4）學生口碑話術引導 — 如何在課程尾聲用一句話讓學生主動回家分享（「今天回家問問爸媽，他們知不知道 [課程中的有趣知識點]？」）\n5）朋友圈素材設計 — 一條家長可以直接轉發的朋友圈文案 + 配圖建議（自然不做作，展示孩子進步）",
  },

  // ── Scenario Form Fields (HITL) ──────────────────────

  // Form labels
  "welcome.form.grade": { "zh-CN": "年级", en: "Grade", "zh-TW": "年級" },
  "welcome.form.campus": { "zh-CN": "校区", en: "Campus", "zh-TW": "校區" },
  "welcome.form.schoolType": { "zh-CN": "当前学校类型", en: "Current School Type", "zh-TW": "當前學校類型" },
  "welcome.form.englishLevel": { "zh-CN": "英语水平", en: "English Level", "zh-TW": "英語水平" },
  "welcome.form.subjects": { "zh-CN": "关注学科", en: "Subjects of Concern", "zh-TW": "關注學科" },
  "welcome.form.gpa": { "zh-CN": "当前 GPA", en: "Current GPA", "zh-TW": "當前 GPA" },
  "welcome.form.interests": { "zh-CN": "兴趣学科", en: "Subjects of Interest", "zh-TW": "興趣學科" },
  "welcome.form.apsTaken": { "zh-CN": "已修 AP 数量", en: "Number of APs Taken", "zh-TW": "已修 AP 數量" },
  "welcome.form.probationSubjects": { "zh-CN": "保级学科", en: "Probation Subjects", "zh-TW": "保級學科" },
  "welcome.form.topic": { "zh-CN": "主题", en: "Topic", "zh-TW": "主題" },
  "welcome.form.question": { "zh-CN": "问题描述", en: "Describe Your Question", "zh-TW": "問題描述" },
  "welcome.form.scienceSubject": { "zh-CN": "科学学科", en: "Science Subject", "zh-TW": "科學學科" },
  "welcome.form.humSubject": { "zh-CN": "人文学科", en: "Humanities Subject", "zh-TW": "人文學科" },
  "welcome.form.assignmentType": { "zh-CN": "作业类型", en: "Assignment Type", "zh-TW": "作業類型" },
  "welcome.form.apSubject": { "zh-CN": "AP 科目", en: "AP Subject", "zh-TW": "AP 科目" },
  "welcome.form.examMonth": { "zh-CN": "考试月份", en: "Exam Month", "zh-TW": "考試月份" },
  "welcome.form.teachSubject": { "zh-CN": "教授学科", en: "Teaching Subject", "zh-TW": "教授學科" },
  "welcome.form.gradeLevel": { "zh-CN": "年级", en: "Grade Level", "zh-TW": "年級" },
  "welcome.form.challenge": { "zh-CN": "教学挑战", en: "Teaching Challenge", "zh-TW": "教學挑戰" },

  // Form placeholders
  "welcome.form.selectPlaceholder": { "zh-CN": "请选择...", en: "Select...", "zh-TW": "請選擇..." },
  "welcome.form.gpa.placeholder": { "zh-CN": "例如 3.5", en: "e.g. 3.5", "zh-TW": "例如 3.5" },
  "welcome.form.apsTaken.placeholder": { "zh-CN": "例如 3", en: "e.g. 3", "zh-TW": "例如 3" },
  "welcome.form.topic.math.placeholder": { "zh-CN": "例如 Taylor Series", en: "e.g. Taylor Series", "zh-TW": "例如 Taylor Series" },
  "welcome.form.topic.science.placeholder": { "zh-CN": "例如 Newton's Laws", en: "e.g. Newton's Laws", "zh-TW": "例如 Newton's Laws" },
  "welcome.form.topic.lesson.placeholder": { "zh-CN": "例如 Quadratic Equations", en: "e.g. Quadratic Equations", "zh-TW": "例如 Quadratic Equations" },
  "welcome.form.question.placeholder": { "zh-CN": "描述你遇到的问题...", en: "Describe the problem you're facing...", "zh-TW": "描述你遇到的問題..." },
  "welcome.form.apSubject.placeholder": { "zh-CN": "例如 AP Calculus BC", en: "e.g. AP Calculus BC", "zh-TW": "例如 AP Calculus BC" },
  "welcome.form.challenge.placeholder": { "zh-CN": "描述您在 EMI 教学中遇到的挑战...", en: "Describe challenges you face in EMI teaching...", "zh-TW": "描述您在 EMI 教學中遇到的挑戰..." },

  // Form buttons
  "welcome.form.start": { "zh-CN": "开始对话", en: "Start Chat", "zh-TW": "開始對話" },
  "welcome.form.cancel": { "zh-CN": "取消", en: "Cancel", "zh-TW": "取消" },

  // Grade options (G1–G12)
  "welcome.form.grade.g1": { "zh-CN": "G1", en: "G1", "zh-TW": "G1" },
  "welcome.form.grade.g2": { "zh-CN": "G2", en: "G2", "zh-TW": "G2" },
  "welcome.form.grade.g3": { "zh-CN": "G3", en: "G3", "zh-TW": "G3" },
  "welcome.form.grade.g4": { "zh-CN": "G4", en: "G4", "zh-TW": "G4" },
  "welcome.form.grade.g5": { "zh-CN": "G5", en: "G5", "zh-TW": "G5" },
  "welcome.form.grade.g6": { "zh-CN": "G6", en: "G6", "zh-TW": "G6" },
  "welcome.form.grade.g7": { "zh-CN": "G7", en: "G7", "zh-TW": "G7" },
  "welcome.form.grade.g8": { "zh-CN": "G8", en: "G8", "zh-TW": "G8" },
  "welcome.form.grade.g9": { "zh-CN": "G9", en: "G9", "zh-TW": "G9" },
  "welcome.form.grade.g10": { "zh-CN": "G10", en: "G10", "zh-TW": "G10" },
  "welcome.form.grade.g11": { "zh-CN": "G11", en: "G11", "zh-TW": "G11" },
  "welcome.form.grade.g12": { "zh-CN": "G12", en: "G12", "zh-TW": "G12" },

  // Campus options
  "welcome.form.campus.shenzhen": { "zh-CN": "深圳贝赛思", en: "BASIS Shenzhen", "zh-TW": "深圳貝賽思" },
  "welcome.form.campus.guangzhou": { "zh-CN": "广州贝赛思", en: "BASIS Guangzhou", "zh-TW": "廣州貝賽思" },
  "welcome.form.campus.hangzhou": { "zh-CN": "杭州贝赛思", en: "BASIS Hangzhou", "zh-TW": "杭州貝賽思" },
  "welcome.form.campus.huizhou": { "zh-CN": "惠州贝赛思", en: "BASIS Huizhou", "zh-TW": "惠州貝賽思" },
  "welcome.form.campus.nanjing": { "zh-CN": "南京贝赛思", en: "BASIS Nanjing", "zh-TW": "南京貝賽思" },
  "welcome.form.campus.chengdu": { "zh-CN": "成都贝赛思", en: "BASIS Chengdu", "zh-TW": "成都貝賽思" },
  "welcome.form.campus.wuhan": { "zh-CN": "武汉贝赛思", en: "BASIS Wuhan", "zh-TW": "武漢貝賽思" },

  // Subject options
  "welcome.form.subject.math": { "zh-CN": "数学", en: "Math", "zh-TW": "數學" },
  "welcome.form.subject.physics": { "zh-CN": "物理", en: "Physics", "zh-TW": "物理" },
  "welcome.form.subject.chemistry": { "zh-CN": "化学", en: "Chemistry", "zh-TW": "化學" },
  "welcome.form.subject.biology": { "zh-CN": "生物", en: "Biology", "zh-TW": "生物" },
  "welcome.form.subject.ela": { "zh-CN": "英语语言艺术", en: "ELA", "zh-TW": "英語語言藝術" },
  "welcome.form.subject.history": { "zh-CN": "历史", en: "History", "zh-TW": "歷史" },
  "welcome.form.subject.worldLang": { "zh-CN": "世界语言", en: "World Languages", "zh-TW": "世界語言" },
  "welcome.form.subject.arts": { "zh-CN": "艺术", en: "Arts", "zh-TW": "藝術" },

  // School type options
  "welcome.form.schoolType.public": { "zh-CN": "公立学校", en: "Public School", "zh-TW": "公立學校" },
  "welcome.form.schoolType.international": { "zh-CN": "国际学校", en: "International School", "zh-TW": "國際學校" },
  "welcome.form.schoolType.private": { "zh-CN": "民办学校", en: "Private School", "zh-TW": "民辦學校" },

  // English level options
  "welcome.form.englishLevel.beginner": { "zh-CN": "入门", en: "Beginner", "zh-TW": "入門" },
  "welcome.form.englishLevel.intermediate": { "zh-CN": "中级", en: "Intermediate", "zh-TW": "中級" },
  "welcome.form.englishLevel.advanced": { "zh-CN": "高级", en: "Advanced", "zh-TW": "高級" },

  // Assignment type options
  "welcome.form.assignmentType.essay": { "zh-CN": "Essay", en: "Essay", "zh-TW": "Essay" },
  "welcome.form.assignmentType.analysis": { "zh-CN": "Analysis", en: "Analysis", "zh-TW": "Analysis" },
  "welcome.form.assignmentType.dbq": { "zh-CN": "DBQ", en: "DBQ", "zh-TW": "DBQ" },
  "welcome.form.assignmentType.reading": { "zh-CN": "Reading", en: "Reading", "zh-TW": "Reading" },

  // Exam month options
  "welcome.form.examMonth.may": { "zh-CN": "五月", en: "May", "zh-TW": "五月" },
  "welcome.form.examMonth.other": { "zh-CN": "其他", en: "Other", "zh-TW": "其他" },
};

export default welcome;
