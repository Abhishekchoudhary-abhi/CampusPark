import { ParkingSlot, ParkingZone } from '../types';

// ✅ Vite environment variable
const API_BASE = import.meta.env.VITE_API_BASE;

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

      const data = await res.json();

      // 🔴 Normalize MongoDB _id → id
      return data.map((slot: any) => ({
        ...slot,
        id: slot._id,
      }));
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

      const data = await res.json();

      return {
        ...data,
        id: data._id,
      };
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  },

  // Update slot (reserve / free)
  updateSlot: async (
    id: string,
    data: Partial<ParkingSlot>
  ): Promise<ParkingSlot | undefined> => {
    if (!id) {
      console.error('❌ updateSlot called with invalid id:', id);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/slots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update slot');

      const updated = await res.json();

      return {
        ...updated,
        id: updated._id,
      };
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  },

  // Delete slot
  deleteSlot: async (id: string): Promise<boolean> => {
    if (!id) {
      console.error('❌ deleteSlot called with invalid id:', id);
      return false;
    }

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

      const data = await res.json();

      // 🔴 Normalize MongoDB _id → id
      return data.map((zone: any) => ({
        ...zone,
        id: zone._id,
      }));
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

      const data = await res.json();

      return {
        ...data,
        id: data._id,
      };
    } catch (error) {
      console.error('Error adding zone:', error);
    }
  },
};
