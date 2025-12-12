
import React, { useMemo } from 'react';
import { DailyLog } from '../types';
import { analyzeCorrelations } from '../utils/correlation';
import { PresentationChartLineIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/solid';

interface CorrelationWidgetProps {
  history: DailyLog[];
}

export const CorrelationWidget: React.FC<CorrelationWidgetProps> = ({ history }) => {
  const correlations = useMemo(() => analyzeCorrelations(history), [history]);

  if (history.length < 3) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] transition-colors duration-300">
         <PresentationChartLineIcon className="h-10 w-10 text-gray-300 mb-3" />
         <h3 className="font-bold text-gray-500 dark:text-gray-400 font-serif">Not enough data</h3>
         <p className="text-xs text-gray-400 mt-1">
             Track habits for 3+ days to unlock AI Correlation insights.
         </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 h-full transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-[#FBEFEF] dark:bg-gray-700 rounded-lg">
             <PresentationChartLineIcon className="h-5 w-5 text-[#F5AFAF]" />
        </div>
        <div>
            <h3 className="font-bold text-gray-700 dark:text-white font-serif">Smart Correlations</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">Data Science Engine</p>
        </div>
      </div>

      <div className="space-y-3">
        {correlations.length > 0 ? (
            correlations.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                    <div className={`p-1.5 rounded-full ${
                        item.type === 'positive' ? 'bg-green-100 text-green-500' :
                        item.type === 'negative' ? 'bg-red-100 text-red-500' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                        {item.type === 'positive' && <ArrowTrendingUpIcon className="h-4 w-4" />}
                        {item.type === 'negative' && <ArrowTrendingDownIcon className="h-4 w-4" />}
                        {item.type === 'neutral' && <MinusIcon className="h-4 w-4" />}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight">
                            {item.description}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            Pearson r: <span className={item.coefficient > 0 ? 'text-green-500' : 'text-red-500'}>{item.coefficient}</span>
                        </p>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                No strong correlations found yet. Keep tracking!
            </div>
        )}
      </div>
    </div>
  );
};
