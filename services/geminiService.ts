
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is available.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAISuggestion = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "AI service is unavailable. Please configure your API Key.";
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    return "Failed to get a suggestion. Please try again.";
  }
};
