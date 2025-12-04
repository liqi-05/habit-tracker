import React from 'react';
import { XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full p-6 border-2 border-[#F9DFDF] dark:border-gray-700 relative transition-colors duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 font-['Fredoka']">
          Settings
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#FCF8F8] dark:bg-gray-700/50 rounded-2xl border border-[#F9DFDF] dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-100 text-orange-400'}`}>
                {isDarkMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isDarkMode ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 font-['Fredoka']">
             v1.2.0 • Healthy Habits Tracker
          </div>
        </div>
      </div>
    </div>
  );
};