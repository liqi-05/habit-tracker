from pydantic import BaseModel
from typing import List, Optional

# Define Input Schema (mirrors DailyStats in types.ts)
class DailyStats(BaseModel):
    sleepHours: float
    codingHours: float
    waterIntake: float
    mood: float
    stressLevel: float
    didRead: bool
    didExercise: bool
    # note is optional and not used in prediction logic

# Define Output Schema (mirrors PredictionResult in types.ts)
class PredictionResult(BaseModel):
    burnoutScore: float
    riskLevel: str
    contributors: List[str]

class BurnoutPredictor:
    """
    Ported from utils/predictor.ts
    """
    def __init__(self):
        self.weights = {
            "sleep": -0.8,
            "coding": 0.5,
            "water": -0.3,
            "exercise": -1.5,
            "read": -0.5,
            "mood": -0.4,
            "stress": 0.7,
            "bias": 6.0
        }

    def predict(self, stats: DailyStats) -> PredictionResult:
        score = self.weights["bias"]

        score += stats.sleepHours * self.weights["sleep"]
        score += stats.codingHours * self.weights["coding"]
        score += stats.waterIntake * self.weights["water"]
        score += stats.mood * self.weights["mood"]
        score += stats.stressLevel * self.weights["stress"]

        if stats.didExercise:
            score += self.weights["exercise"]
        if stats.didRead:
            score += self.weights["read"]

        # Normalize score to 0-10 range
        score = max(0.0, min(10.0, score))

        # Determine risk level
        risk_level = "Low"
        if score >= 8:
            risk_level = "Critical"
        elif score >= 6:
            risk_level = "High"
        elif score >= 4:
            risk_level = "Moderate"

        # Identify primary contributors
        contributors = []
        if stats.sleepHours < 6:
            contributors.append("Lack of Sleep")
        if stats.codingHours > 8:
            contributors.append("Excessive Coding")
        if stats.stressLevel > 7:
            contributors.append("High Stress")
        if not stats.didExercise:
            contributors.append("No Exercise")
        if stats.mood < 4:
            contributors.append("Low Mood")

        return PredictionResult(
            burnoutScore=round(score, 1),
            riskLevel=risk_level,
            contributors=contributors
        )

# Singleton instance
predictor = BurnoutPredictor()
