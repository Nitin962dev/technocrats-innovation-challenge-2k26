import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Navigation, AlertTriangle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';

export default function SafeRoute() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState('safe');
  
  const [safePath, setSafePath] = useState([]);
  const [midPath, setMidPath] = useState([]);
  const [riskyPath, setRiskyPath] = useState([]);

  // Connaught Place to India Gate
  const startPos = [28.6304, 77.2177];
  const endPos = [28.6129, 77.2295];
  const centerPos = [28.6210, 77.2230];

  useEffect(() => {
    // Function to fetch perfectly snapped road routing via OSRM
    const fetchRealRoute = async (waypoints, setter) => {
      try {
        const coordsStr = waypoints.map(wp => `${wp[1]},${wp[0]}`).join(';');
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          // OSRM returns GeoJSON [lon, lat], Leaflet expects [lat, lon]
          const latLngs = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setter(latLngs);
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
      }
    };

    // Safe Route (via wide Janpath Road)
    fetchRealRoute([startPos, [28.6200, 77.2185], endPos], setSafePath);
    // Medium Risk (via Mandi House / Barakhamba)
    fetchRealRoute([startPos, [28.6258, 77.2348], endPos], setMidPath);
    // High Risk (inner narrower blocks)
    fetchRealRoute([startPos, [28.6280, 77.2250], endPos], setRiskyPath);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 pb-12 h-full flex flex-col gap-4 relative overflow-y-auto hide-scrollbar bg-slate-50"
    >
      <div className="flex items-start gap-4 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="mt-1 w-10 h-10 shrink-0 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">Safe Route</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time mapping with AI risk scoring.</p>
        </div>
      </div>

      {/* Route Status - Safe (Top) */}
      <div 
        onClick={() => setSelectedRoute('safe')}
        className={`bg-white rounded-[24px] p-5 shadow-sm border transition-all cursor-pointer ${selectedRoute === 'safe' ? 'border-green-400 ring-4 ring-green-50' : 'border-slate-100 hover:bg-slate-50'}`}
      >
        <div className="flex gap-4">
           <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm border border-green-200 shrink-0">
                <Shield size={24} />
              </div>
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-green-600 font-bold mb-0.5">Recommended</p>
                 <p className="text-[15px] font-bold text-slate-800 leading-tight">Safe Route</p>
              </div>
           </div>
           <div className="w-px bg-slate-100 my-1"></div>
           <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="text-right">
                 <p className="text-[15px] font-bold text-slate-800 leading-tight">12 min</p>
                 <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">2.4 km</p>
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow shrink-0 cursor-pointer pointer-events-auto">
                 <Navigation size={18} className="ml-[-2px] mb-[-2px]" />
              </button>
           </div>
        </div>
      </div>

      {/* Map Content (Center) */}
      <div className="flex-1 w-full min-h-[350px] bg-slate-200 rounded-[28px] shadow-sm border border-slate-300 overflow-hidden relative z-0 shrink-0">
        <MapContainer 
          center={centerPos} 
          zoom={14} 
          className="w-full h-full" 
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {/* Routes dynamically snapped to streets */}
          {safePath.length > 0 && <Polyline positions={safePath} color="#10b981" weight={selectedRoute === 'safe' ? 7 : 3} opacity={selectedRoute === 'safe' ? 1 : 0.3} />}
          {midPath.length > 0 && <Polyline positions={midPath} color="#f59e0b" weight={selectedRoute === 'medium' ? 7 : 3} dashArray={selectedRoute === 'medium' ? "0" : "5, 10"} opacity={selectedRoute === 'medium' ? 1 : 0.3} />}
          {riskyPath.length > 0 && <Polyline positions={riskyPath} color="#ef4444" weight={selectedRoute === 'high' ? 7 : 3} dashArray={selectedRoute === 'high' ? "0" : "5, 10"} opacity={selectedRoute === 'high' ? 1 : 0.3} />}
          
          <CircleMarker center={startPos} radius={8} pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 1 }} />
          <CircleMarker center={endPos} radius={8} pathOptions={{ color: '#0f172a', fillColor: '#0f172a', fillOpacity: 1 }} />
        </MapContainer>
      </div>

      {/* Alternative Routes (Bottom) */}
      <div className="bg-white shadow-sm border border-slate-100 p-5 rounded-[24px] shrink-0">
         <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Other Detected Paths</h4>
         <div className="space-y-3">
            <div 
              onClick={() => setSelectedRoute('medium')}
              className={`flex items-center justify-between rounded-2xl p-4 border cursor-pointer transition-all ${selectedRoute === 'medium' ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-50' : 'bg-amber-50/80 border-amber-100 hover:bg-amber-50'}`}
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-amber-900 leading-tight">Medium Risk</span>
                    <span className="block text-[10px] text-amber-700/70 mt-1 font-medium">Dimly lit areas detected</span>
                  </div>
               </div>
               <span className="text-xs font-bold text-amber-700 bg-amber-200/50 px-3 py-1.5 rounded-md">8 min</span>
            </div>
            
            <div 
              onClick={() => setSelectedRoute('high')}
              className={`flex items-center justify-between rounded-2xl p-4 border cursor-pointer transition-all ${selectedRoute === 'high' ? 'bg-red-100 border-red-400 ring-4 ring-red-50' : 'bg-red-50/80 border-red-100 hover:bg-red-50'}`}
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shadow-sm shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-red-900 leading-tight">High Risk Area</span>
                    <span className="block text-[10px] text-red-700/70 mt-1 font-medium">Recent security alert</span>
                  </div>
               </div>
               <span className="text-xs font-bold text-red-700 bg-red-200/50 px-3 py-1.5 rounded-md">6 min</span>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
