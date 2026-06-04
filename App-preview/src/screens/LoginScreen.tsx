import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-surface-container">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px] z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[100px] z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10 space-y-10"
      >
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-white text-primary hd-logo-shadow border border-white/50 mb-2">
            <Shield className="w-12 h-12" fill="currentColor" fillOpacity={0.2} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-on-surface">4 minutes</h1>
          <p className="text-on-surface-variant font-medium opacity-80">Secure access to school health records.</p>
        </div>

        {/* Login Card */}
        <div className="glass-effect rounded-3xl hd-shadow p-8 border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary-container to-secondary" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. teacher@school.edu"
                  className="block w-full pl-12 pr-4 py-4 bg-surface-container-highest/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 rounded-2xl transition-all duration-300 text-on-surface placeholder-on-surface-variant/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">
                  Password
                </label>
                <button type="button" className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary-container">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-4 bg-surface-container-highest/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 rounded-2xl transition-all duration-300 text-on-surface placeholder-on-surface-variant/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-on-surface-variant">Remember this device</span>
              <button 
                type="button"
                onClick={() => setIsRemember(!isRemember)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isRemember ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isRemember ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <button 
              type="submit"
              className="group w-full flex justify-center items-center py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300"
            >
              <span>Secure Login</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
            Powered by Guardian Pulse Technology
          </p>
        </div>
      </motion.div>
    </div>
  );
}
