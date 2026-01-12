import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, ParkingSlot, SlotStatus, Notification, ParkingZone } from './types';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { storageService } from './services/storageService';
import { Bell } from 'lucide-react';

const App: React.FC = () => {
  console.log('API BASE:', import.meta.env.VITE_API_BASE);

  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* -------------------- LOAD DATA (MongoDB) -------------------- */
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

  /* -------------------- HANDLERS -------------------- */
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsSidebarOpen(false);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setRole(UserRole.TEACHER);
    setIsSidebarOpen(false);
  };

  const updateSlotStatus = useCallback(
    async (slotId: string, newStatus: SlotStatus) => {
      const slot = slots.find(s => s.id === slotId);
      if (!slot) return;

      await storageService.updateSlot(slotId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      if (slot.status === SlotStatus.OCCUPIED && newStatus === SlotStatus.AVAILABLE) {
        const zoneName = zones.find(z => z.id === slot.zone)?.name || 'Campus';

        setNotifications(n => [
          {
            id: Math.random().toString(36).slice(2),
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

  const addZone = useCallback(async (name: string, description: string) => {
    await storageService.addZone({ id: '', name, description, totalSlots: 0 });
    loadAllData();
  }, []);

  const updateZone = useCallback(async (zoneId: string, name: string, description: string) => {
    await storageService.addZone({ id: zoneId, name, description, totalSlots: 0 });
    loadAllData();
  }, []);

  const reserveSlot = useCallback(
    (slotId: string) => updateSlotStatus(slotId, SlotStatus.RESERVED),
    [updateSlotStatus]
  );

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  /* -------------------- UI -------------------- */
  return (
   <div className="min-h-screen flex bg-slate-50 overflow-x-hidden overflow-y-auto text-slate-900 relative">

      <Sidebar
        role={role}
        setRole={handleRoleChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogout={handleAdminLogout}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <Navbar
          notificationCount={notifications.filter(n => !n.read).length}
          onToggleNotifications={() => setIsNotificationsOpen(o => !o)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
          {isNotificationsOpen && (
           <div className="absolute top-16 right-4 w-80 max-h-[70vh] bg-white shadow-xl rounded-2xl z-50 overflow-y-auto">

              <div className="p-4 border-b flex justify-between">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-indigo-600"
                >
                  Clear
                </button>
              </div>
              <div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <Bell className="mx-auto mb-2 opacity-30" />
                    No alerts
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 border-b cursor-pointer ${
                        n.read ? 'opacity-60' : 'bg-indigo-50'
                      }`}
                    >
                      <strong className="text-xs">{n.title}</strong>
                      <p className="text-xs text-slate-600">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {role === UserRole.ADMIN ? (
            isAdminAuthenticated ? (
              <AdminDashboard
                zones={zones}
                slots={slots}
                onUpdateSlot={updateSlotStatus}
                onAddSlot={addSlot}
                onRemoveSlot={removeSlot}
                onAddZone={addZone}
                onUpdateZone={updateZone}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={() => setIsAdminAuthenticated(true)}
                onCancel={() => handleRoleChange(UserRole.TEACHER)}
              />
            )
          ) : (
            <UserDashboard zones={zones} slots={slots} onReserve={reserveSlot} />
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
