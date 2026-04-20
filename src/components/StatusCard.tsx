interface StatusCardProps {
  label: string;
  value: string;
}

export default function StatusCard({ label, value }: StatusCardProps) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
