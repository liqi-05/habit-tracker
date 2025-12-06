
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { STATIC_ASSETS } from '../utils/staticAssets';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, username, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 border-2 border-[#F9DFDF] dark:border-gray-700 relative overflow-hidden transition-colors duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FBEFEF] dark:bg-gray-700 flex items-center justify-center mb-3">
                <img src={STATIC_ASSETS.auth} alt="Auth" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-['Fredoka']">
                {isLogin ? 'Welcome Back!' : 'Join the Club'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin ? 'Log in to sync your progress' : 'Start your healthy journey'}
            </p>
        </div>

        {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">Username</label>
                    <input 
                        type="text" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5AFAF] dark:text-white"
                        placeholder="HabitHero"
                    />
                </div>
            )}
            
            <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5AFAF] dark:text-white"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5AFAF] dark:text-white"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F5AFAF] hover:bg-[#eb9a9a] text-white font-bold py-3 rounded-xl shadow-md transition-transform active:scale-[0.98] disabled:opacity-70 mt-4"
            >
                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-sm text-gray-500 hover:text-[#F5AFAF] dark:text-gray-400 font-medium underline decoration-dashed underline-offset-4"
            >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
        </div>
      </div>
    </div>
  );
};
