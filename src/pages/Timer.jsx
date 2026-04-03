import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon, StopCircle, Play, AlertCircle } from 'lucide-react';

export default function Timer() {
  const START_TIME = 20 * 60; // 20 minutes
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Trigger automatically
      alert('Safety Timer Expired! SOS Triggered automatically.');
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
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
      className="p-6 h-full flex flex-col items-center justify-center pt-10"
    >
      <div className="text-center mb-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent inline-flex items-center gap-2">
          Safety Timer <TimerIcon size={24} className="text-purple-600" />
        </h2>
        <p className="text-slate-500 text-sm mt-2">Set a timer for your trip. If not cancelled before it ends, an SOS alert is sent automatically.</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
         {/* Circular Progress Background */}
         <svg className="w-full h-full -rotate-90 transform absolute inset-0" viewBox="0 0 100 100">
           <circle 
             cx="50" cy="50" r="45" 
             fill="none" 
             stroke="#f1f5f9" 
             strokeWidth="3" 
           />
           <motion.circle 
             cx="50" cy="50" r="45" 
             fill="none" 
             stroke="#8b5cf6" 
             strokeWidth="3" 
             strokeLinecap="round"
             strokeDasharray="283"
             strokeDashoffset={283 - (283 * progress) / 100}
             className="transition-all duration-1000 ease-linear"
           />
         </svg>

         {/* Timer Text */}
         <div className="text-center z-10 flex flex-col items-center justify-center bg-white w-48 h-48 rounded-full shadow-lg border-4 border-slate-50">
            <span className="text-5xl font-bold tracking-tighter text-slate-800">{formatTime(timeLeft)}</span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-2">Remaining</span>
         </div>

         {/* Pulse effect if low time */}
         {timeLeft < 300 && isRunning && (
             <motion.div
               animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 border-4 border-red-500 rounded-full"
             />
         )}
      </div>

      <div className="flex items-center gap-6">
         <button 
           onClick={toggleTimer}
           className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgb(0,0,0,0.2)] hover:bg-slate-800 transition-colors"
         >
            {isRunning ? <StopCircle size={36} className="text-red-400" /> : <Play size={36} className="ml-2 text-green-400" />}
         </button>

         <button 
            onClick={resetTimer}
            disabled={isRunning || timeLeft === START_TIME}
            className="w-14 h-14 bg-white text-slate-600 rounded-full flex items-center justify-center shadow-md border border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
             <AlertCircle size={20} />
          </button>
      </div>

    </motion.div>
  );
}
