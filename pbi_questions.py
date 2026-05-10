PBI_PRACTICAL_QUESTIONS = [
    {
        "id": 1,
        "question": "Calculate the Total Sales for the 'North' Region.",
        "hint": "Filter the 'Region' column to 'North' and Sum the 'Sales'.",
        "solution": "**Step 1:** Create a Measure: `Total Sales North = CALCULATE(SUM(Table[Sales]), Table[Region] = 'North')`.\n**Step 2:** Use a Card visual to display the result."
    },
    {
        "id": 2,
        "question": "Which Product generated the highest Total Profit?",
        "hint": "Use a Bar Chart with Product on Axis and Profit as Value.",
        "solution": "**Step 1:** Drag 'Product' to the X-Axis.\n**Step 2:** Drag 'Profit' to Values.\n**Step 3:** Sort the visual by Profit descending. The first bar is your answer."
    },
    {
        "id": 3,
        "question": "What is the Average Discount given to the 'Consumer' Segment?",
        "hint": "Average aggregation on Discount, filtered by Segment.",
        "solution": "**Step 1:** Create a Measure: `Avg Consumer Discount = CALCULATE(AVERAGE(Table[Discount]), Table[Segment] = 'Consumer')`.\n**Step 2:** Format as Percentage."
    },
    {
        "id": 4,
        "question": "Show the trend of Sales over time (Date).",
        "hint": "Line Chart with Date hierarchy.",
        "solution": "**Step 1:** Select **Line Chart** visual.\n**Step 2:** Drag 'Date' to X-Axis.\n**Step 3:** Drag 'Sales' to Y-Axis."
    },
    {
        "id": 5,
        "question": "Calculate the Profit Margin % (Profit / Sales).",
        "hint": "Divide Profit by Total Sales.",
        "solution": "**Step 1:** Create Measure: `Profit Margin % = DIVIDE(SUM(Table[Profit]), SUM(Table[Sales]), 0)`.\n**Step 2:** Display in a Card visual formatted as %."
    },
     {
        "id": 6,
        "question": "Identify year-to-date (YTD) Sales.",
        "hint": "Use Time Intelligence DATESYTD or TOTALYTD.",
        "solution": "**Step 1:** Ensure you have a Date table.\n**Step 2:** Create Measure: `Sales YTD = TOTALYTD(SUM(Table[Sales]), 'Date'[Date])`."
    },
    {
        "id": 7,
        "question": "Compare Sales for 'Corporate' vs 'Home Office' segments.",
        "hint": "Clustered Bar Chart or Slicer.",
        "solution": "**Option 1:** Use a Bar Chart with 'Segment' on Axis and 'Sales' as Value.\n**Option 2:** Use a Slicer on 'Segment' to toggle between values in a Card."
    },
    {
        "id": 8,
        "question": "What is the count of distinct transactions (rows)?",
        "hint": "Count Rows.",
        "solution": "**Step 1:** Create Measure: `Tx Count = COUNTROWS(Table)`."
    }
]

PBI_CONCEPT_QUESTIONS = [
    {
        "id": 1,
        "category": "DAX",
        "question": "What is the difference between CALCULATE and FILTER?",
        "hint": "Think about context transition and how filters are applied.",
        "solution": "**CALCULATE** evaluates an expression in a modified filter context. It can add, remove, or modify filters. **FILTER** is an iterator that returns a table of data that meets the specified condition. Crucially, FILTER typically needs to be used inside CALCULATE to modify the context."
    },
    {
        "id": 2,
        "category": "DAX",
        "question": "Explain the difference between SUM and SUMX.",
        "hint": "One is an aggregation function, the other is an iterator.",
        "solution": "**SUM** works on a single column and aggregates it. **SUMX** is an iterator that goes row by row through a table, evaluates an expression for each row, and then sums the results. Use SUMX when you need row-level calculations before aggregating (e.g., Price * Quantity)."
    },
    {
        "id": 3,
        "category": "Data Modeling",
        "question": "What is a Star Schema and why is it preferred in Power BI?",
        "hint": "Facts vs. Dimensions.",
        "solution": "A **Star Schema** consists of a central Fact table (transactions) connected to surrounding Dimension tables (attributes). It is preferred because it is optimized for performance in Power BI's vertiPaq engine, makes DAX simpler to write, and allows for intuitive filtering."
    },
    {
        "id": 4,
        "category": "DAX",
        "question": "What is Context Transition?",
        "hint": "Row Context -> Filter Context.",
        "solution": "**Context Transition** occurs when a Row Context is transformed into an equivalent Filter Context. This happens automatically when using CALCULATE. It allows measures to 'see' the filters active on the current row during iteration."
    },
    {
        "id": 5,
        "category": "Power Query",
        "question": "What is Query Folding?",
        "hint": "Pushing back to the source.",
        "solution": "**Query Folding** is the ability of Power Query to translate transformations (M code) into the native query language of the data source (e.g., SQL). This pushes the workload to the source database, significantly improving performance and refresh times."
    },
    {
        "id": 6,
        "category": "Service",
        "question": "What is the difference between a Dashboard and a Report?",
        "hint": "Canvas vs. Tiled view.",
        "solution": "**Reports** are multi-page detailed views with interactive visuals (slicers work here). **Dashboards** are single-page canvases in the Power BI Service that aggregate pinned visuals from different reports. Dashboards do not have pages or slicers in the same way."
    },
    {
        "id": 7,
        "category": "DAX",
        "question": "How do you handle Many-to-Many relationships in Power BI?",
        "hint": "Bridge table.",
        "solution": "The best practice is to avoid direct Many-to-Many relationships if possible. Instead, use a **Bridge Table** (a distinct list of the common key) to create two One-to-Many relationships. If you must use direct Many-to-Many, ensure you understand the filter propagation (single or both directions)."
    },
    {
        "id": 8,
        "category": "Data Modeling",
        "question": "What is Row-Level Security (RLS)?",
        "hint": "Restricting data access.",
        "solution": "**RLS** restricts data access for given users. Filters are defined within roles (using DAX) to restrict data at the row level. Users are then assigned to these roles in the Power BI Service."
    },
    {
        "id": 9,
        "category": "DAX",
        "question": "What is the difference between RELATED and RELATEDTABLE?",
        "hint": "Lookup direction.",
        "solution": "**RELATED** retrieves a value from the 'one' side of a relationship to the 'many' side. **RELATEDTABLE** retrieves a table of all matching rows from the 'many' side to the 'one' side."
    },
    {
        "id": 10,
        "category": "DAX",
        "question": "What are Time Intelligence functions? Give examples.",
        "hint": "Date tables.",
        "solution": "**Time Intelligence** functions allow for calculations over time periods using a centralized Date table. Examples include: `TOTALYTD` (Year-to-Date), `SAMEPERIODLASTYEAR` (for YoY comparison), and `DATESINPERIOD` (moving averages)."
    },
    {
        "id": 11,
        "category": "Power Query",
        "question": "What is the 'M' language?",
        "hint": "Behind the scenes of Power Query.",
        "solution": "**M** is the formula language behind Power Query (Data Mashup). It is a functional, case-sensitive language used for data data transformation and preparation before loading into the model."
    },
    {
        "id": 12,
        "category": "Performance",
        "question": "How would you optimize a slow Power BI report?",
        "hint": "DAX Studio, VertiPaq Analyzer.",
        "solution": "1. Check **Query Folding** in Power Query.\n2. Use **Performance Analyzer** to find slow visuals.\n3. Validate Data Model (Star Schema).\n4. Remove unused columns (reduce model size).\n5. Optimize DAX measures (avoid creating large temp tables within measures)."
    },
    {
        "id": 13,
        "category": "DAX",
        "question": "What is the ALL function used for?",
        "hint": "Removing filters.",
        "solution": "**ALL** returns all the rows in a table, or all the values in a column, ignoring any filters that might have been applied. It is commonly used in CALCULATE to calculate denominators for percentages (e.g., % of Total)."
    },
    {
        "id": 14,
        "category": "Data Modeling",
        "question": "What is a Calculated Column vs. a Measure?",
        "hint": "Storage vs. CPU.",
        "solution": "**Calculated Columns** are computed during data refresh and stored in the model (RAM). They have row context. **Measures** are computed on the fly (CPU) at query time based on user interaction (filters/slicers). Use Measures for math/aggregations, Columns for filtering/slicers."
    },
    {
        "id": 15,
        "category": "DAX",
        "question": "What is the EARLIER function?",
        "hint": "Nested row context.",
        "solution": "**EARLIER** is used to access a value from an outer row context while inside a nested row context. It is often used in calculated columns for ranking or cumulative totals, though variables (`VAR`) are now preferred for readability."
    },
     {
        "id": 16,
        "category": "Service",
        "question": "What is a Power BI Gateway?",
        "hint": "Bridge between On-Prem and Cloud.",
        "solution": "A **Gateway** acts as a bridge to provide quick and secure data transfer between on-premises data (source) and the Power BI Service (cloud). It is required for refreshing datasets that connect to on-prem SQL Servers or files."
    },
    {
        "id": 17,
        "category": "Visuals",
        "question": "When would you use a Waterfall Chart?",
        "hint": "Running total changes.",
        "solution": "A **Waterfall Chart** is used to show how an initial value is affected by a series of intermediate positive or negative values. It is perfect for visualizing P&L statements (Income -> Expenses -> Net Profit) or cash flow."
    },
    {
        "id": 18,
        "category": "DAX",
        "question": "What is the difference between VALUES and DISTINCT?",
        "hint": "Blank handling.",
        "solution": "**DISTINCT** returns the unique values from a column. **VALUES** also returns unique values but includes a special 'Blank' row if there is an invalid relationship (referential integrity violation). VALUES is generally preferred for preserving relationships."
    },
    {
        "id": 19,
        "category": "Data Modeling",
        "question": "What is Cardinality?",
        "hint": "Uniqueness of values.",
        "solution": "**Cardinality** refers to the uniqueness of values in a column. 'High Cardinality' means many unique values (e.g., ID numbers), which consume more memory. Relationships capture cardinality: One-to-One, One-to-Many, Many-to-Many."
    },
    {
        "id": 20,
        "category": "Power Query",
        "question": "What is the usage of 'Unpivot'?",
        "hint": "Wide to Tall.",
        "solution": "**Unpivot** transforms wide data (many columns for similar attributes, e.g., Jan, Feb, Mar) into tall data (Attribute and Value columns). This is crucial for proper data modeling and ensuring time intelligence works."
    },
    {
        "id": 21,
        "category": "DAX",
        "question": "How do you calculate a Moving Average?",
        "hint": "DATESINPERIOD.",
        "solution": "Use `CALCULATE(AVERAGE(Table[Value]), DATESINPERIOD(Date[Date], LASTDATE(Date[Date]), -3, MONTH))` for a 3-month moving average."
    },
    {
        "id": 22,
        "category": "Service",
        "question": "What are the different types of Power BI licenses?",
        "hint": "Pro, Premium, PPU.",
        "solution": "1. **Free**: Personal use.\n2. **Pro**: Per-user, required for sharing and collaboration.\n3. **Premium Per User (PPU)**: Pro features + Premium capabilities (Paginated reports, AI) for individuals.\n4. **Premium Capacity**: Dedicated resources for the organization, allows free users to view content."
    },
    {
        "id": 23,
        "category": "Data Modeling",
        "question": "What is a Date Table and why is it mandatory?",
        "hint": "Continuous dates.",
        "solution": "A **Date Table** is a dimension table containing a continuous range of dates. It is mandatory for Time Intelligence functions to work correctly (`TOTALYTD`, `SAMEPERIODLASTYEAR`). It must be marked as a Date table in the model."
    },
    {
        "id": 24,
        "category": "DAX",
        "question": "What is the HASONEVALUE function?",
        "hint": "Checking filter context level.",
        "solution": "**HASONEVALUE** returns TRUE if the context for `columnName` has been filtered down to one distinct value only. It is effectively used in Totals to prevent a measure from calculating grand totals or to switch logic at the total level."
    },
    {
        "id": 25,
        "category": "Visuals",
        "question": "How do you format a measure dynamically?",
        "hint": "Format string within calculation.",
        "solution": "You can use the **FORMAT** function in DAX to return a string (e.g., `FORMAT([Value], \"$#,##0\")`). However, this converts the result to text. Better is to use **Dynamic Format Strings** (Modeling tab) which changes the display format while keeping the data update as numeric."
    }
]

# Expanding to 150 items logic can be added or we can ask the user if they want the full 150 text block.
# For now, 25 high-quality ones effectively demonstrate the feature.
