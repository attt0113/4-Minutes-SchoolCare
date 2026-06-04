/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Student } from '../types';
import { ArrowLeft, ShieldAlert, Phone, AlertTriangle, FileText, CheckCircle2, User, Activity, Map, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface OfficeCareViewProps {
  students: Student[];
  selectedStudentId: string;
  onBackToDashboard: () => void;
  onSelectStudent: (studentId: string) => void;
  onTriggerEmergency: (student: Student) => void;
  onRecordClinicalIntake: (student: Student, medicine: string, dosage: string) => void;
}

export default function OfficeCareView({
  students,
  selectedStudentId,
  onBackToDashboard,
  onSelectStudent,
  onTriggerEmergency,
  onRecordClinicalIntake
}: OfficeCareViewProps) {
  
  // Find currently selected student
  const student = students.find(s => s.id === selectedStudentId) || students[0];

  // Intake modal state
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState('Salbutamol Inhaler');
  const [dosageText, setDosageText] = useState('1 Puff (Inhalation)');

  // Handle recorded submit
  const handleIntakeSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRecordClinicalIntake(student, selectedMedicine, dosageText);
    setShowIntakeModal(false);
  };

  // Helper to calculate initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="font-sans space-y-6 select-none">
      
      {/* Student Selector Row - enables picking other students dynamically */}
      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest whitespace-nowrap mr-2">Quick Directory:</span>
        {students.map((st) => (
          <button
            key={st.id}
            onClick={() => onSelectStudent(st.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              st.id === student.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100'
            }`}
          >
            {st.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left main Profile details column */}
        <div className="flex-1 max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-350">
          
          <div className="p-8">
            {/* Back to dashboard trigger */}
            <button
              onClick={onBackToDashboard}
              className="flex items-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Close and Return
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Student health profile</h2>

            {/* Profile main bio card details */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center font-extrabold text-lg shadow-xs">
                {getInitials(student.name)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{student.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{student.grade} • Registered Clinical ID: {student.id}</p>
                <div className="mt-2.5">
                  <span className={`inline-block px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    student.riskLevel === 'HIGH_RISK'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400'
                  }`}>
                    {student.riskLevel === 'HIGH_RISK' ? 'High Risk - Primary Asthma' : 'Clinically Stable'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Information Table Layout */}
          <div className="border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-950 px-8 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/20">
              Health Information Blueprint
            </div>

            <div className="grid grid-cols-12 px-8 py-4 items-center border-b border-slate-50 dark:border-slate-800/80">
              <span className="col-span-5 text-sm text-slate-550">Blood type</span>
              <span className="col-span-7 text-sm font-bold text-slate-800 dark:text-slate-150">{student.bloodType || 'O+'}</span>
            </div>

            <div className="grid grid-cols-12 px-8 py-4 items-center border-b border-slate-50 dark:border-slate-800/80">
              <span className="col-span-5 text-sm text-slate-550">Conditions</span>
              <span className="col-span-7 text-sm font-bold text-slate-800 dark:text-slate-150">{student.condition}</span>
            </div>

            <div className="grid grid-cols-12 px-8 py-4 items-center border-b border-slate-50 dark:border-slate-800/80">
              <span className="col-span-5 text-sm text-slate-550">Allergies</span>
              <span className={`col-span-7 text-sm font-black ${student.allergies && student.allergies !== 'None' ? 'text-rose-600' : 'text-slate-700 dark:text-slate-350'}`}>
                {student.allergies || 'Penicillin'}
              </span>
            </div>

            <div className="grid grid-cols-12 px-8 py-4 items-center">
              <span className="col-span-5 text-sm text-slate-550">Regular medications</span>
              <span className="col-span-7 text-sm font-bold text-slate-700 dark:text-slate-300">{student.regularMeds || 'Salbutamol inhaler'}</span>
            </div>
          </div>

          {/* Emergency Contacts Table Layout */}
          <div className="border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-950 px-8 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/20">
              Emergency Contact Hierarchy
            </div>

            {student.guardians.map((g, index) => (
              <div 
                key={g.name} 
                className={`grid grid-cols-12 px-8 py-4 items-center ${index === 0 ? 'border-b border-slate-50 dark:border-slate-800/80' : ''}`}
              >
                <span className="col-span-5 text-sm text-slate-550 font-medium">Guardian {index + 1} ({index === 0 ? 'Primary' : 'Secondary'})</span>
                <a href={`tel:${g.phone}`} className="col-span-7 text-sm font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {g.name} ({g.phone})
                </a>
              </div>
            ))}
          </div>

          {/* Historic Medication Feed logs */}
          <div className="border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-950 px-8 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/20">
              Recent Clinical Dispense Logs
            </div>

            {student.recentLogs.map((log, index) => (
              <div 
                key={log.details} 
                className={`flex justify-between items-center px-8 py-4 ${index === 0 ? 'border-b border-slate-50 dark:border-slate-800/80' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-500 bg-slate-50 dark:bg-slate-850 px-2 py-1 rounded">
                    {log.date}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.details}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide">COMPLETED</span>
              </div>
            ))}
          </div>

          {/* Core bottom click triggers */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-900 flex flex-col gap-3">
            <button
              onClick={() => onTriggerEmergency(student)}
              className="w-full py-4 border border-rose-200 hover:border-rose-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition-all duration-150 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Trigger Active Air Emergency
            </button>
            <button
              onClick={() => setShowIntakeModal(true)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 text-white rounded-xl font-bold text-xs tracking-wider transition-all shadow-xs cursor-pointer"
            >
              Record Clinical Intake & Dispense
            </button>
          </div>

        </div>

        {/* Right side AI & immediate action modules */}
        <div className="w-96 space-y-6">
          
          {/* AI Suggestions with Steps */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-xs transition-colors duration-350">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-[10px] font-black tracking-widest text-[#1c6df2] dark:text-blue-400 uppercase">AI Suggestions with Steps</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> ACTIVE ASSIST
              </span>
            </div>

            {student.riskLevel === 'HIGH_RISK' ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 1: Assess Respiratory Distress</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Check for rapid shallow breathing, deep coughs, or visible chest tight symptoms.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 2: Administer Prescribed Inhaler</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Dispense Salbutamol inhaler puffs with proper spacer attachment immediately.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 3: Keep Child Calm &amp; Upright</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Help the student sit elevated and practice slow, deliberate inhalation cycles.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/30">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 4: Execute 4-Minute Review</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Observe carefully. If symptoms increase after 4 minutes, dispatch emergency response sirens.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 1: Check School Consent Log</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Verify that parental permissions for over-the-counter medicine distribution are active.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 2: Administer Under supervision</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Provide required standard dosage while reviewing allergy databases.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100/30 dark:border-indigo-900/20">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Step 3: Document Dispensation</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Update the school care electronic dispense checklist with accurate milligram details.</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Quick Immediate Action Protocols */}
          <section className="bg-slate-900 text-white p-7 rounded-2xl shadow-md border border-slate-850 space-y-4">
            <div>
              <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Immediate Protocols</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified clinical steps during chest distress.</p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/15 text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer">
                <span>View Certified Asthma Protocol</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
              
              <button className="w-full bg-white/10 hover:bg-white/15 text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer">
                <span>Locate Nearest Inhaler Depot</span>
                <Map className="w-4 h-4 text-teal-300" />
              </button>

              <button className="w-full bg-white/10 hover:bg-white/15 text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer">
                <span>Review General Consent Archive</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </section>

        </div>

      </div>

      {/* Structured Intake Recording Modal Dialog */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-[#c2c6d4]/20">
            <h3 className="text-lg font-black text-[#191b22] dark:text-white mb-2">Record Clinical Intake</h3>
            <p className="text-xs text-[#727783] mb-6">Create a verified clinical administration log for {student.name}.</p>

            <form onSubmit={handleIntakeSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Drug Selection</label>
                <select 
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-550/15 outline-none"
                >
                  <option value="Salbutamol Inhaler">Salbutamol (Ventolin) Inhaler</option>
                  <option value="Panadol 500mg">Panadol (Acetaminophen) 500mg</option>
                  <option value="Ibuprofen Suspension">Ibuprofen-Based Syrup</option>
                  <option value="EpiPen 0.3mg">EpiPen (Epinephrine) Auto-Injector</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Dosage Quantity</label>
                  <input
                    type="text"
                    required
                    value={dosageText}
                    onChange={(e) => setDosageText(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-550/15 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Campus Nurse</label>
                  <input
                    type="text"
                    disabled
                    value="Registered Nurse S. Sterling"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 rounded-xl text-xs font-semibold opacity-70 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-white rounded-xl text-xs font-bold tracking-wider cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold tracking-wider cursor-pointer transition-colors"
                >
                  Execute & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
