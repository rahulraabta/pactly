import sys
import os
import pandas as pd

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.data_manager import load_questions, generate_mock_data

def test_load_questions():
    print("Testing load_questions()...")
    questions = load_questions()
    print(f"Loaded {len(questions)} questions.")
    assert len(questions) >= 16, "Not enough questions loaded (expected 16+)."
    print("SUCCESS")

def test_generate_mock_data():
    print("Testing generate_mock_data()...")
    
    # Test original tables
    tables = ["employees", "departments", "user_actions"]
    data = generate_mock_data(tables)
    for t in tables:
        assert t in data, f"Table {t} missing."
        assert isinstance(data[t], pd.DataFrame), f"{t} is not a DataFrame."
    
    # Test new professional tables
    new_tables = ["google_gmail_emails", "fb_users", "fb_comments", "marketing_campaigns", "campaign_revenue"]
    data_new = generate_mock_data(new_tables)
    for t in new_tables:
        assert t in data_new, f"New table {t} missing."
        assert not data_new[t].empty, f"New table {t} is empty."
        print(f"Table {t} generated with shape {data_new[t].shape}.")
        
    print("SUCCESS")

if __name__ == "__main__":
    test_load_questions()
    test_generate_mock_data()
