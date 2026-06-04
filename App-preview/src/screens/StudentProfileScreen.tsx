import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, Info, Sparkles, User, Timer, Armchair, BriefcaseMedical, Bell, LayoutGrid, ClipboardList, Camera, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';

import discomfortMaleImg from '../assets/images/discomfort_male_1780081344297.png';
import happyFemale1Img from '../assets/images/happy_female1_1780081364590.png';
import happyFemale2Img from '../assets/images/happy_female2_1780081388993.png';
import happyMaleImg from '../assets/images/happy_male_1780081412887.png';

interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  room: string;
  image: string;
  allergy: string;
  allergyColor: 'yellow' | 'red' | 'blue' | 'none';
  chronic: string;
  chronicColor: 'yellow' | 'red' | 'blue' | 'none';
  illnessProbability: number;
  clinicalInsight: string;
  guidance: { step: number; title: string; desc: string }[];
}

const studentsData: Record<string, StudentProfile> = {
  discomfort_male: {
    id: 'discomfort_male',
    name: 'Kevin Zhang',
    grade: 'Grade 10',
    room: 'Room 302',
    image: discomfortMaleImg,
    allergy: 'PEANUTS, IBUPROFEN',
    allergyColor: 'red',
    chronic: 'MIGRAINE RISK',
    chronicColor: 'red',
    illnessProbability: 92,
    clinicalInsight: 'Facial thermal congestion, high cranial muscular stress indicators, and pupil light sensitivity patterns suggest an active acute migraine attack with high physiological discomfort.',
    guidance: [
      { step: 1, title: 'Seat in cold rest room', desc: 'Transfer student to a cool, darkened room immediately. Limit bright screens or fluorescent lighting.' },
      { step: 2, title: 'No Ibuprofen', desc: 'Do not administer Ibuprofen due to documented severe allergy. Provide cold compress and plenty of room-temperature water.' },
      { step: 3, title: 'Urgent medical tracking', desc: 'If physical distress increases or visual aura occurs, alert parents or school nurse immediately.' }
    ]
  },
  happy_female1: {
    id: 'happy_female1',
    name: 'Chloe Tan',
    grade: 'Grade 9',
    room: 'Room 104',
    image: happyFemale1Img,
    allergy: 'NONE',
    allergyColor: 'none',
    chronic: 'NONE',
    chronicColor: 'none',
    illnessProbability: 4,
    clinicalInsight: 'Symmetrical facial blood flow, normal pupil constriction, and vibrant smile mechanics indicate ideal physiological tone. Body temperature measured at 36.5°C.',
    guidance: [
      { step: 1, title: 'Normal standard activity', desc: 'Cleared for gym class, recess, and physical exercise. No current rest required.' },
      { step: 2, title: 'Ensure hydration', desc: 'Advise standard hydration of 1.5L throughout the school day.' },
      { step: 3, title: 'File update', desc: 'Logged as fully fit and healthy for standard school curriculum.' }
    ]
  },
  happy_female2: {
    id: 'happy_female2',
    name: 'Sarah Lim',
    grade: 'Grade 10',
    room: 'Room 201',
    image: happyFemale2Img,
    allergy: 'NONE',
    allergyColor: 'none',
    chronic: 'ASTHMA (Mild / Controlled)',
    chronicColor: 'blue',
    illnessProbability: 5,
    clinicalInsight: 'Respiratory biometric markers and nostril airflow analysis display stable flow with no indication of wheezing or respiratory effort. Pupil reflection is within the healthy baseline.',
    guidance: [
      { step: 1, title: 'Inhaler confirmation', desc: 'Briefly verify that the student has their blue reliever inhaler inside their backpack, as a preventative measure.' },
      { step: 2, title: 'Return to class', desc: 'Student is enthusiastic, showing peaceful biometrics. Return to normal learning sessions immediately.' },
      { step: 3, title: 'Observation protocol', desc: 'No active observation required. Logged as stable and safe.' }
    ]
  },
  happy_male: {
    id: 'happy_male',
    name: 'Ryan Lee',
    grade: 'Grade 11',
    room: 'Room 403',
    image: happyMaleImg,
    allergy: 'NONE',
    allergyColor: 'none',
    chronic: 'NONE',
    chronicColor: 'none',
    illnessProbability: 3,
    clinicalInsight: 'Smooth ocular and micro-expression parameters. Ideal heat dissipation around frontal and nasal lobes. Full physiological readiness detected.',
    guidance: [
      { step: 1, title: 'Clearance of task', desc: 'Student reports perfect wellness and is approved for exams or long learning activities.' },
      { step: 2, title: 'No monitoring', desc: 'General state of health is superb with perfect heart rate parameters (estimated 72 BPM).' },
      { step: 3, title: 'Routine wellness log', desc: 'Close student check-out file with normal/healthy designation.' }
    ]
  }
};

export default function StudentProfileScreen() {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('discomfort_male');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanText, setScanText] = useState<string>('AI Analyzing Biometrics');

  const [animatedProb, setAnimatedProb] = useState<number>(0);
  const [isSLoading, setIsSLoading] = useState<boolean>(false);
  const [revealedSteps, setRevealedSteps] = useState<number>(3);

  useEffect(() => {
    if (!isScanning) return;
    
    const texts = [
      'Initializing Thermal Map...',
      'Mapping Facial Biometrics...',
      'Analyzing Pupil Dilation...',
      'Calculating Illness Probability...'
    ];
    
    let currentTextIdx = 0;
    const textInterval = setInterval(() => {
      if (currentTextIdx < texts.length) {
        setScanText(texts[currentTextIdx]);
        currentTextIdx++;
      }
    }, 350);

    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 1500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, [isScanning]);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setIsScanning(true);
    setScanText('Initializing Thermal Map...');
  };

  const currentStudent = studentsData[selectedStudentId];

  const triggerWAnimation = () => {
    setAnimatedProb(0);
    const target = currentStudent.illnessProbability;
    const duration = 1000; // 1s count up
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * target);
      setAnimatedProb(currentVal);
      if (progress >= 1) {
        clearInterval(timer);
        setAnimatedProb(target); // Ensure exact target value is set
      }
    }, 16);
  };

  const triggerSAnimation = () => {
    setIsSLoading(true);
    setRevealedSteps(0);
    
    const loaderTimer = setTimeout(() => {
      setIsSLoading(false);
      
      // Reveal step 1
      setTimeout(() => {
        setRevealedSteps(1);
        
        // Reveal step 2
        setTimeout(() => {
          setRevealedSteps(2);
          
          // Reveal step 3
          setTimeout(() => {
            setRevealedSteps(3);
          }, 350);
        }, 350);
      }, 350);
    }, 850);
  };

  // Re-run animations on initial view mount and on student changes
  useEffect(() => {
    if (!isScanning) {
      triggerWAnimation();
      triggerSAnimation();
    }
  }, [selectedStudentId, isScanning]);

  // Global keyboard shortcuts (W, S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') {
        triggerWAnimation();
      } else if (e.key.toLowerCase() === 's') {
        triggerSAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStudentId, currentStudent]);

  return (
    <Layout>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-surface-container-highest/20">
        <div className="flex items-center gap-3">
          <BriefcaseMedical className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-black tracking-tighter text-primary">AI Scan</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-primary font-black text-xs tracking-widest uppercase">End</button>
      </header>

      <main className="px-4 pt-6 pb-48 max-w-md mx-auto space-y-6">
        
        {/* Gallery Image Selector */}
        <section className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-highest/20 space-y-3">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-xs uppercase tracking-widest">
            <Camera className="w-4.5 h-4.5 text-primary" />
            <span>Upload Student Photo to Scan</span>
          </div>
          <p className="text-xs text-on-surface-light mb-1">
            Toggle images to simulate biometric scanning results instantly.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {Object.values(studentsData).map((student) => (
              <button
                key={student.id}
                onClick={() => handleSelectStudent(student.id)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${
                  selectedStudentId === student.id
                    ? 'border-primary ring-2 ring-primary/20 scale-[1.03]'
                    : 'border-surface-container-highest hover:border-primary/50'
                }`}
              >
                <img 
                  src={student.image} 
                  alt={student.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/10" />
                {student.id === 'discomfort_male' && (
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]" />
                )}
                <div className="absolute bottom-1 left-0 right-0 text-center">
                  <p className="text-[9px] font-bold text-white truncate px-1 bg-black/50 py-0.5 rounded">
                    {student.name.split(' ')[0]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Facial Scan Viewfinder */}
        <section className="relative aspect-square w-full bg-surface-container-highest rounded-3xl overflow-hidden shadow-sm border border-surface-container-highest/50">
          <img 
            src={currentStudent.image} 
            alt={currentStudent.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-300"
          />
          {/* Scan UI Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between w-full h-full border-[2px] border-primary/40 rounded-2xl relative overflow-hidden">
               {/* Scan Line */}
               {isScanning && (
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_12px_rgba(37,99,235,1)] scan-line" />
               )}
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-on-surface/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-2.5 whitespace-nowrap">
              <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
              <p className="text-white text-[10px] font-black uppercase tracking-widest">
                {isScanning ? scanText : 'Scanning Completed'}
              </p>
            </div>
          </div>
        </section>

        {/* Scan Status State details */}
        <AnimatePresence mode="wait">
          {!isScanning && (
            <motion.div
              key={currentStudent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Student Profile Info */}
              <section className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5 border border-surface-container-highest/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-on-surface">{currentStudent.name}</h2>
                    <p className="text-on-surface-variant font-medium">{currentStudent.grade} • {currentStudent.room}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden border-2 border-background">
                    <img 
                      src={currentStudent.image} 
                      alt={currentStudent.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {currentStudent.allergy !== 'NONE' ? (
                    <div className="bg-red-50/70 border-l-4 border-red-500 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Allergy</p>
                      <p className="text-xs font-black text-red-900 truncate">{currentStudent.allergy}</p>
                    </div>
                  ) : (
                    <div className="bg-green-50/50 border-l-4 border-green-500 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Allergy</p>
                      <p className="text-xs font-black text-green-900">NONE DETECTED</p>
                    </div>
                  )}
                  
                  {currentStudent.chronic !== 'NONE' ? (
                    <div className="bg-amber-50/70 border-l-4 border-amber-600 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Chronic Alert</p>
                      <p className="text-xs font-black text-amber-900 truncate">{currentStudent.chronic}</p>
                    </div>
                  ) : (
                    <div className="bg-green-50/50 border-l-4 border-green-500 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Chronic Alert</p>
                      <p className="text-xs font-black text-green-900">NONE</p>
                    </div>
                  )}
                </div>

                {/* AI Clinical Insight */}
                <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-highest/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-surface-container-highest/20 pb-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest">AI Clinical Insight</span>
                    </div>
                    {/* Key Hint */}
                    <button 
                      onClick={triggerWAnimation}
                      className="text-[9px] font-bold text-primary bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce cursor-pointer border border-primary/20"
                    >
                      Press 'W' or click to animate
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    {/* Dynamic Circular Loader */}
                    <div className="relative flex-none w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-surface-container-highest/60"
                          strokeWidth="6.5"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="32"
                          className={currentStudent.illnessProbability > 50 ? "stroke-red-500" : "stroke-green-500"}
                          strokeWidth="6.5"
                          fill="transparent"
                          strokeDasharray={201}
                          strokeDashoffset={201 - (201 * animatedProb) / 100}
                          transition={{ ease: "easeOut", duration: 0.1 }}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className={`text-base font-black tracking-tighter ${currentStudent.illnessProbability > 50 ? 'text-red-600' : 'text-green-600'}`}>
                          {animatedProb}%
                        </span>
                        <span className="text-[7px] text-on-surface-variant uppercase font-bold tracking-widest leading-none">Illness</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-black text-on-surface uppercase tracking-wider">
                        Scan Assessment Status:
                      </p>
                      <p className={`text-xs font-black uppercase tracking-wider ${currentStudent.illnessProbability > 50 ? 'text-red-500' : 'text-green-500'}`}>
                        {currentStudent.illnessProbability > 50 ? 'CRITICAL DISCOMFORT DETECTED' : 'LOW RISK BASELINE'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed pl-1 pt-1 border-t border-dashed border-surface-container-highest/20">
                    {currentStudent.clinicalInsight}
                  </p>
                </div>

                {/* Assessment Guidance */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Assessment Guidance</h3>
                    <button 
                      onClick={triggerSAnimation}
                      className="text-[9px] font-bold text-primary bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce cursor-pointer border border-primary/20"
                    >
                      Press 'S' or click to load
                    </button>
                  </div>

                  {isSLoading ? (
                    <div className="bg-surface-container-low rounded-3xl p-8 border border-surface-container-highest/20 flex flex-col items-center justify-center gap-3">
                      <Sparkles className="w-6 h-6 text-primary animate-spin" />
                      <p className="text-xs font-black text-primary uppercase tracking-widest">AI Generating Suggestions...</p>
                      <div className="w-1/2 h-1 bg-surface-container-highest rounded overflow-hidden">
                        <div className="h-full bg-primary animate-[shimmer_1s_infinite] w-1/3 rounded" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {currentStudent.guidance.map((item, index) => {
                          if (index >= revealedSteps) return null;
                          return (
                            <motion.div 
                              key={item.step} 
                              initial={{ opacity: 0, y: 12, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 260, damping: 22 }}
                              className="bg-white rounded-2xl p-4 border border-surface-container-highest/20 shadow-sm flex flex-col gap-3 transition-all hover:border-primary/30"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">
                                    {item.step}
                                  </span>
                                  <p className="font-bold text-on-surface">{item.title}</p>
                                </div>
                                {item.step === 1 && <Armchair className="w-4 h-4 text-primary" />}
                                {item.step === 2 && <BriefcaseMedical className="w-4 h-4 text-primary" />}
                                {item.step === 3 && <Timer className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </section>

              {/* Floating Action Buttons */}
              <section className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex flex-col items-center justify-center p-4 rounded-3xl border-2 border-secondary bg-white text-secondary font-black hover:bg-secondary/5 transition-all shadow-xl shadow-secondary/10"
                  >
                    <Armchair className="w-5 h-5 mb-1" />
                    <span className="text-[11px] uppercase tracking-wider">Rest in Class</span>
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex flex-col items-center justify-center p-4 rounded-3xl bg-primary text-white font-black hover:opacity-90 transition-all shadow-xl shadow-primary/30"
                  >
                    <BriefcaseMedical className="w-5 h-5 mb-1" />
                    <span className="text-[11px] uppercase tracking-wider">Send to Office</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-bold text-on-surface-variant">Performing deep biometrical telemetry scan...</p>
          </div>
        )}
      </main>
    </Layout>
  );
}
