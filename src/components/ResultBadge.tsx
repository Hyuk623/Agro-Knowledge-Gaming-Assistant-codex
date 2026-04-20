interface ResultBadgeProps {
  scoreDelta: number;
}

export default function ResultBadge({ scoreDelta }: ResultBadgeProps) {
  const positive = scoreDelta >= 0;
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        positive ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
      }`}
    >
      {positive ? '+' : ''}
      {scoreDelta} points
    </span>
  );
}
