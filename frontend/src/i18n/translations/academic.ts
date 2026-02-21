import type { Locale } from "../types";

const academic: Record<string, Record<Locale, string>> = {
  // Page
  "academic.title": { "zh-CN": "学力档案", en: "Academic Profile", "zh-TW": "學力檔案" },
  "academic.subtitle": { "zh-CN": "查看你的学习进展和能力分析", en: "View your learning progress and ability analysis", "zh-TW": "查看你的學習進展和能力分析" },

  // KPI Cards
  "academic.kpi.total_assessments": { "zh-CN": "测评总数", en: "Total Assessments", "zh-TW": "測評總數" },
  "academic.kpi.overall_accuracy": { "zh-CN": "综合正确率", en: "Overall Accuracy", "zh-TW": "綜合正確率" },
  "academic.kpi.improvement": { "zh-CN": "进步幅度", en: "Improvement", "zh-TW": "進步幅度" },
  "academic.kpi.total_questions": { "zh-CN": "答题总数", en: "Total Questions", "zh-TW": "答題總數" },
  "academic.kpi.total_mistakes": { "zh-CN": "错题总数", en: "Total Mistakes", "zh-TW": "錯題總數" },
  "academic.kpi.mastery_rate": { "zh-CN": "消灭率", en: "Mastery Rate", "zh-TW": "消滅率" },

  // Tabs — v2: 4 tabs
  "academic.tab.overview": { "zh-CN": "总览", en: "Overview", "zh-TW": "總覽" },
  "academic.tab.mistakes": { "zh-CN": "错题分析", en: "Mistake Analysis", "zh-TW": "錯題分析" },
  "academic.tab.ability": { "zh-CN": "能力图谱", en: "Ability Map", "zh-TW": "能力圖譜" },
  "academic.tab.history": { "zh-CN": "学习轨迹", en: "Learning Track", "zh-TW": "學習軌跡" },
  // Legacy (keep for compat)
  "academic.tab.subjects": { "zh-CN": "学科详情", en: "Subject Details", "zh-TW": "學科詳情" },

  // Radar chart
  "academic.radar.title": { "zh-CN": "学科能力雷达图", en: "Subject Ability Radar", "zh-TW": "學科能力雷達圖" },
  "academic.radar.my_score": { "zh-CN": "我的分数", en: "My Score", "zh-TW": "我的分數" },
  "academic.radar.average": { "zh-CN": "平均水平", en: "Average", "zh-TW": "平均水準" },

  // Progress
  "academic.progress.title": { "zh-CN": "知识点掌握度", en: "Topic Mastery", "zh-TW": "知識點掌握度" },
  "academic.progress.coverage": { "zh-CN": "覆盖率", en: "Coverage", "zh-TW": "覆蓋率" },
  "academic.progress.active_mistakes": { "zh-CN": "个活跃错题", en: "active mistakes", "zh-TW": "個活躍錯題" },

  // Trend chart
  "academic.trend.title": { "zh-CN": "能力趋势", en: "Ability Trend", "zh-TW": "能力趨勢" },
  "academic.trend.score": { "zh-CN": "分数", en: "Score", "zh-TW": "分數" },
  "academic.trend.date": { "zh-CN": "日期", en: "Date", "zh-TW": "日期" },
  "academic.trend.all_subjects": { "zh-CN": "全部学科", en: "All Subjects", "zh-TW": "全部學科" },

  // Timeline
  "academic.timeline.title": { "zh-CN": "测评记录", en: "Assessment Records", "zh-TW": "測評記錄" },
  "academic.timeline.view_report": { "zh-CN": "查看报告", en: "View Report", "zh-TW": "查看報告" },
  "academic.timeline.score": { "zh-CN": "得分", en: "Score", "zh-TW": "得分" },
  "academic.timeline.new_mistakes": { "zh-CN": "个新错题", en: "new mistakes", "zh-TW": "個新錯題" },

  // Empty state
  "academic.empty.title": { "zh-CN": "还没有测评记录", en: "No Assessment Records Yet", "zh-TW": "還沒有測評記錄" },
  "academic.empty.desc": { "zh-CN": "完成一次测评后，你的学力档案将在这里展示", en: "Complete an assessment and your academic profile will appear here", "zh-TW": "完成一次測評後，你的學力檔案將在這裡展示" },
  "academic.empty.cta": { "zh-CN": "开始测评", en: "Start Assessment", "zh-TW": "開始測評" },

  // Parent switcher
  "academic.parent.select_student": { "zh-CN": "选择学生", en: "Select Student", "zh-TW": "選擇學生" },

  // Header
  "academic.header.ability_level": { "zh-CN": "综合能力等级", en: "Overall Ability Level", "zh-TW": "綜合能力等級" },
  "academic.header.assessments_completed": { "zh-CN": "次测评完成", en: "assessments completed", "zh-TW": "次測評完成" },
  "academic.header.last_updated": { "zh-CN": "最后更新", en: "Last updated", "zh-TW": "最後更新" },
  "academic.header.refresh": { "zh-CN": "刷新", en: "Refresh", "zh-TW": "刷新" },
  "academic.header.refreshing": { "zh-CN": "刷新中...", en: "Refreshing...", "zh-TW": "刷新中..." },
  "academic.header.mastery_rate": { "zh-CN": "消灭率", en: "Mastery Rate", "zh-TW": "消滅率" },

  // Mistake book
  "academic.mistakes.title": { "zh-CN": "错题分析", en: "Mistake Analysis", "zh-TW": "錯題分析" },
  "academic.mistakes.summary": { "zh-CN": "错题概览", en: "Mistake Summary", "zh-TW": "錯題概覽" },
  "academic.mistakes.by_topic": { "zh-CN": "按知识点分布", en: "By Topic", "zh-TW": "按知識點分佈" },
  "academic.mistakes.misconceptions": { "zh-CN": "高频误解", en: "Common Misconceptions", "zh-TW": "高頻誤解" },
  "academic.mistakes.filter_subject": { "zh-CN": "全部学科", en: "All Subjects", "zh-TW": "全部學科" },
  "academic.mistakes.filter_status": { "zh-CN": "全部状态", en: "All Status", "zh-TW": "全部狀態" },
  "academic.mistakes.sort_time": { "zh-CN": "按时间", en: "By Time", "zh-TW": "按時間" },
  "academic.mistakes.sort_count": { "zh-CN": "按错误次数", en: "By Wrong Count", "zh-TW": "按錯誤次數" },
  "academic.mistakes.wrong_count": { "zh-CN": "错误次数", en: "Wrong Count", "zh-TW": "錯誤次數" },
  "academic.mistakes.correct_after": { "zh-CN": "纠正次数", en: "Correct After", "zh-TW": "糾正次數" },
  "academic.mistakes.your_answer": { "zh-CN": "你的答案", en: "Your Answer", "zh-TW": "你的答案" },
  "academic.mistakes.correct_answer": { "zh-CN": "正确答案", en: "Correct Answer", "zh-TW": "正確答案" },
  "academic.mistakes.explanation": { "zh-CN": "解析", en: "Explanation", "zh-TW": "解析" },
  "academic.mistakes.no_mistakes": { "zh-CN": "暂无错题记录", en: "No mistakes recorded", "zh-TW": "暫無錯題記錄" },
  "academic.mistakes.mastery_rate_label": { "zh-CN": "错题消灭率", en: "Mistake Mastery Rate", "zh-TW": "錯題消滅率" },
  "academic.mistakes.total": { "zh-CN": "道错题", en: "mistakes", "zh-TW": "道錯題" },
  "academic.mistakes.mastery_rate": { "zh-CN": "消灭率", en: "Mastery Rate", "zh-TW": "消滅率" },
  "academic.mistakes.by_subject": { "zh-CN": "按学科分布", en: "By Subject", "zh-TW": "按學科分佈" },
  "academic.mistakes.top_misconceptions": { "zh-CN": "高频误解", en: "Top Misconceptions", "zh-TW": "高頻誤解" },
  // Mistake status labels (used by MistakeSummaryCard donut legend)
  "academic.mistakes.status_new": { "zh-CN": "新增", en: "New", "zh-TW": "新增" },
  "academic.mistakes.status_reviewing": { "zh-CN": "复习中", en: "Reviewing", "zh-TW": "複習中" },
  "academic.mistakes.status_mastered": { "zh-CN": "已掌握", en: "Mastered", "zh-TW": "已掌握" },
  "academic.mistakes.status_regressed": { "zh-CN": "回退", en: "Regressed", "zh-TW": "回退" },

  // Mistake status
  "academic.status.new": { "zh-CN": "新增", en: "New", "zh-TW": "新增" },
  "academic.status.reviewing": { "zh-CN": "复习中", en: "Reviewing", "zh-TW": "複習中" },
  "academic.status.mastered": { "zh-CN": "已掌握", en: "Mastered", "zh-TW": "已掌握" },
  "academic.status.regressed": { "zh-CN": "回退", en: "Regressed", "zh-TW": "回退" },

  // Goals
  "academic.goals.title": { "zh-CN": "目标追踪", en: "Goal Tracking", "zh-TW": "目標追蹤" },
  "academic.goals.gap": { "zh-CN": "距目标", en: "Gap to target", "zh-TW": "距目標" },
  "academic.goals.current": { "zh-CN": "当前", en: "Current", "zh-TW": "當前" },
  "academic.goals.target": { "zh-CN": "目标", en: "Target", "zh-TW": "目標" },
  "academic.goals.no_goals": { "zh-CN": "暂无学习目标", en: "No goals set", "zh-TW": "暫無學習目標" },
  "academic.goals.grade_target": { "zh-CN": "成绩目标", en: "Grade Target", "zh-TW": "成績目標" },
  "academic.goals.ap_target": { "zh-CN": "AP 目标", en: "AP Target", "zh-TW": "AP 目標" },
  "academic.goals.skill_target": { "zh-CN": "技能目标", en: "Skill Target", "zh-TW": "技能目標" },
  "academic.goals.college_target": { "zh-CN": "升学目标", en: "College Target", "zh-TW": "升學目標" },

  // Bloom's taxonomy
  "academic.bloom.title": { "zh-CN": "Bloom 认知层级掌握度", en: "Bloom's Taxonomy Mastery", "zh-TW": "Bloom 認知層級掌握度" },
  "academic.bloom.remember": { "zh-CN": "记忆", en: "Remember", "zh-TW": "記憶" },
  "academic.bloom.understand": { "zh-CN": "理解", en: "Understand", "zh-TW": "理解" },
  "academic.bloom.apply": { "zh-CN": "应用", en: "Apply", "zh-TW": "應用" },
  "academic.bloom.analyze": { "zh-CN": "分析", en: "Analyze", "zh-TW": "分析" },
  "academic.bloom.evaluate": { "zh-CN": "评价", en: "Evaluate", "zh-TW": "評價" },
  "academic.bloom.create": { "zh-CN": "创造", en: "Create", "zh-TW": "創造" },
  "academic.bloom.easy": { "zh-CN": "低阶", en: "Lower", "zh-TW": "低階" },
  "academic.bloom.hard": { "zh-CN": "高阶", en: "Higher", "zh-TW": "高階" },

  // Activity heatmap (legacy keys)
  "academic.heatmap.title": { "zh-CN": "学习活跃度", en: "Learning Activity", "zh-TW": "學習活躍度" },
  "academic.heatmap.questions": { "zh-CN": "答题", en: "Questions", "zh-TW": "答題" },
  "academic.heatmap.messages": { "zh-CN": "对话", en: "Messages", "zh-TW": "對話" },
  "academic.heatmap.less": { "zh-CN": "少", en: "Less", "zh-TW": "少" },
  "academic.heatmap.more": { "zh-CN": "多", en: "More", "zh-TW": "多" },
  // Activity heatmap (v2 keys used by ActivityHeatmap component)
  "academic.activity.title": { "zh-CN": "学习活跃度", en: "Learning Activity", "zh-TW": "學習活躍度" },
  "academic.activity.questions": { "zh-CN": "答题", en: "Questions", "zh-TW": "答題" },
  "academic.activity.correct": { "zh-CN": "正确", en: "Correct", "zh-TW": "正確" },
  "academic.activity.messages": { "zh-CN": "对话", en: "Messages", "zh-TW": "對話" },
  "academic.activity.less": { "zh-CN": "少", en: "Less", "zh-TW": "少" },
  "academic.activity.more": { "zh-CN": "多", en: "More", "zh-TW": "多" },

  // Milestones (legacy keys)
  "academic.milestone.first_assessment": { "zh-CN": "首次测评", en: "First Assessment", "zh-TW": "首次測評" },
  "academic.milestone.first_mastered": { "zh-CN": "首次消灭错题", en: "First Mistake Mastered", "zh-TW": "首次消滅錯題" },
  "academic.milestone.score_milestone": { "zh-CN": "分数突破", en: "Score Milestone", "zh-TW": "分數突破" },
  // Milestones (v2 keys used by MilestoneCards component)
  "academic.milestones.title": { "zh-CN": "成就里程碑", en: "Milestones", "zh-TW": "成就里程碑" },
  "academic.milestones.first_assessment": { "zh-CN": "首次测评", en: "First Assessment", "zh-TW": "首次測評" },
  "academic.milestones.total_assessments": { "zh-CN": "测评总数", en: "Total Assessments", "zh-TW": "測評總數" },
  "academic.milestones.mastered_mistakes": { "zh-CN": "已消灭错题", en: "Mistakes Mastered", "zh-TW": "已消滅錯題" },
  "academic.milestones.highest_score": { "zh-CN": "最高分数", en: "Highest Score", "zh-TW": "最高分數" },

  // Goal timeline (legacy key)
  "academic.goal_timeline.title": { "zh-CN": "目标里程碑", en: "Goal Milestones", "zh-TW": "目標里程碑" },
  // Goal timeline (v2 key used by GoalTimeline component)
  "academic.goals.timeline_title": { "zh-CN": "目标里程碑", en: "Goal Milestones", "zh-TW": "目標里程碑" },
  // Goal status labels (used by GoalTimeline component)
  "academic.goals.status_achieved": { "zh-CN": "已达成", en: "Achieved", "zh-TW": "已達成" },
  "academic.goals.status_on_track": { "zh-CN": "进展顺利", en: "On Track", "zh-TW": "進展順利" },
  "academic.goals.status_at_risk": { "zh-CN": "有风险", en: "At Risk", "zh-TW": "有風險" },
  "academic.goals.status_behind": { "zh-CN": "落后", en: "Behind", "zh-TW": "落後" },
  "academic.goals.status_not_started": { "zh-CN": "未开始", en: "Not Started", "zh-TW": "未開始" },

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

  // ---- Mistake-tab components (non-academic.* namespace) ----

  // MistakeFilters
  "mistakes.filter.all_subjects": { "zh-CN": "全部学科", en: "All Subjects", "zh-TW": "全部學科" },
  "mistakes.filter.all_statuses": { "zh-CN": "全部状态", en: "All Statuses", "zh-TW": "全部狀態" },
  "mistakes.sort.by_time": { "zh-CN": "按时间", en: "By Time", "zh-TW": "按時間" },
  "mistakes.sort.by_count": { "zh-CN": "按错误次数", en: "By Wrong Count", "zh-TW": "按錯誤次數" },

  // Mistake statuses (shared by MistakeFilters, MistakeList, MistakeByTopicChart)
  "mistakes.status.new": { "zh-CN": "新增", en: "New", "zh-TW": "新增" },
  "mistakes.status.reviewing": { "zh-CN": "复习中", en: "Reviewing", "zh-TW": "複習中" },
  "mistakes.status.mastered": { "zh-CN": "已掌握", en: "Mastered", "zh-TW": "已掌握" },
  "mistakes.status.regressed": { "zh-CN": "回退", en: "Regressed", "zh-TW": "回退" },

  // MistakeList
  "mistakes.empty": { "zh-CN": "暂无错题记录", en: "No mistakes recorded", "zh-TW": "暫無錯題記錄" },
  "mistakes.detail.question": { "zh-CN": "题目", en: "Question", "zh-TW": "題目" },
  "mistakes.detail.wrong_answer": { "zh-CN": "你的答案", en: "Your Answer", "zh-TW": "你的答案" },
  "mistakes.detail.correct_answer": { "zh-CN": "正确答案", en: "Correct Answer", "zh-TW": "正確答案" },
  "mistakes.detail.explanation": { "zh-CN": "解析", en: "Explanation", "zh-TW": "解析" },
  "mistakes.detail.bloom": { "zh-CN": "认知层级", en: "Bloom Level", "zh-TW": "認知層級" },
  "mistakes.detail.misconceptions": { "zh-CN": "相关误解", en: "Misconceptions", "zh-TW": "相關誤解" },

  // MistakeByTopicChart
  "mistakes.chart.title": { "zh-CN": "按知识点分布", en: "Mistakes by Topic", "zh-TW": "按知識點分佈" },

  // MisconceptionPanel
  "mistakes.misconceptions.title": { "zh-CN": "高频误解", en: "Common Misconceptions", "zh-TW": "高頻誤解" },
};

export default academic;
