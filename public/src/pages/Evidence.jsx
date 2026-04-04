import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, CheckCircle2, Lock, Share2, ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Evidence() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVal, setRecordedVal] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error("SecureContextRequired");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err) {
        console.error("Camera access error:", err);
        let errorMsg = err.message || "Unknown hardware error";
        
        if (err.message === "SecureContextRequired") {
           errorMsg = "Requires HTTPS. If testing on mobile, use an HTTPS tunnel or localhost.";
        } else if (err.name === 'NotAllowedError') {
           errorMsg = "Permission Denied. Check browser & OS camera settings.";
        } else if (err.name === 'NotFoundError') {
           errorMsg = "No camera hardware detected attached to this device.";
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
           errorMsg = "Camera is currently in use by Zoom/Meet or another app.";
        }

        setCameraError(errorMsg);
      }
    };

    startCamera();

    // Clean up tracks when component unmounts
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (window.recInterval) {
        clearInterval(window.recInterval);
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!isRecording) {
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject;
         mediaRecorderRef.current = new MediaRecorder(stream);
         
         mediaRecorderRef.current.ondataavailable = (e) => {
           if (e.data && e.data.size > 0) {
             chunksRef.current.push(e.data);
           }
         };

         mediaRecorderRef.current.onstop = () => {
           const blob = new Blob(chunksRef.current, { type: 'video/webm' });
           const url = URL.createObjectURL(blob);
           const newRecording = {
              id: Date.now(),
              url,
              type: 'video',
              date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              size: (blob.size / (1024 * 1024)).toFixed(2) + ' MB'
           };
           setRecordings(prev => [newRecording, ...prev]);
           chunksRef.current = []; // reset chunks
         };

         mediaRecorderRef.current.start();
         
         setIsRecording(true);
         const intVal = setInterval(() => {
           setRecordedVal(prev => prev + 1);
         }, 1000);
         window.recInterval = intVal;
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
         mediaRecorderRef.current.stop();
      }
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
      className="p-6 pb-24 h-full flex flex-col overflow-y-auto hide-scrollbar"
    >
      <div className="flex items-start gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mt-1 w-10 h-10 shrink-0 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
            Evidence <Lock size={20} className="text-fuchsia-600" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">Live camera capture. Footage is tamper-proofed.</p>
        </div>
      </div>

      {/* Recorder Area */}
      <div className={`relative bg-slate-900 rounded-[32px] overflow-hidden shadow-xl border-4 transition-all duration-500 ${isRecording ? 'h-[55vh] border-red-500/50 ring-4 ring-red-500/20' : 'h-[30vh] border-slate-800'}`}>
        
        {/* Live Video Feed */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Fallback if camera not working */}
        {cameraError && (
          <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-center p-6 z-10">
             <Video size={48} className="text-slate-700 mb-3" />
             <p className="text-slate-300 text-sm font-bold mb-2">Camera Unavailable</p>
             <p className="text-red-400 text-[11px] font-semibold bg-red-950/40 px-3 py-2 rounded-xl ring-1 ring-red-500/30 w-full max-w-[250px] leading-snug">{cameraError}</p>
          </div>
        )}
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-600 shadow-lg shadow-red-600/30 font-mono text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 z-20">
             <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
             {formatTime(recordedVal)}
          </div>
        )}

        <div className="absolute bottom-6 w-full flex justify-center z-20">
          <button 
            onClick={toggleRecording}
            disabled={!!cameraError}
            className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording 
                ? 'border-red-400 bg-transparent' 
                : 'border-white/50 bg-white shadow-lg shadow-black/20'
            }`}
          >
             <div className={`transition-all duration-300 ${isRecording ? 'w-6 h-6 bg-red-500 rounded-sm' : 'w-12 h-12 bg-red-500 rounded-full'}`} />
          </button>
        </div>
      </div>

      {/* Status / History */}
      <div className="mt-8 flex-1">
         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
           Captured Evidence
           <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold"><CheckCircle2 size={14}/> Cloud Ready</span>
         </h3>
         
         <div className="flex flex-col gap-3">
            {recordings.length === 0 ? (
               <div className="text-center py-8 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                  No evidence recorded yet.
               </div>
            ) : (
               recordings.map((rec) => (
                 <div key={rec.id} className="bg-white p-3 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white relative overflow-hidden group">
                       <video src={rec.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                       <Play size={20} className="relative z-10 opacity-80" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800">Secure Video File</p>
                       <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Today, {rec.date} • {rec.size}</p>
                    </div>
                    <a 
                      href={rec.url}
                      download={`Evidence_${rec.id}.webm`}
                      className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors"
                    >
                       <Share2 size={18} />
                    </a>
                 </div>
               ))
            )}
         </div>
      </div>

    </motion.div>
  );
}
