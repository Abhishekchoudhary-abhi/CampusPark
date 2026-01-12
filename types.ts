
export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER'
}

export interface ParkingSlot {
  id: string;
  number: string;
  zone: string;
  status: SlotStatus;
  updatedAt: string;
  assignedTo?: string;
}

export interface ParkingZone {
  id: string;
  name: string;
  description: string;
  totalSlots: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export interface ParkingInsights {
  summary: string;
  recommendations: string[];
  busyHours: string;
}
