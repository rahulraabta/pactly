
import json
import random
import sys
import os

# Add current directory to path so we can import data files
sys.path.append(os.getcwd())

try:
    from data_cases import DATA_CASES
    from pbi_questions import PBI_PRACTICAL_QUESTIONS, PBI_CONCEPT_QUESTIONS
except ImportError:
    print("Error: Could not import data files. Make sure you are in the correct directory.")
    sys.exit(1)

# --- SYSTEM PROMPTS (Copied from exec_coach.py to avoid import issues) ---

SYSTEM_PROMPT_BUSINESS = """
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
"""

SYSTEM_PROMPT_PBI = """
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
"""

def create_example(system_instruction, user_content, model_response_obj):
    # The SDK seems to enforce 'text_input' and 'output' for tuning examples
    # even for chat models in some versions/configurations.
    # We will format the input to look like a chat transcript.
    
    text_input = f"System: {system_instruction.strip()}\n\nUser: {user_content.strip()}"
    output = json.dumps(model_response_obj)
    
    return {
        "text_input": text_input,
        "output": output
    }

def main():
    training_data = []

    # --- PROCESS BUSINESS CASES ---
    print(f"Processing {len(DATA_CASES)} Business Cases...")
    for case in DATA_CASES:
        # Simulate a user asking about the case or responding to it.
        # Since we want to train the model to PROVIDE the solution/critique,
        # we'll simulate the User asking for the case assessment or providing a partial answer.
        # But specifically, the app flow is: User answers -> Model critiques.
        
        # We'll simulate a generic user "attempt" to prompt the model's critique & solution.
        user_input = f"Here is my analysis for the case: {case['title']}\n\nScenario: {case['scenario']}\n\nMy thoughts: I think we should look at the financial data and maybe competitors."
        
        model_output = {
            "critique": f"Your attempt touches on the basics but lacks depth. You need to apply a structured framework like {case.get('framework', 'SWOT or Porter\'s 5 Forces').split(':')[0]}. Don't just list data; synthesize it into a strategic recommendation.",
            "discussion_points": case.get("clarifying_questions", ["Strategic Rationale", "Financial Impact", "Risks"]),
            "golden_rewrite": case["solution"],
            "next_question": "How would you validate these assumptions with a quick market test?"
        }
        
        training_data.append(create_example(SYSTEM_PROMPT_BUSINESS, user_input, model_output))

    # --- PROCESS POWER BI QUESTIONS (Practical) ---
    print(f"Processing {len(PBI_PRACTICAL_QUESTIONS)} Power BI Practical Questions...")
    for q in PBI_PRACTICAL_QUESTIONS:
        user_input = f"Question: {q['question']}\nHint: {q.get('hint', '')}"
        
        model_output = {
            "critique": "This is a common scenario. Ensure you understand the context transition and aggregation level required.",
            "discussion_points": ["DAX Syntax", "Context Transition", "Visualization Choice"],
            "golden_rewrite": q["solution"],
            "next_question": "Ready for a harder one?"
        }
        
        training_data.append(create_example(SYSTEM_PROMPT_PBI, user_input, model_output))

    # --- PROCESS POWER BI QUESTIONS (Concept) ---
    print(f"Processing {len(PBI_CONCEPT_QUESTIONS)} Power BI Concept Questions...")
    for q in PBI_CONCEPT_QUESTIONS:
        user_input = f"Explain this concept: {q['question']}"
        
        model_output = {
            "critique": "Good question. This is fundamental to understanding how Power BI processes data.",
            "discussion_points": [q.get("category", "General"), "Best Practices", "Common Pitfalls"],
            "golden_rewrite": q["solution"],
            "next_question": "Can you give me a practical example of this?"
        }
        
        training_data.append(create_example(SYSTEM_PROMPT_PBI, user_input, model_output))

    # --- WRITING OUTPUT ---
    random.shuffle(training_data)
    
    output_file = "training_data.jsonl"
    with open(output_file, "w", encoding="utf-8") as f:
        for example in training_data:
            f.write(json.dumps(example) + "\n")
            
    print(f"Successfully created {output_file} with {len(training_data)} examples.")

if __name__ == "__main__":
    main()
