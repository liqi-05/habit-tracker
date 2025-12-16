import sys
import os

# Add root to path
sys.path.append(os.getcwd())

print("Importing backend.main...")
try:
    from backend import main
    print("Successfully imported backend.main")
except Exception as e:
    print(f"Failed to import backend.main: {e}")

print("Importing backend.ml_service...")
try:
    from backend import ml_service
    print("Successfully imported backend.ml_service")
except Exception as e:
    print(f"Failed to import backend.ml_service: {e}")
