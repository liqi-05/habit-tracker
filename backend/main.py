from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, timedelta
from . import models, database, ml_service

# Initialize Database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models for Habits
class HabitCreate(BaseModel):
    name: str
    date: date
    status: str
    category: str

class HabitResponse(HabitCreate):
    id: int
    class Config:
        orm_mode = True

# --- API Endpoints ---

@app.post("/api/log", response_model=HabitResponse)
def log_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    db_habit = models.Habit(
        name=habit.name,
        date=habit.date,
        status=habit.status,
        category=habit.category
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.get("/api/history", response_model=List[HabitResponse])
def get_history(db: Session = Depends(get_db)):
    # Fetch last 30 days
    thirty_days_ago = date.today() - timedelta(days=30)
    return db.query(models.Habit).filter(models.Habit.date >= thirty_days_ago).all()

@app.post("/api/predict", response_model=ml_service.PredictionResult)
def predict_burnout(stats: ml_service.DailyStats):
    # Note: Using POST for predict because we are sending a complex JSON body
    return ml_service.predictor.predict(stats)

@app.get("/")
def read_root():
    return {"message": "HabitFlow Backend is running"}
