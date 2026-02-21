import type { Locale } from "../types";

const onboarding: Record<string, Record<Locale, string>> = {
  // Onboarding page
  "onboarding.title.edit": {
    "zh-CN": "更新你的资料",
    en: "Update Your Profile",
    "zh-TW": "更新你的資料",
  },
  "onboarding.title.new": {
    "zh-CN": "完善你的资料",
    en: "Complete Your Profile",
    "zh-TW": "完善你的資料",
  },
  "onboarding.subtitle.edit": {
    "zh-CN": "修改你的学习画像，获得更精准的 AI 建议",
    en: "Update your learning profile for more accurate AI recommendations",
    "zh-TW": "修改你的學習畫像，獲得更精準的 AI 建議",
  },
  "onboarding.subtitle.new": {
    "zh-CN": "帮助我们为你提供更精准的 AI 学习建议",
    en: "Help us provide more accurate AI learning recommendations",
    "zh-TW": "幫助我們為你提供更精準的 AI 學習建議",
  },
  "onboarding.footer": {
    "zh-CN": "这些信息仅用于个性化推荐，你随时可以在设置中修改",
    en: "This information is only used for personalized recommendations. You can update it anytime in settings",
    "zh-TW": "這些資訊僅用於個性化推薦，你隨時可以在設定中修改",
  },
  "onboarding.backToHome": {
    "zh-CN": "返回主页",
    en: "Back to Home",
    "zh-TW": "返回主頁",
  },

  // RoleSelector
  "role.title": {
    "zh-CN": "选择你的身份",
    en: "Choose Your Role",
    "zh-TW": "選擇你的身份",
  },
  "role.subtitle": {
    "zh-CN": "我们将为你提供个性化的 AI 学习体验",
    en: "We'll provide a personalized AI learning experience for you",
    "zh-TW": "我們將為你提供個性化的 AI 學習體驗",
  },
  "role.student": {
    "zh-CN": "我是学生",
    en: "I'm a Student",
    "zh-TW": "我是學生",
  },
  "role.student.desc": {
    "zh-CN": "BASIS 在读学生，获取 AI 学伴辅导",
    en: "Current BASIS student, get AI tutoring support",
    "zh-TW": "BASIS 在讀學生，獲取 AI 學伴輔導",
  },
  "role.parent": {
    "zh-CN": "我是家长",
    en: "I'm a Parent",
    "zh-TW": "我是家長",
  },
  "role.parent.desc": {
    "zh-CN": "关注孩子的学业发展与规划",
    en: "Focus on your child's academic development and planning",
    "zh-TW": "關注孩子的學業發展與規劃",
  },
  "role.teacher": {
    "zh-CN": "我是老师",
    en: "I'm a Teacher",
    "zh-TW": "我是老師",
  },
  "role.teacher.desc": {
    "zh-CN": "教学辅助、学情分析与报告",
    en: "Teaching assistance, learning analytics & reports",
    "zh-TW": "教學輔助、學情分析與報告",
  },
  "role.error.setFailed": {
    "zh-CN": "设置角色失败",
    en: "Failed to set role",
    "zh-TW": "設置角色失敗",
  },
  "role.error.network": {
    "zh-CN": "网络连接失败",
    en: "Network connection failed",
    "zh-TW": "網路連線失敗",
  },
  "role.setting": {
    "zh-CN": "设置中...",
    en: "Setting up...",
    "zh-TW": "設定中...",
  },
  "role.continue": {
    "zh-CN": "继续",
    en: "Continue",
    "zh-TW": "繼續",
  },

  // StudentProfileForm
  "student.step.school": {
    "zh-CN": "学校信息",
    en: "School Info",
    "zh-TW": "學校資訊",
  },
  "student.step.courses": {
    "zh-CN": "课程信息",
    en: "Course Info",
    "zh-TW": "課程資訊",
  },
  "student.step.preferences": {
    "zh-CN": "学习偏好",
    en: "Preferences",
    "zh-TW": "學習偏好",
  },
  "student.school.title": {
    "zh-CN": "学校信息",
    en: "School Information",
    "zh-TW": "學校資訊",
  },
  "student.school.desc": {
    "zh-CN": "帮助我们匹配你的校区课程体系",
    en: "Help us match your campus curriculum",
    "zh-TW": "幫助我們匹配你的校區課程體系",
  },
  "student.label.school": {
    "zh-CN": "所在学校",
    en: "School",
    "zh-TW": "所在學校",
  },
  "student.placeholder.school": {
    "zh-CN": "请选择学校",
    en: "Select school",
    "zh-TW": "請選擇學校",
  },
  "student.otherCampus": {
    "zh-CN": "其他 BASIS 校区",
    en: "Other BASIS Campus",
    "zh-TW": "其他 BASIS 校區",
  },
  "student.label.grade": {
    "zh-CN": "年级",
    en: "Grade",
    "zh-TW": "年級",
  },
  "student.placeholder.grade": {
    "zh-CN": "选择年级",
    en: "Select grade",
    "zh-TW": "選擇年級",
  },
  "student.label.enrollmentYear": {
    "zh-CN": "入学年份",
    en: "Enrollment Year",
    "zh-TW": "入學年份",
  },
  "student.placeholder.enrollmentYear": {
    "zh-CN": "选择年份",
    en: "Select year",
    "zh-TW": "選擇年份",
  },
  "student.courses.title": {
    "zh-CN": "课程信息",
    en: "Course Information",
    "zh-TW": "課程資訊",
  },
  "student.courses.desc": {
    "zh-CN": "可选填，帮助 AI 了解你的学术方向",
    en: "Optional — help AI understand your academic interests",
    "zh-TW": "可選填，幫助 AI 了解你的學術方向",
  },
  "student.label.apCourses": {
    "zh-CN": "AP 课程（点击选择，可多选）",
    en: "AP Courses (click to select, multiple allowed)",
    "zh-TW": "AP 課程（點擊選擇，可多選）",
  },
  "student.apSelected": {
    "zh-CN": "已选 {count} 门课程",
    en: "{count} course(s) selected",
    "zh-TW": "已選 {count} 門課程",
  },
  "student.group.math": {
    "zh-CN": "数学与计算机",
    en: "Math & CS",
    "zh-TW": "數學與電腦",
  },
  "student.group.science": {
    "zh-CN": "自然科学",
    en: "Natural Sciences",
    "zh-TW": "自然科學",
  },
  "student.group.humanities": {
    "zh-CN": "人文社科",
    en: "Humanities & Social Sciences",
    "zh-TW": "人文社科",
  },
  "student.group.languages": {
    "zh-CN": "语言与艺术",
    en: "Languages & Arts",
    "zh-TW": "語言與藝術",
  },
  "student.label.gpa": {
    "zh-CN": "当前 GPA（可选，0 ~ 4.00）",
    en: "Current GPA (optional, 0–4.00)",
    "zh-TW": "目前 GPA（可選，0 ~ 4.00）",
  },
  "student.placeholder.gpa": {
    "zh-CN": "例如 3.85",
    en: "e.g. 3.85",
    "zh-TW": "例如 3.85",
  },
  "student.prefs.title": {
    "zh-CN": "学习偏好",
    en: "Learning Preferences",
    "zh-TW": "學習偏好",
  },
  "student.prefs.desc": {
    "zh-CN": "可选填，AI 将据此优化辅导策略",
    en: "Optional — AI will optimize tutoring based on this",
    "zh-TW": "可選填，AI 將據此優化輔導策略",
  },
  "student.label.weakSubjects": {
    "zh-CN": "需要加强的科目",
    en: "Subjects to Improve",
    "zh-TW": "需要加強的科目",
  },
  "student.label.strongSubjects": {
    "zh-CN": "擅长的科目",
    en: "Strong Subjects",
    "zh-TW": "擅長的科目",
  },
  "student.prevStep": {
    "zh-CN": "上一步",
    en: "Back",
    "zh-TW": "上一步",
  },
  "student.nextStep": {
    "zh-CN": "下一步",
    en: "Next",
    "zh-TW": "下一步",
  },
  "student.submitting": {
    "zh-CN": "提交中...",
    en: "Submitting...",
    "zh-TW": "提交中...",
  },
  "student.complete": {
    "zh-CN": "完成设置",
    en: "Complete Setup",
    "zh-TW": "完成設定",
  },
  "student.error.saveFailed": {
    "zh-CN": "保存画像失败",
    en: "Failed to save profile",
    "zh-TW": "儲存畫像失敗",
  },
  "student.error.kycFailed": {
    "zh-CN": "完成 KYC 失败",
    en: "Failed to complete verification",
    "zh-TW": "完成 KYC 失敗",
  },
  "student.error.network": {
    "zh-CN": "网络连接失败",
    en: "Network connection failed",
    "zh-TW": "網路連線失敗",
  },
  // Subjects
  "subject.math": { "zh-CN": "数学", en: "Math", "zh-TW": "數學" },
  "subject.physics": { "zh-CN": "物理", en: "Physics", "zh-TW": "物理" },
  "subject.chemistry": { "zh-CN": "化学", en: "Chemistry", "zh-TW": "化學" },
  "subject.biology": { "zh-CN": "生物", en: "Biology", "zh-TW": "生物" },
  "subject.english": { "zh-CN": "英语", en: "English", "zh-TW": "英語" },
  "subject.history": { "zh-CN": "历史", en: "History", "zh-TW": "歷史" },
  "subject.geography": { "zh-CN": "地理", en: "Geography", "zh-TW": "地理" },
  "subject.economics": { "zh-CN": "经济", en: "Economics", "zh-TW": "經濟" },
  "subject.cs": { "zh-CN": "计算机科学", en: "Computer Science", "zh-TW": "電腦科學" },
  "subject.chinese": { "zh-CN": "中文", en: "Chinese", "zh-TW": "中文" },
  "subject.spanish": { "zh-CN": "西班牙语", en: "Spanish", "zh-TW": "西班牙語" },
  "subject.french": { "zh-CN": "法语", en: "French", "zh-TW": "法語" },
  "subject.music": { "zh-CN": "音乐", en: "Music", "zh-TW": "音樂" },
  "subject.art": { "zh-CN": "美术", en: "Art", "zh-TW": "美術" },

  // ParentLinkForm
  "parent.title": {
    "zh-CN": "家长身份已设置",
    en: "Parent Role Set",
    "zh-TW": "家長身份已設置",
  },
  "parent.subtitle": {
    "zh-CN": "欢迎您加入 BasisPilot 家长社区",
    en: "Welcome to the BasisPilot Parent Community",
    "zh-TW": "歡迎您加入 BasisPilot 家長社區",
  },
  "parent.bindChild.title": {
    "zh-CN": "绑定孩子的账号",
    en: "Link Your Child's Account",
    "zh-TW": "綁定孩子的帳號",
  },
  "parent.bindChild.desc": {
    "zh-CN": "登录后在「个人资料」中绑定，查看学习进度",
    en: "Link in Profile after login to view learning progress",
    "zh-TW": "登入後在「個人資料」中綁定，查看學習進度",
  },
  "parent.reports.title": {
    "zh-CN": "获取学习报告",
    en: "Get Learning Reports",
    "zh-TW": "取得學習報告",
  },
  "parent.reports.desc": {
    "zh-CN": "定期了解孩子的学业表现和成长建议",
    en: "Regular updates on your child's academic performance and growth",
    "zh-TW": "定期了解孩子的學業表現和成長建議",
  },
  "parent.error.failed": {
    "zh-CN": "操作失败",
    en: "Operation failed",
    "zh-TW": "操作失敗",
  },
  "parent.error.network": {
    "zh-CN": "网络连接失败",
    en: "Network connection failed",
    "zh-TW": "網路連線失敗",
  },
  "parent.back": {
    "zh-CN": "返回",
    en: "Back",
    "zh-TW": "返回",
  },
  "parent.processing": {
    "zh-CN": "处理中...",
    en: "Processing...",
    "zh-TW": "處理中...",
  },
  "parent.start": {
    "zh-CN": "开始使用",
    en: "Get Started",
    "zh-TW": "開始使用",
  },

  // TeacherCompleteForm
  "teacher.title": {
    "zh-CN": "教师身份已设置",
    en: "Teacher Role Set",
    "zh-TW": "教師身份已設置",
  },
  "teacher.subtitle": {
    "zh-CN": "欢迎加入 BasisPilot 教师助手",
    en: "Welcome to BasisPilot Teaching Assistant",
    "zh-TW": "歡迎加入 BasisPilot 教師助手",
  },
  "teacher.aiTeaching.title": {
    "zh-CN": "AI 辅助教学",
    en: "AI-Assisted Teaching",
    "zh-TW": "AI 輔助教學",
  },
  "teacher.aiTeaching.desc": {
    "zh-CN": "智能分析学情，辅助备课和教学设计",
    en: "Smart learning analytics, lesson prep and instructional design",
    "zh-TW": "智能分析學情，輔助備課和教學設計",
  },
  "teacher.reports.title": {
    "zh-CN": "生成教学报告",
    en: "Generate Teaching Reports",
    "zh-TW": "生成教學報告",
  },
  "teacher.reports.desc": {
    "zh-CN": "快速生成学生评估和班级分析报告",
    en: "Quickly generate student assessment and class analysis reports",
    "zh-TW": "快速生成學生評估和班級分析報告",
  },
  "teacher.error.failed": {
    "zh-CN": "操作失败",
    en: "Operation failed",
    "zh-TW": "操作失敗",
  },
  "teacher.error.network": {
    "zh-CN": "网络连接失败",
    en: "Network connection failed",
    "zh-TW": "網路連線失敗",
  },
  "teacher.back": {
    "zh-CN": "返回",
    en: "Back",
    "zh-TW": "返回",
  },
  "teacher.processing": {
    "zh-CN": "处理中...",
    en: "Processing...",
    "zh-TW": "處理中...",
  },
  "teacher.start": {
    "zh-CN": "开始使用",
    en: "Get Started",
    "zh-TW": "開始使用",
  },
};

export default onboarding;
