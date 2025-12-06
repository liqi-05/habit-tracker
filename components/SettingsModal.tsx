
import React, { useRef } from 'react';
import { XMarkIcon, MoonIcon, SunIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { authService } from '../services/authService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = authService.exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit_hero_db_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (authService.importDatabase(content)) {
        alert('Database imported successfully! The app will now reload.');
        window.location.reload();
      } else {
        alert('Failed to import database. Please ensure the file is a valid JSON export from this app.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
          {/* Theme Toggle */}
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

          {/* Data Management */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">Data Management</h3>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handleExport}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border-2 border-[#F9DFDF] dark:border-gray-600 rounded-xl hover:bg-[#FBEFEF] dark:hover:bg-gray-700 transition-colors gap-2 text-gray-600 dark:text-gray-300"
                >
                    <ArrowDownTrayIcon className="h-5 w-5 text-[#F5AFAF]" />
                    <span className="text-xs font-bold">Export DB</span>
                </button>
                
                <button 
                    onClick={handleImportClick}
                    className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border-2 border-[#F9DFDF] dark:border-gray-600 rounded-xl hover:bg-[#FBEFEF] dark:hover:bg-gray-700 transition-colors gap-2 text-gray-600 dark:text-gray-300"
                >
                    <ArrowUpTrayIcon className="h-5 w-5 text-[#F5AFAF]" />
                    <span className="text-xs font-bold">Import DB</span>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".json"
                    onChange={handleFileChange}
                />
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 font-['Fredoka']">
             v1.3.0 • Healthy Habits Tracker
          </div>
        </div>
      </div>
    </div>
  );
};
