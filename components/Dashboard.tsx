import React, { useState } from 'react';
import { DailyStats, PredictionResult, CoachAdvice } from '../types';
import { HabitForm } from './HabitForm';
import { BurnoutGauge } from './BurnoutGauge';
import { AICoach } from './AICoach';
import { predictor } from '../utils/predictor';
import { getCoachAdvice } from '../services/geminiService';
import { FireIcon } from '@heroicons/react/24/solid';

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
  const [stats, setStats] = useState<DailyStats>(INITIAL_STATS);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [advice, setAdvice] = useState<CoachAdvice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extra Feature: Mock Streak
  const [streak, setStreak] = useState(3); 

  const handleRunAnalysis = async () => {
    setIsProcessing(true);
    
    // 1. Run "ML" Prediction (Local)
    const result = predictor.predict(stats);
    setPrediction(result);

    // 2. Get AI Advice (Gemini API)
    try {
        const coachAdvice = await getCoachAdvice(stats, result);
        setAdvice(coachAdvice);
        
        // Simulate increasing streak on successful check-in
        setStreak(prev => prev + 1);
    } catch (e) {
        console.error("Failed to get advice", e);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
        {/* Streak Header - Extra Feature */}
        <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-900 shadow-sm">
                <FireIcon className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="text-orange-800 dark:text-orange-200 font-bold font-['Fredoka']">{streak} Day Streak!</span>
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

        {/* Bottom Row: AI Coach */}
        <div className="w-full">
            <AICoach advice={advice} loading={isProcessing} />
        </div>
    </div>
  );
};