
import React, { useState } from 'react';
import { DailyStats, PredictionResult, CoachAdvice } from '../types';
import { HabitForm } from './HabitForm';
import { BurnoutGauge } from './BurnoutGauge';
import { AICoach } from './AICoach';
import { CorrelationWidget } from './CorrelationWidget';
import { Heatmap } from './Heatmap';
import { SmartInsightCard } from './SmartInsightCard';
import { predictor } from '../utils/predictor';
import { getCoachAdvice } from '../services/geminiService';
import { calculateDailyPoints, checkNewBadges, getLevelInfo } from '../utils/gamification';
import { FireIcon } from '@heroicons/react/24/solid';
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
  const { user, updateUserProgress, saveDailyLog } = useAuth();
  
  const [stats, setStats] = useState<DailyStats>(INITIAL_STATS);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [advice, setAdvice] = useState<CoachAdvice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  
  // Local state for non-logged in users (streak only)
  const [localStreak, setLocalStreak] = useState(0); 

  const handleRunAnalysis = async () => {
    setIsProcessing(true);
    setShowInsight(false); // Reset insight visibility
    
    // 1. Run "ML" Prediction (Local)
    const result = predictor.predict(stats);
    setPrediction(result);

    // 2. Gamification & Data Persistence
    if (user) {
        const earnedPoints = calculateDailyPoints(stats);
        
        // Save Time-Series Data for Correlation Engine
        saveDailyLog(stats, earnedPoints);

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
        
        // Trigger Smart Insight Card after a short delay for effect
        setTimeout(() => setShowInsight(true), 500);
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
    <div className="space-y-8 animate-fade-in-up">
        {/* ANALYSIS SECTION */}
        <section className="space-y-6">
            {/* Streak Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-white font-serif">Today's Analysis</h2>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-900 shadow-sm">
                    <FireIcon className="h-5 w-5 text-orange-500 animate-pulse" />
                    <span className="text-orange-800 dark:text-orange-200 font-bold font-serif">
                        {currentStreak} Day Streak!
                    </span>
                </div>
            </div>

            {/* Smart Insight Card (Appears after analysis) */}
            {user && (
                <SmartInsightCard history={user.history} isVisible={showInsight} />
            )}

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
                <div className="lg:col-span-1 h-full flex flex-col gap-6">
                    {prediction ? (
                        <BurnoutGauge prediction={prediction} />
                    ) : (
                        <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border-2 border-[#F9DFDF] dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center gap-4 transition-colors duration-300 min-h-[300px]">
                            <div className="text-6xl opacity-20 animate-bounce-slow">🎯</div>
                            <p className="text-gray-400 dark:text-gray-500 font-medium font-serif text-lg">
                                Fill out your daily check-in<br/>to get your wellness score!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Analytics Row (Authenticated Only) */}
            {user && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Heatmap history={user.history} />
                    </div>
                    <div className="lg:col-span-1">
                        <CorrelationWidget history={user.history} />
                    </div>
                </div>
            )}

            {/* AI Coach */}
            <div className="w-full">
                <AICoach advice={advice} loading={isProcessing} />
            </div>
        </section>
    </div>
  );
};
