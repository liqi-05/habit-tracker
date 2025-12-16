from fastapi.testclient import TestClient
from .main import app, get_db, models, database
from datetime import date
import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup in-memory DB for testing
# Use a file for persistence during test session
DB_FILE = "./test_pytest.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_FILE}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
models.Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Cleanup fixture (optional but good)
@pytest.fixture(scope="session", autouse=True)
def cleanup_db():
    yield
    engine.dispose()
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
        except:
            pass


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "HabitFlow Backend is running"}

def test_log_habit_and_history():
    # 1. Log a habit
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

    # 2. Get history
    response = client.get("/api/history")
    assert response.status_code == 200
    history = response.json()
    assert len(history) > 0
    assert history[0]["name"] == "Code Python"

def test_predict():
    # Test based on known weights:
    # bias: 6.0
    # sleep: -0.8 * 8 = -6.4
    # coding: 0.5 * 4 = +2.0
    # others 0 for simplicity
    # Expected: 6 - 6.4 + 2 = 1.6
    
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
    # 1.6 is expected score
    assert result["burnoutScore"] == 1.6
    assert result["riskLevel"] == "Low"
