#!/bin/bash

# ==============================================================================
#  REALISTIC DATA SEEDER - Employee Task Tracker
# ==============================================================================
#  Simulates a realistic Tech Team environment:
#  - 4 Departments (Engineering, Design, Product, QA)
#  - 3 Major Projects with dependent tasks
#  - Real-world deadlines and priorities
# ==============================================================================

API_URL="http://localhost:5000/api"
CONTENT_TYPE="Content-Type: application/json"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Check for jq
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: 'jq' is not installed.${NC} Please install it to run this script."
    exit 1
fi

echo -e "${BLUE}Starting Realistic Database Population...${NC}\n"

# ==============================================================================
#  HELPER FUNCTIONS
# ==============================================================================

# Global arrays to store IDs by department for smart assignment
declare -a backend_ids
declare -a frontend_ids
declare -a design_ids
declare -a qa_ids
declare -a pm_ids

create_employee() {
    local name="$1"
    local role="$2"
    local dept_array_name="$3" # Name of the array to store the ID in

    # Generate realistic corporate email
    local clean_name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '.')
    local email="${clean_name}@techcorp.in"

    response=$(curl -s -X POST "$API_URL/employees" \
        -H "$CONTENT_TYPE" \
        -d "{ \"name\": \"$name\", \"email\": \"$email\", \"role\": \"$role\" }")

    success=$(echo "$response" | jq -r '.success')
    id=$(echo "$response" | jq -r '.data._id')

    if [ "$success" == "true" ]; then
        echo -e "  ${GREEN}✔ Hired:${NC} $name - $role"
        # Add to specific department array
        eval "$dept_array_name+=(\"$id\")"
    else
        echo -e "  ${RED}✘ Failed:${NC} $name - $(echo "$response" | jq -r '.message')"
    fi
}

create_task() {
    local title="$1"
    local priority="$2" # low, medium, high
    local status="$3"   # todo, in_progress, completed
    local days_offset="$4"
    local assignee_id="$5"
    local description="$6"

    # Calculate date
    if [[ "$OSTYPE" == "darwin"* ]]; then
        due_date=$(date -v${days_offset}d +%Y-%m-%d)
    else
        due_date=$(date -d "${days_offset} days" +%Y-%m-%d)
    fi

    # Handle null assignee
    if [ -z "$assignee_id" ]; then
        assignee_json="null"
    else
        assignee_json="\"$assignee_id\""
    fi

    response=$(curl -s -X POST "$API_URL/tasks" \
        -H "$CONTENT_TYPE" \
        -d "{
            \"title\": \"$title\",
            \"priority\": \"$priority\",
            \"status\": \"$status\",
            \"dueDate\": \"$due_date\",
            \"assignedTo\": $assignee_json,
            \"description\": \"$description\"
        }")

    success=$(echo "$response" | jq -r '.success')
    
    if [ "$success" == "true" ]; then
        echo -e "    ${GREEN}✔ Task:${NC} $title [${status}]"
    else
        echo -e "    ${RED}✘ Error:${NC} $title - $(echo "$response" | jq -r '.message')"
    fi
}

# ==============================================================================
#  1. HIRING PHASE (Create 20 Employees)
# ==============================================================================
echo -e "${YELLOW}--- Phase 1: Hiring Employees & Forming Teams ---${NC}"

echo -e "\n${CYAN}[Backend Engineering Team]${NC}"
create_employee "Arjun Mehta" "Lead Backend Engineer" "backend_ids"
create_employee "Rahul Kapoor" "Senior Backend Dev" "backend_ids"
create_employee "Vihaan Reddy" "Database Administrator" "backend_ids"
create_employee "Siddharth Joshi" "Backend Developer" "backend_ids"
create_employee "Imran Khan" "DevOps Engineer" "backend_ids"

echo -e "\n${CYAN}[Frontend Engineering Team]${NC}"
create_employee "Priya Sharma" "Lead Frontend Engineer" "frontend_ids"
create_employee "Aisha Patel" "UI Developer" "frontend_ids"
create_employee "Neha Gupta" "React Developer" "frontend_ids"
create_employee "Rohan Malhotra" "Frontend Developer" "frontend_ids"
create_employee "Vikram Singh" "Frontend Intern" "frontend_ids"

echo -e "\n${CYAN}[Product & Design Team]${NC}"
create_employee "Aditi Rao" "Product Manager" "pm_ids"
create_employee "Sanjay Verma" "Senior Product Designer" "design_ids"
create_employee "Kavita Krishnan" "UI/UX Designer" "design_ids"
create_employee "Meera Nair" "Graphic Designer" "design_ids"

echo -e "\n${CYAN}[QA & Testing Team]${NC}"
create_employee "Manoj Das" "QA Lead" "qa_ids"
create_employee "Deepak Chopra" "Automation Engineer" "qa_ids"
create_employee "Saniya Mirza" "Manual Tester" "qa_ids"
create_employee "Rajiv Menon" "Performance Tester" "qa_ids"
create_employee "Pooja Hegde" "QA Intern" "qa_ids"
create_employee "Karan Johar" "QA Analyst" "qa_ids" # 20th employee

# ==============================================================================
#  2. PROJECT EXECUTION PHASE (Create 56+ Tasks)
# ==============================================================================
echo -e "\n${YELLOW}--- Phase 2: Project Kickoff & Task Assignment ---${NC}"

# --- Helper to get random ID from a specific group ---
get_random_id() {
    local array_name=$1
    local array_length=$(eval echo "\${#${array_name}[@]}")
    local random_index=$((RANDOM % array_length))
    eval echo "\${${array_name}[$random_index]}"
}

# --- PROJECT A: "Q4 Financial Dashboard" (High Priority, nearing deadline) ---
echo -e "\n${CYAN}Project A: Q4 Financial Dashboard (Backend Heavy)${NC}"

# Backend Tasks
create_task "Setup MongoDB Atlas Cluster" "high" "completed" "-10" "$(get_random_id backend_ids)" "Initial DB setup with sharding configuration."
create_task "Design User Schema" "high" "completed" "-8" "$(get_random_id backend_ids)" "Define Mongoose schemas for users and roles."
create_task "Implement JWT Authentication" "high" "completed" "-5" "$(get_random_id backend_ids)" "Secure API endpoints with JWT middleware."
create_task "Create Transaction API" "high" "in_progress" "+2" "$(get_random_id backend_ids)" "Endpoints for debit/credit transactions."
create_task "Optimize Aggregation Pipelines" "medium" "in_progress" "+3" "$(get_random_id backend_ids)" "Speed up the reporting queries."
create_task "Redis Caching Layer" "medium" "todo" "+5" "$(get_random_id backend_ids)" "Implement caching for frequent dashboard reads."
create_task "Fix Memory Leak in Report Gen" "high" "todo" "+1" "$(get_random_id backend_ids)" "Critical bug fix for node process crashing."

# Frontend Tasks
create_task "Setup React Router" "medium" "completed" "-5" "$(get_random_id frontend_ids)" "Define client-side routes."
create_task "Integrate Recharts Library" "medium" "in_progress" "+2" "$(get_random_id frontend_ids)" "Add pie charts and bar graphs for revenue."
create_task "Responsive Sidebar Navigation" "low" "todo" "+4" "$(get_random_id frontend_ids)" "Make dashboard mobile friendly."
create_task "Dark Mode Implementation" "low" "todo" "+10" "$(get_random_id frontend_ids)" "Add theme context switcher."

# QA/Design Tasks
create_task "Dashboard Wireframes" "high" "completed" "-15" "$(get_random_id design_ids)" "Figma prototypes approved by stakeholders."
create_task "Load Testing API" "high" "in_progress" "+1" "$(get_random_id qa_ids)" "Test with 10k concurrent users using JMeter."

# --- PROJECT B: "Mobile App Refactor" (Medium Priority) ---
echo -e "\n${CYAN}Project B: Mobile App Refactor (Design/Frontend Heavy)${NC}"

# Design Tasks
create_task "User Research Interviews" "medium" "completed" "-20" "$(get_random_id design_ids)" "Interview 10 users about navigation issues."
create_task "New Icon Set Design" "low" "completed" "-5" "$(get_random_id design_ids)" "Create SVG vectors for tab bar."
create_task "Accessibility Audit" "medium" "in_progress" "+1" "$(get_random_id design_ids)" "Check color contrast ratios."
create_task "Profile Screen Prototype" "medium" "todo" "+3" "$(get_random_id design_ids)" "Redesign the user profile settings."

# Frontend Tasks
create_task "Upgrade React Native Version" "high" "completed" "-2" "$(get_random_id frontend_ids)" "Update from 0.68 to 0.71."
create_task "Refactor Login Screen" "medium" "in_progress" "+4" "$(get_random_id frontend_ids)" "Convert class components to hooks."
create_task "Implement Push Notifications" "high" "todo" "+5" "$(get_random_id frontend_ids)" "Setup Firebase Cloud Messaging."
create_task "Fix Keyboard Avoiding View" "low" "todo" "+6" "$(get_random_id frontend_ids)" "UI glitch when typing in chat."

# Backend Support
create_task "API Versioning (v2)" "medium" "in_progress" "+7" "$(get_random_id backend_ids)" "Create new route namespace for mobile app."
create_task "Optimize Image Uploads" "low" "todo" "+8" "$(get_random_id backend_ids)" "Implement compression before S3 upload."

# --- PROJECT C: "Legacy System Maintenance" (Ongoing, Bug fixes) ---
echo -e "\n${CYAN}Project C: Legacy Maintenance & Ops (Mixed)${NC}"

# Generate 20 random maintenance tasks
declare -a bug_types=("Null Pointer Exception" "CSS Grid Breakage" "Timeout Error" "Data Sync Issue" "Typo in Footer")
declare -a components=("Checkout" "Landing Page" "Admin Panel" "Email Service" "Search Bar")

for i in {1..25}; do
    # Randomly pick components
    bug=${bug_types[$RANDOM % ${#bug_types[@]}]}
    comp=${components[$RANDOM % ${#components[@]}]}
    
    # Random assignment logic based on bug type
    if [[ "$bug" == *"CSS"* ]] || [[ "$bug" == *"Typo"* ]]; then
        assignee=$(get_random_id frontend_ids)
        role="Frontend"
    elif [[ "$bug" == *"Null"* ]] || [[ "$bug" == *"Timeout"* ]]; then
        assignee=$(get_random_id backend_ids)
        role="Backend"
    else
        assignee=$(get_random_id qa_ids)
        role="QA"
    fi

    # Random status/priority
    status_r=$((RANDOM % 3))
    if [ $status_r -eq 0 ]; then st="todo"; elif [ $status_r -eq 1 ]; then st="in_progress"; else st="completed"; fi
    
    prio_r=$((RANDOM % 3))
    if [ $prio_r -eq 0 ]; then pr="low"; elif [ $prio_r -eq 1 ]; then pr="medium"; else pr="high"; fi
    
    # Random Date (Past or Future)
    day_r=$(( (RANDOM % 20) - 10 ))

    create_task "Bug #50$i: $bug in $comp" "$pr" "$st" "$day_r" "$assignee" "Reported by user. Needs investigation by $role team."
done

# --- UNASSIGNED TASKS (Backlog) ---
echo -e "\n${CYAN}Project D: Product Backlog (Unassigned)${NC}"
create_task "Explore AI Integration" "low" "todo" "+30" "" "Research feasibility of AI chatbots."
create_task "Competitor Analysis 2024" "medium" "todo" "+15" "" "Review feature sets of top 3 competitors."
create_task "GDPR Compliance Review" "high" "todo" "+10" "" "Legal team requirement."
create_task "Update Documentation" "low" "todo" "+5" "" "Wiki is outdated."

# ==============================================================================
#  3. VALIDATION & ERROR HANDLING TESTS
# ==============================================================================
echo -e "\n${YELLOW}--- Phase 3: Validating Constraints (Error Scenarios) ---${NC}"

# 1. Duplicate Email
echo -n "1. Testing Duplicate Email Protection... "
resp=$(curl -s -X POST "$API_URL/employees" -H "$CONTENT_TYPE" -d '{ "name": "Evil Clone", "email": "arjun.mehta@techcorp.in", "role": "Spy" }')
code=$(echo "$resp" | jq -r '.code')
if [ "$code" == "CONFLICT" ] || [ "$code" == "DUPLICATE_ERROR" ]; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC} ($code)"; fi

# 2. Invalid Enum (Task Priority)
echo -n "2. Testing Invalid Priority Enum... "
resp=$(curl -s -X POST "$API_URL/tasks" -H "$CONTENT_TYPE" -d '{ "title": "Crash", "priority": "urgent_critical" }')
msg=$(echo "$resp" | jq -r '.message')
if [[ "$msg" == *"Validation"* ]]; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; fi

# 3. Missing Required Field
echo -n "3. Testing Missing Name (Employee)... "
resp=$(curl -s -X POST "$API_URL/employees" -H "$CONTENT_TYPE" -d '{ "role": "Ghost", "email": "ghost@test.com" }')
success=$(echo "$resp" | jq -r '.success')
if [ "$success" == "false" ]; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; fi

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${BLUE}    Database Successfully Populated with Realistic Data${NC}"
echo -e "${BLUE}======================================================${NC}"