import re

# Read the file
with open('exec_coach.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the new modes config
with open('modes_config.py', 'r', encoding='utf-8') as f:
    new_modes = f.read()

# Find the MODES block and replace it
pattern = r'# --- 6\. MODES CONFIGURATION ---.*?^\}'
content = re.sub(pattern, new_modes, content, flags=re.MULTILINE | re.DOTALL)

# Update session state references  
content = content.replace('"Executive Presence"', '"Business"')
content = content.replace('"SQL Coding"', '"SQL"')
content = content.replace('"SQL Case Study"', '"SQL"')
content = content.replace('sql_coding_context', 'sql_context')
content = content.replace('sql_case_context', 'sql_context')

# Write back
with open('exec_coach.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done - file updated')
