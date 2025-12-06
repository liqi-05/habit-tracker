
import { DailyStats, Badge, LeaderboardEntry, UserProgress } from '../types';
import { STATIC_ASSETS } from './staticAssets';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first daily check-in',
    icon: STATIC_ASSETS.badges.first_step,
    isUnlocked: false,
  },
  {
    id: 'hydration_hero',
    name: 'Hydration Hero',
    description: 'Drink more than 2.5L of water in a day',
    icon: STATIC_ASSETS.badges.hydration_hero,
    isUnlocked: false,
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Report a stress level below 3',
    icon: STATIC_ASSETS.badges.zen_master,
    isUnlocked: false,
  },
  {
    id: 'iron_body',
    name: 'Iron Body',
    description: 'Exercise and Sleep > 7 hours',
    icon: STATIC_ASSETS.badges.iron_body,
    isUnlocked: false,
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Read a book',
    icon: STATIC_ASSETS.badges.bookworm,
    isUnlocked: false,
  }
];

export const calculateDailyPoints = (stats: DailyStats): number => {
  let points = 0;

  if (stats.sleepHours >= 7 && stats.sleepHours <= 9) points += 20;
  if (stats.waterIntake >= 2.0) points += 15;
  if (stats.codingHours <= 8) points += 10; // Healthy boundaries
  if (stats.didExercise) points += 30;
  if (stats.didRead) points += 20;
  if (stats.mood >= 7) points += 10;
  if (stats.stressLevel <= 4) points += 10;

  return points;
};

export const checkNewBadges = (stats: DailyStats, currentBadges: Badge[]): Badge[] => {
  return currentBadges.map(badge => {
    if (badge.isUnlocked) return badge;

    let unlocked = false;
    switch (badge.id) {
      case 'first_step':
        unlocked = true; // Always unlocks on first run
        break;
      case 'hydration_hero':
        if (stats.waterIntake >= 2.5) unlocked = true;
        break;
      case 'zen_master':
        if (stats.stressLevel < 3) unlocked = true;
        break;
      case 'iron_body':
        if (stats.didExercise && stats.sleepHours >= 7) unlocked = true;
        break;
      case 'bookworm':
        if (stats.didRead) unlocked = true;
        break;
    }

    if (unlocked) {
      return { ...badge, isUnlocked: true, unlockedDate: new Date().toISOString() };
    }
    return badge;
  });
};

export const getLevelInfo = (totalPoints: number) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  const currentLevelBase = LEVEL_THRESHOLDS[level - 1];
  const nextLevelThreshold = LEVEL_THRESHOLDS[level] || (currentLevelBase + 1000);
  
  return {
    level,
    currentLevelXP: totalPoints - currentLevelBase,
    nextLevelXP: nextLevelThreshold - currentLevelBase
  };
};

export const generateMockLeaderboard = (userPoints: number, _userAvatarPrompt?: string): LeaderboardEntry[] => {
  // Generate some fake users around the user's score to make it feel competitive
  // Uses STATIC_ASSETS for mock users to avoid API calls
  const entries: LeaderboardEntry[] = [
    { rank: 1, username: 'HabitKing', points: userPoints + 450, avatar: STATIC_ASSETS.avatars.lion, isCurrentUser: false },
    { rank: 2, username: 'PixelArtist', points: userPoints + 210, avatar: STATIC_ASSETS.avatars.cat, isCurrentUser: false },
    { rank: 3, username: 'CodeNinja', points: userPoints + 80, avatar: STATIC_ASSETS.avatars.ninja, isCurrentUser: false },
    { rank: 4, username: 'You', points: userPoints, avatar: '', isCurrentUser: true }, // 'avatar' is unused for current user, 'avatarPrompt' is used in UI
    { rank: 5, username: 'SleepyBear', points: Math.max(0, userPoints - 120), avatar: STATIC_ASSETS.avatars.bear, isCurrentUser: false },
  ];
  return entries.sort((a, b) => b.points - a.points).map((entry, index) => ({ ...entry, rank: index + 1 }));
};
