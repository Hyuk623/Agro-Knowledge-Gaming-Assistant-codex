import { Link, useNavigate } from 'react-router-dom';
import { getContinueDay, hasProgressSession, replaySession, startNewSession } from '../mocks/localStorage';

export default function LandingPage() {
  const navigate = useNavigate();
  const canContinue = hasProgressSession();

  const handleStart = () => {
    startNewSession();
    navigate('/scenario');
  };

  const handleReplay = () => {
    replaySession();
    navigate('/play/1');
  };

  return (
    <main className="space-y-6 pt-6">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-primary-600">Agro-Knowledge Gaming Assistant MVP</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Strawberry Edition</h1>
        <p className="mt-3 text-sm text-slate-700">
          Practice daily greenhouse decisions in a 14-day winter strawberry training scenario.
        </p>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleStart}
          className="block w-full rounded-xl bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Start New Session
        </button>

        {canContinue && (
          <Link
            to={`/play/${getContinueDay()}`}
            className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm"
          >
            Continue Session (Day {getContinueDay()})
          </Link>
        )}

        <button
          type="button"
          onClick={handleReplay}
          className="block w-full rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Replay from Day 1
        </button>

        <Link to="/quiz" className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm">
          Strawberry Disease Quiz
        </Link>
      </div>
    </main>
  );
}
