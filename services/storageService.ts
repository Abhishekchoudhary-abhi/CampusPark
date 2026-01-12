import { ParkingSlot, ParkingZone } from '../types';

// ✅ Vite environment variable (works in web + Android app)
const API_BASE = import.meta.env.VITE_API_BASE;
console.log('API BASE:', import.meta.env.VITE_API_BASE);


/* 
  Safety check (optional during development)
  Remove this console.log after verifying once
*/
if (!API_BASE) {
  console.error('❌ VITE_API_BASE is not defined');
}

export const storageService = {
  /* -------------------- SLOTS -------------------- */

  // Load all slots
  loadSlots: async (): Promise<ParkingSlot[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots`);
      if (!res.ok) throw new Error('Failed to load slots');
      return await res.json();
    } catch (error) {
      console.error('Error loading slots:', error);
      return [];
    }
  },

  // Add a new slot
  addSlot: async (slot: ParkingSlot): Promise<ParkingSlot | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slot),
      });

      if (!res.ok) throw new Error('Failed to add slot');
      return await res.json();
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  },

  // Update slot (reserve / free)
  updateSlot: async (
    id: string,
    data: Partial<ParkingSlot>
  ): Promise<ParkingSlot | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/slots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update slot');
      return await res.json();
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  },

  // Delete slot
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

  /* -------------------- ZONES -------------------- */

  // Load all zones
  loadZones: async (): Promise<ParkingZone[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/zones`);
      if (!res.ok) throw new Error('Failed to load zones');
      return await res.json();
    } catch (error) {
      console.error('Error loading zones:', error);
      return [];
    }
  },

  // Add zone
  addZone: async (zone: ParkingZone): Promise<ParkingZone | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/api/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone),
      });

      if (!res.ok) throw new Error('Failed to add zone');
      return await res.json();
    } catch (error) {
      console.error('Error adding zone:', error);
    }
  },
};
