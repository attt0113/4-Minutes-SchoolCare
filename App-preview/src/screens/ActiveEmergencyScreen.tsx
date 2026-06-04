import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circle, AlertCircle, TrendingUp, ShieldAlert, QrCode, Lock, History, ChevronRight, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useEmergency } from '../App';

export default function ActiveEmergencyScreen() {
  const navigate = useNavigate();
  const { isEmergencyActive, setIsEmergencyActive, addNotification, emergencyStartTime, setEmergencyStartTime } = useEmergency();
  const INITIAL_TIME = 239; // 03:59 in seconds
  const AMBULANCE_TIME = 600; // 10:00 in seconds
  const [elapsed, setElapsed] = useState(INITIAL_TIME);
  const [ambulanceElapsed, setAmbulanceElapsed] = useState(AMBULANCE_TIME);
  const [showData, setShowData] = useState(false);
  const notified = useRef(isEmergencyActive);

  useEffect(() => {
    if (!notified.current) {
      // Set emergency state as active when this screen is reached
      setIsEmergencyActive(true);
      setEmergencyStartTime(Date.now());
      
      // Add emergency notification
      addNotification({
        type: 'EMERGENCY',
        title: 'Emergency Protocol Activated',
        description: 'A critical seizure protocol has been initiated for a student. Response team notified.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      });
      notified.current = true;
    }
  }, [setIsEmergencyActive, setEmergencyStartTime, addNotification]);

  useEffect(() => {
    if (emergencyStartTime) {
      const updateTimer = () => {
        const secondsPassed = Math.floor((Date.now() - emergencyStartTime) / 1000);
        
        const remaining = INITIAL_TIME - secondsPassed;
        setElapsed(remaining > 0 ? remaining : 0);

        const ambRemaining = AMBULANCE_TIME - secondsPassed;
        setAmbulanceElapsed(ambRemaining > 0 ? ambRemaining : 0);
      };

      updateTimer(); // Initial call
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [emergencyStartTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const maskValue = (value: string) => {
    return '••••••••';
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary" />
          <span className="text-lg font-black tracking-tighter text-primary">4 minutes</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-on-surface-variant font-black text-xs tracking-widest uppercase">Close</button>
      </header>

      <main className="pt-20 px-4 max-w-md mx-auto space-y-6">
        {/* Timer Card */}
        <section className="bg-tertiary rounded-3xl p-8 text-white text-center space-y-6 shadow-xl shadow-tertiary/20">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Elapsed Time</p>
            <h1 className="text-7xl font-black tracking-tighter">{formatTime(elapsed)}</h1>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" />
            Critical Protocol: Seizure
          </div>

          <div className="grid grid-cols-1 gap-2 text-left">
            {[
              { icon: <Circle className="w-4 h-4" fill="currentColor" />, text: 'DO NOT put anything in the mouth.' },
              { icon: <TrendingUp className="w-4 h-4" />, text: 'Turn student on their side (recovery position).' },
              { icon: <ShieldAlert className="w-4 h-4" />, text: 'Protect the head from impact.' },
              { icon: <TrendingUp className="w-4 h-4" />, text: 'Clear the surrounding area.' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-tertiary-container/30 rounded-2xl">
                <span className="opacity-80">{item.icon}</span>
                <p className="text-sm font-bold">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ambulance Card */}
        <section className="bg-tertiary-container rounded-3xl p-8 text-white space-y-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black tracking-tight leading-none mb-2">Ambulance Called</h2>
              <p className="text-sm font-medium opacity-80">Dispatch confirmed at 14:22. Emergency responders are en route to North Wing Entrance.</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Ambulance className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-6 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Estimated Arrival</p>
             <h3 className="text-5xl font-black tracking-tighter">{formatTime(ambulanceElapsed)}</h3>
          </div>
        </section>

        {/* Medical History Section */}
        <section className="text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-on-surface">Scan for Medical History</h2>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Authorized Paramedics and Hospital Staff only.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-surface-container-highest flex flex-col items-center gap-6">
            <div className="w-48 h-48 border-[10px] border-primary rounded-3xl p-4 flex items-center justify-center relative">
              <QrCode className="w-full h-full text-on-surface" />
              <div className="absolute -bottom-3 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                Effective Scanning Area
              </div>
            </div>
            
            <div className="w-full space-y-4 text-left">
               <div className="flex items-center justify-between text-primary mb-2">
                 <div className="flex items-center gap-3">
                   <ShieldAlert className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Data Shared via QR</span>
                 </div>
                 <button 
                  onClick={() => setShowData(!showData)}
                  className="p-2 bg-surface-container-low rounded-xl text-primary hover:bg-surface-container-high transition-colors flex items-center gap-2"
                 >
                   {showData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   <span className="text-[10px] font-black uppercase">{showData ? 'Hide' : 'Show'}</span>
                 </button>
               </div>
               
               <div className="space-y-px rounded-2xl overflow-hidden border border-surface-container-highest">
                  {[
                    { label: 'BLOOD TYPE', value: 'O+' },
                    { label: 'ALLERGIES', value: 'Penicillin, Peanuts', highlight: true },
                    { label: 'MEDICAL HISTORY', value: 'Congenital Heart Condition' }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-surface-container-low border-b border-surface-container-highest last:border-0">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest shrink-0">{row.label}</span>
                      <span className={`text-sm font-bold ml-4 text-right ${row.highlight ? (showData ? 'text-tertiary' : 'text-on-surface/30') : 'text-on-surface'}`}>
                        {showData ? row.value : maskValue(row.value)}
                      </span>
                    </div>
                  ))}
               </div>

               <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3 items-start">
                 <Lock className="w-4 h-4 text-primary shrink-0" />
                 <p className="text-[10px] font-medium text-primary/80 leading-relaxed">
                   Note: Identity, address, and academic records are HIDDEN for student privacy.
                 </p>
               </div>
            </div>
          </div>
        </section>

        {/* End Button */}
        <div className="pt-4">
          <button 
            onClick={() => {
              setIsEmergencyActive(false);
              setEmergencyStartTime(null);
              navigate('/dashboard');
            }}
            className="w-full bg-tertiary text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-tertiary/30 hover:bg-tertiary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <ShieldAlert className="w-5 h-5" />
            End Emergency Protocol
          </button>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
          Generated on: April 25, 2026 | Logged for Security and Transparency
        </p>
      </main>

      {/* Persistence nav indicator */}
      <div className="fixed bottom-0 left-0 right-0 h-1 z-50 bg-tertiary" />
    </div>
  );
}

function Ambulance(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M10 10l2 2 4-4" />
      <path d="M14 18l-2-2-4 4" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}
