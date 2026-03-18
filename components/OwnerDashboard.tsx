
import React, { useState } from 'react';
import AdminList from './owner/AdminList';
import AddAdminModal from './owner/AddAdminModal';
import { Users, Clock, AlertCircle, BarChart3, Calendar, TrendingUp, ShieldAlert, Sparkles, ChevronRight, Activity } from 'lucide-react';

type OwnerTab = 'admins' | 'audit';

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OwnerTab>('admins');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // ✅ NEW: force AdminList refresh
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 px-1 md:px-0">
      {/* PREMIUM HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl w-fit border border-white/10">
              <ShieldAlert size={18} className="text-rose-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 font-black">System Authority</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Owner Panel <span className="text-indigo-400">.</span>
            </h1>
            <p className="text-indigo-50/70 font-medium text-lg max-w-xl">
              High-level administrative oversight and system governance tools.
            </p>
          </div>
          <div className="hidden lg:flex bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-2xl relative group">
            <Users className="text-white group-hover:scale-110 transition-transform duration-700" size={60} />
            <div className="absolute -top-2 -right-2 bg-rose-500 w-6 h-6 rounded-full animate-pulse border-4 border-slate-900"></div>
          </div>
        </div>
      </div>

      {/* SYSTEM HEALTH & STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-[2.2rem] p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Load</p>
              <p className="text-2xl font-black text-slate-800 tracking-tighter">OPTIMAL</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-[2.2rem] p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-6 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Status</p>
              <p className="text-2xl font-black text-slate-800 tracking-tighter">ENFORCED</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-indigo-600 rounded-[2.2rem] p-6 text-white hover:shadow-2xl transition-all shadow-xl group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 text-white rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Active Admins</p>
               <div className="flex items-center justify-between">
                 <p className="text-2xl font-black tracking-tighter">SYSTEM MONITOR</p>
                 <ChevronRight size={20} className="text-indigo-400" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS WITH PREMIUM STYLING */}
      <div className="flex justify-center md:justify-start">
        <div className="bg-slate-100/50 backdrop-blur-md p-1.5 rounded-[1.8rem] flex gap-2 border border-slate-200/50 shadow-sm">
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.4rem] transition-all duration-500 flex items-center gap-3 ${
              activeTab === 'admins'
                ? 'bg-slate-900 text-white shadow-2xl scale-105'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white transition-colors'
            }`}
          >
            <Users size={16} />
            Admin Directory
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.4rem] transition-all duration-500 flex items-center gap-3 ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white shadow-2xl scale-105'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white transition-colors'
            }`}
          >
            <Clock size={16} />
            Audit Ledger
          </button>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="bg-white/40 backdrop-blur-md border border-slate-100 rounded-[3rem] p-1 shadow-2xl overflow-hidden">
        <div className="bg-white rounded-[2.8rem] p-8 md:p-12">
          {activeTab === 'admins' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-100">
                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    Administrative Access
                    <Sparkles size={24} className="text-indigo-500" />
                  </h2>
                  <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                    Manage the specialized team of administrators. Revoke access, promote users, or analyze individual administrative footprint across all modules.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddAdmin(true)}
                  className="px-10 py-5 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-slate-900 hover:to-slate-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-3 shrink-0"
                >
                  <Plus size={18} /> Add New Admin
                </button>
              </div>

              <div className="bg-slate-50/30 rounded-[2.5rem] p-6 border border-slate-50 min-h-[400px]">
                <AdminList key={refreshKey} />
              </div>

              {showAddAdmin && (
                <AddAdminModal
                  onClose={() => {
                    setShowAddAdmin(false);
                    setRefreshKey(k => k + 1);
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="pb-10 border-b border-slate-100">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-4">
                  Immutable Audit Chain
                  <Activity size={24} className="text-rose-500" />
                </h2>
                <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                  Historical analysis of system events. All actions are logged with millisecond precision and authority verification to ensure system integrity.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { user: 'Admin Sarah', action: 'Created Block D', time: '2 mins ago', color: 'indigo' },
                  { user: 'System', action: 'Automated cleanup of expired reservations', time: '14 mins ago', color: 'emerald' },
                  { user: 'Admin Mike', action: 'Modified slot status: A-102 (OCCUPIED)', time: '45 mins ago', color: 'amber' },
                  { user: 'Owner', action: 'Revoked administrative rights for User(0x84f)', time: '3 hours ago', color: 'rose' },
                  { user: 'Admin Sarah', action: 'Generated campus usage report', time: 'Yesterday', color: 'indigo' },
                ].map((log, i) => (
                  <div key={i} className="group relative flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:border-indigo-100 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl bg-${log.color}-50 flex items-center justify-center text-${log.color}-600 border border-${log.color}-100 transition-transform group-hover:rotate-12`}>
                        <Activity size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-slate-800 tracking-tight">{log.user}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Verified</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">{log.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.time}</p>
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[9px] font-black text-indigo-600 hover:underline">View Proof</button>
                      </div>
                    </div>
                  </div>
                ))}

                <button className="w-full py-5 rounded-[2rem] border-2 border-dashed border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all active:scale-98 flex items-center justify-center gap-3">
                  <Activity size={16} />
                  Fetch Historical Deep Logs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder for Plus if missing from local lucide imports
const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default OwnerDashboard;
