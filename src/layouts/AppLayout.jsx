import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Map, Phone, Video, Timer, Languages, LogOut, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { toggleLanguage, t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEmergencyOnly = location.state?.emergencyOnly || false;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: Shield, label: t('sos_button') },
    { to: '/map', icon: Map, label: t('safe_route') },
    { to: '/fake-call', icon: Phone, label: t('fake_call') },
    { to: '/evidence', icon: Video, label: t('evidence') },
    { to: '/timer', icon: Timer, label: t('timer') },
  ];

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl ring-1 ring-slate-900/5 sm:rounded-3xl sm:h-[90vh] sm:mt-[5vh] ${isEmergencyOnly ? 'bg-red-50/20' : 'bg-slate-50'}`}>
      {/* Top App Bar Simulator */}
      <div className={`flex items-center justify-between px-6 py-4 backdrop-blur-md z-10 sticky top-0 ${isEmergencyOnly ? 'bg-red-50' : 'bg-white/80 border-b border-purple-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center p-1.5 text-white ${isEmergencyOnly ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-tr from-purple-600 to-fuchsia-500'}`}>
            <Shield className="w-full h-full" strokeWidth={2.5} />
          </div>
          <h1 className={`text-xl font-bold tracking-tight ${isEmergencyOnly ? 'text-red-600' : 'bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent'}`}>
            {isEmergencyOnly ? 'EMERGENCY' : t('app_name')}
          </h1>
        </div>
        
        {/* Utilities Area - Hidden in Emergency Mode */}
        {!isEmergencyOnly && (
          <div className="flex gap-4 items-center">
            <button onClick={toggleLanguage} className="text-slate-500 hover:text-purple-600 transition-colors">
              <Languages size={20} />
            </button>
            <button onClick={() => navigate('/digilocker')} className="text-slate-500 hover:text-purple-600 transition-colors">
              <UserCircle size={20} />
            </button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors ml-1">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto relative hide-scrollbar ${isEmergencyOnly ? 'pb-0' : 'pb-24'}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation - Hidden in Emergency Mode */}
      {!isEmergencyOnly && (
        <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-3 pb-8 sm:pb-3 sm:rounded-b-3xl">
          <ul className="flex items-center justify-between pointer-events-auto">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
                      isActive ? 'text-purple-600' : 'text-slate-400 hover:text-purple-500'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute -bottom-2 lef-1/2 w-1.5 h-1.5 rounded-full bg-purple-600 left-[50%] -translate-x-[50%]"
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      )}
                    </motion.div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
