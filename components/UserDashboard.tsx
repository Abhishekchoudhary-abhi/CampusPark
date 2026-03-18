
import React, { useState, useEffect, useCallback } from 'react';
import { ParkingSlot, SlotStatus, ParkingZone, ParkingInsights } from '../types';
import { Map, TrendingUp, Info, ChevronRight, Bell, Clock, Lock, CheckCircle2, Sparkles, RefreshCcw, LayoutGrid } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getParkingInsights } from '../services/geminiService';

interface UserDashboardProps {
  zones: ParkingZone[];
  slots: ParkingSlot[];
  onReserve: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ zones, slots, onReserve }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [insights, setInsights] = useState<ParkingInsights | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    if (slots.length === 0) return;
    setIsInsightsLoading(true);
    try {
      const data = await getParkingInsights(slots);
      setInsights(data);
    } catch (error) {
      console.error("Insights Error:", error);
    } finally {
      setIsInsightsLoading(false);
    }
  }, [slots]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchInsights();
    return () => clearInterval(timer);
  }, [fetchInsights]);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const totalMinutes = currentHour * 60 + currentMinute;
  
  const startMinutes = 8 * 60 + 45; // 08:45 AM
  const endMinutes = 16 * 60 + 30;  // 04:30 PM (16:30)

  const isReservationEnabled = totalMinutes >= startMinutes && totalMinutes < endMinutes;

  let statusMessage = 'RESERVATIONS OPEN';
  if (totalMinutes < startMinutes) {
    statusMessage = 'OPENS AT 08:45 AM';
  } else if (totalMinutes >= endMinutes) {
    statusMessage = 'CLOSED FOR TODAY';
  }

  const getZoneAvailability = (zoneId: string) => {
    const zoneSlots = slots.filter(s => s.zone === zoneId);
    const available = zoneSlots.filter(s => s.status === SlotStatus.AVAILABLE).length;
    return { available, total: zoneSlots.length };
  };

  const chartData = zones.map(z => {
    const stats = getZoneAvailability(z.id);
    return {
      name: z.name,
      available: stats.available,
      occupied: stats.total - stats.available,
    };
  });

  const getStatusStyle = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-700',
          badge: 'bg-emerald-600 text-white',
          label: 'FREE'
        };
      case SlotStatus.RESERVED:
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-700',
          badge: 'bg-amber-600 text-white',
          label: 'RESERVED'
        };
      case SlotStatus.OCCUPIED:
      default:
        return {
          bg: 'bg-slate-50 border-slate-200',
          text: 'text-slate-400',
          badge: 'bg-slate-300 text-slate-600',
          label: 'OCCUPIED'
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 px-1 md:px-0">
      {/* HERO HEADER - PREMIUM GRADIENT */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-emerald-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Spot Finder <span className="text-emerald-200">.</span>
            </h1>
            <p className="text-emerald-50/90 font-medium text-lg max-w-lg">
              Check real-time availability and reserve your spot instantly.
            </p>
          </div>
          <div className="hidden lg:flex bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem]">
            <Map className="text-white" size={48} />
          </div>
        </div>
      </div>

      {/* AI INSIGHTS GLASSMORPHISM CARD */}
      <section className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-1 border border-emerald-100 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-6 md:p-10 rounded-[2.3rem] flex flex-col md:flex-row items-stretch gap-8">
          <div className="md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-emerald-700">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Smart Info</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Our AI analyzes campus patterns to tell you the best time and place to park today.
              </p>
            </div>
            <button 
              onClick={fetchInsights}
              disabled={isInsightsLoading}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-4 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw size={16} className={isInsightsLoading ? 'animate-spin' : ''} />
              Update Insights
            </button>
          </div>

          <div className="md:w-2/3">
            {insights ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="md:col-span-2 bg-white/60 border border-emerald-100 p-6 rounded-[1.8rem]">
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Info size={14} /> AI Summary
                  </h3>
                  <p className="text-slate-800 font-bold italic leading-relaxed">"{insights.summary}"</p>
                </div>
                
                <div className="bg-white/60 border border-emerald-100 p-6 rounded-[1.8rem]">
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Top Safety Tips</h3>
                  <ul className="space-y-3">
                    {insights.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-700 font-black">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-600 text-white p-6 rounded-[1.8rem] flex flex-col justify-center shadow-lg shadow-indigo-100">
                  <h3 className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Clock size={14} /> Predicted Peak
                  </h3>
                  <p className="text-2xl font-black">{insights.busyHours}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 text-slate-400 bg-white/30 rounded-[1.8rem] border border-dashed border-emerald-200">
                <Sparkles size={40} className="mb-4 opacity-10" />
                <p className="font-black text-xs uppercase tracking-widest text-emerald-800/40">Analyzing Patterns...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS & STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-3xl p-8 border-2 shadow-sm transition-all flex flex-col justify-center items-center text-center ${
          isReservationEnabled
            ? 'bg-white border-emerald-100 text-emerald-700'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
            <Bell size={32} className={isReservationEnabled ? 'animate-bounce' : ''} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-1">Status</p>
          <h3 className="text-3xl font-black tracking-tighter mb-2">{statusMessage}</h3>
          <p className="text-xs font-bold opacity-75">
            {isReservationEnabled ? '✓ Bookings are live' : 'Reservations active 08:45 - 16:30'}
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Map size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                <p className="text-2xl font-black text-slate-800">{Math.round(((slots.length - slots.filter(s => s.status === SlotStatus.AVAILABLE).length) / slots.length) * 100)}%</p>
              </div>
            </div>
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000" 
                style={{ width: `${Math.round(((slots.length - slots.filter(s => s.status === SlotStatus.AVAILABLE).length) / slots.length) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm flex flex-col justify-center">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Free Spots</p>
                <p className="text-4xl font-black text-emerald-600">{slots.filter(s => s.status === SlotStatus.AVAILABLE).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAMPUS PARKING SECTION */}
      <div className="space-y-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Parking Blocks <span className="text-indigo-600">.</span></h2>
            <p className="text-slate-500 font-medium">Select a block to view and reserve individual slots.</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 self-start">
             <Clock className="text-indigo-600" size={24} />
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Time</span>
               <span className="text-xl font-black text-slate-800 tabular-nums">
                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* Stacked Zones Section */}
      <div className="space-y-12">
        {zones.length === 0 ? (
          <div className="py-20 text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-200">
            <LayoutGrid size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No parking zones detected in the system.</p>
            <p className="text-xs text-slate-300 mt-2 font-black uppercase tracking-widest">Awaiting Infrastructure Sync...</p>
          </div>
        ) : zones.map(zone => {
          const zoneStats = getZoneAvailability(zone.id);
          const zoneSlots = slots.filter(s => s.zone === zone.id);
          
          return (
            <section key={zone.id} className="space-y-8">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                    {zone.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">{zone.name}</h3>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${zoneStats.available > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {zoneStats.available} / {zoneStats.total} Spaces Free
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {zoneSlots.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Initialising Zone Data...</p>
                  </div>
                ) : (
                  zoneSlots.map(slot => {
                    const style = getStatusStyle(slot.status);
                    const isAvailable = slot.status === SlotStatus.AVAILABLE;
                    
                    return (
                      <div 
                        key={slot.id}
                        className={`group relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center justify-center gap-4 hover:shadow-2xl hover:-translate-y-2 active:scale-95 overflow-hidden ${style.bg} ${style.text}`}
                      >
                        <div className={`absolute top-0 right-0 w-8 h-8 rounded-bl-2xl flex items-center justify-center text-[10px] font-black ${isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                          {slot.number.split('-')[1] || '#'}
                        </div>
                        
                        <div className={`p-4 rounded-2xl transition-all duration-700 group-hover:rotate-12 ${isAvailable ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-100' : 'bg-slate-200 text-slate-400'}`}>
                          <Map size={24} strokeWidth={2.5} />
                        </div>
                        
                        <span className="text-xl font-black tracking-tighter">{slot.number}</span>
                        
                        {isAvailable ? (
                          <button 
                            onClick={() => isReservationEnabled && onReserve(slot.id)}
                            disabled={!isReservationEnabled}
                            className={`w-full py-3 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                              isReservationEnabled 
                                ? 'bg-indigo-600 text-white hover:bg-slate-900 shadow-lg shadow-indigo-100 active:scale-90' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isReservationEnabled ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                            {isReservationEnabled ? 'BOOK NOW' : 'LOCKED'}
                          </button>
                        ) : (
                          <div className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${style.badge}`}>
                            {style.label}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* TREND CHATS SECTION */}
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl mt-12">
        <div className="flex items-center justify-between mb-12">
           <div>
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <TrendingUp size={28} className="text-indigo-600" />
              Occupancy Comparison
            </h3>
            <p className="text-slate-500 font-medium">Visual breakdown by parking zone.</p>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="available" radius={[12, 12, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#14b8a6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
