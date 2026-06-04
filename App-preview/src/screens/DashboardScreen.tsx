import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseMedical, AlertOctagon, UserPlus, ShieldAlert, ChevronRight, Smile, TriangleAlert, Ambulance, Info } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { useEmergency } from '../App';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { isEmergencyActive, triggerAlert } = useEmergency();
  const [today, setToday] = useState(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));

  const [isRedAlertVisible, setIsRedAlertVisible] = useState<boolean>(true);
  const [isMildVisible, setIsMildVisible] = useState<boolean>(true);
  const [isModerateVisible, setIsModerateVisible] = useState<boolean>(true);
  const [isCriticalVisible, setIsCriticalVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const triggerARefresh = () => {
    setIsRedAlertVisible(false);
    setIsMildVisible(false);
    setIsModerateVisible(false);
    setIsCriticalVisible(false);

    // Timeline cascade of entry transitions
    // 1. Red Alert shows immediately
    setTimeout(() => {
      setIsRedAlertVisible(true);
    }, 100);

    // 2. Mild card appears
    setTimeout(() => {
      setIsMildVisible(true);
    }, 450);

    // 3. Moderate card appears
    setTimeout(() => {
      setIsModerateVisible(true);
    }, 800);

    // 4. Critical card appears
    setTimeout(() => {
      setIsCriticalVisible(true);
    }, 1150);
  };

  // Run refresh animation on mount
  useEffect(() => {
    triggerARefresh();
  }, []);

  // Listen to keyboard trigger 'A'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a') {
        triggerARefresh();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triageCategories = [
    {
      id: 'mild',
      title: 'Mild — minor complaint',
      description: 'Mild headache, stomach discomfort, mood swings',
      icon: <Smile className="w-8 h-8" />,
      color: 'bg-secondary-container text-on-secondary-container',
      route: '/assess/mild'
    },
    {
      id: 'moderate',
      title: 'Moderate — needs attention',
      description: 'Fever, injury, allergic reaction',
      icon: <TriangleAlert className="w-8 h-8" />,
      color: 'bg-yellow-100 text-yellow-800',
      route: '/assess/moderate'
    },
    {
      id: 'critical',
      title: 'Critical — send to hospital',
      description: 'Seizure, unconscious, severe injury',
      icon: <Ambulance className="w-8 h-8" />,
      color: 'bg-tertiary-container text-on-tertiary',
      border: 'border-l-4 border-tertiary',
      route: '/emergency/active'
    }
  ];

  const handleTriageClick = (cat: typeof triageCategories[0]) => {
    if (cat.id === 'critical') {
      if (isEmergencyActive) {
        navigate('/emergency/active');
        return;
      }
      triggerAlert();
      return;
    }
    navigate(cat.route);
  };

  return (
    <Layout>
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1 bg-primary/10 rounded text-primary">
            <BriefcaseMedical className="w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">4 minutes</span>
        </div>

        <div className="pt-2 border-t border-surface-container-highest/30 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-on-surface">SMK Methodist</h1>
            <p className="text-sm font-medium text-on-surface-variant">{today}</p>
          </div>
          {/* Keyboard shortcut hint pill */}
          <button 
            onClick={triggerARefresh}
            className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-primary font-black text-[9px] uppercase tracking-wider animate-bounce hover:bg-primary/20 active:scale-95 transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Press 'A' or click to refresh</span>
          </button>
        </div>

        {/* Red Alert Section */}
        <div className="min-h-[380px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isRedAlertVisible && (
              <motion.section 
                key="red-alert-section"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="text-center mb-10 w-full"
              >
                <div className="inline-block px-4 py-1 bg-tertiary/10 text-tertiary rounded-full mb-6 text-[10px] font-bold uppercase tracking-widest">
                  Immediate Response
                </div>
                
                <div className="relative group flex justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-tertiary/10 blur-3xl rounded-full"
                  />
                  <button 
                    onPointerDown={() => navigate(isEmergencyActive ? '/emergency/active' : '/emergency')}
                    className="relative w-64 h-64 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-tertiary to-tertiary-container text-white shadow-[0_20px_40px_rgba(187,23,18,0.3)] active:scale-95 transition-all duration-300 border-4 border-white/10"
                  >
                    <ShieldAlert className="w-16 h-16 mb-2" fill="currentColor" fillOpacity={0.2} />
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black tracking-tighter uppercase">Red Alert</span>
                      <span className="text-[10px] opacity-80 mt-1 uppercase tracking-widest font-bold">Press and Hold</span>
                    </div>
                  </button>
                </div>

                <p className="mt-8 text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
                  Trigger this only for severe, life-threatening medical emergencies requiring immediate campus lockdown and EMS.
                </p>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Triage Section */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-bold text-on-surface uppercase tracking-widest opacity-60 ml-1">
            Quick Triage Selection
          </h2>
          
          <div className="space-y-4 min-h-[320px]">
            <AnimatePresence>
              {triageCategories.map((cat) => {
                const isVisible = cat.id === 'mild' ? isMildVisible : cat.id === 'moderate' ? isModerateVisible : isCriticalVisible;
                if (!isVisible) return null;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 25, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTriageClick(cat)}
                    className={`w-full flex items-center p-5 bg-surface-container-low rounded-3xl transition-all hover:bg-surface-container-high text-left group ${cat.border || ''} ${cat.id === 'critical' && !isEmergencyActive ? 'opacity-50 grayscale' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 shrink-0 ${cat.color}`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-on-surface leading-tight">{cat.title}</h3>
                      <p className="text-sm text-on-surface-variant font-medium">{cat.description}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </Layout>
  );
}
