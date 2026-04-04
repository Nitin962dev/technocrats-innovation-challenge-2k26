import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, MapPin, Building2, Contact, CheckCircle2, HeartPulse, User, Navigation, Mic, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const [sosActive, setSosActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const isEmergencyOnly = location.state?.emergencyOnly || false;

  const handleSos = () => {
    setSosActive(!sosActive);
  };

  // Voice Interaction Hook
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      const transcriptLower = currentTranscript.toLowerCase();
      if (transcriptLower.includes('help help') || transcriptLower.includes('bachao bachao')) {
        setSosActive(true);
        if ("vibrate" in navigator) {
           navigator.vibrate([500, 200, 500, 200, 500]);
        }
      }
    };

    recognition.onend = () => {
       setIsListening(false);
       // Auto-restart to maintain continuous listening
       setTimeout(() => {
         try {
           recognition.start();
         } catch (e) {}
       }, 1000);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }

    return () => {
      recognition.onend = null; // Prevent restart on unmount
      recognition.stop();
    };
  }, []);

  const emergencyContacts = [
    { name: 'Women Helpline', number: '1091', icon: Contact },
    { name: 'Domestic Abuse', number: '181', icon: ShieldAlert },
    { name: 'Police', number: '112', icon: Building2 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-6 flex flex-col gap-8 items-center ${isEmergencyOnly ? 'min-h-screen bg-red-50/50' : ''}`}
    >
      {/* Header Info OR Back to Login */}
      {isEmergencyOnly ? (
        <div className="w-full mb-2 flex justify-start">
           <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-red-600 hover:bg-red-100 transition-colors font-bold uppercase tracking-wider text-sm bg-white px-4 py-2 border border-red-200 rounded-full shadow-sm active:scale-95">
             <ArrowLeft size={18} /> Exit Emergency Mode
           </button>
        </div>
      ) : (
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('current_location')}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={16} className="text-purple-600" />
              <h2 className="text-slate-800 font-semibold tracking-tight">Connaught Place, Delhi</h2>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border-2 border-purple-200">
            U
          </div>
        </div>
      )}

      {/* SOS Button Area */}
      <div className="flex flex-col items-center mt-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {sosActive && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 bg-red-500 rounded-full"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 bg-red-400 rounded-full"
              />
            </>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSos}
            className={`relative z-10 w-48 h-48 rounded-full shadow-2xl flex flex-col items-center justify-center text-white font-bold transition-all duration-300 ${
              sosActive 
                ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-red-500/50' 
                : 'bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-purple-500/50'
            }`}
          >
            <ShieldAlert size={48} className="mb-2" />
            <span className="text-3xl tracking-widest">{sosActive ? t('sos_active') : t('sos_button')}</span>
            <span className="text-xs font-normal opacity-80 mt-1 uppercase tracking-wider">{t('sos_press_prompt')}</span>
          </motion.button>
        </div>
        
        {/* Voice Listening Status */}
        <motion.div 
           initial={{ opacity: 0 }} animate={{ opacity: 1 }}
           className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border ${isListening ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-red-50 border-red-100 text-red-500'}`}
        >
           <Mic size={14} className={isListening ? "text-purple-600 animate-pulse" : ""} />
           {isListening ? (
             <span>Say <strong>"Help Help"</strong> or <strong>"Bachao Bachao"</strong> to auto-trigger SOS</span>
           ) : (
             <span>Please allow Microphone access for Voice SOS</span>
           )}
        </motion.div>
      </div>

      {/* SOS Active Alerts & Animated Police Path */}
      {sosActive && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full flex flex-col gap-3 mt-2"
        >
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <CheckCircle2 size={20} className="text-red-600" />
            <User size={18} className="text-red-500" />
            <p className="text-sm font-semibold text-red-800">{t('alert_family')}</p>
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <CheckCircle2 size={20} className="text-red-600" />
            <HeartPulse size={18} className="text-red-500" />
            <p className="text-sm font-semibold text-red-800">{t('alert_hospital')}</p>
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <CheckCircle2 size={20} className="text-red-600" />
            <Building2 size={18} className="text-red-500" />
            <p className="text-sm font-semibold text-red-800">{t('alert_police')}</p>
          </motion.div>

          {/* Animated Location Tracking (Police to Women) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 1.5 }}
            className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl"
          >
             <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-green-400">{t('police_dispatch')}</span>
                  <span className="text-xl font-black">{t('dispatch_eta')}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                  <Navigation size={20} className="text-blue-400" />
                </div>
             </div>
             
             {/* Map Mock */}
             <div className="relative h-48 bg-[#f4f7f6] overflow-hidden">
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Route path */}
                  <motion.path 
                    d="M 90,90 Q 50,80 30,50 T 10,10" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 2 }}
                  />
                  {/* Woman Location */}
                  <circle cx="10" cy="10" r="4" fill="#ef4444" />
                  <circle cx="10" cy="10" r="10" fill="#ef4444" opacity="0.3">
                    <animate attributeName="r" values="6;16;6" dur="1s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Police Station Location */}
                  <circle cx="90" cy="90" r="4" fill="#0f172a" />
                </svg>

                {/* Animated Police Marker */}
                <motion.div 
                  className="absolute w-4 h-4 bg-blue-500 rounded border-2 border-white shadow-lg z-10 flex items-center justify-center"
                  initial={{ top: '85%', left: '85%' }}
                  animate={{ top: '10%', left: '10%' }}
                  transition={{
                    duration: 5,
                    delay: 3,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                >
                   <div className="w-1 h-1 bg-white rounded-full"></div>
                </motion.div>
             </div>
          </motion.div>
        </motion.div>
      )}

      {/* Live Tracking & Guardians Banner */}
      {!sosActive && !isEmergencyOnly && (
        <motion.div 
          onClick={() => navigate('/guardians')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-2 bg-gradient-to-r from-[#7c5ff0] to-[#6042db] rounded-[24px] p-5 shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center justify-between text-white overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Navigation size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wide">Live Tracking</h3>
              <p className="text-indigo-100 text-sm font-medium">Add Guardians & Share Location</p>
            </div>
          </div>
          <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <User size={16} />
          </div>
        </motion.div>
      )}

      {/* Govt Quick Access Data structure mock */}
      {!sosActive && !isEmergencyOnly && (
        <div className="w-full mt-4">
          <h3 className="text-slate-800 font-bold mb-4 flex items-center justify-between">
            <span>{t('national_emergency')}</span>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Govt APIs</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {emergencyContacts.map((contact, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -2 }}
                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <contact.icon size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-500">{contact.name}</p>
                  <p className="text-sm font-bold text-slate-800">{contact.number}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
