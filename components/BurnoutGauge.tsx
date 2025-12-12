
import React, { useEffect, useState } from 'react';
import { PredictionResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface BurnoutGaugeProps {
  prediction: PredictionResult;
}

export const BurnoutGauge: React.FC<BurnoutGaugeProps> = ({ prediction }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = [
    { name: 'Score', value: prediction.burnoutScore },
    { name: 'Remaining', value: 10 - prediction.burnoutScore },
  ];

  const getColor = (score: number) => {
    if (score < 4) return '#4ade80'; // Soft Green
    if (score < 6) return '#facc15'; // Soft Yellow
    if (score < 8) return '#fb923c'; // Soft Orange
    return '#f87171'; // Soft Red
  };

  const color = getColor(prediction.burnoutScore);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 h-full flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
        <h2 className="w-full text-lg font-bold text-gray-700 dark:text-white mb-4 flex items-center justify-center gap-2">
            Burnout Risk
        </h2>
      
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#FBEFEF" className="dark:fill-gray-700" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <span className="text-5xl font-extrabold text-gray-700 dark:text-white">{prediction.burnoutScore}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">OUT OF 10</span>
        </div>
      </div>

      <div className="text-center mt-2 z-10">
        <div 
          className="inline-block px-5 py-2 rounded-xl text-sm font-bold shadow-sm"
          style={{ 
            color: '#fff', 
            backgroundColor: color 
          }}
        >
          {prediction.riskLevel} Risk
        </div>
      </div>

      {prediction.contributors.length > 0 && (
        <div className="mt-6 w-full bg-[#FCF8F8] dark:bg-gray-700/50 rounded-2xl p-4 border border-[#F9DFDF] dark:border-gray-600">
            <h4 className="text-xs text-gray-400 dark:text-gray-400 uppercase font-bold mb-2 text-center">Contributors</h4>
            <div className="flex flex-wrap gap-2 justify-center">
                {prediction.contributors.map(c => (
                    <span key={c} className="text-xs bg-white dark:bg-gray-800 border border-[#FBEFEF] dark:border-gray-600 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 shadow-sm">
                        {c}
                    </span>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
