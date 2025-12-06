
import { GoogleGenAI, Type } from "@google/genai";
import { CoachAdvice, DailyStats, PredictionResult } from '../types';

const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const ICON_CACHE_KEY = 'hh_icon_cache_v1';

// We assume the API key is available in the environment variables as per instructions.
const getClient = () => {
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    console.warn("API Key not found in process.env.API_KEY. Using mock mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateThemeIcon = async (concept: string): Promise<string | null> => {
  // 1. Check Persistent Cache (LocalStorage)
  try {
    const cacheStr = localStorage.getItem(ICON_CACHE_KEY);
    const cache = cacheStr ? JSON.parse(cacheStr) : {};
    if (cache[concept]) {
      return cache[concept];
    }
  } catch (e) {
    // Ignore cache errors
  }

  const client = getClient();
  if (!client) return null;

  // Prompt updated to match the "Cute Tomato" reference art style
  const imagePrompt = `
    A cute, simple, hand-drawn vector sticker illustration of ${concept}.
    Style: Minimalist doodle, thick dark uneven outlines (like a marker pen), flat pastel colors.
    Character: Kawaii face with small dot eyes and a tiny mouth.
    If the concept is a mood (sad, happy, neutral), make it a cute round mochi-like character.
    Colors: Soft pastel palette (pinks, soft reds, creams) but with high-contrast black outlines.
    Background: Pure white.
    Do not add text.
  `;

  try {
    const response = await client.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Image = `data:image/png;base64,${part.inlineData.data}`;
        
        // 2. Save to Cache
        try {
            const cacheStr = localStorage.getItem(ICON_CACHE_KEY);
            const cache = cacheStr ? JSON.parse(cacheStr) : {};
            cache[concept] = base64Image;
            
            // Simple safeguard: If cache gets too big (>4MB), clear it to avoid QuotaExceededError
            if (JSON.stringify(cache).length > 4 * 1024 * 1024) {
                localStorage.removeItem(ICON_CACHE_KEY);
            } else {
                localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(cache));
            }
        } catch (e) {
            console.warn("Could not save icon to cache (likely storage full)", e);
        }

        return base64Image;
      }
    }
    return null;
  } catch (error: any) {
    // Gracefully handle Rate Limits
    if (error.status === 'RESOURCE_EXHAUSTED' || error.code === 429 || error.toString().includes('429')) {
        console.warn(`Gemini API Quota Exceeded for icon: "${concept}". Showing fallback emoji.`);
        return null;
    }
    console.error("Icon generation failed:", error);
    return null;
  }
};

export const parseNaturalLanguageStats = async (transcript: string): Promise<Partial<DailyStats>> => {
  const client = getClient();
  if (!client) return {};

  const prompt = `
    Extract health stats from this natural language text: "${transcript}".
    Return a JSON object with ONLY the fields that are mentioned.
    Fields (all optional):
    - sleepHours (number)
    - codingHours (number)
    - waterIntake (number)
    - mood (number 1-10)
    - stressLevel (number 1-10)
    - didExercise (boolean)
    - didRead (boolean)
  `;

  try {
    const response = await client.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sleepHours: { type: Type.NUMBER },
            codingHours: { type: Type.NUMBER },
            waterIntake: { type: Type.NUMBER },
            mood: { type: Type.NUMBER },
            stressLevel: { type: Type.NUMBER },
            didExercise: { type: Type.BOOLEAN },
            didRead: { type: Type.BOOLEAN },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return {};
  } catch (error) {
    console.error("Failed to parse voice log:", error);
    return {};
  }
};

export const getCoachAdvice = async (
  stats: DailyStats,
  prediction: PredictionResult
): Promise<CoachAdvice> => {
  const client = getClient();

  // Fallback Mock Mode
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    return {
      summary: "I'm currently running in Offline Mode. Watch your stress levels.",
      actionableSteps: [
        "Take a deep breath.",
        "Drink water.",
        "Rest your eyes."
      ],
      encouragement: "You can handle this!"
    };
  }

  const prompt = `
    Analyze the following user health data and burnout prediction.
    
    User Stats:
    - Sleep: ${stats.sleepHours} hours
    - Coding: ${stats.codingHours} hours
    - Water: ${stats.waterIntake}L
    - Stress Level: ${stats.stressLevel}/10
    - Exercise: ${stats.didExercise ? 'Yes' : 'No'}
    - Reading: ${stats.didRead ? 'Yes' : 'No'}
    - Mood: ${stats.mood}/10

    Algorithmic Prediction:
    - Burnout Score: ${prediction.burnoutScore}/10
    - Risk Level: ${prediction.riskLevel}

    Act as an empathetic, professional productivity and health coach. 
    Provide advice in JSON format.
  `;

  try {
    const response = await client.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 1-2 sentence summary of the situation." },
            actionableSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 specific, short actionable bullet points."
            },
            encouragement: { type: Type.STRING, description: "A short motivational closing." }
          },
          required: ["summary", "actionableSteps", "encouragement"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CoachAdvice;
    }
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "I'm having trouble connecting to the AI coach right now.",
      actionableSteps: ["Check your internet connection.", "Review your stats manually.", "Take a deep breath."],
      encouragement: "Technology hiccups happen. Keep going!"
    };
  }
};
