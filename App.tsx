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
import OwnerDashboard from './components/OwnerDashboard';
import Login from './components/Login';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import { storageService } from './services/storageService';
import { useAuth } from './context/AuthContext';


const App: React.FC = () => {
  console.log('API BASE:', import.meta.env.VITE_API_BASE);

  /* ==================== AUTH ==================== */
  const { user, logout, loading } = useAuth();
  const role = user?.role;

  console.log('USER FROM AUTH:', user);
  console.log('ROLE VALUE:', role);
  console.log('ROLE TYPE:', typeof role);
  console.log('EXPECTED OWNER:', UserRole.OWNER);

  const isLoggedIn = !!user;

  /* ==================== STATE (ALL HOOKS FIRST) ==================== */
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
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn]);

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

  /* ==================== BLOCK RENDER UNTIL AUTH READY ==================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  /* ==================== UI ==================== */
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 relative">
      {isLoggedIn && (
        <Sidebar
          role={role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isAuthenticated={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      <div className="flex-1 flex flex-col">
        {isLoggedIn && (
          <Navbar
            notificationCount={notifications.filter(n => !n.read).length}
            onToggleNotifications={() =>
              setIsNotificationsOpen(prev => !prev)
            }
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        )}

        <main className="flex-grow container mx-auto px-4 py-8">
          {!isLoggedIn ? (
            <Login />
          ) : role === UserRole.OWNER ? (
            <OwnerDashboard />
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
