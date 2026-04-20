# Agro-Knowledge Gaming Assistant MVP – Strawberry Edition

Mobile-first training simulator for a 14-day winter greenhouse strawberry scenario.

## Tech stack
- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Local guest persistence (Supabase-ready structure)

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## MVP scope implemented
- Deterministic rules-based day simulation (not chatbot/LLM)
- 14-day playable loop with day-by-day feedback
- Final report with grade and decision review
- Strawberry disease quiz (12 seeded image questions)
- Guest-mode persistence with continue/replay support

## Architecture
- `src/engine/simulateDay.ts`: pure state transition + day orchestration
- `src/engine/generateDailyFeedback.ts`: deterministic 3-line daily feedback
- `src/engine/generateFinalReport.ts`: final KPI/grade summary
- `src/rules/strawberry.rules.json`: configurable simulation and feedback rules
- `src/mocks/localStorage.ts`: guest persistence adapter (replaceable by Supabase)

## Notes
- No external weather/image/chat APIs are used.
- Quiz uses local sample images from `public/quiz/*` for training UX only.
