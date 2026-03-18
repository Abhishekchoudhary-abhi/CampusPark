
import { ParkingSlot, ParkingInsights } from "../types";

/**
 * Gemini Service (Stub/Fallback)
 * 
 * Note: AI Insights are currently disabled per user feedback or unavailability.
 * Using a simple statistical model for now.
 */

export const getParkingInsights = async (slots: ParkingSlot[]): Promise<ParkingInsights> => {
  const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;
  const totalCount = slots.length;
  const occupancyRate = totalCount > 0 ? ((totalCount - availableCount) / totalCount) * 100 : 0;
  
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

  // Simulate analysis without external API
  return {
    summary: availableCount > 0 
      ? `Currently, there are ${availableCount} spots available out of ${totalCount}. Overall occupancy is at ${occupancyRate.toFixed(1)}%.`
      : "Parking is currently at full capacity. We recommend waiting or checking back shortly.",
    recommendations: [
      availableCount < totalCount * 0.2 ? "High Demand! Arrive at least 20 mins before peak" : "Check Block B for closer spots to main gate",
      "Carpooling offers priority zones in some areas",
      `Expect moderate traffic around campus due to ${dayOfWeek} schedules`
    ],
    busyHours: "08:30 AM - 10:30 AM & 02:30 PM - 04:00 PM"
  };
};
