
from google.genai import types
import inspect

print("--- TuningExample Fields ---")
try:
    # iterating over annotations or using help
    print(types.TuningExample.__annotations__)
except:
    print(help(types.TuningExample))
