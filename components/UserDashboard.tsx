
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Find Your Spot
            </h1>
            <p className="text-emerald-100 font-bold text-lg">
              Real-time parking availability across campus
            </p>
          </div>
          <div className="hidden md:flex bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <Map className="text-white" size={40} />
          </div>
        </div>
      </div>

      {/* RESERVATION STATUS */}
      <div className={`rounded-2xl p-6 border-2 font-bold text-center transition-all ${
        isReservationEnabled
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700'
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-700'
      }`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Bell size={24} />
          <span className="text-xs uppercase tracking-widest">Reservation Status</span>
        </div>
        <p className="text-2xl font-black">{statusMessage}</p>
        <p className="text-xs mt-2 opacity-75">
          {isReservationEnabled ? '✓ You can reserve parking spots now' : 'Reservations are currently unavailable'}
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <Map className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Total Zones</h3>
          </div>
          <p className="text-2xl font-black text-blue-900">{zones.length}</p>
          <p className="text-xs text-slate-600 mt-2">Parking areas available</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Available Now</h3>
          </div>
          <p className="text-2xl font-black text-emerald-900">
            {slots.filter(s => s.status === SlotStatus.AVAILABLE).length}
          </p>
          <p className="text-xs text-slate-600 mt-2">Free parking spots</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest">Occupancy Rate</h3>
          </div>
          <p className="text-2xl font-black text-purple-900">
            {Math.round(((slots.length - slots.filter(s => s.status === SlotStatus.AVAILABLE).length) / slots.length) * 100)}%
          </p>
          <p className="text-xs text-slate-600 mt-2">Campus-wide usage</p>
        </div>
      </div>

      {/* CAMPUS PARKING SECTION */}
      <div className="space-y-6 border-t-2 border-slate-200 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              By Parking Zone
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              View detailed availability for each parking zone on campus. Click on a zone to see individual spots and reserve your parking.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-2xl shadow-sm border-2 border-blue-200 whitespace-nowrap">
            <Clock className="text-indigo-600 flex-shrink-0" size={24} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Current Time</span>
              <span className="text-xl font-black text-indigo-900 tabular-nums leading-tight">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg"></div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg"></div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Reserved</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-slate-400 shadow-lg"></div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Occupied</span>
          </div>
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
