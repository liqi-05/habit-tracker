
import React, { useMemo } from 'react';
import { DailyLog } from '../types';
import { analyzeCorrelations } from '../utils/correlation';
import { LightBulbIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

interface SmartInsightCardProps {
  history: DailyLog[];
  isVisible: boolean;
}

export const SmartInsightCard: React.FC<SmartInsightCardProps> = ({ history, isVisible }) => {
  // We re-run analysis whenever history changes (which happens on submit)
  // We grab the #1 strongest correlation to show as the "Discovery"
  const topInsight = useMemo(() => {
    const results = analyzeCorrelations(history);
    return results.length > 0 ? results[0] : null;
  }, [history]);

  if (!isVisible || !topInsight) return null;

  return (
    <div className="mb-8 animate-fade-in-up">
        <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 border-2 border-violet-200 dark:border-violet-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-xl"></div>
            
            <div className="flex items-start gap-4 relative z-10">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm">
                    <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md">
                            New Discovery
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-white font-serif mb-1">
                         "{topInsight.description}"
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>
                            Your data shows a 
                            <strong className={topInsight.coefficient > 0 ? "text-green-600 dark:text-green-400 mx-1" : "text-red-500 dark:text-red-400 mx-1"}>
                                {topInsight.coefficient > 0 ? "positive" : "negative"} link ({Math.abs(topInsight.coefficient)})
                            </strong>
                             between {topInsight.featureA} and {topInsight.featureB}.
                        </span>
                        {topInsight.type === 'positive' && <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />}
                        {topInsight.type === 'negative' && <ArrowTrendingDownIcon className="h-4 w-4 text-gray-400" />}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
