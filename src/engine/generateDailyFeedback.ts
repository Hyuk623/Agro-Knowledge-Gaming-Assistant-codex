import rules from '../rules/strawberry.rules.json';
import { DailyAction, DailyFeedback, DailyResult, ScenarioDay, SimulationState } from '../types/domain';

interface GenerateDailyFeedbackInput {
  action: DailyAction;
  scenarioDay: ScenarioDay;
  previousState: SimulationState;
  nextState: SimulationState;
  deltas: SimulationState;
}

const getSummaryTone = (scoreDelta: number): keyof typeof rules.feedback_templates.summary => {
  if (scoreDelta >= 4) return 'good';
  if (scoreDelta <= -3) return 'bad';
  return 'neutral';
};

const chooseMainCause = ({ nextState, action, scenarioDay }: Pick<GenerateDailyFeedbackInput, 'nextState' | 'action' | 'scenarioDay'>) => {
  if (nextState.diseaseRisk >= 55 || (action.irrigation === 'high' && action.ventilation === 'low')) {
    return rules.feedback_templates.cause.high_disease;
  }
  if (nextState.lightScore < 50 || (scenarioDay.sunlightLevel === 'low' && action.lighting === 'off')) {
    return rules.feedback_templates.cause.low_light;
  }
  if (nextState.costScore < 55 || action.heating === 'high' || action.lighting === 'on') {
    return rules.feedback_templates.cause.high_cost;
  }
  return rules.feedback_templates.cause.balanced;
};

const chooseRecommendation = (nextState: SimulationState): string => {
  if (nextState.diseaseRisk >= 50) {
    return rules.feedback_templates.recommendation.reduce_risk;
  }
  if (nextState.lightScore < rules.target_ranges.lightScore.min) {
    return rules.feedback_templates.recommendation.boost_light;
  }
  if (nextState.costScore < rules.target_ranges.costScore.min) {
    return rules.feedback_templates.recommendation.control_cost;
  }
  return rules.feedback_templates.recommendation.maintain;
};

const deriveCropStatus = (state: SimulationState): string => {
  if (state.diseaseRisk >= 70 || state.yieldPotential < 45) return 'Critical stress';
  if (state.diseaseRisk >= 50 || state.yieldPotential < 60) return 'Moderate stress';
  if (state.yieldPotential >= 80 && state.diseaseRisk < 30) return 'Excellent growth';
  return 'Stable growth';
};

const buildFeedback = (summaryTone: keyof typeof rules.feedback_templates.summary, mainCause: string, recommendation: string): DailyFeedback => ({
  summary: rules.feedback_templates.summary[summaryTone],
  mainCause,
  nextRecommendation: recommendation
});

export const generateDailyFeedback = ({
  action,
  scenarioDay,
  previousState,
  nextState,
  deltas
}: GenerateDailyFeedbackInput): DailyResult => {
  const scoreDelta = Math.round((deltas.yieldPotential - deltas.diseaseRisk * 0.5 + deltas.costScore * 0.3) / 2);
  const summaryTone = getSummaryTone(scoreDelta);
  const mainCause = chooseMainCause({ nextState, action, scenarioDay });
  const recommendation = chooseRecommendation(nextState);
  const feedback = buildFeedback(summaryTone, mainCause, recommendation);

  return {
    id: `result-${action.dayNumber}`,
    playSessionId: action.playSessionId,
    dayNumber: action.dayNumber,
    scoreDelta,
    cropStatus: deriveCropStatus(nextState),
    feedbackSummary: `${feedback.summary} ${feedback.mainCause} ${feedback.nextRecommendation}`,
    feedback,
    previousState,
    nextState,
    deltas,
    createdAt: new Date().toISOString()
  };
};
