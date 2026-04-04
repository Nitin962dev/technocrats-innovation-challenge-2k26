import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer as TimerIcon, StopCircle, Play, ArrowLeft, Shield, Phone, Hospital, Building, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Timer() {
  const navigate = useNavigate();
  const START_TIME = 20 * 60; // 20 minutes
  
  // For demo testing, you might want to temporarily change this to 5 seconds by typing 5 instead of START_TIME
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
      // Safety timer completely expired!
      setIsExpired(true);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const cancelAndReturn = () => {
    setIsRunning(false);
    navigate(-1);
  };
  
  const resetSOS = () => {
      // Emergency secure exit (mocked for demo)
      setIsExpired(false);
      setTimeLeft(START_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = ((START_TIME - timeLeft) / START_TIME) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 pb-12 h-full flex flex-col items-center justify-start overflow-y-auto hide-scrollbar bg-slate-50 relative"
    >
      {/* Header */}
      <div className="w-full flex items-start gap-4 mb-10 shrink-0">
        <button 
          onClick={cancelAndReturn} 
          className="mt-1 w-10 h-10 shrink-0 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
            Safety Timer <TimerIcon size={24} className="text-purple-600" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">If not stopped before returning, help is automatically dispatched.</p>
        </div>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12 shrink-0">
         {/* Circular Progress Background */}
         <svg className="w-full h-full -rotate-90 transform absolute inset-0 drop-shadow-md" viewBox="0 0 100 100">
           <circle 
             cx="50" cy="50" r="45" 
             fill="none" 
             stroke="#e2e8f0" 
             strokeWidth="4" 
           />
           <motion.circle 
             cx="50" cy="50" r="45" 
             fill="none" 
             stroke={timeLeft < 300 ? '#ef4444' : '#8b5cf6'} 
             strokeWidth="4" 
             strokeLinecap="round"
             strokeDasharray="283"
             strokeDashoffset={283 - (283 * progress) / 100}
             className="transition-all duration-1000 ease-linear"
           />
         </svg>

         {/* Timer Text */}
         <div className="text-center z-10 flex flex-col items-center justify-center bg-white w-[180px] h-[180px] rounded-full shadow-lg border-4 border-slate-50">
            <span className={`text-[3.2rem] font-bold tracking-tighter ${timeLeft < 300 && isRunning ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Remaining</span>
         </div>
      </div>

      <div className="flex w-full px-6 flex-col items-center gap-4 shrink-0">
         <button 
           onClick={toggleTimer}
           className={`w-full py-4 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 ${isRunning ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-slate-900 hover:bg-black shadow-slate-900/20'}`}
         >
            {isRunning ? (
              <><StopCircle size={24} /> Stop Safely Code</>
            ) : (
              <><Play size={24} /> Start 20-Min Trip</>
            )}
         </button>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 font-medium px-4">
        Lock your phone and walk with confidence. We are holding the dead-man switch.
      </div>

      {/* The Danger Automated Dispatch Overlay when Timer Hits 0 */}
      <AnimatePresence>
      {isExpired && (
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: 50 }} 
           animate={{ opacity: 1, scale: 1, y: 0 }}
           className="absolute inset-0 z-50 bg-red-600 flex flex-col items-center p-6 text-white overflow-y-auto"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex flex-col items-center justify-center mb-6 mt-10 shrink-0">
             <AlertOctagon size={40} className="text-white animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-black mb-2 tracking-wide uppercase text-center">Timer Expired!</h2>
          <p className="text-red-100 font-bold mb-8 text-center bg-black/20 px-4 py-2 rounded-xl">
             You failed to cancel the 20-minute safety timer. Automated SOS has been forcibly deployed!
          </p>
          
          {/* Dispatch Logs */}
          <div className="w-full space-y-3 mb-10">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-black/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                   <Phone size={20} className="fill-current" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Family & Friends</p>
                   <p className="text-[11px] text-red-200 mt-0.5">Live tracking link dispatched to Guardians.</p>
                </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="bg-black/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                   <Shield size={20} className="fill-current" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Nearest Police Station</p>
                   <p className="text-[11px] text-red-200 mt-0.5">Coordinates sent to central PCR immediately.</p>
                </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="bg-black/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                   <Hospital size={20} className="fill-current" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Hospitals & Ambulance</p>
                   <p className="text-[11px] text-red-200 mt-0.5">Medical alert registered on standby.</p>
                </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.5 }} className="bg-black/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                   <Building size={20} className="fill-current" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Educational Institutes</p>
                   <p className="text-[11px] text-red-200 mt-0.5">Campus security flagged with last known zone.</p>
                </div>
             </motion.div>
          </div>

          <button 
            onClick={resetSOS}
            className="w-full bg-white text-red-600 py-4 rounded-2xl font-bold shadow-2xl text-lg mt-auto active:scale-95 transition-transform"
          >
            I am Safe (Require PIN)
          </button>
        </motion.div>
      )}
      </AnimatePresence>

    </motion.div>
  );
}
