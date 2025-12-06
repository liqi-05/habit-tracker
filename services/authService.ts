
import { User, UserProgress, DailyLog, DailyStats } from '../types';
import { INITIAL_BADGES } from '../utils/gamification';

// Keys for LocalStorage
const USERS_KEY = 'healthy_habits_users';
const SESSION_KEY = 'healthy_habits_session';

const INITIAL_PROGRESS: UserProgress = {
  totalPoints: 0,
  level: 1,
  currentLevelXP: 0,
  nextLevelXP: 100,
  badges: INITIAL_BADGES,
  streak: 0
};

const DEFAULT_AVATAR_PROMPT = "cute tomato character doodle thick outlines";

/**
 * Generates synthetic history data so the user sees charts immediately.
 * Simulates a realistic developer: 
 * - Weekends: More sleep, less coding.
 * - Weekdays: Variable coding/stress correlation.
 */
const generateMockHistory = (): DailyLog[] => {
  const history: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    // Synthetic Data Logic (to ensure correlation engine finds something)
    // Rule 1: Sleep strongly affects Mood
    const sleep = isWeekend ? 7 + Math.random() * 3 : 5 + Math.random() * 3;
    const moodBase = (sleep - 4) * 1.5; // More sleep = better mood
    const mood = Math.min(10, Math.max(1, Math.round(moodBase + (Math.random() * 2 - 1))));

    // Rule 2: Coding strongly affects Stress
    const coding = isWeekend ? Math.random() * 3 : 6 + Math.random() * 5;
    const stressBase = (coding / 12) * 8;
    const stress = Math.min(10, Math.max(1, Math.round(stressBase + (Math.random() * 2 - 1))));

    const points = Math.floor(Math.random() * 50) + 10;

    history.push({
      date: d.toISOString().split('T')[0],
      stats: {
        sleepHours: parseFloat(sleep.toFixed(1)),
        codingHours: parseFloat(coding.toFixed(1)),
        waterIntake: parseFloat((1 + Math.random() * 2).toFixed(1)),
        mood: mood,
        stressLevel: stress,
        didRead: Math.random() > 0.7,
        didExercise: Math.random() > 0.6
      },
      pointsEarned: points
    });
  }
  return history;
};

/**
 * MockDatabaseService
 * Simulates a backend database using LocalStorage.
 */
export const authService = {
  getUsers: (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Migration: Ensure all users have an avatarPrompt and history
    return users.map(u => ({
      ...u,
      avatarPrompt: u.avatarPrompt || DEFAULT_AVATAR_PROMPT,
      history: u.history || []
    }));
  },

  saveUser: (user: User) => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, username: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = authService.getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    // Generate mock history for portfolio "wow" factor
    const mockHistory = generateMockHistory();

    const newUser: User = {
      email,
      username,
      password,
      joinedDate: new Date().toISOString(),
      progress: { 
        ...INITIAL_PROGRESS,
        totalPoints: mockHistory.reduce((acc, log) => acc + log.pointsEarned, 0)
      },
      avatarPrompt: DEFAULT_AVATAR_PROMPT,
      history: mockHistory
    };

    authService.saveUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    // Refresh data from "DB" to ensure we have latest progress/avatar/history
    const sessionUser = JSON.parse(sessionStr);
    const users = authService.getUsers();
    return users.find(u => u.email === sessionUser.email) || null;
  },

  updateProgress: (user: User, newProgress: UserProgress) => {
    const updatedUser = { ...user, progress: newProgress };
    authService.saveUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser)); 
    return updatedUser;
  },

  updateAvatar: (user: User, newPrompt: string) => {
    const updatedUser = { ...user, avatarPrompt: newPrompt };
    authService.saveUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },
  
  logDailyStats: (user: User, stats: DailyStats, points: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: DailyLog = { date: today, stats, pointsEarned: points };
    
    // Check if entry for today exists, replace it if so, otherwise push
    const existingIndex = user.history.findIndex(h => h.date === today);
    const newHistory = [...user.history];
    
    if (existingIndex >= 0) {
      newHistory[existingIndex] = newLog;
    } else {
      newHistory.push(newLog);
    }

    const updatedUser = { ...user, history: newHistory };
    authService.saveUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Database Management Features
  exportDatabase: (): string => {
    return localStorage.getItem(USERS_KEY) || '[]';
  },

  importDatabase: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) throw new Error('Invalid format: Root must be an array');
      
      // Basic schema validation
      if (parsed.length > 0) {
        if (!parsed[0].email || !parsed[0].progress) {
             throw new Error('Invalid schema: Missing required user fields');
        }
      }
      
      localStorage.setItem(USERS_KEY, jsonStr);
      localStorage.removeItem(SESSION_KEY);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }
};
