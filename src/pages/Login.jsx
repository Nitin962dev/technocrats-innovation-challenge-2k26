import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, toggleLanguage, lang } = useLanguage();
  
  const [email, setEmail] = useState('poojasingh160905@gmail.com');
  const [password, setPassword] = useState('Virat18');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({ name: 'Pooja Singh', email }); // Mock User
      navigate('/');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#7663ba] items-center justify-center font-sans tracking-wide">
      <div className="w-full max-w-[420px] bg-[#fdfdfd] min-h-screen sm:min-h-[90vh] sm:rounded-[32px] shadow-2xl relative flex flex-col items-center px-8 py-10">
        
        {/* Header section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mt-4 mb-8"
        >
          <div className="text-[#556ee6] mb-3">
             <Shield size={56} strokeWidth={0} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b3952] tracking-tight">SafeHer</h1>
          <p className="text-[#7d879c] text-[15px] font-medium mt-1">Your Safety, Our Priority</p>
        </motion.div>

        {/* Form Section */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin} 
          className="w-full flex flex-col gap-4"
        >
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7d879c]">
              <User size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#e3e8f1] rounded-[14px] text-[#2b3952] font-medium placeholder-[#7d879c] focus:outline-none focus:border-[#7c5ff0] focus:ring-1 focus:ring-[#7c5ff0] transition-all shadow-sm"
              placeholder="Email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7d879c]">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#e3e8f1] rounded-[14px] text-[#2b3952] font-medium placeholder-[#7d879c] focus:outline-none focus:border-[#7c5ff0] focus:ring-1 focus:ring-[#7c5ff0] transition-all shadow-sm"
              placeholder="Password"
              required
            />
          </div>

          {/* Checkbox and Forgot pass */}
          <div className="flex items-center justify-between mt-2 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] rounded-[4px] border-[#a1a1a1] text-[#7c5ff0] focus:ring-[#7c5ff0] cursor-pointer appearance-none checked:bg-[#7c5ff0] border" />
              <span className="text-[15px] text-[#2b3952] font-medium">Remember me</span>
            </label>
            <a href="#" className="text-[15px] text-[#556ee6] font-medium hover:underline">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c5bd7] text-white rounded-[16px] py-4 font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-[#6c4fc2] transition-colors active:scale-[0.98]"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>Login <ArrowRight size={20} strokeWidth={2.5} /></>
            )}
          </button>
        </motion.form>

        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center my-6 text-[#9a9a9a]"
        >
          <div className="flex-grow border-t border-[#e2e8f0]"></div>
          <span className="px-4 text-[15px] font-medium">or</span>
          <div className="flex-grow border-t border-[#e2e8f0]"></div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full flex gap-4 mb-8"
        >
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#e3e8f1] rounded-[16px] py-[14px] text-[15px] font-semibold text-[#dc4c3f] shadow-sm hover:bg-gray-50 transition-colors">
            {/* Simple G icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#e3e8f1] rounded-[16px] py-[14px] text-[15px] font-semibold text-[#3b5998] shadow-sm hover:bg-gray-50 transition-colors">
            {/* Simple F icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </motion.div>

        {/* Signup */}
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#848ea1] text-[16px] font-medium mb-6 mt-auto text-center"
        >
          Don't have an account? <a href="#" className="text-[#556ee6] font-bold hover:underline">Sign Up</a>
        </motion.p>

        {/* Emergency Access */}
        <motion.button 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-transparent border-[2.5px] border-[#e75a4e] text-[#e75a4e] rounded-[24px] py-[14px] font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-[#fff5f5] transition-all active:scale-[0.98] mb-2"
        >
          <AlertTriangle size={20} strokeWidth={2.5} /> Emergency Access
        </motion.button>
        
      </div>
    </div>
  );
}
