import { Link, useNavigate } from 'react-router-dom';
import { generateFinalReport } from '../engine/generateFinalReport';
import FeedbackCard from '../components/FeedbackCard';
import StatusCard from '../components/StatusCard';
import { loadSession, replaySession } from '../mocks/localStorage';

export default function FinalReportPage() {
  const session = loadSession();
  const report = generateFinalReport(session);
  const navigate = useNavigate();

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Final Report</h1>
        <p className="mt-2 text-sm text-slate-700">Scenario: {report.scenarioTitle}</p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <StatusCard label="Overall grade" value={report.overallGrade} />
        <StatusCard label="Overall score" value={String(report.overallScore)} />
        <StatusCard label="Yield summary" value={String(report.finalYieldPotential)} />
        <StatusCard label="Disease risk" value={String(report.finalDiseaseRisk)} />
        <StatusCard label="Cost efficiency" value={String(report.costEfficiency)} />
        <StatusCard label="Days completed" value={`${report.completedDays}/${report.durationDays}`} />
      </section>

      <FeedbackCard title="What you did well" body={report.topGoodDecisions.join(' ')} />
      <FeedbackCard title="What to improve" body={report.topMistakes.join(' ')} />

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            replaySession();
            navigate('/play/1');
          }}
          className="block w-full rounded-xl bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Retry Scenario
        </button>
        <Link to="/quiz" className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm">
          Go to Disease Quiz
        </Link>
      </div>
    </main>
  );
}
