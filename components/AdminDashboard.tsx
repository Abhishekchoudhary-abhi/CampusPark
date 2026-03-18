
import React, { useState, useRef, useEffect } from 'react';
import { ParkingSlot, SlotStatus, ParkingZone } from '../types';
import {
  Plus,
  Trash2,
  LayoutGrid,
  Edit3,
  Check,
  RotateCcw,
  RefreshCw,
  XCircle,
  BarChart3,
  MapPin,
  AlertCircle,
  TrendingUp,
  Settings2,
  Layers,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  zones: ParkingZone[];
  slots: ParkingSlot[];
  onUpdateSlot: (id: string, status: SlotStatus) => void;
  onAddSlot: (zoneId: string, number: string) => void;
  onRemoveSlot: (slotId: string) => void;
  onAddZone: (name: string, description: string) => void;
  onUpdateZone: (zoneId: string, name: string, description: string) => void;
  onRemoveZone: (zoneId: string) => void;
  onRestoreZone: (zoneId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  zones,
  slots,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
  onAddZone,
  onUpdateZone,
  onRemoveZone,
  onRestoreZone,
}) => {
  /* ---------------- STATE ---------------- */
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');

  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [addingSlotToZone, setAddingSlotToZone] = useState<string | null>(null);
  const [newSlotNumber, setNewSlotNumber] = useState('');
  const slotInputRef = useRef<HTMLInputElement>(null);

  const [pendingDeleteZones, setPendingDeleteZones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (addingSlotToZone && slotInputRef.current) {
      slotInputRef.current.focus();
    }
  }, [addingSlotToZone]);

  /* ---------------- HELPERS ---------------- */
  const getStatusStyle = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50';
      case SlotStatus.OCCUPIED:
        return 'bg-rose-500/10 text-rose-600 border-rose-200/50';
      case SlotStatus.RESERVED:
        return 'bg-amber-500/10 text-amber-600 border-amber-200/50';
      case SlotStatus.MAINTENANCE:
        return 'bg-slate-500/10 text-slate-600 border-slate-200/50';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  /* ---------------- ZONE ACTIONS ---------------- */
  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    onAddZone(newZoneName.trim(), '');
    setNewZoneName('');
    setIsAddingZone(false);
  };

  const startEditingZone = (zone: ParkingZone) => {
    setEditingZoneId(zone.id);
    setEditName(zone.name);
  };

  const saveZoneEdit = (zoneId: string) => {
    if (!editName.trim()) return;
    onUpdateZone(zoneId, editName.trim(), '');
    setEditingZoneId(null);
  };

  const handleDeleteZone = (zoneId: string) => {
    if (!window.confirm('Block will be soft-deleted. You can undo this.')) return;
    setPendingDeleteZones(prev => [...prev, zoneId]);
    onRemoveZone(zoneId);
  };

  const handleUndoDeleteZone = (zoneId: string) => {
    setPendingDeleteZones(prev => prev.filter(id => id !== zoneId));
    onRestoreZone(zoneId);
  };

  /* ---------------- SLOT ACTIONS ---------------- */
  const handleSaveSlot = (zoneId: string) => {
    if (!newSlotNumber.trim()) return;
    onAddSlot(zoneId, newSlotNumber.trim());
    setNewSlotNumber('');
    setAddingSlotToZone(null);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 px-1 md:px-0">

      {/* PREMIUM HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl w-fit border border-white/20">
              <ShieldCheck size={18} className="text-indigo-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 font-black">Systems Console</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Control Center <span className="text-indigo-300">.</span>
            </h1>
            <p className="text-indigo-50/80 font-medium text-lg max-w-lg">
              Authorized admin dashboard for real-time infrastructure management.
            </p>
          </div>
          <div className="hidden lg:flex bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform duration-500">
            <Settings2 className="text-white relative z-10 group-hover:rotate-90 transition-transform duration-700" size={56} />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* INFRASTRUCTURE OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Blocks</p>
              <p className="text-2xl font-black text-slate-800">{zones.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <LayoutGrid size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Slots</p>
              <p className="text-2xl font-black text-slate-800">{slots.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-slate-100 hover:shadow-xl transition-all shadow-sm group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Utility</p>
              <p className="text-2xl font-black text-slate-800">
                {slots.length > 0 ? Math.round(((slots.length - slots.filter(s => s.status === SlotStatus.AVAILABLE).length) / slots.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-6 text-white hover:shadow-2xl transition-all shadow-xl group cursor-pointer" onClick={() => setIsAddingZone(true)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500 text-white rounded-2xl group-hover:rotate-180 transition-transform duration-500">
              <Plus size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest leading-none mb-1">New Zone</p>
              <p className="text-lg font-black tracking-tight">ADD BLOCK</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="Search zones or specific slot numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-100 focus:border-indigo-400 outline-none rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-sm transition-all shadow-sm focus:shadow-xl"
          />
        </div>
        
        <div className="flex gap-2 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/50 w-full md:w-auto">
          <button className="flex-1 md:px-6 py-2.5 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-slate-100">All Blocks</button>
          <button className="flex-1 md:px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Performance</button>
        </div>
      </div>

      {/* ZONE ADD FORM OVERLAY/INLINE */}
      {isAddingZone && (
        <div className="animate-in slide-in-from-top-4 duration-500 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-3">
             <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2">New Zone Configuration</label>
             <input
              value={newZoneName}
              onChange={e => setNewZoneName(e.target.value)}
              placeholder="Block Name (e.g., North Plaza, A100)"
              className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-black text-slate-800 placeholder:text-slate-300 focus:border-indigo-500 outline-none transition-all shadow-inner"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAddZoneSubmit}
              className="px-8 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Initialize Cluster
            </button>
            <button
              onClick={() => setIsAddingZone(false)}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC ZONE LISTINGS */}
      <div className="space-y-12">
        {zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase())).map(zone => {
          const zoneSlots = slots.filter(s => s.zone === zone.id);
          const isPendingDelete = pendingDeleteZones.includes(zone.id);

          return (
            <div
              key={zone.id}
              className={`group overflow-hidden bg-white rounded-[2.8rem] border-2 transition-all duration-500 ${
                isPendingDelete ? 'border-rose-200 opacity-50 grayscale scale-95' : 'border-slate-50 hover:border-indigo-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] shadow-sm'
              }`}
            >
              {/* GLASSY ZONE HEADER */}
              <div className="px-8 py-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${isPendingDelete ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white group-hover:bg-indigo-600 transition-colors'}`}>
                    {zone.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      {editingZoneId === zone.id ? (
                        <div className="flex gap-2">
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="bg-white px-3 py-1 border-2 border-indigo-400 rounded-lg font-black text-slate-800 outline-none"
                            autoFocus
                          />
                          <button onClick={() => saveZoneEdit(zone.id)} className="p-1 bg-indigo-600 text-white rounded-lg"><Check size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{zone.name}</h3>
                          <button onClick={() => startEditingZone(zone)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                            <Edit3 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Resource Identifier: {zone.id.slice(-8)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isPendingDelete ? (
                    <button
                      onClick={() => handleUndoDeleteZone(zone.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100"
                    >
                      <RotateCcw size={14} /> Restore Control
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setAddingSlotToZone(zone.id)}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        <Plus size={14} /> Add Resource
                      </button>

                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="flex items-center gap-2 px-5 py-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm group/del"
                      >
                        <Trash2 size={14} className="group-hover/del:animate-bounce" /> Decom
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* INLINE RESOURCE ALLOCATION */}
              {addingSlotToZone === zone.id && (
                <div className="mx-8 mt-6 p-6 bg-indigo-50/50 rounded-3xl border-2 border-indigo-100 animate-in fade-in zoom-in-95 duration-300 flex gap-4">
                  <div className="relative flex-1">
                     <input
                      ref={slotInputRef}
                      value={newSlotNumber}
                      onChange={e => setNewSlotNumber(e.target.value)}
                      placeholder="Allocate slot indentifier (e.g. A-12)"
                      className="w-full px-5 py-3 border-2 border-white rounded-xl font-bold bg-white/80 focus:border-indigo-400 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveSlot(zone.id)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all"
                  >
                    Confirm Allocation
                  </button>
                  <button onClick={() => setAddingSlotToZone(null)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase">Abort</button>
                </div>
              )}

              {/* DYNAMIC RESOURCE GRID */}
              <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {zoneSlots.length === 0 ? (
                  <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <AlertCircle size={32} className="mb-2 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No resources detected</p>
                  </div>
                ) : (
                  zoneSlots.map(slot => (
                    <div key={slot.id} className="group/slot flex flex-col bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 transition-all duration-300 rounded-[2rem] p-5 hover:shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-2.5 py-1 text-[8px] font-black rounded-lg border uppercase tracking-[0.15em] ${getStatusStyle(slot.status)}`}>
                          {slot.status}
                        </div>
                        <button 
                          onClick={() => onRemoveSlot(slot.id)}
                          className="p-1.5 text-slate-200 hover:text-rose-500 opacity-0 group-hover/slot:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <h4 className="text-3xl font-black text-slate-800 tracking-tighter mb-6 group-hover/slot:text-indigo-600 transition-colors">{slot.number}</h4>

                      <div className="flex gap-1">
                        <button
                          onClick={() => onUpdateSlot(slot.id, SlotStatus.AVAILABLE)}
                          className="flex-1 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 font-black text-[9px] uppercase tracking-tighter rounded-xl py-2.5 transition-all shadow-sm active:scale-95"
                        >
                          Relase
                        </button>
                        <button
                          onClick={() => onUpdateSlot(slot.id, SlotStatus.OCCUPIED)}
                          className="flex-1 bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-600 font-black text-[9px] uppercase tracking-tighter rounded-xl py-2.5 transition-all shadow-sm active:scale-95"
                        >
                          Fill
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
