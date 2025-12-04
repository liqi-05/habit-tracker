import React, { useEffect, useState } from 'react';
import { generateThemeIcon } from '../services/geminiService';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface GeneratedIconProps {
  prompt: string;
  fallbackEmoji: string;
  className?: string;
}

// Simple in-memory cache to prevent re-generation on re-renders
const iconCache: Record<string, string> = {};

export const GeneratedIcon: React.FC<GeneratedIconProps> = ({ prompt, fallbackEmoji, className = "w-10 h-10" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(iconCache[prompt] || null);
  const [loading, setLoading] = useState(!iconCache[prompt]);

  useEffect(() => {
    if (iconCache[prompt]) {
      setImageUrl(iconCache[prompt]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    const fetchIcon = async () => {
      // Small delay to allow UI to settle before firing API calls
      await new Promise(r => setTimeout(r, 500));
      
      try {
        const url = await generateThemeIcon(prompt);
        if (isMounted && url) {
          iconCache[prompt] = url;
          setImageUrl(url);
        }
      } catch (e) {
        console.error("Failed to load icon", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchIcon();

    return () => { isMounted = false; };
  }, [prompt]);

  if (loading) {
    return (
      <div className={`${className} bg-[#FBEFEF] rounded-full animate-pulse flex items-center justify-center`}>
        <PhotoIcon className="w-1/2 h-1/2 text-[#F5AFAF] opacity-50" />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={prompt} 
        className={`${className} object-contain rounded-full`}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center text-2xl`}>
      {fallbackEmoji}
    </div>
  );
};