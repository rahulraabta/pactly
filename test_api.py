"""Test the new google-genai package with generate_content"""
from google import genai

API_KEY = "AIzaSyDqGkoRQi3bU0VhKSmkLg4R_qyofVWRyQk"

client = genai.Client(api_key=API_KEY)

print("Testing generate_content with gemini-2.0-flash...")

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello in one word."
    )
    print(f"Response: {response.text}")
    print("\nAPI key is VALID and generate_content works!")
except Exception as e:
    print(f"\nError: {e}")
