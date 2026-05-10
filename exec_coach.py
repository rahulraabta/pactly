import streamlit as st
from groq import Groq
import json
import os
from io import BytesIO
from datetime import datetime
from functools import lru_cache
import pandas as pd
import random
import random
import random
from pbi_questions import PBI_PRACTICAL_QUESTIONS, PBI_CONCEPT_QUESTIONS
from data_cases import DATA_CASES
# --- NEW IMPORTS FOR PRACTICE MODE ---
import duckdb
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))
from utils.data_manager import load_questions, generate_mock_data
from utils.interview_manager import load_interview_experiences



# --- 1. CONFIG MUST BE FIRST ---
st.set_page_config(
    page_title="NexaCoach | AI-Powered Excellence",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. PROFESSIONAL LIGHT THEME CSS (LeetCode/HackerRank Inspired) ---
st.markdown("""
<style>
    /* -------------------------------------------------------------------------- */
    /* 1. GLOBAL TYPOGRAPHY & RESET */
    /* -------------------------------------------------------------------------- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;800&display=swap');

    :root {
        --primary-gradient: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
        --glass-bg: rgba(255, 255, 255, 0.95);
        --glass-border: rgba(255, 255, 255, 0.4);
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --shadow-strong: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
        --shadow-soft: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        --accent-glow: 0 0 20px rgba(96, 239, 255, 0.4);
    }

    /* Override Streamlit Defaults */
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
        color: var(--text-primary);
    }

    /* 2. PREMIUM BACKGROUND */
    .stApp {
        background: 
            radial-gradient(circle at top left, rgba(96, 239, 255, 0.2), transparent 40%),
            radial-gradient(circle at bottom right, rgba(0, 97, 255, 0.2), transparent 40%),
            linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%) !important;
        background-attachment: fixed !important;
    }

    /* 3. FLOATING DASHBOARD CONTAINER */
    /* The main block container now acts as a floating glass sheet */
    .block-container {
        background-color: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 24px;
        padding: 3.5rem !important;
        margin-top: 1.5rem;
        box-shadow: var(--shadow-strong);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        max-width: 92% !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* Subtle lift on idle */
    /* .block-container:hover {
        box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.3);
    } */

    /* 4. SIDEBAR REFINEMENT */
    section[data-testid="stSidebar"] {
        background-color: rgba(0, 15, 40, 0.95) !important; /* Dark rich blue */
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(15px);
    }
    
    /* Sidebar Text */
    section[data-testid="stSidebar"] h1, 
    section[data-testid="stSidebar"] h2, 
    section[data-testid="stSidebar"] h3, 
    section[data-testid="stSidebar"] label,
    section[data-testid="stSidebar"] .stMarkdown,
    section[data-testid="stSidebar"] p {
        color: #e2e8f0 !important;
        font-weight: 500;
    }
    
    /* Sidebar Input overrides */
    section[data-testid="stSidebar"] .stTextInput input,
    section[data-testid="stSidebar"] .stSelectbox div[data-baseweb="select"] div {
         background-color: rgba(255, 255, 255, 0.1) !important;
         color: white !important;
         border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    /* 5. TYPOGRAPHY HEADERS */
    h1, h2, h3 {
        color: #0f172a !important;
        font-family: 'Outfit', sans-serif !important;
        font-weight: 800;
        letter-spacing: -0.02em;
    }
    
    h1 {
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.8rem !important;
        margin-bottom: 0.5rem !important;
    }
    
    h2 {
        font-size: 1.8rem !important;
        margin-top: 1.5rem !important;
        border-bottom: 2px solid #f1f5f9;
        padding-bottom: 0.5rem;
    }

    /* 6. CARDS & EXPANDERS */
    .stCard, div[data-testid="stExpander"] {
        background: #ffffff;
        border: 1px solid #f1f5f9;
        border-radius: 16px;
        box-shadow: var(--shadow-soft);
        transition: all 0.2s ease;
        overflow: hidden;
    }
    
    div[data-testid="stExpander"]:hover {
        border-color: #cbd5e1;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
    
    /* Expander Header */
    .streamlit-expanderHeader {
        background-color: #fafbfc;
        font-weight: 600;
        color: #334155;
        border-bottom: 1px solid #f1f5f9;
    }

    /* 7. BUTTONS: THE "WOW" FACTOR */
    .stButton > button {
        background: var(--primary-gradient) !important;
        color: white !important;
        border: none !important;
        padding: 0.6rem 2.2rem !important;
        border-radius: 9999px !important;
        font-weight: 600 !important;
        font-family: 'Outfit', sans-serif !important;
        letter-spacing: 0.02em;
        box-shadow: 0 4px 14px 0 rgba(0, 118, 255, 0.39) !important;
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        position: relative;
        overflow: hidden;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(0, 118, 255, 0.23) !important;
        filter: brightness(1.05);
    }
    
    .stButton > button:active {
        transform: translateY(0) !important;
    }

    /* Secondary/Ghost Buttons (if any) could be targeted similarly if we had classes, 
       but for standard st.buttons this is the primary style. */

    /* 8. INPUT FIELDS */
    .stTextInput > div > div > input, 
    .stTextArea > div > div > textarea, 
    .stSelectbox > div > div > div {
        background-color: #f8fafc !important;
        border: 2px solid #e2e8f0 !important;
        border-radius: 12px !important;
        color: #1e293b !important;
        font-weight: 500;
        transition: all 0.2s;
    }
    
    .stTextInput > div > div > input:focus, 
    .stTextArea > div > div > textarea:focus,
    .stSelectbox > div > div > div:focus-within {
        background-color: #ffffff !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
    }

    /* 9. DATAFRAMES & TABLES */
    div[data-testid="stDataFrame"] {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
    }

    /* 10. HERO SECTION STYLES */
    .hero-container {
        text-align: center;
        padding: 2rem 0 3rem 0;
        animation: fadeIn 0.8s ease-out;
    }
    
    .hero-logo {
        font-size: 4.5rem;
        font-weight: 800;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        font-family: 'Outfit', sans-serif;
        letter-spacing: -2px;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }
    
    .hero-tagline {
        font-size: 1.4rem;
        color: #64748b;
        font-weight: 500;
        margin-top: -10px;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* 11. MODE SELECTION BUTTONS - CUSTOM GROUP */
    /* We want these to look like tabs or large detailed cards */
    div[data-testid="column"] button {
        background: #ffffff !important;
        color: #334155 !important; 
        border: 1px solid #e2e8f0 !important;
        box-shadow: var(--shadow-soft) !important;
        height: auto !important;
        padding: 1rem !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    div[data-testid="column"] button:hover {
        border-color: #3b82f6 !important;
        background: #eff6ff !important;
        color: #1d4ed8 !important;
    }

    /* Active State Logic handled via Python key check, but visual feedback: */
    div[data-testid="column"] button:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
    }

</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# 12. CUSTOM COMPONENT CSS (Advanced)
# ------------------------------------------------------------------------------
st.markdown("""
<style>
    /* 1. CHAT HEADER & AVATAR */
    .chat-header {
        background: rgba(255, 255, 255, 0.8) !important;
        backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
        border-radius: 16px !important;
        padding: 1.25rem !important;
        margin-bottom: 1.5rem !important;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    
    .chat-avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        box-shadow: 0 4px 10px rgba(0, 97, 255, 0.3);
    }
    
    .chat-title {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        font-size: 1.1rem;
        color: #0f172a;
    }
    
    .chat-subtitle {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* 2. RIGHT PANEL CONTAINERS */
    .panel-container {
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid #f1f5f9;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    
    .panel-title {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
        color: #1e293b;
        margin-bottom: 0.5rem;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.5rem;
    }

    /* 3. DISCUSSION POINTS & TIPS */
    .discussion-point {
        background: #f1f5f9;
        border-left: 4px solid #3b82f6;
        padding: 0.75rem 1rem;
        border-radius: 0 8px 8px 0;
        margin-bottom: 0.8rem;
        font-size: 0.9rem;
        color: #334155;
        font-weight: 500;
    }
    
    .tip-box {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #bfdbfe;
        border-radius: 12px;
        padding: 1.25rem;
        margin-top: 1.5rem;
    }
    
    .tip-title {
        color: #1d4ed8;
        font-weight: 700;
        font-size: 0.9rem;
        margin-bottom: 0.4rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .tip-text {
        color: #1e40af;
        font-size: 0.85rem;
        line-height: 1.5;
    }

    /* 4. STATS CONTAINER */
    .stats-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .stat-item {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        text-align: center;
        transition: transform 0.2s;
    }
    .stat-item:hover {
        transform: translateY(-2px);
        border-color: #cbd5e1;
    }
    
    .stat-value {
        font-family: 'Outfit', sans-serif;
        font-size: 1.8rem;
        font-weight: 800;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .stat-label {
        color: #64748b;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 0.2rem;
    }

    /* 5. DIFFICULTY BADGES */
    .difficulty-hard {
        background-color: #fee2e2;
        color: #991b1b;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid #fecaca;
    }
    .difficulty-medium {
        background-color: #fef3c7;
        color: #92400e;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid #fde68a;
    }
    .difficulty-easy {
        background-color: #dcfce7;
        color: #166534;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid #bbf7d0;
    }

    /* 6. GOLDEN BOX (Consulting Standard) */
    .golden-box {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border: 1px solid #fcd34d;
        border-radius: 12px;
        padding: 1.5rem;
        color: #78350f;
        font-family: 'Georgia', serif; /* Serif for "Golden" feel */
        font-size: 1rem;
        line-height: 1.6;
        box-shadow: 0 4px 6px -1px rgba(251, 191, 36, 0.1);
        position: relative;
    }
    
    .golden-box::before {
        content: "✨ GOLDEN VERSION";
        position: absolute;
        top: -10px;
        left: 20px;
        background: #f59e0b;
        color: white;
        padding: 0.2rem 0.8rem;
        border-radius: 9999px;
        font-size: 0.7rem;
        font-weight: 700;
        font-family: 'Inter', sans-serif;
    }

    /* 7. VOICE INDICATOR */
    .voice-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #ef4444;
        color: white;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        animation: pulse 1.5s infinite;
        margin-top: 1rem;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    /* 8. MESSAGE BUBBLES */
    .message-user {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #bfdbfe;
        color: #1e3a8a;
        padding: 1rem 1.25rem;
        border-radius: 16px 16px 0 16px; /* Chat bubble shape */
        font-size: 1rem;
        line-height: 1.5;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    
    .message-ai {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        color: #334155;
        padding: 1rem 1.25rem;
        border-radius: 16px 16px 16px 0;
        font-size: 1rem;
        line-height: 1.5;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    /* 9. KPI CARD */
    .kpi-card {
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        text-align: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .kpi-label {
        color: #64748b;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }
    
    .kpi-value {
        color: #10b981; /* Default success green, or use theme color */
        font-family: 'Outfit', sans-serif;
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* 10. FOOTER */
    .app-footer {
        text-align: center;
        padding: 2rem 0;
        margin-top: 3rem;
        border-top: 1px solid #e2e8f0;
        color: #94a3b8;
        font-size: 0.85rem;
        font-family: 'Inter', sans-serif;
    }
    .app-footer span {
        font-weight: 600;
        color: #3b82f6; /* Brand blue */
    }

</style>
""", unsafe_allow_html=True)


# --- 3. IMPORTS FOR VOICE ---
from streamlit_mic_recorder import speech_to_text
from gtts import gTTS

# --- 4. AUTHENTICATION ---
# --- 4. AUTHENTICATION & CLIENT SETUP ---
if "model_provider" not in st.session_state:
    st.session_state.model_provider = "Groq"

# --- 4. AUTHENTICATION & CLIENT SETUP ---
if "model_provider" not in st.session_state:
    st.session_state.model_provider = "Groq"

# --- 4. AUTHENTICATION (Logic Only here, UI is below) ---
if "model_provider" not in st.session_state:
    st.session_state.model_provider = "Google Gemini" # Default to Gemini for convenience? No, stick to Groq default or previous preference.
    # Actually, default is Groq.


api_key = None
client = None
genai_model = None

if st.session_state.model_provider == "Groq":
    api_key = os.environ.get("GROQ_API_KEY") or st.secrets.get("GROQ_API_KEY")
    if not api_key:
        st.error("🔑 GROQ_API_KEY missing.")
        st.stop()
    client = Groq(api_key=api_key)

elif st.session_state.model_provider == "Google Gemini":
    try:
        import google.generativeai as genai
    except ImportError:
        st.error("❌ `google-generativeai` package missing. Run `pip install google-generativeai`")
        st.stop()
        
    api_key = os.environ.get("GOOGLE_API_KEY") or st.secrets.get("GOOGLE_API_KEY")
    if not api_key:
        st.error("🔑 GOOGLE_API_KEY missing.")
        st.stop()
        
    genai.configure(api_key=api_key)
    # Use Tuned Model if provided, else Flash
    model_name = st.session_state.get("tuned_model_id") or "gemini-1.5-flash"
    genai_model = genai.GenerativeModel(model_name)


# --- 6. MODES CONFIGURATION ---
MODES = {
    "Business": {
        "icon": "💼",
        "role": "The Strategy Partner",
        "color": "#8b5cf6",
        "system_instruction": """
ROLE: You are 'The Strategy Partner', a Senior Partner at McKinsey, BCG, or Bain.
TASK: Conduct C-Level Strategy Case Interviews:
- Market Entry & sizing (Starbucks in Italy)
- Digital Transformation (Microsoft Cloud Pivot)
- Crisis Management (Uber Turnaround)
- M&A Valuation (Disney buying Fox)

STYLE: Be rigorous, demand data-backed hypothesis, test for "Executive Presence". DO NOT accept surface-level answers.

OUTPUT FORMAT (JSON ONLY):
{
    "critique": "Sharp feedback on their framework and business acumen (2-3 sentences).",
    "discussion_points": ["Framework gap", "Quantitative angle", "Stakeholder consideration"],
    "golden_rewrite": "A structured, MECE response demonstrating consulting-grade thinking.",
    "next_question": "Next case question or deep-dive."
}
""",
        "initial_msg": "Your client is a mid-sized retail bank in Southeast Asia. Digital-only banks are capturing 20% of new customers annually. Should we launch our own digital bank, or improve our existing mobile app? Walk me through your approach.",
        "initial_points": ["Market analysis", "Competitive positioning", "Build vs Buy decision"],
    },
    "Soft Skills": {
        "icon": "🎯",
        "role": "The Mentor",
        "color": "#22d3ee",
        "system_instruction": """
ROLE: You are 'The Mentor', an executive coach who has advised Fortune 500 leaders.
TASK: Evaluate behavioral and soft skills:
- Leadership & Influence
- Communication & Executive Presence
- Conflict Resolution
- Emotional Intelligence
- Teamwork & Collaboration

STYLE: Use STAR method. Push for specific examples with measurable outcomes.

OUTPUT FORMAT (JSON ONLY):
{
    "critique": "Feedback on storytelling, impact, and leadership presence (2-3 sentences).",
    "discussion_points": ["Leadership dimension", "Communication skill", "Self-awareness opportunity"],
    "golden_rewrite": "An exemplary STAR response with specific metrics.",
    "next_question": "Next behavioral question."
}
""",
        "initial_msg": "Tell me about a time when you had to influence a decision without having formal authority. What was the situation, and what made your approach effective?",
        "initial_points": ["Influence without authority", "Stakeholder management", "Communication strategy"],
    },
    "SQL": {
        "icon": "🗄️",
        "role": "The Architect",
        "color": "#10b981",
        "system_instruction": """
ROLE: You are 'The Architect', a Principal Data Engineer at a FAANG company.
TASK: Test SQL skills with MEDIUM and HARD problems:
- Window Functions (RANK, ROW_NUMBER, LAG, LEAD)
- Complex JOINs and CTEs
- Aggregations and CASE statements
- Subqueries and query optimization

DIFFICULTY: Only MEDIUM or HARD. NO easy problems.

OUTPUT FORMAT (JSON ONLY):
{
    "critique": "Evaluate correctness, efficiency, style (2-3 sentences).",
    "discussion_points": ["Optimization opportunity", "Edge case", "Alternative approach"],
    "golden_rewrite": "Optimized SQL with comments.",
    "next_question": "Next challenge intro.",
    "problem_context": {
        "title": "Problem Title",
        "difficulty": "MEDIUM or HARD",
        "description": "Problem statement.",
        "schema": "CREATE TABLE statements.",
        "table_refs": "Markdown table showing 3-5 rows of sample data for each table.",
        "expected_output": "Sample expected output table.",
        "solution": "The complete SQL solution query with explanation.",
        "hints": "1-2 hints."
    }
}
""",
        "initial_msg": "Welcome to SQL Challenge. We focus on MEDIUM and HARD problems. Let's start.",
        "initial_context": {
            "title": "Consecutive Login Streak",
            "difficulty": "HARD",
            "description": "Find users with at least 3 consecutive login days. Return user_id and longest streak start date.",
            "schema": "Table: logins (user_id INT, login_date DATE)\nSample: (1,'2024-01-01'),(1,'2024-01-02'),(1,'2024-01-03'),(2,'2024-01-01'),(2,'2024-01-03')",
            "table_refs": "| user_id | login_date |\n|---|---|\n| 1 | 2024-01-01 |\n| 1 | 2024-01-02 |\n| 1 | 2024-01-03 |\n| 2 | 2024-01-01 |\n| 2 | 2024-01-03 |",
            "expected_output": "| user_id | streak_start | streak_length |\n|---------|--------------|---------------|\n| 1       | 2024-01-01   | 3             |",
            "solution": "WITH ranked AS (\n  SELECT user_id, login_date,\n    login_date - INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) DAY AS grp\n  FROM logins\n),\nstreaks AS (\n  SELECT user_id, MIN(login_date) AS streak_start, COUNT(*) AS streak_length\n  FROM ranked\n  GROUP BY user_id, grp\n  HAVING COUNT(*) >= 3\n)\nSELECT * FROM streaks ORDER BY streak_length DESC;",
            "hints": "Use ROW_NUMBER with date arithmetic (Islands & Gaps pattern)"
        },
        "initial_points": ["Window functions", "Islands & Gaps pattern", "Date arithmetic"],
    },
    "Power BI": {
        "icon": "📊",
        "role": "The Analyst",
        "color": "#f59e0b",
        "system_instruction": """
ROLE: You are 'The Analyst', a Senior BI Developer and Power BI expert.
TASK: Test Power BI skills:
- Data Modeling (Star schema, relationships)
- DAX Functions (CALCULATE, FILTER, time intelligence)
- Visualization Best Practices
- Performance Optimization
- Row-Level Security

OUTPUT FORMAT (JSON ONLY):
{
    "critique": "Feedback on DAX, modeling, or visualization (2-3 sentences).",
    "discussion_points": ["DAX concept", "Model design", "Performance tip"],
    "golden_rewrite": "Correct DAX formula or approach with explanation.",
    "next_question": "Next Power BI scenario."
}
""",
        "initial_msg": "You're building a sales dashboard. The business wants 'Sales YTD' that resets each fiscal year (starting April 1). Current date context should apply. Write the DAX measure.",
        "initial_points": ["Time Intelligence DAX", "Fiscal year handling", "Context awareness"],
    },
    "Interview Process": {
        "icon": "🛣️",
        "role": "The Career Coach",
        "color": "#ec4899",
        "system_instruction": "ROLE: You are 'The Career Coach'. Help the user practice for specific interview rounds.",
        "initial_msg": "Select a company and role to see the interview roadmap.",
        "initial_points": [],
    },
    "Practice": {
        "icon": "📝",
        "role": "The Interviewer",
        "color": "#6366f1",
        "system_instruction": "", # Not used for this mode mostly
        "initial_msg": "Select a question from the left to start coding!",
        "initial_points": [],
    }
}
# --- 7. SESSION STATE ---
if "voice_mode" not in st.session_state:
    st.session_state.voice_mode = False

if "last_audio" not in st.session_state:
    st.session_state.last_audio = None

if "current_mode" not in st.session_state:
    st.session_state.current_mode = "Business"
    
@st.cache_data
def generate_sample_data():
    regions = ['North', 'South', 'East', 'West']
    products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headset']
    segments = ['Consumer', 'Corporate', 'Home Office']
    
    data = []
    for _ in range(200):
        data.append({
            'Date': pd.Timestamp('2024-01-01') + pd.Timedelta(days=random.randint(0, 365)),
            'Region': random.choice(regions),
            'Product': random.choice(products),
            'Segment': random.choice(segments),
            'Sales': random.randint(100, 5000),
            'Profit': random.randint(10, 1000),
            'Discount': round(random.uniform(0, 0.3), 2)
        })
    return pd.DataFrame(data)

def render_visual(state, df):
    # Dynamic Aggregation
    if state["type"] == "KPI Card":
        if state['agg'] == "Sum":
            val = df[state['y']].sum()
        elif state['agg'] == "Avg":
            val = df[state['y']].mean()
        else:
            val = df[state['y']].count()
            
        prefix = "$" if state['y'] in ["Sales", "Profit", "Discount"] else ""
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">{state['agg']} of {state['y']}</div>
            <div class="kpi-value">{prefix}{val:,.0f}</div>
        </div>
        """, unsafe_allow_html=True)
    else:
        # Grouping
        if state["agg"] == "Sum":
            chart_data = df.groupby(state['x'])[state['y']].sum().reset_index()
        elif state["agg"] == "Avg":
            chart_data = df.groupby(state['x'])[state['y']].mean().reset_index()
        else: # Count
            chart_data = df.groupby(state['x'])[state['y']].count().reset_index()
        
        # Rendering
        if state["type"] == "Bar Chart":
            st.bar_chart(chart_data, x=state['x'], y=state['y'], color="#2cbb5d")
        elif state["type"] == "Line Chart":
            st.line_chart(chart_data, x=state['x'], y=state['y'], color="#2cbb5d")
        elif state["type"] == "Donut Chart":
             # Fallback to bar chart as simple donut isn't native without extra libs
             st.bar_chart(chart_data, x=state['x'], y=state['y'], color="#ffa116")

if "session_start" not in st.session_state:
    st.session_state.session_start = datetime.now()

if "questions_answered" not in st.session_state:
    st.session_state.questions_answered = 0

if "sql_context" not in st.session_state:
    st.session_state.sql_context = MODES["SQL"]["initial_context"]

if "sql_context" not in st.session_state:
    st.session_state.sql_context = MODES["SQL"]["initial_context"]

if "pbi_data" not in st.session_state:
    st.session_state.pbi_data = generate_sample_data()

def init_mode_state(mode_name):
    hist_key = f"history_{mode_name}"
    points_key = f"points_{mode_name}"
    config = MODES[mode_name]

    if hist_key not in st.session_state:
        st.session_state[hist_key] = []
        initial_payload = {
            "critique": "Session starting. Let's see what you've got.",
            "discussion_points": config["initial_points"],
            "golden_rewrite": "",
            "next_question": config["initial_msg"]
        }
        if mode_name == "SQL":
            initial_payload["problem_context"] = config["initial_context"]
        elif mode_name == "SQL":
            initial_payload["case_context"] = config["initial_context"]
            
        st.session_state[hist_key].append({
            "role": "model", 
            "content": json.dumps(initial_payload)
        })
    
    if points_key not in st.session_state:
        st.session_state[points_key] = config["initial_points"].copy()
    
    return hist_key, points_key, config

# --- 8. HELPER FUNCTIONS ---
def text_to_speech(text):
    try:
        tts = gTTS(text=text, lang='en', slow=False)
        audio_bytes = BytesIO()
        tts.write_to_fp(audio_bytes)
        audio_bytes.seek(0)
        return audio_bytes
    except Exception as e:
        return None

def get_session_duration():
    delta = datetime.now() - st.session_state.session_start
    minutes = int(delta.total_seconds() // 60)
    return f"{minutes}m"



# --- 9. HERO SECTION ---
st.markdown("""
<div class="hero-container">
    <div class="hero-logo">🧠 NexaCoach</div>
    <div class="hero-tagline">Your AI-Powered Path to Excellence</div>
</div>
""", unsafe_allow_html=True)

# --- 10. MODE SELECTION ---
cols = st.columns(len(MODES))
for i, (mode_name, mode_config) in enumerate(MODES.items()):
    with cols[i]:
        is_active = st.session_state.current_mode == mode_name
        active_class = "active" if is_active else ""
        
        if st.button(
            f"{mode_config['icon']}\n{mode_name.split()[0]}", 
            key=f"mode_{mode_name}",
            use_container_width=True
        ):
            if st.session_state.current_mode != mode_name:
                st.session_state.current_mode = mode_name
                st.rerun()

# --- AI CONFIGURATION (Moved from Sidebar) ---
with st.expander("🤖 AI Model Configuration", expanded=False):
    ai_col1, ai_col2 = st.columns([1, 2])
    with ai_col1:
        st.session_state.model_provider = st.radio(
            "AI Provider",
            ["Groq", "Google Gemini"],
            horizontal=True,
            index=0 if st.session_state.model_provider == "Groq" else 1
        )
    with ai_col2:
        if st.session_state.model_provider == "Google Gemini":
            st.session_state.tuned_model_id = st.text_input(
                "Model Name (e.g. gemini-1.5-flash or tunedModels/...)",
                value=st.session_state.get("tuned_model_id", "gemini-1.5-flash")
            )
        else:
            st.info("Using Llama-3.3-70b via Groq (Fastest)")

# Current mode
current_mode = st.session_state.current_mode
history_key, points_key, current_config = init_mode_state(current_mode)


# ------------------------------------------------------------------------------
# INTERVIEW PROCESS LOGIC
# ------------------------------------------------------------------------------
if current_mode == "Interview Process":
    st.markdown("## 🛣️ Interview Process & Roadmap")
    
    experiences = load_interview_experiences()
    
    if not experiences:
        st.warning("No interview experiences found.")
        st.stop()
        
    # Selection Area (Main Page)
    sel_col1, sel_col2 = st.columns([1, 2])
    
    with sel_col1:
        # Search Filter
        search_query = st.text_input("🔍 Search Company/Role", "", placeholder="e.g. Google, Startup...")
        
    # Filter logic
    filtered_experiences = experiences
    if search_query:
        filtered_experiences = [
            exp for exp in experiences 
            if search_query.lower() in exp['company'].lower() or search_query.lower() in exp['role'].lower()
        ]
        
    if not filtered_experiences:
        st.warning("No matches found.")
        experience_names = []
    else:
        experience_names = [f"{exp['company']} - {exp['role']}" for exp in filtered_experiences]
        
    with sel_col2:
        selected_exp_name = st.selectbox("Choose a Path:", experience_names)
        
    # Find selected experience data
    selected_exp = next((exp for exp in experiences if f"{exp['company']} - {exp['role']}" == selected_exp_name), None)
    
    if selected_exp:
        st.info(f"**Overview:** {selected_exp['description']}")
        st.markdown(f"### 📍 {selected_exp['company']} Interview Roadmap")
        
        # Timeline / Steps View
        for step in selected_exp['process_steps']:
            with st.expander(f"Step {step['step']}: {step['name']} ({step['duration']})", expanded=False):
                st.markdown(f"**Focus:** {step['key_focus']}")
                st.write(step['description'])
                st.divider()
                
                # Practice Section
                # Practice Section
                st.markdown("#### 🎯 Practice This Step")
                
                # Check for Coding Question Types
                is_single_code = step.get('question_type') == 'code'
                is_multi_challenge = step.get('question_type') == 'code_challenges'
                
                user_answer = "" # Default
                
                if is_multi_challenge:
                    challenges = step.get('challenges', [])
                    challenge_titles = [c['title'] for c in challenges]
                    selected_ch_title = st.selectbox(f"Select Challenge ({len(challenges)} Available):", challenge_titles, key=f"sel_ch_{selected_exp['id']}_{step['step']}")
                    
                    # Find selected challenge data
                    active_challenge = next((c for c in challenges if c['title'] == selected_ch_title), challenges[0])
                    
                    st.markdown(f"**Question:** *{active_challenge['question']}*")
                    st.info(f"💡 Difficulty: **{active_challenge['difficulty']}** | Type: **{active_challenge['type'].upper()}**")
                    
                    # Dataset Preview
                    with st.expander("💾 View Datasets & Schema"):
                        table_names = active_challenge.get('tables', [])
                        if table_names:
                            mock_data = generate_mock_data(table_names)
                            for t_name, df in mock_data.items():
                                st.markdown(f"**Table: `{t_name}`**")
                                st.dataframe(df.head(3))
                                st.caption(f"Columns: {list(df.columns)}")
                        else:
                            st.write("No specific tables defined.")

                    # Code Editor
                    code_input = st.text_area(
                        f"Write {active_challenge['type'].upper()} Code:", 
                        value=active_challenge.get('initial_code', ''), 
                        height=200,
                        key=f"code_{selected_exp['id']}_{step['step']}_{active_challenge['title']}"
                    )
                    
                    # Solution Reveal
                    with st.expander("🔓 Reveal Solution"):
                        st.code(active_challenge['solution'], language=active_challenge['type'])

                    # Execution Logic
                    if st.button(f"▶️ Run Code", key=f"run_{selected_exp['id']}_{step['step']}_{active_challenge['title']}"):
                        if active_challenge['type'] == 'sql':
                            try:
                                local_con = duckdb.connect(database=':memory:')
                                # Load only required mock tables for this challenge
                                mock_tables = generate_mock_data(active_challenge.get('tables', [])) 
                                for t_name, t_df in mock_tables.items():
                                    local_con.register(t_name, t_df)
                                
                                result = local_con.execute(code_input).df()
                                st.success("Query Executed Successfully!")
                                st.dataframe(result)
                            except Exception as e:
                                st.error(f"SQL Error: {e}")
                        else:
                            st.warning("⚠️ Python execution is sandboxed. Showing mock output.")
                            st.code("Processing...\nSuccess.", language="text")
                            
                    user_answer = code_input
                    practice_q_text = active_challenge['question']

                elif is_single_code:
                     # ... [Keep existing single code logic for backward compatibility or simple cases] ...
                    st.markdown(f"**Question:** *{step['practice_question']}*")
                    code_type = step.get('code_type', 'text')
                    st.info(f"💡 This is a **Hard {code_type.upper()} Challenge**. Write and run your code below.")
                    
                    code_input = st.text_area(
                        f"Write {code_type.upper()} Code:", 
                        value=step.get('initial_code', ''), 
                        height=200,
                        key=f"code_{selected_exp['id']}_{step['step']}"
                    )
                     # Execution Logic (Simplified for single)
                    if st.button(f"▶️ Run Code", key=f"run_{selected_exp['id']}_{step['step']}"):
                         # ... [Reuse existing logic] ...
                         st.info("Execution logic same as above")
                    user_answer = code_input
                    practice_q_text = step['practice_question']
                
                else:
                    # Text based
                    st.markdown(f"**Question:** *{step['practice_question']}*")
                    user_answer = st.text_area(f"Your Answer (Step {step['step']}):", key=f"ans_{selected_exp['id']}_{step['step']}")
                    practice_q_text = step['practice_question']
                
                if st.button(f"Get Feedback (Step {step['step']})", key=f"btn_{selected_exp['id']}_{step['step']}"):
                    if user_answer.strip():
                        with st.spinner("Analyzing your answer..."):
                             # Construct prompt for AI
                            prompt = f"""
                            You are a Senior Interviewer at {selected_exp['company']}.
                            Role: {selected_exp['role']}.
                            Round: {step['name']}.
                            
                            The candidate was asked: "{step['practice_question']}"
                            
                            Candidate Answer:
                            "{user_answer}"
                            
                            Provide constructive feedback. formatting:
                            - **Strengths**: What they did well.
                            - **Weaknesses**: What was missing (culture fit, STAR method, technical depth).
                            - **Refined Answer**: A better way to say it.
                            """
                            
                            # Call AI (using existing helper if available or direct client)
                            # Re-using the generate_response logic from main app would be ideal, 
                            # but for now let's use the client directly to avoid scope issues or extensive refactoring.
                            try:
                                stream = client.chat.completions.create(
                                    model=st.session_state["selected_model"],
                                    messages=[
                                        {"role": "system", "content": "You are an expert technical interviewer."},
                                        {"role": "user", "content": prompt}
                                    ],
                                    temperature=0.7,
                                    stream=True
                                )
                                st.write_stream(stream)
                            except Exception as e:
                                st.error(f"AI Error: {e}")
                    else:
                         st.warning("Please write an answer first.")

    st.stop() # Stop rest of app

# --- PRACTICE MODE IMPLEMENTATION ---
if current_mode == "Practice":
    st.markdown("## 📝 Practice Mode")
    
    # Load Data
    all_questions = load_questions()
    
    # Sidebar Filters - Use an expander/container in sidebar if sidebar is used, 
    # but the main app doesn't use standard sidebar heavily. Let's put it in a column or expander.
    with st.expander("🔍 Filters", expanded=True):
        f_col1, f_col2, f_col3 = st.columns(3)
        with f_col1:
             # Company Filter
            companies = sorted(list(set([c for q in all_questions for c in q.get('company', [])])))
            selected_companies = st.multiselect("Company", companies)
        with f_col2:
            # Difficulty Filter
            difficulties = ["Easy", "Medium", "Hard"]
            selected_difficulty = st.multiselect("Difficulty", difficulties)
        with f_col3:
            # Category Filter
            categories = sorted(list(set([q.get('category', 'SQL') for q in all_questions])))
            selected_category = st.multiselect("Category", categories)

    # Filter Logic
    filtered_questions = all_questions
    if selected_companies:
        filtered_questions = [q for q in filtered_questions if any(c in selected_companies for c in q.get('company', []))]
    if selected_difficulty:
        filtered_questions = [q for q in filtered_questions if q.get('difficulty') in selected_difficulty]
    if selected_category:
        filtered_questions = [q for q in filtered_questions if q.get('category') in selected_category]

    # Selection
    col_list, col_main = st.columns([1, 2])
    
    with col_list:
        st.markdown(f"### Questions ({len(filtered_questions)})")
        for q in filtered_questions:
            # Color code difficulty
            diff_color = "🟢" if q['difficulty'] == "Easy" else "🟡" if q['difficulty'] == "Medium" else "🔴"
            if st.button(f"{diff_color} {q['title']}", key=f"q_{q['id']}", use_container_width=True):
                st.session_state.selected_question_id = q['id']

    # Get selected question
    selected_q_id = st.session_state.get('selected_question_id')
    question = next((q for q in all_questions if q['id'] == selected_q_id), None)

    with col_main:
        if question:
            st.markdown(f"### {question['title']}")
            st.caption(f"**Company**: {', '.join(question['company'])} | **Difficulty**: {question['difficulty']} | **Category**: {question['category']}")
            st.markdown(question['question'])
            
            # Helper to generate data
            db_tables = generate_mock_data(question.get('tables', []))
            
            # Tabs
            tab_data, tab_sql, tab_hint, tab_sol = st.tabs(["💾 Data Schema", "✍️ SQL Editor", "💡 Hints", "🔓 Solution"])
            
            with tab_data:
                for name, df in db_tables.items():
                    with st.expander(f"Table: {name} ({len(df)} rows)", expanded=True):
                        st.dataframe(df.head())
            
            with tab_sql:
                # Register tables in DuckDB
                con = duckdb.connect(database=':memory:')
                for name, df in db_tables.items():
                    con.register(name, df)
                
                default_sql = f"SELECT * FROM {question['tables'][0]} LIMIT 5;" if question.get('tables') else "SELECT 1;"
                
                # Keep query in session state so it doesn't reset on rerun
                if f"query_{question['id']}" not in st.session_state:
                     st.session_state[f"query_{question['id']}"] = default_sql
                     
                user_query = st.text_area("Write your SQL query here:", height=200, key=f"txt_{question['id']}", value=st.session_state[f"query_{question['id']}"])
                st.session_state[f"query_{question['id']}"] = user_query # Update state
                
                if st.button("Run Query 🏃", key=f"run_{question['id']}"):
                    try:
                        result = con.execute(user_query).df()
                        st.dataframe(result)
                        st.success(f"Query executed successfully! Returned {len(result)} rows.")
                    except Exception as e:
                        st.error(f"Error: {e}")

            with tab_hint:
                for h in question.get('hints', []):
                    st.info(h)
                    
            with tab_sol:
                if st.checkbox("Show Solution", key=f"chk_{question['id']}"):
                    st.code(question['solution_sql'], language='sql')
                    st.markdown("### Expected Output:")
                    st.markdown(question.get('expected_output', ''))

        else:
            st.info("👈 Select a question from the list to start practicing.")

    st.stop() # Stop rendering the rest of the app for Practice Mode

# --- 11. MAIN LAYOUT ---
col1, col2 = st.columns([2, 1])

# --- RIGHT COLUMN: PANEL ---
with col2:
    if current_mode == "SQL":
        # SQL Coding Problem Panel
        st.markdown("""<div class="panel-container">
            <div class="panel-title">💻 SQL Challenge</div>
        </div>""", unsafe_allow_html=True)
        
        ctx = st.session_state.sql_context
        difficulty = ctx.get("difficulty", "MEDIUM")
        
        # Difficulty badge with proper styling
        if difficulty == "HARD":
            diff_badge = '<span class="difficulty-hard">🔴 HARD</span>'
        elif difficulty == "MEDIUM":
            diff_badge = '<span class="difficulty-medium">🟡 MEDIUM</span>'
        else:
            diff_badge = '<span class="difficulty-easy">🟢 EASY</span>'
        
        st.markdown(f"### {ctx.get('title', 'Problem')} {diff_badge}", unsafe_allow_html=True)
        st.markdown(ctx.get("description", ""))
        
        st.markdown("**📋 Schema:**")
        st.code(ctx.get("schema", ""), language="sql")
        
        if ctx.get("table_refs"):
             with st.expander("💾 Table Data Preview", expanded=False):
                 st.markdown(ctx.get("table_refs", ""))
        
        if ctx.get("expected_output"):
            with st.expander("📊 Expected Output", expanded=False):
                st.markdown(f"```\n{ctx.get('expected_output', '')}\n```")
        
        with st.expander("💡 Hints", expanded=False):
            st.info(ctx.get("hints", ""))
        
        # Show Solution - properly display SQL code
        solution = ctx.get("solution", "")
        if solution:
            with st.expander("✅ Solution", expanded=False):
                st.code(solution, language="sql")
    
    elif current_mode == "SQL":
        # SQL Case Study Panel
        st.markdown("""<div class="panel-container">
            <div class="panel-title">📈 Business Case</div>
        </div>""", unsafe_allow_html=True)
        
        ctx = st.session_state.sql_context
        st.markdown(ctx.get("scenario", ""))
        st.markdown("**Available Tables:**")
        st.code(ctx.get("schema", ""), language="sql")
        st.markdown(f"**Current Step:** {ctx.get('current_step', '1')}")
        if ctx.get("key_insight"):
            st.info(f"💡 **Key Insight:** {ctx.get('key_insight', '')}")
            
    elif current_mode == "Power BI":
        # Power BI Interview Panel
        st.markdown("""<div class="panel-container">
            <div class="panel-title">🎤 Interview Prep</div>
        </div>""", unsafe_allow_html=True)
        
        # --- SECTION 1: PRACTICAL CHALLENGE ---
        st.markdown("### 📊 Practical Challenge (Dataset)")
        st.info("Use the Visual Builder or DAX Studio to solve this using the loaded dataset.")
        
        p_q = PBI_PRACTICAL_QUESTIONS[st.session_state.pbi_prac_index]
        st.markdown(f"**Q: {p_q['question']}**")
        
        # Hint/Solution for Practical
        with st.expander("💡 Hint"):
            st.warning(p_q["hint"])
        with st.expander("✅ Solution Steps"):
            st.markdown(p_q["solution"])
            
        if st.button("Next Challenge ➡️", key="btn_prac_next", use_container_width=True):
             st.session_state.pbi_prac_index = (st.session_state.pbi_prac_index + 1) % len(PBI_PRACTICAL_QUESTIONS)
             # Sync Concept question with Practical question change
             st.session_state.pbi_concept_index = (st.session_state.pbi_concept_index + 1) % len(PBI_CONCEPT_QUESTIONS)
             st.rerun()

        st.markdown("---")
        
        # Dataset Context (Mini)
        with st.expander("💾 Dataset Preview", expanded=False):
            st.dataframe(st.session_state.pbi_data.head(5), hide_index=True)
            
        st.markdown("---")

        # --- SECTION 2: BONUS CONCEPT QUESTIONS ---
        st.markdown("### ⚡ Bonus: Rapid Fire")
        
        c_q = PBI_CONCEPT_QUESTIONS[st.session_state.pbi_concept_index]
        
        # Category Badge
        cat = c_q["category"]
        st.markdown(f"**Category:** `{cat}`")
        st.markdown(f"**Q: {c_q['question']}**")
        
        with st.expander("reveal answer"):
             st.markdown(c_q["solution"])
    elif current_mode == "Business":
        if "business_case_index" not in st.session_state:
            st.session_state.business_case_index = 0
            
        bs_case = DATA_CASES[st.session_state.business_case_index]
        
        st.markdown(f"### 📈 Case {bs_case['id']}: {bs_case['title']}")
        st.info(bs_case["scenario"])
        
        with st.expander("🕵️ Clarifying Questions (Hint)"):
            for q in bs_case["clarifying_questions"]:
                st.markdown(f"- {q}")
                
        with st.expander("💾 Financial & Market Data"):
            st.markdown(bs_case["data_context"])
            
        with st.expander("🏗️ Strategic Framework"):
            st.markdown(bs_case["framework"])
            
        if st.button("📝 Reveal Full Solution", use_container_width=True):
            # Inject solution into chat history
            solution_msg = f"""**✅ Solution for {bs_case['title']}**\n\n{bs_case['solution']}"""
            st.session_state[history_key].append({"role": "assistant", "content": solution_msg})
            st.rerun()

        if st.button("Next Case ➡️", use_container_width=True):
            st.session_state.business_case_index = (st.session_state.business_case_index + 1) % len(DATA_CASES)
            st.rerun()

    else:
        # Discussion Focus Panel
        st.markdown(f"""
        <div class="panel-container">
            <div class="panel-title">🎯 Discussion Focus</div>
        </div>
        """, unsafe_allow_html=True)
        
        for point in st.session_state[points_key]:
            st.markdown(f"""<div class="discussion-point">{point}</div>""", unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class="tip-box">
            <div class="tip-title">💡 Pro Tip</div>
            <div class="tip-text">Focus on these areas in your response. The AI coach will provide specific feedback based on your answers.</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Session Stats
    st.markdown(f"""
    <div class="stats-container">
        <div class="stat-item">
            <div class="stat-value">{st.session_state.questions_answered}</div>
            <div class="stat-label">Questions</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{get_session_duration()}</div>
            <div class="stat-label">Duration</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Voice Mode Toggle
    st.markdown("---")
    st.session_state.voice_mode = st.toggle("🎤 Voice Mode", value=st.session_state.voice_mode)
    
    if st.session_state.voice_mode:
        st.markdown("""<div class="voice-indicator active">🔊 Voice Active</div>""", unsafe_allow_html=True)
        if st.session_state.last_audio:
            st.audio(st.session_state.last_audio, format="audio/mp3", autoplay=True)
    
    # Reset Button
    st.markdown("")
    if st.button("🔄 Reset Session", use_container_width=True):
        if history_key in st.session_state: 
            del st.session_state[history_key]
        if points_key in st.session_state: 
            del st.session_state[points_key]
        st.session_state.questions_answered = 0
        st.session_state.session_start = datetime.now()
        if current_mode == "SQL":
            st.session_state.sql_context = MODES["SQL"]["initial_context"]
        elif current_mode == "SQL":
            st.session_state.sql_context = MODES["SQL"]["initial_context"]
        st.rerun()

# --- LEFT COLUMN: CHAT ---
with col1:
    # Chat Header
    st.markdown(f"""
    <div class="chat-header">
        <div class="chat-avatar">{current_config['icon']}</div>
        <div>
            <div class="chat-title">{current_config['role']}</div>
            <div class="chat-subtitle">{current_mode}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # POWER BI VISUAL BUILDER
    if "pbi_viz_state" not in st.session_state:
        st.session_state.pbi_viz_state = None
    
    if "pbi_dashboard" not in st.session_state:
        st.session_state.pbi_dashboard = []
        
    if "pbi_measures" not in st.session_state:
        st.session_state.pbi_measures = {}

    if "pbi_prac_index" not in st.session_state:
        st.session_state.pbi_prac_index = 0
        
    if "pbi_concept_index" not in st.session_state:
        st.session_state.pbi_concept_index = 0
        
    if current_mode == "Power BI":
        # --- 1. GLOBAL SLICERS ---
        st.markdown("### 🔍 Global Filters")
        f1, f2 = st.columns(2)
        with f1: 
            filter_region = st.multiselect("Region", ["North", "South", "East", "West"], default=["North", "South", "East", "West"])
        with f2:
            filter_segment = st.multiselect("Segment", ["Consumer", "Corporate", "Home Office"], default=["Consumer", "Corporate", "Home Office"])
        
        # Apply Filters
        filtered_df = st.session_state.pbi_data[
            (st.session_state.pbi_data["Region"].isin(filter_region)) & 
            (st.session_state.pbi_data["Segment"].isin(filter_segment))
        ].copy()
        
        # Calculate dynamic measures
        for m_name, m_func in st.session_state.pbi_measures.items():
            if m_func == "SUM": filtered_df[m_name] = filtered_df["Sales"] # Placeholder logic
            # In a real app we'd evaluate DAX here. For simulator we just add cols.
        
        st.markdown("---")

        # --- 2. DAX STUDIO ---
        with st.expander("𝑓𝑥 DAX Studio (Quick Measures)", expanded=False):
            d1, d2 = st.columns([2, 1])
            with d1: 
                measure_name = st.text_input("Measure Name", placeholder="e.g., Total Sales YTD")
                measure_formula = st.selectbox("Quick Measure Pattern", ["SUM", "AVERAGE", "YTD", "YoY %", "% of Total"])
                measure_col = st.selectbox("Base Column", ["Sales", "Profit", "Discount"])
            with d2:
                st.markdown("<br>", unsafe_allow_html=True)
                if st.button("➕ Create Measure", use_container_width=True):
                    if measure_name:
                        st.session_state.pbi_measures[measure_name] = {"formula": measure_formula, "col": measure_col}
                        st.success(f"Created measure: {measure_name}")
                        st.rerun()

        # --- 3. REPORT CANVAS (Visual Builder) ---
        with st.expander("🎨 Report Canvas", expanded=True):
            # Visual Builder Controls
            c1, c2, c3, c4 = st.columns(4)
            with c1: v_type = st.selectbox("Visual Type", ["Bar Chart", "Line Chart", "KPI Card", "Donut Chart"], key="v_type")
            
            # Dynamic Axis/Values based on Type
            axis_opts = ["Region", "Product", "Segment", "Date"]
            val_opts = ["Sales", "Profit", "Discount"] + list(st.session_state.pbi_measures.keys())
            
            with c2: x_val = st.selectbox("Axis / Category", axis_opts, key="v_x")
            with c3: y_val = st.selectbox("Values", val_opts, key="v_y")
            with c4: agg = st.selectbox("Aggregation", ["Sum", "Avg", "Count"], key="v_agg")
            
            b1, b2 = st.columns(2)
            with b1:
                if st.button("📊 Preview Visual", use_container_width=True):
                    st.session_state.pbi_viz_state = {"type": v_type, "x": x_val, "y": y_val, "agg": agg}
            with b2:
                if st.button("📌 Pin to Dashboard", use_container_width=True):
                    st.session_state.pbi_dashboard.append({"type": v_type, "x": x_val, "y": y_val, "agg": agg})
                    st.success("Pinned to Dashboard Grid!")
        
        # --- 4. DASHBOARD GRID LAYOUT ---
        st.markdown("### 🖥️ Dashboard Layout")
        
        # Preview Area
        if st.session_state.pbi_viz_state:
            st.info("Preview Mode (Pin to add to grid)")
            visual = st.session_state.pbi_viz_state
            render_visual(visual, filtered_df)
            st.markdown("---")
        
        # Pinned Visuals Grid
        if st.session_state.pbi_dashboard:
            grid_cols = st.columns(2)
            for i, visual in enumerate(st.session_state.pbi_dashboard):
                with grid_cols[i % 2]:
                    with st.container(border=True):
                        st.markdown(f"**{visual['y']} by {visual['x']}**")
                        render_visual(visual, filtered_df)
                        if st.button("🗑️", key=f"del_{i}"):
                            st.session_state.pbi_dashboard.pop(i)
                            st.rerun()
                            
        st.markdown("---")
    
    # Chat Messages Container
    # Chat Messages
    history = st.session_state[history_key]
    for msg in history:
        if msg["role"] == "user":
            with st.chat_message("user", avatar="👤"):
                if msg.get("type") == "code":
                    st.code(msg["content"], language="sql")
                else:
                    st.markdown(f'<div class="message-user">{msg["content"]}</div>', unsafe_allow_html=True)
        else:
            with st.chat_message("assistant", avatar=current_config['icon']):
                try:
                    data = json.loads(msg["content"])
                    
                    # Show the main question/scenario prominently
                    if data.get("next_question"):
                        st.markdown(f'### 💬 {current_config["role"]}')
                        st.markdown(data.get("next_question", ""))
                    
                    # Show case context for SQL Case Study
                    if current_mode == "SQL" and data.get("case_context"):
                        ctx = data["case_context"]
                        if ctx.get("scenario"):
                            st.info(ctx.get("scenario", ""))
                    
                    # Show problem context for SQL Coding
                    if current_mode == "SQL" and data.get("problem_context"):
                        ctx = data["problem_context"]
                        st.markdown(f"**Problem:** {ctx.get('title', '')}")
                        st.markdown(ctx.get('description', ''))
                    
                    # Show critique/feedback if not initial message
                    if data.get("critique") and "Session starting" not in data.get("critique", ""):
                        st.markdown(f'<div class="message-ai"><strong>Feedback:</strong> {data.get("critique", "")}</div>', unsafe_allow_html=True)
                    
                    # Show golden rewrite
                    if data.get("golden_rewrite"):
                        with st.expander("✨ The Golden Version"):
                            if current_mode == "SQL":
                                st.code(data.get("golden_rewrite"), language="sql")
                            else:
                                st.markdown(f'<div class="golden-box">{data.get("golden_rewrite")}</div>', unsafe_allow_html=True)
                    
                except:
                    st.write(msg["content"])
    
    # Voice Input
    if st.session_state.voice_mode:
        st.markdown("---")
        voice_text = speech_to_text(
            language='en',
            start_prompt="🎤 Click to speak",
            stop_prompt="⏹️ Stop",
            just_once=True,
            key=f'voice_{current_mode}'
        )
        if voice_text:
            user_input = voice_text
            st.success(f"📝 Captured: {user_input}")
        else:
            user_input = None
    else:
        voice_text = None
        user_input = None
    
    # Text/Code Input
    if current_mode == "SQL":
        with st.form("sql_form", clear_on_submit=True):
            code_input = st.text_area("💻 SQL Workspace", height=150, placeholder="SELECT * FROM ...")
            submit = st.form_submit_button("Submit Solution", use_container_width=True)
            if submit and code_input:
                user_input = code_input
    elif current_mode == "SQL":
        text_input = st.chat_input("Describe your approach or write SQL...")
        if text_input:
            user_input = text_input
    else:
        text_input = st.chat_input("Type your answer...")
        if text_input:
            user_input = text_input
    
    # Override with voice if available
    if voice_text:
        user_input = voice_text
    
    # Process Input
    if user_input:
        is_code = (current_mode == "SQL" and not voice_text)
        msg_type = "code" if is_code else "text"
        
        st.session_state[history_key].append({"role": "user", "content": user_input, "type": msg_type})
        st.session_state.questions_answered += 1
        
        # Generate Response (Optimized for speed)
        # Only include last 2 exchanges for context to reduce token processing
        recent_context = history[-2:] if len(history) >= 2 else history
        prompt = f"""{current_config['system_instruction']}

Context: {str(recent_context)}

User: {user_input}
"""
        
        with st.spinner(f"⚡ Generating response..."):
            try:
                if st.session_state.model_provider == "Groq":
                    response = client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {"role": "system", "content": current_config['system_instruction']},
                            {"role": "user", "content": f"Context: {str(recent_context)}\n\nUser: {user_input}"}
                        ],
                        temperature=0.7,
                        max_tokens=1024,
                        response_format={"type": "json_object"}
                    )
                    response_text = response.choices[0].message.content.strip()

                elif st.session_state.model_provider == "Google Gemini":
                    model_name = st.session_state.get("tuned_model_id") or "gemini-1.5-flash"
                    # Configure model with system instruction
                    current_genai_model = genai.GenerativeModel(
                        model_name=model_name,
                        system_instruction=current_config['system_instruction']
                    )
                    
                    chat_response = current_genai_model.generate_content(
                        f"Context: {str(recent_context)}\n\nUser: {user_input}",
                        generation_config={"response_mime_type": "application/json"}
                    )
                    response_text = chat_response.text.strip()
                if response_text.startswith("```"):
                    lines = response_text.split("\n")
                    response_text = "\n".join(lines[1:-1])
                
                data = json.loads(response_text)
                
                # Update state
                if "discussion_points" in data:
                    st.session_state[points_key] = data["discussion_points"]
                
                if current_mode == "SQL" and "problem_context" in data:
                    st.session_state.sql_context = data["problem_context"]
                
                if current_mode == "SQL" and "case_context" in data:
                    st.session_state.sql_context = data["case_context"]
                
                st.session_state[history_key].append({"role": "model", "content": json.dumps(data)})
                
                # Voice response
                if st.session_state.voice_mode:
                    speech_text = f"{data.get('critique', '')} {data.get('next_question', '')}"
                    audio = text_to_speech(speech_text)
                    if audio:
                        st.session_state.last_audio = audio
                else:
                    st.session_state.last_audio = None
                
                st.rerun()
                
            except json.JSONDecodeError:
                st.error("⚠️ Response parsing error. Please try again.")
            except Exception as e:
                st.error(f"⚠️ Error: {e}")

# --- FOOTER ---
st.markdown("""
<div class="app-footer">
    <span>NexaCoach</span> • Powered by AI • Built for Excellence
</div>
""", unsafe_allow_html=True)
