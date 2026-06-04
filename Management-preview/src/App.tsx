/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import OfficeCareView from './components/OfficeCareView';
import PharmacyLogView from './components/PharmacyLogView';
import MedicineStorageView from './components/MedicineStorageView';
import CaseRecordsView from './components/CaseRecordsView';
import LoginView from './components/LoginView';

import { 
  INITIAL_STUDENTS, 
  INITIAL_ALERTS, 
  INITIAL_INVENTORY, 
  INITIAL_ADMIN_LOGS, 
  INITIAL_CASE_RECORDS 
} from './data';

import { Student, ActiveAlert, MedicationInventory, AdminLog, CaseRecord } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, HeartPulse, ShieldAlert, X, AlertOctagon, CheckCircle, LogOut } from 'lucide-react';

export default function App() {
  // User Login session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('schoolcare_logged_in') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('schoolcare_logged_in', 'true');
  };

  // Navigation tabs state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected student for profiling inside Office Care
  const [selectedStudentId, setSelectedStudentId] = useState<string>('KZ-92');

  // Unified persistent clinic database
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [alerts, setAlerts] = useState<ActiveAlert[]>(INITIAL_ALERTS);
  const [inventory, setInventory] = useState<MedicationInventory[]>(INITIAL_INVENTORY);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(INITIAL_ADMIN_LOGS);
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASE_RECORDS);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (key === 'a') {
        const newAlert: ActiveAlert = {
          id: `alert-a-${Date.now()}`,
          type: 'SOS ALERT',
          studentName: 'Kevin Zhang',
          grade: 'Grade 11B',
          reporter: 'Room 204 - Ms. Gable',
          reportedTime: timestamp,
          description: 'EMERGENCY TRIGGERED: Kevin Zhang in Grade 11B is experiencing active clinical distress (Severe Acute Migraine Susceptibility).',
          acknowledged: false,
          scanSeverity: 'emergency',
          aiSuggestion: {
            insight: 'Facial thermal congestion, cranial muscular stress, and light sensitivity indicate an active acute migraine attack with high physical discomfort.',
            steps: [
              {
                text: 'Transfer the student to a dark, quiet rest area away from fluorescent lighting and screens.',
                iconType: 'dark_area'
              },
              {
                text: 'Do not administer Ibuprofen due to his severe allergy. Provide a cold compress.',
                iconType: 'no_ibuprofen'
              },
              {
                text: 'Map vitals closely; notify guardian if aura symptoms intensify.',
                iconType: 'vitals_guardian'
              }
            ]
          }
        };

        setAlerts(prev => {
          if (prev.some(a => a.studentName === 'Kevin Zhang' && a.acknowledged === false)) return prev;
          return [newAlert, ...prev];
        });

        setActiveBroadcastBanner('🚨 EMERGENCY TRIGGERED: Kevin Zhang (Grade 11B) initiated emergency scan!');
        setPulseDangerMode(true);
      } 
      else if (key === 'b') {
        const newAlert: ActiveAlert = {
          id: `alert-b-${Date.now()}`,
          type: 'TEACHER REFERRAL',
          studentName: 'Chloe Tan',
          grade: 'Grade 10A',
          reporter: 'Infirmary - Mild Scan',
          reportedTime: timestamp,
          description: 'Chloe Tan in Grade 10A completed a mild scan biometrics check-in sequence.',
          acknowledged: false,
          scanSeverity: 'mild',
          aiSuggestion: {
            insight: 'Symmetrical facial temperature map. Happy and fully relaxed expression with normal pupil size and regular respiratory rate.',
            steps: [
              {
                text: 'Verify water hydration levels.',
                iconType: 'hydration'
              },
              {
                text: 'Fully cleared for regular sports, recess, and school curriculum.',
                iconType: 'clearance'
              }
            ]
          }
        };

        setAlerts(prev => {
          if (prev.some(a => a.studentName === 'Chloe Tan' && a.acknowledged === false)) return prev;
          return [newAlert, ...prev];
        });
        setActiveBroadcastBanner('ℹ️ REFERRAL DISPATCHED: Chloe Tan (Grade 10A) completed a mild scan. Check AI suggestion.');
      } 
      else if (key === 'c') {
        const newAlert: ActiveAlert = {
          id: `alert-c-${Date.now()}`,
          type: 'TEACHER REFERRAL',
          studentName: 'Sarah Lim',
          grade: 'Form 3B',
          reporter: 'Infirmary - Moderate Scan',
          reportedTime: timestamp,
          description: 'Sarah Lim in Form 3B completed a moderate scan and is sent to the office.',
          acknowledged: false,
          scanSeverity: 'moderate',
          aiSuggestion: {
            insight: 'Respiratory biometric markers display stable flow with no indication of wheezing or dyspnea.',
            steps: [
              {
                text: 'Confirm she has her rescue blue inhaler inside her backpack for preventive measures.',
                iconType: 'inhaler_backpack'
              },
              {
                text: 'Approved to return to regular classroom tasks immediately.',
                iconType: 'classroom_return'
              }
            ]
          }
        };

        setAlerts(prev => {
          if (prev.some(a => a.studentName === 'Sarah Lim' && a.acknowledged === false)) return prev;
          return [newAlert, ...prev];
        });
        setActiveBroadcastBanner('⚠️ REFERRAL SENT TO OFFICE: Sarah Lim (Form 3B) completed moderate scan.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Simulated Alert Banners & alarms state
  const [activeBroadcastBanner, setActiveBroadcastBanner] = useState<string | null>(null);
  const [showSOSLauncher, setShowSOSLauncher] = useState(false);
  const [pulseDangerMode, setPulseDangerMode] = useState(false);
  const [practitionerDetailsVisible, setPractitionerDetailsVisible] = useState(false);

  // Interaction: Trigger global simulated broadcast warning banner
  const triggerBroadcastAlert = () => {
    setActiveBroadcastBanner(
      `BROADCAST CRITICAL PROTOCOL: Active air-filtration testing is underway. All clinic medical dispatch lanes stay on standby.`
    );
    // Auto timeout banner in 7 secs
    setTimeout(() => {
      setActiveBroadcastBanner(null);
    }, 7000);
  };

  // Interaction: Dismiss active alert from sentinel sidebar
  const acknowledgeAlert = (alertId: string) => {
    const alertItem = alerts.find(a => a.id === alertId);
    if (alertItem) {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      setActiveBroadcastBanner(`ALERT DISPATCH HANDLED: Initial check of ${alertItem.studentName} is completed.`);
      setTimeout(() => setActiveBroadcastBanner(null), 4000);
    }
  };

  // Interaction: Add new admin logs inside dispensing workspace
  const handleAddAdminLog = (newLog: Omit<AdminLog, 'id' | 'time'>) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logId = `log-${Date.now()}`;
    const loggedEntry: AdminLog = {
      ...newLog,
      id: logId,
      time: timestamp
    };

    // Update global admin logs list
    setAdminLogs(prev => [loggedEntry, ...prev]);

    // Deduct quantities in matching inventory if available
    setInventory(prevInv => prevInv.map(item => {
      if (item.name.toLowerCase().includes(newLog.medicineName.toLowerCase().split(' ')[0])) {
        const nextLevel = Math.max(0, item.stockLevel - 1);
        return {
          ...item,
          stockLevel: nextLevel,
          percentage: Math.round((nextLevel / 120) * 100),
          status: nextLevel < 5 ? 'Critical Shortage' : nextLevel < 20 ? 'Low Stock' : 'Sufficient'
        };
      }
      return item;
    }));

    // Update case timeline if matching case active
    setCases(prevCases => prevCases.map(c => {
      if (c.studentId === newLog.studentId) {
        return {
          ...c,
          timeline: [
            {
              id: `t-new-${Date.now()}`,
              time: timestamp,
              title: 'VERIFIED DISPENSATION LOGGED',
              description: `Dispensed safe dose: ${newLog.medicineName} (${newLog.dosage}) to student. Approved by Registered Nurse S. Sterling.`,
              type: 'CLINICAL'
            },
            ...c.timeline
          ]
        };
      }
      return c;
    }));

    setActiveBroadcastBanner(`VERIFIED RECORD: Dispensed ${newLog.medicineName} logged into administrative logs successfully.`);
    setTimeout(() => setActiveBroadcastBanner(null), 5000);
  };

  // Interaction: Trigger Active Student Emergency SOS Alarms
  const handleLaunchEmergencySOS = (student: Student, severityLevel: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const alertId = `alert-${Date.now()}`;
    
    // 1. Spawns active list alerts
    const newAlert: ActiveAlert = {
      id: alertId,
      type: 'SOS ALERT',
      studentName: student.name,
      grade: student.grade,
      reporter: `Clinic AI Sensors — Room B`,
      reportedTime: timestamp,
      description: `ACTIVE CRISIS TRIGGER: Student experiencing emergency respiratory distress due to ${student.condition}. Severity: ${severityLevel}.`,
      acknowledged: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    // 2. Logs active emergency case file automatically in case registry
    const newCaseEntry: CaseRecord = {
      id: `case-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentGrade: student.grade,
      studentAvatar: student.avatar,
      hash: `${Math.random().toString(16).substr(2, 6)}`,
      activeStatusLabel: `Active Alert Incident #${student.id}`,
      severity: 'HIGH_RISK',
      summaryDescription: `SOS Distress - ${student.condition} outbreak`,
      reportedTime: timestamp,
      registeredNurse: 'S. Sterling',
      timeline: [
        {
          id: `t-sys-${Date.now()}`,
          time: timestamp,
          title: 'SOS DETECTED BY CLINIC SENSED FLOW',
          description: `Telemetry system registered high heart distress. Alarms triggered.`,
          notes: `"Rapid breathing and skin temperature spikes. Oxygen saturation logs dipping."`,
          type: 'AI_SCAN'
        }
      ]
    };
    setCases(prev => [newCaseEntry, ...prev]);

    // 3. Spawns active alarm siren banner
    setActiveBroadcastBanner(`🚨 EMERGENCY SOS DISPATCH ALERT: Aloud warnings triggered of student ${student.name}! All responders shift immediately.`);
    setPulseDangerMode(true);
    setShowSOSLauncher(false);

    // Auto navigate to default active alarm logs to audit immediately
    setCurrentTab('dashboard');
  };

  // Interaction: Record clinical intake logs
  const recordClinicalIntake = (student: Student, medicine: string, dosage: string) => {
    handleAddAdminLog({
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      medicineName: medicine,
      dosage: dosage,
      staffName: 'Registered Nurse S. Sterling',
      status: 'Administered'
    });
    
    // Switch to logs tab view to view immediately
    setCurrentTab('pharmacy_log');
  };

  // Interaction: Add new stock
  const handleAddNewStockItem = (newItem: MedicationInventory) => {
    setInventory(prev => [newItem, ...prev]);
    setActiveBroadcastBanner(`PHARMACY SYSTEM: Success logged newly configured trade compound stock: ${newItem.name}.`);
    setTimeout(() => setActiveBroadcastBanner(null), 4000);
  };

  // Interaction: Add shortage count via refilling order
  const handleModifyShortage = (itemId: string, increment: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextLevel = item.stockLevel + increment;
        return {
          ...item,
          stockLevel: nextLevel,
          percentage: Math.min(100, Math.round((nextLevel / 120) * 100)),
          status: 'Sufficient'
        };
      }
      return item;
    }));
    setActiveBroadcastBanner(`STOCK INVENTORY REFILL: Handled trade lot refill successfully.`);
    setTimeout(() => setActiveBroadcastBanner(null), 4000);
  };

  // Interaction: Export legal pdf stub simulation
  const handleExportPDF = (hash: string) => {
    setActiveBroadcastBanner(`LEGAL DOCUMENT BUILDER: Exported cryptographically certified incident audit PDF with hash #${hash}. Check local downloads.`);
    setTimeout(() => setActiveBroadcastBanner(null), 6500);
  };

  // Switch dynamically to student card under Office Care view
  const transitionToStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentTab('office_care');
  };

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex font-sans transition-colors duration-300 ${pulseDangerMode ? 'ring-8 ring-red-500 ring-inset ring-pulse animate-pulse' : ''}`}>
      
      {/* Sidebar Navigation workspace */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSearchQuery(''); // clear current search to restore views defaults
        }} 
        onEmergencyTrigger={() => setShowSOSLauncher(true)} 
      />

      {/* Main workspace container wrapper */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
        
        {/* Urgent emergency alarm broad banner if active */}
        {activeBroadcastBanner && (
          <div className="bg-rose-600 text-white px-10 py-3 text-xs font-mono flex items-center justify-between sticky top-20 z-20 shadow-md">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-extrabold coding-all-caps">{activeBroadcastBanner}</span>
            </span>
            <button 
              onClick={() => {
                setActiveBroadcastBanner(null);
                setPulseDangerMode(false);
              }} 
              className="text-white hover:opacity-75 transition-opacity cursor-pointer pl-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global sticky bar header */}
        <Header 
          currentTab={currentTab} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBroadcastAlert={triggerBroadcastAlert}
          onProfileClick={() => setPractitionerDetailsVisible(prev => !prev)}
          alertCount={alerts.length}
        />

        {/* Dynamic sliding core view canvas wrapper */}
        <main className="p-10 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'dashboard' && (
                <DashboardView 
                  students={students}
                  alerts={alerts}
                  searchQuery={searchQuery}
                  onSelectStudent={transitionToStudentProfile}
                  onAcknowledgeAlert={acknowledgeAlert}
                  onOpenAddNewVisit={() => transitionToStudentProfile('BS-11B')}
                  onTriggerSOS={() => setShowSOSLauncher(true)}
                />
              )}

              {currentTab === 'office_care' && (
                <OfficeCareView 
                  students={students}
                  selectedStudentId={selectedStudentId}
                  onBackToDashboard={() => setCurrentTab('dashboard')}
                  onSelectStudent={setSelectedStudentId}
                  onTriggerEmergency={(st) => handleLaunchEmergencySOS(st, 'CRITICAL')}
                  onRecordClinicalIntake={recordClinicalIntake}
                />
              )}

              {currentTab === 'pharmacy_log' && (
                <PharmacyLogView 
                  adminLogs={adminLogs}
                  students={students}
                  searchQuery={searchQuery}
                  onAddAdminLog={handleAddAdminLog}
                  onSelectStudent={transitionToStudentProfile}
                  onOpenAudit={() => setCurrentTab('case_records')}
                />
              )}

              {currentTab === 'storage' && (
                <MedicineStorageView 
                  inventory={inventory}
                  searchQuery={searchQuery}
                  onAddStock={handleAddNewStockItem}
                  onModifyShortage={handleModifyShortage}
                />
              )}

              {currentTab === 'case_records' && (
                <CaseRecordsView 
                  cases={cases}
                  searchQuery={searchQuery}
                  onExportPDF={handleExportPDF}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* EMERGENCY SOS DESK DIALOG SPY PANEL POPUP */}
      {showSOSLauncher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-red-200/20">
            <div className="flex items-center gap-3.5 mb-2.5">
              <AlertOctagon className="w-6.5 h-6.5 text-[#940010] animate-bounce" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Trigger Active Emergency SOS Lane</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">Select which campus student requires immediate pediatric medical help. This logs emergency timers instantly across dashboards.</p>

            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
              {students.map((st) => (
                <div 
                  key={st.id}
                  onClick={() => handleLaunchEmergencySOS(st, 'CRITICAL DISPATCH LEVEL 1')}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 hover:bg-[#ffdad6]/20 hover:border-[#ba1a1a]/40 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <img alt={st.name} className="w-9 h-9 rounded-full object-cover" src={st.avatar} />
                    <div>
                      <p className="text-xs font-black text-[#191b22] dark:text-slate-100">{st.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{st.grade} • Condition: {st.condition}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-[#940010] bg-[#ffdad6] px-2 py-1 rounded">LAUNCH SOS</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={() => setShowSOSLauncher(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-xs font-bold text-[#424752] dark:text-white cursor-pointer transition-colors"
              >
                Cancel Warning Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Practitioner details profile pop-drawer */}
      {practitionerDetailsVisible && (
        <div className="fixed top-24 right-10 z-50 bg-white dark:bg-slate-900 p-6 rounded-2xl w-80 shadow-2xl border border-slate-200/60 dark:border-slate-800 font-sans select-none animate-fadeIn animate-duration-150">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <img 
              alt="Practitioner Profile" 
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGIBPUQGAtxZvgjY3sMJpDafaIQBaFh61EcRZYnbSbILbg-qgDG6wzBZpvUhtdKImEj-hzML5aD3D_LHRpZfhCr5ujZOhK5b3jITIfQWjS5K8okvgljCQYeP4ZP-xZbcBe6hmrohUnYakrXWPcEtZYl3gjbRqAlHhsI0gL1U8NPu04TmDkeKqUI61I_pDeSJ2sKbEKT53ARq91b0ZmofjazdbFxl4kZJ_Yi_XAan9DJedMlghp3QM0oX4wPFedOCgnkPzHBkk-eg" 
            />
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">S. Sterling, BSN, RN</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Campus Health Coordinator</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Logged Role:</span>
              <span className="font-extrabold text-[#006b5e] dark:text-emerald-400">Pediatric Head Nurse</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Duty Desk:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Main Infirmary Suite</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Active Session:</span>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded">SH_RN_492A</span>
            </div>
            
            <button 
              onClick={() => setPractitionerDetailsVisible(false)}
              className="mt-4 w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Dismiss Details Info
            </button>
            <button 
              onClick={() => {
                setPractitionerDetailsVisible(false);
                setIsLoggedIn(false);
                localStorage.removeItem('schoolcare_logged_in');
              }}
              className="mt-2 w-full py-2.5 border border-rose-205 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/25 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out / Lock Console
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
