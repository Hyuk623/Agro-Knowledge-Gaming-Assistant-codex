import { strawberryScenarioDays } from '../data/mockScenario';
import { appendDayOutcome, loadSession } from '../mocks/localStorage';
import rules from '../rules/strawberry.rules.json';
import {
  DailyAction,
  DayActionSelection,
  DailyResult,
  SimulationState,
  isCompleteSelection
} from '../types/domain';
import { generateDailyFeedback } from './generateDailyFeedback';

interface SimulateDayInput {
  playSessionId: string;
  dayNumber: number;
  selection: DayActionSelection;
}

interface ComputeStateInput {
  previousState: SimulationState;
  action: Omit<DailyAction, 'id' | 'playSessionId' | 'createdAt'>;
  scenarioDay: (typeof strawberryScenarioDays)[number];
}

export interface StateComputationResult {
  nextState: SimulationState;
  deltas: SimulationState;
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

const mergeDelta = (base: SimulationState, patch: Partial<SimulationState>): SimulationState => ({
  ...base,
  growthScore: base.growthScore + (patch.growthScore ?? 0),
  rootMoistureScore: base.rootMoistureScore + (patch.rootMoistureScore ?? 0),
  lightScore: base.lightScore + (patch.lightScore ?? 0),
  diseaseRisk: base.diseaseRisk + (patch.diseaseRisk ?? 0),
  yieldPotential: base.yieldPotential + (patch.yieldPotential ?? 0),
  costScore: base.costScore + (patch.costScore ?? 0)
});

const clampState = (state: SimulationState): SimulationState => ({
  growthScore: clamp(state.growthScore),
  rootMoistureScore: clamp(state.rootMoistureScore),
  lightScore: clamp(state.lightScore),
  diseaseRisk: clamp(state.diseaseRisk),
  yieldPotential: clamp(state.yieldPotential),
  costScore: clamp(state.costScore),
  stressStreak: Math.max(0, state.stressStreak)
});

const computeYieldPotential = (state: SimulationState) => {
  const weighted =
    state.growthScore * rules.yield_formula_weights.growthScore +
    state.lightScore * rules.yield_formula_weights.lightScore +
    state.costScore * rules.yield_formula_weights.costScore -
    state.diseaseRisk * rules.yield_formula_weights.diseaseRiskPenalty;
  return clamp(weighted);
};

const calculateStressStreak = (state: SimulationState): number => {
  const isStressDay = state.growthScore < 50 || state.rootMoistureScore < 45 || state.diseaseRisk > 55;
  return isStressDay ? state.stressStreak + 1 : 0;
};

export const computeNextSimulationState = ({ previousState, action, scenarioDay }: ComputeStateInput): StateComputationResult => {
  let draft = { ...previousState };

  draft = mergeDelta(draft, rules.action_effects.irrigation[action.irrigation]);
  draft = mergeDelta(draft, rules.action_effects.heating[action.heating]);
  draft = mergeDelta(draft, rules.action_effects.ventilation[action.ventilation]);
  draft = mergeDelta(draft, rules.action_effects.lighting[action.lighting]);

  draft = mergeDelta(draft, rules.condition_modifiers.outside_temp_level[scenarioDay.outsideTempLevel]);
  draft = mergeDelta(draft, rules.condition_modifiers.sunlight_level[scenarioDay.sunlightLevel]);
  draft = mergeDelta(draft, rules.condition_modifiers.disease_pressure_level[scenarioDay.diseasePressureLevel]);

  if (action.irrigation === 'high' && action.ventilation === 'low') {
    draft.diseaseRisk += rules.disease_rules.high_irrigation_low_ventilation;
  }

  if (scenarioDay.sunlightLevel === 'low' && action.ventilation === 'low') {
    draft.diseaseRisk += rules.disease_rules.low_sunlight_low_ventilation;
  }

  draft.stressStreak = calculateStressStreak(draft);
  if (draft.stressStreak >= rules.disease_rules.stress_trigger_threshold) {
    draft.diseaseRisk += draft.stressStreak * rules.disease_rules.stress_streak_multiplier;
  }

  draft = clampState(draft);
  draft.yieldPotential = computeYieldPotential(draft);
  draft = clampState(draft);

  const deltas: SimulationState = {
    growthScore: draft.growthScore - previousState.growthScore,
    rootMoistureScore: draft.rootMoistureScore - previousState.rootMoistureScore,
    lightScore: draft.lightScore - previousState.lightScore,
    diseaseRisk: draft.diseaseRisk - previousState.diseaseRisk,
    yieldPotential: draft.yieldPotential - previousState.yieldPotential,
    costScore: draft.costScore - previousState.costScore,
    stressStreak: draft.stressStreak - previousState.stressStreak
  };

  return {
    nextState: draft,
    deltas
  };
};

export const simulateDay = ({ playSessionId, dayNumber, selection }: SimulateDayInput): { action: DailyAction; result: DailyResult } => {
  if (!isCompleteSelection(selection)) {
    throw new Error('All four actions must be selected before running today.');
  }

  const scenarioDay = strawberryScenarioDays.find((day) => day.dayNumber === dayNumber);
  if (!scenarioDay) {
    throw new Error(`Scenario day ${dayNumber} not found.`);
  }

  const session = loadSession();
  const previousState = session.simulationState;

  const action: DailyAction = {
    id: `action-${dayNumber}`,
    playSessionId,
    dayNumber,
    irrigation: selection.irrigation,
    heating: selection.heating,
    ventilation: selection.ventilation,
    lighting: selection.lighting,
    createdAt: new Date().toISOString()
  };

  const { nextState, deltas } = computeNextSimulationState({
    previousState,
    action: {
      dayNumber,
      irrigation: action.irrigation,
      heating: action.heating,
      ventilation: action.ventilation,
      lighting: action.lighting
    },
    scenarioDay
  });

  const result = generateDailyFeedback({
    action,
    scenarioDay,
    previousState,
    nextState,
    deltas
  });

  appendDayOutcome(action, result, nextState);

  return { action, result };
};
