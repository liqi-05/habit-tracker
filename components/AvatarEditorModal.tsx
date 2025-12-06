
import React, { useState, useEffect } from 'react';
import { XMarkIcon, SparklesIcon, PaintBrushIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { GeneratedIcon } from './GeneratedIcon';

interface AvatarEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  onSave: (prompt: string) => void;
}

const CHARACTERS = ['Tomato', 'Cat', 'Dog', 'Robot', 'Ghost', 'Cloud', 'Mochi', 'Frog', 'Bear', 'Bunny'];
const ACCESSORIES = ['Glasses', 'Hat', 'Crown', 'Headphones', 'Scarf', 'Bow', 'Cape', 'None'];
const COLORS = ['Red', 'Blue', 'Green', 'Pink', 'Purple', 'Orange', 'Yellow', 'Gray'];

export const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({ isOpen, onClose, currentPrompt, onSave }) => {
  const [mode, setMode] = useState<'builder' | 'custom'>('builder');
  
  // Builder state
  const [char, setChar] = useState(CHARACTERS[0]);
  const [acc, setAcc] = useState(ACCESSORIES[0]);
  const [col, setCol] = useState(COLORS[0]);
  
  // Custom prompt state
  const [customText, setCustomText] = useState(currentPrompt);
  
  // Preview
  const [previewPrompt, setPreviewPrompt] = useState(currentPrompt);

  useEffect(() => {
    if (isOpen) {
      setCustomText(currentPrompt);
    }
  }, [isOpen, currentPrompt]);

  useEffect(() => {
    if (mode === 'builder') {
      const accessoryText = acc === 'None' ? '' : `wearing ${acc}`;
      const prompt = `cute ${col} ${char} character ${accessoryText} doodle thick outlines`;
      setPreviewPrompt(prompt);
    } else {
      setPreviewPrompt(customText);
    }
  }, [mode, char, acc, col, customText]);

  const handleSave = () => {
    onSave(previewPrompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-[#F9DFDF] dark:border-gray-700 relative flex flex-col transition-colors duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-['Fredoka'] text-center">
          Style Your Avatar
        </h2>

        {/* Preview Area */}
        <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#F5AFAF] bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
                    <GeneratedIcon prompt={previewPrompt} fallbackEmoji="🎨" className="w-24 h-24" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-300 text-yellow-800 p-2 rounded-full shadow-md">
                    <SparklesIcon className="h-5 w-5" />
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#FCF8F8] dark:bg-gray-900 rounded-xl p-1 mb-6 border border-[#F9DFDF] dark:border-gray-700">
            <button
                onClick={() => setMode('builder')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === 'builder' 
                    ? 'bg-white dark:bg-gray-700 text-[#F5AFAF] shadow-sm' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`}
            >
                <PaintBrushIcon className="h-4 w-4" /> Builder
            </button>
            <button
                onClick={() => setMode('custom')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === 'custom' 
                    ? 'bg-white dark:bg-gray-700 text-[#F5AFAF] shadow-sm' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`}
            >
                <PencilSquareIcon className="h-4 w-4" /> Custom Prompt
            </button>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto mb-6">
            {mode === 'builder' ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Character Base</label>
                        <div className="grid grid-cols-4 gap-2">
                            {CHARACTERS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setChar(c)}
                                    className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                                        char === c 
                                        ? 'bg-[#FBEFEF] dark:bg-gray-600 border-[#F5AFAF] text-gray-800 dark:text-white' 
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500'
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Accessory</label>
                        <div className="flex flex-wrap gap-2">
                             {ACCESSORIES.map(a => (
                                <button
                                    key={a}
                                    onClick={() => setAcc(a)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                        acc === a 
                                        ? 'bg-[#FBEFEF] dark:bg-gray-600 border-[#F5AFAF] text-gray-800 dark:text-white' 
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500'
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Color Theme</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCol(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                        col === c ? 'border-gray-400 scale-110 ring-2 ring-offset-1 ring-[#F5AFAF]' : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: c.toLowerCase() }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Describe your avatar</label>
                    <textarea 
                        className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5AFAF] text-sm text-gray-700 dark:text-gray-200 resize-none"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="E.g. A cute astronaut cat eating pizza doodle..."
                    />
                    <p className="text-[10px] text-gray-400 mt-2">
                        Tip: Keep it simple. We'll automatically apply the "cute doodle" style.
                    </p>
                </div>
            )}
        </div>

        <button
            onClick={handleSave}
            className="w-full bg-[#F5AFAF] hover:bg-[#eb9a9a] text-white font-bold py-3.5 rounded-xl shadow-md transition-transform active:scale-[0.98]"
        >
            Save New Look
        </button>

      </div>
    </div>
  );
};
