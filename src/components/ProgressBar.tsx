interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const ratio = Math.min(Math.max(current / total, 0), 1);
  return (
    <div className="space-y-2">
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-primary-500" style={{ width: `${ratio * 100}%` }} />
      </div>
      <p className="text-xs text-slate-600">
        Day {current} of {total}
      </p>
    </div>
  );
}
