import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Map, Phone, Video, Timer, ChevronUp, LogOut, UserCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function FeaturesMenu() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/map', icon: Map, label: t('safe_route') },
    { to: '/fake-call', icon: Phone, label: t('fake_call') },
    { to: '/evidence', icon: Video, label: t('evidence') },
    { to: '/timer', icon: Timer, label: t('timer') },
    { to: '/police', icon: ShieldAlert, label: 'Nearby Police' },
    { to: '/digilocker', icon: UserCircle, label: 'DigiLocker' },
  ];

  return (
    <motion.div 
      initial={{ y: '10%' }}
      animate={{ y: 0 }}
      exit={{ y: '10%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="p-6 min-h-full flex flex-col bg-slate-50 relative hide-scrollbar"
    >
      <div className="flex justify-between items-center mb-8 pt-4">
         <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">App Features</h1>
         <button onClick={handleLogout} className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
           <LogOut size={18} />
         </button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {menuItems.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.to)}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2 shadow-inner">
              <item.icon size={32} />
            </div>
            <span className="font-bold text-slate-700 tracking-wide">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Upward arrow to go back to Home */}
      <motion.div className="w-full flex justify-center mt-6 py-4">
        <motion.button 
          whileHover={{ y: -5 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => navigate('/')}
          className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-purple-600 border border-slate-100"
        >
          <ChevronUp size={24} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
