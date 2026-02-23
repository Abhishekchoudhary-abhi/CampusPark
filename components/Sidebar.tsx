import React from 'react';
import { UserRole } from '../types';
import { MapPin, ShieldCheck, User, X, LogOut } from 'lucide-react';

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
  const isAdmin =
    role === UserRole.ADMIN || role === UserRole.OWNER;

  return (
    <>
      {/* 🔥 Mobile Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200
          flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Section */}
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100">
              <MapPin className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">
                CampusPark
              </h1>
              <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1 whitespace-nowrap">
                Parking Assistance System
              </span>
            </div>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Portal Section */}
        <div className="p-4 flex-grow flex flex-col gap-4">
          <div className="bg-indigo-600 rounded-3xl p-5 shadow-xl shadow-indigo-100 space-y-4">
            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2 px-1">
              Access Portal
            </p>

            <div className="space-y-2">
              {/* User Portal */}
              <div
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                  !isAdmin
                    ? 'bg-white text-indigo-600 shadow-lg scale-[1.02]'
                    : 'text-indigo-100 opacity-80'
                }`}
              >
                <User size={18} />
                User Portal
              </div>

              {/* Admin Portal */}
              {isAdmin && (
                <div className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-white text-indigo-600 shadow-lg scale-[1.02]">
                  <ShieldCheck size={18} />
                  Admin Portal
                </div>
              )}
            </div>
          </div>

          {/* Logout */}
          {isAuthenticated && (
            <div className="mt-auto pt-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl
                           text-rose-600 bg-rose-50 border border-rose-100
                           font-black text-xs uppercase tracking-widest
                           hover:bg-rose-100 transition-all active:scale-95"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;