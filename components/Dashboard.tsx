
import React, { useState, useEffect } from 'react';
import { DailyStats, PredictionResult, CoachAdvice, LeaderboardEntry } from '../types';
import { HabitForm } from './HabitForm';
import { BurnoutGauge } from './BurnoutGauge';
import { AICoach } from './AICoach';
import { GamificationHub } from './GamificationHub';
import { predictor } from '../utils/predictor';
import { getCoachAdvice } from '../services/geminiService';
import { calculateDailyPoints, checkNewBadges, getLevelInfo, generateMockLeaderboard } from '../utils/gamification';
import { FireIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_STATS: DailyStats = {
  sleepHours: 7.0,
  codingHours: 6.0,
  waterIntake: 1.5,
  mood: 7,
  stressLevel: 4,
  didRead: false,
  didExercise: false,
};

export const Dashboard: React.FC = () => {
  const { user, updateUserProgress, updateUserAvatar } = useAuth();
  
  const [stats, setStats] = useState<DailyStats>(INITIAL_STATS);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [advice, setAdvice] = useState<CoachAdvice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Local state for non-logged in users (streak only)
  const [localStreak, setLocalStreak] = useState(0); 

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Initialize leaderboard based on user points or default
  useEffect(() => {
    const points = user ? user.progress.totalPoints : 0;
    const avatarPrompt = user ? user.avatarPrompt : 'cute tomato character doodle thick outlines';
    setLeaderboard(generateMockLeaderboard(points, avatarPrompt));
  }, [user]);

  const handleRunAnalysis = async () => {
    setIsProcessing(true);
    
    // 1. Run "ML" Prediction (Local)
    const result = predictor.predict(stats);
    setPrediction(result);

    // 2. Gamification Updates
    if (user) {
        const earnedPoints = calculateDailyPoints(stats);
        const updatedBadges = checkNewBadges(stats, user.progress.badges);
        const newTotalPoints = user.progress.totalPoints + earnedPoints;
        const levelInfo = getLevelInfo(newTotalPoints);
        const newStreak = user.progress.streak + 1;

        // Update User Progress via Context (saves to DB)
        updateUserProgress({
            totalPoints: newTotalPoints,
            level: levelInfo.level,
            currentLevelXP: levelInfo.currentLevelXP,
            nextLevelXP: levelInfo.nextLevelXP,
            badges: updatedBadges,
            streak: newStreak
        });
    } else {
        // Just local visual feedback
        setLocalStreak(prev => prev + 1);
    }

    // 3. Get AI Advice (Gemini API)
    try {
        const coachAdvice = await getCoachAdvice(stats, result);
        setAdvice(coachAdvice);
    } catch (e) {
        console.error("Failed to get advice", e);
    } finally {
        setIsProcessing(false);
    }
  };

  const currentStreak = user ? user.progress.streak : localStreak;

  return (
    <div className="space-y-6">
        {/* Streak Header */}
        <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-900 shadow-sm">
                <FireIcon className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="text-orange-800 dark:text-orange-200 font-bold font-['Fredoka']">
                    {currentStreak} Day Streak!
                </span>
            </div>
        </div>

        {/* Top Row: Input and Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <HabitForm 
                    stats={stats} 
                    onChange={setStats} 
                    onSubmit={handleRunAnalysis}
                    isAnalyzing={isProcessing}
                />
            </div>
            <div className="lg:col-span-1 h-full">
                {prediction ? (
                    <BurnoutGauge prediction={prediction} />
                ) : (
                    <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border-2 border-[#F9DFDF] dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center gap-4 transition-colors duration-300">
                         <div className="text-5xl opacity-20">🎯</div>
                         <p className="text-gray-400 dark:text-gray-500 font-medium font-['Fredoka'] text-lg">
                            Fill out your daily check-in<br/>to get your wellness score!
                         </p>
                    </div>
                )}
            </div>
        </div>

        {/* AI Coach */}
        <div className="w-full">
            <AICoach advice={advice} loading={isProcessing} />
        </div>

        {/* Gamification Hub - Locked if not logged in */}
        <div className="w-full pt-4 relative">
            {user ? (
                <GamificationHub 
                    userProgress={user.progress} 
                    leaderboard={leaderboard} 
                    userAvatarPrompt={user.avatarPrompt}
                    onUpdateAvatar={updateUserAvatar}
                />
            ) : (
                <div className="relative">
                    {/* Blurred Background Preview */}
                    <div className="filter blur-md opacity-50 pointer-events-none select-none">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-[#F9DFDF] h-full"></div>
                            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-[#F9DFDF] h-full"></div>
                         </div>
                    </div>
                    
                    {/* Call to Action Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border-2 border-[#F9DFDF] dark:border-gray-700 max-w-md">
                            <div className="w-16 h-16 bg-[#FBEFEF] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LockClosedIcon className="h-8 w-8 text-[#F5AFAF]" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-['Fredoka'] mb-2">
                                Unlock Achievements
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Create a free account to track your level, earn badges, and compete on the global leaderboard!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
