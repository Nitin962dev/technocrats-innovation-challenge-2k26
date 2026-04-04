import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Plus, Video, Mic, MapPin, ChevronLeft, UserPlus } from 'lucide-react';

export default function GuardiansSetup() {
  const navigate = useNavigate();
  
  // Mock Data
  const [guardians] = useState([
    { id: 1, name: 'Priya Singh (Mother)', phone: '+91 98765 43210' },
    { id: 2, name: 'Rahul (Brother)', phone: '+91 91234 56789' },
  ]);

  const [settings, setSettings] = useState({
    location: true,
    audio: true,
    video: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fc] font-sans overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7c5ff0] to-[#6042db] pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-lg shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Tracking</h1>
            <p className="text-sm text-indigo-100/80 font-medium">Coordinate with Guardians</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        
        {/* Guardians Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e3e8f1]"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[17px] font-bold text-[#2b3952]">Active Guardians</h2>
            <button className="flex items-center gap-1 text-[#556ee6] text-sm font-semibold bg-[#556ee6]/10 px-3 py-1.5 rounded-full">
              <Plus size={16} /> Add
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {guardians.map(g => (
              <div key={g.id} className="flex items-center gap-4 bg-[#f8f9fc] p-3 rounded-xl">
                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shrink-0">
                   {g.name.charAt(0)}
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-[#2b3952]">{g.name}</p>
                   <p className="text-[11px] text-[#7d879c]">{g.phone}</p>
                 </div>
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What to Share Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e3e8f1]"
        >
          <h2 className="text-[17px] font-bold text-[#2b3952] mb-4">Sharing Options</h2>
          
          <div className="flex flex-col gap-4">
             {/* Location Toggle */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.location ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[#2b3952]">Live Location</p>
                     <p className="text-[11px] text-[#7d879c]">Share GPS coordinates</p>
                   </div>
                </div>
                <Toggle active={settings.location} onClick={() => handleToggle('location')} />
             </div>

             {/* Audio Toggle */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.audio ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                     <Mic size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[#2b3952]">Live Audio</p>
                     <p className="text-[11px] text-[#7d879c]">Stream microphone audio</p>
                   </div>
                </div>
                <Toggle active={settings.audio} onClick={() => handleToggle('audio')} />
             </div>

             {/* Video Toggle */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.video ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                     <Video size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[#2b3952]">Live Video</p>
                     <p className="text-[11px] text-[#7d879c]">Stream device camera</p>
                   </div>
                </div>
                <Toggle active={settings.video} onClick={() => handleToggle('video')} />
             </div>
          </div>
        </motion.div>

        {/* Start Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-auto pt-4"
        >
          <button 
             onClick={() => navigate('/live-session')}
             className="w-full bg-[#7c5bd7] text-white rounded-[20px] py-4 font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-[#6c4fc2] transition-colors active:scale-[0.98] shadow-lg shadow-indigo-500/30"
          >
            Start Tracking Session <Shield size={20} />
          </button>
          <p className="text-center text-[11px] text-[#7d879c] mt-3 uppercase tracking-wider font-semibold">
            Guardians will be notified immediately
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Simple Toggle Component
function Toggle({ active, onClick }) {
  return (
    <div 
       onClick={onClick}
       className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${active ? 'bg-[#7c5bd7]' : 'bg-gray-300'}`}
    >
      <motion.div 
        layout 
        animate={{ x: active ? 24 : 0 }}
        className="w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </div>
  );
}
