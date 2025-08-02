# 📚 rUv-Swarm Course Content Export Guide

## 🎯 Where to Find Course Content

### 1. **Frontend Mock Data** 📁
**Location**: `/frontend/src/store/useAppStore.js` (lines 64-148)

**Contains**:
- 3 course definitions with metadata
- 5 sample lessons  
- Progress tracking data
- Course structure information

### 2. **Backend Sample Data** 📁  
**Location**: `/backend/scripts/init_sample_data.py`

**Contains**:
- Comprehensive database initialization
- Full course hierarchy (Courses → Modules → Lessons)
- Quiz questions and answers
- Code exercises and solutions
- User progress and achievements
- 3-tier learning path structure

### 3. **Export Service** 📁
**Location**: `/backend/services/export_service.py`

**Contains**:
- Markdown export functionality  
- JSON export capability
- CSV export for progress data
- PDF export structure (mock implementation)

## 🚀 Quick Download Methods

### Method 1: Copy Frontend Data
```bash
# Copy the frontend course data
cp frontend/src/store/useAppStore.js ./course_frontend_data.js
```

### Method 2: Extract Backend Data  
```bash
# Copy the comprehensive backend data
cp backend/scripts/init_sample_data.py ./course_backend_data.py
```

### Method 3: Use Export API
The platform includes export endpoints at:
- `POST /api/export/lesson/{lesson_id}/markdown`
- `POST /api/export/progress/{user_id}/json`  
- `POST /api/export/progress/{user_id}/csv`

## 📄 Content Structure Overview

### **Courses Available**:
1. **Introduction to rUv-Swarm** (Beginner)
   - 4 weeks, 8 lessons
   - Fundamentals & distributed AI systems

2. **Advanced Swarm Patterns** (Advanced)  
   - 6 weeks, 12 lessons
   - Complex coordination & fault tolerance

3. **AI-Powered Development** (Intermediate)
   - 5 weeks, 10 lessons  
   - Intelligent applications & swarm coordination

### **Sample Lessons**:
- "What is rUv-Swarm?" (Video, 15 min)
- "Setting up Your Environment" (Interactive, 20 min)  
- "Your First Swarm" (Coding, 25 min)
- "Understanding Swarm Intelligence" (Video, 18 min)
- "Coordination Patterns" (Interactive, 22 min)

## 💾 Export All Content

Would you like me to create a comprehensive export of all course content in a specific format? I can:

1. **Extract all frontend data** to JSON
2. **Parse backend data** into structured format  
3. **Create a unified export** combining both sources
4. **Generate markdown documentation** of all courses

Which format would be most useful for your needs?