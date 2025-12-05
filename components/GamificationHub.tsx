
import React from 'react';
import { UserProgress, LeaderboardEntry } from '../types';
import { GeneratedIcon } from './GeneratedIcon';
import { TrophyIcon, StarIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface GamificationHubProps {
  userProgress: UserProgress;
  leaderboard: LeaderboardEntry[];
}

export const GamificationHub: React.FC<GamificationHubProps> = ({ userProgress, leaderboard }) => {
  const progressPercent = Math.min(100, (userProgress.currentLevelXP / userProgress.nextLevelXP) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Left Column: User Profile & Badges */}
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border-2 border-[#F9DFDF] dark:border-gray-700 p-6 relative overflow-hidden transition-colors duration-300">
           {/* Decorative Background */}
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-[#FBEFEF] dark:bg-gray-700 rounded-full opacity-50 blur-2xl"></div>

           <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full border-4 border-[#F5AFAF] bg-white dark:bg-gray-600 flex items-center justify-center overflow-hidden shadow-md">
                 <GeneratedIcon prompt="cute tomato character doodle thick outlines" fallbackEmoji="🍅" className="w-16 h-16" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                   <div>
                      <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-['Fredoka']">Level {userProgress.level}</h3>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-['Fredoka']">Habit Explorer</h2>
                   </div>
                   <div className="text-right">
                      <span className="text-[#F5AFAF] font-bold text-xl font-['Fredoka']">{userProgress.totalPoints}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">XP</span>
                   </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-4 bg-[#F9DFDF] dark:bg-gray-700 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-[#F5AFAF] rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${progressPercent}%` }}
                   >
                      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
                   </div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-400 dark:text-gray-500 font-medium">
                  {userProgress.nextLevelXP - userProgress.currentLevelXP} XP to next level
                </p>
              </div>
           </div>
        </div>

        {/* Badges Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 transition-colors duration-300">
           <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 font-['Fredoka']">
             <StarIcon className="h-5 w-5 text-yellow-400" /> Achievements
           </h3>
           <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {userProgress.badges.map((badge) => (
                <div key={badge.id} className="group relative flex flex-col items-center">
                   <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        badge.isUnlocked 
                          ? 'bg-[#fff0f0] dark:bg-gray-700 border-[#F5AFAF]' 
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 grayscale opacity-60'
                      }`}
                   >
                      {badge.isUnlocked ? (
                         <GeneratedIcon prompt={badge.iconPrompt} fallbackEmoji="🏆" className="w-10 h-10 drop-shadow-sm" />
                      ) : (
                         <LockClosedIcon className="h-6 w-6 text-gray-300" />
                      )}
                   </div>
                   
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-gray-800 text-white text-xs rounded-lg p-2 text-center z-20 pointer-events-none">
                      <p className="font-bold text-[#F5AFAF] mb-1">{badge.name}</p>
                      <p className="text-gray-300 text-[10px] leading-tight">{badge.description}</p>
                      <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-gray-800"></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right Column: Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-[#F9DFDF] dark:border-gray-700 p-6 flex flex-col h-full transition-colors duration-300">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 font-['Fredoka']">
              <TrophyIcon className="h-5 w-5 text-yellow-500" /> Leaderboard
            </h3>
            <span className="text-xs bg-[#FBEFEF] dark:bg-gray-700 text-[#F5AFAF] px-2 py-1 rounded-md font-bold">Weekly</span>
         </div>

         <div className="flex-1 space-y-3">
            {leaderboard.map((entry) => (
               <div 
                  key={entry.rank}
                  className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${
                     entry.isCurrentUser 
                       ? 'bg-[#fff0f0] dark:bg-gray-700/50 border-[#F5AFAF] scale-[1.02] shadow-sm' 
                       : 'bg-white dark:bg-gray-800 border-transparent hover:border-[#F9DFDF] dark:hover:border-gray-600'
                  }`}
               >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold font-['Fredoka'] ${
                     entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                     entry.rank === 2 ? 'bg-gray-100 text-gray-500' :
                     entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                     'text-gray-400'
                  }`}>
                     {entry.rank}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-600 overflow-hidden border border-gray-100 dark:border-gray-500">
                     <GeneratedIcon prompt={entry.avatarPrompt} fallbackEmoji="👤" className="w-full h-full" />
                  </div>
                  
                  <div className="flex-1">
                     <p className={`font-bold text-sm ${entry.isCurrentUser ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {entry.username}
                     </p>
                  </div>
                  
                  <div className="text-right">
                     <span className="font-bold text-[#F5AFAF] font-['Fredoka']">{entry.points}</span>
                     <span className="text-xs text-gray-400 ml-1">pts</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};
