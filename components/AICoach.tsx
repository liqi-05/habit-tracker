import React from 'react';
import { CoachAdvice } from '../types';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { GeneratedIcon } from './GeneratedIcon';

interface AICoachProps {
  advice: CoachAdvice | null;
  loading: boolean;
}

export const AICoach: React.FC<AICoachProps> = ({ advice, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-8 h-full flex flex-col items-center justify-center text-center animate-pulse transition-colors duration-300">
        <div className="h-16 w-16 bg-[#FBEFEF] dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <SparklesIcon className="h-8 w-8 text-[#F5AFAF]" />
        </div>
        <h3 className="text-gray-800 dark:text-white font-bold text-xl mb-2">Consulting Coach...</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">Analyzing your day to find the best balance.</p>
      </div>
    );
  }

  if (!advice) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-8 h-full flex flex-col items-center justify-center text-center transition-colors duration-300">
        <div className="h-16 w-16 bg-[#FBEFEF] dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <SparklesIcon className="h-8 w-8 text-[#F5AFAF]" />
        </div>
        <h3 className="text-gray-800 dark:text-white font-bold text-xl mb-2">Hello!</h3>
        <p className="text-gray-500 dark:text-gray-400">I'm your wellness coach. Share your stats above to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FBEFEF] to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 md:p-8 h-full relative overflow-hidden transition-colors duration-300">
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#F5AFAF] rounded-lg shadow-sm">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Daily Advice</h2>
        </div>

        <div className="mb-8">
          <p className="text-lg leading-relaxed font-medium text-gray-700 dark:text-gray-300">
            "{advice.summary}"
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-[#F9DFDF] dark:border-gray-700 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5AFAF] mb-4">Steps to take</h3>
          <ul className="space-y-4">
            {advice.actionableSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 bg-[#FBEFEF] dark:bg-gray-700 text-[#F5AFAF] rounded-full flex items-center justify-center text-xs font-bold border border-[#F9DFDF] dark:border-gray-600">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 bg-[#FCF8F8] dark:bg-gray-800/50 p-4 rounded-xl border border-[#FBEFEF] dark:border-gray-700">
            <div className="w-8 h-8 flex-shrink-0">
               <GeneratedIcon prompt="cute mochi style flexed muscle arm symbol" fallbackEmoji="💪" className="w-full h-full" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium italic">
            {advice.encouragement}
            </p>
        </div>
      </div>
    </div>
  );
};