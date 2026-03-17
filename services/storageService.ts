import { ParkingSlot, ParkingZone } from '../types';
import { apiClient } from './apiClient';

/* ==================== CONFIG ==================== */
export const API_BASE = (() => {
  const envUrl = import.meta.env.VITE_API_BASE;
  const apiUrl = envUrl?.replace(/\/$/, '');
  
  if (apiUrl) {
    console.log('🌐 API Client: Using environment VITE_API_BASE:', apiUrl);
    return apiUrl;
  }

  // Fallback for development
  if (import.meta.env.DEV) {
    console.warn('⚠️  API Client: VITE_API_BASE not set. Using dev fallback: http://localhost:5000');
    return 'http://localhost:5000';
  }
  
  const errorMsg = `❌ CRITICAL: VITE_API_BASE environment variable is undefined.`;
  console.error(errorMsg);
  return ''; // Return empty string instead of throwing to avoid crashing the whole bundle immediately
})();

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

/* ==================== STORAGE SERVICE ==================== */
export const storageService = {
  /* ==================== SLOTS ==================== */

  loadSlots: async (onRetry?: (count: number) => void): Promise<ParkingSlot[]> => {
    try {
      const data = await apiClient.get<any[]>(`${API_BASE}/api/slots`, {
        onRetry: (_, delay) => onRetry?.(delay)
      });
      return data.map((slot: any) => ({ ...slot, id: slot._id }));
    } catch (error) {
      console.error('Error loading slots:', error);
      return [];
    }
  },

  addSlot: async (slot: ParkingSlot): Promise<ParkingSlot | undefined> => {
    try {
      const data = await apiClient.post<any>(`${API_BASE}/api/slots`, slot);
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
      const updated = await apiClient.put<any>(`${API_BASE}/api/slots/${id}`, data);
      return { ...updated, id: updated._id };
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  },

  deleteSlot: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`${API_BASE}/api/slots/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting slot:', error);
      return false;
    }
  },

  /* ==================== ZONES ==================== */

  loadZones: async (): Promise<ParkingZone[]> => {
    try {
      const data = await apiClient.get<any[]>(`${API_BASE}/api/zones`);
      return data.map((zone: any) => ({ ...zone, id: zone._id }));
    } catch (error) {
      console.error('Error loading zones:', error);
      return [];
    }
  },

  addZone: async (zone: ParkingZone): Promise<ParkingZone | undefined> => {
    try {
      const data = await apiClient.post<any>(`${API_BASE}/api/zones`, zone);
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
      const updated = await apiClient.put<any>(`${API_BASE}/api/zones/${zoneId}`, data);
      return { ...updated, id: updated._id };
    } catch (error) {
      console.error('Error updating zone:', error);
    }
  },

  deleteZone: async (zoneId: string): Promise<boolean> => {
    try {
      await apiClient.delete(`${API_BASE}/api/zones/${zoneId}`);
      return true;
    } catch (error) {
      console.error('Error deleting zone:', error);
      return false;
    }
  },

  restoreZone: async (zoneId: string): Promise<boolean> => {
    try {
      await apiClient.post(`${API_BASE}/api/zones/${zoneId}/restore`);
      return true;
    } catch (error) {
      console.error('Error restoring zone:', error);
      return false;
    }
  },

  /* ==================== AUTH ==================== */

  login: async (email: string, password: string) => {
    return apiClient.post<any>(`${API_BASE}/api/auth/login`, { email, password });
  },

  register: async (name: string, email: string, password: string) => {
    return apiClient.post<any>(`${API_BASE}/api/auth/register`, { name, email, password });
  },

  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string
  ) => {
    return apiClient.put<any>(`${API_BASE}/api/auth/change-password`, 
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  sendOtp: async (email: string) => {
    return apiClient.post<any>(`${API_BASE}/api/auth/forgot-password`, { email });
  },

  verifyOtp: async (email: string, otp: string) => {
    return apiClient.post<any>(`${API_BASE}/api/auth/verify-otp`, { email, otp });
  },

  resetPassword: async (email: string, newPassword: string) => {
    return apiClient.post<any>(`${API_BASE}/api/auth/reset-password`, { email, newPassword });
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
    const data = await apiClient.post<any>(
      `${API_BASE}/api/admin/create-user`, 
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { ...data, id: data._id };
  },

  getUsers: async (token: string): Promise<AppUser[]> => {
    const data = await apiClient.get<any[]>(
      `${API_BASE}/api/admin/users`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.map((u: any) => ({ ...u, id: u._id }));
  },
};
