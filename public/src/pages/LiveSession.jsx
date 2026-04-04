import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Video, Mic, AlertTriangle, PhoneCall, XSquare } from 'lucide-react';

export default function LiveSession() {
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(0);

  // Simple timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-white font-sans overflow-hidden">
      
      {/* Top Bar - Live Status */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-20">
         <div className="flex items-center gap-3">
             <motion.div 
                animate={{ opacity: [1, 0.5, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.8)]"
             />
             <span className="font-bold tracking-widest text-sm">LIVE</span>
             <span className="text-gray-400 text-sm ml-2 font-mono">{formatTime(sessionTime)}</span>
         </div>
         <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Eye size={16} className="text-green-400" />
            <span className="text-sm font-semibold">2 Guardians</span>
         </div>
      </div>

      {/* Main Map Background (Simulated) */}
      <div className="absolute inset-0 z-0 bg-[#1f2937] opacity-80" 
           style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* Simulated Radar/Pulse on Map */}
             <motion.div 
               animate={{ scale: [1, 3], opacity: [0.5, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
               className="w-24 h-24 bg-indigo-500 rounded-full"
             />
             <div className="w-6 h-6 bg-indigo-500 rounded-full border-4 border-white absolute shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
          </div>
      </div>

      {/* Floating PIP Video Feed (Simulated) */}
      <motion.div 
         initial={{ x: 50, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         transition={{ delay: 0.5 }}
         className="absolute top-24 right-6 w-32 h-44 bg-slate-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20 flex flex-col items-center justify-center relative"
      >
         {/* Animated user silhouette */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 opacity-80" />
         <motion.div 
           animate={{ y: [-2, 2, -2] }} 
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         >
           <Shield size={48} className="text-slate-600 mb-2" />
         </motion.div>
         <div className="absolute top-2 right-2 flex gap-1">
             <div className="w-2 h-2 bg-red-500 rounded-full"></div>
         </div>
         <p className="absolute bottom-2 text-[10px] font-bold text-white/70 bg-black/50 px-2 py-0.5 rounded">Front Cam</p>
      </motion.div>

      {/* Bottom Info & Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
         
         {/* Stream Status Bar */}
         <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 mb-6 shadow-2xl flex items-center justify-between">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-green-400">
                   <Video size={14} /> <span className="text-xs font-bold uppercase tracking-wider">Video Secure</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                   <Mic size={14} /> 
                   <div className="flex gap-0.5 mt-0.5">
                      {/* Audio wave simulation */}
                      {[1,2,3,4,5].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ height: ['4px', `${Math.random() * 12 + 4}px`, '4px'] }}
                           transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                           className="w-1 bg-indigo-400 rounded-full"
                         />
                      ))}
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wider ml-1">Live Audio</span>
                </div>
             </div>
             
             <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Encrypted Link</p>
                <div className="flex items-center justify-end gap-1">
                   <Shield size={12} className="text-white" />
                   <p className="text-xs font-bold text-white">AES-256</p>
                </div>
             </div>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-4">
             <button className="flex-1 bg-red-600 text-white rounded-[24px] py-4 font-bold text-[17px] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95 transition-transform">
               <AlertTriangle size={20} strokeWidth={2.5} /> SOS
             </button>
             
             <button 
                onClick={() => navigate('/guardians')}
                className="w-16 h-16 bg-white/10 border border-white/20 text-white backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
             >
               <XSquare size={24} />
             </button>
         </div>
      </div>

    </div>
  );
}
