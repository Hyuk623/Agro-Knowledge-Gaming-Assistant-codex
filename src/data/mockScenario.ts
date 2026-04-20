import {
  Crop,
  PlaySession,
  QuizItem,
  RuleSet,
  Scenario,
  ScenarioDay,
  SimulationState
} from '../types/domain';

export const strawberryCrop: Crop = {
  id: 'crop-strawberry',
  slug: 'strawberry',
  name: 'Strawberry'
};

export const strawberryScenario: Scenario = {
  id: 'scenario-strawberry-winter-14',
  cropId: strawberryCrop.id,
  title: 'Winter Greenhouse Strawberry – 14 Day Challenge',
  durationDays: 14,
  summary:
    'A beginner-friendly strawberry greenhouse training scenario focused on daily climate and irrigation choices.'
};

const dayLevels: Array<Pick<ScenarioDay, 'outsideTempLevel' | 'sunlightLevel' | 'diseasePressureLevel'>> = [
  { outsideTempLevel: 'low', sunlightLevel: 'low', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'low', sunlightLevel: 'normal', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'normal', sunlightLevel: 'normal', diseasePressureLevel: 'low' },
  { outsideTempLevel: 'normal', sunlightLevel: 'high', diseasePressureLevel: 'low' },
  { outsideTempLevel: 'high', sunlightLevel: 'high', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'normal', sunlightLevel: 'low', diseasePressureLevel: 'high' },
  { outsideTempLevel: 'low', sunlightLevel: 'low', diseasePressureLevel: 'high' },
  { outsideTempLevel: 'low', sunlightLevel: 'normal', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'normal', sunlightLevel: 'high', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'high', sunlightLevel: 'high', diseasePressureLevel: 'low' },
  { outsideTempLevel: 'normal', sunlightLevel: 'normal', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'low', sunlightLevel: 'low', diseasePressureLevel: 'high' },
  { outsideTempLevel: 'low', sunlightLevel: 'normal', diseasePressureLevel: 'normal' },
  { outsideTempLevel: 'normal', sunlightLevel: 'low', diseasePressureLevel: 'normal' }
];

export const strawberryScenarioDays: ScenarioDay[] = dayLevels.map((levels, index) => ({
  id: `scenario-day-${index + 1}`,
  scenarioId: strawberryScenario.id,
  dayNumber: index + 1,
  ...levels
}));

export const initialSimulationState: SimulationState = {
  growthScore: 60,
  rootMoistureScore: 60,
  lightScore: 60,
  diseaseRisk: 20,
  yieldPotential: 60,
  costScore: 80,
  stressStreak: 0
};

export const starterPlaySession: PlaySession = {
  id: 'play-session-local-1',
  scenarioId: strawberryScenario.id,
  currentDay: 1,
  status: 'active',
  currentCropStatus: 'Stable growth',
  totalScore: 60,
  simulationState: initialSimulationState,
  dailyActions: [],
  dailyResults: [],
  startedAt: new Date().toISOString()
};

export const defaultRuleSet: RuleSet = {
  id: 'rules-strawberry-v2',
  scenarioId: strawberryScenario.id,
  name: 'Winter Strawberry Deterministic Rules',
  version: '0.2.0',
  notes: 'Phase 2: continue tuning weights with agronomy experts.'
};

export const quizItems: QuizItem[] = [
  {
    id: 'quiz-1',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/leaf-spot.svg',
    title: 'Leaf surface with dark circular lesions and purple margins.',
    answerCode: 'leaf_spot',
    explanation: 'This pattern is commonly associated with leaf spot symptoms.',
    difficulty: 'easy',
    choices: [
      { code: 'leaf_spot', label: 'Leaf Spot' },
      { code: 'powdery_mildew', label: 'Powdery Mildew' },
      { code: 'root_rot', label: 'Root Rot' }
    ]
  },
  {
    id: 'quiz-2',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/powdery.svg',
    title: 'White powder-like patches spread across leaves.',
    answerCode: 'powdery_mildew',
    explanation: 'Powdery mildew presents as white powdery growth on leaf surfaces.',
    difficulty: 'easy',
    choices: [
      { code: 'powdery_mildew', label: 'Powdery Mildew' },
      { code: 'leaf_spot', label: 'Leaf Spot' },
      { code: 'nutrient_stress', label: 'Nutrient Stress' }
    ]
  },
  {
    id: 'quiz-3',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/root-rot.svg',
    title: 'Roots appear dark brown and weak in wet media.',
    answerCode: 'root_rot',
    explanation: 'Persistent saturation and poor oxygen can trigger root rot symptoms.',
    difficulty: 'medium',
    choices: [
      { code: 'root_rot', label: 'Root Rot' },
      { code: 'heat_stress', label: 'Heat Stress' },
      { code: 'pest_damage', label: 'Pest Damage' }
    ]
  },
  {
    id: 'quiz-4',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/leaf-spot.svg',
    title: 'Small dark dots expand after humid nights and poor airflow.',
    answerCode: 'leaf_spot',
    explanation: 'Leaf spot often worsens in humid conditions with low ventilation.',
    difficulty: 'medium',
    choices: [
      { code: 'leaf_spot', label: 'Leaf Spot' },
      { code: 'root_rot', label: 'Root Rot' },
      { code: 'sun_scald', label: 'Sun Scald' }
    ]
  },
  {
    id: 'quiz-5',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/powdery.svg',
    title: 'White dusty film appears first on shaded leaves.',
    answerCode: 'powdery_mildew',
    explanation: 'Powdery mildew can start in dense canopy areas with weaker air movement.',
    difficulty: 'medium',
    choices: [
      { code: 'powdery_mildew', label: 'Powdery Mildew' },
      { code: 'botrytis', label: 'Botrytis Fruit Rot' },
      { code: 'leaf_burn', label: 'Leaf Burn' }
    ]
  },
  {
    id: 'quiz-6',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/root-rot.svg',
    title: 'Plants wilt despite wet substrate and reduced root vigor.',
    answerCode: 'root_rot',
    explanation: 'Wilting with wet media is a classic warning sign of root disease.',
    difficulty: 'medium',
    choices: [
      { code: 'root_rot', label: 'Root Rot' },
      { code: 'drought', label: 'Drought Stress' },
      { code: 'iron_def', label: 'Iron Deficiency' }
    ]
  },
  {
    id: 'quiz-7',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/leaf-spot.svg',
    title: 'Lesions coalesce, reducing green photosynthetic area.',
    answerCode: 'leaf_spot',
    explanation: 'Advanced leaf spot can merge lesions and reduce active leaf tissue.',
    difficulty: 'hard',
    choices: [
      { code: 'leaf_spot', label: 'Leaf Spot' },
      { code: 'powdery_mildew', label: 'Powdery Mildew' },
      { code: 'salt_stress', label: 'Salt Stress' }
    ]
  },
  {
    id: 'quiz-8',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/powdery.svg',
    title: 'Surface fungal growth increases during cool nights and stagnant air.',
    answerCode: 'powdery_mildew',
    explanation: 'Powdery mildew pressure rises with weak airflow and canopy humidity.',
    difficulty: 'hard',
    choices: [
      { code: 'powdery_mildew', label: 'Powdery Mildew' },
      { code: 'leaf_spot', label: 'Leaf Spot' },
      { code: 'root_rot', label: 'Root Rot' }
    ]
  },
  {
    id: 'quiz-9',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/root-rot.svg',
    title: 'Root tips collapse after repeated over-irrigation cycles.',
    answerCode: 'root_rot',
    explanation: 'Over-irrigation and poor oxygen exchange increase root rot risk.',
    difficulty: 'hard',
    choices: [
      { code: 'root_rot', label: 'Root Rot' },
      { code: 'nutrient_toxicity', label: 'Nutrient Toxicity' },
      { code: 'cold_shock', label: 'Cold Shock' }
    ]
  },
  {
    id: 'quiz-10',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/leaf-spot.svg',
    title: 'Best immediate control response for this lesion type?',
    answerCode: 'increase_airflow',
    explanation: 'Improving airflow and reducing leaf wetness helps reduce disease spread.',
    difficulty: 'medium',
    choices: [
      { code: 'increase_airflow', label: 'Increase airflow and avoid over-irrigation' },
      { code: 'stop_lighting', label: 'Turn off all lighting for 3 days' },
      { code: 'increase_heat_only', label: 'Only increase heating to maximum' }
    ]
  },
  {
    id: 'quiz-11',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/powdery.svg',
    title: 'Most relevant environment fix for white powder growth?',
    answerCode: 'ventilation_humidity',
    explanation: 'Ventilation and humidity control are key controls for mildew pressure.',
    difficulty: 'medium',
    choices: [
      { code: 'ventilation_humidity', label: 'Improve ventilation and humidity control' },
      { code: 'high_irrigation', label: 'Increase irrigation volume' },
      { code: 'lights_off', label: 'Disable lights permanently' }
    ]
  },
  {
    id: 'quiz-12',
    scenarioId: strawberryScenario.id,
    imageUrl: '/quiz/root-rot.svg',
    title: 'Best prevention for recurring root browning pattern?',
    answerCode: 'drainage_oxygen',
    explanation: 'Root health improves with drainage, oxygenation, and balanced irrigation.',
    difficulty: 'hard',
    choices: [
      { code: 'drainage_oxygen', label: 'Improve drainage and root-zone oxygen' },
      { code: 'zero_ventilation', label: 'Keep ventilation very low' },
      { code: 'double_fertilizer', label: 'Double fertilizer concentration' }
    ]
  }
];
