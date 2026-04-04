import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, AlertTriangle, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, toggleLanguage, lang } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({ name: 'User', email }); // Mock User
      navigate('/');
    }, 1500);
  };

  const handleEmergency = () => {
    // Navigate rapidly without login
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] relative overflow-hidden font-sans tracking-wide">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* Language Toggle */}
        <motion.button 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-20 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2 hover:bg-white/10 transition-colors shadow-xl"
        >
          <Globe size={16} />
          {lang === 'en' ? 'ENGLISH / हिंदी' : 'हिंदी / ENGLISH'}
        </motion.button>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(168,85,247,0.4)] rotate-3">
               <Shield size={36} fill="currentColor" strokeWidth={1} className="-rotate-3" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">SafeHer</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">{t('app_name') || 'Your Safety, Our Priority'}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative">
             <h2 className="text-2xl font-bold text-white mb-6">
                {isRegister ? t('register') || 'Create Account' : t('login_title') || 'Welcome Back'}
             </h2>

             {/* Form */}
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white font-medium placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white font-medium placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Password"
                    required
                  />
                </div>

                {!isRegister && (
                  <div className="flex justify-end mt-1 mb-2">
                    <a href="#" className="text-sm text-purple-400 font-medium hover:text-purple-300 transition-colors">Forgot Password?</a>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl py-3.5 font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>{isRegister ? 'Register' : 'Login'} <ArrowRight size={18} strokeWidth={2.5} /></>
                  )}
                </button>
             </form>

             {/* Toggle Register/Login */}
             <p className="text-center text-slate-400 text-sm font-medium mt-6">
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <button 
                  onClick={() => setIsRegister(!isRegister)} 
                  className="text-purple-400 font-bold hover:text-purple-300 transition-colors"
                >
                  {isRegister ? "Login here" : "Register Now"}
                </button>
             </p>
          </div>
        </motion.div>

        {/* Emergency Access Button - Highly Distinct & Prominent */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="w-full max-w-[420px] mt-8"
        >
           <div className="relative">
             {/* Pulse effect behind the button */}
             <div className="absolute inset-0 bg-red-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
             
             <button 
                onClick={handleEmergency}
                className="relative w-full bg-[#ef233c]/10 border border-[#ef233c]/30 hover:bg-[#ef233c]/20 hover:border-[#ef233c]/50 text-[#ef233c] rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-3 transition-all backdrop-blur-sm active:scale-95 group"
             >
                <div className="bg-[#ef233c] p-1.5 rounded-full text-white group-hover:scale-110 transition-transform">
                   <AlertTriangle size={18} strokeWidth={3} />
                </div>
                <span>EMERGENCY ACCESS</span>
             </button>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
