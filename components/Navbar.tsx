
import React from 'react';
import { Bell, Menu, MapPin, Sparkles } from 'lucide-react';

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
        bg-white/70 backdrop-blur-xl border-b border-white/20 h-20
        sticky top-0 z-50
        px-6 md:px-10
        flex items-center justify-between
        transition-all duration-300
        shadow-[0_4px_30px_rgba(0,0,0,0.03)]
      "
    >
      <div className="flex items-center gap-5">
        <button
          onClick={onToggleSidebar}
          className="p-3 text-slate-600 hover:bg-slate-100/50 rounded-2xl transition-all md:hidden active:scale-90"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-3 md:hidden group cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">
            <MapPin className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-lg text-slate-800 tracking-tight leading-none">
              CampusPark <span className="text-indigo-600">.</span>
            </h1>
            <div className="flex items-center gap-1 mt-1">
               <Sparkles size={8} className="text-indigo-500 animate-pulse" />
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                 AI Powered Assistant
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* ACTION BUTTONS (Optional space for more) */}
        
        <button
          onClick={onToggleNotifications}
          className="
            relative p-3
            text-slate-600 hover:bg-slate-100/50
            rounded-2xl transition-all active:scale-95
            group
          "
          aria-label="Toggle notifications"
        >
          <Bell size={24} className="group-hover:rotate-12 transition-transform" />

          {notificationCount > 0 && (
            <span
              className="
                absolute top-2 right-2
                min-w-[20px] h-[20px]
                bg-rose-500 text-white
                text-[10px] font-black
                flex items-center justify-center
                rounded-full
                border-2 border-white
                shadow-xl
                animate-in zoom-in-50 duration-300
              "
            >
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;