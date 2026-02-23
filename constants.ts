
import { ParkingZone, ParkingSlot, SlotStatus } from './types';

export const PARKING_ZONES: ParkingZone[] = [
  { id: 'zone-a', name: 'Main Faculty Wing', description: 'Closest to the Science and Arts departments.', totalSlots: 12 },
  { id: 'zone-b', name: 'North Annex', description: 'Near the Administration Building.', totalSlots: 8 },
  { id: 'zone-c', name: 'West Gate', description: 'Ideal for Sports and Library access.', totalSlots: 10 },
];

export const INITIAL_SLOTS: ParkingSlot[] = [
  // Zone A
  { id: '1', number: 'A-1', zone: 'zone-a', status: SlotStatus.OCCUPIED, updatedAt: new Date().toISOString() },
  { id: '2', number: 'A-2', zone: 'zone-a', status: SlotStatus.AVAILABLE, updatedAt: new Date().toISOString() },
  { id: '3', number: 'A-3', zone: 'zone-a', status: SlotStatus.AVAILABLE, updatedAt: new Date().toISOString() },
  { id: '4', number: 'A-4', zone: 'zone-a', status: SlotStatus.OCCUPIED, updatedAt: new Date().toISOString() },
  { id: '5', number: 'A-5', zone: 'zone-a', status: SlotStatus.AVAILABLE, updatedAt: new Date().toISOString() },
  { id: '6', number: 'A-6', zone: 'zone-a', status: SlotStatus.OCCUPIED, updatedAt: new Date().toISOString() },
  // Zone B
  { id: '7', number: 'B-1', zone: 'zone-b', status: SlotStatus.AVAILABLE, updatedAt: new Date().toISOString() },
  { id: '8', number: 'B-2', zone: 'zone-b', status: SlotStatus.OCCUPIED, updatedAt: new Date().toISOString() },
  { id: '9', number: 'B-3', zone: 'zone-b', status: SlotStatus.RESERVED, updatedAt: new Date().toISOString() },
  // Zone C
  { id: '10', number: 'C-1', zone: 'zone-c', status: SlotStatus.AVAILABLE, updatedAt: new Date().toISOString() },
  { id: '11', number: 'C-2', zone: 'zone-c', status: SlotStatus.AVAILABLE, updatedAt: new Date().toISOString() },
  { id: '12', number: 'C-3', zone: 'zone-c', status: SlotStatus.OCCUPIED, updatedAt: new Date().toISOString() },
];
