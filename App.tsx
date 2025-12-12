
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProfileView } from './components/ProfileView';
import { 
  QuestionMarkCircleIcon, 
  XMarkIcon, 
  FireIcon, 
  PlusIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import { SettingsModal } from './components/SettingsModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { QuickLogModal } from './components/QuickLogModal';

type ViewType = 'dashboard' | 'profile';

// Inner component to use the AuthContext
const AppContent = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Routing State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Calculate XP percentage for header bar
  const xpPercent = user 
    ? Math.min(100, Math.max(0, (user.progress.currentLevelXP / user.progress.nextLevelXP) * 100))
    : 0;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans`}>
      
      {/* COMMAND CENTER HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-dream-pink/20 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center">
          
          {/* LEFT: Branding */}
          <div 
             className="flex items-center gap-2 md:gap-3 cursor-pointer group justify-self-start" 
             onClick={() => setCurrentView('dashboard')}
          >
            <div className="bg-dream-pink/20 dark:bg-gray-800 p-2 rounded-full border border-dream-pink group-hover:rotate-12 transition-transform duration-300">
              <SparklesIcon className="h-6 w-6 text-dream-pink" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-white tracking-tight hidden sm:block font-serif">
              HabitHero
            </h1>
          </div>

          {/* CENTER: Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-full border border-dream-blue/30 dark:border-gray-700/50 justify-self-center shadow-inner">
             <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentView === 'dashboard' 
                    ? 'bg-gradient-to-r from-dream-pink to-dream-orange text-white shadow-md' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-dream-pink dark:hover:text-gray-200'
                }`}
             >
                Dashboard
             </button>
             <button 
                onClick={() => setCurrentView('profile')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentView === 'profile' 
                    ? 'bg-gradient-to-r from-dream-green to-dream-blue text-white shadow-md' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-dream-blue dark:hover:text-gray-200'
                }`}
             >
                Profile
             </button>
          </nav>

          {/* RIGHT: Status & Actions */}
          <div className="flex items-center gap-3 justify-self-end">
            
            {user ? (
               <>
                 {/* Streak */}
                 <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dream-orange/20 dark:bg-orange-900/20 border border-dream-orange/50 dark:border-orange-900/50" title="Current Streak">
                    <FireIcon className="h-5 w-5 text-dream-orange animate-pulse" />
                    <span className="text-sm font-bold text-gray-700 dark:text-orange-300 font-serif">{user.progress.streak}</span>
                 </div>

                 {/* XP Bar */}
                 <div className="hidden lg:flex flex-col w-24 gap-1">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        <span>Lvl {user.progress.level}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600">
                        <div 
                            className="h-full bg-gradient-to-r from-dream-pink to-dream-purple rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${xpPercent}%` }}
                        />
                    </div>
                 </div>

                 <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                 {/* Quick Add Button */}
                 <button 
                    onClick={() => setShowQuickLog(true)}
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-dream-pink to-dream-orange hover:from-dream-orange hover:to-dream-pink text-white rounded-full shadow-lg shadow-dream-pink/30 transition-all hover:scale-105 active:scale-95 group"
                    title="Quick Log"
                 >
                    <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                 </button>

                 <UserMenu user={user} onLogout={logout} onOpenSettings={() => setShowSettings(true)} />
               </>
            ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-dream-dark hover:bg-black text-white text-sm font-bold rounded-full shadow-lg transition-all"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Log In
                </button>
            )}

            {!user && (
                 <button 
                 onClick={() => setShowSettings(true)}
                 className="p-2 text-gray-400 hover:text-dream-pink dark:hover:text-white transition-colors rounded-full hover:bg-dream-pink/10 dark:hover:bg-gray-800"
               >
                 <QuestionMarkCircleIcon className="h-6 w-6" />
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow scroll-smooth relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {currentView === 'dashboard' ? (
             <Dashboard />
          ) : (
             <ProfileView />
          )}
        </div>
      </main>

      <footer className="bg-white/60 dark:bg-gray-900 border-t border-dream-pink/20 dark:border-gray-800 py-10 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2">
                 <SparklesIcon className="h-5 w-5 text-dream-purple" />
                 <span className="font-bold font-serif text-gray-700 dark:text-white">HabitHero</span>
              </div>
              <p className="text-gray-400 dark:text-gray-600 text-sm font-sans text-center">
                &copy; {new Date().getFullYear()} Designed for Calmness.
              </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
      
      <QuickLogModal 
        isOpen={showQuickLog}
        onClose={() => setShowQuickLog(false)}
      />

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl max-w-md w-full p-6 border border-dream-pink/30 dark:border-gray-700 relative transition-colors duration-300">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-4 flex items-center gap-2 font-serif">
              <span className="text-dream-pink">✨</span> About
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300 font-sans">
              <p>
                Welcome to <strong>HabitHero</strong>!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
