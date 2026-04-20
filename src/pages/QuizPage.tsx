import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackCard from '../components/FeedbackCard';
import { quizItems } from '../data/mockScenario';

interface QuizAnswerRecord {
  [quizId: string]: {
    selectedCode: string;
    isCorrect: boolean;
  };
}

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerRecord>({});

  const current = quizItems[index];
  const currentAnswer = current ? answers[current.id] : undefined;
  const score = useMemo(() => Object.values(answers).filter((answer) => answer.isCorrect).length, [answers]);
  const isFinished = index >= quizItems.length;

  if (quizItems.length === 0) {
    return <p className="text-sm text-slate-700">Quiz is not available yet.</p>;
  }

  if (isFinished) {
    return (
      <main className="space-y-4">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Quiz Summary</h1>
          <p className="mt-2 text-sm text-slate-700">
            Score: {score} / {quizItems.length}
          </p>
        </section>

        <FeedbackCard
          title="Result"
          body={
            score >= quizItems.length * 0.8
              ? 'Great diagnosis awareness. Keep combining image cues with greenhouse environment context.'
              : 'Review disease clues again and practice airflow/moisture management connections.'
          }
        />

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setAnswers({});
            }}
            className="block w-full rounded-xl bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Retry Quiz
          </button>
          <Link to="/" className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm">
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Strawberry Disease Quiz</h1>
        <p className="mt-2 text-sm text-slate-700">
          Question {index + 1} / {quizItems.length} • Difficulty: {current.difficulty}
        </p>
      </section>

      <article className="rounded-xl bg-white p-4 shadow-sm">
        <img src={current.imageUrl} alt={current.title} className="h-44 w-full rounded-lg object-cover" />
        <p className="mt-3 text-sm font-semibold text-slate-900">{current.title}</p>

        <div className="mt-3 space-y-2">
          {current.choices.map((choice) => {
            const selected = currentAnswer?.selectedCode === choice.code;
            const answered = Boolean(currentAnswer);
            const isCorrectChoice = choice.code === current.answerCode;
            const colorClass = !answered
              ? 'bg-slate-100 text-slate-700'
              : isCorrectChoice
                ? 'bg-green-100 text-green-800'
                : selected
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-500';

            return (
              <button
                key={choice.code}
                type="button"
                onClick={() => {
                  if (currentAnswer) return;
                  setAnswers((prev) => ({
                    ...prev,
                    [current.id]: {
                      selectedCode: choice.code,
                      isCorrect: choice.code === current.answerCode
                    }
                  }));
                }}
                disabled={answered}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${colorClass} disabled:cursor-not-allowed`}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      </article>

      {currentAnswer && (
        <>
          <FeedbackCard
            title={currentAnswer.isCorrect ? 'Correct' : 'Incorrect'}
            body={
              currentAnswer.isCorrect
                ? 'Great job identifying the pattern.'
                : `Correct answer: ${current.choices.find((choice) => choice.code === current.answerCode)?.label ?? current.answerCode}`
            }
          />
          <FeedbackCard title="Explanation" body={current.explanation} />

          <button
            type="button"
            onClick={() => setIndex((prev) => prev + 1)}
            className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white"
          >
            {index === quizItems.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </>
      )}

      <p className="text-center text-xs text-slate-600">
        Current score: {score} / {quizItems.length}
      </p>
    </main>
  );
}
