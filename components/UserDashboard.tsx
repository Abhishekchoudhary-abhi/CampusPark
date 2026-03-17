import React, { useState, useEffect } from 'react';
import { ParkingSlot, SlotStatus, ParkingZone } from '../types';
import { Map, Zap, Car, Bike, QrCode, Search, Filter, Bell, Clock, Lock, CheckCircle2, ChevronRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface UserDashboardProps {
  zones: ParkingZone[];
  slots: ParkingSlot[];
  onReserve: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ zones, slots, onReserve }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');

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

  const filteredSlots = slots.filter(s => selectedZone === 'all' || s.zone === selectedZone);
  const totalSlotsCount = filteredSlots.length;
  const availableSlotsCount = filteredSlots.filter(s => s.status === SlotStatus.AVAILABLE).length;
  const occupiedSlotsCount = totalSlotsCount - availableSlotsCount;
  const occupancyPercentage = totalSlotsCount === 0 ? 0 : Math.round((occupiedSlotsCount / totalSlotsCount) * 100);

  const getStatusStyle = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return 'bg-green-500 border-green-600 text-white shadow-green-200';
      case SlotStatus.RESERVED:
        return 'bg-amber-500 border-amber-600 text-white shadow-amber-200';
      case SlotStatus.OCCUPIED:
      default:
        return 'bg-red-500 border-red-600 text-white shadow-red-200';
    }
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (occupancyPercentage / 100) * circumference;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800">
      
      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setSelectedVehicle('car')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${selectedVehicle === 'car' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <Car size={16} /> Car
          </button>
          <button onClick={() => setSelectedVehicle('bike')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${selectedVehicle === 'bike' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <Bike size={16} /> Bike
          </button>
          <button onClick={() => setSelectedVehicle('ev')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${selectedVehicle === 'ev' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <Zap size={16} /> EV
          </button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setSelectedZone('all')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${selectedZone === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            All Zones
          </button>
          {zones.map(z => (
            <button key={z.id} onClick={() => setSelectedZone(z.id)} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${selectedZone === z.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {z.name}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE STATUS SUMMARY */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-red-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-black">{occupancyPercentage}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Busy</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{availableSlotsCount} <span className="text-green-500">Free</span></h2>
            <p className="text-slate-500 font-medium">Out of {totalSlotsCount} total slots</p>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col gap-2">
           <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-bold text-slate-600">Available ({availableSlotsCount})</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-bold text-slate-600">Occupied/Reserved ({occupiedSlotsCount})</span>
          </div>
        </div>
      </div>

      {/* PARKING LOT MAP/GRID */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black">Slot Layout</h3>
          {isReservationEnabled ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Reservations Open</span>
          ) : (
             <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Lock size={12}/> Currently Closed</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredSlots.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="font-bold">No slots found for this filter</p>
            </div>
          ) : (
            filteredSlots.map(slot => {
              const bgClass = getStatusStyle(slot.status);
              const isFree = slot.status === SlotStatus.AVAILABLE;
              
              // We retrieve the zone name for styling, falling back to zone string
              const zoneObj = zones.find(z => z.id === slot.zone);
              const zoneLabel = zoneObj ? zoneObj.name : slot.zone;

              return (
                <div 
                  key={slot.id}
                  onClick={() => {
                    if (isFree && isReservationEnabled) {
                      onReserve(slot.id);
                    }
                  }}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md hover:-translate-y-1 transition-transform cursor-pointer border-b-4 ${bgClass} ${(!isFree || !isReservationEnabled) && 'opacity-90 cursor-not-allowed hover:translate-y-0'}`}
                  style={{ height: '90px' }}
                >
                  <span className="text-[10px] font-black tracking-tighter mix-blend-overlay text-white opacity-80 uppercase text-center truncate w-full">{zoneLabel}</span>
                  <span className="text-xl font-black drop-shadow-md">{slot.number}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* FLOATING ACTION BUTTON */}
      <button className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all z-50 flex items-center justify-center gap-2 group">
        <QrCode size={24} />
        <span className="font-bold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2">Scan QR</span>
      </button>

    </div>
  );
};

export default UserDashboard;
