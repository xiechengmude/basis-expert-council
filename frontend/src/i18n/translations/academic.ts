import type { Locale } from "../types";

const academic: Record<string, Record<Locale, string>> = {
  // Page
  "academic.title": { "zh-CN": "学力档案", en: "Academic Profile", "zh-TW": "學力檔案" },
  "academic.subtitle": { "zh-CN": "查看你的学习进展和能力分析", en: "View your learning progress and ability analysis", "zh-TW": "查看你的學習進展和能力分析" },

  // KPI Cards
  "academic.kpi.total_assessments": { "zh-CN": "测评总数", en: "Total Assessments", "zh-TW": "測評總數" },
  "academic.kpi.overall_accuracy": { "zh-CN": "平均分数", en: "Average Score", "zh-TW": "平均分數" },
  "academic.kpi.improvement": { "zh-CN": "进步幅度", en: "Improvement", "zh-TW": "進步幅度" },
  "academic.kpi.total_questions": { "zh-CN": "答题总数", en: "Total Questions", "zh-TW": "答題總數" },

  // Tabs
  "academic.tab.overview": { "zh-CN": "总览", en: "Overview", "zh-TW": "總覽" },
  "academic.tab.subjects": { "zh-CN": "学科详情", en: "Subject Details", "zh-TW": "學科詳情" },
  "academic.tab.history": { "zh-CN": "测评历史", en: "Assessment History", "zh-TW": "測評歷史" },

  // Radar chart
  "academic.radar.title": { "zh-CN": "学科能力雷达图", en: "Subject Ability Radar", "zh-TW": "學科能力雷達圖" },
  "academic.radar.my_score": { "zh-CN": "我的分数", en: "My Score", "zh-TW": "我的分數" },
  "academic.radar.average": { "zh-CN": "平均水平", en: "Average", "zh-TW": "平均水準" },

  // Progress
  "academic.progress.title": { "zh-CN": "知识点掌握度", en: "Topic Mastery", "zh-TW": "知識點掌握度" },
  "academic.progress.coverage": { "zh-CN": "覆盖率", en: "Coverage", "zh-TW": "覆蓋率" },

  // Trend chart
  "academic.trend.title": { "zh-CN": "能力趋势", en: "Ability Trend", "zh-TW": "能力趨勢" },
  "academic.trend.score": { "zh-CN": "分数", en: "Score", "zh-TW": "分數" },
  "academic.trend.date": { "zh-CN": "日期", en: "Date", "zh-TW": "日期" },
  "academic.trend.all_subjects": { "zh-CN": "全部学科", en: "All Subjects", "zh-TW": "全部學科" },

  // Timeline
  "academic.timeline.title": { "zh-CN": "测评记录", en: "Assessment Records", "zh-TW": "測評記錄" },
  "academic.timeline.view_report": { "zh-CN": "查看报告", en: "View Report", "zh-TW": "查看報告" },
  "academic.timeline.score": { "zh-CN": "得分", en: "Score", "zh-TW": "得分" },

  // Empty state
  "academic.empty.title": { "zh-CN": "还没有测评记录", en: "No Assessment Records Yet", "zh-TW": "還沒有測評記錄" },
  "academic.empty.desc": { "zh-CN": "完成一次测评后，你的学力档案将在这里展示", en: "Complete an assessment and your academic profile will appear here", "zh-TW": "完成一次測評後，你的學力檔案將在這裡展示" },
  "academic.empty.cta": { "zh-CN": "开始测评", en: "Start Assessment", "zh-TW": "開始測評" },

  // Parent switcher
  "academic.parent.select_student": { "zh-CN": "选择学生", en: "Select Student", "zh-TW": "選擇學生" },

  // Header
  "academic.header.ability_level": { "zh-CN": "综合能力等级", en: "Overall Ability Level", "zh-TW": "綜合能力等級" },
  "academic.header.assessments_completed": { "zh-CN": "次测评完成", en: "assessments completed", "zh-TW": "次測評完成" },

  // Menu entries
  "menu.academic_profile": { "zh-CN": "学力档案", en: "Academic Profile", "zh-TW": "學力檔案" },

  // Welcome banner
  "welcome.academic.title": { "zh-CN": "学力档案", en: "Academic Profile", "zh-TW": "學力檔案" },
  "welcome.academic.desc": { "zh-CN": "查看你的能力分析和学习进展", en: "View your ability analysis and learning progress", "zh-TW": "查看你的能力分析和學習進展" },

  // Report CTA
  "academic.report_cta.title": { "zh-CN": "查看完整学力档案", en: "View Full Academic Profile", "zh-TW": "查看完整學力檔案" },
  "academic.report_cta.desc": { "zh-CN": "查看所有测评数据的纵向分析", en: "See longitudinal analysis of all your assessment data", "zh-TW": "查看所有測評數據的縱向分析" },

  // Subject names
  "academic.subject.math": { "zh-CN": "数学", en: "Math", "zh-TW": "數學" },
  "academic.subject.english": { "zh-CN": "英语", en: "English", "zh-TW": "英語" },
  "academic.subject.physics": { "zh-CN": "物理", en: "Physics", "zh-TW": "物理" },
  "academic.subject.chemistry": { "zh-CN": "化学", en: "Chemistry", "zh-TW": "化學" },
  "academic.subject.biology": { "zh-CN": "生物", en: "Biology", "zh-TW": "生物" },
  "academic.subject.history": { "zh-CN": "历史", en: "History", "zh-TW": "歷史" },
  "academic.subject.science": { "zh-CN": "科学", en: "Science", "zh-TW": "科學" },

  // Assessment types
  "academic.type.pre_admission": { "zh-CN": "入学测评", en: "Pre-Admission", "zh-TW": "入學測評" },
  "academic.type.subject_diagnostic": { "zh-CN": "学科诊断", en: "Subject Diagnostic", "zh-TW": "學科診斷" },
  "academic.type.quick": { "zh-CN": "快速测评", en: "Quick Assessment", "zh-TW": "快速測評" },
};

export default academic;
