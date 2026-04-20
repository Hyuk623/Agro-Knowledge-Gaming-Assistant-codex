import { useNavigate } from 'react-router-dom';
import { strawberryScenario } from '../data/mockScenario';
import { startNewSession } from '../mocks/localStorage';

export default function ScenarioIntroPage() {
  const navigate = useNavigate();

  return (
    <main className="space-y-5">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Scenario Intro</h1>
        <h2 className="mt-2 text-base font-medium text-slate-800">{strawberryScenario.title}</h2>
        <p className="mt-3 text-sm text-slate-700">{strawberryScenario.summary}</p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-700">
          <li>Crop: Strawberry</li>
          <li>Season: Winter greenhouse</li>
          <li>Duration: {strawberryScenario.durationDays} days</li>
          <li>Actions/day: irrigation, heating, ventilation, lighting</li>
        </ul>
      </section>

      <button
        type="button"
        onClick={() => {
          startNewSession();
          navigate('/play/1');
        }}
        className="block w-full rounded-xl bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Begin Day 1
      </button>
    </main>
  );
}
