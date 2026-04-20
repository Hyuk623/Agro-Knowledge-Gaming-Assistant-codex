export type Level3 = 'low' | 'normal' | 'high';
export type LightingLevel = 'off' | 'auto' | 'on';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface Crop {
  id: string;
  slug: string;
  name: string;
}

export interface Scenario {
  id: string;
  cropId: string;
  title: string;
  durationDays: number;
  summary: string;
}

export interface ScenarioDay {
  id: string;
  scenarioId: string;
  dayNumber: number;
  outsideTempLevel: Level3;
  sunlightLevel: Level3;
  diseasePressureLevel: Level3;
}

export interface SimulationState {
  growthScore: number;
  rootMoistureScore: number;
  lightScore: number;
  diseaseRisk: number;
  yieldPotential: number;
  costScore: number;
  stressStreak: number;
}

export interface DailyAction {
  id: string;
  playSessionId: string;
  dayNumber: number;
  irrigation: Level3;
  heating: Level3;
  ventilation: Level3;
  lighting: LightingLevel;
  createdAt?: string;
}

export interface DailyFeedback {
  summary: string;
  mainCause: string;
  nextRecommendation: string;
}

export interface DailyResult {
  id: string;
  playSessionId: string;
  dayNumber: number;
  scoreDelta: number;
  cropStatus: string;
  feedbackSummary: string;
  feedback: DailyFeedback;
  previousState: SimulationState;
  nextState: SimulationState;
  deltas: SimulationState;
  createdAt?: string;
}

export interface PlaySession {
  id: string;
  userId?: string;
  scenarioId: string;
  currentDay: number;
  status: 'active' | 'completed';
  currentCropStatus: string;
  totalScore: number;
  simulationState: SimulationState;
  dailyActions: DailyAction[];
  dailyResults: DailyResult[];
  startedAt?: string;
  completedAt?: string;
}

export interface RuleSet {
  id: string;
  scenarioId: string;
  name: string;
  version: string;
  notes?: string;
}

export interface QuizChoice {
  code: string;
  label: string;
}

export interface QuizItem {
  id: string;
  scenarioId: string;
  imageUrl: string;
  title: string;
  answerCode: string;
  explanation: string;
  difficulty: QuizDifficulty;
  choices: QuizChoice[];
}

export interface DayActionSelection {
  irrigation?: Level3;
  heating?: Level3;
  ventilation?: Level3;
  lighting?: LightingLevel;
}

export const isCompleteSelection = (
  selection: DayActionSelection
): selection is Required<DayActionSelection> => {
  return Boolean(selection.irrigation && selection.heating && selection.ventilation && selection.lighting);
};
