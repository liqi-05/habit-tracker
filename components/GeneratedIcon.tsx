
import React, { useEffect, useState } from 'react';
import { generateThemeIcon } from '../services/geminiService';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface GeneratedIconProps {
  prompt: string;
  fallbackEmoji: string;
  className?: string;
}

// In-memory session cache to supplement localStorage
const sessionCache: Record<string, string> = {};

export const GeneratedIcon: React.FC<GeneratedIconProps> = ({ prompt, fallbackEmoji, className = "w-10 h-10" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(sessionCache[prompt] || null);
  const [loading, setLoading] = useState(!sessionCache[prompt]);

  useEffect(() => {
    // If we already have it in session, use it
    if (sessionCache[prompt]) {
      setImageUrl(sessionCache[prompt]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    const fetchIcon = async () => {
      // Stagger requests: Add a random delay between 0 and 1500ms
      // This prevents hitting the rate limit instantly when a grid of icons loads
      const delay = Math.floor(Math.random() * 1500);
      await new Promise(r => setTimeout(r, delay));
      
      if (!isMounted) return;

      try {
        const url = await generateThemeIcon(prompt);
        if (isMounted) {
          if (url) {
            sessionCache[prompt] = url;
            setImageUrl(url);
          }
          // If url is null (error/rate limit), we keep imageUrl as null so fallback renders
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
      <div className={`${className} bg-[#FBEFEF] dark:bg-gray-700 rounded-full animate-pulse flex items-center justify-center`}>
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
    <div className={`${className} flex items-center justify-center text-2xl select-none`}>
      {fallbackEmoji}
    </div>
  );
};
