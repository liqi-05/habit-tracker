
import { DailyStats, PredictionResult } from '../types';

/**
 * BurnoutPredictor Class
 * 
 * ARCHITECTURE NOTE:
 * This class simulates a Python ML Inference Microservice.
 * Model Type: Weighted Linear Regression (Simulated)
 * Training Data: Synthetic dataset of developer habits vs burnout rates.
 */
export class BurnoutPredictor {
  // Model Metadata
  public readonly modelVersion = "v2.4.1";
  public readonly modelType = "LinearRegressor (Regularized)";
  public readonly lastTrained = "2023-10-15";

  // Weights derived from "training" on synthetic data
  // Equation: y = w1*x1 + w2*x2 + ... + b
  private readonly weights = {
    sleep: -0.8,      // More sleep reduces burnout
    coding: 0.5,      // More coding increases burnout
    water: -0.3,      // Hydration reduces burnout
    exercise: -1.5,   // Exercise significantly reduces burnout
    read: -0.5,       // Reading (leisure) reduces burnout
    mood: -0.4,       // Better mood correlates with lower burnout
    stress: 0.7,      // Higher stress increases burnout significantly
    bias: 6.0         // Base intercept
  };

  /**
   * Generates a burnout score based on daily stats.
   * Logic: y = w1*x1 + w2*x2 + ... + b
   */
  public predict(stats: DailyStats): PredictionResult {
    let score = this.weights.bias;

    score += stats.sleepHours * this.weights.sleep;
    score += stats.codingHours * this.weights.coding;
    score += stats.waterIntake * this.weights.water;
    score += stats.mood * this.weights.mood;
    score += stats.stressLevel * this.weights.stress;
    
    if (stats.didExercise) score += this.weights.exercise;
    if (stats.didRead) score += this.weights.read;

    // Normalize score to 0-10 range
    score = Math.max(0, Math.min(10, score));
    
    // Determine risk level
    let riskLevel: PredictionResult['riskLevel'] = 'Low';
    if (score >= 8) riskLevel = 'Critical';
    else if (score >= 6) riskLevel = 'High';
    else if (score >= 4) riskLevel = 'Moderate';

    // Identify primary contributors for the UI (Feature Importance)
    const contributors: string[] = [];
    if (stats.sleepHours < 6) contributors.push('Lack of Sleep');
    if (stats.codingHours > 8) contributors.push('Excessive Coding');
    if (stats.stressLevel > 7) contributors.push('High Stress');
    if (!stats.didExercise) contributors.push('No Exercise');
    if (stats.mood < 4) contributors.push('Low Mood');

    return {
      burnoutScore: parseFloat(score.toFixed(1)),
      riskLevel,
      contributors
    };
  }
}

// Singleton instance acting as the "Inference Server"
export const predictor = new BurnoutPredictor();
