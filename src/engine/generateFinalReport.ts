import rules from '../rules/strawberry.rules.json';
import { strawberryScenario } from '../data/mockScenario';
import { DailyAction, PlaySession } from '../types/domain';

export interface FinalReportSummary {
  scenarioTitle: string;
  completedDays: number;
  durationDays: number;
  finalYieldPotential: number;
  finalDiseaseRisk: number;
  costEfficiency: number;
  topMistakes: string[];
  topGoodDecisions: string[];
  overallGrade: 'S' | 'A' | 'B' | 'C' | 'Fail';
  overallScore: number;
}

const scoreToGrade = (score: number): FinalReportSummary['overallGrade'] => {
  if (score >= rules.grade_thresholds.S) return 'S';
  if (score >= rules.grade_thresholds.A) return 'A';
  if (score >= rules.grade_thresholds.B) return 'B';
  if (score >= rules.grade_thresholds.C) return 'C';
  return 'Fail';
};

const listMistakes = (actions: DailyAction[]): string[] => {
  const mistakes: string[] = [];
  const highIrrLowVent = actions.filter((a) => a.irrigation === 'high' && a.ventilation === 'low').length;
  const aggressiveEnergy = actions.filter((a) => a.heating === 'high' && a.lighting === 'on').length;

  if (highIrrLowVent > 0) mistakes.push(`고관수 + 저환기 조합을 ${highIrrLowVent}회 사용해 병해 리스크를 키웠습니다.`);
  if (aggressiveEnergy > 0) mistakes.push(`고난방 + 조명 on 조합을 ${aggressiveEnergy}회 사용해 비용 점수가 하락했습니다.`);
  if (mistakes.length === 0) mistakes.push('치명적인 반복 실수는 없었습니다.');

  return mistakes;
};

const listGoodDecisions = (actions: DailyAction[]): string[] => {
  const good: string[] = [];
  const balancedVent = actions.filter((a) => a.ventilation !== 'low').length;
  const adaptiveLighting = actions.filter((a) => a.lighting === 'auto' || a.lighting === 'on').length;

  if (balancedVent > 0) good.push(`환기를 normal/high로 ${balancedVent}회 유지해 습도 리스크를 관리했습니다.`);
  if (adaptiveLighting > 0) good.push(`조명을 auto/on으로 ${adaptiveLighting}회 사용해 광량을 보정했습니다.`);
  if (good.length === 0) good.push('의사결정 데이터가 충분하지 않아 강점을 추출하기 어렵습니다.');

  return good;
};

export const generateFinalReport = (session: PlaySession): FinalReportSummary => {
  const final = session.simulationState;
  const overallScore = Math.round(final.yieldPotential * 0.5 + (100 - final.diseaseRisk) * 0.3 + final.costScore * 0.2);

  return {
    scenarioTitle: strawberryScenario.title,
    completedDays: session.dailyResults.length,
    durationDays: strawberryScenario.durationDays,
    finalYieldPotential: final.yieldPotential,
    finalDiseaseRisk: final.diseaseRisk,
    costEfficiency: final.costScore,
    topMistakes: listMistakes(session.dailyActions),
    topGoodDecisions: listGoodDecisions(session.dailyActions),
    overallGrade: scoreToGrade(overallScore),
    overallScore
  };
};
