
from google import genai
import os

api_key = os.environ.get("GOOGLE_API_KEY") 
# Try secrets
if not api_key:
    try:
        import tomli
        with open(".streamlit/secrets.toml", "rb") as f:
            secrets = tomli.load(f)
            api_key = secrets.get("GOOGLE_API_KEY")
    except:
        # manual parsing fallback
        with open(".streamlit/secrets.toml", "r") as f:
            for line in f:
                if "GOOGLE_API_KEY" in line:
                     parts = line.split("=")
                     if len(parts) == 2:
                         api_key = parts[1].strip().strip('"').strip("'")

client = genai.Client(api_key=api_key)

try:
    with open("models_list_utf8.txt", "w", encoding="utf-8") as f:
        # Syntax for list_models might be client.models.list()
        pager = client.models.list(config={"page_size": 100})
        for model in pager:
            # Check if tuning is supported
            # supported_actions might be a field
            if "createTunedModel" in (model.supported_actions or []):
                 f.write(f"Tunable: {model.name}\n")
            elif "gemini" in model.name:
                 f.write(f"Gemini (Maybe tunable?): {model.name} - Actions: {model.supported_actions}\n")
except Exception as e:
    with open("models_list_utf8.txt", "w", encoding="utf-8") as f:
        f.write(f"Error listing models: {e}\n")
        f.write(str(dir(client.models)))
