
import React, { useState, useEffect } from 'react';
import { ParkingSlot, SlotStatus, ParkingZone } from '../types';
import { Map, TrendingUp, Info, ChevronRight, Bell, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface UserDashboardProps {
  zones: ParkingZone[];
  slots: ParkingSlot[];
  onReserve: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ zones, slots, onReserve }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Campus Parking</h2>
          <p className="text-slate-500 font-medium">Full view of all parking zones and real-time availability.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
          <Clock className="text-indigo-600" size={20} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Time</span>
            <span className="text-lg font-black text-slate-800 tabular-nums leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className={`ml-4 px-3 py-1 rounded-full text-[10px] font-black ${isReservationEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {statusMessage}
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase">Available Spot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase">Reserved Spot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase">Occupied Spot</span>
        </div>
      </div>

      {/* Stacked Zones Section */}
      <div className="space-y-12">
        {zones.map(zone => {
          const zoneStats = getZoneAvailability(zone.id);
          const zoneSlots = slots.filter(s => s.zone === zone.id);
          
          return (
            <section key={zone.id} className="space-y-6">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{zone.name}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black px-3 py-1 rounded-lg ${zoneStats.available > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {zoneStats.available} / {zoneStats.total || zoneSlots.length} FREE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {zoneSlots.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest">No slots available in this block</p>
                  </div>
                ) : (
                  zoneSlots.map(slot => {
                    const style = getStatusStyle(slot.status);
                    return (
                      <div 
                        key={slot.id}
                        className={`relative p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:shadow-lg ${style.bg} ${style.text}`}
                      >
                        <Map size={24} className="mt-2 opacity-80" />
                        <span className="text-lg font-black tracking-tighter">{slot.number}</span>
                        <div className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${style.badge}`}>
                          {style.label}
                        </div>
                        
                        {slot.status === SlotStatus.AVAILABLE && (
                          <button 
                            onClick={() => isReservationEnabled && onReserve(slot.id)}
                            disabled={!isReservationEnabled}
                            className={`mt-1 w-full py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 ${
                              isReservationEnabled 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                            }`}
                          >
                            {isReservationEnabled ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                            RESERVE
                          </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 flex items-center gap-3 text-lg">
              <TrendingUp size={22} className="text-indigo-600" />
              Live Availability Trends
            </h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="available" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 3 === 0 ? '#6366f1' : index % 3 === 1 ? '#818cf8' : '#a5b4fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 flex flex-col justify-between hover:bg-indigo-100 transition-all cursor-pointer group shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                <Bell size={28} />
              </div>
              <div>
                <h4 className="font-black text-xl text-slate-800 tracking-tight">Availability Alerts</h4>
                <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">We'll notify you automatically when a spot opens up in your preferred block.</p>
              </div>
            </div>
            <div className="mt-8 flex items-center text-indigo-600 font-black text-sm gap-2">
              CONFIGURE ALERTS <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
