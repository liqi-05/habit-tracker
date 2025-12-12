import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgress, DailyStats } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProgress: (progress: UserProgress) => Promise<void>;
  updateUserAvatar: (prompt: string) => Promise<void>;
  saveDailyLog: (stats: DailyStats, points: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const signup = async (email: string, username: string, password: string) => {
    const user = await authService.signup(email, username, password);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserProgress = async (progress: UserProgress) => {
    if (user) {
      const updatedUser = await authService.updateProgress(user, progress);
      setUser(updatedUser);
    }
  };

  const updateUserAvatar = async (prompt: string) => {
    if (user) {
      const updatedUser = await authService.updateAvatar(user, prompt);
      setUser(updatedUser);
    }
  };

  const saveDailyLog = async (stats: DailyStats, points: number) => {
    if (user) {
        const updatedUser = await authService.logDailyStats(user, stats, points);
        setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserProgress, updateUserAvatar, saveDailyLog }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};