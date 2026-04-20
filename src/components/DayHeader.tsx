interface DayHeaderProps {
  day: number;
  duration: number;
  title?: string;
}

export default function DayHeader({ day, duration, title = 'Daily Decisions' }: DayHeaderProps) {
  return (
    <header className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <h1 className="mt-1 text-xl font-semibold text-slate-900">Day {day}</h1>
      <p className="text-sm text-slate-600">Winter Greenhouse Strawberry • {duration} days</p>
    </header>
  );
}
