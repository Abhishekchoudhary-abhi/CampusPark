import { ParkingSlot, ParkingZone } from '../types';

/* ==================== CONFIG ==================== */
const API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  console.error('❌ VITE_API_BASE is not defined');
}

/* ==================== TYPES ==================== */
export type UserRole = 'OWNER' | 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AppUser {
  id: string;
  universityId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

/* ==================== HELPERS (SAFE ADDITION) ==================== */
const authHeaders = (token?: string) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : { 'Content-Type': 'application/json' };

/* ==================== STORAGE SERVICE ==================== */
export const storageService = {
  /* ==================== SLOTS ==================== */

  loadSlots: async (): Promise<ParkingSlot[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots`);
      if (!res.ok) throw new Error('Failed to load slots');

      const data = await res.json();
      return data.map((slot: any) => ({ ...slot, id: slot._id }));
    } catch (error) {
      console.error('Error loading slots:', error);
      return [];
    }
  },

  addSlot: async (slot: ParkingSlot): Promise<ParkingSlot | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(slot),
      });

      if (!res.ok) throw new Error('Failed to add slot');
      const data = await res.json();
      return { ...data, id: data._id };
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  },

  updateSlot: async (
    id: string,
    data: Partial<ParkingSlot>
  ): Promise<ParkingSlot | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update slot');
      const updated = await res.json();
      return { ...updated, id: updated._id };
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  },

  deleteSlot: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting slot:', error);
      return false;
    }
  },

  /* ==================== ZONES ==================== */

  loadZones: async (): Promise<ParkingZone[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/zones`);
      if (!res.ok) throw new Error('Failed to load zones');

      const data = await res.json();
      return data.map((zone: any) => ({ ...zone, id: zone._id }));
    } catch (error) {
      console.error('Error loading zones:', error);
      return [];
    }
  },

  addZone: async (zone: ParkingZone): Promise<ParkingZone | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/zones`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(zone),
      });

      if (!res.ok) throw new Error('Failed to add zone');
      const data = await res.json();
      return { ...data, id: data._id };
    } catch (error) {
      console.error('Error adding zone:', error);
    }
  },

  updateZone: async (
    zoneId: string,
    data: Partial<ParkingZone>
  ): Promise<ParkingZone | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/zones/${zoneId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update zone');
      const updated = await res.json();
      return { ...updated, id: updated._id };
    } catch (error) {
      console.error('Error updating zone:', error);
    }
  },

  deleteZone: async (zoneId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/zones/${zoneId}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting zone:', error);
      return false;
    }
  },

  restoreZone: async (zoneId: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${API_BASE}/api/zones/${zoneId}/restore`,
        { method: 'POST' }
      );
      return res.ok;
    } catch (error) {
      console.error('Error restoring zone:', error);
      return false;
    }
  },

  deleteZoneOptimistic: async (zoneId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/zones/${zoneId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete zone');
  },

  restoreZoneOptimistic: async (zoneId: string): Promise<ParkingZone> => {
    const res = await fetch(
      `${API_BASE}/api/zones/${zoneId}/restore`,
      { method: 'POST' }
    );
    if (!res.ok) throw new Error('Failed to restore zone');

    const data = await res.json();
    return { ...data, id: data._id };
  },

  /* ==================== AUTH ==================== */

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');
    return res.json(); // { token, user }
  },

  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const res = await fetch(`${API_BASE}/api/auth/change-password`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!res.ok) throw new Error('Password change failed');
    return res.json();
  },

  sendOtp: async (email: string) => {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error('Failed to send OTP');
    return res.json();
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) throw new Error('Invalid OTP');
    return res.json();
  },

  resetPassword: async (email: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, newPassword }),
    });

    if (!res.ok) throw new Error('Reset failed');
    return res.json();
  },

  /* ==================== ADMIN ==================== */

  createUser: async (
    token: string,
    payload: {
      name: string;
      email: string;
      role: UserRole;
    }
  ): Promise<AppUser> => {
    const res = await fetch(`${API_BASE}/api/admin/create-user`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Failed to create user');
    const data = await res.json();
    return { ...data, id: data._id };
  },

  getUsers: async (token: string): Promise<AppUser[]> => {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to load users');
    const data = await res.json();
    return data.map((u: any) => ({ ...u, id: u._id }));
  },
};
