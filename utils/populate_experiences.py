import json
import os

def get_experiences():
    experiences = []
    
    # --- 1. MAANG & Big Tech (Real Hard Questions) ---
    # Structure: (Company, Role, Focus, [List of Challenges])
    big_tech = [
        ("Amazon", "Business Analyst", "Leadership Principles, SQL", [
            {
                "title": "Monthly Percentage Difference (Stratascratch ID 10319)",
                "difficulty": "Hard",
                "type": "sql",
                "question": "Given a table of purchases, calculate the month-over-month percentage change in revenue. The output should include the year-month date (YYYY-MM) and percentage change, rounded to the 2nd decimal spot, and sorted from the beginning of the year to the end of the year.",
                "tables": ["sf_transactions"],
                "initial_code": "SELECT * FROM sf_transactions LIMIT 5;",
                "solution": """
WITH monthly_revenue AS (
    SELECT 
        strftime('%Y-%m', created_at) as ym, 
        SUM(value) as revenue 
    FROM sf_transactions 
    GROUP BY 1
),
lagged_revenue AS (
    SELECT 
        ym, 
        revenue, 
        LAG(revenue) OVER (ORDER BY ym) as prev_month_revenue 
    FROM monthly_revenue
)
SELECT 
    ym, 
    ROUND((revenue - prev_month_revenue) * 100.0 / prev_month_revenue, 2) as retention_rate 
FROM lagged_revenue
ORDER BY ym;
"""
            }
        ]),
        ("Google", "Data Analyst", "Product Sense, SQL", [
            {
                "title": "Activity Rank (Stratascratch ID 10351)",
                "difficulty": "Hard",
                "type": "sql",
                "question": "Find the email activity rank for each user. Email activity is the total number of emails sent. The user with the highest number of emails sent will have a rank of 1, and so on. Output the user, total emails, and their activity rank. Order records by the total emails in descending order. Sort users with the same number of emails in alphabetical order. In your rankings, return a unique value (i.e., a unique rank) even if multiple users have the same number of emails.",
                "tables": ["google_gmail_emails"],
                "initial_code": "SELECT * FROM google_gmail_emails LIMIT 5;",
                "solution": """
SELECT 
    from_user, 
    COUNT(*) as total_emails,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC, from_user ASC) as rnk
FROM google_gmail_emails
GROUP BY from_user
"""
            }
        ]),
        ("Facebook (Meta)", "Data Scientist", "SQL, Product Metrics", [
             {
                "title": "Popularity Percentage (Stratascratch ID 10284)",
                "difficulty": "Hard",
                "type": "sql",
                "question": "Find the popularity percentage for each user on Meta/Facebook. The popularity percentage is defined as the total number of friends the user has divided by the total number of users on the platform, then multiplied by 100. Output each user along with their popularity percentage. Order records in ascending order by user ID.",
                "tables": ["facebook_friends"],
                "initial_code": "SELECT * FROM facebook_friends LIMIT 5;",
                "solution": """
WITH all_friends AS (
    SELECT user1 as user_id, user2 as friend_id FROM facebook_friends
    UNION ALL
    SELECT user2 as user_id, user1 as friend_id FROM facebook_friends
),
total_users AS (
    SELECT COUNT(DISTINCT user_id) as cnt FROM all_friends
)
SELECT 
    user_id, 
    COUNT(friend_id) * 100.0 / (SELECT cnt FROM total_users) as popularity_percent
FROM all_friends
GROUP BY user_id
ORDER BY user_id
"""
            }
        ]),
        ("Microsoft", "Data Analyst", "SQL, Power BI", [
            {
                "title": "Premium vs Freemium (Stratascratch ID 10300)",
                "difficulty": "Hard",
                "type": "sql",
                "question": "Find the total number of downloads for paying and non-paying users by date. Include only records where non-paying customers have more downloads than paying customers. The output should be sorted by earliest date first and contain 3 columns: date, non-paying downloads, paying downloads.",
                "tables": ["ms_user_dimension", "ms_acc_dimension", "ms_download_facts"],
                "initial_code": "SELECT * FROM ms_download_facts LIMIT 5;",
                "solution": """
WITH joined AS (
    SELECT 
        d.date,
        d.downloads,
        a.paying_customer
    FROM ms_download_facts d
    JOIN ms_user_dimension u ON d.user_id = u.user_id
    JOIN ms_acc_dimension a ON u.acc_id = a.acc_id
)
SELECT 
    date,
    SUM(CASE WHEN paying_customer = 'no' THEN downloads ELSE 0 END) as non_paying,
    SUM(CASE WHEN paying_customer = 'yes' THEN downloads ELSE 0 END) as paying
FROM joined
GROUP BY date
HAVING SUM(CASE WHEN paying_customer = 'no' THEN downloads ELSE 0 END) > SUM(CASE WHEN paying_customer = 'yes' THEN downloads ELSE 0 END)
ORDER BY date
"""
            }
        ]),
         ("Airbnb", "Data Scientist", "Booking Funnel, Experimentation", [
            {
                "title": "Growth of Airbnb (Stratascratch ID 9637)",
                "difficulty": "Hard",
                "type": "sql",
                "question": "Estimate the growth of Airbnb each year using the number of hosts registered as the growth metric. The rate of growth is calculated by taking ((number of hosts registered in the current year - number of hosts registered in the previous year) / number of hosts registered in the previous year) * 100. Output the year, number of hosts, and growth rate. Round the rate to the nearest percentage and order by year ASC.",
                "tables": ["airbnb_hosts"],
                "initial_code": "SELECT * FROM airbnb_hosts LIMIT 5;",
                "solution": """
WITH yearly_hosts AS (
    SELECT 
        CAST(strftime('%Y', joined_date) AS INT) as year,
        COUNT(host_id) as current_year_hosts
    FROM airbnb_hosts
    GROUP BY 1
),
lagged AS (
    SELECT 
        year, 
        current_year_hosts, 
        LAG(current_year_hosts) OVER (ORDER BY year) as prev_year_hosts
    FROM yearly_hosts
)
SELECT 
    year, 
    current_year_hosts, 
    ROUND((current_year_hosts - prev_year_hosts) * 100.0 / prev_year_hosts, 0) as growth_rate
FROM lagged
ORDER BY year
"""
            }
        ]),
        ("Uber", "Data Analyst", "Marketplace Dynamics", [
            {
                 "title": "Naive Forecasting (Stratascratch ID 10313)",
                 "difficulty": "Hard",
                 "type": "sql",
                 "question": "Some forecasting methods are extremely simple and surprisingly effective. Naive forecast is one of them; we simply set all forecasts to be the value of the last observation. Our goal is to develop a naive forecast for a new metric called 'distance per dollar' defined as the (distance_to_travel/monetary_cost) in our dataset and measure its accuracy. To develop this forecast, sum 'distance to travel' and 'monetary cost' values at a monthly level before calculating 'distance per dollar'. This value becomes your actual value for the current month. The next step is to populate the forecasted value for each month. This can be achieved simply by getting the previous month's value in a separate column. Now, we have actual and forecasted values. This is your output.",
                 "tables": ["uber_request_data"],
                 "solution": """
WITH monthly_metrics AS (
    SELECT 
        strftime('%Y-%m', request_date) as ym,
        SUM(distance_to_travel) as total_dist,
        SUM(monetary_cost) as total_cost
    FROM uber_request_data
    GROUP BY 1
),
actuals AS (
    SELECT 
        ym, 
        ROUND(total_dist / total_cost, 2) as actual_value
    FROM monthly_metrics
)
SELECT 
    ym, 
    actual_value,
    LAG(actual_value) OVER (ORDER BY ym) as forecast
FROM actuals
ORDER BY ym
"""
            }
        ])
    ]
    
    # Process Big Tech
    for comp, role, focus, challenges in big_tech:
        # Default text step for non-tech rounds
        steps = [
             {"step": 1, "name": "Recruiter Screen", "duration": "30m", "description": "Resume walkthrough.", "key_focus": "Fit", "practice_question": "Why " + comp + "?", "question_type": "text"},
             {
                "step": 2, 
                "name": "Technical Screen", 
                "duration": "60m", 
                "description": "Live Coding Challenges (Hard).", 
                "key_focus": "Execution", 
                "challenges": challenges, 
                "question_type": "code_challenges"
             },
             {"step": 3, "name": "Onsite Loop", "duration": "4 hrs", "description": "Multiple rounds.", "key_focus": "Depth", "practice_question": "Tell me about a complex project.", "question_type": "text"}
        ]
        
        experiences.append({
            "id": f"{comp.lower().replace(' ', '_')}_da",
            "company": comp,
            "role": role,
            "source": "Aggregated Industry Data",
            "description": f"{comp} looks for strong technical skills. Expect {focus}. **Hard Mode Enabled**.",
            "process_steps": steps
        })

    # --- 2. REST OF COMPANIES (Simplified for now, can be expanded similarly) ---
    high_growth = [
        "Stripe", "Uber", "Airbnb", "Databricks", "Snowflake", "Palantir", "DoorDash", 
        "Spotify", "Shopify", "Slack", "Zoom", "Pinterest", 
        "Snap", "TikTok", "Dropbox", "Salesforce", "Oracle", "Microsoft", "Apple", "LinkedIn", "Twitter (X)" 
    ]
    # Note: Moved some big names here to save space in this update snippet, 
    # but normally they'd get the detailed treatment above.
    
    for comp in high_growth:
        experiences.append({
            "id": f"{comp.lower().replace(' ', '_')}_da",
            "company": comp,
            "role": "Data Analyst",
            "source": "Aggregated",
            "description": f"{comp} values speed and execution.",
            "process_steps": [
                {"step": 1, "name": "Recruiter Screen", "duration": "30m", "description": "Intro.", "key_focus": "Interest", "practice_question": "Why " + comp + "?", "question_type": "text"},
                {
                    "step": 2, 
                    "name": "Technical Screen", 
                    "duration": "60m", 
                    "description": "Practical data task.", 
                    "key_focus": "Execution", 
                    "question_type": "code_challenges",
                    "challenges": [
                        {
                            "title": "Analysis Task", 
                            "difficulty": "Medium",
                            "type": "sql",
                            "question": f"Analyze `user_actions` for {comp} metrics.",
                            "tables": ["user_actions"],
                            "initial_code": "SELECT * FROM user_actions;",
                            "solution": "SELECT COUNT(*) FROM user_actions;"
                        }
                    ]
                },
                {"step": 3, "name": "Manager Interview", "duration": "45m", "description": "Culture fit.", "key_focus": "Teamwork", "practice_question": "Describe a conflict.", "question_type": "text"}
            ]
        })
        
    return experiences

    # --- 3. Fintech & E-commerce (10) ---
    fintech = [
        "Robinhood", "Coinbase", "Square", "PayPal", "Wayfair", 
        "Flipkart", "Myntra", "Paytm", "Razorpay", "Revolut"
    ]
    
    for comp in fintech:
        experiences.append({
            "id": f"{comp.lower().replace(' ', '_')}_da",
            "company": comp,
            "role": "Business Analyst",
            "source": "Aggregated",
            "description": f"{comp} deals with high transaction volumes. Precision and fraud detection are often key themes.",
            "process_steps": [
                 {
                     "step": 1, "name": "Online Assessment", "duration": "60m", "description": "Aptitude & Basic SQL.", "key_focus": "Basics", "practice_question": "Solve this probability puzzle.", "question_type": "text"
                 },
                 {
                     "step": 2, "name": "Case Round", "duration": "60m", "description": "Business guesstimate/sizing.", "key_focus": "Logic", "practice_question": "Estimate the daily transaction volume of " + comp + ".", "question_type": "text"
                 }
            ]
        })

    # --- 4. Service-Based (5) ---
    service = ["TCS", "Infosys", "Wipro", "Accenture", "Deloitte"]
    for comp in service:
        experiences.append({
            "id": f"{comp.lower().replace(' ', '_')}_ba",
            "company": comp,
            "role": "System Engineer / Analyst",
            "source": "AmbitionBox",
            "description": "Focus on fundamentals (SQL, DBMS, OOPs) and communication skills.",
            "process_steps": [
                 {"step": 1, "name": "Mass Assessment", "duration": "90m", "description": "Quant, Verbal, Logic.", "key_focus": "Filtering", "practice_question": "Time and Work problem.", "question_type": "text"},
                 {"step": 2, "name": "Technical Interview", "duration": "30m", "description": "Resume based.", "key_focus": "Projects", "practice_question": "Explain your final year project.", "question_type": "text"}
            ]
        })
        
    # --- 5. Startups (10 Examples) ---
    startups = [
        ("Zomato", "Growth Analyst"), ("Swiggy", "Data Analyst"), ("Cred", "Backend/Data"), 
        ("Ola", "Business Analyst"), ("Zepto", "Product Analyst"), ("Groww", "Data Scientist"),
        ("Zerodha", "Tech Associate"), ("Postman", "Data Engineer"), ("BrowserStack", "Analyst"), ("Freshworks", "SaaS Analyst")
    ]
    for comp, role in startups:
        experiences.append({
             "id": f"{comp.lower()}_startup",
             "company": comp,
             "role": role,
             "source": "AngelList / LinkedIn",
             "description": "Fast-paced startup environment. Expect to wear multiple hats.",
             "process_steps": [
                 {"step": 1, "name": "Founder/Lead Chat", "duration": "30m", "description": "Vibe check & passion.", "key_focus": "Hustle", "practice_question": "What would you change about our product?", "question_type": "text"},
                 {
                     "step": 2, 
                     "name": "Assignment", 
                     "duration": "Weekend", 
                     "description": "Real world problem.", 
                     "key_focus": "Output", 
                     "practice_question": "SQL Challenge: Calculate the Week-over-Week growth rate of orders. Tables: `campaign_revenue`.",
                     "question_type": "code",
                     "code_type": "sql",
                     "initial_code": "SELECT * FROM campaign_revenue;"
                 }
             ]
        })
        
    return experiences

if __name__ == "__main__":
    data = get_experiences()
    # Path relative to where script is run, assuming run from project root
    file_path = os.path.join("data", "interview_experiences.json")
    
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Successfully generated {len(data)} interview experiences in {file_path}")
