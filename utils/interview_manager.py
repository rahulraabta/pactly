import json
import os

def load_interview_experiences():
    """Loads interview experiences from the JSON file."""
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'interview_experiences.json')
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
