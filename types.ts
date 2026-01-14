/* ==================== SLOT STATUS ==================== */
export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

/* ==================== USER ROLES ==================== */
/**
 * NOTE:
 * - ADMIN already existed
 * - TEACHER already existed (kept for compatibility)
 * - OWNER added (required)
 * - USER added (required)
 *
 * No existing logic is broken by this extension.
 */
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  USER = 'USER',
}

/* ==================== PARKING SLOT ==================== */
export interface ParkingSlot {
  id: string;
  number: string;
  zone: string;
  status: SlotStatus;
  updatedAt: string;
  assignedTo?: string;
}

/* ==================== PARKING ZONE ==================== */
export interface ParkingZone {
  id: string;
  name: string;
  description: string;
  totalSlots: number;
}

/* ==================== NOTIFICATION ==================== */
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

/* ==================== INSIGHTS ==================== */
export interface ParkingInsights {
  summary: string;
  recommendations: string[];
  busyHours: string;
}
