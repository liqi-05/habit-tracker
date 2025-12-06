
import React from 'react';
import { DailyLog } from '../types';

interface HeatmapProps {
  history: DailyLog[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ history }) => {
  // Generate last 150 days roughly
  const generateDays = () => {
    const days = [];
    const today = new Date();
    // Start from 5 months ago
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 5);
    
    // Normalize to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(today);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const days = generateDays();

  const getIntensity = (dateStr: string) => {
    const log = history.find(h => h.date === dateStr);
    if (!log) return 0;
    
    // Normalize based on points (max expected ~100)
    if (log.pointsEarned > 80) return 4;
    if (log.pointsEarned > 50) return 3;
    if (log.pointsEarned > 20) return 2;
    return 1;
  };

  const getTooltip = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const log = history.find(h => h.date === dateStr);
    if (!log) return `No activity on ${date.toLocaleDateString()}`;
    return `${log.pointsEarned} XP on ${date.toLocaleDateString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 dark:text-white font-['Fredoka']">Consistency Graph</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-[#fcd5d5]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#f9afaf]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#f58a8a]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#ef4444]"></div>
            </div>
            <span>More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
            {days.map((date, i) => {
                const dateStr = date.toISOString().split('T')[0];
                const intensity = getIntensity(dateStr);
                
                const colors = [
                    'bg-gray-100 dark:bg-gray-700', // 0
                    'bg-[#fcd5d5] dark:bg-red-900/30', // 1
                    'bg-[#f9afaf] dark:bg-red-800/50', // 2
                    'bg-[#f58a8a] dark:bg-red-600/60', // 3
                    'bg-[#ef4444] dark:bg-red-500', // 4
                ];

                return (
                    <div 
                        key={i}
                        className={`w-3 h-3 rounded-sm ${colors[intensity]} transition-colors group relative`}
                    >
                         {/* Tooltip */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap z-20">
                            <div className="bg-gray-800 text-white text-[10px] rounded px-2 py-1 shadow-lg">
                                {getTooltip(date)}
                            </div>
                         </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};
