// Supabase table row shapes (snake_case) for persistence boundary mapping.

export interface PlaySessionRow {
  id: string;
  user_id: string | null;
  scenario_id: string;
  current_day: number;
  status: 'active' | 'completed';
  current_crop_status: string;
  total_score: number;
  simulation_state: Record<string, number>;
  started_at: string;
  completed_at: string | null;
}

export interface DailyActionRow {
  id: string;
  play_session_id: string;
  day_number: number;
  irrigation: 'low' | 'normal' | 'high';
  heating: 'low' | 'normal' | 'high';
  ventilation: 'low' | 'normal' | 'high';
  lighting: 'off' | 'auto' | 'on';
  created_at: string;
}

export interface DailyResultRow {
  id: string;
  play_session_id: string;
  day_number: number;
  score_delta: number;
  crop_status: string;
  feedback_summary: string;
  feedback: {
    summary: string;
    mainCause: string;
    nextRecommendation: string;
  };
  previous_state: Record<string, number>;
  next_state: Record<string, number>;
  deltas: Record<string, number>;
  created_at: string;
}

export interface QuizItemRow {
  id: string;
  scenario_id: string;
  image_url: string;
  title: string;
  answer_code: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  choices: Array<{ code: string; label: string }>;
}
