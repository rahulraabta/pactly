import os

file_path = "exec_coach.py"

# CSS to restore/add for the Hero Section
hero_css = """
    /* 8. HERO SECTION (Restored & Enhanced) */
    .hero-container {
        text-align: center;
        padding: 1rem 0 2rem 0;
        margin-bottom: 1rem;
    }
    
    .hero-logo {
        font-size: 3.5rem;
        font-weight: 800;
        background: -webkit-linear-gradient(45deg, #0061ff, #60efff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        letter-spacing: -1px;
    }
    
    .hero-tagline {
        font-size: 1.2rem;
        color: #5e6c84;
        font-weight: 500;
    }
"""

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Insert before the closing style tag
insert_marker = '</style>'
idx = content.find(insert_marker)

if idx != -1:
    new_content = content[:idx] + hero_css + content[idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully restored Hero CSS")
else:
    print("Could not find closing style tag")
