---
description: How to run the backend tests for the Habit Tracker
---

To verify the backend functionality, you can run the automated tests using `pytest`.

1. **Navigate to the project root**:
   ```bash
   cd c:\Users\leeli\OneDrive\Documents\GitHub\liqi-05\lq05\habit-tracker
   ```

2. **Ensure dependencies are installed**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run the tests**:
   ```bash
   // turbo
   python -m pytest backend/test_backend.py -v
   ```

   This will execute the tests defined in `backend/test_backend.py`, which cover:
   - Root endpoint availability.
   - Creating and retrieving habits (`/api/log`, `/api/history`).
   - The ML prediction logic (`/api/predict`).
