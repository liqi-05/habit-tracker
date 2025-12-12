
// This file acts as our "img folder" containing pre-generated assets.
// These are SVGs encoded as Data URIs.
// Style: "Kawaii Doodle" - Based on the reference image (Thick outlines, Pastel fills).

const createDoodleSvg = (content: string, viewBox: string = "0 0 24 24") => 
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`)}`;

// Palette from the new reference image
const C = {
  outline: '#4A4238', // Dark warm grey/brown for thick outlines
  pink: '#FFA6C1',     // Soft bubblegum pink
  yellow: '#F9E79F',   // Pastel star yellow
  cream: '#FEF9E7',    // Off-white/cream
  brown: '#8D6E63',    // Cone color
  white: '#FFFFFF',
  blue: '#A9DEF9',     // Pastel Blue
  purple: '#E2CBF7',   // Pastel Purple
  grey: '#D1D5DB'      // Pastel Grey
};

const STROKE = `stroke="${C.outline}" stroke-width="2"`;

export const STATIC_ASSETS = {
  // MOODS
  mood: {
    sad: createDoodleSvg(`
      <!-- Droopy Cloud -->
      <path d="M7 10 Q4 10 4 13 Q4 16 8 16 L16 16 Q20 16 20 13 Q20 10 17 10 Q15 8 12 8 Q9 8 7 10" fill="${C.blue}" ${STROKE} />
      <!-- Sad Face -->
      <path d="M9 13 h1 M14 13 h1" stroke="${C.outline}" stroke-width="2" />
      <path d="M10 15 Q12 14 14 15" fill="none" stroke="${C.outline}" stroke-width="1.5" />
      <!-- Tear -->
      <path d="M15 14 Q16 16 15 17" fill="#74C0FC" stroke="none" />
    `),
    neutral: createDoodleSvg(`
      <!-- Bunny Face -->
      <!-- Ears -->
      <path d="M8 3 Q6 2 6 7 L6 9" fill="${C.white}" ${STROKE} />
      <path d="M16 3 Q18 2 18 7 L18 9" fill="${C.white}" ${STROKE} />
      <!-- Head -->
      <ellipse cx="12" cy="14" rx="8" ry="6" fill="${C.white}" ${STROKE} />
      <!-- Face -->
      <circle cx="9" cy="14" r="1.5" fill="${C.outline}" />
      <circle cx="15" cy="14" r="1.5" fill="${C.outline}" />
      <path d="M11 15 h2" fill="none" stroke="${C.pink}" stroke-width="1.5" />
      <!-- Cheeks -->
      <circle cx="7" cy="15" r="1.5" fill="${C.pink}" opacity="0.5" />
      <circle cx="17" cy="15" r="1.5" fill="${C.pink}" opacity="0.5" />
    `),
    happy: createDoodleSvg(`
      <!-- Happy Star -->
      <path d="M12 2 L14.5 8.5 L21.5 9 L16 13.5 L18 20.5 L12 17 L6 20.5 L8 13.5 L2.5 9 L9.5 8.5 Z" fill="${C.yellow}" ${STROKE} />
      <!-- Face -->
      <path d="M9 12 Q10 11 11 12" fill="none" stroke="${C.outline}" stroke-width="1.5" />
      <path d="M13 12 Q14 11 15 12" fill="none" stroke="${C.outline}" stroke-width="1.5" />
      <path d="M11 14 Q12 15 13 14" fill="none" stroke="${C.outline}" stroke-width="1.5" />
      <circle cx="8" cy="13" r="1" fill="${C.pink}" opacity="0.6" />
      <circle cx="16" cy="13" r="1" fill="${C.pink}" opacity="0.6" />
    `),
  },

  // HABITS (Semantically Relevant)
  habits: {
    sleep: createDoodleSvg(`
      <!-- Sleeping Moon -->
      <path d="M17 3 A9 9 0 1 1 9 20 A9 9 0 0 0 17 3" fill="${C.purple}" ${STROKE} />
      <!-- Sleeping Eye -->
      <path d="M10 12 Q12 13 14 12" fill="none" stroke="${C.outline}" stroke-width="1.5" />
      <!-- Zzz -->
      <path d="M18 5 L21 5 L18 8 L21 8" stroke="${C.outline}" stroke-width="1.5" />
      <path d="M20 10 L22 10 L20 12 L22 12" stroke="${C.outline}" stroke-width="1.5" />
    `),
    
    coding: createDoodleSvg(`
      <!-- Cute Computer / Lightning -->
      <rect x="3" y="6" width="18" height="12" rx="2" fill="${C.white}" ${STROKE} />
      <path d="M3 14 L21 14" stroke="${C.outline}" stroke-width="2" />
      <path d="M8 21 L16 21" stroke="${C.outline}" stroke-width="2" />
      <!-- Lightning on screen -->
      <path d="M11 8 L9 10 L12 10 L11 12" fill="none" stroke="${C.yellow}" stroke-width="2" />
    `),
    
    water: createDoodleSvg(`
      <!-- Kawaii Water Drop -->
      <path d="M12 2 Q6 11 6 15 A6 6 0 1 0 18 15 Q18 11 12 2" fill="${C.blue}" ${STROKE} />
      <!-- Shine -->
      <path d="M14 6 Q15 8 15 10" stroke="white" stroke-width="2" stroke-linecap="round" />
      <!-- Face -->
      <circle cx="10" cy="16" r="1" fill="${C.outline}" />
      <circle cx="14" cy="16" r="1" fill="${C.outline}" />
      <path d="M11.5 16 Q12 17 12.5 16" fill="none" stroke="${C.outline}" stroke-width="1" />
    `),
    
    stress: createDoodleSvg(`
      <!-- Storm Cloud -->
      <path d="M6 12 Q4 12 4 14 Q4 16 6 16 L18 16 Q20 16 20 14 Q20 12 18 12 Q18 9 15 9 Q14 7 12 7 Q9 7 9 10 Q6 10 6 12" fill="${C.pink}" ${STROKE} />
      <!-- Lightning -->
      <path d="M11 16 L9 20 L13 20 L12 23" fill="none" stroke="${C.yellow}" stroke-width="2" />
      <!-- Angry Eyes -->
      <path d="M9 13 L10 14" stroke="${C.outline}" stroke-width="1.5" />
      <path d="M15 13 L14 14" stroke="${C.outline}" stroke-width="1.5" />
    `),
    
    exercise: createDoodleSvg(`
      <!-- Winged Heart (Cardio) -->
      <!-- Left Wing -->
      <path d="M7 10 Q3 8 3 12 Q3 14 7 14" fill="${C.white}" ${STROKE} />
      <!-- Right Wing -->
      <path d="M17 10 Q21 8 21 12 Q21 14 17 14" fill="${C.white}" ${STROKE} />
      <!-- Heart -->
      <path d="M12 20 L7 14 Q5 11 8 9 Q10 8 12 11 Q14 8 16 9 Q19 11 17 14 Z" fill="${C.pink}" ${STROKE} />
    `),
    
    read: createDoodleSvg(`
      <!-- Open Book -->
      <path d="M4 8 Q12 10 20 8 V18 Q12 20 4 18 Z" fill="${C.cream}" ${STROKE} />
      <path d="M12 10 V20" stroke="${C.outline}" stroke-width="1.5" />
      <!-- Cover -->
      <path d="M4 8 V18" stroke="${C.pink}" stroke-width="3" />
      <path d="M20 8 V18" stroke="${C.pink}" stroke-width="3" />
    `),
    
    clipboard: createDoodleSvg(`
      <!-- Pink Bow (Check-in) -->
      <path d="M12 12 Q9 8 5 9 Q2 10 5 14 L12 16" fill="${C.pink}" ${STROKE} />
      <path d="M12 12 Q15 8 19 9 Q22 10 19 14 L12 16" fill="${C.pink}" ${STROKE} />
      <circle cx="12" cy="12" r="2" fill="${C.pink}" ${STROKE} />
      <path d="M12 16 L10 21" fill="none" ${STROKE} />
      <path d="M12 16 L14 21" fill="none" ${STROKE} />
    `)
  },

  // BADGES (Matching the new habits)
  badges: {
    first_step: createDoodleSvg(`
       <!-- Flag -->
       <path d="M6 21 L6 3 L16 8 L6 13" fill="${C.pink}" ${STROKE} />
    `),
    hydration_hero: createDoodleSvg(`
       <!-- Big Water Drop Badge -->
       <path d="M12 2 Q6 11 6 15 A6 6 0 1 0 18 15 Q18 11 12 2" fill="${C.blue}" ${STROKE} />
       <path d="M12 2 Q18 11 18 15" fill="none" stroke="${C.white}" stroke-width="2" opacity="0.5" />
    `),
    zen_master: createDoodleSvg(`
       <!-- Lotus -->
       <path d="M12 18 Q6 12 4 8 Q8 6 12 12" fill="${C.pink}" ${STROKE} />
       <path d="M12 18 Q18 12 20 8 Q16 6 12 12" fill="${C.pink}" ${STROKE} />
       <path d="M12 18 V10" stroke="${C.outline}" stroke-width="1.5" />
    `),
    iron_body: createDoodleSvg(`
       <!-- Dumbbell -->
       <rect x="4" y="8" width="4" height="8" rx="1" fill="${C.yellow}" ${STROKE} />
       <rect x="16" y="8" width="4" height="8" rx="1" fill="${C.yellow}" ${STROKE} />
       <rect x="8" y="11" width="8" height="2" fill="${C.outline}" stroke="none" />
    `),
    bookworm: createDoodleSvg(`
       <!-- Book with Worm -->
       <path d="M4 10 Q12 12 20 10 V18 Q12 20 4 18 Z" fill="${C.cream}" ${STROKE} />
       <circle cx="12" cy="8" r="3" fill="${C.pink}" ${STROKE} />
       <path d="M11 8 h.5 M13 8 h.5" stroke="${C.outline}" stroke-width="1.5" />
    `),
  },

  // AVATARS (Keep standard pixel for now, or update to doodle prompts in logic)
  avatars: {
    lion: createDoodleSvg(`<circle cx="12" cy="12" r="10" fill="${C.yellow}" ${STROKE} /><circle cx="12" cy="12" r="8" fill="${C.white}" ${STROKE} />`),
    cat: createDoodleSvg(`<circle cx="12" cy="12" r="9" fill="${C.cream}" ${STROKE} />`),
    ninja: createDoodleSvg(`<rect x="4" y="4" width="16" height="16" rx="4" fill="${C.pink}" ${STROKE} />`),
    bear: createDoodleSvg(`<circle cx="12" cy="12" r="9" fill="${C.brown}" ${STROKE} />`),
    user: createDoodleSvg(`<circle cx="12" cy="12" r="9" fill="${C.pink}" ${STROKE} />`)
  },
  
  coach: createDoodleSvg(`
    <!-- Coach Cat (Peeking) -->
    <path d="M6 14 L6 8 Q6 4 9 6" fill="${C.white}" ${STROKE} />
    <path d="M18 14 L18 8 Q18 4 15 6" fill="${C.white}" ${STROKE} />
    <ellipse cx="12" cy="14" rx="8" ry="6" fill="${C.white}" ${STROKE} />
    <circle cx="9" cy="14" r="1" fill="${C.outline}" />
    <circle cx="15" cy="14" r="1" fill="${C.outline}" />
    <path d="M10 20 L2 20" stroke="${C.outline}" stroke-width="2" />
    <path d="M14 20 L22 20" stroke="${C.outline}" stroke-width="2" />
  `),

  auth: createDoodleSvg(`
    <!-- Key Doodle -->
    <circle cx="9" cy="9" r="5" fill="none" ${STROKE} />
    <path d="M13 12 L19 18 M19 18 L21 16 M17 16 L19 14" stroke="${C.outline}" stroke-width="2" />
  `)
};
