/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { AdminLog, Student } from '../types';
import { ShieldCheck, Calendar, Activity, AlertTriangle, Search, FileDown, ArrowLeft, ArrowRight, ClipboardPlus, UserCheck, Plus, Check } from 'lucide-react';

interface PharmacyLogViewProps {
  adminLogs: AdminLog[];
  students: Student[];
  searchQuery: string;
  onAddAdminLog: (log: Omit<AdminLog, 'id' | 'time'>) => void;
  onSelectStudent: (studentId: string) => void;
  onOpenAudit: () => void;
}

export default function PharmacyLogView({
  adminLogs,
  students,
  searchQuery,
  onAddAdminLog,
  onSelectStudent,
  onOpenAudit
}: PharmacyLogViewProps) {
  
  // Selection state for current active entry context student
  const [activeFormStudentId, setActiveFormStudentId] = useState('BS-11B');
  const selectedStudent = students.find(s => s.id === activeFormStudentId) || students[0];

  // Form states
  const [drugSelection, setDrugSelection] = useState('Acetaminophen (Tylenol) 500mg');
  const [dosage, setDosage] = useState('1 Tablet');
  const [warningDismissed, setWarningDismissed] = useState(false);

  // Filter logs based on search query
  const filteredLogs = adminLogs.filter(log =>
    log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.staffName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submission handler
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddAdminLog({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentAvatar: selectedStudent.avatar,
      medicineName: drugSelection,
      dosage: `${dosage} (Oral)`,
      staffName: 'Nurse Diana',
      status: 'Administered'
    });
    setDosage('1 Tablet');
  };

  return (
    <div className="font-sans space-y-8 select-none">
      
      {/* Page Header & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Summary */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl text-white flex flex-col justify-between min-h-[140px] shadow-sm shadow-indigo-650/10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-85">Daily Clinical Dispense Summary</span>
            <Activity className="w-5 h-5 opacity-70" />
          </div>
          <div className="flex items-baseline gap-4 mt-4">
            <span className="text-5xl font-black tracking-tighter">{adminLogs.length + 140}</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">Doses Verified</span>
              <span className="text-[10px] opacity-75 mt-1.5">+12% from yesterday threshold</span>
            </div>
          </div>
        </div>

        {/* Active Cases tracker */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl flex flex-col justify-between border-l-4 border-emerald-500 min-h-[140px] shadow-xs border border-slate-200/50 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Infirmary Cases</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white">08</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-1.5">Awaiting active recovery observation</span>
          </div>
        </div>
      </div>

      {/* Medication Entry Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/55 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-teal-50 text-teal-600 dark:bg-teal-950/45 dark:text-teal-450 border border-teal-100/10 text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest">
            Active Dispensing Lane
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row gap-8">
          
          {/* Student Context selector column */}
          <div className="w-full lg:w-1/3 border-r border-slate-150 dark:border-slate-800 pr-0 lg:pr-8">
            <div className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase mb-4">Focus Patient Blueprint</div>
            
            {/* Quick dropdown select other students for the form */}
            <div className="mb-4">
              <label className="block text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">Choose active record:</label>
              <select 
                value={activeFormStudentId}
                onChange={(e) => setActiveFormStudentId(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 mb-4 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
              <img
                alt="Form Target Profile"
                className="w-16 h-16 rounded-xl object-cover shadow-xs border border-slate-200/50 dark:border-slate-800"
                src={selectedStudent.avatar}
              />
              <div>
                <h3 className="text-md font-black text-slate-800 dark:text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">{selectedStudent.grade}</p>
              </div>
            </div>

            <div className="bg-indigo-500/10 p-4 rounded-xl">
              <div className="text-[9px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-1">Stated Complaint</div>
              <div className="text-xs font-extrabold text-slate-800 dark:text-indigo-300">
                {selectedStudent.id === 'BS-11B' ? 'Acute Tension Headache' : `Under ${selectedStudent.condition}`}
              </div>
              <div className="mt-2 text-[9px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reported 12 mins ago</span>
              </div>
            </div>
          </div>

          {/* Core Form Controls column */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Warnings banner */}
            {!warningDismissed && selectedStudent.id === 'BS-11B' && (
              <div className="bg-rose-50 text-rose-800 p-4 rounded-xl flex items-center gap-4 text-xs border border-rose-100/30">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <p className="font-extrabold flex-1 text-[11px]">
                  Protocol Active Constraint: Acetaminophen administration was last recorded at 08:15 AM today. Confirm window limit.
                </p>
                <button
                  type="button"
                  onClick={() => setWarningDismissed(true)}
                  className="text-[9px] font-black uppercase underline hover:opacity-80"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Drug Selection (Verified Safe)</label>
                <select
                  value={drugSelection}
                  onChange={(e) => setDrugSelection(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-extrabold text-[#191b22] dark:text-white"
                >
                  <option value="Acetaminophen (Tylenol) 500mg">Acetaminophen (Tylenol) 500mg</option>
                  <option value="Ibuprofen (Advil) 200mg">Ibuprofen (Advil) 200mg</option>
                  <option value="Diphenhydramine 25mg">Diphenhydramine 25mg</option>
                  <option value="Ventolin Nebulizer Solution">Ventolin Nebulizer Solution</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-black text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Log Dispatch Time</label>
                  <input
                    type="text"
                    disabled
                    value="12:45 PM"
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200/60 rounded-xl py-3 px-4 text-xs font-bold opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="flex-1 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center gap-3 w-full border border-slate-200/20">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div className="text-[10px]">
                  <span className="font-extrabold block text-slate-800 dark:text-slate-200">Legal Parent Contact Notified</span>
                  <span className="text-slate-450 font-medium block mt-0.5">Sent at 12:40 PM • Awaiting physical receipt verification</span>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs tracking-widest shadow-xs transition-all cursor-pointer"
              >
                EXECUTE & LOG SYSTEM
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* Real-time Administration Log table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white select-none">Daily Administration Audit Log</h3>
          <div className="text-xs text-slate-400 font-semibold select-none">
            {filteredLogs.length} Entries Recorded Today
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 dark:border-slate-800 transition-colors duration-355">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Student File</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Certified Medicine</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Log Hour</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Staff In-Charge</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500 text-right">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-50/20 dark:hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img alt={log.studentName} className="h-full w-full object-cover" src={log.studentAvatar} />
                      </div>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-150">{log.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{log.medicineName}</span>
                      <span className="text-[10px] text-slate-450 mt-0.5">{log.dosage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-xs text-slate-600 dark:text-slate-400 font-mono">{log.time}</td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{log.staffName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase rounded-full border ${
                      log.status === 'Emergency'
                        ? 'bg-rose-50 border-rose-100 text-rose-600'
                        : 'bg-teal-50 border-teal-100 text-teal-600'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-200/50 dark:border-slate-900">
            <span>Showing {filteredLogs.length} of {adminLogs.length + 140} logs compiled</span>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-800 dark:text-slate-200 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-800 dark:text-slate-200 cursor-pointer">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Status (Bento Bottom Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Medication levels view */}
        <div className="col-span-1 lg:col-span-3 bg-[#ededf7] dark:bg-slate-900 p-6 rounded-2xl relative overflow-hidden transition-colors duration-300">
          <div className="relative z-10">
            <h4 className="text-md font-black text-slate-800 dark:text-white mb-1.5">Critical Medication Inventory Levels</h4>
            <p className="text-xs text-slate-500 mb-6">Real-time telemetry of critical clinic dispatch items.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-950 p-4.5 rounded-xl border-b-2 border-[#006b5e]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Panadol tabs</span>
                <span className="text-2xl font-black block mt-1 text-slate-800 dark:text-white">45%</span>
                <span className="text-[9px] text-[#006b5e] font-black block mt-2">REPLENISH SOON</span>
              </div>

              <div className="bg-white dark:bg-slate-950 p-4.5 rounded-xl border-b-2 border-[#003fa8]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Ventolin Sol</span>
                <span className="text-2xl font-black block mt-1 text-slate-800 dark:text-white">82%</span>
                <span className="text-[9px] text-[#003fa8] font-black block mt-2">HEALTHY STATE</span>
              </div>

              <div className="bg-white dark:bg-slate-950 p-4.5 rounded-xl border-b-2 border-[#940010]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">EpiPen Dep</span>
                <span className="text-2xl font-black block mt-1 text-[#940010]">12%</span>
                <span className="text-[9px] text-[#930010] font-black block mt-2 animate-pulse">CRITICAL LOW</span>
              </div>

              <div className="bg-white dark:bg-slate-950 p-4.5 rounded-xl border-b-2 border-[#003fa8]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Ibuprofen Syr</span>
                <span className="text-2xl font-black block mt-1 text-slate-800 dark:text-white">68%</span>
                <span className="text-[9px] text-[#003fa8] font-black block mt-2">HEALTHY STATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace stats block */}
        <div className="bg-[#e7e7f1] dark:bg-slate-800 p-6 rounded-2xl flex flex-col justify-between transition-colors duration-300">
          <div>
            <h4 className="text-[9px] font-black uppercase text-[#424752] dark:text-slate-300 tracking-wider">Workspace Telemetry</h4>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Avg Prep Speed</span>
                <span className="font-extrabold text-[#003fa8] dark:text-blue-300">2m 45s</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Verified Clinicians</span>
                <span className="font-extrabold text-[#003fa8] dark:text-blue-300">12 Active</span>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onOpenAudit}
            className="mt-6 w-full py-2.5 bg-white dark:bg-slate-900 text-[#191b22] dark:text-white font-extrabold text-[10px] rounded-lg tracking-widest uppercase hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            Audit System Logs
          </button>
        </div>

      </div>

    </div>
  );
}
