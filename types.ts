export interface DailyStats {
  sleepHours: number;
  codingHours: number;
  waterIntake: number; // in liters
  mood: number; // 1-10
  stressLevel: number; // 1-10, New field
  didRead: boolean;
  didExercise: boolean;
}

export interface PredictionResult {
  burnoutScore: number; // 0.0 to 10.0
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  contributors: string[];
}

export interface CoachAdvice {
  summary: string;
  actionableSteps: string[];
  encouragement: string;
}

export enum HabitType {
  NUMERIC = 'NUMERIC',
  BOOLEAN = 'BOOLEAN',
}