import { DailyAction, DailyResult, PlaySession, SimulationState } from '../types/domain';
import { DailyActionRow, DailyResultRow, PlaySessionRow } from '../types/database';

const mapStateRecord = (state: Record<string, number>): SimulationState => ({
  growthScore: state.growthScore ?? 60,
  rootMoistureScore: state.rootMoistureScore ?? 60,
  lightScore: state.lightScore ?? 60,
  diseaseRisk: state.diseaseRisk ?? 20,
  yieldPotential: state.yieldPotential ?? 60,
  costScore: state.costScore ?? 80,
  stressStreak: state.stressStreak ?? 0
});

export const mapPlaySessionRowToDomain = (row: PlaySessionRow): PlaySession => ({
  id: row.id,
  userId: row.user_id ?? undefined,
  scenarioId: row.scenario_id,
  currentDay: row.current_day,
  status: row.status,
  currentCropStatus: row.current_crop_status,
  totalScore: row.total_score,
  simulationState: mapStateRecord(row.simulation_state),
  dailyActions: [],
  dailyResults: [],
  startedAt: row.started_at,
  completedAt: row.completed_at ?? undefined
});

export const mapDailyActionRowToDomain = (row: DailyActionRow): DailyAction => ({
  id: row.id,
  playSessionId: row.play_session_id,
  dayNumber: row.day_number,
  irrigation: row.irrigation,
  heating: row.heating,
  ventilation: row.ventilation,
  lighting: row.lighting,
  createdAt: row.created_at
});

export const mapDailyResultRowToDomain = (row: DailyResultRow): DailyResult => ({
  id: row.id,
  playSessionId: row.play_session_id,
  dayNumber: row.day_number,
  scoreDelta: row.score_delta,
  cropStatus: row.crop_status,
  feedbackSummary: row.feedback_summary,
  feedback: row.feedback,
  previousState: mapStateRecord(row.previous_state),
  nextState: mapStateRecord(row.next_state),
  deltas: mapStateRecord(row.deltas),
  createdAt: row.created_at
});
