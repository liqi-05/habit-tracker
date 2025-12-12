
import React, { useState, useEffect } from 'react';
import { DailyStats } from '../types';
import { STATIC_ASSETS } from '../utils/staticAssets';
import { MicrophoneIcon, StopIcon, ExclamationCircleIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { parseNaturalLanguageStats } from '../services/geminiService';

interface HabitFormProps {
  stats: DailyStats;
  onChange: (stats: DailyStats) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  submitLabel?: string;
  hideHeader?: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({ 
  stats, 
  onChange, 
  onSubmit, 
  isAnalyzing, 
  submitLabel = 'Analyze Habits',
  hideHeader = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          setIsProcessingVoice(true);
          setVoiceError(null);
          
          // Send to Gemini to parse stats
          const extractedStats = await parseNaturalLanguageStats(transcript);
          
          // Merge with current stats AND save the text as a note
          onChange({
            ...stats,
            ...extractedStats,
            note: transcript // Save the raw text for the AI Coach context
          });
          
          triggerHaptic(successPattern); // Success vibration after voice command
          setIsProcessingVoice(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setIsProcessingVoice(false);
          triggerHaptic(50); // Error vibration
          
          if (event.error === 'not-allowed') {
            setVoiceError("Microphone access denied. Please allow permissions.");
          } else if (event.error === 'no-speech') {
             setVoiceError("No speech detected. Try again.");
          } else {
             setVoiceError("Voice recognition failed.");
          }
          
          // Clear error after 5 seconds
          setTimeout(() => setVoiceError(null), 5000);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [stats, onChange]);

  // Haptic Feedback Helper
  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
  };

  const successPattern = [10, 30, 10]; // Small buzz-BUZZ-buzz

  const toggleListening = () => {
    triggerHaptic(20);
    if (!recognition) {
        alert("Your browser does not support voice recognition. Try Chrome or Safari!");
        return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      setVoiceError(null);
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  };

  const handleChange = (field: keyof DailyStats, value: any, hapticMs: number = 4) => {
    triggerHaptic(hapticMs);
    onChange({ ...stats, [field]: value });
  };

  const handleManualSubmit = () => {
      triggerHaptic(successPattern);
      onSubmit();
  };

  // Helper for Pastel Gradient Progress Bars
  const getGradient = (color: string, value: number, max: number, min: number = 0) => {
    const range = max - min;
    const percentage = range === 0 ? 0 : ((value - min) / range) * 100;
    const clampedPercent = Math.min(100, Math.max(0, percentage));

    // Soft pastel gradients based on input color
    const c = color === 'purple' ? '#E0BBE4' :
              color === 'blue'   ? '#C7CEEA' :
              color === 'green'  ? '#B5EAD7' :
              color === 'pink'   ? '#FFB7B2' : 
              '#FFDAC1'; // orange
    
    return {
        background: `linear-gradient(to right, ${c} 0%, ${c} ${clampedPercent}%, #f3f4f6 ${clampedPercent}%, #f3f4f6 100%)`,
        color: c // This passes the color to the CSS 'currentColor' for the thumb border
    };
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-dream-pink/10 border border-white dark:border-gray-700 p-8 md:p-10 relative overflow-hidden transition-colors duration-300 ${hideHeader ? 'pt-6' : ''}`}>
       {/* Decorative soft gradient blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-dream-pink/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 -left-10 w-40 h-40 bg-dream-blue/20 rounded-full blur-3xl pointer-events-none"></div>

      {!hideHeader && (
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF9E7] dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-sm border border-[#F9DFDF]">
                <img src={STATIC_ASSETS.habits.clipboard} alt="Clipboard" className="w-10 h-10 object-contain" />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-white tracking-tight font-serif">
                Daily Check-in
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest font-sans">Track your day</p>
            </div>
        </div>
        
        {/* Voice Input Button */}
        <div className="flex flex-col items-end">
            <button
                onClick={toggleListening}
                disabled={isProcessingVoice}
                className={`relative p-4 rounded-full transition-all duration-300 ${
                    isListening 
                    ? 'bg-dream-pink text-white shadow-lg shadow-dream-pink/50 scale-110' 
                    : 'bg-white border-2 border-dream-pink text-dream-pink hover:bg-dream-pink hover:text-white shadow-md'
                } ${isProcessingVoice ? 'opacity-70 cursor-wait' : ''}`}
                title="Log with Voice"
            >
                {isListening && (
                    <span className="absolute inset-0 rounded-full bg-dream-pink animate-ping opacity-75"></span>
                )}
                {isListening ? (
                    <StopIcon className="h-6 w-6 relative z-10" />
                ) : (
                    <MicrophoneIcon className="h-6 w-6 relative z-10" />
                )}
            </button>
        </div>
      </div>
      )}

      {hideHeader && (
          <div className="flex justify-end mb-4 relative z-10">
             <button
                onClick={toggleListening}
                disabled={isProcessingVoice}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                    isListening 
                    ? 'bg-dream-pink text-white shadow-lg scale-110' 
                    : 'bg-dream-pink/20 text-dream-pink hover:bg-dream-pink hover:text-white'
                }`}
                title="Log with Voice"
            >
                {isListening ? <StopIcon className="h-6 w-6" /> : <MicrophoneIcon className="h-6 w-6" />}
            </button>
          </div>
      )}
      
      {voiceError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 animate-pulse border border-red-100">
              <ExclamationCircleIcon className="h-5 w-5" />
              {voiceError}
          </div>
      )}

      {isProcessingVoice && (
          <div className="mb-6 bg-dream-blue/20 text-dream-dark px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 bg-dream-blue rounded-full animate-bounce"></span>
              AI is listening to your day...
          </div>
      )}
      
      <div className="space-y-10 relative z-10">
        
        {/* Sliders Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            
            {/* SLEEP (Purple Theme) */}
            <div className="space-y-4 group">
                <div className="flex justify-between items-end">
                    <label className="text-xl font-bold text-gray-700 dark:text-gray-200 font-serif flex items-center gap-2">
                        <img src={STATIC_ASSETS.habits.sleep} className="w-6 h-6" alt="Sleep" /> Sleep
                    </label>
                    <span className="text-lg font-bold text-dream-purple bg-dream-purple/10 px-4 py-1 rounded-full font-sans">{stats.sleepHours}h</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={stats.sleepHours}
                    onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
                    className="w-full rounded-full h-3 cursor-pointer"
                    style={getGradient('purple', stats.sleepHours, 12, 0)}
                />
            </div>

            {/* CODING (Blue Theme) */}
            <div className="space-y-4 group">
                <div className="flex justify-between items-end">
                    <label className="text-xl font-bold text-gray-700 dark:text-gray-200 font-serif flex items-center gap-2">
                        <img src={STATIC_ASSETS.habits.coding} className="w-6 h-6" alt="Coding" /> Coding
                    </label>
                    <span className="text-lg font-bold text-dream-blue bg-dream-blue/10 px-4 py-1 rounded-full font-sans">{stats.codingHours}h</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="16"
                    step="0.5"
                    value={stats.codingHours}
                    onChange={(e) => handleChange('codingHours', parseFloat(e.target.value))}
                    className="w-full rounded-full h-3 cursor-pointer"
                    style={getGradient('blue', stats.codingHours, 16, 0)}
                />
            </div>

            {/* WATER (Green Theme) */}
            <div className="space-y-4 group">
                <div className="flex justify-between items-end">
                    <label className="text-xl font-bold text-gray-700 dark:text-gray-200 font-serif flex items-center gap-2">
                        <img src={STATIC_ASSETS.habits.water} className="w-6 h-6" alt="Water" /> Water
                    </label>
                    <span className="text-lg font-bold text-dream-green bg-dream-green/10 px-4 py-1 rounded-full font-sans">{stats.waterIntake}L</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={stats.waterIntake}
                    onChange={(e) => handleChange('waterIntake', parseFloat(e.target.value))}
                    className="w-full rounded-full h-3 cursor-pointer"
                    style={getGradient('green', stats.waterIntake, 5, 0)}
                />
            </div>

            {/* STRESS (Pink Theme) */}
            <div className="space-y-4 group">
                <div className="flex justify-between items-end">
                    <label className="text-xl font-bold text-gray-700 dark:text-gray-200 font-serif flex items-center gap-2">
                        <img src={STATIC_ASSETS.habits.stress} className="w-6 h-6" alt="Stress" /> Stress
                    </label>
                    <span className="text-lg font-bold text-dream-pink bg-dream-pink/10 px-4 py-1 rounded-full font-sans">{stats.stressLevel}/10</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={stats.stressLevel}
                    onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
                    className="w-full rounded-full h-3 cursor-pointer"
                    style={getGradient('pink', stats.stressLevel, 10, 1)}
                />
            </div>

            {/* MOOD (Orange Theme) */}
            <div className="col-span-1 md:col-span-2 space-y-6 pt-6 border-t border-dotted border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex justify-between items-center">
                    <label className="text-xl font-bold text-gray-700 dark:text-gray-200 font-serif">Current Mood</label>
                    <div className="flex items-center gap-2 bg-dream-orange/10 px-6 py-2 rounded-full border border-dream-orange/20">
                        <span className="text-lg font-bold text-dream-orange font-sans">{stats.mood}/10</span>
                    </div>
                </div>
                
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={stats.mood}
                    onChange={(e) => handleChange('mood', parseInt(e.target.value))}
                    className="w-full rounded-full h-3 cursor-pointer"
                    style={getGradient('orange', stats.mood, 10, 1)}
                />
                
                <div className="flex justify-between px-2">
                    <button 
                        onClick={() => handleChange('mood', 3, 20)}
                        className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${stats.mood <= 4 ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}
                    >
                         <div className="w-12 h-12 drop-shadow-sm">
                            <img src={STATIC_ASSETS.mood.sad} alt="Sad" className="w-full h-full object-contain" />
                        </div>
                    </button>
                    <button 
                         onClick={() => handleChange('mood', 6, 20)}
                         className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${stats.mood > 4 && stats.mood < 8 ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}
                    >
                        <div className="w-12 h-12 drop-shadow-sm">
                           <img src={STATIC_ASSETS.mood.neutral} alt="Neutral" className="w-full h-full object-contain" />
                        </div>
                    </button>
                    <button 
                         onClick={() => handleChange('mood', 9, 20)}
                         className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${stats.mood >= 8 ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}
                    >
                         <div className="w-12 h-12 drop-shadow-sm">
                            <img src={STATIC_ASSETS.mood.happy} alt="Happy" className="w-full h-full object-contain" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Note Area */}
            <div className="col-span-1 md:col-span-2 space-y-2">
                 <div className="flex items-center gap-2 mb-2">
                    <PencilSquareIcon className="h-5 w-5 text-gray-400" />
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Thoughts / Notes</label>
                 </div>
                 <textarea
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-dream-pink text-gray-700 dark:text-gray-300 resize-none h-24 text-sm"
                    placeholder="Type a note or use voice to auto-fill (e.g. 'I felt tired today because I skipped lunch...')"
                    value={stats.note || ''}
                    onChange={(e) => handleChange('note', e.target.value, 0)}
                 />
            </div>

        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handleChange('didExercise', !stats.didExercise, 20)}
            className={`p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 group ${
              stats.didExercise 
                ? 'border-dream-pink bg-dream-pink/5 dark:bg-gray-700 dark:border-dream-pink shadow-lg shadow-dream-pink/10' 
                : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className={`w-16 h-16 transition-transform group-hover:scale-110 duration-300 ${!stats.didExercise && 'opacity-50 grayscale'}`}>
              <img src={STATIC_ASSETS.habits.exercise} alt="Exercise" className="w-full h-full object-contain" />
            </div>
            <span className={`font-bold text-sm font-sans tracking-wide uppercase ${stats.didExercise ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>Exercised</span>
          </button>

          <button
            onClick={() => handleChange('didRead', !stats.didRead, 20)}
            className={`p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 group ${
              stats.didRead 
                ? 'border-dream-purple bg-dream-purple/5 dark:bg-gray-700 dark:border-dream-purple shadow-lg shadow-dream-purple/10' 
                : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
             <div className={`w-16 h-16 transition-transform group-hover:scale-110 duration-300 ${!stats.didRead && 'opacity-50 grayscale'}`}>
               <img src={STATIC_ASSETS.habits.read} alt="Read" className="w-full h-full object-contain" />
            </div>
            <span className={`font-bold text-sm font-sans tracking-wide uppercase ${stats.didRead ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>Read Book</span>
          </button>
        </div>

        <button
          onClick={handleManualSubmit}
          disabled={isAnalyzing}
          className="w-full mt-4 bg-gradient-to-r from-dream-pink to-dream-orange hover:from-dream-orange hover:to-dream-pink text-white font-bold py-5 rounded-full shadow-xl shadow-dream-pink/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg font-serif tracking-wide"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
};
