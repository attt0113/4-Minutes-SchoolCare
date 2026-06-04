import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';

export default function EmergencyProtocolScreen() {
  const navigate = useNavigate();
  const [isHolding, setIsHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const controls = useAnimation();
  const ringControls = useAnimation();

  const startHold = () => {
    setIsHolding(true);
    startTimeRef.current = Date.now();
    
    // Animate the button scale
    controls.start({
      scale: 1.1,
      transition: { duration: 3, ease: "linear" }
    });

    // Animate the progress ring path length
    ringControls.start({
      pathLength: 1,
      transition: { duration: 3, ease: "linear" }
    });

    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const remaining = Math.max(0, 3 - elapsed);
        setTimeLeft(Math.ceil(remaining));
        
        if (elapsed >= 3) {
          if (timerRef.current) clearInterval(timerRef.current);
          navigate('/emergency/active');
        }
      }
    }, 100);
  };

  const endHold = () => {
    setIsHolding(false);
    startTimeRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(3);

    // Reset animations
    controls.start({ scale: 1, transition: { duration: 0.2 } });
    ringControls.set({ pathLength: 0 });
    ringControls.stop();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-start">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white rounded-full hd-shadow hover:bg-surface-container transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-on-surface" />
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xs space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-widest text-tertiary uppercase">Emergency Protocol</h1>
          <p className="text-on-surface-variant font-medium">
            Activate immediate emergency response across school grounds.
          </p>
        </div>

        <div className="relative flex justify-center items-center w-80 h-80 mx-auto">
          {/* Progress Ring Container (SVG) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-[0.85]" viewBox="0 0 100 100">
            {/* Background Ring (Preparation) */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-surface-container"
            />
            {/* Active Progress Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={ringControls}
              className="text-tertiary"
            />
          </svg>
          
          <motion.button 
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            animate={controls}
            className="relative w-64 h-64 bg-tertiary rounded-full flex flex-col items-center justify-center text-white hd-shadow select-none touch-none overflow-hidden"
          >
            <span className="text-5xl font-black mb-2">!</span>
            <span className="text-2xl font-black uppercase tracking-widest">Red Alert</span>
          </motion.button>
        </div>

        <div 
          className={`px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-sm transition-colors duration-300 ${isHolding ? 'bg-tertiary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}
        >
          {isHolding ? `Activating... ${timeLeft}s` : 'Hold to Initiate'}
        </div>

        <p className="text-on-surface-variant font-medium text-sm">
          Alerting responders in <span className="text-tertiary font-bold">04:00</span> minutes.
        </p>

        <div className="bg-white rounded-3xl p-6 border-l-8 border-tertiary text-left hd-shadow relative overflow-hidden">
          <h2 className="text-tertiary font-black text-xs uppercase tracking-widest mb-2">Critical Status</h2>
          <p className="text-on-surface-variant text-sm font-medium">
            System will automatically notify counselors, teachers, and students.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
