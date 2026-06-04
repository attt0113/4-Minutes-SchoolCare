/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, Stethoscope, Pill, Package, FileText, AlertOctagon, Settings, LogOut, Check } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onEmergencyTrigger: () => void;
}

export default function Sidebar({ currentTab, onTabChange, onEmergencyTrigger }: SidebarProps) {
  const menus = [
    { id: 'dashboard', label: 'Health Dashboard', icon: LayoutDashboard },
    { id: 'office_care', label: 'Office Care', icon: Stethoscope },
    { id: 'pharmacy_log', label: 'Pharmacy & Administration', icon: Pill },
    { id: 'storage', label: 'Medicine Storage', icon: Package },
    { id: 'case_records', label: 'Case Records Log', icon: FileText },
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-400 h-screen fixed left-0 top-0 flex flex-col py-8 z-40 border-r border-slate-900 shadow-[10px_0px_30px_rgba(0,0,0,0.25)] font-sans select-none transition-all duration-300">
      {/* Brand Header */}
      <div className="px-8 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-white dark:bg-slate-900 flex items-center justify-center rounded-xl shadow-md cursor-pointer border border-slate-200/20 hover:scale-105 transition-transform" onClick={() => onTabChange('dashboard')}>
            <span className="w-2.5 h-2.5 bg-[#1c6df2] rounded-full"></span>
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-widest uppercase text-white">4 MINUTES</span>
            <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-extrabold leading-none mt-1">SchoolCare Suite</div>
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase opacity-85 px-1 mt-3">
          Authorized Personnel Only
        </p>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 space-y-1 pr-4">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = currentTab === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => onTabChange(menu.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-left rounded-r-xl font-bold relative transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs translate-x-1 pl-7'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40 ml-1'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-indigo-500 rounded-r-md" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-350'}`} />
              <span className="text-sm tracking-tight">{menu.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-5 pt-6 border-t border-slate-900 mt-auto">
        {/* Destroyer EMERGENCY SOS */}
        <button
          onClick={onEmergencyTrigger}
          className="w-full mb-6 py-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-extrabold tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/20 transition-all duration-150 cursor-pointer"
        >
          <AlertOctagon className="w-4.5 h-4.5 animate-pulse" />
          EMERGENCY ALERT SOS
        </button>

        <div className="space-y-1">
          <button 
            onClick={() => onTabChange('dashboard')} 
            className="w-full flex items-center gap-4 text-slate-500 hover:text-white px-6 py-3 transition-colors text-xs font-bold text-left cursor-pointer"
          >
            <Settings className="w-4.5 h-4.5" />
            <span>System Settings</span>
          </button>
          <div className="flex items-center gap-2 px-6 py-2.5 text-xs text-slate-600 font-mono select-all">
            <span>CLINIC_NODE: ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
