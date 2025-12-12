
import React from 'react';
import { CoachAdvice } from '../types';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { STATIC_ASSETS } from '../utils/staticAssets';

interface AICoachProps {
  advice: CoachAdvice | null;
  loading: boolean;
}

export const AICoach: React.FC<AICoachProps> = ({ advice, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-dream-pink/20 dark:border-gray-700 p-10 h-full flex flex-col items-center justify-center text-center animate-pulse transition-colors duration-300">
        <div className="h-20 w-20 bg-dream-pink/10 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <SparklesIcon className="h-8 w-8 text-dream-pink" />
        </div>
        <h3 className="text-gray-700 dark:text-white font-bold font-serif text-2xl mb-2">Consulting Coach...</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs font-sans">Analyzing your day to find the best balance.</p>
      </div>
    );
  }

  if (!advice) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-dream-purple/5 border border-white dark:border-gray-700 p-10 h-full flex flex-col items-center justify-center text-center transition-colors duration-300">
        <div className="h-20 w-20 bg-gradient-to-br from-dream-purple/20 to-dream-blue/20 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <SparklesIcon className="h-8 w-8 text-dream-purple" />
        </div>
        <h3 className="text-gray-700 dark:text-white font-bold font-serif text-2xl mb-2">Hello!</h3>
        <p className="text-gray-400 dark:text-gray-400 font-sans">I'm your wellness coach. Share your stats above to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FFF5F5] to-white dark:from-gray-800 dark:to-gray-900 rounded-[2.5rem] shadow-xl shadow-dream-pink/10 border border-white dark:border-gray-700 p-8 md:p-10 h-full relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-dream-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-dream-pink to-dream-orange rounded-xl shadow-md text-white">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white font-serif">Daily Advice</h2>
        </div>

        <div className="mb-8 relative">
          <span className="absolute -top-4 -left-2 text-6xl text-dream-pink/20 font-serif">"</span>
          <p className="text-xl leading-relaxed font-medium text-gray-700 dark:text-gray-300 font-serif italic relative z-10 px-4">
            {advice.summary}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-dream-pink/10 dark:border-gray-700 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-dream-dark mb-4 ml-1">Action Plan</h3>
          <ul className="space-y-4">
            {advice.actionableSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-7 h-7 bg-dream-green/20 text-dream-green dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold font-sans">
                  {idx + 1}
                </span>
                <span className="text-base font-medium pt-0.5 font-sans">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-800/50 p-4 rounded-2xl border border-dream-blue/20">
            <div className="w-10 h-10 flex-shrink-0">
               <img src={STATIC_ASSETS.coach} alt="Coach" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium italic font-serif">
            {advice.encouragement}
            </p>
        </div>
      </div>
    </div>
  );
};
