export interface AssessmentQuestion {
  id: number;
  stem: string;
  options: string[];
  topic: string;
  difficulty_label: string; // "easy" | "medium" | "hard"
  question_number: number;
  total_questions: number;
}

export interface SessionState {
  session_id: string;
  status: "in_progress" | "completed";
  current_question: AssessmentQuestion | null;
  total_answered: number;
  correct_count: number;
  current_difficulty: number;
  ability_history: number[];
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  next_question: AssessmentQuestion | null;
  session_complete: boolean;
  ability_history: number[];
  current_difficulty: number;
}

export interface ReportData {
  accuracy: number;
  total_questions: number;
  correct_count: number;
  avg_time_sec: number;
  total_time_sec: number;
  topic_scores: Record<
    string,
    { correct: number; total: number; accuracy: number }
  >;
  difficulty_progression: number[];
  weak_topics: string[];
  strong_topics: string[];
  grade_equivalent: string;
  ability_level: number;
  percentile_estimate: number;
}

export interface AgentAnalysis {
  overall_analysis: string;
  recommendations: string[];
  study_plan: StudyPlanItem[];
}

export interface StudyPlanItem {
  week: number;
  focus: string;
  activities: string[];
}

export interface AssessmentReport {
  id: string;
  session_id: string;
  status: "generating" | "ready" | "failed";
  report_data: ReportData;
  agent_analysis: AgentAnalysis | null;
  created_at: string;
}
