import { motion } from 'framer-motion';
import { Shield, Navigation, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SafeRoute() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 pb-32 h-full flex flex-col"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">Safe Route</h2>
        <p className="text-slate-500 text-sm">AI-driven risk scoring & navigation.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
        {/* Fake Map Background using CSS Patterns */}
        <div className="absolute inset-0 bg-[#f4f7f6] opacity-80" 
             style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Routes SVG Overlay */}
        <div className="absolute inset-0 w-full h-full p-8 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Risky Route */}
            <motion.path 
              d="M 10,10 Q 50,20 60,80" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="1.5" 
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            {/* Safe Route */}
            <motion.path 
              d="M 10,10 Q 30,50 90,90" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="2.5" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
             {/* Medium Route */}
             <motion.path 
              d="M 10,10 Q 80,40 90,90" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="1.5" 
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.3 }}
            />
            
            {/* Start point */}
            <circle cx="10" cy="10" r="3" fill="#8b5cf6" />
            <circle cx="10" cy="10" r="6" fill="#8b5cf6" opacity="0.3">
               <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* End point */}
            <circle cx="90" cy="90" r="3" fill="#0f172a" />
          </svg>

          {/* Markers */}
          <div className="absolute top-[10%] left-[10%] -translate-x-1/2 -translate-y-full pb-2">
             <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap shadow-lg">Current</div>
          </div>
          <div className="absolute top-[90%] left-[90%] -translate-x-1/2 -translate-y-full pb-2">
             <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap shadow-lg">Destination</div>
          </div>
        </div>

        {/* Floating Route Status */}
        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20">
          <div className="flex gap-4">
             <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Shield size={16} />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Suggested</p>
                   <p className="text-sm font-bold text-slate-800">Safe Route</p>
                </div>
             </div>
             <div className="w-px bg-slate-200"></div>
             <div className="flex items-center gap-2 flex-1">
                <div>
                   <p className="text-xs font-bold text-slate-800">12 min</p>
                   <p className="text-[10px] text-slate-500">2.4 km</p>
                </div>
                <button className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center ml-auto shadow-md">
                   <Navigation size={14} />
                </button>
             </div>
          </div>
        </div>

        {/* Alternative Routes bottom peek */}
        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgb(0,0,0,0.05)] border-t border-slate-100 p-4">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Alternative Routes</h4>
           <div className="space-y-2">
              <div className="flex items-center justify-between bg-amber-50 rounded-xl p-3 border border-amber-100">
                 <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span className="text-sm font-semibold text-amber-900">Medium Risk</span>
                 </div>
                 <span className="text-xs font-medium text-amber-700">8 min</span>
              </div>
              <div className="flex items-center justify-between bg-red-50 rounded-xl p-3 border border-red-100">
                 <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-sm font-semibold text-red-900">High Risk Area</span>
                 </div>
                 <span className="text-xs font-medium text-red-700">6 min</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
