#!/usr/bin/env python3
"""
rUv-swarm Course Database Initialization Script

This script populates the SQLite database with comprehensive sample data
for the rUv-swarm Interactive Course Platform including:
- Sample users (admin, instructor, students)
- 3-tier course structure (Foundations, Practitioner, Architect)
- Realistic course content based on the PRD
- Sample quizzes and code exercises
- Progress tracking data
"""

import os
import sys
import json
from datetime import datetime, timedelta
from decimal import Decimal
from pathlib import Path

# Add the parent directory to the path to import models
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import from models.py (not the models/ directory)
import importlib.util
models_path = Path(__file__).parent.parent / "models.py"
spec = importlib.util.spec_from_file_location("models", models_path)
models = importlib.util.module_from_spec(spec)
spec.loader.exec_module(models)

# Import the classes we need
Base = models.Base
User = models.User
Course = models.Course
Module = models.Module
Lesson = models.Lesson
CodeExercise = models.CodeExercise
Quiz = models.Quiz
QuizQuestion = models.QuizQuestion
QuizAnswer = models.QuizAnswer
Enrollment = models.Enrollment
LessonProgress = models.LessonProgress
QuizAttempt = models.QuizAttempt
QuizAttemptAnswer = models.QuizAttemptAnswer
CodeSubmission = models.CodeSubmission
Achievement = models.Achievement
UserAchievement = models.UserAchievement
init_db = models.init_db
get_session = models.get_session
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class rUvSwarmDataInitializer:
    """Initialize the rUv-swarm course database with comprehensive sample data"""
    
    def __init__(self, db_path="ruv_swarm_learning.db"):
        self.db_path = db_path
        self.engine = None
        self.session = None
        
    def connect(self):
        """Initialize database connection"""
        self.engine = init_db(f'sqlite:///{self.db_path}')
        self.session = get_session(self.engine)
        print(f"✅ Connected to database: {self.db_path}")
        
    def close(self):
        """Close database connection"""
        if self.session:
            self.session.close()
        print("✅ Database connection closed")
    
    def clear_all_data(self):
        """Clear all existing data (for clean initialization)"""
        print("🧹 Clearing existing data...")
        
        # Delete in reverse dependency order
        self.session.query(UserAchievement).delete()
        self.session.query(Achievement).delete()
        self.session.query(CodeSubmission).delete()
        self.session.query(QuizAttemptAnswer).delete()
        self.session.query(QuizAttempt).delete()
        self.session.query(LessonProgress).delete()
        self.session.query(Enrollment).delete()
        self.session.query(QuizAnswer).delete()
        self.session.query(QuizQuestion).delete()
        self.session.query(Quiz).delete()
        self.session.query(CodeExercise).delete()
        self.session.query(Lesson).delete()
        self.session.query(Module).delete()
        self.session.query(Course).delete()
        self.session.query(User).delete()
        
        self.session.commit()
        print("✅ All existing data cleared")
    
    def create_users(self):
        """Create sample users with different roles"""
        print("👥 Creating sample users...")
        
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@ruv-swarm.edu',
                'password': 'admin123',
                'first_name': 'System',
                'last_name': 'Administrator',
                'role': 'admin',
                'bio': 'System administrator for the rUv-swarm learning platform.',
                'is_active': True,
                'email_verified': True
            },
            {
                'username': 'dr_neuralnet',
                'email': 'instructor@ruv-swarm.edu',
                'password': 'instructor123',
                'first_name': 'Dr. Elena',
                'last_name': 'NetworkWeaver',
                'role': 'instructor',
                'bio': 'AI researcher specializing in swarm intelligence and neural networks. PhD in Computer Science from MIT.',
                'is_active': True,
                'email_verified': True
            },
            {
                'username': 'alex_student',
                'email': 'alex@student.edu',
                'password': 'student123',
                'first_name': 'Alex',
                'last_name': 'Learner',
                'role': 'student',
                'bio': 'Computer Science student passionate about AI and distributed systems.',
                'is_active': True,
                'email_verified': True
            },
            {
                'username': 'sarah_dev',
                'email': 'sarah@developer.com',
                'password': 'student123',
                'first_name': 'Sarah',
                'last_name': 'Developer',
                'role': 'student',
                'bio': 'Full-stack developer exploring AI/ML applications.',
                'is_active': True,
                'email_verified': True
            },
            {
                'username': 'mike_researcher',
                'email': 'mike@research.org',
                'password': 'student123',
                'first_name': 'Mike',
                'last_name': 'Researcher',
                'role': 'student',
                'bio': 'Research scientist investigating evolutionary algorithms.',
                'is_active': True,
                'email_verified': True
            }
        ]
        
        created_users = {}
        for user_data in users_data:
            password = user_data.pop('password')
            password_hash = pwd_context.hash(password)
            user = User(
                password_hash=password_hash,
                created_at=datetime.utcnow() - timedelta(days=30),
                **user_data
            )
            self.session.add(user)
            self.session.flush()  # Get the ID
            created_users[user_data['username']] = user
            
        self.session.commit()
        print(f"✅ Created {len(created_users)} users")
        return created_users
    
    def create_courses(self, instructor_user):
        """Create the 3-tier course structure"""
        print("📚 Creating course structure...")
        
        courses_data = [
            {
                'title': 'rUv-swarm Foundations',
                'slug': 'ruv-swarm-foundations',
                'level': 'foundations',
                'duration_hours': 8,
                'difficulty': 1,
                'description': """Master the fundamental concepts of swarm intelligence and neural networks. 
                This course introduces you to the revolutionary approach of ephemeral intelligence through 
                lightweight, temporary neural networks orchestrated in swarms.""",
                'prerequisites': 'Basic programming knowledge. Familiarity with C is helpful but not required.',
                'learning_objectives': """By the end of this course, you will:
                • Understand the core concepts of neural networks and activation functions
                • Grasp the XOR problem and why it demonstrates non-linear separability
                • Learn swarm intelligence principles and emergence
                • Master Particle Swarm Optimization (PSO) fundamentals
                • Execute and analyze rUv-swarm programs from the command line""",
                'thumbnail_url': '/static/images/foundations-thumb.png',
                'is_published': True
            },
            {
                'title': 'rUv-swarm Practitioner',
                'slug': 'ruv-swarm-practitioner',
                'level': 'practitioner',
                'duration_hours': 16,
                'difficulty': 3,
                'description': """Deep dive into the rUv-swarm codebase and learn to modify and extend 
                the system. Master the FANN library, understand PSO implementation, and build your own 
                neural network solutions.""",
                'prerequisites': 'Completion of rUv-swarm Foundations. Strong C programming skills required.',
                'learning_objectives': """By the end of this course, you will:
                • Master the FANN (Fast Artificial Neural Network) library
                • Analyze and modify the rUv-swarm source code
                • Understand PSO implementation details and parameters
                • Tune hyperparameters for optimal performance
                • Adapt the system for new datasets and problems""",
                'thumbnail_url': '/static/images/practitioner-thumb.png',
                'is_published': True
            },
            {
                'title': 'rUv-swarm Architect',
                'slug': 'ruv-swarm-architect',
                'level': 'architect',
                'duration_hours': 24,
                'difficulty': 5,
                'description': """Design and implement advanced swarm intelligence systems. Learn to 
                extend rUv-swarm with new optimization algorithms, deploy containerized solutions, 
                and architect distributed cognitive systems.""",
                'prerequisites': 'Completion of rUv-swarm Practitioner. Advanced programming and system design experience.',
                'learning_objectives': """By the end of this course, you will:
                • Implement alternative optimization algorithms (GA, ACO)
                • Design modular, extensible AI architectures
                • Containerize and deploy rUv-swarm applications
                • Architect solutions for complex, real-world problems
                • Create comprehensive AI system documentation""",
                'thumbnail_url': '/static/images/architect-thumb.png',
                'is_published': True
            }
        ]
        
        created_courses = []
        for course_data in courses_data:
            course = Course(
                instructor_id=instructor_user.id,
                created_at=datetime.utcnow() - timedelta(days=25),
                **course_data
            )
            self.session.add(course)
            self.session.flush()
            created_courses.append(course)
            
        self.session.commit()
        print(f"✅ Created {len(created_courses)} courses")
        return created_courses
    
    def create_foundations_content(self, course):
        """Create detailed content for Foundations course"""
        print("📖 Creating Foundations course content...")
        
        modules_data = [
            {
                'title': 'Introduction to Neural Networks',
                'slug': 'intro-neural-networks',
                'description': 'Understand the building blocks of artificial intelligence',
                'order_index': 1,
                'duration_minutes': 90,
                'lessons': [
                    {
                        'title': 'What is a Neural Network?',
                        'slug': 'what-is-neural-network',
                        'description': 'Basic concepts and biological inspiration',
                        'duration_minutes': 30,
                        'order_index': 1,
                        'content_markdown': """# What is a Neural Network?

## The Biological Inspiration

Neural networks are computational models inspired by the human brain. Just as your brain contains billions of interconnected neurons that process information, artificial neural networks consist of interconnected nodes that can learn patterns from data.

## Key Components

### 1. Neurons (Nodes)
A neuron is the basic processing unit that:
- Receives inputs from other neurons
- Applies a mathematical transformation
- Produces an output signal

### 2. Connections (Edges)
Each connection has a **weight** that determines the strength of the signal:
- Positive weights amplify the signal
- Negative weights inhibit the signal
- Zero weights block the signal completely

### 3. Activation Functions
These mathematical functions determine when a neuron "fires":
- **Step function**: Binary output (0 or 1)
- **Sigmoid**: Smooth curve between 0 and 1
- **ReLU**: Returns max(0, x)

## A Simple Example

Imagine a neuron deciding whether to buy coffee:
- Input 1: How tired are you? (0-10)
- Input 2: How much money do you have? (0-100)
- Weights: [0.3, 0.01] (tiredness matters more than money)
- Threshold: 5

If (tiredness × 0.3) + (money × 0.01) > 5, buy coffee!

## Why Neural Networks Matter

Neural networks can learn complex patterns that traditional programming cannot easily capture. They excel at:
- Pattern recognition
- Classification problems  
- Function approximation
- Decision making under uncertainty

In the next lesson, we'll explore how multiple neurons work together in networks!""",
                        'video_url': 'https://example.com/videos/neural-intro'
                    },
                    {
                        'title': 'Activation Functions Deep Dive',
                        'slug': 'activation-functions',
                        'description': 'Mathematical functions that make networks powerful',
                        'duration_minutes': 25,
                        'order_index': 2,
                        'content_markdown': """# Activation Functions: The Neural Network's Decision Makers

## Why Activation Functions?

Without activation functions, neural networks would just be linear algebra - they couldn't learn complex patterns! Activation functions introduce **non-linearity**, enabling networks to approximate any function.

## Common Activation Functions

### 1. Sigmoid Function
```
σ(x) = 1 / (1 + e^(-x))
```
- **Range**: (0, 1)
- **Shape**: S-curve
- **Uses**: Binary classification, older networks
- **Problem**: Vanishing gradients

### 2. Hyperbolic Tangent (tanh)
```
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
```
- **Range**: (-1, 1)
- **Shape**: S-curve centered at 0
- **Uses**: Hidden layers, RNNs
- **Advantage**: Zero-centered output

### 3. ReLU (Rectified Linear Unit)
```
ReLU(x) = max(0, x)
```
- **Range**: [0, ∞)
- **Shape**: Hockey stick
- **Uses**: Modern deep networks
- **Advantages**: Computationally efficient, no vanishing gradient

### 4. Leaky ReLU
```
LeakyReLU(x) = max(0.01x, x)
```
- **Advantage**: Prevents "dying neurons"
- **Uses**: Deep networks where ReLU neurons die

## Interactive Visualization

Try different inputs with various activation functions:

| Input | Sigmoid | tanh | ReLU | Leaky ReLU |
|-------|---------|------|------|------------|
| -2    | 0.12    | -0.96| 0    | -0.02      |
| -1    | 0.27    | -0.76| 0    | -0.01      |
| 0     | 0.50    | 0.00 | 0    | 0.00       |
| 1     | 0.73    | 0.76 | 1    | 1.00       |
| 2     | 0.88    | 0.96 | 2    | 2.00       |

## Choosing the Right Function

- **Output layer**: Sigmoid for binary, Softmax for multi-class
- **Hidden layers**: ReLU for most cases, tanh for RNNs
- **Special cases**: Leaky ReLU if ReLU neurons are dying

Understanding activation functions is crucial for the rUv-swarm system, where we optimize these parameters using particle swarms!""",
                        'video_url': 'https://example.com/videos/activation-functions'
                    },
                    {
                        'title': 'Network Layers and Architecture',
                        'slug': 'network-layers',
                        'description': 'How neurons organize into powerful computational structures',
                        'duration_minutes': 35,
                        'order_index': 3,
                        'content_markdown': """# Network Layers and Architecture

## Types of Layers

### Input Layer
- Receives raw data from the environment
- Each neuron represents one feature/attribute
- No computation, just data distribution
- Example: For image recognition, each pixel is an input neuron

### Hidden Layers
- Perform the actual computation and learning
- Extract features and patterns from data
- Can have multiple hidden layers (deep networks)
- More layers = more complex patterns

### Output Layer
- Produces the final network decision
- Number of neurons depends on the problem:
  - 1 neuron: Binary classification or regression
  - N neurons: N-class classification

## Network Topologies

### 1. Feedforward Networks
```
Input → Hidden → Hidden → Output
```
- Information flows in one direction
- Most common type
- Good for: Classification, regression

### 2. Recurrent Networks
```
Input → Hidden ⟷ Hidden → Output
```
- Connections can loop back
- Have memory of previous inputs
- Good for: Time series, language processing

### 3. Convolutional Networks
```
Input → Conv → Pool → Conv → Pool → Dense → Output
```
- Specialized for image processing
- Use filters to detect local features
- Good for: Computer vision, pattern recognition

## The Universal Approximation Theorem

**Amazing fact**: A feedforward network with just one hidden layer (and enough neurons) can approximate any continuous function!

This means neural networks are incredibly powerful - they can theoretically solve any problem that has a mathematical solution.

## Depth vs Width Trade-offs

### Deeper Networks (More Layers)
- **Pros**: Learn hierarchical features, fewer total parameters
- **Cons**: Harder to train, vanishing gradients
- **Best for**: Complex pattern recognition

### Wider Networks (More Neurons per Layer)
- **Pros**: Easier to train, parallel computation
- **Cons**: More parameters, potential overfitting
- **Best for**: Function approximation

## rUv-swarm Architecture

In our rUv-swarm system, we typically use:
- **3-layer networks**: Input → Hidden → Output
- **Fully connected**: Every neuron connected to next layer
- **Small networks**: 10-100 neurons total
- **Fast execution**: Optimized for CPU performance

This architecture is perfect for the ephemeral intelligence approach - small, fast, and effective!""",
                        'video_url': 'https://example.com/videos/network-architecture'
                    }
                ]
            },
            {
                'title': 'The XOR Problem',
                'slug': 'xor-problem',
                'description': 'The classic test case that proves the power of neural networks',
                'order_index': 2,
                'duration_minutes': 75,
                'lessons': [
                    {
                        'title': 'Understanding XOR Logic',
                        'slug': 'understanding-xor',
                        'description': 'Why XOR is special and challenging',
                        'duration_minutes': 25,
                        'order_index': 1,
                        'content_markdown': """# The XOR Problem: Neural Networks' Proving Ground

## What is XOR?

XOR (Exclusive OR) is a logical operation that returns true when inputs differ:

| Input A | Input B | XOR Output |
|---------|---------|------------|
| 0       | 0       | 0          |
| 0       | 1       | 1          |
| 1       | 0       | 1          |
| 1       | 1       | 0          |

## Why XOR is Challenging

### Linear Separability Problem

Try to draw a single straight line that separates the outputs:
```
   B
   ↑
1  |  0     1
   |
   |
0  |  0     1
   |________→ A
   0        1
```

**Impossible!** No single line can separate the 1s from the 0s.

### Historical Context: The AI Winter

In 1969, Marvin Minsky and Seymour Papert proved that single-layer perceptrons couldn't solve XOR. This led to:
- Massive reduction in AI funding
- 20+ years of limited neural network research
- The "AI Winter" of the 1970s-80s

## The Solution: Multi-Layer Networks

### Why Hidden Layers Work

A hidden layer creates a **non-linear transformation** of the input space:

```
Input Layer → Hidden Layer → Output Layer
    ↓             ↓             ↓
  [A, B]    → [H1, H2, H3] → [Output]
```

The hidden layer can learn to:
1. **H1**: Detect A OR B (logical OR)
2. **H2**: Detect A AND B (logical AND)  
3. **Output**: Compute H1 AND NOT H2 = XOR

### Mathematical Intuition

The hidden layer transforms the problem:
- **Original space**: Points that can't be linearly separated
- **Hidden space**: Points that CAN be linearly separated
- **Output layer**: Simple linear classification

## XOR as a Benchmark

XOR has become the "Hello World" of neural networks because:
- **Simple**: Only 4 training examples
- **Non-trivial**: Requires non-linear solution
- **Fast**: Trains quickly for testing
- **Universal**: Tests fundamental network capabilities

## In rUv-swarm

The rUv-swarm system includes XOR data (`data/xor.data`) because:
- Quick validation that the system works
- Benchmark for comparing optimization algorithms
- Educational tool for understanding network behavior
- Debugging aid when developing new features

Next, we'll explore how swarms of particles can find the optimal network weights to solve XOR!""",
                        'video_url': 'https://example.com/videos/xor-problem'
                    }
                ]
            },
            {
                'title': 'Introduction to Swarm Intelligence',
                'slug': 'swarm-intelligence',
                'description': 'How simple agents create complex intelligent behavior',
                'order_index': 3,
                'duration_minutes': 85,
                'lessons': [
                    {
                        'title': 'Emergence and Collective Intelligence',
                        'slug': 'emergence-collective-intelligence',
                        'description': 'How simple rules create complex behaviors',
                        'duration_minutes': 30,
                        'order_index': 1,
                        'content_markdown': """# Emergence and Collective Intelligence

## What is Emergence?

**Emergence** occurs when simple components, following basic rules, create complex behaviors that couldn't be predicted from the individual parts alone.

### Natural Examples

#### 1. Bird Flocks
**Simple rules for each bird**:
- Stay close to nearby birds
- Avoid collisions  
- Match the average direction of neighbors

**Emergent behavior**: Beautiful, coordinated flock movements that look choreographed but have no central conductor!

#### 2. Ant Colonies
**Simple rules for each ant**:
- Follow pheromone trails
- Lay pheromones when carrying food
- Explore randomly when no trail exists

**Emergent behavior**: Optimal paths to food sources, complex nest structures, efficient task allocation.

#### 3. Human Cities
**Simple rules for individuals**:
- Live close to work
- Choose affordable housing
- Access needed services

**Emergent behavior**: Complex urban patterns, economic zones, transportation networks.

## Collective Intelligence Properties

### 1. Decentralization
- No single controlling authority
- Each agent makes local decisions
- Global behavior emerges from local interactions

### 2. Self-Organization
- Order arises spontaneously
- System adapts to changes automatically
- No external coordination needed

### 3. Robustness
- System continues working if some agents fail
- Graceful degradation under stress
- Fault tolerance through redundancy

### 4. Scalability
- Adding more agents improves performance
- Principles work from dozens to millions of agents
- Linear cost for exponential complexity

## Swarm Intelligence vs Traditional AI

| Traditional AI | Swarm Intelligence |
|----------------|-------------------|
| Centralized | Decentralized |
| Top-down design | Bottom-up emergence |
| Single powerful agent | Many simple agents |
| Brittle to failures | Robust and adaptive |
| Hard-coded solutions | Emergent solutions |

## Why Swarm Intelligence Matters

### 1. Optimization Problems
Complex problems often have:
- Millions of possible solutions
- No clear path to the best answer
- Multiple competing objectives

Swarms explore the solution space efficiently!

### 2. Parallel Processing
- Each agent works independently
- Natural parallelization
- Scales with available computing power

### 3. Adaptation
- Swarms adjust to changing conditions
- Learn from experience
- Handle unexpected situations

## Applications in Computing

- **Optimization**: Finding best parameters
- **Routing**: Network packet routing, GPS navigation
- **Scheduling**: Task assignment, resource allocation
- **Machine Learning**: Training neural networks (like rUv-swarm!)
- **Robotics**: Coordinated robot teams

## The rUv-swarm Connection

rUv-swarm uses **Particle Swarm Optimization** where:
- Each "particle" represents a potential neural network configuration
- Particles explore the space of possible network weights
- The swarm collectively finds optimal solutions
- Simple local rules create intelligent global behavior

This is emergence in action - simple particles following basic rules discover complex neural network solutions!""",
                        'video_url': 'https://example.com/videos/emergence'
                    }
                ]
            },
            {
                'title': 'Particle Swarm Optimization Fundamentals',
                'slug': 'pso-fundamentals',
                'description': 'Master the core algorithm behind rUv-swarm',
                'order_index': 4,
                'duration_minutes': 100,
                'lessons': [
                    {
                        'title': 'PSO Core Concepts',
                        'slug': 'pso-core-concepts',
                        'description': 'Particles, positions, velocities, and fitness',
                        'duration_minutes': 35,
                        'order_index': 1,
                        'content_markdown': """# PSO Core Concepts

## The Particle Metaphor

Imagine a flock of birds searching for food in a landscape:
- Each **bird** is a "particle"
- The **food location** is the optimal solution
- Each bird has a **position** in the search space
- Each bird has a **velocity** (speed and direction)
- Birds remember their **personal best** location
- The flock shares the **global best** location found so far

## Key Components

### 1. Particle Position
```
particle.position = [x₁, x₂, x₃, ..., xₙ]
```
- Represents a candidate solution
- In neural networks: the weights and biases
- Example: [0.5, -0.3, 0.8, 0.1] for a 4-weight network

### 2. Particle Velocity
```
particle.velocity = [v₁, v₂, v₃, ..., vₙ]
```
- How much each dimension changes per iteration
- Controls exploration vs exploitation
- Updated based on personal and social experience

### 3. Personal Best (pbest)
```
particle.pbest = best position this particle has ever found
```
- Memory of the particle's own success
- Provides **exploitation** - return to good areas
- Updated when current position is better than pbest

### 4. Global Best (gbest)
```
swarm.gbest = best position any particle has found
```
- Shared knowledge of the entire swarm
- Provides **social learning** - learn from others
- All particles are attracted to this position

### 5. Fitness Function
```
fitness = evaluate_solution(particle.position)
```
- Measures how good a solution is
- For neural networks: often 1/(1+error)
- Lower error = higher fitness = better solution

## The PSO Algorithm

```python
# Initialize swarm
for each particle:
    particle.position = random_position()
    particle.velocity = random_velocity()
    particle.pbest = particle.position
    evaluate_fitness(particle)

# Find initial global best
swarm.gbest = position with best fitness

# Main optimization loop
for iteration in range(max_iterations):
    for each particle:
        # Update velocity (the magic happens here!)
        update_velocity(particle)
        
        # Move particle
        particle.position += particle.velocity
        
        # Evaluate new position
        evaluate_fitness(particle)
        
        # Update personal best
        if fitness > particle.pbest_fitness:
            particle.pbest = particle.position
            
        # Update global best
        if fitness > swarm.gbest_fitness:
            swarm.gbest = particle.position
```

## Velocity Update Formula

This is the heart of PSO:

```
velocity[i] = w × velocity[i] + 
              c₁ × r₁ × (pbest[i] - position[i]) + 
              c₂ × r₂ × (gbest[i] - position[i])
```

Where:
- **w**: Inertia weight (momentum)
- **c₁**: Cognitive coefficient (personal experience)
- **c₂**: Social coefficient (swarm experience)  
- **r₁, r₂**: Random numbers [0,1]

## Understanding the Forces

### 1. Inertia (w × velocity)
- Keeps particle moving in current direction
- High w = more exploration
- Low w = more focused search

### 2. Cognitive Force (c₁ term)
- Pulls particle toward its personal best
- "I should return to where I was successful"
- Represents individual learning

### 3. Social Force (c₂ term)
- Pulls particle toward global best
- "I should move toward where the swarm found success"
- Represents social learning

## Balancing Exploration vs Exploitation

- **High inertia + low attraction**: Explore widely
- **Low inertia + high attraction**: Exploit known good areas
- **Balanced parameters**: Best of both worlds

## Why PSO Works

1. **Parallel search**: Multiple particles explore simultaneously
2. **Information sharing**: Particles learn from each other
3. **Adaptive behavior**: Naturally balances exploration/exploitation
4. **Simple implementation**: Few parameters, easy to understand
5. **Robust performance**: Works well on many problem types

In the next lesson, we'll see PSO in action optimizing neural network weights!""",
                        'video_url': 'https://example.com/videos/pso-concepts'
                    }
                ]
            },
            {
                'title': 'Hands-On: Running rUv-swarm',
                'slug': 'hands-on-ruv-swarm',
                'description': 'Execute and analyze rUv-swarm programs',
                'order_index': 5,
                'duration_minutes': 120,
                'lessons': [
                    {
                        'title': 'Compiling and Running rUv-swarm',
                        'slug': 'compiling-running',
                        'description': 'Build the system and execute your first swarm',
                        'duration_minutes': 40,
                        'order_index': 1,
                        'content_markdown': """# Compiling and Running rUv-swarm

## Prerequisites

Before we start, ensure you have:
- GCC compiler
- FANN library (libfann-dev)
- Make utility
- Basic terminal knowledge

## Getting the Source Code

```bash
# Clone the repository
git clone https://github.com/ruv-net/ruv-swarm.git
cd ruv-swarm

# Check the project structure
ls -la
```

You should see:
```
src/           # Source code files
data/          # Training datasets
Makefile       # Build configuration
README.md      # Documentation
```

## Understanding the Makefile

```makefile
CC=gcc
CFLAGS=-Wall -O2 -std=c99
LIBS=-lfann -lm

SRCDIR=src
SOURCES=$(wildcard $(SRCDIR)/*.c)
OBJECTS=$(SOURCES:.c=.o)
TARGET=ruv-swarm

all: $(TARGET)

$(TARGET): $(OBJECTS)
    $(CC) $(OBJECTS) -o $(TARGET) $(LIBS)

%.o: %.c
    $(CC) $(CFLAGS) -c $< -o $@

clean:
    rm -f $(OBJECTS) $(TARGET)
```

Key points:
- **CC**: Uses GCC compiler
- **CFLAGS**: Optimization and C99 standard
- **LIBS**: Links FANN library and math library
- **Target**: Creates `ruv-swarm` executable

## Compiling the Project

```bash
# Build the project
make

# If successful, you'll see:
# gcc -Wall -O2 -std=c99 -c src/main.c -o src/main.o
# gcc -Wall -O2 -std=c99 -c src/pso.c -o src/pso.o  
# gcc -Wall -O2 -std=c99 -c src/fann_utils.c -o src/fann_utils.o
# gcc src/main.o src/pso.o src/fann_utils.o -o ruv-swarm -lfann -lm

# Check the executable
ls -la ruv-swarm
```

## First Run: Default Parameters

```bash
# Run with default settings
./ruv-swarm

# Expected output:
# Initializing PSO with 30 particles...
# Training neural network on XOR problem...
# Epoch 1: Best Error = 0.234567
# Epoch 2: Best Error = 0.198234
# ...
# Epoch 50: Best Error = 0.000123
# Training completed!
# Final network accuracy: 99.98%
```

## Understanding the Output

### Initialization Phase
```
Initializing PSO with 30 particles...
Loading dataset: data/xor.data
Network topology: 2-3-1 (2 inputs, 3 hidden, 1 output)
```

### Training Progress
```
Epoch 1: Best Error = 0.234567
```
- **Epoch**: One complete training iteration
- **Best Error**: Lowest error found by any particle
- Lower error = better performance

### Convergence Indicators
- Error decreasing consistently = good convergence
- Error oscillating = may need parameter tuning
- Error stuck = possible local minimum

## Command Line Options

```bash
# Show help
./ruv-swarm --help

# Common options:
./ruv-swarm --particles 50      # Use 50 particles instead of 30
./ruv-swarm --epochs 100        # Train for 100 epochs
./ruv-swarm --data data/iris.data  # Use different dataset
./ruv-swarm --verbose           # Show detailed output
```

## Analyzing Results

### Success Indicators
- Final error < 0.01 (usually)
- Network passes all test cases
- Convergence within reasonable epochs

### Troubleshooting
- **High error**: Increase particles or epochs
- **No convergence**: Adjust PSO parameters
- **Compile errors**: Check FANN library installation

## Next Steps

Now that you can run rUv-swarm, experiment with different parameters and observe how they affect:
1. Training speed (epochs to convergence)
2. Final accuracy (lowest error achieved)
3. Consistency (run multiple times)

In the practitioner level, we'll dive deep into the code to understand exactly how this magic happens!""",
                        'video_url': 'https://example.com/videos/compiling-running',
                        'code_exercises': [
                            {
                                'title': 'Compile and Run rUv-swarm',
                                'description': 'Build the rUv-swarm project and execute it with default parameters',
                                'starter_code': '''// This is a simulated compilation environment
// In real use, you would run these commands in your terminal:

/*
Step 1: Clone the repository
git clone https://github.com/ruv-net/ruv-swarm.git
cd ruv-swarm

Step 2: Compile the project
make

Step 3: Run with default parameters
./ruv-swarm

Your task: Examine the output and identify the key metrics
*/

#include <stdio.h>

int main() {
    printf("rUv-swarm Simulation\\n");
    printf("====================\\n");
    printf("Initializing PSO with 30 particles...\\n");
    printf("Training neural network on XOR problem...\\n");
    
    // TODO: Add a loop to simulate training epochs
    // Show decreasing error over time
    
    printf("Training completed!\\n");
    return 0;
}''',
                                'solution_code': '''#include <stdio.h>

int main() {
    printf("rUv-swarm Simulation\\n");
    printf("====================\\n");
    printf("Initializing PSO with 30 particles...\\n");
    printf("Loading dataset: data/xor.data\\n");
    printf("Network topology: 2-3-1\\n");
    printf("Training neural network on XOR problem...\\n\\n");
    
    // Simulate training epochs with decreasing error
    double error = 0.5;
    for (int epoch = 1; epoch <= 50; epoch += 5) {
        error = error * 0.8; // Simulate convergence
        printf("Epoch %d: Best Error = %.6f\\n", epoch, error);
    }
    
    printf("\\nTraining completed!\\n");
    printf("Final network accuracy: 99.98%%\\n");
    printf("\\nKey observations:\\n");
    printf("- Error decreased from 0.5 to %.6f\\n", error);
    printf("- Network converged in 50 epochs\\n");
    printf("- XOR problem successfully solved\\n");
    
    return 0;
}''',
                                'difficulty': 1,
                                'order_index': 1,
                                'hints': '["Look for decreasing error values", "Note the epoch progression", "Observe the final accuracy metric"]'
                            }
                        ]
                    }
                ]
            }
        ]
        
        for module_data in modules_data:
            lessons_data = module_data.pop('lessons', [])
            module = Module(
                course_id=course.id,
                is_published=True,
                created_at=datetime.utcnow() - timedelta(days=20),
                **module_data
            )
            self.session.add(module)
            self.session.flush()
            
            for lesson_data in lessons_data:
                exercises_data = lesson_data.pop('code_exercises', [])
                lesson = Lesson(
                    module_id=module.id,
                    is_published=True,
                    created_at=datetime.utcnow() - timedelta(days=15),
                    **lesson_data
                )
                self.session.add(lesson)
                self.session.flush()
                
                for exercise_data in exercises_data:
                    exercise = CodeExercise(
                        lesson_id=lesson.id,
                        test_cases='[{"input": "", "expected_output": "Expected compilation and execution"}]',
                        **exercise_data
                    )
                    self.session.add(exercise)
        
        self.session.commit()
        print(f"✅ Created Foundations course content")
    
    def create_practitioner_content(self, course):
        """Create detailed content for Practitioner course"""
        print("📖 Creating Practitioner course content...")
        
        modules_data = [
            {
                'title': 'Deep Dive: The FANN Library',
                'slug': 'fann-library-deep-dive',
                'description': 'Master the Fast Artificial Neural Network library',
                'order_index': 1,
                'duration_minutes': 180,
                'lessons': [
                    {
                        'title': 'FANN Library Architecture',
                        'slug': 'fann-architecture',
                        'description': 'Understanding FANN\'s design and capabilities',
                        'duration_minutes': 45,
                        'order_index': 1,
                        'content_markdown': """# FANN Library Architecture

## What is FANN?

The **Fast Artificial Neural Network (FANN)** library is a free, open-source neural network library written in C. It's designed for:
- **Speed**: Highly optimized C implementation
- **Portability**: Runs on multiple platforms  
- **Simplicity**: Easy-to-use API
- **Flexibility**: Supports various network types

## Key Features

### 1. Network Types
- **Feedforward networks**: Standard multilayer perceptrons
- **Shortcut connections**: Skip-layer connections for efficiency
- **Fully connected**: Every neuron connected to next layer

### 2. Training Algorithms
- **Backpropagation**: Classic gradient-based learning
- **RPROP**: Resilient backpropagation (faster)
- **Quickprop**: Quasi-Newton method
- **Cascade training**: Automatic network growth

### 3. Activation Functions
FANN supports 17+ activation functions:
- Linear, Sigmoid, Sigmoid Symmetric
- Gaussian, Elliot, Elliot Symmetric  
- Sin, Cos, Sin Symmetric, Cos Symmetric
- And more!

## Core FANN Data Structures

### 1. Neural Network (`struct fann`)
```c
struct fann {
    unsigned int num_input;     // Number of input neurons
    unsigned int num_output;    // Number of output neurons
    unsigned int total_neurons; // Total neurons in network
    fann_type **weights;        // Connection weights
    // ... many more fields
};
```

### 2. Training Data (`struct fann_train_data`)
```c
struct fann_train_data {
    unsigned int num_data;      // Number of training patterns
    unsigned int num_input;     // Inputs per pattern
    unsigned int num_output;    // Outputs per pattern
    fann_type **input;          // Input patterns
    fann_type **output;         // Target outputs
};
```

## Essential FANN Functions

### Network Creation
```c
// Create standard network: layers specify neurons per layer
struct fann *fann_create_standard(unsigned int num_layers, ...);

// Example: 2 inputs, 5 hidden, 1 output
struct fann *ann = fann_create_standard(3, 2, 5, 1);
```

### Network Configuration
```c
// Set activation function for hidden layers
fann_set_activation_function_hidden(ann, FANN_SIGMOID);

// Set activation function for output layer  
fann_set_activation_function_output(ann, FANN_SIGMOID);

// Set training algorithm
fann_set_training_algorithm(ann, FANN_TRAIN_RPROP);
```

### Training
```c
// Load training data from file
struct fann_train_data *data = fann_read_train_from_file("xor.data");

// Train the network
fann_train_on_data(ann, data, max_epochs, epochs_between_reports, desired_error);
```

### Testing/Running
```c
// Run network on input
fann_type *output = fann_run(ann, input_array);

// Test network on dataset
float mse = fann_test_data(ann, test_data);
```

### Memory Management
```c
// Clean up
fann_destroy_train_data(data);
fann_destroy(ann);
```

## FANN Data File Format

Training data files use a simple text format:
```
4 2 1          // 4 patterns, 2 inputs, 1 output
0 0            // Input pattern 1
0              // Expected output 1
0 1            // Input pattern 2  
1              // Expected output 2
1 0            // Input pattern 3
1              // Expected output 3
1 1            // Input pattern 4
0              // Expected output 4
```

## Why rUv-swarm Uses FANN

1. **Performance**: C implementation is fast
2. **Reliability**: Battle-tested, stable library
3. **Flexibility**: Easy to configure networks
4. **Integration**: Clean C API works well with PSO
5. **Community**: Well-documented, widely used

## FANN in the rUv-swarm Pipeline

```
1. PSO particle represents network weights
2. FANN creates network with those weights  
3. FANN trains/tests network on data
4. Error feeds back to PSO for optimization
5. Repeat until optimal weights found
```

This tight integration makes rUv-swarm incredibly efficient at finding optimal neural network configurations!""",
                        'video_url': 'https://example.com/videos/fann-architecture'
                    }
                ]
            },
            {
                'title': 'Code Walkthrough: fann_utils.c',
                'slug': 'fann-utils-walkthrough',
                'description': 'Analyze the rUv-swarm FANN wrapper functions',
                'order_index': 2,
                'duration_minutes': 120,
                'lessons': [
                    {
                        'title': 'Understanding fann_utils.c',
                        'slug': 'understanding-fann-utils',
                        'description': 'Deep dive into the FANN utility functions',
                        'duration_minutes': 50,
                        'order_index': 1,
                        'content_markdown': """# Understanding fann_utils.c

## Overview

The `fann_utils.c` file contains wrapper functions that bridge between the PSO algorithm and the FANN library. These utilities make it easy to:
- Create networks with PSO-optimized weights
- Train networks using particle positions
- Evaluate fitness for the swarm

## Key Functions Analysis

### 1. `create_network_from_weights()`

```c
struct fann *create_network_from_weights(double *weights, int num_weights) {
    // Create standard 2-3-1 network for XOR
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    
    // Set activation functions
    fann_set_activation_function_hidden(ann, FANN_SIGMOID);
    fann_set_activation_function_output(ann, FANN_SIGMOID);
    
    // Apply weights from PSO particle
    set_network_weights(ann, weights, num_weights);
    
    return ann;
}
```

**Purpose**: Convert a PSO particle position into a functional neural network.

**Key insight**: This is where the magic happens - PSO positions become network weights!

### 2. `set_network_weights()`

```c
void set_network_weights(struct fann *ann, double *weights, int num_weights) {
    fann_connection *connections = malloc(sizeof(fann_connection) * num_weights);
    
    // Get all connections
    fann_get_connection_array(ann, connections);
    
    // Set weights from particle position
    for (int i = 0; i < num_weights; i++) {
        connections[i].weight = (fann_type)weights[i];
    }
    
    // Apply back to network
    fann_set_weight_array(ann, connections, num_weights);
    
    free(connections);
}
```

**Purpose**: Map particle dimensions to network connections.

**Critical detail**: The order of weights matters - must match FANN's internal connection ordering!

### 3. `train_network()`

```c
double train_network(double *weights, int num_weights, 
                     struct fann_train_data *train_data) {
    // Create network from particle weights
    struct fann *ann = create_network_from_weights(weights, num_weights);
    
    // Test network on training data (no actual training!)
    float mse = fann_test_data(ann, train_data);
    
    // Convert MSE to fitness (lower error = higher fitness)
    double fitness = 1.0 / (1.0 + mse);
    
    fann_destroy(ann);
    return fitness;
}
```

**Important**: Despite the name, this function doesn't train - it evaluates!

**Why**: PSO handles the "training" by evolving particle positions. FANN just evaluates how good those positions are.

### 4. `test_network()`

```c
void test_network(struct fann *ann, struct fann_train_data *test_data) {
    printf("Testing network on %d patterns:\\n", test_data->num_data);
    
    for (int i = 0; i < test_data->num_data; i++) {
        fann_type *output = fann_run(ann, test_data->input[i]);
        
        printf("Input: [%.1f, %.1f] Expected: [%.1f] Got: [%.3f]\\n",
               test_data->input[i][0], test_data->input[i][1],
               test_data->output[i][0], output[0]);
    }
}
```

**Purpose**: Human-readable testing output for debugging and verification.

## Weight Mapping Strategy

### Network Topology: 2-3-1
```
Input Layer (2 neurons) → Hidden Layer (3 neurons) → Output Layer (1 neuron)
```

### Connection Count Calculation
```
Connections = (input_neurons × hidden_neurons) + (hidden_neurons × output_neurons)
            = (2 × 3) + (3 × 1)  
            = 6 + 3 = 9 connections
```

### Weight Array Mapping
```c
// FANN internal connection order:
weights[0] = input[0] → hidden[0]
weights[1] = input[1] → hidden[0]  
weights[2] = input[0] → hidden[1]
weights[3] = input[1] → hidden[1]
weights[4] = input[0] → hidden[2]
weights[5] = input[1] → hidden[2]
weights[6] = hidden[0] → output[0]
weights[7] = hidden[1] → output[0]
weights[8] = hidden[2] → output[0]
```

## Error Handling

### Memory Management
```c
// Always pair creation with destruction
struct fann *ann = create_network_from_weights(weights, num_weights);
// ... use network ...
fann_destroy(ann);  // Essential!
```

### Bounds Checking
```c
if (num_weights != EXPECTED_WEIGHTS) {
    fprintf(stderr, "Error: Expected %d weights, got %d\\n", 
            EXPECTED_WEIGHTS, num_weights);
    return -1;
}
```

## Integration with PSO

### Fitness Evaluation Loop
```c
// In PSO algorithm:
for (int i = 0; i < swarm_size; i++) {
    // Each particle position represents network weights
    double fitness = train_network(particles[i].position, 
                                   num_dimensions,
                                   training_data);
    particles[i].fitness = fitness;
}
```

### Best Solution Extraction
```c
// After PSO converges:
struct fann *best_network = create_network_from_weights(
    global_best_position, 
    num_dimensions
);

// Test the optimized network
test_network(best_network, test_data);
```

## Performance Considerations

1. **Network Creation Overhead**: Creating/destroying networks is expensive
2. **Memory Allocation**: Each evaluation allocates/frees memory
3. **FANN Optimization**: FANN itself is highly optimized C code

## Common Pitfalls

1. **Weight Array Size**: Must match network topology exactly
2. **Memory Leaks**: Always destroy networks after use
3. **Thread Safety**: FANN networks are not thread-safe
4. **Precision**: Converting between double (PSO) and fann_type

This wrapper design elegantly separates concerns - PSO handles optimization, FANN handles neural network computation!""",
                        'video_url': 'https://example.com/videos/fann-utils-code'
                    }
                ]
            }
        ]
        
        for module_data in modules_data:
            lessons_data = module_data.pop('lessons', [])
            module = Module(
                course_id=course.id,
                is_published=True,
                created_at=datetime.utcnow() - timedelta(days=20),
                **module_data
            )
            self.session.add(module)
            self.session.flush()
            
            for lesson_data in lessons_data:
                lesson = Lesson(
                    module_id=module.id,
                    is_published=True,
                    created_at=datetime.utcnow() - timedelta(days=15),
                    **lesson_data
                )
                self.session.add(lesson)
        
        self.session.commit()
        print(f"✅ Created Practitioner course content")
    
    def create_architect_content(self, course):
        """Create detailed content for Architect course"""
        print("📖 Creating Architect course content...")
        
        modules_data = [
            {
                'title': 'Beyond PSO: Advanced Optimization',
                'slug': 'beyond-pso',
                'description': 'Explore alternative optimization algorithms',
                'order_index': 1,
                'duration_minutes': 200,
                'lessons': [
                    {
                        'title': 'Genetic Algorithms vs PSO',
                        'slug': 'genetic-algorithms-vs-pso',
                        'description': 'Compare evolutionary approaches to optimization',
                        'duration_minutes': 60,
                        'order_index': 1,
                        'content_markdown': """# Genetic Algorithms vs PSO

## Introduction to Genetic Algorithms

**Genetic Algorithms (GA)** are inspired by natural evolution and genetics. Like PSO, they're population-based optimization algorithms, but they use different mechanisms for finding optimal solutions.

## Core Concepts

### Population and Individuals
- **Population**: Collection of candidate solutions (like PSO swarm)
- **Individual**: Single candidate solution (like PSO particle)
- **Chromosome**: Encoded representation of a solution
- **Gene**: Individual component of a chromosome

### Genetic Operators

#### 1. Selection
Choose parents for reproduction based on fitness:
- **Tournament Selection**: Pick best from random subset
- **Roulette Wheel**: Probability proportional to fitness
- **Rank Selection**: Based on relative ranking

#### 2. Crossover (Recombination)
Combine two parents to create offspring:
```
Parent 1: [0.5, -0.3, 0.8, 0.1, -0.2]
Parent 2: [0.1,  0.7, -0.4, 0.6, 0.9]
         
Single-Point Crossover at position 2:
Child 1:  [0.5, -0.3 | -0.4, 0.6, 0.9]
Child 2:  [0.1,  0.7 | 0.8, 0.1, -0.2]
```

#### 3. Mutation
Random changes to maintain diversity:
```
Before: [0.5, -0.3, 0.8, 0.1, -0.2]
After:  [0.5, -0.1, 0.8, 0.1, -0.2]  // Mutated gene 2
```

## GA Algorithm Structure

```python
# Initialize population
population = create_random_population(pop_size)
evaluate_fitness(population)

for generation in range(max_generations):
    # Selection: Choose parents
    parents = select_parents(population)
    
    # Crossover: Create offspring
    offspring = crossover(parents)
    
    # Mutation: Add random changes
    mutate(offspring)
    
    # Replacement: Form new population
    population = replace(population, offspring)
    
    # Evaluation
    evaluate_fitness(population)
```

## PSO vs GA Comparison

| Aspect | PSO | Genetic Algorithm |
|--------|-----|-------------------|
| **Inspiration** | Bird flocking behavior | Natural evolution |
| **Population** | Swarm of particles | Population of individuals |
| **Information Sharing** | Global best position | Crossover between parents |
| **Memory** | Each particle remembers personal best | No individual memory |
| **Operators** | Velocity update | Selection, crossover, mutation |
| **Convergence** | Continuous movement toward optima | Discrete generational improvement |
| **Parameters** | w, c₁, c₂ | Selection pressure, crossover/mutation rates |

## Detailed Comparison

### 1. Search Strategy

#### PSO:
- **Continuous movement**: Particles flow through search space
- **Social learning**: All particles know global best
- **Exploitation focused**: Strong attraction to known good areas

#### GA:
- **Discrete generations**: Population replaced each cycle
- **Recombination**: Mix successful solutions
- **Exploration focused**: Mutation maintains diversity

### 2. Implementation Complexity

#### PSO:
```c
// Simple velocity update
velocity[i] = w * velocity[i] + 
              c1 * r1 * (pbest[i] - position[i]) + 
              c2 * r2 * (gbest[i] - position[i]);
```

#### GA:
```c
// Multiple operations needed
parents = tournament_selection(population);
offspring = single_point_crossover(parents);
gaussian_mutation(offspring, mutation_rate);
population = generational_replacement(population, offspring);
```

### 3. Performance Characteristics

#### PSO Advantages:
- **Faster convergence**: Direct movement toward good solutions
- **Fewer parameters**: Only w, c₁, c₂ to tune
- **Continuous optimization**: Natural for real-valued problems
- **Simple implementation**: Straightforward algorithm

#### GA Advantages:
- **Better exploration**: Crossover creates novel combinations
- **Escapes local optima**: Mutation provides random jumps
- **Flexible representation**: Works with binary, real, or custom encodings
- **Proven theory**: Extensive mathematical analysis available

### 4. When to Use Each

#### Choose PSO for:
- Continuous optimization problems
- Fast convergence requirements
- Limited tuning time
- Real-time applications

#### Choose GA for:
- Discrete optimization problems
- Complex search landscapes with many local optima
- When solution diversity is important
- Combinatorial optimization

## Hybrid Approaches

### PSO-GA Hybrids
Combine the best of both worlds:
- Use GA crossover to create new particles
- Apply PSO velocity updates for fine-tuning
- Switch between GA and PSO phases

### Adaptive Selection
- Start with GA for exploration
- Switch to PSO for exploitation
- Monitor convergence to decide switching point

## Implementation in rUv-swarm Context

For neural network weight optimization:

### PSO Approach (Current):
```c
// Direct weight optimization
for (int i = 0; i < num_weights; i++) {
    new_weights[i] = apply_pso_update(particles[p].position[i]);
}
```

### GA Approach (Alternative):
```c
// Evolutionary weight optimization  
parent1 = tournament_selection(population);
parent2 = tournament_selection(population);
child_weights = uniform_crossover(parent1.weights, parent2.weights);
gaussian_mutation(child_weights, 0.1);
```

## Performance Comparison on XOR

Typical results for XOR problem:

| Algorithm | Avg Generations | Success Rate | Best Error |
|-----------|----------------|--------------|------------|
| PSO       | 45             | 95%          | 0.001      |
| GA        | 78             | 85%          | 0.003      |
| PSO-GA    | 52             | 98%          | 0.0008     |

## Conclusion

Both PSO and GA are powerful optimization algorithms with different strengths:
- **PSO**: Fast, simple, great for continuous problems
- **GA**: Robust, flexible, excellent for exploration
- **Hybrid**: Combines advantages of both approaches

The choice depends on your specific problem characteristics and requirements. In the next lesson, we'll implement a simple GA to replace PSO in rUv-swarm!""",
                        'video_url': 'https://example.com/videos/ga-vs-pso'
                    }
                ]
            }
        ]
        
        for module_data in modules_data:
            lessons_data = module_data.pop('lessons', [])
            module = Module(
                course_id=course.id,
                is_published=True,
                created_at=datetime.utcnow() - timedelta(days=20),
                **module_data
            )
            self.session.add(module)
            self.session.flush()
            
            for lesson_data in lessons_data:
                lesson = Lesson(
                    module_id=module.id,
                    is_published=True,
                    created_at=datetime.utcnow() - timedelta(days=15),
                    **lesson_data
                )
                self.session.add(lesson)
        
        self.session.commit()
        print(f"✅ Created Architect course content")
    
    def create_quizzes(self, courses):
        """Create comprehensive quizzes for all courses"""
        print("📝 Creating quizzes and questions...")
        
        # Foundations quiz
        foundations_course = next(c for c in courses if c.level == 'foundations')
        xor_module = next(m for m in foundations_course.modules if 'xor' in m.slug)
        
        foundations_quiz = Quiz(
            module_id=xor_module.id,
            title='XOR Problem and Neural Networks Quiz',
            description='Test your understanding of the XOR problem and neural network fundamentals',
            passing_score=75,
            time_limit_minutes=30,
            max_attempts=3,
            is_published=True
        )
        self.session.add(foundations_quiz)
        self.session.flush()
        
        # Quiz questions for foundations
        quiz_questions = [
            {
                'question_text': 'What makes the XOR problem challenging for single-layer perceptrons?',
                'question_type': 'multiple_choice',
                'points': 10,
                'order_index': 1,
                'explanation': 'XOR is not linearly separable, requiring multiple layers to solve.',
                'answers': [
                    {'answer_text': 'It requires too much memory', 'is_correct': False, 'order_index': 1},
                    {'answer_text': 'The data is not linearly separable', 'is_correct': True, 'order_index': 2},
                    {'answer_text': 'It has too many input variables', 'is_correct': False, 'order_index': 3},
                    {'answer_text': 'The training data is too small', 'is_correct': False, 'order_index': 4}
                ]
            },
            {
                'question_text': 'In Particle Swarm Optimization, what does "gbest" represent?',
                'question_type': 'multiple_choice',
                'points': 10,
                'order_index': 2,
                'explanation': 'Global best (gbest) is the best position found by any particle in the entire swarm.',
                'answers': [
                    {'answer_text': 'Global best position found by the entire swarm', 'is_correct': True, 'order_index': 1},
                    {'answer_text': 'Good best position for each particle', 'is_correct': False, 'order_index': 2},
                    {'answer_text': 'Gradient-based estimation technique', 'is_correct': False, 'order_index': 3},
                    {'answer_text': 'Genetic algorithm best solution', 'is_correct': False, 'order_index': 4}
                ]
            },
            {
                'question_text': 'True or False: Neural networks with only linear activation functions can solve the XOR problem.',
                'question_type': 'true_false',
                'points': 5,
                'order_index': 3,
                'explanation': 'False. Linear activation functions cannot create the non-linear decision boundary needed for XOR.',
                'answers': [
                    {'answer_text': 'True', 'is_correct': False, 'order_index': 1},
                    {'answer_text': 'False', 'is_correct': True, 'order_index': 2}
                ]
            }
        ]
        
        for q_data in quiz_questions:
            answers_data = q_data.pop('answers')
            question = QuizQuestion(
                quiz_id=foundations_quiz.id,
                **q_data
            )
            self.session.add(question)
            self.session.flush()
            
            for a_data in answers_data:
                answer = QuizAnswer(
                    question_id=question.id,
                    **a_data
                )
                self.session.add(answer)
        
        self.session.commit()
        print(f"✅ Created quizzes with comprehensive questions")
    
    def create_achievements(self):
        """Create achievement system"""
        print("🏆 Creating achievements...")
        
        achievements_data = [
            {
                'name': 'First Steps',
                'description': 'Complete your first lesson',
                'criteria': '{"type": "lesson_completion", "count": 1}',
                'points': 10,
                'icon_url': '/static/icons/first-steps.png'
            },
            {
                'name': 'XOR Master',
                'description': 'Successfully understand and explain the XOR problem',
                'criteria': '{"type": "quiz_score", "quiz": "xor", "min_score": 90}',
                'points': 25,
                'icon_url': '/static/icons/xor-master.png'
            },
            {
                'name': 'Swarm Intelligence',
                'description': 'Complete all Foundations level modules',
                'criteria': '{"type": "course_completion", "level": "foundations"}',
                'points': 50,
                'icon_url': '/static/icons/swarm-intelligence.png'
            },
            {
                'name': 'Code Warrior',
                'description': 'Successfully complete 10 code exercises',
                'criteria': '{"type": "code_exercises", "count": 10}',
                'points': 75,
                'icon_url': '/static/icons/code-warrior.png'
            },
            {
                'name': 'Neural Architect',
                'description': 'Complete the entire rUv-swarm course series',
                'criteria': '{"type": "course_completion", "level": "architect"}',
                'points': 200,
                'icon_url': '/static/icons/neural-architect.png'
            }
        ]
        
        achievements = []
        for achievement_data in achievements_data:
            achievement = Achievement(**achievement_data)
            self.session.add(achievement)
            achievements.append(achievement)
        
        self.session.commit()
        print(f"✅ Created {len(achievements)} achievements")
        return achievements
    
    def create_enrollments_and_progress(self, users, courses, achievements):
        """Create sample enrollments and progress data"""
        print("📊 Creating enrollments and progress data...")
        
        # Get users (excluding admin)
        students = [u for u in users.values() if u.role == 'student']
        foundations_course = next(c for c in courses if c.level == 'foundations')
        practitioner_course = next(c for c in courses if c.level == 'practitioner')
        
        # Create enrollments
        enrollments = []
        for student in students:
            # Everyone enrolls in foundations
            enrollment = Enrollment(
                user_id=student.id,
                course_id=foundations_course.id,
                enrolled_at=datetime.utcnow() - timedelta(days=15),
                status='in_progress',
                progress_percentage=Decimal('65.50')
            )
            self.session.add(enrollment)
            enrollments.append(enrollment)
            
            # Some students also enroll in practitioner
            if student.username in ['sarah_dev', 'mike_researcher']:
                enrollment2 = Enrollment(
                    user_id=student.id,
                    course_id=practitioner_course.id,
                    enrolled_at=datetime.utcnow() - timedelta(days=10),
                    status='enrolled',
                    progress_percentage=Decimal('15.25')
                )
                self.session.add(enrollment2)
                enrollments.append(enrollment2)
        
        # Create lesson progress
        alex = users['alex_student']
        first_lesson = foundations_course.modules[0].lessons[0]
        
        lesson_progress = LessonProgress(
            user_id=alex.id,
            lesson_id=first_lesson.id,
            started_at=datetime.utcnow() - timedelta(days=5),
            completed_at=datetime.utcnow() - timedelta(days=4),
            progress_percentage=Decimal('100.00'),
            time_spent_minutes=45,
            notes='Great introduction to neural networks! The XOR example was very helpful.'
        )
        self.session.add(lesson_progress)
        
        # Create quiz attempts
        quiz = foundations_course.modules[1].quizzes[0] if foundations_course.modules[1].quizzes else None
        if quiz:
            quiz_attempt = QuizAttempt(
                user_id=alex.id,
                quiz_id=quiz.id,
                started_at=datetime.utcnow() - timedelta(days=3),
                completed_at=datetime.utcnow() - timedelta(days=3),
                score=Decimal('85.00'),
                passed=True,
                time_taken_minutes=22,
                attempt_number=1
            )
            self.session.add(quiz_attempt)
        
        # Award some achievements
        first_steps_achievement = next(a for a in achievements if a.name == 'First Steps')
        user_achievement = UserAchievement(
            user_id=alex.id,
            achievement_id=first_steps_achievement.id,
            earned_at=datetime.utcnow() - timedelta(days=4)
        )
        self.session.add(user_achievement)
        
        self.session.commit()
        print(f"✅ Created enrollments and progress data")
    
    def initialize_all_data(self):
        """Initialize all sample data"""
        print("🚀 Starting rUv-swarm database initialization...\n")
        
        self.connect()
        self.clear_all_data()
        
        # Create all the data
        users = self.create_users()
        instructor = users['dr_neuralnet']
        courses = self.create_courses(instructor)
        
        # Create course content
        foundations_course = next(c for c in courses if c.level == 'foundations')
        practitioner_course = next(c for c in courses if c.level == 'practitioner')
        architect_course = next(c for c in courses if c.level == 'architect')
        
        self.create_foundations_content(foundations_course)
        self.create_practitioner_content(practitioner_course)
        self.create_architect_content(architect_course)
        
        self.create_quizzes(courses)
        achievements = self.create_achievements()
        self.create_enrollments_and_progress(users, courses, achievements)
        
        self.close()
        
        print(f"\n🎉 Database initialization completed successfully!")
        print(f"📁 Database file: {self.db_path}")
        print(f"📊 Sample data includes:")
        print(f"   👥 {len(users)} users (admin, instructor, students)")
        print(f"   📚 {len(courses)} courses (3 levels)")
        print(f"   📖 Comprehensive lesson content")
        print(f"   📝 Interactive quizzes and exercises")
        print(f"   🏆 {len(achievements)} achievements")
        print(f"   📊 Sample progress and enrollment data")


if __name__ == '__main__':
    initializer = rUvSwarmDataInitializer()
    initializer.initialize_all_data()