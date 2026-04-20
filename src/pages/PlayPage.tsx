import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ActionSelector from '../components/ActionSelector';
import DayHeader from '../components/DayHeader';
import ProgressBar from '../components/ProgressBar';
import StatusCard from '../components/StatusCard';
import { strawberryScenario, strawberryScenarioDays } from '../data/mockScenario';
import { loadSession } from '../mocks/localStorage';
import { DayActionSelection, Level3, LightingLevel, isCompleteSelection } from '../types/domain';
import { runDay } from '../services/playSessionService';

const LEVEL_OPTIONS: Level3[] = ['low', 'normal', 'high'];
const LIGHT_OPTIONS: LightingLevel[] = ['off', 'auto', 'on'];

export default function PlayPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNumber = Math.max(1, Math.min(Number(day ?? 1), strawberryScenario.durationDays));
  const session = loadSession();
  const dayState = useMemo(() => strawberryScenarioDays.find((d) => d.dayNumber === dayNumber), [dayNumber]);
  const existingAction = session.dailyActions.find((a) => a.dayNumber === dayNumber);

  const [selection, setSelection] = useState<DayActionSelection>({
    irrigation: existingAction?.irrigation,
    heating: existingAction?.heating,
    ventilation: existingAction?.ventilation,
    lighting: existingAction?.lighting
  });

  const canRun = isCompleteSelection(selection);

  const handleRunToday = () => {
    if (!canRun) return;

    runDay({
      playSessionId: session.id,
      dayNumber,
      selection
    });

    navigate(`/result/${dayNumber}`);
  };

  if (!dayState) {
    return <p className="text-sm text-slate-700">Day not found.</p>;
  }

  return (
    <main className="space-y-4 pb-6">
      <DayHeader day={dayNumber} duration={strawberryScenario.durationDays} />
      <ProgressBar current={dayNumber} total={strawberryScenario.durationDays} />

      <section className="grid grid-cols-2 gap-2">
        <StatusCard label="Outside temp" value={dayState.outsideTempLevel} />
        <StatusCard label="Sunlight" value={dayState.sunlightLevel} />
        <StatusCard label="Disease pressure" value={dayState.diseasePressureLevel} />
        <StatusCard label="Crop status" value={session.currentCropStatus} />
      </section>

      <section className="grid grid-cols-2 gap-2">
        <StatusCard label="Growth" value={String(session.simulationState.growthScore)} />
        <StatusCard label="Moisture" value={String(session.simulationState.rootMoistureScore)} />
        <StatusCard label="Light" value={String(session.simulationState.lightScore)} />
        <StatusCard label="Disease risk" value={String(session.simulationState.diseaseRisk)} />
        <StatusCard label="Yield potential" value={String(session.simulationState.yieldPotential)} />
        <StatusCard label="Cost score" value={String(session.simulationState.costScore)} />
      </section>

      <ActionSelector
        label="Irrigation"
        options={LEVEL_OPTIONS}
        value={selection.irrigation}
        placeholder="Select"
        onChange={(irrigation) => setSelection((prev) => ({ ...prev, irrigation }))}
      />
      <ActionSelector
        label="Heating"
        options={LEVEL_OPTIONS}
        value={selection.heating}
        placeholder="Select"
        onChange={(heating) => setSelection((prev) => ({ ...prev, heating }))}
      />
      <ActionSelector
        label="Ventilation"
        options={LEVEL_OPTIONS}
        value={selection.ventilation}
        placeholder="Select"
        onChange={(ventilation) => setSelection((prev) => ({ ...prev, ventilation }))}
      />
      <ActionSelector
        label="Lighting"
        options={LIGHT_OPTIONS}
        value={selection.lighting}
        placeholder="Select"
        onChange={(lighting) => setSelection((prev) => ({ ...prev, lighting }))}
      />

      <button
        type="button"
        onClick={handleRunToday}
        disabled={!canRun}
        className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-300 disabled:text-slate-500"
      >
        Run Today
      </button>
      {!canRun && <p className="text-xs text-slate-600">Select irrigation, heating, ventilation, and lighting to continue.</p>}
    </main>
  );
}
