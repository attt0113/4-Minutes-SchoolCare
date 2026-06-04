/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CaseRecord } from '../types';
import { AlertCircle, User, Brain, ShieldAlert, Heart, Calendar, Link2, Download, CheckCircle, Clock } from 'lucide-react';

interface CaseRecordsViewProps {
  cases: CaseRecord[];
  searchQuery: string;
  onExportPDF: (recordHash: string) => void;
}

export default function CaseRecordsView({
  cases,
  searchQuery,
  onExportPDF
}: CaseRecordsViewProps) {
  
  // High risk filter toggle
  const [filterHighRisk, setFilterHighRisk] = useState(false);
  
  // Selected case active record
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-9921');
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Map case timeline categories to custom theme colors
  const getTimelineColors = (type: string) => {
    switch (type) {
      case 'AI_SCAN':
        return { dot: 'bg-indigo-600', text: 'text-indigo-600' };
      case 'CLINICAL':
        return { dot: 'bg-emerald-600', text: 'text-emerald-600' };
      case 'PARENT':
        return { dot: 'bg-slate-500', text: 'text-slate-500' };
      case 'EMS':
        return { dot: 'bg-rose-600', text: 'text-rose-600' };
      default:
        return { dot: 'bg-slate-400', text: 'text-slate-400' };
    }
  };

  // Filter cases listed on left panel
  const filteredCases = cases.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summaryDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHighRisk = !filterHighRisk || item.severity === 'HIGH_RISK';
    return matchesSearch && matchesHighRisk;
  });

  return (
    <div className="font-sans space-y-8 select-none">
      
      {/* Content Header Actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 select-none">
        <div>
          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-1.5 font-mono">Verified Legal Audits</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Clinical Logs &amp; Incident Case Registry</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Verify Audit Trail | 1,429 Cryptographically Bound Total Encounters successfully parsed.
          </p>
        </div>

        <div className="flex gap-3 self-start sm:self-auto select-none">
          <button
            type="button"
            onClick={() => setFilterHighRisk(prev => !prev)}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-200/50 transition-colors cursor-pointer ${
              filterHighRisk
                ? 'bg-rose-600 text-white border-transparent'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {filterHighRisk ? 'Show All Records' : 'Filter High Risk'}
          </button>
          
          <button
            type="button"
            onClick={() => onExportPDF(activeCase.hash)}
            className="bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 text-white px-5 py-3 rounded-xl font-bold text-xs tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Legal PDF
          </button>
        </div>
      </div>

      {/* Main asymmetric double-column layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Hand: medical events list (7 cols) */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-205 dark:border-slate-800 shadow-xs transition-colors duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 dark:border-slate-850 pb-3">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Recent Campus Medical Incidents</span>
              <span 
                onClick={() => setFilterHighRisk(false)} 
                className="text-xs text-indigo-650 dark:text-indigo-400 hover:underline font-black cursor-pointer"
              >
                Reset Filter list
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
              {filteredCases.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`flex items-center p-5 rounded-2xl border transition-all cursor-pointer ${
                    activeCase.id === item.id
                      ? 'bg-indigo-50/40 dark:bg-slate-950/70 border-indigo-200/50 shadow-xs sm:translate-x-1'
                      : item.severity === 'HIGH_RISK'
                      ? 'bg-rose-50/15 border-rose-100/35 hover:bg-rose-50/30'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    item.severity === 'HIGH_RISK'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'bg-teal-50 text-teal-600 dark:bg-teal-950/45 dark:text-teal-400'
                  }`}>
                    {item.severity === 'HIGH_RISK' ? <AlertCircle className="w-5.5 h-5.5" /> : <Brain className="w-5.5 h-5.5" />}
                  </div>

                  <div className="ml-5 flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.studentName}</h4>
                      <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded ${
                        item.severity === 'HIGH_RISK' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40' : 'bg-teal-50 text-teal-600 dark:bg-teal-950/40'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      {item.summaryDescription}
                    </p>
                  </div>

                  <div className="ml-6 text-right font-mono">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100">{item.reportedTime}</p>
                    <p className="text-[9px] text-[#727783] font-bold uppercase mt-1">Today</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: Detailed timeline flow card (5 cols) */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-6 select-text font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs border border-slate-205 dark:border-slate-800 transition-colors duration-300">
            {/* Audits cryptographic binding keys */}
            <div className="bg-rose-600 px-8 py-4 flex justify-between items-center border-b border-rose-950/10 shadow-xs select-none">
              <span className="text-white font-black tracking-widest text-[9px] uppercase">
                {activeCase.activeStatusLabel}
              </span>
              <span className="text-white/70 text-[9px] font-mono font-bold">
                HASH: {activeCase.hash}
              </span>
            </div>

            <div className="p-8">
              {/* Patient header info */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-50 dark:border-slate-850">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-rose-50 hover:scale-105 transition-transform shadow-xs">
                    <img
                      alt={activeCase.studentName}
                      className="w-full h-full object-cover"
                      src={activeCase.studentAvatar}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {activeCase.studentName}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {activeCase.studentGrade} | Client Log Hash: {activeCase.hash}
                    </p>
                  </div>
                </div>
                
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>

              {/* Graphical timeline flow chart */}
              <div className="space-y-0 relative">
                {/* Visual vertical linker row line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-slate-800 pointer-events-none"></div>

                {activeCase.timeline.map((step) => {
                  const colors = getTimelineColors(step.type);
                  return (
                    <div key={step.id} className="relative pl-8 pb-8 last:pb-1 group">
                      {/* Timeline status dot indicators */}
                      <div className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full ${colors.dot} border-[3px] border-white dark:border-slate-900 shadow-xs group-hover:scale-110 transition-transform`}></div>
                      
                      <span className={`text-[9px] font-black uppercase tracking-wider ${colors.text} block mb-1.5`}>
                        {step.time} — {step.title}
                      </span>
                      
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {step.description}
                        </p>
                        {step.notes && (
                          <p className="text-xs italic text-slate-500 font-medium leading-relaxed mt-2 pl-2 border-l border-slate-300 dark:border-slate-705 select-all">
                            {step.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secondary verified dosage stats logger block */}
              {activeCase.dosageAudit && (
                <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-105 dark:border-slate-850 select-none">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-4">
                    Clinical Dosage Verified Authorization
                  </span>
                  
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div>
                      <p className="text-slate-400 text-[10px] font-semibold">Active Compound</p>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5">{activeCase.dosageAudit.medicationName}</p>
                      <p className="text-lg font-black text-indigo-600 mt-1">{activeCase.dosageAudit.dose}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] font-semibold">Lot Dispatch No</p>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 bg-white dark:bg-slate-900 py-1 px-2 rounded-md border border-slate-200/50">
                        {activeCase.dosageAudit.lotNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related files attachments component download link */}
          {activeCase.hasAttachment && (
            <div 
              onClick={() => onExportPDF(activeCase.hash)}
              className="bg-slate-100 dark:bg-slate-900/45 p-5 rounded-xl border border-slate-200/40 hover:border-indigo-600/10 hover:bg-slate-150 flex items-center justify-between group cursor-pointer transition-all shadow-xs select-none"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{activeCase.attachmentName || 'Release Waiver Form'}</p>
                  <p className="text-[10px] text-slate-400 font-extrabold mt-0.5">
                    {activeCase.attachmentDate || 'Signed on: 08/20/2023'}
                  </p>
                </div>
              </div>
              <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-y-0.5 transition-all" />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
