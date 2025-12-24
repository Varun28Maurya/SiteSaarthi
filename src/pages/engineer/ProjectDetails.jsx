import React, { useState, useEffect } from 'react';
import { 
  Home, CheckCircle2, Truck, MessageSquare, Camera, 
  MapPin, AlertTriangle, Plus, ChevronRight, X, 
  Send, FileText, Navigation, Check, WifiOff
} from 'lucide-react';

const INITIAL_TASKS = [
  { id: 't1', title: 'Column Casting - 4th Floor', status: 'In Progress', priority: 'High', deadline: 'Today' },
  { id: 't2', title: 'Electrical Conduit Layout', status: 'Pending', priority: 'Medium', deadline: 'Today' },
  { id: 't3', title: 'Plastering - Wing A', status: 'Pending', priority: 'Low', deadline: 'Tomorrow' }
];

export default function EngineerProjectDetails() {
  const [activeTab, setActiveTab] = useState('home');
  const [attendance, setAttendance] = useState({ self: false, workers: 18 });
  const [dprSubmitted, setDprSubmitted] = useState(false);
  const [showDprModal, setShowDprModal] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
    { id: 'materials', icon: Truck, label: 'Materials' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Attendance & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400">Attendance</h3>
                  <div className="flex flex-col xs:flex-row gap-4">
                    <button 
                      onClick={() => setAttendance({...attendance, self: !attendance.self})}
                      className={`flex-1 p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${attendance.self ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                    >
                      <CheckCircle2 size={28} />
                      <span className="text-xs font-black uppercase">Self Check-in</span>
                    </button>
                    <div className="flex-1 p-5 rounded-2xl bg-[#0B3C5D] text-white flex flex-col items-center justify-center">
                       <span className="text-3xl font-black">{attendance.workers}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Workers</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3 pt-4 border-t md:border-t-0 md:pt-0">
                   <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                      <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                      <p className="text-[10px] font-bold text-orange-800 uppercase leading-tight">
                        {!attendance.self ? "Mark attendance to unlock DPR" : "Attendance logged. DPR ready."}
                      </p>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                     <Navigation size={12} className="text-blue-500" />
                     GPS Verified: <span className="text-emerald-600">Site-In</span>
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-center">
                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-2xl font-black text-blue-700">3</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase">Tasks</p>
                   </div>
                   <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-2xl font-black text-amber-700">2</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase">Materials</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-gradient-to-br from-[#0B3C5D] to-[#07243b] rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-lg font-black uppercase">Daily Site Report</h3>
                  <p className="text-xs text-slate-400 mt-1">Submit today's progress & photos</p>
                  <button 
                    disabled={!attendance.self || dprSubmitted}
                    onClick={() => setShowDprModal(true)}
                    className={`mt-6 w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest ${dprSubmitted ? 'bg-emerald-500' : 'bg-orange-500 shadow-lg active:scale-95'}`}
                  >
                    {dprSubmitted ? 'Report Submitted' : 'Start DPR Entry'}
                  </button>
               </div>
               <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-center">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2">Inventory</h3>
                  <button className="w-full py-4 rounded-xl bg-slate-100 text-[#0B3C5D] font-black text-xs uppercase border border-slate-200 flex items-center justify-center gap-2">
                    <Plus size={16} /> Raise Material Request
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 md:hidden flex items-center justify-around z-50 px-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 flex-1 ${activeTab === item.id ? 'text-orange-500' : 'text-slate-300'}`}
          >
            <item.icon size={20} />
            <span className="text-[9px] font-black uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}