import React, { useState, useEffect } from 'react';
import { ParkingSlot, SlotStatus } from '../types';
import { PARKING_ZONES } from '../constants';
import { Map, TrendingUp, Info, ChevronRight, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { storageService } from '../services/storageService';  // Firestore integration

const TeacherDashboard: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>(PARKING_ZONES[0].id);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);

  useEffect(() => {
    // Initial fetch
    async function fetchSlots() {
      const loadedSlots = await storageService.loadSlots();
      if (loadedSlots) setSlots(loadedSlots);
    }
    fetchSlots();

    // Subscribe to real-time updates from Firestore
    const unsubscribe = storageService.subscribeToSlots(setSlots);

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const getZoneAvailability = (zoneId: string) => {
    const zoneSlots = slots.filter(s => s.zone === zoneId);
    const available = zoneSlots.filter(s => s.status === SlotStatus.AVAILABLE).length;
    return { available, total: zoneSlots.length };
  };

  const chartData = PARKING_ZONES.map(z => {
    const stats = getZoneAvailability(z.id);
    return {
      name: z.name,
      available: stats.available,
      occupied: stats.total - stats.available,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Campus Overview</h2>
            <p className="text-slate-500">Real-time parking availability for campus users.</p>
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PARKING_ZONES.map(zone => {
          const stats = getZoneAvailability(zone.id);
          const percentage = stats.total === 0 ? 0 : (stats.available / stats.total) * 100;
          return (
            <div 
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`bg-white rounded-3xl p-6 shadow-sm border transition-all cursor-pointer hover:shadow-xl hover:translate-y-[-4px] ${activeZone === zone.id ? 'border-indigo-600 ring-2 ring-indigo-50' : 'border-slate-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeZone === zone.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Map size={24} />
                </div>
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${percentage > 50 ? 'bg-emerald-50 text-emerald-600' : percentage > 20 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                   {stats.available} Free
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{zone.name}</h3>
              
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-400">AVAILABILITY</span>
                  <span className="text-indigo-600">{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Stats and Trends */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Zone Comparison
              </h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="available" radius={[4, 4, 0, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#818cf8' : '#a5b4fc'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex items-center justify-between hover:bg-indigo-100 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Bell size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Set Availability Alert</h4>
                <p className="text-xs text-slate-500">Notify me when a spot becomes free.</p>
              </div>
            </div>
            <ChevronRight className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Right Col: Detailed View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{PARKING_ZONES.find(z => z.id === activeZone)?.name}</h3>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Available</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Occupied</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {slots.filter(s => s.zone === activeZone).map(slot => (
                <div 
                  key={slot.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group hover:scale-105 ${
                    slot.status === SlotStatus.AVAILABLE 
                      ? 'bg-emerald-50/30 border-emerald-100 text-emerald-700 shadow-sm shadow-emerald-50' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 opacity-80'
                  }`}
                >
                  <span className="text-xs font-black opacity-40 absolute top-3 left-3 tracking-tighter uppercase">{slot.number.split('-')[1]}</span>
                  <div className={`p-2 rounded-lg ${slot.status === SlotStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Map size={24} />
                  </div>
                  <span className="text-lg font-bold">{slot.number}</span>
                  <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${slot.status === SlotStatus.AVAILABLE ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {slot.status === SlotStatus.AVAILABLE ? 'FREE' : 'BUSY'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-4 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">Information:</span> This data is manually updated by security staff.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
