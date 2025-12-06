
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

// Gamification Types

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  avatar: string;
  isCurrentUser: boolean;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  badges: Badge[];
  streak: number;
}

export interface DailyLog {
  date: string; // ISO Date String (YYYY-MM-DD)
  stats: DailyStats;
  pointsEarned: number;
}

export interface User {
  username: string;
  email: string;
  password?: string; // In a real app, never store passwords on client!
  progress: UserProgress;
  joinedDate: string;
  avatarPrompt: string;
  history: DailyLog[]; // Time-series data for the Correlation Engine
}
