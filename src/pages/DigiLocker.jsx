import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';

export default function DigiLocker() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 h-full flex flex-col"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
          {t('digilocker')}
        </h2>
        <p className="text-slate-500 text-sm mt-1">Verified Govt. issue Identify Card</p>
      </div>

      <div className="flex-1">
         {/* Identity Card Mockup */}
         <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 bg-white group">
            {/* Background design */}
            <div className="absolute inset-x-0 top-0 h-12 bg-[#ffe4c4] border-b-2 border-orange-200 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-900 tracking-widest uppercase">Government of India</span>
            </div>
            
            <div className="absolute left-6 top-16 w-20 h-24 bg-slate-200 rounded border-2 border-slate-300 overflow-hidden">
               {/* Placehold user image */}
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Neha" alt="Profile" className="w-full h-full object-cover" />
            </div>

            <div className="absolute left-32 top-16 right-6">
               <p className="text-sm font-bold text-slate-800">{user?.name || 'Neha Sharma'}</p>
               <p className="text-xs text-slate-500 mt-1">DOB: 12/05/1998</p>
               <p className="text-xs text-slate-500">Gender: Female</p>

               <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aadhaar No.</p>
                    <p className="text-sm font-mono font-bold tracking-widest text-slate-800">XXXX XXXX 4921</p>
                  </div>
                  <QrCode size={24} className="text-slate-800 opacity-80" />
               </div>
            </div>

            {/* Verification Badge overlay */}
            <div className="absolute bottom-4 left-6 flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded shadow-sm border border-green-100">
               <CheckCircle2 size={12} className="text-green-600" />
               <span className="text-[10px] font-bold text-green-700">KYC Verified</span>
            </div>
         </div>

         {/* Additional verification details */}
         <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldCheck size={100} />
            </div>
            <h3 className="font-bold text-slate-800 mb-4">{t('app_name')} Identity Trust</h3>
            <ul className="space-y-3">
               <li className="flex items-start gap-2">
                 <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                 <p className="text-xs font-medium text-slate-600">This identity is mathematically bound to this device.</p>
               </li>
               <li className="flex items-start gap-2">
                 <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                 <p className="text-xs font-medium text-slate-600">Used strictly for verifying distress signals to the Police.</p>
               </li>
            </ul>
         </div>
      </div>
    </motion.div>
  );
}
