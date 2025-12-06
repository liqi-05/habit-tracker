
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProfileView } from './components/ProfileView';
import { 
  QuestionMarkCircleIcon, 
  XMarkIcon, 
  FireIcon, 
  PlusIcon,
  UserCircleIcon,
  BoltIcon
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

  const handleToast = (msg: string) => {
      alert(msg); // Placeholder for a real toast
  };

  // Calculate XP percentage for header bar
  const xpPercent = user 
    ? Math.min(100, Math.max(0, (user.progress.currentLevelXP / user.progress.nextLevelXP) * 100))
    : 0;

  return (
    <div className={`min-h-screen flex flex-col bg-[#FCF8F8] dark:bg-gray-900 transition-colors duration-300`}>
      
      {/* COMMAND CENTER HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-[#F9DFDF] dark:border-gray-800 transition-colors duration-300 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center">
          
          {/* LEFT: Branding (Align Start) */}
          <div 
             className="flex items-center gap-2 md:gap-3 cursor-pointer group justify-self-start" 
             onClick={() => setCurrentView('dashboard')}
          >
            <div className="bg-[#FBEFEF] dark:bg-gray-800 p-1.5 md:p-2 rounded-xl border border-[#F9DFDF] dark:border-gray-700 group-hover:scale-105 transition-transform">
              <BoltIcon className="h-5 w-5 md:h-6 md:w-6 text-[#F5AFAF]" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight hidden sm:block font-['Fredoka']">
              HabitFlow
            </h1>
          </div>

          {/* CENTER: Navigation (Align Center) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FBEFEF]/50 dark:bg-gray-800/50 p-1 rounded-full border border-[#F9DFDF]/50 dark:border-gray-700/50 justify-self-center">
             <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    currentView === 'dashboard' 
                    ? 'bg-white dark:bg-gray-700 text-[#F5AFAF] shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
             >
                Dashboard
             </button>
             <button 
                onClick={() => setCurrentView('profile')}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    currentView === 'profile' 
                    ? 'bg-white dark:bg-gray-700 text-[#F5AFAF] shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
             >
                Profile
             </button>
          </nav>

          {/* RIGHT: Status & Actions (Align End, Compacted) */}
          <div className="flex items-center gap-2 md:gap-3 justify-self-end">
            
            {user ? (
               <>
                 {/* Streak - Compact */}
                 <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50" title="Current Streak">
                    <FireIcon className="h-4 w-4 text-orange-500 animate-pulse" />
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300 font-['Fredoka']">{user.progress.streak}</span>
                 </div>

                 {/* XP Bar - Compact */}
                 <div className="hidden lg:flex flex-col w-20 gap-0.5">
                    <div className="flex justify-between text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        <span>Lvl {user.progress.level}</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#F5AFAF] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${xpPercent}%` }}
                        />
                    </div>
                 </div>

                 {/* Divider */}
                 <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                 {/* Quick Add Button - Smaller */}
                 <button 
                    onClick={() => setShowQuickLog(true)}
                    className="flex items-center justify-center w-8 h-8 bg-[#F5AFAF] hover:bg-[#eb9a9a] text-white rounded-full shadow-md shadow-[#F5AFAF]/20 transition-transform active:scale-95 group"
                    title="Quick Log"
                 >
                    <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                 </button>

                 {/* Avatar Dropdown */}
                 <UserMenu user={user} onLogout={logout} onOpenSettings={() => setShowSettings(true)} />
               </>
            ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5AFAF] hover:bg-[#eb9a9a] text-white text-xs font-bold rounded-full shadow-md shadow-[#F5AFAF]/30 transition-all font-['Fredoka']"
                >
                  <UserCircleIcon className="h-4 w-4" />
                  Log In
                </button>
            )}

            {!user && (
                 <button 
                 onClick={() => setShowSettings(true)}
                 className="p-1.5 text-gray-400 hover:text-[#F5AFAF] dark:hover:text-[#F5AFAF] transition-colors rounded-full hover:bg-[#FBEFEF] dark:hover:bg-gray-800"
               >
                 <QuestionMarkCircleIcon className="h-5 w-5" />
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Handles Routing */}
      <main className="flex-grow scroll-smooth relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'dashboard' ? (
             <Dashboard />
          ) : (
             <ProfileView />
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-[#F9DFDF] dark:border-gray-800 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <BoltIcon className="h-5 w-5 text-[#F5AFAF]" />
                 <span className="font-bold text-gray-800 dark:text-white">HabitFlow</span>
              </div>
              <p className="text-gray-400 dark:text-gray-600 text-sm font-['Fredoka']">
                &copy; {new Date().getFullYear()} HabitFlow Labs.
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
                Welcome to <strong>HabitFlow</strong>!
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
