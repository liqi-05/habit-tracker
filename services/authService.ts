
import { User, UserProgress } from '../types';
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
 * MockDatabaseService
 * Simulates a backend database using LocalStorage.
 */
export const authService = {
  getUsers: (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Migration: Ensure all users have an avatarPrompt
    return users.map(u => ({
      ...u,
      avatarPrompt: u.avatarPrompt || DEFAULT_AVATAR_PROMPT
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

    const newUser: User = {
      email,
      username,
      password,
      joinedDate: new Date().toISOString(),
      progress: { ...INITIAL_PROGRESS },
      avatarPrompt: DEFAULT_AVATAR_PROMPT
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
    
    // Refresh data from "DB" to ensure we have latest progress/avatar
    const sessionUser = JSON.parse(sessionStr);
    const users = authService.getUsers();
    return users.find(u => u.email === sessionUser.email) || null;
  },

  updateProgress: (user: User, newProgress: UserProgress) => {
    const updatedUser = { ...user, progress: newProgress };
    authService.saveUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser)); // Update session too
    return updatedUser;
  },

  updateAvatar: (user: User, newPrompt: string) => {
    const updatedUser = { ...user, avatarPrompt: newPrompt };
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
      // Clear session to force re-login/refresh to avoid state mismatch
      localStorage.removeItem(SESSION_KEY);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }
};
