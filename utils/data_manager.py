import pandas as pd
import json
import random
from datetime import datetime
import os

def load_questions():
    """Loads questions from the JSON file."""
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'questions.json')
    with open(file_path, 'r') as f:
        return json.load(f)

def generate_mock_data(table_names):
    """
    Generates dictionary of DataFrames for the requested table names.
    This acts as a centralized 'Database' for the practice mode.
    """
    data = {}
    
    # Common Data
    user_ids = range(1, 101)
    dates = pd.date_range(start="2024-01-01", end="2024-03-01", freq="D")
    
    if "user_actions" in table_names:
        actions = []
        for _ in range(500):
            actions.append({
                "user_id": random.choice(user_ids),
                "action_date": random.choice(dates),
                "action_type": random.choice(["login", "view", "click", "purchase"])
            })
        data["user_actions"] = pd.DataFrame(actions)
        
    if "employees" in table_names:
        employees = []
        names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi"]
        dept_ids = [1, 2, 3, 4]
        for i in range(1, 21):
            employees.append({
                "id": i,
                "name": random.choice(names),
                "salary": random.randint(50000, 200000),
                "dept_id": random.choice(dept_ids),
                "manager_id": random.choice([None] + list(range(1, 6))) # Some have managers
            })
        data["employees"] = pd.DataFrame(employees)
        if "employee" in table_names: # Alias
            data["employee"] = data["employees"]
            
    if "departments" in table_names:
        depts = [
            {"id": 1, "dept_name": "Engineering"},
            {"id": 2, "dept_name": "Sales"},
            {"id": 3, "dept_name": "Marketing"},
            {"id": 4, "dept_name": "HR"}
        ]
        data["departments"] = pd.DataFrame(depts)
        
    if "signups" in table_names:
        signups = []
        for uid in user_ids:
            signups.append({
                "user_id": uid,
                "signup_date": random.choice(dates),
                "platform": random.choice(["ios", "android", "web"])
            })
        data["signups"] = pd.DataFrame(signups)
        
    if "transactions" in table_names:
        transactions = []
        for _ in range(200):
            transactions.append({
                "id": random.randint(1000, 9999),
                "user_id": random.choice(user_ids),
                "amount": round(random.uniform(10.0, 500.0), 2),
                "date": random.choice(dates)
            })
        data["transactions"] = pd.DataFrame(transactions)
    
    if "users" in table_names:
        users = []
        names = ["Alice", "Bob", "Charlie", "David", "Eve"]
        for i in range(1, 11):
            users.append({
                "id": i,
                "name": random.choice(names),
                "email": f"user{i}@example.com"
            })
        data["users"] = pd.DataFrame(users)
        
    if "purchases" in table_names:
        purchases = []
        for _ in range(50):
            purchases.append({
                "id": random.randint(1, 100),
                "user_id": random.randint(1, 8), # Leaving some users without purchases
                "item": "Product A"
            })
        data["purchases"] = pd.DataFrame(purchases)
        
    if "person" in table_names:
        persons = [
            {"id": 1, "email": "a@b.com"},
            {"id": 2, "email": "c@d.com"},
            {"id": 3, "email": "a@b.com"}
        ]
        data["person"] = pd.DataFrame(persons)

    if "orders" in table_names:
        orders = []
        for i in range(1, 21):
             orders.append({
                 "id": i,
                 "customer_id": random.randint(1, 5),
                 "amount": random.randint(10, 100)
             })
        data["orders"] = pd.DataFrame(orders)
    
    if "customers" in table_names:
        customers = []
        names = ["Alice", "Bob", "Charlie", "David", "Eve"]
        for i in range(1, 6):
            customers.append({
                "id": i,
                "name": names[i-1]
            })
        data["customers"] = pd.DataFrame(customers)
        
    if "projects" in table_names:
        projects = [{"id": 1, "name": "Project Alpha"}, {"id": 2, "name": "Project Beta"}]
        data["projects"] = pd.DataFrame(projects)
        
    if "project_employees" in table_names:
        pe = [{"project_id": 1, "employee_id": 1}, {"project_id": 1, "employee_id": 2}]
        data["project_employees"] = pd.DataFrame(pe)
        
    if "world" in table_names:
        world = [
            {"name": "Afghanistan", "continent": "Asia", "area": 652230, "population": 25500100, "gdp": 20343000000},
            {"name": "Albania", "continent": "Europe", "area": 28748, "population": 2831741, "gdp": 12960000000},
            {"name": "Algeria", "continent": "Africa", "area": 2381741, "population": 37100000, "gdp": 188681000000},
            {"name": "Andorra", "continent": "Europe", "area": 468, "population": 78115, "gdp": 3712000000},
            {"name": "Angola", "continent": "Africa", "area": 1246700, "population": 20609294, "gdp": 100990000000},
             {"name": "India", "continent": "Asia", "area": 3287000, "population": 1380000000, "gdp": 2800000000000}
        ]
        data["world"] = pd.DataFrame(world)
        
    # --- NEW TABLES FOR HARD QUESTIONS ---
    if "google_gmail_emails" in table_names:
        emails = []
        users = [f"user{i}" for i in range(1, 11)]
        for _ in range(100):
            emails.append({
                "id": random.randint(1, 1000),
                "from_user": random.choice(users),
                "to_user": random.choice(users),
                "day": random.randint(1, 30)
            })
        data["google_gmail_emails"] = pd.DataFrame(emails)
        
    if "fb_users" in table_names:
        fb_users = []
        for i in range(1, 51):
            # Random join dates between 2017 and 2021
            year = random.choice([2017, 2018, 2019, 2020, 2021])
            month = random.randint(1, 12)
            day = random.randint(1, 28)
            fb_users.append({
                "id": i,
                "joined_at": datetime(year, month, day),
                "country": random.choice(["USA", "UK", "India", "Canada"])
            })
        data["fb_users"] = pd.DataFrame(fb_users)

    if "fb_comments" in table_names:
        comments = []
        for i in range(1, 201):
            year = random.choice([2019, 2020])
            month = random.randint(1, 3) # Focus on Q1 2020 for the question
            day = random.randint(1, 28)
            comments.append({
                "user_id": random.randint(1, 50), # Must match fb_users ids
                "body": "Great post!",
                "created_at": datetime(year, month, day)
            })
        data["fb_comments"] = pd.DataFrame(comments)
        
    if "marketing_campaigns" in table_names:
        campaigns = [
            {"id": 1, "name": "Black Friday", "start_date": "2023-11-20", "end_date": "2023-11-30", "cost": 50000},
            {"id": 2, "name": "New Year", "start_date": "2023-12-25", "end_date": "2024-01-05", "cost": 30000},
            {"id": 3, "name": "Summer Sale", "start_date": "2023-06-01", "end_date": "2023-06-15", "cost": 20000}
        ]
        data["marketing_campaigns"] = pd.DataFrame(campaigns)
        
    if "campaign_revenue" in table_names:
        rev = [
            {"campaign_id": 1, "revenue": 150000},
            {"campaign_id": 1, "revenue": 120000},
            {"campaign_id": 2, "revenue": 40000},
            {"campaign_id": 3, "revenue": 60000}
        ]
        data["campaign_revenue"] = pd.DataFrame(rev)
        
    if "subscription_history" in table_names:
         subs = []
         for i in range(1, 20):
             subs.append({
                 "user_id": random.randint(100, 110),
                 "purchase_date": "2024-01-15",
                 "status": random.choice(["active", "cancelled", "expired"])
             })
         data["subscription_history"] = pd.DataFrame(subs)

    if "sf_transactions" in table_names:
        # Amazon: Monthly Percentage Difference
        trans = []
        for i in range(100):
            # dates spanning 2019-01-01 to 2019-04-01 to show month diffs
            m = random.randint(1, 4)
            d = random.randint(1, 28)
            trans.append({
                "id": i,
                "created_at": datetime(2019, m, d).strftime("%Y-%m-%d"),
                "value": random.randint(1000, 5000),
                "purchase_id": random.randint(1, 50)
            })
        data["sf_transactions"] = pd.DataFrame(trans)

    if "facebook_friends" in table_names:
        # Meta: Popularity Percentage
        friends = []
        for i in range(100):
            u1 = random.randint(1, 20)
            u2 = random.randint(1, 20)
            if u1 != u2:
                friends.append({"user1": u1, "user2": u2})
        data["facebook_friends"] = pd.DataFrame(friends).drop_duplicates()

    if "ms_user_dimension" in table_names or "ms_download_facts" in table_names:
        # Microsoft: Premium vs Freemium
        users = [{"user_id": i, "acc_id": random.randint(1, 50)} for i in range(1, 101)]
        accounts = [{"acc_id": i, "paying_customer": random.choice(["yes", "no"])} for i in range(1, 51)]
        downloads = []
        for _ in range(200):
            downloads.append({
                "date": "2020-08-20", 
                "user_id": random.randint(1, 100),
                "downloads": random.randint(1, 10)
            })
        
        if "ms_user_dimension" in table_names:
            data["ms_user_dimension"] = pd.DataFrame(users)
        if "ms_acc_dimension" in table_names:
            data["ms_acc_dimension"] = pd.DataFrame(accounts)
        if "ms_download_facts" in table_names:
            data["ms_download_facts"] = pd.DataFrame(downloads)

    if "airbnb_hosts" in table_names:
        # Airbnb: Growth of Airbnb
        hosts = []
        for i in range(100):
            year = random.choice(range(2015, 2022))
            month = random.randint(1, 12)
            day = random.randint(1, 28)
            hosts.append({
                "host_id": i,
                "nationality": "USA",
                "gender": random.choice(["M", "F"]),
                "age": random.randint(25, 50),
                "joined_date": datetime(year, month, day) 
            })
        data["airbnb_hosts"] = pd.DataFrame(hosts)

    if "uber_request_data" in table_names:
        # Uber: Naive Forecasting
        requests = []
        for i in range(200):
             # Dates needed for monthly aggregation
             m = random.randint(1, 6) 
             requests.append({
                 "request_date": datetime(2020, m, random.randint(1, 28)).strftime("%Y-%m-%d"),
                 "distance_to_travel": round(random.uniform(2.0, 20.0), 2),
                 "monetary_cost": round(random.uniform(5.0, 50.0), 2)
             })
        data["uber_request_data"] = pd.DataFrame(requests)

    return data
