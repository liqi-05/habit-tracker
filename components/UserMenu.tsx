
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { GeneratedIcon } from './GeneratedIcon';
import { ChevronDownIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { authService } from '../services/authService';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = () => {
    const data = authService.exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit_hero_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
      >
        <div className="w-8 h-8 rounded-full bg-[#FBEFEF] dark:bg-gray-700 overflow-hidden border border-[#F9DFDF] dark:border-gray-600">
            <GeneratedIcon prompt={user.avatarPrompt} fallbackEmoji="👤" className="w-full h-full" />
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fade-in-up origin-top-right">
           <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
           </div>

           <button 
              onClick={() => { onOpenSettings(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
           >
              <Cog6ToothIcon className="w-4 h-4" /> Settings
           </button>
           
           <button 
              onClick={handleExport}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
           >
              <ArrowDownTrayIcon className="w-4 h-4" /> Export Data
           </button>

           <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>

           <button 
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 font-medium"
           >
              <ArrowRightOnRectangleIcon className="w-4 h-4" /> Log Out
           </button>
        </div>
      )}
    </div>
  );
};
