import React from 'react';
import { Bell, Menu, MapPin } from 'lucide-react';

interface NavbarProps {
  notificationCount: number;
  onToggleNotifications: () => void;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  notificationCount,
  onToggleNotifications,
  onToggleSidebar,
}) => {
  return (
    <nav
      className="
        bg-white border-b border-slate-100 h-16
        sticky top-0 z-50
        px-4 md:px-6
        flex items-center justify-between
        pointer-events-auto
      "
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <MapPin className="text-white" size={14} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-sm text-slate-800 tracking-tight leading-none">
              CampusPark
            </h1>
            <span className="text-[6px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">
              Parking Assistance System
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onToggleNotifications}
        className="
          relative p-2.5
          text-slate-500 hover:bg-slate-50
          rounded-xl transition-all
        "
        aria-label="Toggle notifications"
      >
        <Bell size={20} />

        {notificationCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[18px] h-[18px]
              bg-rose-500 text-white
              text-[9px] font-black
              flex items-center justify-center
              rounded-full
              border-2 border-white
              shadow-sm
            "
          >
            {notificationCount}
          </span>
        )}
      </button>
    </nav>
  );
};

export default Navbar;