
from google.genai import types

print("--- Tuning Types ---")
for name in dir(types):
    if "Tuning" in name:
        print(name)
