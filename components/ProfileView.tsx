
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GamificationHub } from './GamificationHub';
import { LeaderboardEntry } from '../types';
import { generateMockLeaderboard } from '../utils/gamification';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export const ProfileView: React.FC = () => {
    const { user, updateUserAvatar } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const points = user ? user.progress.totalPoints : 0;
        const avatarPrompt = user ? user.avatarPrompt : 'cute tomato character doodle thick outlines';
        setLeaderboard(generateMockLeaderboard(points, avatarPrompt));
    }, [user]);

    if (!user) {
        return (
             <div className="relative w-full max-w-4xl mx-auto mt-8">
                {/* Blurred Background Preview */}
                <div className="filter blur-md opacity-50 pointer-events-none select-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-[#F9DFDF] h-full"></div>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-[#F9DFDF] h-full"></div>
                        </div>
                </div>
                
                {/* Call to Action Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border-2 border-[#F9DFDF] dark:border-gray-700 max-w-md">
                        <div className="w-16 h-16 bg-[#FBEFEF] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LockClosedIcon className="h-8 w-8 text-[#F5AFAF]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 dark:text-white font-serif mb-2">
                            Unlock Your Profile
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Create a free account to unlock Achievements, Leaderboards, and customize your AI Avatar!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <GamificationHub 
                userProgress={user.progress} 
                leaderboard={leaderboard} 
                userAvatarPrompt={user.avatarPrompt}
                onUpdateAvatar={updateUserAvatar}
            />
        </div>
    );
};
