
// This file acts as our "img folder" containing pre-generated assets.
// These are SVGs encoded as Data URIs.
// Style: "Cute Mochi" - Round blobs, kawaii faces, pastel colors, thick soft outlines.

const createSvg = (content: string) => 
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`)}`;

// Common styles
const OUTLINE = '#4A4A4A';
const STROKE = '4';

export const STATIC_ASSETS = {
  // MOODS - Mochi blobs with expressions
  mood: {
    sad: createSvg(`
      <!-- Blue Sad Mochi -->
      <path d="M 50 85 Q 15 85 15 50 Q 15 15 50 15 Q 85 15 85 50 Q 85 85 50 85 Z" fill="#E0F2FE" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Eyes -->
      <circle cx="35" cy="55" r="3" fill="${OUTLINE}"/>
      <circle cx="65" cy="55" r="3" fill="${OUTLINE}"/>
      <!-- Mouth -->
      <path d="M 40 70 Q 50 65 60 70" stroke="${OUTLINE}" stroke-width="${STROKE}" fill="none"/>
      <!-- Tear -->
      <path d="M 70 55 Q 75 60 70 65" stroke="#93C5FD" stroke-width="3" fill="none"/>
    `),
    neutral: createSvg(`
      <!-- Cream Neutral Mochi -->
      <path d="M 50 85 Q 15 85 15 50 Q 15 15 50 15 Q 85 15 85 50 Q 85 85 50 85 Z" fill="#FEF3C7" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Eyes -->
      <circle cx="35" cy="50" r="3" fill="${OUTLINE}"/>
      <circle cx="65" cy="50" r="3" fill="${OUTLINE}"/>
      <!-- Mouth -->
      <line x1="42" y1="65" x2="58" y2="65" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Blush -->
      <circle cx="25" cy="58" r="4" fill="#FCA5A5" opacity="0.6"/>
      <circle cx="75" cy="58" r="4" fill="#FCA5A5" opacity="0.6"/>
    `),
    happy: createSvg(`
      <!-- Pink Happy Mochi -->
      <path d="M 50 85 Q 15 85 15 50 Q 15 15 50 15 Q 85 15 85 50 Q 85 85 50 85 Z" fill="#FCE7F3" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Eyes (Happy Arcs) -->
      <path d="M 32 50 Q 37 45 42 50" stroke="${OUTLINE}" stroke-width="${STROKE}" fill="none"/>
      <path d="M 58 50 Q 63 45 68 50" stroke="${OUTLINE}" stroke-width="${STROKE}" fill="none"/>
      <!-- Mouth -->
      <path d="M 40 60 Q 50 75 60 60" stroke="${OUTLINE}" stroke-width="${STROKE}" fill="none"/>
      <!-- Blush -->
      <circle cx="25" cy="55" r="5" fill="#F472B6" opacity="0.5"/>
      <circle cx="75" cy="55" r="5" fill="#F472B6" opacity="0.5"/>
    `),
  },

  // HABITS - Objects with Mochi faces
  habits: {
    sleep: createSvg(`
      <!-- Sleeping Moon Mochi -->
      <path d="M 35 20 A 35 35 0 1 0 70 80 A 25 25 0 1 1 35 20" fill="#DDD6FE" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Closed Eye -->
      <path d="M 45 50 Q 50 55 55 50" stroke="${OUTLINE}" stroke-width="3" fill="none"/>
      <!-- Mouth -->
      <circle cx="55" cy="60" r="2" fill="${OUTLINE}"/>
      <!-- Zzz -->
      <path d="M 75 30 L 80 30 L 75 36 L 80 36" stroke="${OUTLINE}" stroke-width="3" fill="none"/>
    `),
    coding: createSvg(`
      <!-- Laptop Mochi -->
      <rect x="20" y="30" width="60" height="40" rx="8" fill="#BAE6FD" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <path d="M 15 70 L 85 70 L 80 80 L 20 80 Z" fill="#E2E8F0" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Screen Face -->
      <circle cx="40" cy="50" r="2" fill="${OUTLINE}"/>
      <circle cx="60" cy="50" r="2" fill="${OUTLINE}"/>
      <path d="M 45 55 Q 50 60 55 55" stroke="${OUTLINE}" stroke-width="2" fill="none"/>
    `),
    water: createSvg(`
      <!-- Water Drop Mochi -->
      <path d="M 50 15 Q 80 55 80 70 A 30 30 0 1 1 20 70 Q 20 55 50 15 Z" fill="#7DD3FC" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Face -->
      <circle cx="40" cy="60" r="2" fill="${OUTLINE}"/>
      <circle cx="60" cy="60" r="2" fill="${OUTLINE}"/>
      <path d="M 48 65 Q 50 68 52 65" stroke="${OUTLINE}" stroke-width="2" fill="none"/>
      <!-- Shine -->
      <path d="M 55 30 Q 65 40 65 50" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.6"/>
    `),
    stress: createSvg(`
      <!-- Frazzled Cloud Mochi -->
      <path d="M 25 60 Q 15 50 25 40 Q 25 20 50 20 Q 75 20 75 40 Q 85 50 75 60 Q 75 80 50 80 Q 25 80 25 60" fill="#FEE2E2" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Dizzy Eyes -->
      <path d="M 35 45 L 45 55 M 45 45 L 35 55" stroke="${OUTLINE}" stroke-width="3"/>
      <path d="M 55 45 L 65 55 M 65 45 L 55 55" stroke="${OUTLINE}" stroke-width="3"/>
      <!-- Squiggly Mouth -->
      <path d="M 40 65 Q 45 60 50 65 Q 55 70 60 65" stroke="${OUTLINE}" stroke-width="3" fill="none"/>
    `),
    exercise: createSvg(`
      <!-- Dumbbell Mochi -->
      <rect x="20" y="35" width="15" height="30" rx="4" fill="#FDA4AF" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <rect x="65" y="35" width="15" height="30" rx="4" fill="#FDA4AF" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <rect x="35" y="45" width="30" height="10" fill="#E5E7EB" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Face on Bar -->
      <circle cx="50" cy="50" r="2" fill="${OUTLINE}"/>
      <!-- Sweat -->
      <path d="M 60 30 Q 65 35 60 40" stroke="#38BDF8" stroke-width="2" fill="none"/>
    `),
    read: createSvg(`
      <!-- Book Mochi -->
      <path d="M 20 40 Q 20 30 50 30 Q 80 30 80 40 L 80 80 Q 80 70 50 70 Q 20 70 20 80 Z" fill="#C4B5FD" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="${OUTLINE}" stroke-width="3"/>
      <!-- Glasses -->
      <circle cx="35" cy="50" r="8" fill="none" stroke="${OUTLINE}" stroke-width="2"/>
      <circle cx="65" cy="50" r="8" fill="none" stroke="${OUTLINE}" stroke-width="2"/>
      <line x1="43" y1="50" x2="57" y2="50" stroke="${OUTLINE}" stroke-width="2"/>
    `),
    clipboard: createSvg(`
      <!-- Clipboard Mochi Character -->
      <rect x="25" y="20" width="50" height="65" rx="8" fill="#FEF9C3" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <rect x="35" y="15" width="30" height="10" rx="3" fill="#E5E7EB" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Happy Face -->
      <circle cx="40" cy="45" r="3" fill="${OUTLINE}"/>
      <circle cx="60" cy="45" r="3" fill="${OUTLINE}"/>
      <path d="M 45 55 Q 50 60 55 55" stroke="${OUTLINE}" stroke-width="2" fill="none"/>
      <!-- Checkmarks -->
      <path d="M 35 70 L 40 75 L 65 65" stroke="#22C55E" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.5"/>
    `)
  },

  // BADGES - Cute Awards
  badges: {
    first_step: createSvg(`
      <!-- Egg Mochi -->
      <path d="M 50 15 Q 80 15 80 60 Q 80 85 50 85 Q 20 85 20 60 Q 20 15 50 15" fill="#FEF3C7" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <path d="M 20 50 L 35 40 L 50 50 L 65 40 L 80 50" stroke="${OUTLINE}" stroke-width="3" fill="none"/>
      <!-- Face -->
      <circle cx="40" cy="35" r="2" fill="${OUTLINE}"/>
      <circle cx="60" cy="35" r="2" fill="${OUTLINE}"/>
      <circle cx="50" cy="38" r="2" fill="#FCA5A5" opacity="0.5"/>
    `),
    hydration_hero: createSvg(`
       <!-- Droplet King -->
       <path d="M 50 10 Q 85 60 85 75 A 35 35 0 1 1 15 75 Q 15 60 50 10 Z" fill="#38BDF8" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
       <!-- Crown -->
       <path d="M 35 25 L 35 15 L 42 20 L 50 10 L 58 20 L 65 15 L 65 25" fill="#FCD34D" stroke="${OUTLINE}" stroke-width="2"/>
       <!-- Face -->
       <circle cx="40" cy="55" r="2" fill="#FFFFFF"/>
       <circle cx="60" cy="55" r="2" fill="#FFFFFF"/>
       <path d="M 48 60 Q 50 62 52 60" stroke="#FFFFFF" stroke-width="2" fill="none"/>
    `),
    zen_master: createSvg(`
      <!-- Meditating Leaf Mochi -->
      <circle cx="50" cy="50" r="35" fill="#D1FAE5" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Closed Eyes -->
      <path d="M 35 45 Q 40 50 45 45" stroke="${OUTLINE}" stroke-width="2" fill="none"/>
      <path d="M 55 45 Q 60 50 65 45" stroke="${OUTLINE}" stroke-width="2" fill="none"/>
      <!-- Leaf on head -->
      <path d="M 50 15 Q 65 5 65 25 L 50 20" fill="#4ADE80" stroke="${OUTLINE}" stroke-width="2"/>
    `),
    iron_body: createSvg(`
      <!-- Strong Mochi -->
      <rect x="25" y="45" width="50" height="10" fill="#9CA3AF" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <circle cx="50" cy="50" r="25" fill="#FCA5A5" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <rect x="15" y="35" width="10" height="30" rx="2" fill="#4B5563" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <rect x="75" y="35" width="10" height="30" rx="2" fill="#4B5563" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Determined Face -->
      <path d="M 40 45 L 45 48" stroke="${OUTLINE}" stroke-width="2"/>
      <path d="M 60 45 L 55 48" stroke="${OUTLINE}" stroke-width="2"/>
    `),
    bookworm: createSvg(`
      <!-- Smart Worm Mochi -->
      <path d="M 30 60 Q 30 40 50 40 Q 70 40 70 60" fill="#C4B5FD" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <circle cx="50" cy="40" r="15" fill="#A78BFA" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Glasses -->
      <circle cx="45" cy="38" r="4" fill="white" stroke="${OUTLINE}" stroke-width="1.5"/>
      <circle cx="55" cy="38" r="4" fill="white" stroke="${OUTLINE}" stroke-width="1.5"/>
      <line x1="49" y1="38" x2="51" y2="38" stroke="${OUTLINE}" stroke-width="1.5"/>
    `),
  },

  // LEADERBOARD AVATARS (Static Mock Users - Cute Animals)
  avatars: {
    lion: createSvg(`
      <!-- Lion Mochi -->
      <circle cx="50" cy="50" r="30" fill="#FCD34D" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <!-- Mane -->
      <circle cx="50" cy="50" r="42" fill="none" stroke="#F59E0B" stroke-width="4" stroke-dasharray="0,10" stroke-linecap="round"/>
      <!-- Face -->
      <circle cx="40" cy="48" r="3" fill="${OUTLINE}"/>
      <circle cx="60" cy="48" r="3" fill="${OUTLINE}"/>
      <circle cx="50" cy="55" r="4" fill="${OUTLINE}"/>
    `),
    cat: createSvg(`
      <!-- Cat Mochi -->
      <path d="M 20 30 L 30 70 Q 50 80 70 70 L 80 30 L 60 40 L 40 40 Z" fill="#E5E7EB" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <circle cx="35" cy="55" r="3" fill="${OUTLINE}"/>
      <circle cx="65" cy="55" r="3" fill="${OUTLINE}"/>
      <path d="M 45 60 L 50 63 L 55 60" stroke="${OUTLINE}" stroke-width="2" fill="none"/>
    `),
    ninja: createSvg(`
      <!-- Ninja Mochi -->
      <circle cx="50" cy="50" r="35" fill="#374151" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <rect x="25" y="40" width="50" height="15" rx="5" fill="#FEF3C7"/>
      <circle cx="40" cy="47" r="3" fill="${OUTLINE}"/>
      <circle cx="60" cy="47" r="3" fill="${OUTLINE}"/>
    `),
    bear: createSvg(`
      <!-- Bear Mochi -->
      <circle cx="25" cy="30" r="12" fill="#92400E" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <circle cx="75" cy="30" r="12" fill="#92400E" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <circle cx="50" cy="55" r="35" fill="#B45309" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <circle cx="50" cy="65" r="12" fill="#FEF3C7"/>
      <circle cx="40" cy="50" r="3" fill="${OUTLINE}"/>
      <circle cx="60" cy="50" r="3" fill="${OUTLINE}"/>
      <circle cx="50" cy="55" r="3" fill="${OUTLINE}"/>
    `),
    user: createSvg(`
      <!-- Default User Mochi -->
      <circle cx="50" cy="40" r="20" fill="#F3F4F6" stroke="${OUTLINE}" stroke-width="${STROKE}"/>
      <path d="M 20 90 Q 50 60 80 90" stroke="${OUTLINE}" stroke-width="${STROKE}" fill="#F3F4F6"/>
    `)
  },
  
  // GENERAL UI
  coach: createSvg(`
    <!-- Coach Robot Mochi -->
    <rect x="20" y="20" width="60" height="50" rx="10" fill="#FFFFFF" stroke="#F5AFAF" stroke-width="${STROKE}"/>
    <path d="M 30 50 L 70 50" stroke="#F5AFAF" stroke-width="2" stroke-dasharray="5,5"/>
    <circle cx="35" cy="35" r="4" fill="#F5AFAF"/>
    <circle cx="65" cy="35" r="4" fill="#F5AFAF"/>
    <!-- Antenna -->
    <line x1="50" y1="20" x2="50" y2="10" stroke="#F5AFAF" stroke-width="${STROKE}"/>
    <circle cx="50" cy="5" r="5" fill="#FCD34D"/>
  `),

  auth: createSvg(`
    <!-- Key Mochi -->
    <circle cx="50" cy="40" r="25" fill="#FBEFEF" stroke="#F5AFAF" stroke-width="${STROKE}"/>
    <rect x="45" y="65" width="10" height="25" fill="#F5AFAF" stroke="${OUTLINE}" stroke-width="0"/>
    <path d="M 45 65 L 55 65 L 55 90 L 45 90 Z" fill="#F5AFAF"/>
    <circle cx="50" cy="40" r="8" fill="#F5AFAF"/>
  `)
};
