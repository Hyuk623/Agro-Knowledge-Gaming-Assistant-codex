import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './app/AppLayout';
import DayResultPage from './pages/DayResultPage';
import FinalReportPage from './pages/FinalReportPage';
import LandingPage from './pages/LandingPage';
import PlayPage from './pages/PlayPage';
import QuizPage from './pages/QuizPage';
import ScenarioIntroPage from './pages/ScenarioIntroPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/scenario" element={<ScenarioIntroPage />} />
        <Route path="/play/:day" element={<PlayPage />} />
        <Route path="/result/:day" element={<DayResultPage />} />
        <Route path="/final-report" element={<FinalReportPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
