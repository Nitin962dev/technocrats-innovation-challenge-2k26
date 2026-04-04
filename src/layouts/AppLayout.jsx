import { Outlet, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AppLayout() {
  const { t } = useLanguage();
  const location = useLocation();

  const isEmergencyOnly = location.state?.emergencyOnly || false;

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl ring-1 ring-slate-900/5 sm:rounded-3xl sm:h-[90vh] sm:mt-[5vh] ${isEmergencyOnly ? 'bg-red-50/20' : 'bg-slate-50'}`}>
      {/* Top App Bar - Completely Cleaned */}
      <div className={`flex items-center justify-center px-6 py-4 backdrop-blur-md z-10 sticky top-0 ${isEmergencyOnly ? 'bg-red-50' : 'bg-white/80 border-b border-purple-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center p-1.5 text-white ${isEmergencyOnly ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-tr from-purple-600 to-fuchsia-500'}`}>
            <Shield className="w-full h-full" strokeWidth={2.5} />
          </div>
          <h1 className={`text-xl font-bold tracking-tight ${isEmergencyOnly ? 'text-red-600' : 'bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent'}`}>
            {isEmergencyOnly ? 'EMERGENCY' : t('app_name') || 'SafeHer'}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative hide-scrollbar pb-0">
        <Outlet />
      </main>
    </div>
  );
}
