import { Link, useParams } from 'react-router-dom';
import DayHeader from '../components/DayHeader';
import FeedbackCard from '../components/FeedbackCard';
import ResultBadge from '../components/ResultBadge';
import StatusCard from '../components/StatusCard';
import { strawberryScenario } from '../data/mockScenario';
import { loadSession } from '../mocks/localStorage';
import { toSigned } from '../utils/format';

export default function DayResultPage() {
  const { day } = useParams<{ day: string }>();
  const dayNumber = Number(day ?? 1);
  const session = loadSession();
  const result = session.dailyResults.find((r) => r.dayNumber === dayNumber);
  const action = session.dailyActions.find((a) => a.dayNumber === dayNumber);

  if (!result || !action) {
    return <p className="text-sm text-slate-700">No result for this day yet. Run a day from Play first.</p>;
  }

  const isFinalDay = dayNumber >= strawberryScenario.durationDays;

  return (
    <main className="space-y-4">
      <DayHeader day={dayNumber} duration={strawberryScenario.durationDays} title="Day Feedback" />
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <ResultBadge scoreDelta={result.scoreDelta} />
      </div>

      <FeedbackCard title="Daily summary" body={result.feedback.summary} />
      <FeedbackCard title="Main cause" body={result.feedback.mainCause} />
      <FeedbackCard title="Next-day recommendation" body={result.feedback.nextRecommendation} />

      <section className="grid grid-cols-2 gap-2">
        <StatusCard label="Δ Growth" value={toSigned(result.deltas.growthScore)} />
        <StatusCard label="Δ Moisture" value={toSigned(result.deltas.rootMoistureScore)} />
        <StatusCard label="Δ Light" value={toSigned(result.deltas.lightScore)} />
        <StatusCard label="Δ Disease risk" value={toSigned(result.deltas.diseaseRisk)} />
        <StatusCard label="Δ Yield" value={toSigned(result.deltas.yieldPotential)} />
        <StatusCard label="Δ Cost" value={toSigned(result.deltas.costScore)} />
      </section>

      <section className="grid grid-cols-2 gap-2">
        <StatusCard label="Irrigation" value={action.irrigation} />
        <StatusCard label="Heating" value={action.heating} />
        <StatusCard label="Ventilation" value={action.ventilation} />
        <StatusCard label="Lighting" value={action.lighting} />
      </section>

      <StatusCard label="Current crop status" value={result.cropStatus} />

      <Link
        to={isFinalDay ? '/final-report' : `/play/${dayNumber + 1}`}
        className="block rounded-xl bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white"
      >
        {isFinalDay ? 'View Final Report' : 'Next Day'}
      </Link>
    </main>
  );
}
