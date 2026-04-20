import { APP_CONFIG, STORAGE_KEYS } from '../config/constants';
import { initialSimulationState, starterPlaySession } from '../data/mockScenario';
import { DailyAction, DailyResult, PlaySession, SimulationState } from '../types/domain';

const cloneStarterSession = (): PlaySession => ({
  ...JSON.parse(JSON.stringify(starterPlaySession)),
  id: `play-session-${Date.now()}`,
  startedAt: new Date().toISOString()
});

const ensureState = (state?: Partial<SimulationState>): SimulationState => ({
  growthScore: state?.growthScore ?? initialSimulationState.growthScore,
  rootMoistureScore: state?.rootMoistureScore ?? initialSimulationState.rootMoistureScore,
  lightScore: state?.lightScore ?? initialSimulationState.lightScore,
  diseaseRisk: state?.diseaseRisk ?? initialSimulationState.diseaseRisk,
  yieldPotential: state?.yieldPotential ?? initialSimulationState.yieldPotential,
  costScore: state?.costScore ?? initialSimulationState.costScore,
  stressStreak: state?.stressStreak ?? initialSimulationState.stressStreak
});

const normalizeResult = (result: DailyResult): DailyResult => ({
  ...result,
  feedback: result.feedback ?? {
    summary: result.feedbackSummary,
    mainCause: 'Legacy session data: main cause unavailable.',
    nextRecommendation: 'Run new days to generate updated recommendations.'
  },
  previousState: ensureState(result.previousState),
  nextState: ensureState(result.nextState),
  deltas: ensureState(result.deltas)
});

const sanitizeSession = (session: PlaySession): PlaySession => ({
  ...session,
  simulationState: ensureState(session.simulationState),
  dailyActions: [...session.dailyActions].sort((a, b) => a.dayNumber - b.dayNumber),
  dailyResults: [...session.dailyResults].map(normalizeResult).sort((a, b) => a.dayNumber - b.dayNumber)
});

export const loadSession = (): PlaySession => {
  const raw = localStorage.getItem(STORAGE_KEYS.playSession);
  if (!raw) return cloneStarterSession();

  try {
    const parsed = JSON.parse(raw) as PlaySession;
    return sanitizeSession(parsed);
  } catch {
    return cloneStarterSession();
  }
};

export const saveSession = (session: PlaySession) => {
  localStorage.setItem(STORAGE_KEYS.playSession, JSON.stringify(sanitizeSession(session)));
};

export const startNewSession = () => {
  const session = cloneStarterSession();
  saveSession(session);
  return session;
};

export const replaySession = () => startNewSession();

export const hasProgressSession = () => {
  const session = loadSession();
  return session.dailyActions.length > 0 && session.status === 'active';
};

export const getContinueDay = () => {
  const session = loadSession();
  return Math.min(session.currentDay, APP_CONFIG.totalScenarioDays);
};

export const appendDayOutcome = (action: DailyAction, result: DailyResult, nextState: SimulationState) => {
  const session = loadSession();
  const nextSession: PlaySession = {
    ...session,
    currentDay: Math.min(action.dayNumber + 1, APP_CONFIG.totalScenarioDays),
    totalScore: nextState.yieldPotential,
    currentCropStatus: result.cropStatus,
    simulationState: ensureState(nextState),
    dailyActions: [...session.dailyActions.filter((a) => a.dayNumber !== action.dayNumber), action],
    dailyResults: [...session.dailyResults.filter((r) => r.dayNumber !== action.dayNumber), result]
  };

  if (action.dayNumber >= APP_CONFIG.totalScenarioDays) {
    nextSession.status = 'completed';
    nextSession.completedAt = new Date().toISOString();
  }

  saveSession(nextSession);
  return nextSession;
};
