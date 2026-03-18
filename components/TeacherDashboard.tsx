
import React, { useState, useEffect, useCallback } from 'react';
import { ParkingSlot, SlotStatus, ParkingInsights } from '../types';
import { PARKING_ZONES } from '../constants';
import { Map, TrendingUp, Info, ChevronRight, Bell, Sparkles, Clock, RefreshCcw, LayoutGrid } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { storageService } from '../services/storageService';
import { getParkingInsights } from '../services/geminiService';

const TeacherDashboard: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>(PARKING_ZONES[0].id);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [insights, setInsights] = useState<ParkingInsights | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  const fetchInsights = useCallback(async (currentSlots: ParkingSlot[]) => {
    if (currentSlots.length === 0) return;
    setIsInsightsLoading(true);
    try {
      const data = await getParkingInsights(currentSlots);
      setInsights(data);
    } catch (error) {
      console.error("Insights Error:", error);
    } finally {
      setIsInsightsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      const loadedSlots = await storageService.loadSlots();
      if (loadedSlots) {
        setSlots(loadedSlots);
        fetchInsights(loadedSlots);
      }
    }
    fetchInitialData();

    // Polling as a fallback for "real-time" since WebSocket is not implemented
    const interval = setInterval(fetchInitialData, 30000); // 30s poll

    return () => clearInterval(interval);
  }, [fetchInsights]);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 px-1 md:px-0">
      {/* PREMIUM HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Campus Intelligence
            </h1>
            <p className="text-indigo-100/80 font-medium text-lg max-w-lg">
              Smart parking management powered by real-time tracking and predictive AI.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl self-start md:self-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-yellow-300 animate-pulse" size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">AI Status</p>
              <p className="font-bold text-white uppercase">{isInsightsLoading ? 'Thinking...' : 'Ready'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SMART AI INSIGHTS CARD */}
      <section className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-1 border border-indigo-100 shadow-xl overflow-hidden group">
        <div className="bg-gradient-to-r from-indigo-50/50 to-fuchsia-50/50 p-8 rounded-[2.3rem] md:flex items-stretch gap-10">
          <div className="md:w-1/3 flex flex-col justify-between mb-8 md:mb-0">
            <div>
              <div className="flex items-center gap-3 mb-4 text-indigo-600">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">AI Insights</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Smart analysis of historical data and current levels to predict your best parking options.
              </p>
            </div>
            <button 
              onClick={() => fetchInsights(slots)}
              disabled={isInsightsLoading}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw size={18} className={isInsightsLoading ? 'animate-spin' : ''} />
              Refresh Predictions
            </button>
          </div>

          <div className="md:w-2/3 space-y-4">
            {insights ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2 bg-indigo-600/5 border border-indigo-100 p-6 rounded-[1.8rem]">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Info size={14} /> Current Summary
                  </h3>
                  <p className="text-slate-800 font-medium">{insights.summary}</p>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[1.8rem]">
                  <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">Top Recommendations</h3>
                  <ul className="space-y-3">
                    {insights.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 text-xs md:text-sm text-slate-700 font-bold">
                        <span className="text-emerald-500 flex-shrink-0">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[1.8rem] flex flex-col justify-center">
                  <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock size={14} /> Busy Peak Hours
                  </h3>
                  <p className="text-xl md:text-2xl font-black text-amber-800">{insights.busyHours}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 text-slate-400 bg-white/50 rounded-[1.8rem] border border-dashed border-slate-200">
                <Sparkles size={40} className="mb-4 opacity-20" />
                <p className="font-bold text-sm">Generating insights for you...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK STATUS DASH */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PARKING_ZONES.map(zone => {
          const stats = getZoneAvailability(zone.id);
          const percentage = stats.total === 0 ? 0 : (stats.available / stats.total) * 100;
          const isSelected = activeZone === zone.id;
          
          return (
            <div 
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`group flex flex-col p-5 md:p-6 rounded-[2rem] cursor-pointer transition-all duration-300 hover:shadow-xl ${isSelected ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-slate-100 hover:border-indigo-200 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                  <LayoutGrid size={20} />
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${percentage > 50 ? (isSelected ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600') : (isSelected ? 'bg-white/10' : 'bg-amber-50 text-amber-600')}`}>
                  {stats.available} Available
                </div>
              </div>
              <h3 className="font-black text-lg md:text-xl truncate">{zone.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-700 ${isSelected ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-indigo-500'}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Zone Occupancy: {100 - Math.round(percentage)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CHARTS SECTION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-lg">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <TrendingUp size={24} className="text-indigo-600" />
              Real-time Trends
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
                  />
                  <Bar dataKey="available" radius={[12, 12, 0, 0]} barSize={45}>
                    {chartData.map((_entry, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? '#6366f1' : '#c026d3'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 hover:bg-white hover:border-indigo-600 transition-all cursor-pointer group shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Bell size={28} />
              </div>
              <div>
                <h4 className="font-black text-slate-800">Alert Me</h4>
                <p className="text-sm text-slate-500 font-medium">Notification when spot frees up.</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" size={24} />
          </div>
        </div>

        {/* DETAILED SLOTS SECTION */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {PARKING_ZONES.find(z => z.id === activeZone)?.name} <span className="text-indigo-600">.</span>
              </h2>
              <p className="text-slate-500 font-medium">Interactive status view of individual slots.</p>
            </div>
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-indigo-600 uppercase tracking-widest border border-slate-100 uppercase">Status Map</button>
              <button className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase">History</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {slots.filter(s => s.zone === activeZone).map((slot, index) => {
              const isFree = slot.status === SlotStatus.AVAILABLE;
              return (
                <div 
                  key={slot.id}
                  className={`relative p-6 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:scale-105 hover:shadow-xl active:scale-95 group overflow-hidden ${isFree ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}
                >
                  <div className={`absolute top-0 right-0 w-8 h-8 rounded-bl-2xl flex items-center justify-center text-[10px] font-black ${isFree ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {index + 1}
                  </div>
                  <div className={`p-4 rounded-2xl transition-all duration-500 group-hover:rotate-12 ${isFree ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-100' : 'bg-slate-200 text-slate-400'}`}>
                    <Map size={24} strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-lg tracking-tighter">{slot.number}</span>
                  <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isFree ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {isFree ? 'FREE' : 'BUSY'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-dashed flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Info size={20} />
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Information: Reliability score for this zone is <span className="text-indigo-600 font-black tracking-tight">98.2%</span> based on staff updates.
              </p>
            </div>
            <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline whitespace-nowrap">Report Discrepancy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
