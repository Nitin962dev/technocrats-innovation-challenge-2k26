import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, CheckCircle2, Lock, Share2 } from 'lucide-react';

export default function Evidence() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVal, setRecordedVal] = useState(0);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording time increment
      const intVal = setInterval(() => {
        setRecordedVal(prev => prev + 1);
      }, 1000);
      window.recInterval = intVal;
    } else {
      setIsRecording(false);
      clearInterval(window.recInterval);
      setRecordedVal(0);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 pb-24 h-full flex flex-col"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
          Evidence <Lock size={20} className="text-fuchsia-600" />
        </h2>
        <p className="text-slate-500 text-sm mt-1">Tamper-proof audio/video recording uploaded to secure cloud.</p>
      </div>

      {/* Recorder Area */}
      <div className={`relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${isRecording ? 'h-[60%] ring-4 ring-red-500/50' : 'h-64'}`}>
        {/* Placeholder for Camera Feed */}
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center opacity-50">
           <Video size={48} className="text-slate-600" />
        </div>
        
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-600 shadow-lg shadow-red-600/30 font-mono text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
             <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
             {formatTime(recordedVal)}
          </div>
        )}

        <div className="absolute bottom-6 w-full flex justify-center z-10">
          <button 
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
              isRecording 
                ? 'border-red-400 bg-transparent' 
                : 'border-white/50 bg-white shadow-lg'
            }`}
          >
             <div className={`transition-all duration-300 ${isRecording ? 'w-6 h-6 bg-red-500 rounded-sm' : 'w-12 h-12 bg-red-500 rounded-full'}`} />
          </button>
        </div>
      </div>

      {/* Status / History */}
      <div className="mt-8 flex-1">
         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
           Recent Evidence
           <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Cloud Synced</span>
         </h3>
         
         <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    {i === 1 ? <Video size={20} /> : <Mic size={20} />}
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{i === 1 ? 'Video Recording' : 'Audio Snippet'}</p>
                    <p className="text-[10px] text-slate-500">{i === 1 ? 'Today, 2:30 PM • 14 MB' : 'Yesterday, 8:15 PM • 2 MB'}</p>
                 </div>
                 <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors">
                    <Share2 size={16} />
                 </button>
              </div>
            ))}
         </div>
      </div>

    </motion.div>
  );
}
