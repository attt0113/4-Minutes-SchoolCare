/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('s.sterling@schoolcare.org');
  const [password, setPassword] = useState('clinical-sterling-rn');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fc] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Absolute top grid background underlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e1e6f0_1px,transparent_1px),linear-gradient(to_bottom,#e1e6f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none"></div>

      {/* Decorative colored visual elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-950/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200/20 dark:bg-blue-950/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Centered Logo element to fit the image precisely */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col items-center text-center mb-6 relative z-10"
      >
        {/* Rounded square white box with a single, clear indigo/blue dot */}
        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/50 dark:shadow-none border border-slate-100/80 dark:border-slate-800">
          <span className="w-2.5 h-2.5 bg-[#1c6df2] rounded-full animate-pulse"></span>
        </div>

        {/* Brand Title: 4 minutes */}
        <h2 className="text-[34px] font-extrabold text-[#161d26] dark:text-white tracking-tight mt-4 leading-tight">
          4 minutes
        </h2>
        {/* Subtitle description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1.5">
          Secure access to school health records.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(30,55,100,0.06)] relative z-10 overflow-hidden"
      >
        {/* Tiny top color border strip for elegant detail alignment */}
        <div className="h-1 bg-gradient-to-r from-[#1c6df2] to-teal-400"></div>

        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* EMAIL ADDRESS field */}
            <div>
              <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest mb-2">
                Email Address
              </label>
              
              <div className="bg-[#f0f2f7] dark:bg-slate-950 rounded-2xl flex items-center px-4 py-3 border border-transparent focus-within:border-[#1c6df2]/20 transition-all">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400/80 pl-3 leading-normal"
                  placeholder="e.g. teacher@school.edu"
                />
              </div>
            </div>

            {/* PASSWORD field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[9px] text-[#1c6df2] hover:text-[#165bc9] font-extrabold uppercase tracking-widest transition-colors cursor-pointer"
                  onClick={() => alert('Demo Mode: School clinic system has pre-configured administrative passcodes active.')}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="bg-[#f0f2f7] dark:bg-slate-950 rounded-2xl flex items-center px-4 py-3 border border-transparent focus-within:border-[#1c6df2]/20 transition-all">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400/80 pl-3 leading-normal"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Switch Toggle section for: Remember this device */}
            <div className="flex items-center justify-between py-1 select-none">
              <span className="text-slate-500 dark:text-slate-400 font-semibold text-[13px] tracking-tight">
                Remember this device
              </span>
              <button
                type="button"
                onClick={() => setRememberDevice(prev => !prev)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${
                  rememberDevice ? 'bg-[#1c6df2]' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                    rememberDevice ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Main Secure Login button CTA */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#1c6df2] hover:bg-[#165bc9] text-white py-3.5 px-5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] disabled:scale-100 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-white bg-opacity-80 animate-ping"></span>
                  <span>Verifying Node...</span>
                </>
              ) : (
                <>
                  <span>Secure Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Clinician credential prompt helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal font-semibold">
              The login credentials are pre-filled as clinic coordinator. Just press <b className="text-[#1c6df2] dark:text-blue-400 font-bold">"Secure Login"</b> to bypass instantly.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Underline Info Badge */}
      <p className="text-[10px] text-slate-450 dark:text-slate-650 font-extrabold uppercase tracking-widest mt-8 select-none">
        4 Minutes SchoolCare Platform — Node SEC-4
      </p>

    </div>
  );
}
