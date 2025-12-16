from fastapi.testclient import TestClient
from backend.main import app, get_db, models
from backend import database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date
import sys
import os
import time

# Use a file that persists across requests
DB_FILE = "./test_manual_v2.db"

# Cleanup start
if os.path.exists(DB_FILE):
    try:
        os.remove(DB_FILE)
    except PermissionError:
        print(f"Warning: Could not remove {DB_FILE} at start.")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_FILE}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables ONCE
models.Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def run_tests():
    print("Starting manual tests...")
    
    # Test Root
    try:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "HabitFlow Backend is running"}
        print("[PASS] Root Endpoint")
    except AssertionError as e:
        print(f"[FAIL] Root Endpoint: {e}")
        sys.exit(1)

    # Test Log Habit
    try:
        habit_data = {
            "name": "Code Python",
            "date": str(date.today()),
            "status": "completed",
            "category": "work"
        }
        response = client.post("/api/log", json=habit_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Code Python"
        assert "id" in data
        print("[PASS] Log Habit Endpoint")
    except AssertionError as e:
        print(f"[FAIL] Log Habit Endpoint: {e}")
        print(f"Response: {response.text}")
        sys.exit(1)

    # Test History
    try:
        response = client.get("/api/history")
        assert response.status_code == 200
        history = response.json()
        assert len(history) > 0
        assert history[0]["name"] == "Code Python"
        print("[PASS] History Endpoint")
    except AssertionError as e:
        print(f"[FAIL] History Endpoint: {e}")
        print(f"Response: {response.text}")
        sys.exit(1)

    # Test Predict
    try:
        # bias: 6.0
        # sleep: -0.8 * 8 = -6.4
        # coding: 0.5 * 4 = +2.0
        # Total: 1.6
        stats = {
            "sleepHours": 8.0,
            "codingHours": 4.0,
            "waterIntake": 0.0,
            "mood": 0.0,
            "stressLevel": 0.0,
            "didRead": False,
            "didExercise": False
        }
        response = client.post("/api/predict", json=stats)
        assert response.status_code == 200
        result = response.json()
        assert result["burnoutScore"] == 1.6
        assert result["riskLevel"] == "Low"
        print("[PASS] Predict Endpoint")
    except AssertionError as e:
        print(f"[FAIL] Predict Endpoint: {e}")
        print(f"Response: {response.text}")
        sys.exit(1)

    print("All tests passed!")
    
    # Clean up
    engine.dispose()
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
        except PermissionError:
            print(f"Warning: Could not remove {DB_FILE} at end.")

if __name__ == "__main__":
    try:
        run_tests()
    finally:
        engine.dispose()
