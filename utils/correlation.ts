
import { DailyLog, DailyStats } from '../types';

/**
 * Correlation Engine
 * 
 * Acts as a client-side Data Science microservice.
 * It calculates the Pearson Correlation Coefficient (r) between different
 * biometric/habit features to find hidden patterns in user behavior.
 */

export interface CorrelationInsight {
  featureA: string;
  featureB: string;
  coefficient: number; // -1.0 to 1.0
  description: string;
  type: 'positive' | 'negative' | 'neutral';
}

// Helper: Calculate Mean
const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

// Helper: Pearson Correlation implementation
// Equivalent to: df.corr() in Pandas
const calculatePearson = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;

  const muX = mean(x);
  const muY = mean(y);

  let numerator = 0;
  let sumSqDiffX = 0;
  let sumSqDiffY = 0;

  for (let i = 0; i < x.length; i++) {
    const diffX = x[i] - muX;
    const diffY = y[i] - muY;
    numerator += diffX * diffY;
    sumSqDiffX += diffX * diffX;
    sumSqDiffY += diffY * diffY;
  }

  const denominator = Math.sqrt(sumSqDiffX * sumSqDiffY);
  if (denominator === 0) return 0;

  return numerator / denominator;
};

export const analyzeCorrelations = (history: DailyLog[]): CorrelationInsight[] => {
  // We need at least 3 data points to be somewhat statistically relevant
  if (history.length < 3) return [];

  const extract = (key: keyof DailyStats) => history.map(log => Number(log.stats[key]));

  const sleep = extract('sleepHours');
  const mood = extract('mood');
  const coding = extract('codingHours');
  const stress = extract('stressLevel');
  const water = extract('waterIntake');

  const correlations: CorrelationInsight[] = [];

  // Define pairs to analyze
  const pairs = [
    { nameA: 'Sleep', dataA: sleep, nameB: 'Mood', dataB: mood, key: 'sleep_mood' },
    { nameA: 'Coding', dataA: coding, nameB: 'Stress', dataB: stress, key: 'coding_stress' },
    { nameA: 'Water', dataA: water, nameB: 'Mood', dataB: mood, key: 'water_mood' },
    { nameA: 'Exercise', dataA: history.map(h => h.stats.didExercise ? 1 : 0), nameB: 'Mood', dataB: mood, key: 'ex_mood' }
  ];

  pairs.forEach(pair => {
    const r = calculatePearson(pair.dataA, pair.dataB);
    
    // Only report significant correlations (|r| > 0.3)
    if (Math.abs(r) > 0.3) {
      let description = '';
      let type: 'positive' | 'negative' | 'neutral' = 'neutral';

      if (r > 0) {
        description = `${pair.nameA} increases ${pair.nameB}`;
        // Context-aware typing
        if (pair.nameB === 'Stress') type = 'negative'; // Increasing stress is bad
        else if (pair.nameB === 'Mood') type = 'positive'; // Increasing mood is good
      } else {
        description = `${pair.nameA} decreases ${pair.nameB}`;
        if (pair.nameB === 'Stress') type = 'positive'; // Decreasing stress is good
        else if (pair.nameB === 'Mood') type = 'negative'; // Decreasing mood is bad
      }

      correlations.push({
        featureA: pair.nameA,
        featureB: pair.nameB,
        coefficient: parseFloat(r.toFixed(2)),
        description,
        type
      });
    }
  });

  return correlations.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));
};
