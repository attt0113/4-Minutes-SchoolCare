/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Megaphone, Bell, User, HeartPulse } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBroadcastAlert: () => void;
  onProfileClick: () => void;
  alertCount: number;
}

export default function Header({
  currentTab,
  searchQuery,
  onSearchChange,
  onBroadcastAlert,
  onProfileClick,
  alertCount
}: HeaderProps) {
  
  // Decide title based on active tab
  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'The Clinical Sentinel';
      case 'office_care':
        return 'Student Medical Profile';
      case 'pharmacy_log':
        return 'Pharmacy & Administration';
      case 'storage':
        return 'Medicine Storage & Inventory';
      case 'case_records':
        return 'Digital Case Audit Desk';
      default:
        return '4 Minutes SchoolCare Suite';
    }
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-900 z-30 flex justify-between items-center px-10 transition-all duration-300 select-none">
      <div className="flex items-center gap-4">
        {/* Real-time green pulse dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
        </span>
        <h1 className="text-slate-950 dark:text-white font-extrabold text-xl tracking-tight">
          {getTitle()}
        </h1>
        
        {/* Subtle top menu info */}
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hidden lg:inline">
          Authorized Campus Clinic
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Robust Search Records Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students, records, logs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border-none rounded-full pl-11 pr-5 py-2.5 w-76 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/15 outline-none font-semibold transition-all duration-200"
          />
        </div>

        {/* Global Broadcast Emergency CTA */}
        <div className="flex items-center gap-6">
          <button
            onClick={onBroadcastAlert}
            className="bg-gradient-to-br from-rose-600 to-rose-700 hover:opacity-90 active:scale-95 text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 shadow-lg shadow-rose-950/20 transition-all duration-150 cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            BROADCAST ALERT
          </button>

          {/* User & Alerts area */}
          <div className="flex items-center gap-5 border-l border-slate-200 dark:border-slate-800 pl-6 h-8">
            <div 
              onClick={onProfileClick} 
              className="relative cursor-pointer hover:opacity-85 transition-opacity"
              title="Active System Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-350" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 border border-white rounded-full animate-pulse flex items-center justify-center"></span>
              )}
            </div>

            {/* Profile Picker Dropdown trigger */}
            <div 
              onClick={onProfileClick} 
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-slate-100 cursor-pointer shadow-sm hover:scale-105 transition-transform duration-200"
              title="Logged in practitioner credentials"
            >
              <img
                alt="Registered Medical Nurse In-Charge"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGIBPUQGAtxZvgjY3sMJpDafaIQBaFh61EcRZYnbSbILbg-qgDG6wzBZpvUhtdKImEj-hzML5aD3D_LHRpZfhCr5ujZOhK5b3jITIfQWjS5K8okvgljCQYeP4ZP-xZbcBe6hmrohUnYakrXWPcEtZYl3gjbRqAlHhsI0gL1U8NPu04TmDkeKqUI61I_pDeSJ2sKbEKT53ARq91b0ZmofjazdbFxl4kZJ_Yi_XAan9DJedMlghp3QM0oX4wPFedOCgnkPzHBkk-eg"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
