
import React, { useState, useRef, useEffect } from 'react';
import { ParkingSlot, SlotStatus, ParkingZone } from '../types';
import { CheckCircle, XCircle, Clock, Lock, RefreshCw, Plus, Trash2, LayoutGrid, Edit3, Save, X, Check } from 'lucide-react';

interface AdminDashboardProps {
  zones: ParkingZone[];
  slots: ParkingSlot[];
  onUpdateSlot: (id: string, status: SlotStatus) => void;
  onAddSlot: (zoneId: string, number: string) => void;
  onRemoveSlot: (slotId: string) => void;
  onAddZone: (name: string, description: string) => void;
  onUpdateZone: (zoneId: string, name: string, description: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  zones, 
  slots, 
  onUpdateSlot, 
  onAddSlot, 
  onRemoveSlot,
  onAddZone,
  onUpdateZone,
}) => {
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');

  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [addingSlotToZone, setAddingSlotToZone] = useState<string | null>(null);
  const [newSlotNumber, setNewSlotNumber] = useState('');
  const slotInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingSlotToZone && slotInputRef.current) {
      slotInputRef.current.focus();
    }
  }, [addingSlotToZone]);

  const getStatusColor = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case SlotStatus.OCCUPIED: return 'bg-rose-50 text-rose-700 border-rose-100';
      case SlotStatus.RESERVED: return 'bg-amber-50 text-amber-700 border-amber-100';
      case SlotStatus.MAINTENANCE: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusIcon = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE: return <CheckCircle size={14} />;
      case SlotStatus.OCCUPIED: return <XCircle size={14} />;
      case SlotStatus.RESERVED: return <Lock size={14} />;
      case SlotStatus.MAINTENANCE: return <Clock size={14} />;
    }
  };

  const handleStartAddingSlot = (zoneId: string) => {
    setAddingSlotToZone(zoneId);
    setNewSlotNumber('');
  };

  const handleCancelAddingSlot = () => {
    setAddingSlotToZone(null);
    setNewSlotNumber('');
  };

  const handleSaveSlot = (zoneId: string) => {
    if (newSlotNumber.trim()) {
      onAddSlot(zoneId, newSlotNumber.trim());
      setAddingSlotToZone(null);
      setNewSlotNumber('');
    }
  };

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZoneName.trim()) {
      onAddZone(newZoneName.trim(), '');
      setNewZoneName('');
      setIsAddingZone(false);
    }
  };

  const startEditingZone = (zone: ParkingZone) => {
    setEditingZoneId(zone.id);
    setEditName(zone.name);
  };

  const cancelEditingZone = () => {
    setEditingZoneId(null);
  };

  const saveZoneEdit = (zoneId: string) => {
    if (editName.trim()) {
      onUpdateZone(zoneId, editName.trim(), '');
      setEditingZoneId(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Control</h2>
          <p className="text-slate-500 font-medium">Manage blocks, slots, and real-time statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddingZone(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <LayoutGrid size={16} /> Add Block
          </button>
        </div>
      </header>

      {/* Add Zone Form */}
      {isAddingZone && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl animate-in zoom-in-95">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" /> NEW PARKING BLOCK
          </h3>
          <form onSubmit={handleAddZoneSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Block Name</label>
              <input 
                type="text" 
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g. South Campus Lot"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsAddingZone(false)} className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancel</button>
              <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Create Block</button>
            </div>
          </form>
        </div>
      )}

      {/* Zones / Blocks */}
      {zones.map(zone => {
        const zoneSlots = slots.filter(s => s.zone === zone.id);
        const isEditing = editingZoneId === zone.id;
        const isAddingSlot = addingSlotToZone === zone.id;
        
        return (
          <section key={zone.id} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                {isEditing ? (
                  <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1 bg-white border border-indigo-200 rounded-lg text-lg font-black text-slate-800 outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveZoneEdit(zone.id)} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEditingZone} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEditingZone(zone)}>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">{zone.name}</h3>
                      <Edit3 size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleStartAddingSlot(zone.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  isAddingSlot 
                    ? 'bg-indigo-600 text-white border-transparent' 
                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border-transparent hover:border-indigo-100'
                }`}
              >
                <Plus size={14} /> Add Slot
              </button>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {/* Inline Add Slot Input */}
              {isAddingSlot && (
                <div className="bg-indigo-50/50 rounded-3xl p-6 border-2 border-dashed border-indigo-200 flex flex-col justify-between animate-in zoom-in-95 min-h-[180px]">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">New Slot Number</span>
                    <input 
                      ref={slotInputRef}
                      type="text" 
                      value={newSlotNumber}
                      onChange={(e) => setNewSlotNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSlot(zone.id);
                        if (e.key === 'Escape') handleCancelAddingSlot();
                      }}
                      placeholder="e.g. A-107"
                      className="w-full bg-white px-3 py-2 border border-indigo-100 rounded-xl text-lg font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleSaveSlot(zone.id)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button 
                      onClick={handleCancelAddingSlot}
                      className="flex-1 bg-white text-slate-400 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {zoneSlots.length === 0 && !isAddingSlot ? (
                <div className="col-span-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
                  <LayoutGrid size={32} className="opacity-20 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest">No slots in this block yet</p>
                </div>
              ) : (
                zoneSlots.map(slot => (
                  <div 
                    key={slot.id} 
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-lg hover:border-indigo-100 group min-h-[180px]"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusColor(slot.status)}`}>
                          {getStatusIcon(slot.status)}
                          {slot.status}
                        </div>
                        <button 
                          onClick={() => onRemoveSlot(slot.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Remove Slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">{slot.number}</h4>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-50">
                       <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase">
                        Updated {new Date(slot.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => onUpdateSlot(slot.id, SlotStatus.AVAILABLE)}
                          className="px-3 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl hover:bg-emerald-100 transition-colors uppercase flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <RefreshCw size={12} /> Clear
                        </button>
                        <button 
                          onClick={() => onUpdateSlot(slot.id, SlotStatus.OCCUPIED)}
                          className="px-3 py-2 bg-rose-50 text-rose-600 text-[10px] font-black rounded-xl hover:bg-rose-100 transition-colors uppercase flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <XCircle size={12} /> Full
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AdminDashboard;
