
from google import genai
import os
import inspect

api_key = os.environ.get("GOOGLE_API_KEY") or "dummy_key"
client = genai.Client(api_key=api_key)

try:
    print(help(client.tunings.tune))
except Exception as e:
    print(f"Error inspecting help: {e}")

print("\n--- Method Signature from inspect ---")
try:
    sig = inspect.signature(client.tunings.tune)
    print(f"tune{sig}")
except Exception as e:
    print(f"Error inspecting signature: {e}")
