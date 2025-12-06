
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgress } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProgress: (progress: UserProgress) => void;
  updateUserAvatar: (prompt: string) => void;
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

  const updateUserProgress = (progress: UserProgress) => {
    if (user) {
      const updatedUser = authService.updateProgress(user, progress);
      setUser(updatedUser);
    }
  };

  const updateUserAvatar = (prompt: string) => {
    if (user) {
      const updatedUser = authService.updateAvatar(user, prompt);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserProgress, updateUserAvatar }}>
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
