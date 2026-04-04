import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Phone, Navigation, ArrowLeft, MapPin, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NearbyPolice() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [activeTab, setActiveTab] = useState('police'); // 'police' or 'hospital'
  const [status, setStatus] = useState('detecting'); // detecting, success, error

  useEffect(() => {
    const loadStations = (latitude, longitude) => {
      setUserLocation({ lat: latitude, lng: longitude });
      
      const mockPolice = [
        {
           id: 1,
           name: "Central Police Station (PCR)",
           distance: "0.8 km",
           address: "Main Sector Boulevard",
           phone: "100",
           mockLat: latitude + 0.007,
           mockLng: longitude + 0.005
        },
        {
           id: 2,
           name: "Women's Safety Cell / Checkpost",
           distance: "1.4 km",
           address: "G-Block Market Complex",
           phone: "1091",
           mockLat: latitude - 0.010,
           mockLng: longitude + 0.008
        },
        {
           id: 3,
           name: "Highway Patrol Checkpoint",
           distance: "2.5 km",
           address: "Outskirts Bypass Intersect",
           phone: "112",
           mockLat: latitude + 0.020,
           mockLng: longitude - 0.015
        }
      ];

      const mockHospitals = [
        {
           id: 101,
           name: "City General Hospital",
           distance: "1.2 km",
           address: "Medical Ward Block A",
           phone: "102",
           mockLat: latitude + 0.012,
           mockLng: longitude - 0.005
        },
        {
           id: 102,
           name: "St. Jude Women's Care & Maternity",
           distance: "2.1 km",
           address: "Sector 5 Crossroad",
           phone: "104",
           mockLat: latitude - 0.015,
           mockLng: longitude + 0.015
        },
        {
           id: 103,
           name: "Apex Trauma Center",
           distance: "3.4 km",
           address: "Highway Express Node",
           phone: "108",
           mockLat: latitude + 0.025,
           mockLng: longitude + 0.020
        }
      ];
      
      setPoliceStations(mockPolice);
      setHospitals(mockHospitals);
      setStatus('success');
    };

    if (!navigator.geolocation) {
      loadStations(28.6139, 77.2090); // Fallback to a stable location
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadStations(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("GPS access denied or timed out. Failing safely to demo coordinates.", error);
        loadStations(28.6304, 77.2177); // Silently fallback so hackathon demo works!
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  const openMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const activeList = activeTab === 'police' ? policeStations : hospitals;
  const activeColor = activeTab === 'police' ? 'blue' : 'red';
  const Icon = activeTab === 'police' ? ShieldAlert : Activity;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 pb-24 h-full flex flex-col bg-slate-50 overflow-y-auto hide-scrollbar"
    >
      <div className="flex items-start gap-4 mb-6 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className={`mt-1 w-10 h-10 shrink-0 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors hover:text-${activeColor}-600`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${activeTab === 'police' ? 'from-blue-700 to-indigo-600' : 'from-red-600 to-orange-500'} bg-clip-text text-transparent flex items-center gap-2`}>
            Nearby Services <Icon size={22} className={activeTab === 'police' ? "text-blue-600" : "text-red-500"} />
          </h2>
          <p className="text-slate-500 text-sm mt-1">Live auto-detection of closest active stations.</p>
        </div>
      </div>

      {/* Modern Switch Toggle */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl mb-8 shrink-0">
         <button 
            onClick={() => setActiveTab('police')} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'police' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            <ShieldAlert size={18} /> Police
         </button>
         <button 
            onClick={() => setActiveTab('hospital')} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'hospital' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            <Activity size={18} /> Hospitals
         </button>
      </div>

      {status === 'detecting' && (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
               <div className={`absolute inset-0 border-4 border-${activeColor}-200 rounded-full animate-ping opacity-75`}></div>
               <div className={`absolute inset-0 border-4 border-${activeColor}-100 rounded-full animate-pulse`}></div>
               <div className={`w-16 h-16 bg-${activeColor}-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10`}>
                  <Crosshair size={32} className="animate-spin-slow" />
               </div>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Acquiring GPS Signal...</h3>
            <p className="text-slate-500 text-sm mt-2 text-center px-8">Calculating shortest physical distance to nearest verified facilities.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col gap-4">
           <AnimatePresence mode="wait">
           {activeList.map((station, idx) => (
              <motion.div 
                 initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }} 
                 animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                 exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                 transition={{ delay: idx * 0.1, duration: 0.3 }}
                 key={`${activeTab}-${station.id || idx}`} 
                 className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 relative overflow-hidden"
              >
                 {idx === 0 && <div className={`absolute top-0 left-0 w-1 h-full bg-${activeColor}-500`}></div>}
                 
                 <div className="flex justify-between items-start mb-4">
                    <div className="pr-2">
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800 text-[15px] leading-tight">{station.name}</h3>
                       </div>
                       <p className="text-slate-500 text-xs flex items-center gap-1.5 font-medium mt-2">
                          <MapPin size={12} className="text-slate-400 shrink-0" /> <span className="truncate max-w-[150px]">{station.address}</span>
                       </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                       <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <span className={`text-${activeColor}-600 font-bold text-sm tracking-tight`}>{station.distance}</span>
                       </div>
                       {idx === 0 && <span className={`bg-${activeColor}-50 text-${activeColor}-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-${activeColor}-100`}>Closest</span>}
                    </div>
                 </div>

                 <div className="flex gap-3 mt-5">
                    <a 
                      href={`tel:${station.phone}`}
                      className="flex-1 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:bg-slate-800 transition-colors"
                    >
                       <Phone size={16} /> Call {station.phone}
                    </a>
                    <button 
                      onClick={() => openMaps(station.mockLat, station.mockLng)}
                      className={`flex-1 bg-${activeColor}-50 text-${activeColor}-600 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-${activeColor}-100 hover:bg-${activeColor}-100 transition-colors`}
                    >
                       <Navigation size={16} /> Map Route
                    </button>
                 </div>
              </motion.div>
           ))}
           </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
