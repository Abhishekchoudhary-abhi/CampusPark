import React, { useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  ParkingSlot,
  SlotStatus,
  Notification,
  ParkingZone,
} from './types';

import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AdminLogin from "./components/Login";

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import { storageService } from './services/storageService';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  console.log('API BASE:', import.meta.env.VITE_API_BASE);

  /* ==================== AUTH ==================== */
  const { user, logout } = useAuth();

  // ✅ Role always from backend auth
  const role: UserRole = user?.role ?? UserRole.TEACHER;

  /* ==================== DATA ==================== */
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ==================== LOAD DATA ==================== */
  const loadAllData = async () => {
    const [z, s] = await Promise.all([
      storageService.loadZones(),
      storageService.loadSlots(),
    ]);
    setZones(z);
    setSlots(s);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  /* ==================== LOGOUT ==================== */
  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  /* ==================== SLOT ACTIONS ==================== */
  const updateSlotStatus = useCallback(
    async (slotId: string, newStatus: SlotStatus) => {
      const slot = slots.find(s => s.id === slotId);
      if (!slot) return;

      await storageService.updateSlot(slotId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      if (
        slot.status === SlotStatus.OCCUPIED &&
        newStatus === SlotStatus.AVAILABLE
      ) {
        const zoneName =
          zones.find(z => z.id === slot.zone)?.name || 'Campus';

        setNotifications(n => [
          {
            id: crypto.randomUUID(),
            title: 'Parking Spot Free!',
            message: `Slot ${slot.number} in ${zoneName} is now available.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: 'success',
            read: false,
          },
          ...n,
        ]);
      }

      loadAllData();
    },
    [slots, zones]
  );

  const addSlot = useCallback(async (zoneId: string, number: string) => {
    await storageService.addSlot({
      id: '',
      number,
      zone: zoneId,
      status: SlotStatus.AVAILABLE,
      updatedAt: new Date().toISOString(),
    });
    loadAllData();
  }, []);

  const removeSlot = useCallback(async (slotId: string) => {
    await storageService.deleteSlot(slotId);
    loadAllData();
  }, []);

  /* ==================== ZONE ACTIONS ==================== */
  const addZone = useCallback(async (name: string, description: string) => {
    await storageService.addZone({
      id: '',
      name,
      description,
      totalSlots: 0,
    });
    loadAllData();
  }, []);

  const updateZone = useCallback(
    async (zoneId: string, name: string, description: string) => {
      await storageService.updateZone(zoneId, { name, description });
      loadAllData();
    },
    []
  );

  const removeZone = useCallback(async (zoneId: string) => {
    await storageService.deleteZone(zoneId);

    setNotifications(n => [
      {
        id: crypto.randomUUID(),
        title: 'Block deleted',
        message: 'Click Undo to restore this block',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'warning',
        read: false,
        actionZoneId: zoneId,
      },
      ...n,
    ]);

    loadAllData();
  }, []);

  const restoreZone = useCallback(async (zoneId: string) => {
    await storageService.restoreZone(zoneId);
    loadAllData();
  }, []);

  /* ==================== USER ==================== */
  const reserveSlot = useCallback(
    (slotId: string) => updateSlotStatus(slotId, SlotStatus.RESERVED),
    [updateSlotStatus]
  );

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  /* ==================== UI ==================== */
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 relative">
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isAdminAuthenticated={user?.role === UserRole.ADMIN}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          notificationCount={notifications.filter(n => !n.read).length}
          onToggleNotifications={() =>
            setIsNotificationsOpen(prev => !prev)
          }
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* 🔔 NOTIFICATIONS */}
        {isNotificationsOpen && (
          <div className="fixed top-16 right-4 z-[9999] w-80 max-h-[70vh] bg-white shadow-2xl rounded-2xl border overflow-y-auto">
            <div className="p-4 border-b flex justify-between">
              <h3 className="font-black text-sm">Notifications</h3>
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-indigo-600 font-bold"
              >
                Clear
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3 border-b cursor-pointer ${
                    n.read ? 'opacity-60' : 'bg-indigo-50'
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <strong className="text-xs block">{n.title}</strong>
                  <p className="text-xs text-slate-600">{n.message}</p>

                  {n.actionZoneId && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        restoreZone(n.actionZoneId);
                        markAsRead(n.id);
                      }}
                      className="mt-2 text-xs text-emerald-600 font-bold"
                    >
                      Undo
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <main className="flex-grow container mx-auto px-4 py-8">
          {/* 🔐 AUTH GATE */}
          {!user ? (
            <AdminLogin />
          ) : role === UserRole.ADMIN ? (
            <AdminDashboard
              zones={zones}
              slots={slots}
              onUpdateSlot={updateSlotStatus}
              onAddSlot={addSlot}
              onRemoveSlot={removeSlot}
              onAddZone={addZone}
              onUpdateZone={updateZone}
              onRemoveZone={removeZone}
              onRestoreZone={restoreZone}
            />
          ) : (
            <UserDashboard
              zones={zones}
              slots={slots}
              onReserve={reserveSlot}
            />
          )}
        </main>

        <footer className="py-6 text-center text-xs text-slate-400">
          © 2026 CampusPark
        </footer>
      </div>
    </div>
  );
};

export default App;
