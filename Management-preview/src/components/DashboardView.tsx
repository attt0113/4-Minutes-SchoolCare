/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Student, ActiveAlert } from '../types';
import { 
  ShieldAlert, Users, TrendingUp, Bell, CheckCircle2, ChevronRight, 
  ExternalLink, Calendar, Plus, Clock, Brain, Sparkles, Moon, Ban, 
  HeartPulse, Droplet, Briefcase, BookOpen 
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  students: Student[];
  alerts: ActiveAlert[];
  searchQuery: string;
  onSelectStudent: (studentId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onOpenAddNewVisit: () => void;
  onTriggerSOS: () => void;
}

export default function DashboardView({
  students,
  alerts,
  searchQuery,
  onSelectStudent,
  onAcknowledgeAlert,
  onOpenAddNewVisit,
  onTriggerSOS,
}: DashboardViewProps) {
  
  const [openSuggestionId, setOpenSuggestionId] = useState<string | null>(null);

  // Filter students based on search query
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* Asymmetric Metrics Grid */}
      <section className="grid grid-cols-12 gap-6 select-none">
        
        {/* Attendance Rate Card with stylized vertical bars */}
        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl relative overflow-hidden group shadow-md shadow-indigo-600/10">
          <div className="z-15 relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-indigo-200">Average Attendance Rate</p>
                <h2 className="text-4xl font-extrabold tracking-tight mt-1">96.4%</h2>
              </div>
              <div className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-black">+1.2% wk</div>
            </div>

            {/* Simulated bar attendance chart */}
            <div className="mt-6 h-20 w-full flex items-end gap-1.5 px-1">
              <div className="flex-1 bg-white/20 h-[60%] rounded-t-sm hover:bg-white/35 transition-all"></div>
              <div className="flex-1 bg-white/35 h-[75%] rounded-t-sm hover:bg-white/50 transition-all"></div>
              <div className="flex-1 bg-white/20 h-[50%] rounded-t-sm hover:bg-white/35 transition-all"></div>
              <div className="flex-1 bg-white/45 h-[90%] rounded-t-sm hover:bg-white/60 transition-all"></div>
              <div className="flex-1 bg-white/65 h-[85%] rounded-t-sm hover:bg-white/80 transition-all"></div>
              <div className="flex-1 bg-white/80 h-[95%] rounded-t-sm hover:bg-white transition-all"></div>
              <div className="flex-1 bg-white h-[92%] rounded-t-sm shadow-[0_0_12px_rgba(255,255,255,0.7)]"></div>
            </div>

            <div className="flex justify-between text-[9px] mt-3 font-bold uppercase tracking-wider text-white/50">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span className="text-teal-300">Today</span>
            </div>
          </div>
        </div>

        {/* Pending Consents Section */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-colors duration-300">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Pending Guardian Consents</p>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">08</h2>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-3.5">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-[10px] font-black text-teal-600 dark:text-teal-400 border-2 border-white dark:border-slate-800">JS</div>
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 border-2 border-white dark:border-slate-800">ML</div>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-slate-200 border-2 border-white dark:border-slate-800">+6</div>
            </div>
            
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Review Drafts</span>
          </div>
        </div>

        {/* Emergency Alert stats count details */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 p-6 rounded-2xl shadow-xs flex flex-col justify-between border border-rose-100/40 dark:border-rose-950/40">
          <div>
            <p className="text-[10px] font-black tracking-widest opacity-85 uppercase mb-1 text-rose-700 dark:text-rose-400">Emergency Sentinel Alerts</p>
            <h2 className="text-4xl font-extrabold">{alerts.length < 10 ? `0${alerts.length}` : alerts.length}</h2>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-rose-600 bg-rose-500/10 px-3.5 py-1.5 rounded-full w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span>Last trigger: 14 mins ago</span>
          </div>
        </div>

        {/* Staff On Duty module */}
        <div className="col-span-12 lg:col-span-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 p-6 rounded-2xl shadow-xs flex flex-col items-center justify-center text-center border border-emerald-100/40 dark:border-emerald-950/40">
          <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400 mb-2" />
          <p className="text-[10px] font-black tracking-widest uppercase mb-1 text-emerald-700 dark:text-emerald-400">Staff On-Duty</p>
          <h2 className="text-3xl font-extrabold">04</h2>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 mt-0.5 opacity-80">Shift Verified</span>
        </div>
      </section>

      {/* Main Grid: Left Monitor list vs Right active details logs panel */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* High-Risk Monitor list column */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="flex justify-between items-center select-none">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5.5 h-5.5 text-rose-500" />
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                High-Risk Monitor List
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              {filteredStudents.length} Students Tracked
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 dark:border-slate-800 transition-colors duration-300">
            {/* Header row */}
            <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-950 px-8 py-4.5 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
              <div className="col-span-5">Student / Grade</div>
              <div className="col-span-3">Assigned Condition</div>
              <div className="col-span-3">Clinician Record</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* List entries */}
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-450 text-sm">
                  No matching student records found.
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-12 px-8 py-5 items-center hover:bg-indigo-50/20 dark:hover:bg-slate-800/30 transition-colors duration-150"
                  >
                    {/* Student Info */}
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                        <img
                          alt={student.name}
                          className="w-full h-full object-cover"
                          src={student.avatar}
                        />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer" onClick={() => onSelectStudent(student.id)}>
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{student.grade} • ID: {student.id}</p>
                      </div>
                    </div>

                    {/* Condition Pill */}
                    <div className="col-span-3">
                      <span className={`inline-block text-[11px] font-bold px-3.5 py-1 rounded-full border ${
                        student.riskLevel === 'HIGH_RISK' 
                          ? 'bg-rose-50 border-rose-100/30 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-slate-5 w-fit border-slate-200/40 dark:border-slate-800 text-slate-600 dark:text-slate-350 dark:bg-slate-800'
                      }`}>
                        {student.condition}
                      </span>
                    </div>

                    {/* Trend status info */}
                    <div className="col-span-3 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${student.riskLevel === 'HIGH_RISK' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {student.trend || 'Monitored Normal'}
                      </span>
                    </div>

                    {/* Quick view button */}
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => onSelectStudent(student.id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 p-2.5 rounded-xl transition-all cursor-pointer"
                        title="View Full Health Profile"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right side emergency dispatcher alerts bar */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/50 dark:border-slate-800 h-full overflow-hidden flex flex-col">
            
            {/* Header tab */}
            <div className="p-6 bg-rose-600 text-white flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 animate-bounce" />
                <h3 className="font-extrabold text-sm tracking-widest uppercase">Active Sentinel Dispatch</h3>
              </div>
              <span className="bg-white/20 text-white text-[10px] px-3 py-0.5 rounded-full font-black uppercase animate-pulse tracking-wider">
                LIVE
              </span>
            </div>

            {/* List of active alerts */}
            <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[380px] no-scrollbar">
              {alerts.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto opacity-75" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">All Sentinel Lanes Clear</p>
                  <p className="text-xs text-slate-400">No unresolved emergency dispatches recorded today.</p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const isEmergency = alert.scanSeverity === 'emergency';
                  const isMild = alert.scanSeverity === 'mild';
                  const isModerate = alert.scanSeverity === 'moderate';

                  let beforeBg = 'before:bg-rose-600';
                  let tagTextColor = 'text-rose-600 dark:text-rose-400';
                  let ackBtnBg = 'bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/20';

                  if (isMild) {
                    beforeBg = 'before:bg-emerald-500';
                    tagTextColor = 'text-emerald-600 dark:text-emerald-400';
                    ackBtnBg = 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20';
                  } else if (isModerate) {
                    beforeBg = 'before:bg-amber-500';
                    tagTextColor = 'text-amber-500 dark:text-amber-400';
                    ackBtnBg = 'bg-amber-500 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20';
                  }

                  return (
                    <div
                      key={alert.id}
                      className={`relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 ${beforeBg} before:rounded-full border-b border-slate-100/50 dark:border-slate-900 pb-5 last:border-b-0 last:pb-0`}
                    >
                      <div className="flex justify-between items-start mb-1.5 select-none">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${tagTextColor}`}>{alert.type}</p>
                        <span className="text-[10px] text-slate-400 font-bold">{alert.reportedTime}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {alert.reporter}
                      </h4>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="text-[10px] font-bold text-slate-400 mt-2 bg-slate-50 dark:bg-slate-950 py-1 px-2 w-fit rounded">
                        Student: <span className="text-slate-800 dark:text-slate-250">{alert.studentName} ({alert.grade})</span>
                      </div>

                      <div className="flex gap-2.5 mt-4">
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className={`flex-1 ${ackBtnBg} text-white py-2 rounded-lg text-xs font-extrabold tracking-wider transition-all cursor-pointer`}
                        >
                          Acknowledge
                        </button>
                      
                      {alert.aiSuggestion && (
                        <button
                          onClick={() => setOpenSuggestionId(openSuggestionId === alert.id ? null : alert.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-extrabold py-2 px-3 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                            openSuggestionId === alert.id 
                              ? 'bg-slate-205 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-305 dark:border-slate-700'
                              : 'bg-gradient-to-r from-indigo-505 via-indigo-600 to-purple-600 text-white hover:opacity-90'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {openSuggestionId === alert.id ? 'Hide Details' : 'Details'}
                        </button>
                      )}

                      <button 
                        onClick={() => onTriggerSOS()}
                        className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Locate nearest clinical station"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>

                    {openSuggestionId === alert.id && alert.aiSuggestion && (
                      <div className="mt-3.5 p-4 bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/40 rounded-xl space-y-3.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                          <h5 className="text-xs font-black uppercase tracking-wider">AI Suggestion Insight</h5>
                        </div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic bg-indigo-100/30 dark:bg-indigo-950/40 p-2.5 rounded-lg border-l-2 border-indigo-500">
                          "{alert.aiSuggestion.insight}"
                        </p>
                        
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommended Steps:</p>
                          <div className="space-y-2.5">
                            {alert.aiSuggestion.steps.map((step, idx) => {
                              let StepIcon = CheckCircle2;
                              let iconColor = 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/40';
                              
                              switch (step.iconType) {
                                case 'dark_area':
                                  StepIcon = Moon;
                                  iconColor = 'text-amber-650 bg-amber-50 dark:bg-amber-950/40';
                                  break;
                                case 'no_ibuprofen':
                                  StepIcon = Ban;
                                  iconColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/40';
                                  break;
                                case 'vitals_guardian':
                                  StepIcon = HeartPulse;
                                  iconColor = 'text-teal-600 bg-teal-50 dark:bg-teal-950/40';
                                  break;
                                case 'hydration':
                                  StepIcon = Droplet;
                                  iconColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/40';
                                  break;
                                case 'clearance':
                                  StepIcon = CheckCircle2;
                                  iconColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40';
                                  break;
                                case 'inhaler_backpack':
                                  StepIcon = Briefcase;
                                  iconColor = 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40';
                                  break;
                                case 'classroom_return':
                                  StepIcon = BookOpen;
                                  iconColor = 'text-purple-600 bg-purple-50 dark:bg-purple-950/40';
                                  break;
                              }
                              
                              return (
                                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                                  <div className={`p-1.5 rounded-lg shrink-0 ${iconColor}`}>
                                    <StepIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="leading-tight font-medium mt-0.5">{step.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )})
              )}
            </div>

            {/* Sidebar quick footer portal */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 mt-auto select-none border-t border-slate-200/50 dark:border-slate-900">
              <div 
                onClick={() => onSelectStudent('KZ-92')}
                className="w-full flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
              >
                <span>Navigate Audit Dispatch Logs</span>
                <ChevronRight className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Aesthetic contextual FLOATING ACTION BUTTON at bottom right */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={onOpenAddNewVisit}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group cursor-pointer"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
          <span className="absolute right-20 bg-slate-900 border border-slate-850 text-white text-[10px] font-black px-4 py-2.5 rounded-lg opacity-0 group-hover:opacity-100 shadow-xl transition-all whitespace-nowrap pointer-events-none tracking-widest uppercase">
            New Visit Intake
          </span>
        </button>
      </div>

    </div>
  );
}
