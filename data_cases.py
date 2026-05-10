DATA_CASES = [
    {
        "id": 1,
        "title": "Starbucks in Italy: Market Entry",
        "scenario": "**Starbucks** is considering entering Italy, the spiritual home of coffee. Howard Schultz believes it's the ultimate validation. However, the board is skeptical. The Italian coffee culture is deeply entrenched (1 Euro espresso at the bar, no takeaways). \n\n**Your Task**: Evaluate the strategic viability. Should Starbucks enter? If so, what is the GTM strategy to avoid failure?",
        "data_context": """
**Financial & Market Data:**

| Metric | Starbucks (US) | Independent Cafe (Italy) |
|---|---|---|
| Avg. Ticket | $7.50 | €1.10 |
| Time in Store | 45 mins (Work/Study) | 3 mins (Drink & Go) |
| Profit Margin | 18% | 8% |
| Brand Perception| Premium Experience | Commodity / Daily Ritual |

**Market Saturation:**
- Milan: 1 bar per 150 residents.
- Real Estate: Prime locations are 300% more expensive than US avg.
""",
        "clarifying_questions": [
            "Are we targeting locals or tourists/expats?",
            "Will we adapt the menu (e.g., alcohol, food) or keep the US standard?",
            "What is the projected CAC (Customer Acquisition Cost) vs LTV?",
            "Who are the key local competitors beyond independent bars (e.g., Illy, Lavazza)?"
        ],
        "framework": "**1. CAGE Framework**: Cultural, Administrative, Geographic, Economic distance.\n**2. Porter's 5 Forces**: Supplier power (high - real estate), Buyer power (high - alternatives), Rivals (intense).\n**3. Segmentation**: Focus on the 'Third Place' experience for Millennials/GenZ vs Traditionalists.\n**4. Entry Mode**: Flagship Reserve Roastery (Brand building) vs Mass Retail.",
        "solution": """**Strategic Recommendation: ENTER with a PREMIUM EXPERIENCE Strategy**

### 1. SWOT Analysis
| | Positive | Negative |
|---|---|---|
| **Internal** | **Strengths**: Global Brand, financial capital, "Third Place" concept excellence. | **Weaknesses**: High price point ($5 vs €1), no local credibility, corporate feel. |
| **External** | **Opportunities**: Tourism, Younger gen wants WiFi/workplaces, Food attachment (Princi). | **Threats**: Cultural backlash, "Americanization" protests, aggressive local regulation. |

### 2. Porter's 5 Forces Analysis
*   **Rivalry (High)**: 150,000+ bars in Italy. Fierce loyalty to local baristas.
*   **Buyer Power (High)**: Switching cost is zero. Alternatives are cheaper.
*   **Supplier Power (High)**: Prime real estate in Milan/Rome is scarce and expensive.
*   **Substitutes (Medium)**: Home Nespresso machines, vending machines.

### 3. Execution Plan
*   **Phase 1 (Validation)**: Launch only one **Reserve Roastery** in Milan. Make it a tribute to Italian coffee culture (Opulence over Scale).
*   **Phase 2 (Experience)**: Do not compete on speed. Compete on **Space**. Italians drink standing up; we sell comfortable seating and WiFi.
*   **Phase 3 (Partnership)**: Acquire/Partner with **Princi** for food. Italians won't eat frozen US pastries.
"""
    },
    {
        "id": 2,
        "title": "Microsoft's Cloud Pivot (2014)",
        "scenario": "**Context:** It's 2014. Satya Nadella has just become CEO. Microsoft stock is flat ($30-40) for a decade. Windows is the cash cow, but PC sales are declining. AWS is winning the cloud.\n\n**The Dilemma**: Satya wants to pivot to 'Mobile First, Cloud First'. This means de-prioritizing Windows contribution margin to fund Azure. Shareholders are revolting. Defend the pivot.",
        "data_context": """
**Segment Performance (2013-2014 Estimate):**

| Segment | Revenue ($B) | Growth YoY | Margin % |
|---|---|---|---|
| Windows/Office | $45B | -2% | 65% |
| Server/Tools | $20B | +5% | 40% |
| Azure (Cloud) | $0.5B | +150% | -10% (Investment) |

**Market Trends:**
- Smartphone OS Share: Android (80%), iOS (15%), Windows Phone (<3%).
- Cloud Market Share: AWS (85%), Azure (5%).
""",
        "clarifying_questions": [
            "What is the projected TAM for Cloud vs PC OS in 2020?",
            "How much cannibalization of Windows Server do we expect if we push Azure?",
            "What is the developer sentiment index?",
            "Can we bundle Azure with existing Enterprise Agreements?"
        ],
        "framework": "**1. 3 Horizons Model**: Manage core (Windows), Nurture emerging (Azure).\n**2. Innovator's Dilemma**: Disrupt yourself before AWS does.\n**3. Ecosystem Economics**: LTV of a Cloud customer (recurring) vs one-time License.\n**4. Cultural Transformation**: Shift from 'Know-it-all' to 'Learn-it-all'.",
        "solution": """**Strategic Rationale: CANNIBALIZE WINDOWS TO SAVE THE COMPANY**

### 1. 3 Horizons Analysis
| Horizon | Focus | Strategy |
|---|---|---|
| **H1 (Today)** | Windows & Office | **Cash Cow**: Milk revenues to fund H2/H3. Accept flat growth. |
| **H2 (Tomorrow)** | Azure Infrastructure | **Growth Engine**: Aggressive CAPEX. Compete vs AWS. |
| **H3 (Future)** | AI & SaaS | **Moonshots**: Office 365 migration, Hololens, AI. |

### 2. The Economics of the Pivot
*   **The Trap**: Windows has 65% margin but shrinking TAM. Azure has -10% margin but infinite TAM.
*   **The Bridge**: Move customers from **CAPEX (One-time License)** to **OPEX (Monthly Subscription)**.
*   **LTV Shift**: An Azure customer pays recurring revenue forever. Stickiness is higher than OS licensing.

### 3. Execution Tactics
*   **Love Linux**: Allow Linux on Azure. Acknowledge developers prefer it. This kills the "Microsoft vs Open Source" war.
*   **Bundle Power**: Use the Enterprise Agreement (EA) dominance to force CIOs to try Azure (free credits).
"""
    },
    {
        "id": 3,
        "title": "Uber's 2017 Crisis: Turnaround",
        "scenario": "**Context:** 2017. #DeleteUber is trending. Susan Fowler's blog post exposed a toxic culture. Waymo is suing for IP theft. Kalanick is forced out. Driver churn is at an all-time high.\n\n**Your Role**: You are the new COO. The board gives you 90 days to stabilize the ship. What are your top 3 priorities to save the company?",
        "data_context": """
**Q2 2017 Dashboard:**

| Metric | Value | YoY Change |
|---|---|---|
| Monthly Active Riders | 65M | +10% (Slowing) |
| Driver Retention (90-day) | 25% | -15% |
| Net Loss | $(650M) | +20% (Worsening) |
| Brand Sentiment Score | -45 | All-time Low |
""",
        "clarifying_questions": [
            "Is the driver churn due to earnings or reputation?",
            "How much cash runway do we have?",
            "Which markets are bleeding the most cash?",
            "Is Lyft gaining significant market share during this crisis?"
        ],
        "framework": "**1. Stakeholder Analysis**: Investors (Panic), Drivers (Angry), Riders (Boycotting), Employees (Morale).\n**2. Root Cause**: Cultural toxicity -> Brain drain + bad PR -> Churn.\n**3. Unit Economics**: CAC is skyrocketing due to bad brand. LTV is dropping.\n**4. Crisis Management**: Acknowledge -> Apologize -> Act.",
        "solution": """**Turnaround Plan: "180 DAYS OF CHANGE"**

### 1. Stakeholder Diagnosis (Power vs Interest)
| Stakeholder | Sentiment | Priority | Action |
|---|---|---|---|
| **Drivers** | 😡 Hostile | **#1 CRITICAL** | Supply side is breaking. Implement Tipping immediately. |
| **Investors** | 😰 Panicked | **#2 High** | Show path to IPO. Cut bleeding markets (Russia, SE Asia). |
| **Riders** | 😒 Disloyal | **#3 Medium** | Brand repair campaign. But they will return if price/service is good. |

### 2. Strategic Pillars
*   **Fix the Culture**: Settle Waymo lawsuit ($245M equity). It's cheaper than the reputation damage. Fire toxic leaders publicly.
*   **Supply Stabilization**: If drivers leave, wait times go up -> Riders leave -> Death Spiral.
    *   *Tactic*: "In-app Tipping" (long resisted by Kalanick).
    *   *Tactic*: 24/7 Phone Support for drivers.
*   **Financial Discipline**: Sell Uber China/SE Asia operations for equity stakes in competitors (Didi/Grab). Stop fighting multi-front wars.
"""
    },
    {
        "id": 4,
        "title": "Disney Acquires Fox ($71B)",
        "scenario": "**Context:** 2019. Netflix is spending $15B/year on content. Cord-cutting is accelerating, killing ESPN's cash cow. Disney plans to launch Disney+.\n\n**The Deal**: Bob Iger proposes buying 21st Century Fox for $71.3B. It’s a massive premium.\n**Your Task**: Due Diligence. Is this deal worth the debt load, or is it an ego play?",
        "data_context": """
**Deal Financials:**

| Item | Value | Note |
|---|---|---|
| Purchase Price | $71.3B | Cash & Stock |
| Disney Debt post-deal | ~$50B | Leverage ratio spikes |
| Synergy Target | $2B | Cost savings |
| Acquired IP | Avatar, X-Men, Simpsons, NatGeo | Critical for Streaming |

**Streaming Wars Context:**
- Netflix Subs: 160M
- Disney+ Target (Year 1): 10-15M
""",
        "clarifying_questions": [
            "What is the integration cost/timeline?",
            "How much overlap is there in the workforce (layoff risk)?",
            "Will regulators (DOJ) block the sports consolidation?",
            "Can we pull Fox content from other platforms immediately?"
        ],
        "framework": "**1. M&A Valuation**: DCF Analysis vs Strategic Premium.\n**2. Flywheel Effect**: How Fox IP feeds Parks/Merch/Streaming.\n**3. Competitive Moat**: Content library size as the primary barrier to entry against Netflix/Amazon.\n**4. Synergies**: Cost (Headcount) vs Revenue (Cross-sell).",
        "solution": """**Recommendation: BUY - The Only Path to Survival**

### 1. Synergy Analysis
| Type | Value | Examples |
|---|---|---|
| **Cost Synergies** | ~$2B/yr | Consolidating Back-office, Legal, HR, Global Distribution. |
| **Revenue Synergies** | **priceless** | Making Disney+ a viable Netflix competitor. |
| **Control Premium** | High | Controlling Hulu (Fox had 30%) is essential for bundled offering. |

### 2. Strategic Logic: The Content Moat
*   **Problem**: Disney has Kids/Family (Pixar/Marvel) but lacks General Entertainment for adults to reduce churn.
*   **Solution**: Fox brings *The Simpsons*, *Family Guy*, *Avatar*, and *Searchlight Pictures*.
*   **The Bundle**: Disney+ (Family) + Hulu (Adults) + ESPN+ (Sports). This "Bundle" makes it impossible for households to cancel.

### 3. Risk Mitigation
*   **Debt Load**: Significant, but interest rates are historically low (in 2019). The cash flow from Parks can service the debt while Streaming scales.
*   **Culture Clash**: Fox is scrappy/edgy; Disney is structured/clean. Keep creative units separate but merge distribution.
"""
    }
]
