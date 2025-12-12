
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserProgress, DailyLog, DailyStats } from '../types';
import { INITIAL_BADGES } from '../utils/gamification';

/**
 * CONFIGURATION
 * 
 * To enable the Real Database:
 * 1. Create a project at https://supabase.com
 * 2. Run the SQL schema provided in the instructions.
 * 3. Add your URL and ANON KEY to your environment variables.
 */

const getEnv = (key: string): string => {
    try {
        // Safe access to process.env
        return typeof process !== 'undefined' && process.env ? process.env[key] || '' : '';
    } catch (e) {
        return '';
    }
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_KEY = getEnv('SUPABASE_ANON_KEY');

// --- LOCAL STORAGE CONSTANTS (Fallback) ---
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

// --- MOCK DATA GENERATOR ---
const generateMockHistory = (): DailyLog[] => {
  const history: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    // Synthetic Logic for Correlation Engine
    const sleep = isWeekend ? 7 + Math.random() * 3 : 5 + Math.random() * 3;
    const moodBase = (sleep - 4) * 1.5;
    const mood = Math.min(10, Math.max(1, Math.round(moodBase + (Math.random() * 2 - 1))));
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

// --- SUPABASE CLIENT ---
let supabase: SupabaseClient | null = null;

// Initialize Supabase only if valid URL is present
if (SUPABASE_URL && SUPABASE_URL.startsWith('http') && SUPABASE_KEY) {
    try {
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("🟢 Supabase Client Initialized");
    } catch (e) {
        console.warn("🔴 Invalid Supabase Config, falling back to LocalStorage", e);
        supabase = null;
    }
} else {
    // Silent fallback
    if (SUPABASE_URL) console.warn("🟡 Invalid Supabase URL format.");
}

/**
 * HYBRID AUTH SERVICE
 * Handles switching between Real DB and Local Mock DB transparently.
 */
export const authService = {

  // --- HELPER: Is Supabase Active? ---
  isDbActive: (): boolean => {
    return !!supabase;
  },

  // --- LOGIN ---
  login: async (email: string, password: string): Promise<User> => {
    // 1. SUPABASE PATH
    if (authService.isDbActive() && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error("No user found");

        // Fetch Profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) throw new Error("Could not load user profile");

        // Fetch Logs (History)
        const { data: logs, error: logsError } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', authData.user.id);
        
        if (logsError) console.warn("Could not load logs", logsError);

        // Map to internal User type
        const user: User = {
            email: profile.email,
            username: profile.username,
            joinedDate: profile.joined_date,
            avatarPrompt: profile.avatar_prompt,
            progress: profile.progress, // JSONB maps directly to object
            history: (logs || []).map((l: any) => ({
                date: l.date,
                stats: l.stats,
                pointsEarned: l.points_earned
            }))
        };
        return user;
    }

    // 2. LOCAL PATH
    await new Promise(resolve => setTimeout(resolve, 800));
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password (Local)');
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  // --- SIGNUP ---
  signup: async (email: string, username: string, password: string): Promise<User> => {
    // 1. SUPABASE PATH
    if (authService.isDbActive() && supabase) {
        // A. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });
        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error("Signup failed");

        // B. Generate Mock Data
        const mockHistory = generateMockHistory();
        const totalPoints = mockHistory.reduce((acc, log) => acc + log.pointsEarned, 0);
        const initialProgress = { ...INITIAL_PROGRESS, totalPoints };

        // C. Create Profile Entry
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                email,
                username,
                joined_date: new Date().toISOString(),
                avatar_prompt: DEFAULT_AVATAR_PROMPT,
                progress: initialProgress
            });

        if (profileError) {
             // Rollback (simple attempt)
             console.error("Profile creation failed", profileError);
             throw new Error("Could not create profile");
        }

        // D. Insert Mock History (Batch Insert)
        const logsToInsert = mockHistory.map(h => ({
            user_id: authData.user!.id,
            date: h.date,
            stats: h.stats,
            points_earned: h.pointsEarned
        }));

        const { error: logsError } = await supabase.from('daily_logs').insert(logsToInsert);
        if (logsError) console.warn("Failed to insert mock history", logsError);

        // Return User Object
        return {
            email,
            username,
            joinedDate: new Date().toISOString(),
            avatarPrompt: DEFAULT_AVATAR_PROMPT,
            progress: initialProgress,
            history: mockHistory
        };
    }

    // 2. LOCAL PATH
    await new Promise(resolve => setTimeout(resolve, 800));
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    if (users.find(u => u.email === email)) throw new Error('User already exists');

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

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  // --- LOGOUT ---
  logout: async () => {
    if (authService.isDbActive() && supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem(SESSION_KEY);
  },

  // --- GET CURRENT USER (Session Rehydration) ---
  getCurrentUser: (): User | null => {
    // For Supabase, we rely on the session, but we might not have the full profile loaded 
    // synchronously on first render. The AuthContext will typically handle the initial load 
    // by calling a check function.
    // However, for compatibility with the existing synchronous local flow, we check LocalStorage first.
    
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    // In local mode, we refresh from the "Users DB"
    if (!authService.isDbActive()) {
        const sessionUser = JSON.parse(sessionStr);
        const usersStr = localStorage.getItem(USERS_KEY);
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];
        return users.find(u => u.email === sessionUser.email) || null;
    }

    // In Supabase mode, we just return the cached session user until we re-fetch
    return JSON.parse(sessionStr);
  },

  // --- UPDATES ---
  updateProgress: async (user: User, newProgress: UserProgress) => {
    const updatedUser = { ...user, progress: newProgress };
    
    // Optimistic Update (UI updates immediately)
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser)); 

    if (authService.isDbActive() && supabase) {
        // Get ID via current session to ensure security
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
            await supabase
                .from('profiles')
                .update({ progress: newProgress })
                .eq('id', session.session.user.id);
        }
    } else {
        // Local Save
        authService._localSave(updatedUser);
    }
    return updatedUser;
  },

  updateAvatar: async (user: User, newPrompt: string) => {
    const updatedUser = { ...user, avatarPrompt: newPrompt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    if (authService.isDbActive() && supabase) {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
            await supabase
                .from('profiles')
                .update({ avatar_prompt: newPrompt })
                .eq('id', session.session.user.id);
        }
    } else {
        authService._localSave(updatedUser);
    }
    return updatedUser;
  },
  
  logDailyStats: async (user: User, stats: DailyStats, points: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update local object first
    const newHistory = [...user.history];
    const existingIndex = newHistory.findIndex(h => h.date === today);
    if (existingIndex >= 0) {
        newHistory[existingIndex] = { date: today, stats, pointsEarned: points };
    } else {
        newHistory.push({ date: today, stats, pointsEarned: points });
    }
    const updatedUser = { ...user, history: newHistory };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    if (authService.isDbActive() && supabase) {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
            const userId = session.session.user.id;
            
            // Check if log exists for today
            const { data: existingLog } = await supabase
                .from('daily_logs')
                .select('id')
                .eq('user_id', userId)
                .eq('date', today)
                .single();

            if (existingLog) {
                await supabase.from('daily_logs').update({
                    stats,
                    points_earned: points
                }).eq('id', existingLog.id);
            } else {
                await supabase.from('daily_logs').insert({
                    user_id: userId,
                    date: today,
                    stats,
                    points_earned: points
                });
            }
        }
    } else {
        authService._localSave(updatedUser);
    }
    return updatedUser;
  },

  // --- LOCAL HELPERS ---
  _localSave: (user: User) => {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];
      const index = users.findIndex(u => u.email === user.email);
      if (index >= 0) users[index] = user;
      else users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  exportDatabase: (): string => {
    return localStorage.getItem(USERS_KEY) || '[]';
  },

  importDatabase: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      localStorage.setItem(USERS_KEY, jsonStr);
      localStorage.removeItem(SESSION_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
};
