
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { HabitForm } from './HabitForm';
import { DailyStats } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { calculateDailyPoints, checkNewBadges, getLevelInfo } from '../utils/gamification';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_STATS: DailyStats = {
  sleepHours: 7.0,
  codingHours: 6.0,
  waterIntake: 1.5,
  mood: 7,
  stressLevel: 4,
  didRead: false,
  didExercise: false,
};

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose }) => {
  const { user, saveDailyLog, updateUserProgress } = useAuth();
  const [stats, setStats] = useState<DailyStats>(INITIAL_STATS);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!user) return;
    setIsSaving(true);
    
    // Simulate slight delay for effect
    await new Promise(r => setTimeout(r, 600));

    // Calculate Gamification Rewards locally since we aren't using the full Dashboard flow
    const earnedPoints = calculateDailyPoints(stats);
    const updatedBadges = checkNewBadges(stats, user.progress.badges);
    const newTotalPoints = user.progress.totalPoints + earnedPoints;
    const levelInfo = getLevelInfo(newTotalPoints);
    const newStreak = user.progress.streak + 1; // Simplistic streak increment for quick log

    // 1. Save Log
    saveDailyLog(stats, earnedPoints);

    // 2. Update Progress
    updateUserProgress({
        totalPoints: newTotalPoints,
        level: levelInfo.level,
        currentLevelXP: levelInfo.currentLevelXP,
        nextLevelXP: levelInfo.nextLevelXP,
        badges: updatedBadges,
        streak: newStreak
    });

    setIsSaving(false);
    onClose();
    
    // Simple toast could go here, but we'll rely on the UI updates for feedback
    // Reset stats for next time
    setStats(INITIAL_STATS);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#F9DFDF] dark:border-gray-700 relative flex flex-col transition-colors duration-300 scrollbar-hide">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
           <h2 className="text-xl font-bold text-gray-800 dark:text-white font-['Fredoka']">
             Quick Log
           </h2>
           <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2">
            <HabitForm 
                stats={stats}
                onChange={setStats}
                onSubmit={handleSubmit}
                isAnalyzing={isSaving}
                submitLabel="Save Log & Earn XP"
                hideHeader={true}
            />
        </div>

      </div>
    </div>
  );
};
