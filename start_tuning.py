
import os
import json
import time
import sys

# Import the new SDK
try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: `google-genai` package is not installed.")
    print("Please run: pip install google-genai")
    sys.exit(1)

def get_api_key():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if api_key:
        return api_key
    
    # Try reading secrets.toml
    secrets_path = ".streamlit/secrets.toml"
    if os.path.exists(secrets_path):
        try:
            import tomli
            with open(secrets_path, "rb") as f:
                secrets = tomli.load(f)
                return secrets.get("GOOGLE_API_KEY")
        except ImportError:
            # Manual parse if tomli is missing
            with open(secrets_path, "r") as f:
                for line in f:
                    if "GOOGLE_API_KEY" in line:
                         parts = line.split("=")
                         if len(parts) == 2:
                             return parts[1].strip().strip('"').strip("'")
    return None

def main():
    api_key = get_api_key()
    if not api_key:
        print("Error: GOOGLE_API_KEY not found.")
        sys.exit(1)
        
    client = genai.Client(api_key=api_key)
    
    print("Loading training data...")
    training_data = []
    try:
        with open("training_data.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                item = json.loads(line)
                # The data is in {"messages": [...]} format.
                training_data.append(item)
    except FileNotFoundError:
        print("Error: training_data.jsonl not found.")
        sys.exit(1)

    print(f"Loaded {len(training_data)} examples.")
    
    # Base model - standard naming for new SDK usually doesn't need "models/" prefix but supports it
    # We will use gemini-1.0-pro-001 as it supports text tuning via SDK better
    base_model = "models/gemini-1.0-pro-001" 
    
    # Create explicit TuningExample objects
    # This avoids ambiguity in dict conversion
    examples = []
    for item in training_data:
        # types.TuningExample might use 'text_input'/'output' OR 'messages' depending on version
        # We prepared text_input/output in the data file.
        examples.append(types.TuningExample(
            text_input=item["text_input"],
            output=item["output"]
        ))

    dataset = types.TuningDataset(examples=examples)

    print(f"Starting tuning job for {base_model}...")
    try:
        operation = client.tunings.tune(
            base_model=base_model,
            training_dataset=dataset,
            config=types.CreateTuningJobConfig(
                epoch_count=5,
                batch_size=4,
                learning_rate=0.001,
                tuned_model_display_name="nexacoach-flash-v1"
            )
        )
        
        print(f"\nSUCCESS! Tuning job started.")
        print(f"Job Name: {operation.name}")
        # The operation object might be a job object already
        print(f"Tuned Model Name (pending): {operation.tuned_model}") 
        print("\nYou can check status at: https://aistudio.google.com/")
        
    except Exception as e:
        print(f"\nFailed to start tuning: {e}")
        # Fallback to verify if it was a method name issue
        if "'Client' object has no attribute 'tunings'" in str(e):
             print("Debug: Checking available client methods...")
             print(dir(client))

if __name__ == "__main__":
    main()
