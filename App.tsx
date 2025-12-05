import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChartBarIcon, QuestionMarkCircleIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col bg-[#FCF8F8] dark:bg-gray-900 transition-colors duration-300`}>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#F9DFDF] dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FBEFEF] dark:bg-gray-800 p-2 rounded-xl border border-[#F9DFDF] dark:border-gray-700">
              <ChartBarIcon className="h-6 w-6 text-[#F5AFAF]" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">
              Healthy Habits <span className="text-[#F5AFAF]">Tracker</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs font-medium px-3 py-1 rounded-full bg-[#FBEFEF] dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-[#F9DFDF] dark:border-gray-700 mr-2">
              AI Powered
            </div>
            
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-[#F5AFAF] dark:hover:text-[#F5AFAF] transition-colors rounded-full hover:bg-[#FBEFEF] dark:hover:bg-gray-800"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            <button 
              onClick={() => setShowHelp(true)}
              className="p-2 text-gray-400 hover:text-[#F5AFAF] dark:hover:text-[#F5AFAF] transition-colors rounded-full hover:bg-[#FBEFEF] dark:hover:bg-gray-800"
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-[#F9DFDF] dark:border-gray-800 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 dark:text-gray-600 text-sm font-['Fredoka']">
            &copy; {new Date().getFullYear()} AI Habit Labs 2025. 
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-md w-full p-6 border-2 border-[#F9DFDF] dark:border-gray-700 relative transition-colors duration-300">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-[#F5AFAF]">✨</span> About
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Welcome to your <strong>Healthy Habits Tracker</strong>! This app uses advanced AI to help you balance productivity and wellness.
              </p>
              
              <div className="bg-[#FCF8F8] dark:bg-gray-700/50 p-4 rounded-xl border border-[#F9DFDF] dark:border-gray-600">
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">How it works:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Log your daily sleep, work, and wellness stats.</li>
                  <li>Our algorithm calculates a <strong>Burnout Risk</strong> score.</li>
                  <li>The <strong>AI Coach</strong> generates personalized advice just for you!</li>
                </ul>
              </div>

              <p className="text-sm italic text-center text-gray-400 dark:text-gray-500 mt-4">
                "Small steps every day lead to big changes."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}