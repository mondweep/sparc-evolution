# rUv-swarm Course Database Scripts

This directory contains scripts for initializing and managing the rUv-swarm learning platform database.

## Scripts Overview

### `init_sample_data.py`
Comprehensive database initialization script that creates:
- **Users**: Admin, instructor, and student accounts
- **Courses**: 3-tier structure (Foundations, Practitioner, Architect)
- **Content**: Realistic lessons, modules, and educational material
- **Assessments**: Quizzes, code exercises, and questions
- **Progress**: Sample enrollment and learning progress data
- **Achievements**: Gamification system with badges and points

### `run_demo.py`
Demo runner that:
1. Executes the initialization script
2. Displays comprehensive overview of created data
3. Shows platform statistics and sample content
4. Provides next steps for running the platform

## Quick Start

### Prerequisites
```bash
# Install required packages
pip install -r requirements.txt
```

### Initialize Database
```bash
# Run the full initialization and demo
python run_demo.py

# Or just initialize data without demo
python init_sample_data.py
```

### Sample Login Credentials
After initialization, you can login with:

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Role: Administrator

**Instructor Account:**
- Username: `dr_neuralnet`
- Password: `instructor123`
- Role: Instructor

**Student Accounts:**
- Username: `alex_student` / Password: `student123`
- Username: `sarah_dev` / Password: `student123`
- Username: `mike_researcher` / Password: `student123`

## Course Structure Created

### 1. Foundations Level 🏗️
**Target**: Beginners to neural networks and swarm intelligence
**Duration**: 8 hours
**Modules**:
- Introduction to Neural Networks
- The XOR Problem
- Introduction to Swarm Intelligence
- Particle Swarm Optimization Fundamentals
- Hands-On: Running rUv-swarm

### 2. Practitioner Level ⚙️
**Target**: Developers who want to understand the implementation
**Duration**: 16 hours
**Modules**:
- Deep Dive: The FANN Library
- Code Walkthrough: fann_utils.c
- Deep Dive: The PSO Engine (pso.c)
- Connecting the Dots: Integration Architecture
- Hands-On Labs: Hyperparameter Tuning and New Datasets

### 3. Architect Level 🏛️
**Target**: Advanced users designing new systems
**Duration**: 24 hours
**Modules**:
- Beyond PSO: Advanced Optimization Algorithms
- Software Design Patterns in Scientific Computing
- Project Labs: Implementing New Optimizers
- Containerization & Deployment
- Final Project: Real-World Problem Solving

## Database Schema

The initialization creates a complete SQLite database with:
- **users**: Authentication and profiles
- **courses**: Course metadata and structure
- **modules**: Course chapters/sections
- **lessons**: Individual learning units with markdown content
- **code_exercises**: Interactive programming challenges
- **quizzes**: Assessments and evaluations
- **quiz_questions**: Individual quiz items
- **quiz_answers**: Multiple choice options
- **enrollments**: User course registrations
- **lesson_progress**: Learning progress tracking
- **quiz_attempts**: Assessment attempt history
- **achievements**: Gamification badges
- **user_achievements**: Earned badges per user

## Sample Content Highlights

### Realistic Educational Content
- **Neural Network Theory**: Comprehensive explanations with examples
- **XOR Problem**: Classic AI case study with detailed analysis
- **Swarm Intelligence**: From biological inspiration to algorithms
- **PSO Deep Dive**: Mathematical formulations and implementations
- **Code Analysis**: Line-by-line FANN library walkthroughs
- **Advanced Topics**: Genetic algorithms, architectural patterns

### Interactive Elements
- **Code Exercises**: Hands-on programming challenges
- **Quizzes**: Multiple choice, true/false, and short answer questions
- **Progress Tracking**: Completion percentages and time spent
- **Achievement System**: Badges for milestones and accomplishments

### Sample Lesson: "What is a Neural Network?"
Features complete markdown content including:
- Biological inspiration and metaphors
- Mathematical concepts with examples
- Visual learning aids (tables, diagrams)
- Key takeaways and learning objectives
- Video links and supplementary resources

## Database Statistics

After initialization, expect:
- **5 Users** (1 admin, 1 instructor, 3 students)
- **3 Courses** (Foundations, Practitioner, Architect)
- **10+ Modules** across all courses
- **20+ Lessons** with rich content
- **Code Exercises** with starter and solution code
- **Comprehensive Quizzes** with detailed questions
- **Sample Progress Data** showing platform usage
- **Achievement System** ready for gamification

## File Outputs

- **Database**: `ruv_swarm_learning.db` (SQLite file)
- **Size**: Approximately 1-2 MB with all sample data
- **Location**: Backend root directory

## Usage in Development

### Backend Integration
```python
from models import get_session, init_db

engine = init_db('sqlite:///ruv_swarm_learning.db')
session = get_session(engine)

# Database is ready with all sample data
users = session.query(User).all()
courses = session.query(Course).all()
```

### API Testing
The initialized database provides realistic data for:
- User authentication endpoints
- Course listing and enrollment APIs
- Lesson content delivery
- Quiz and assessment systems
- Progress tracking endpoints

## Customization

### Modify Content
Edit the lesson content in `init_sample_data.py`:
```python
def create_foundations_content(self, course):
    # Modify lesson content here
    'content_markdown': """# Your Custom Content..."""
```

### Add New Courses
Extend the `create_courses()` method to add more course levels or topics.

### Adjust User Data
Modify the `create_users()` method to change default accounts or add more sample users.

## Troubleshooting

### Common Issues

**ImportError**: Missing dependencies
```bash
pip install sqlalchemy passlib[bcrypt]
```

**Database Locked**: Existing connections
```bash
# Remove database file and reinitialize
rm ruv_swarm_learning.db
python init_sample_data.py
```

**Permission Errors**: Script execution
```bash
chmod +x init_sample_data.py run_demo.py
```

### Validation
After running scripts:
1. Check database file exists: `ls -la ruv_swarm_learning.db`
2. Verify content with demo: `python run_demo.py`
3. Test with backend: Start FastAPI server and check endpoints

## Next Steps

1. **Start Backend**: `cd .. && python main.py`
2. **Start Frontend**: `cd ../../frontend && npm run dev`
3. **Test Platform**: Visit http://localhost:3000
4. **Login**: Use sample credentials to explore courses
5. **Develop**: Use initialized data for feature development

The database provides a complete, realistic foundation for developing and testing the rUv-swarm learning platform!