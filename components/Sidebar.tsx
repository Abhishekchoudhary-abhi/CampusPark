
import React from 'react';
import { UserRole } from '../types';
import { MapPin, ShieldCheck, User, X, LogOut, ChevronRight, LayoutDashboard, Sparkles } from 'lucide-react';

interface SidebarProps {
  role: UserRole | undefined;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  role,
  isOpen,
  onClose,
  isAuthenticated,
  onLogout,
}) => {
  const isAdmin = role === UserRole.ADMIN || role === UserRole.OWNER;

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-80 bg-white border-r border-slate-100 flex flex-col h-screen transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:sticky md:top-0 md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* BRAND SECTION */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
              <MapPin className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-2xl text-slate-800 tracking-tighter leading-none">
                CampusPark<span className="text-indigo-600">.</span>
              </h1>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 whitespace-nowrap">
                Next-Gen Parking Control
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 md:hidden bg-slate-50 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="flex-grow px-6 py-4 space-y-10 overflow-y-auto">
          {/* MAIN ACCESS SECTION */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management Portal</span>
               <Sparkles size={12} className="text-indigo-400" />
             </div>
             
             <div className="bg-slate-50/50 rounded-[2rem] p-2 border border-slate-100">
                {/* Dashboard / User View */}
                <button 
                   className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                     !isAdmin 
                     ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-50/50 translate-x-1' 
                     : 'text-slate-500 hover:bg-white hover:text-indigo-500'
                   }`}
                >
                  <div className="flex items-center gap-4">
                    <LayoutDashboard size={20} className={!isAdmin ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className="font-black text-sm uppercase tracking-widest">Dash Overview</span>
                  </div>
                  {!isAdmin && <ChevronRight size={16} />}
                </button>

                {/* Admin Portal (Conditional) */}
                {isAdmin && (
                  <button 
                    className="w-full mt-1 flex items-center justify-between px-5 py-4 rounded-2xl bg-white text-indigo-600 shadow-lg shadow-indigo-50/50 translate-x-1 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={20} className="text-indigo-600" />
                      <span className="font-black text-sm uppercase tracking-widest">Admin Control</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                )}
             </div>
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="space-y-4">
             <span className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preferences</span>
             <div className="space-y-1">
                <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors font-bold text-sm">
                  <User size={18} /> Profile Settings
                </button>
             </div>
          </div>
        </div>

        {/* FOOTER SECTION / LOGOUT */}
        {isAuthenticated && (
          <div className="p-6 mt-auto border-t border-slate-50 bg-slate-50/20">
            <button
              onClick={onLogout}
              className="group w-full flex items-center justify-center gap-4 px-6 py-5 rounded-[1.8rem] bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300 active:scale-95 shadow-sm hover:shadow-xl hover:shadow-rose-100"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Terminate Session</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;