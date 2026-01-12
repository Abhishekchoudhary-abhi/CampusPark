
import { GoogleGenAI, Type } from "@google/genai";
import { ParkingSlot, ParkingInsights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getParkingInsights = async (slots: ParkingSlot[]): Promise<ParkingInsights> => {
  const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;
  const totalCount = slots.length;
  const occupancyRate = ((totalCount - availableCount) / totalCount) * 100;

  const prompt = `
    Analyze the current campus parking situation:
    - Total Slots: ${totalCount}
    - Available Slots: ${availableCount}
    - Occupancy Rate: ${occupancyRate.toFixed(1)}%
    - Slots Detail: ${JSON.stringify(slots)}

    Based on this, provide:
    1. A brief summary of availability.
    2. 3 actionable recommendations for teachers arriving soon.
    3. Estimated busy hours for today based on these levels.
    
    Return the response as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            busyHours: { type: Type.STRING }
          },
          required: ["summary", "recommendations", "busyHours"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "Current parking levels are standard.",
      recommendations: ["Always check zone availability before entering", "Arrive 10 mins early during peak hours", "Consider Zone B for longer stays"],
      busyHours: "08:00 AM - 10:30 AM"
    };
  }
};
