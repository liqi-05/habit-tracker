---
description: How to start the FastAPI Backend Server
---

To start the backend server for development:

1. **Navigate to the project root**:
   ```bash
   cd c:\Users\leeli\OneDrive\Documents\GitHub\liqi-05\lq05\habit-tracker
   ```

2. **Ensure dependencies are installed**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Start the server using Uvicorn**:
   ```bash
   uvicorn backend.main:app --reload
   ```

   The server will start at `http://127.0.0.1:8000`.

4. **Access the Interactive API Docs**:
   Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser to manually test the endpoints.
