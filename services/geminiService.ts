import { GoogleGenAI, Type } from "@google/genai";
import { CoachAdvice, DailyStats, PredictionResult } from '../types';

const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

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
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Icon generation failed:", error);
    return null;
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