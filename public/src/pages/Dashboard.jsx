import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, MapPin, Building2, Contact, CheckCircle2, HeartPulse, User, Navigation, Mic, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
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
      className={`p-4 flex flex-col gap-4 items-center ${isEmergencyOnly ? 'min-h-screen bg-red-50/50' : ''}`}
    >
      {/* Header Info OR Back to Login */}
      {isEmergencyOnly ? (
        <div className="w-full mb-2 flex justify-start">
           <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-red-600 hover:bg-red-100 transition-colors font-bold uppercase tracking-wider text-sm bg-white px-4 py-2 border border-red-200 rounded-full shadow-sm active:scale-95">
             <ArrowLeft size={18} /> Exit Emergency Mode
           </button>
        </div>
      ) : (
        <div className="w-full flex justify-between items-start -mt-2">
          {/* Spacer to perfectly center the location block */}
          <div className="w-10 h-10 invisible" />
          
          <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1.5 z-10">
            <MapPin size={14} className="text-purple-600" />
            <span className="text-slate-700 text-sm font-semibold tracking-tight">Connaught Place, Delhi</span>
          </div>

          <motion.button 
             whileHover={{ x: 5 }}
             animate={{ x: [0, 5, 0] }}
             transition={{ repeat: Infinity, duration: 2 }}
             onClick={() => navigate('/menu')}
             className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-500 hover:text-purple-600 border border-slate-100 z-10"
           >
             <ChevronRight size={20} />
          </motion.button>
        </div>
      )}

      {/* SOS Button Area */}
      <div className="flex flex-col items-center -mt-2">
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
           className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border ${isListening ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-red-50 border-red-100 text-red-500'}`}
        >
           <Mic size={14} className={isListening ? "text-purple-600 animate-pulse" : ""} />
           {isListening ? (
             <span>Say <strong>"Help Help"</strong> or <strong>"Bachao Bachao"</strong> to auto-trigger SOS</span>
           ) : (
             <span>Please allow Microphone access for Voice SOS</span>
           )}
        </motion.div>
      </div>

      {/* Continuous Red Alarm SOS Panel */}
      {sosActive && (
        <motion.div 
           initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
           className="w-full mt-4 bg-red-600 rounded-[32px] p-6 text-white text-center shadow-[0_0_50px_rgba(220,38,38,0.5)] flex flex-col items-center z-10"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
             <AlertOctagon size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-wide uppercase">Emergency Active</h2>
          <p className="text-red-100 font-medium mb-6 text-sm">Do not close this app. Help is being notified.</p>
          
          {/* Automated Alert Dispatch Simulation */}
          <div className="w-full space-y-3 mb-6">
             <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="bg-black/20 rounded-2xl p-3 flex items-center gap-3 text-left"
             >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600 shrink-0">
                   <Phone size={14} className="fill-current" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">SMS Dispatched</p>
                   <p className="text-[10px] text-red-200">Location sent to Mom (+91 9876xxxxxx)</p>
                </div>
                <CheckCircle2 size={16} className="text-green-400 ml-auto" />
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                className="bg-black/20 rounded-2xl p-3 flex items-center gap-3 text-left"
             >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shrink-0">
                   <Shield size={14} className="fill-current" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Police Notified</p>
                   <p className="text-[10px] text-red-200">Nearest PCR Van dispatched</p>
                </div>
                <CheckCircle2 size={16} className="text-green-400 ml-auto" />
             </motion.div>
          </div>

          <div className="w-full flex justify-between gap-3">
            <button 
              onClick={handleCancelSOS}
              className="flex-1 bg-black text-white py-3.5 rounded-full font-bold text-sm tracking-wide shadow-lg border-2 border-black/50"
            >
              Cancel SOS
            </button>
            <button className="flex-1 bg-white text-red-600 py-3.5 rounded-full font-bold shadow-lg text-sm tracking-wide active:scale-95 transition-transform duration-200">
              Mute Alarm
            </button>
          </div>
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
