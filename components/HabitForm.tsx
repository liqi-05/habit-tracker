
import React from 'react';
import { DailyStats } from '../types';
import { STATIC_ASSETS } from '../utils/staticAssets';

interface HabitFormProps {
  stats: DailyStats;
  onChange: (stats: DailyStats) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({ stats, onChange, onSubmit, isAnalyzing }) => {
  const handleChange = (field: keyof DailyStats, value: any) => {
    onChange({ ...stats, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm border-2 border-[#F9DFDF] dark:border-gray-700 p-6 md:p-8 relative overflow-hidden transition-colors duration-300">
       {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F5AFAF] via-[#F9DFDF] to-[#F5AFAF] opacity-50"></div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#FBEFEF] dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-inner border border-[#F9DFDF] dark:border-gray-600">
          <img src={STATIC_ASSETS.habits.clipboard} alt="Clipboard" className="w-10 h-10 object-contain" />
        </div>
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-wide font-['Fredoka']">
            Daily Check-in
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider font-['Inter']">Track your progress</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Sliders Container with dashed border - Increased padding to fix "weird border" */}
        <div className="border-2 border-dashed border-[#F5AFAF]/40 dark:border-gray-600 rounded-3xl p-8 bg-[#FCF8F8]/50 dark:bg-gray-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
            <div className="space-y-3 group">
                <div className="flex justify-between items-end">
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-['Fredoka']">Sleep</label>
                <span className="text-lg font-bold text-[#F5AFAF] bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-[#F9DFDF] dark:border-gray-700 font-['Fredoka']">{stats.sleepHours}h</span>
                </div>
                <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={stats.sleepHours}
                onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
                className="w-full rounded-full h-3 cursor-pointer"
                style={{ background: `linear-gradient(to right, #F5AFAF 0%, #F5AFAF ${(stats.sleepHours/12)*100}%, #e5e7eb ${(stats.sleepHours/12)*100}%, #e5e7eb 100%)` }}
                />
            </div>

            <div className="space-y-3 group">
                <div className="flex justify-between items-end">
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-['Fredoka']">Coding</label>
                <span className="text-lg font-bold text-[#F5AFAF] bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-[#F9DFDF] dark:border-gray-700 font-['Fredoka']">{stats.codingHours}h</span>
                </div>
                <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                value={stats.codingHours}
                onChange={(e) => handleChange('codingHours', parseFloat(e.target.value))}
                className="w-full rounded-full h-3 cursor-pointer"
                style={{ background: `linear-gradient(to right, #F5AFAF 0%, #F5AFAF ${(stats.codingHours/16)*100}%, #e5e7eb ${(stats.codingHours/16)*100}%, #e5e7eb 100%)` }}
                />
            </div>

            <div className="space-y-3 group">
                <div className="flex justify-between items-end">
                <label className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-['Fredoka']">Water</label>
                <span className="text-lg font-bold text-[#F5AFAF] bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-[#F9DFDF] dark:border-gray-700 font-['Fredoka']">{stats.waterIntake}L</span>
                </div>
                <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={stats.waterIntake}
                onChange={(e) => handleChange('waterIntake', parseFloat(e.target.value))}
                className="w-full rounded-full h-3 cursor-pointer"
                style={{ background: `linear-gradient(to right, #F5AFAF 0%, #F5AFAF ${(stats.waterIntake/5)*100}%, #e5e7eb ${(stats.waterIntake/5)*100}%, #e5e7eb 100%)` }}
                />
            </div>

            <div className="space-y-3 group">
                <div className="flex justify-between items-end">
                    <label className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-['Fredoka']">Stress</label>
                    <span className="text-lg font-bold text-[#F5AFAF] bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-[#F9DFDF] dark:border-gray-700 font-['Fredoka']">{stats.stressLevel}/10</span>
                </div>
                <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={stats.stressLevel}
                onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
                className="w-full rounded-full h-3 cursor-pointer"
                style={{ background: `linear-gradient(to right, #F5AFAF 0%, #F5AFAF ${(stats.stressLevel/10)*100}%, #e5e7eb ${(stats.stressLevel/10)*100}%, #e5e7eb 100%)` }}
                />
            </div>

            {/* Mood Section with Icons */}
            <div className="col-span-1 md:col-span-2 space-y-6 pt-6 border-t-2 border-dashed border-[#F5AFAF]/30 dark:border-gray-600 mt-2">
                <div className="flex justify-between items-center">
                    <label className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-['Fredoka']">How do you feel?</label>
                    <div className="flex items-center gap-2 bg-[#FBEFEF] dark:bg-gray-700 px-4 py-1.5 rounded-full border border-[#F9DFDF] dark:border-gray-600">
                        <span className="text-lg font-bold text-[#F5AFAF] font-['Fredoka']">{stats.mood}/10</span>
                    </div>
                </div>
                
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={stats.mood}
                    onChange={(e) => handleChange('mood', parseInt(e.target.value))}
                    className="w-full rounded-full h-3 cursor-pointer"
                    style={{ background: `linear-gradient(to right, #F5AFAF 0%, #F5AFAF ${(stats.mood/10)*100}%, #e5e7eb ${(stats.mood/10)*100}%, #e5e7eb 100%)` }}
                />
                
                <div className="flex justify-between px-2">
                    <button 
                        onClick={() => handleChange('mood', 3)}
                        className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${stats.mood <= 4 ? 'opacity-100 scale-110' : 'opacity-50 grayscale'}`}
                    >
                         <div className="w-10 h-10">
                            <img src={STATIC_ASSETS.mood.sad} alt="Sad" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-['Fredoka']">Sad</span>
                    </button>
                    <button 
                         onClick={() => handleChange('mood', 6)}
                         className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${stats.mood > 4 && stats.mood < 8 ? 'opacity-100 scale-110' : 'opacity-50 grayscale'}`}
                    >
                        <div className="w-10 h-10">
                           <img src={STATIC_ASSETS.mood.neutral} alt="Neutral" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-['Fredoka']">Neutral</span>
                    </button>
                    <button 
                         onClick={() => handleChange('mood', 9)}
                         className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${stats.mood >= 8 ? 'opacity-100 scale-110' : 'opacity-50 grayscale'}`}
                    >
                         <div className="w-10 h-10">
                            <img src={STATIC_ASSETS.mood.happy} alt="Happy" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-['Fredoka']">Happy</span>
                    </button>
                </div>
            </div>

            </div>
        </div>

        {/* Toggles Section */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleChange('didExercise', !stats.didExercise)}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 group ${
              stats.didExercise 
                ? 'border-[#F5AFAF] bg-[#fff0f0] dark:bg-gray-700 dark:border-[#F5AFAF] shadow-md' 
                : 'border-[#F9DFDF] dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 hover:border-[#F5AFAF]/50 hover:bg-white dark:hover:bg-gray-700'
            }`}
          >
            <div className={`w-14 h-14 transition-transform group-hover:scale-110 duration-300`}>
              <img src={STATIC_ASSETS.habits.exercise} alt="Exercise" className="w-full h-full object-contain" />
            </div>
            <span className={`font-bold text-sm font-['Fredoka'] ${stats.didExercise ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>Exercised</span>
          </button>

          <button
            onClick={() => handleChange('didRead', !stats.didRead)}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 group ${
              stats.didRead 
                ? 'border-[#F5AFAF] bg-[#fff0f0] dark:bg-gray-700 dark:border-[#F5AFAF] shadow-md' 
                : 'border-[#F9DFDF] dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 hover:border-[#F5AFAF]/50 hover:bg-white dark:hover:bg-gray-700'
            }`}
          >
             <div className={`w-14 h-14 transition-transform group-hover:scale-110 duration-300`}>
               <img src={STATIC_ASSETS.habits.read} alt="Read" className="w-full h-full object-contain" />
            </div>
            <span className={`font-bold text-sm font-['Fredoka'] ${stats.didRead ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>Read Book</span>
          </button>
        </div>

        <button
          onClick={onSubmit}
          disabled={isAnalyzing}
          className="w-full mt-2 bg-[#F5AFAF] hover:bg-[#eb9a9a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#F5AFAF]/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-xl font-['Fredoka'] tracking-wide"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Habits'
          )}
        </button>
      </div>
    </div>
  );
};
