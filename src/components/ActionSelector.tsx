interface ActionSelectorProps<T extends string> {
  label: string;
  options: T[];
  value?: T;
  placeholder?: string;
  onChange: (next: T) => void;
}

export default function ActionSelector<T extends string>({
  label,
  options,
  value,
  placeholder,
  onChange
}: ActionSelectorProps<T>) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {!value && placeholder && <span className="text-xs text-slate-500">{placeholder}</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
                selected ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
