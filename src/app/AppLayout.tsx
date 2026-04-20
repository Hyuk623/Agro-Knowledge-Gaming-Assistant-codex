import { Outlet } from 'react-router-dom';
import { APP_CONFIG } from '../config/constants';

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-screen w-full bg-slate-50 px-4 py-5" style={{ maxWidth: APP_CONFIG.maxMobileWidth }}>
      <Outlet />
    </div>
  );
}
