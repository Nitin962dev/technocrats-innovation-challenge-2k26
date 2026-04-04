import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Settings2, Clock, ArrowLeft } from 'lucide-react';

export default function FakeCall() {
  const navigate = useNavigate();
  const [callActive, setCallActive] = useState(false);
  const [callerName, setCallerName] = useState('Mom');
  const [timer, setTimer] = useState(0);

  const [savedCallers, setSavedCallers] = useState(() => {
    const saved = localStorage.getItem('hershield_fake_callers');
    return saved ? JSON.parse(saved) : ['Mom', 'Dad', 'Police', 'Brother'];
  });

  useEffect(() => {
    localStorage.setItem('hershield_fake_callers', JSON.stringify(savedCallers));
  }, [savedCallers]);

  const startFakeCall = (delay = 0) => {
    if (delay === 0) {
      setCallActive(true);
    } else {
      setTimeout(() => setCallActive(true), delay * 1000);
    }
  };

  useEffect(() => {
    let interval;
    if (callActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col pt-4"
    >
      <AnimatePresence>
        {callActive ? (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#0f172a] z-50 flex flex-col"
          >
            {/* Call Screen Content */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-3xl text-white mb-6 font-semibold">
                {callerName.charAt(0)}
              </div>
              <h2 className="text-4xl text-white font-medium tracking-tight mb-2">{callerName}</h2>
              <p className="text-slate-400 font-medium">{timer === 0 ? 'Calling...' : formatTime(timer)}</p>
            </div>

            {/* Call Actions */}
            <div className="pb-16 px-8">
              <div className="flex justify-around items-center mb-12 opacity-60">
                <button className="flex flex-col items-center gap-2"><div className="w-16 h-16 rounded-full border border-slate-600 flex items-center justify-center text-white"><Settings2 size={24} /></div><span className="text-white text-xs">Options</span></button>
              </div>
              <div className="flex justify-between px-4">
                <button 
                  onClick={() => setCallActive(false)}
                  className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white drop-shadow-lg"
                >
                  <PhoneOff size={32} />
                </button>
                <button 
                  onClick={() => setTimer(1)}
                  className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white drop-shadow-lg animate-pulse"
                >
                  <Phone size={32} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="px-6 pb-6">
            <div className="flex items-start gap-4 mb-6">
              <button 
                onClick={() => navigate(-1)} 
                className="mt-1 w-10 h-10 shrink-0 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">Fake Call System</h2>
                <p className="text-slate-500 text-xs mt-1 leading-snug">Discreetly simulate an incoming call to escape an uncomfortable situation.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Caller Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-semibold"
                />
                <button 
                  onClick={() => {
                    if (callerName && !savedCallers.includes(callerName)) {
                      setSavedCallers([...savedCallers, callerName]);
                    }
                  }}
                  className="bg-purple-100 text-purple-600 px-4 py-3 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                >
                  Add +
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                 {savedCallers.map(name => (
                    <button 
                      key={name}
                      onClick={() => setCallerName(name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${callerName === name ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/30' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-purple-300'}`}
                    >
                      {name}
                    </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => startFakeCall(0)}
                className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg shadow-slate-900/20 flex flex-col items-center justify-center gap-2"
              >
                <Phone size={24} />
                <span className="font-semibold">Call Now</span>
              </button>
              <button 
                onClick={() => startFakeCall(5)}
                className="bg-white border-2 border-slate-200 text-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-purple-300 transition-colors"
              >
                <Clock size={24} className="text-purple-600" />
                <span className="font-semibold">In 5 Secs</span>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
