/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { MedicationInventory } from '../types';
import { AlertCircle, Plus, Activity, Thermometer, ShieldAlert, BadgeInfo, CheckCircle, PackageSearch, Filter, ExternalLink } from 'lucide-react';

interface MedicineStorageViewProps {
  inventory: MedicationInventory[];
  searchQuery: string;
  onAddStock: (item: MedicationInventory) => void;
  onModifyShortage: (itemId: string, incrementValue: number) => void;
}

export default function MedicineStorageView({
  inventory,
  searchQuery,
  onAddStock,
  onModifyShortage
}: MedicineStorageViewProps) {
  
  // Storage category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // New stock dialog trigger
  const [showAddStockDialog, setShowAddStockDialog] = useState(false);
  
  // Inputs fields form
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'Analgesics' | 'Emergency' | 'Respiratory' | 'Diabetes'>('Analgesics');
  const [newLevel, setNewLevel] = useState<number>(30);
  const [newUnit, setNewUnit] = useState('Units');
  const [newExpiry, setNewExpiry] = useState('Oct 2026');
  const [newDesc, setNewDesc] = useState('First aid clinic medication.');

  // Submit stock form
  const handleSubmitStock = (e: FormEvent) => {
    e.preventDefault();
    onAddStock({
      id: `inv-${Date.now()}`,
      name: newName,
      category: newCat,
      stockLevel: Number(newLevel),
      unit: newUnit,
      status: Number(newLevel) < 10 ? 'Critical Shortage' : Number(newLevel) < 25 ? 'Low Stock' : 'Sufficient',
      expiry: newExpiry,
      description: newDesc,
      percentage: Math.min(100, Math.max(5, Math.round((Number(newLevel) / 120) * 100)))
    });
    setNewName('');
    setNewDesc('');
    setShowAddStockDialog(false);
  };

  // Filter items by search query AND category button
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="font-sans space-y-12 select-none">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mb-1.5 font-mono">Clinic Depot Registry</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Medicine Storage &amp; Inventory</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Real-time surveillance of pharmaceutical stock and regulatory compliance standards.</p>
        </div>
        <button
          onClick={() => setShowAddStockDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-750 hover:scale-[1.01] active:scale-95 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto cursor-pointer font-sans"
        >
          <Plus className="w-5 h-5" />
          Add New Stock
        </button>
      </div>

      {/* Urgent High-Priority Alerts Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-5.5 h-5.5 text-rose-500" />
          <h3 className="font-bold text-lg tracking-tight">High-Priority Alerts</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Epinephrine Urgent Shortage Alert Card */}
          <div className="bg-rose-50/75 dark:bg-rose-955/20 text-rose-950 dark:text-rose-200 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group border border-rose-100 dark:border-rose-950/40">
            <div className="relative z-10">
              <span className="font-extrabold text-[9px] uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-full mb-3 inline-block">
                Critical Shortage
              </span>
              <h4 className="text-xl font-black mb-1">Epinephrine (Adult Dose)</h4>
              <p className="text-xs opacity-85 mb-4 leading-relaxed">
                Stock level has fallen way below the safe emergency line (Min safe cap: 5).
              </p>
              
              <div className="flex items-center gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider opacity-60 font-black">Current Stock</span>
                  <span className="text-3xl font-black text-rose-600">2 Units</span>
                </div>
                <div className="h-8 w-px bg-current opacity-20"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider opacity-60 font-black">Expires</span>
                  <span className="text-sm font-extrabold">12 Dec 2024</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 relative z-10 self-start">
              <button 
                onClick={() => onModifyShortage('inv-1', 10)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4.5 py-2 rounded-xl font-black text-xs shadow-xs hover:opacity-90 cursor-pointer transition-all"
              >
                Refill via Order Desk
              </button>
            </div>
          </div>

          {/* Expiring Soon Alert Card */}
          <div className="bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group border border-slate-200/50 dark:border-slate-800">
            <div className="relative z-10">
              <span className="font-extrabold text-[9px] uppercase tracking-wider bg-slate-600 text-white px-2.5 py-1 rounded-full mb-3 inline-block">
                Expiring Soon
              </span>
              <h4 className="text-xl font-black mb-1 text-slate-800 dark:text-white">Antacid Chewable Tablets</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Lot Batch #BN-4022 expires in less than 30 days. Recommend recycling.
              </p>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider opacity-60 font-black">Current Stock</span>
                  <span className="text-3xl font-black text-slate-800 dark:text-white">112 Units</span>
                </div>
                <div className="h-8 w-px bg-slate-400/30"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider opacity-60 font-black">Expires</span>
                  <span className="text-md font-extrabold text-rose-600">Oct 2024</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 relative z-10 self-start">
              <button 
                onClick={() => onModifyShortage('inv-2', 50)}
                className="bg-indigo-650 hover:bg-indigo-700 text-white px-4.5 py-2 rounded-xl font-black text-xs shadow-xs hover:opacity-90 cursor-pointer transition-all"
              >
                Log Lot Renewal
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main General Inventory Grid catalog */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <PackageSearch className="w-5.5 h-5.5 text-indigo-600" />
            <h3 className="font-bold text-lg tracking-tight">General Dispatch Catalog</h3>
          </div>

          {/* Quick tab filters buttons */}
          <div className="flex items-center gap-1.5 bg-slate-105 dark:bg-slate-950 p-1.5 rounded-full overflow-x-auto no-scrollbar self-start sm:self-auto border border-slate-200/40 dark:border-slate-850">
            {['All', 'Analgesics', 'Emergency', 'Respiratory', 'Diabetes'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:bg-slate-900/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    item.status === 'Sufficient'
                      ? 'bg-teal-50 border-teal-100 text-teal-600' 
                      : item.status === 'Expiring Soon'
                      ? 'bg-slate-50 border-slate-150 text-slate-700 dark:text-slate-300'
                      : 'bg-rose-50 border-rose-100 text-rose-600'
                  }`}>
                    {item.status}
                  </span>
                  
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">{item.category}</span>
                </div>

                <h4 className="text-md font-bold text-slate-800 dark:text-white leading-tight mb-2">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Stock visual progress representation bar */}
              <div className="space-y-3.5 mt-auto">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Stock Level</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">
                    {item.stockLevel} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                  </span>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 bg-opacity-70 rounded-full overflow-hidden border border-slate-200/30">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.stockLevel < 10
                        ? 'bg-rose-600'
                        : item.stockLevel < 30
                        ? 'bg-amber-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, item.percentage))}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1">
                  <span>Expiry Line</span>
                  <span className={`font-mono font-extrabold ${item.status === 'Expiring Soon' || item.status === 'Critical Shortage' ? 'text-rose-600 animate-pulse' : 'text-slate-750 dark:text-slate-200'}`}>
                    {item.expiry}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Aesthetic Scanner Filler button */}
          <div className="border-2 border-dashed border-slate-250 hover:border-indigo-550 hover:bg-slate-50/50 dark:hover:bg-slate-850/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center group cursor-pointer transition-all duration-200 select-all">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:scale-105 flex items-center justify-center mb-4 transition-transform border border-slate-200/50">
              <Plus className="w-6 h-6 text-indigo-600" />
            </div>
            <h5 className="font-extrabold text-xs text-slate-800 dark:text-white tracking-widest uppercase">Quick Barcode scan</h5>
            <p className="text-[11px] text-slate-400 mt-1 select-none">Dispense or add items instantly.</p>
          </div>
        </div>
      </section>

      {/* Warehouse Aesthetic detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 select-none">
        
        {/* Dynamic bar visualization chart */}
        <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 relative overflow-hidden select-none border border-slate-200/50 dark:border-slate-800">
          <div className="relative z-10 max-w-sm">
            <h4 className="font-black text-xl text-slate-800 dark:text-white mb-2 leading-tight">Stock Usage Analytics</h4>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Predictive learning indices indicate a surge in Acetaminophen requirements due to seasonal health trends. We recommend raising safety stock metrics by 15%.
            </p>
            <div className="flex items-end gap-3 h-20">
              <div className="w-8 bg-indigo-600 h-[50%] rounded-t-lg"></div>
              <div className="w-8 bg-indigo-500 h-[35%] rounded-t-lg"></div>
              <div className="w-8 bg-indigo-650 h-[75%] rounded-t-lg shadow-xs"></div>
              <div className="w-8 bg-indigo-700 h-[85%] rounded-t-lg"></div>
              <div className="w-8 bg-emerald-500 h-[65%] rounded-t-lg"></div>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 w-2/5 h-full opacity-35 dark:opacity-20 pointer-events-none">
            <img 
              alt="Medical warehouse bottles details"
              className="object-cover h-full w-full grayscale contrast-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASvm0xuccUlkLuaaY5R0rFzJA8PWx9A3UdGvbCLTSsLpmlT2mA6ChEkqtMoMEehsPGEgB7Ev0D2gS51PzqXtRxJKt7CXFhfU67xDAejSdfgDVvfYhg5WAaaG6bXyemkjvuuRFYuS9aNIgc7XUQmjdi6nFX46oDLyYBKjdXeD9XnFIsoNAfhStPUCYLid9N-Z8aL1nlpeNC7eolpmpGVbrZuMjcxlXVq-IdInP6OumfU_R4m_I_D9WWee2e0b5k9iT4BisHcXlh2Q"
            />
          </div>
        </div>

        {/* Ambient warehouse temperature parameters */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 flex flex-col justify-between select-none border border-slate-200/40 dark:border-slate-750">
          <div>
            <Thermometer className="w-9 h-9 text-indigo-600 mb-4" />
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Depot Conditions</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Ambient temperature and relative moisture coordinates within legal pediatric medication protection laws.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2 font-mono">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">Cabin Temp:</span>
              <span className="text-emerald-600 font-black">22.4°C</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">Moisture:</span>
              <span className="text-slate-800 dark:text-slate-100 font-black">42%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add stock Dialog popup */}
      {showAddStockDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Refill / Add New Pharmaceutical Item</h3>
            <p className="text-xs text-slate-500 mb-6">Create or restock medication profiles, updating coordinates immediately.</p>

            <form onSubmit={handleSubmitStock} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Trade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advil Liquigel, EpiPen"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold select-none focus:ring-2 focus:ring-indigo-500/15 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  >
                    <option value="Analgesics">Analgesics</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Diabetes">Diabetes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Expiry Line</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 2026"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Dispensing metric unit</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Description details</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/15 outline-none h-20 resize-none animate-none"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end select-none">
                <button
                  type="button"
                  onClick={() => setShowAddStockDialog(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
