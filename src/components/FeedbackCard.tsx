interface FeedbackCardProps {
  title: string;
  body: string;
}

export default function FeedbackCard({ title, body }: FeedbackCardProps) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-700">{body}</p>
    </article>
  );
}
