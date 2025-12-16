from sqlalchemy import Column, Integer, String, Date, Boolean
from .database import Base

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(Date, index=True)
    status = Column(String)  # e.g., "completed", "skipped"
    category = Column(String) # e.g., "health", "work"
    
    # Optional: we can add more fields if needed matching the frontend stats, 
    # but the user specific request was "name, date, status, category".
