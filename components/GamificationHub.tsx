
import React, { useState } from 'react';
import { UserProgress, LeaderboardEntry } from '../types';
import { GeneratedIcon } from './GeneratedIcon';
import { TrophyIcon, StarIcon, LockClosedIcon, PencilIcon } from '@heroicons/react/24/solid';
import { AvatarEditorModal } from './AvatarEditorModal';

interface GamificationHubProps {
  userProgress: UserProgress;
  leaderboard: LeaderboardEntry[];
  userAvatarPrompt: string;
  onUpdateAvatar?: (prompt: string) => void;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({ userProgress, leaderboard, userAvatarPrompt, onUpdateAvatar }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const progressPercent = Math.min(100, (userProgress.currentLevelXP / userProgress.nextLevelXP) * 100);

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: User Profile & Badges */}
      <div className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-dream-pink/5 border border-white dark:border-gray-700 p-8 relative overflow-hidden transition-colors duration-300">
           {/* Decorative Background */}
           <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-dream-pink/20 to-dream-orange/20 rounded-full blur-3xl"></div>

           <div className="flex items-center gap-8 relative z-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-dream-yellow/20 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                   <GeneratedIcon prompt={userAvatarPrompt} fallbackEmoji="🍅" className="w-20 h-20" />
                </div>
                {onUpdateAvatar && (
                    <button 
                        onClick={() => setIsEditorOpen(true)}
                        className="absolute bottom-0 right-0 bg-dream-dark text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-end mb-3">
                   <div>
                      <h3 className="text-xs font-bold text-dream-dark uppercase tracking-widest mb-1">Level {userProgress.level}</h3>
                      <h2 className="text-3xl font-bold text-gray-700 dark:text-white font-serif">Habit Explorer</h2>
                   </div>
                   <div className="text-right">
                      <span className="text-dream-pink font-bold text-2xl font-serif">{userProgress.totalPoints}</span>
                      <span className="text-xs text-gray-400 ml-1 font-sans font-bold uppercase">XP</span>
                   </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600">
                   <div 
                      className="h-full bg-gradient-to-r from-dream-pink to-dream-purple rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${progressPercent}%` }}
                   >
                      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
                   </div>
                </div>
                <p className="text-xs text-right mt-2 text-gray-400 font-medium font-sans">
                  {userProgress.nextLevelXP - userProgress.currentLevelXP} XP to next level
                </p>
              </div>
           </div>
        </div>

        {/* Badges Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-white dark:border-gray-700 p-8 transition-colors duration-300">
           <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-6 flex items-center gap-2 font-serif">
             <StarIcon className="h-6 w-6 text-dream-yellow" /> Achievements
           </h3>
           <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {userProgress.badges.map((badge) => (
                <div key={badge.id} className="group relative flex flex-col items-center">
                   <div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        badge.isUnlocked 
                          ? 'bg-dream-purple/10 dark:bg-gray-700 border-dream-purple' 
                          : 'bg-gray-50 dark:bg-gray-900 border-transparent grayscale opacity-50'
                      }`}
                   >
                      {badge.isUnlocked ? (
                         <img src={badge.icon} alt={badge.name} className="w-10 h-10 object-contain drop-shadow-sm transition-transform group-hover:scale-110" />
                      ) : (
                         <LockClosedIcon className="h-6 w-6 text-gray-300" />
                      )}
                   </div>
                   
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-3 hidden group-hover:block w-36 bg-gray-800 text-white text-xs rounded-xl p-3 text-center z-20 pointer-events-none shadow-xl">
                      <p className="font-bold text-dream-pink mb-1 font-serif">{badge.name}</p>
                      <p className="text-gray-300 text-[10px] leading-tight font-sans">{badge.description}</p>
                      <div className="absolute top-full left-1/2 -ml-2 border-4 border-transparent border-t-gray-800"></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right Column: Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-dream-blue/5 border border-white dark:border-gray-700 p-8 flex flex-col h-full transition-colors duration-300">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-700 dark:text-white flex items-center gap-2 font-serif">
              <TrophyIcon className="h-6 w-6 text-dream-orange" /> Leaderboard
            </h3>
            <span className="text-xs bg-dream-blue/10 dark:bg-gray-700 text-dream-blue px-3 py-1 rounded-full font-bold uppercase tracking-wider">Weekly</span>
         </div>

         <div className="flex-1 space-y-4">
            {leaderboard.map((entry) => (
               <div 
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                     entry.isCurrentUser 
                       ? 'bg-dream-pink/5 dark:bg-gray-700/50 border-dream-pink scale-[1.02] shadow-sm' 
                       : 'bg-white dark:bg-gray-800 border-transparent hover:border-gray-100 dark:hover:border-gray-600'
                  }`}
               >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold font-serif ${
                     entry.rank === 1 ? 'bg-dream-yellow text-yellow-700' :
                     entry.rank === 2 ? 'bg-gray-100 text-gray-500' :
                     entry.rank === 3 ? 'bg-dream-orange text-orange-700' :
                     'text-gray-400'
                  }`}>
                     {entry.rank}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-600 overflow-hidden border-2 border-white dark:border-gray-500 flex items-center justify-center shadow-sm">
                     {entry.isCurrentUser ? (
                         <GeneratedIcon prompt={userAvatarPrompt} fallbackEmoji="👤" className="w-full h-full" />
                     ) : (
                         <img src={entry.avatar} alt={entry.username} className="w-full h-full object-cover" />
                     )}
                  </div>
                  
                  <div className="flex-1">
                     <p className={`font-bold text-sm font-sans ${entry.isCurrentUser ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {entry.username}
                     </p>
                  </div>
                  
                  <div className="text-right">
                     <span className="font-bold text-dream-pink font-serif">{entry.points}</span>
                     <span className="text-xs text-gray-400 ml-1 font-sans">pts</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
    
    {/* Editor Modal */}
    {onUpdateAvatar && (
        <AvatarEditorModal 
            isOpen={isEditorOpen} 
            onClose={() => setIsEditorOpen(false)} 
            currentPrompt={userAvatarPrompt}
            onSave={onUpdateAvatar}
        />
    )}
    </>
  );
};
