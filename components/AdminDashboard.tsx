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

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (addingSlotToZone && slotInputRef.current) {
      slotInputRef.current.focus();
    }
  }, [addingSlotToZone]);

  /* ---------------- HELPERS ---------------- */
  const getStatusColor = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return 'bg-emerald-100 text-emerald-700';
      case SlotStatus.OCCUPIED:
        return 'bg-rose-100 text-rose-700';
      case SlotStatus.RESERVED:
        return 'bg-amber-100 text-amber-700';
      case SlotStatus.MAINTENANCE:
        return 'bg-slate-100 text-slate-700';
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
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">

      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Admin Control Center
            </h1>
            <p className="text-blue-100 font-bold text-lg">
              Manage parking zones and slots across your campus
            </p>
          </div>
          <div className="hidden md:flex bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <MapPin className="text-white" size={40} />
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <LayoutGrid className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Total Zones</h3>
          </div>
          <p className="text-2xl font-black text-blue-900">{zones.length}</p>
          <p className="text-xs text-slate-600 mt-2">Parking blocks/zones</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Total Slots</h3>
          </div>
          <p className="text-2xl font-black text-emerald-900">{slots.length}</p>
          <p className="text-xs text-slate-600 mt-2">Parking spaces</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest">Availability</h3>
          </div>
          <p className="text-2xl font-black text-orange-900">
            {slots.filter(s => s.status === SlotStatus.AVAILABLE).length}
          </p>
          <p className="text-xs text-slate-600 mt-2">Available now</p>
        </div>
      </div>

      {/* ADD BLOCK BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddingZone(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-200 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase transition-all active:scale-95 shadow-md"
        >
          <Plus size={20} />
          + Add Parking Zone
        </button>
      </div>

      {/* ADD BLOCK FORM */}
      {isAddingZone && (
        <form
          onSubmit={handleAddZoneSubmit}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 flex gap-3 shadow-md"
        >
          <input
            value={newZoneName}
            onChange={e => setNewZoneName(e.target.value)}
            placeholder="Enter zone/block name (e.g., A1, North Block)"
            className="flex-1 px-5 py-3 border-2 border-blue-300 rounded-xl font-bold focus:outline-none focus:border-indigo-500 bg-white"
            autoFocus
          />
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-black text-xs uppercase hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
            <Check size={16} /> Create Zone
          </button>
          <button
            type="button"
            onClick={() => setIsAddingZone(false)}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-black text-xs uppercase transition-all"
          >
            Cancel
          </button>
        </form>
      )}

      {/* ZONES */}
      {zones.map(zone => {
        const zoneSlots = slots.filter(s => s.zone === zone.id);
        const hasActiveReservations = zoneSlots.some(
          s => s.status === SlotStatus.RESERVED || s.status === SlotStatus.OCCUPIED
        );
        const isPendingDelete = pendingDeleteZones.includes(zone.id);

        return (
          <section
            key={zone.id}
            className={`p-4 rounded-xl border space-y-4 ${
              isPendingDelete ? 'bg-rose-50 border-rose-200' : 'bg-white'
            }`}
          >
            {/* ZONE HEADER */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {editingZoneId === zone.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="px-2 py-1 border rounded"
                    />
                    <button onClick={() => saveZoneEdit(zone.id)}>
                      <Check size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-black">{zone.name}</h3>
                    <Edit3
                      size={14}
                      className="cursor-pointer text-slate-400"
                      onClick={() => startEditingZone(zone)}
                    />
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isPendingDelete && (
                  <button
                    onClick={() => handleUndoDeleteZone(zone.id)}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black"
                  >
                    <RotateCcw size={14} /> Undo
                  </button>
                )}

                <button
                  onClick={() => setAddingSlotToZone(zone.id)}
                  disabled={isPendingDelete}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black"
                >
                  <Plus size={14} /> Add Slot
                </button>

                <button
                  onClick={() => handleDeleteZone(zone.id)}
                  disabled={hasActiveReservations || isPendingDelete}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-black disabled:opacity-40"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {/* ADD SLOT INPUT */}
            {addingSlotToZone === zone.id && (
              <div className="flex gap-2">
                <input
                  ref={slotInputRef}
                  value={newSlotNumber}
                  onChange={e => setNewSlotNumber(e.target.value)}
                  placeholder="Slot number"
                  className="flex-1 px-3 py-2 border rounded-xl"
                />
                <button
                  onClick={() => handleSaveSlot(zone.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black"
                >
                  <Check size={14} />
                </button>
              </div>
            )}

            {/* SLOTS */}
            <div className="grid grid-cols-3 gap-4">
              {zoneSlots.map(slot => (
                <div key={slot.id} className="border p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        slot.status
                      )}`}
                    >
                      {slot.status}
                    </span>
                    <button onClick={() => onRemoveSlot(slot.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h4 className="text-2xl font-black">{slot.number}</h4>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() =>
                        onUpdateSlot(slot.id, SlotStatus.AVAILABLE)
                      }
                      className="flex-1 bg-emerald-100 text-xs rounded py-1"
                    >
                      <RefreshCw size={12} /> Clear
                    </button>
                    <button
                      onClick={() =>
                        onUpdateSlot(slot.id, SlotStatus.OCCUPIED)
                      }
                      className="flex-1 bg-rose-100 text-xs rounded py-1"
                    >
                      <XCircle size={12} /> Full
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AdminDashboard;
