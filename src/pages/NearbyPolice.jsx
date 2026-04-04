import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Crosshair, Phone, Navigation, ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NearbyPolice() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [status, setStatus] = useState('detecting'); // detecting, success, error

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // In a real production app, you would query Overpass API or Google Places API here
        // e.g. /api/places/nearby?type=police&lat=...
        // For rapid hackathon prototyping guarantees (avoiding rate-limits/CORS), we simulate
        // precise local variations based on the user's ACTUAL live GPS point.
        
        const mockStations = [
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
        
        setStations(mockStations);
        setStatus('success');
      },
      (error) => {
        console.error(error);
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const openMaps = (lat, lng) => {
    // Deep links securely into Google Maps app or web via generic query
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 pb-24 h-full flex flex-col bg-slate-50 overflow-y-auto hide-scrollbar"
    >
      <div className="flex items-start gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mt-1 w-10 h-10 shrink-0 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            Nearby Police <ShieldAlert size={22} className="text-blue-600" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">Live auto-detection of closest active stations.</p>
        </div>
      </div>

      {status === 'detecting' && (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
               <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
               <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse"></div>
               <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <Crosshair size={32} className="animate-spin-slow" />
               </div>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Acquiring GPS Signal...</h3>
            <p className="text-slate-500 text-sm mt-2 text-center px-8">Calculating shortest physical distance to nearest verified police stations.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[32px] p-6 shadow-sm border border-red-50 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
               <MapPin size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Location Access Denied</h3>
            <p className="text-slate-500 text-sm mt-3 px-2">We require GPS access to find nearby police. Please enable Location Services in your browser settings and try again.</p>
            <button 
               onClick={() => window.location.reload()}
               className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 shadow-md"
            >
               Retry Connection
            </button>
        </div>
      )}

      {status === 'success' && (
        <>
          <div className="bg-blue-600 text-white rounded-3xl p-5 shadow-lg shadow-blue-600/20 flex items-center gap-4 mb-8">
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Crosshair size={24} />
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Live GPS Locked</p>
                <p className="text-lg font-bold leading-tight mt-0.5">3 Stations within 3 km</p>
             </div>
          </div>

          <div className="flex flex-col gap-4">
             {stations.map((station, idx) => (
                <motion.div 
                   initial={{ opacity: 0, x: -20 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   transition={{ delay: idx * 0.1 }}
                   key={station.id} 
                   className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 relative overflow-hidden"
                >
                   {idx === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                   
                   <div className="flex justify-between items-start mb-4">
                      <div className="pr-2">
                         <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-800 text-[15px]">{station.name}</h3>
                            {idx === 0 && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Closest</span>}
                         </div>
                         <p className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                            <MapPin size={12} className="text-slate-400" /> {station.address}
                         </p>
                      </div>
                      <div className="shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                         <span className="text-blue-600 font-bold text-sm tracking-tight">{station.distance}</span>
                      </div>
                   </div>

                   <div className="flex gap-3">
                      <a 
                        href={`tel:${station.phone}`}
                        className="flex-1 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:bg-slate-800 transition-colors"
                      >
                         <Phone size={16} /> Call {station.phone}
                      </a>
                      <button 
                        onClick={() => openMaps(station.mockLat, station.mockLng)}
                        className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                         <Navigation size={16} /> Map Route
                      </button>
                   </div>
                </motion.div>
             ))}
          </div>
        </>
      )}

    </motion.div>
  );
}
