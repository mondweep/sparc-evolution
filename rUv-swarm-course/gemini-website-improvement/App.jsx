import React, { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { CheckCircle, XCircle, BookOpen, Code, Award, User, ChevronDown, ChevronUp, ArrowLeft, Star, Clock } from 'lucide-react';
import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
    InteractiveNeuralNetwork, 
    InteractiveXOR, 
    SwarmIntelligenceDemo, 
    PSOVisualization, 
    AdvancedPSODemo,
    RuvSwarmSimulation,
    NetworkTopologyDemo,
    ActivationFunctionDemo,
    FANNUtilsDemo,
    GeneticAlgorithmDemo
} from './InteractiveComponents.jsx';


// --- Data from Python Script (converted to JSON) ---
const courseData = {
    users: [
        { id: 1, username: 'admin', email: 'admin@ruv-swarm.edu', firstName: 'System', lastName: 'Administrator', role: 'admin', bio: 'System administrator for the rUv-swarm learning platform.' },
        { id: 2, username: 'dr_neuralnet', email: 'instructor@ruv-swarm.edu', firstName: 'Dr. Elena', lastName: 'NetworkWeaver', role: 'instructor', bio: 'AI researcher specializing in swarm intelligence and neural networks. PhD in Computer Science from MIT.' },
        { id: 3, username: 'alex_student', email: 'alex@student.edu', firstName: 'Alex', lastName: 'Learner', role: 'student', bio: 'Computer Science student passionate about AI and distributed systems.' },
        { id: 4, username: 'sarah_dev', email: 'sarah@developer.com', firstName: 'Sarah', lastName: 'Developer', role: 'student', bio: 'Full-stack developer exploring AI/ML applications.' },
        { id: 5, username: 'mike_researcher', email: 'mike@research.org', firstName: 'Mike', lastName: 'Researcher', role: 'student', bio: 'Research scientist investigating evolutionary algorithms.' }
    ],
    courses: [
        { id: 1, title: 'rUv-swarm Foundations', slug: 'ruv-swarm-foundations', level: 'foundations', duration_hours: 8, difficulty: 1, description: 'Master the fundamental concepts of swarm intelligence and neural networks. This course introduces you to the revolutionary approach of ephemeral intelligence through lightweight, temporary neural networks orchestrated in swarms.', prerequisites: 'Basic programming knowledge. Familiarity with C is helpful but not required.', learning_objectives: '• Understand the core concepts of neural networks and activation functions\n• Grasp the XOR problem and why it demonstrates non-linear separability\n• Learn swarm intelligence principles and emergence\n• Master Particle Swarm Optimization (PSO) fundamentals\n• Execute and analyze rUv-swarm programs from the command line', thumbnail_url: 'https://placehold.co/600x400/1e40af/ffffff?text=Foundations', is_published: true, instructor_id: 2 },
        { id: 2, title: 'rUv-swarm Practitioner', slug: 'ruv-swarm-practitioner', level: 'practitioner', duration_hours: 16, difficulty: 3, description: 'Deep dive into the rUv-swarm codebase and learn to modify and extend the system. Master the FANN library, understand PSO implementation, and build your own neural network solutions.', prerequisites: 'Completion of rUv-swarm Foundations. Strong C programming skills required.', learning_objectives: '• Master the FANN (Fast Artificial Neural Network) library\n• Analyze and modify the rUv-swarm source code\n• Understand PSO implementation details and parameters\n• Tune hyperparameters for optimal performance\n• Adapt the system for new datasets and problems', thumbnail_url: 'https://placehold.co/600x400/be123c/ffffff?text=Practitioner', is_published: true, instructor_id: 2 },
        { id: 3, title: 'rUv-swarm Architect', slug: 'ruv-swarm-architect', level: 'architect', duration_hours: 24, difficulty: 5, description: 'Design and implement advanced swarm intelligence systems. Learn to extend rUv-swarm with new optimization algorithms, deploy containerized solutions, and architect distributed cognitive systems.', prerequisites: 'Completion of rUv-swarm Practitioner. Advanced programming and system design experience.', learning_objectives: '• Implement alternative optimization algorithms (GA, ACO)\n• Design modular, extensible AI architectures\n• Containerize and deploy rUv-swarm applications\n• Architect solutions for complex, real-world problems\n• Create comprehensive AI system documentation', thumbnail_url: 'https://placehold.co/600x400/047857/ffffff?text=Architect', is_published: true, instructor_id: 2 }
    ],
    modules: [
        // Foundations
        { id: 1, course_id: 1, title: 'Introduction to Neural Networks', slug: 'intro-neural-networks', description: 'Understand the building blocks of artificial intelligence', order_index: 1, duration_minutes: 90 },
        { id: 2, course_id: 1, title: 'The XOR Problem', slug: 'xor-problem', description: 'The classic test case that proves the power of neural networks', order_index: 2, duration_minutes: 75 },
        { id: 3, course_id: 1, title: 'Introduction to Swarm Intelligence', slug: 'swarm-intelligence', description: 'How simple agents create complex intelligent behavior', order_index: 3, duration_minutes: 85 },
        { id: 4, course_id: 1, title: 'Particle Swarm Optimization Fundamentals', slug: 'pso-fundamentals', description: 'Master the core algorithm behind rUv-swarm', order_index: 4, duration_minutes: 100 },
        { id: 5, course_id: 1, title: 'Hands-On: Running rUv-swarm', slug: 'hands-on-ruv-swarm', description: 'Execute and analyze rUv-swarm programs', order_index: 5, duration_minutes: 120 },
        // Practitioner
        { id: 6, course_id: 2, title: 'Deep Dive: The FANN Library', slug: 'fann-library-deep-dive', description: 'Master the Fast Artificial Neural Network library', order_index: 1, duration_minutes: 180 },
        { id: 7, course_id: 2, title: 'Code Walkthrough: fann_utils.c', slug: 'fann-utils-walkthrough', description: 'Analyze the rUv-swarm FANN wrapper functions', order_index: 2, duration_minutes: 120 },
        // Architect
        { id: 8, course_id: 3, title: 'Beyond PSO: Advanced Optimization', slug: 'beyond-pso', description: 'Explore alternative optimization algorithms', order_index: 1, duration_minutes: 200 },
    ],
    lessons: [
        // Module 1
        { id: 1, module_id: 1, title: 'What is a Neural Network?', slug: 'what-is-neural-network', description: 'Basic concepts and biological inspiration', duration_minutes: 30, order_index: 1, content_markdown: '# What is a Neural Network?\n\n## The Biological Inspiration\n\nNeural networks are computational models inspired by the human brain. Just as your brain contains billions of interconnected neurons that process information, artificial neural networks consist of interconnected nodes that can learn patterns from data.\n\n<div id="interactive-neural-network"></div>\n\n## Key Components\n\n### 1. Neurons (Nodes)\nA neuron is the basic processing unit that:\n- Receives inputs from other neurons\n- Applies a mathematical transformation\n- Produces an output signal\n\n### 2. Connections (Edges)\nEach connection has a **weight** that determines the strength of the signal:\n- Positive weights amplify the signal\n- Negative weights inhibit the signal\n- Zero weights block the signal completely\n\n### 3. Activation Functions\nThese mathematical functions determine when a neuron "fires":\n- **Step function**: Binary output (0 or 1)\n- **Sigmoid**: Smooth curve between 0 and 1\n- **ReLU**: Returns max(0, x)\n\n## A Simple Example\n\nImagine a neuron deciding whether to buy coffee:\n- Input 1: How tired are you? (0-10)\n- Input 2: How much money do you have? (0-100)\n- Weights: [0.3, 0.01] (tiredness matters more than money)\n- Threshold: 5\n\nIf (tiredness × 0.3) + (money × 0.01) > 5, buy coffee!\n\n## Why Neural Networks Matter\n\nNeural networks can learn complex patterns that traditional programming cannot easily capture. They excel at:\n- Pattern recognition\n- Classification problems\n- Function approximation\n- Decision making under uncertainty\n\nIn the next lesson, we\'ll explore how multiple neurons work together in networks!', video_url: 'https://example.com/videos/neural-intro' },
        { id: 2, module_id: 1, title: 'Activation Functions Deep Dive', slug: 'activation-functions', description: 'Mathematical functions that make networks powerful', duration_minutes: 25, order_index: 2, content_markdown: '# Activation Functions: The Neural Network\'s Decision Makers\n\n## Why Activation Functions?\n\nWithout activation functions, neural networks would just be linear algebra - they couldn\'t learn complex patterns! Activation functions introduce **non-linearity**, enabling networks to approximate any function.\n\n## Common Activation Functions\n\n### 1. Sigmoid Function\n`σ(x) = 1 / (1 + e^(-x))`\n- **Range**: (0, 1)\n- **Shape**: S-curve\n- **Uses**: Binary classification, older networks\n- **Problem**: Vanishing gradients\n\n### 2. Hyperbolic Tangent (tanh)\n`tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))`\n- **Range**: (-1, 1)\n- **Shape**: S-curve centered at 0\n- **Uses**: Hidden layers, RNNs\n- **Advantage**: Zero-centered output\n\n### 3. ReLU (Rectified Linear Unit)\n`ReLU(x) = max(0, x)`\n- **Range**: [0, ∞)\n- **Shape**: Hockey stick\n- **Uses**: Modern deep networks\n- **Advantages**: Computationally efficient, no vanishing gradient\n\n### 4. Leaky ReLU\n`LeakyReLU(x) = max(0.01x, x)`\n- **Advantage**: Prevents "dying neurons"\n- **Uses**: Deep networks where ReLU neurons die\n\n<div id="interactive-activation-functions"></div>\n\n## Choosing the Right Function\n\n- **Output layer**: Sigmoid for binary, Softmax for multi-class\n- **Hidden layers**: ReLU for most cases, tanh for RNNs\n- **Special cases**: Leaky ReLU if ReLU neurons are dying\n\nUnderstanding activation functions is crucial for the rUv-swarm system, where we optimize these parameters using particle swarms!', video_url: 'https://example.com/videos/activation-functions' },
        { id: 3, module_id: 1, title: 'Network Layers and Architecture', slug: 'network-layers', description: 'How neurons organize into powerful computational structures', duration_minutes: 35, order_index: 3, content_markdown: '# Network Layers and Architecture\n\n## Types of Layers\n\n### Input Layer\n- Receives raw data from the environment\n- Each neuron represents one feature/attribute\n- No computation, just data distribution\n\n### Hidden Layers\n- Perform the actual computation and learning\n- Extract features and patterns from data\n- Can have multiple hidden layers (deep networks)\n\n### Output Layer\n- Produces the final network decision\n- Number of neurons depends on the problem\n\n<div id="interactive-network-topology"></div>\n\n## The Universal Approximation Theorem\n\n**Amazing fact**: A feedforward network with just one hidden layer (and enough neurons) can approximate any continuous function!\n\nThis means neural networks are incredibly powerful - they can theoretically solve any problem that has a mathematical solution.\n\n## rUv-swarm Architecture\n\nIn our rUv-swarm system, we typically use:\n- **3-layer networks**: Input → Hidden → Output\n- **Fully connected**: Every neuron connected to next layer\n- **Small networks**: 10-100 neurons total\n- **Fast execution**: Optimized for CPU performance\n\nThis architecture is perfect for the ephemeral intelligence approach - small, fast, and effective!', video_url: 'https://example.com/videos/network-architecture' },
        // Module 2
        { id: 4, module_id: 2, title: 'Understanding XOR Logic', slug: 'understanding-xor', description: 'Why XOR is special and challenging', duration_minutes: 25, order_index: 1, content_markdown: '# The XOR Problem: Neural Networks\' Proving Ground\n\n## What is XOR?\n\nXOR (Exclusive OR) is a logical operation that returns true when inputs differ:\n\n| Input A | Input B | XOR Output |\n|---------|---------|------------|\n| 0       | 0       | 0          |\n| 0       | 1       | 1          |\n| 1       | 0       | 1          |\n| 1       | 1       | 0          |\n\n## Why XOR is Challenging\n\n### Linear Separability Problem\n\nTry to draw a single straight line that separates the outputs. As you can see in the interactive visualization below, it\'s impossible! No single line can separate the blue points from the orange points.\n\n<div id="interactive-xor-demo"></div>\n\n### Historical Context: The AI Winter\n\nIn 1969, Marvin Minsky and Seymour Papert proved that single-layer perceptrons couldn\'t solve XOR. This led to a massive reduction in AI funding and 20+ years of limited neural network research—the "AI Winter" of the 1970s-80s.\n\n## The Solution: Multi-Layer Networks\n\nClick the "Show Hidden Layer Solution" button in the visualization. A hidden layer creates a **non-linear transformation** of the input space, moving the points into a new dimension where they *can* be separated by a simple line (or plane).\n\nThis is the power of hidden layers and the key to solving complex problems with neural networks.\n\n## XOR as a Benchmark\n\nXOR has become the "Hello World" of neural networks because it\'s simple yet requires a non-linear solution, making it perfect for testing and understanding fundamental network capabilities.\n\nNext, we\'ll explore how swarms of particles can find the optimal network weights to solve XOR!', video_url: 'https://example.com/videos/xor-problem' },
        // Module 3
        { id: 5, module_id: 3, title: 'Emergence and Collective Intelligence', slug: 'emergence-collective-intelligence', description: 'How simple rules create complex behaviors', duration_minutes: 30, order_index: 1, content_markdown: '# Emergence and Collective Intelligence\n\n## What is Emergence?\n\n**Emergence** occurs when simple components, following basic rules, create complex behaviors that couldn\'t be predicted from the individual parts alone.\n\n<div id="swarm-intelligence-demo"></div>\n\n### Natural Examples\n\n#### 1. Bird Flocks\n**Simple rules for each bird**:\n- Stay close to nearby birds\n- Avoid collisions\n- Match the average direction of neighbors\n\n**Emergent behavior**: Beautiful, coordinated flock movements that look choreographed but have no central conductor!\n\n#### 2. Ant Colonies\n**Simple rules for each ant**:\n- Follow pheromone trails\n- Lay pheromones when carrying food\n- Explore randomly when no trail exists\n\n**Emergent behavior**: Optimal paths to food sources, complex nest structures, efficient task allocation.\n\n#### 3. Human Cities\n**Simple rules for individuals**:\n- Live close to work\n- Choose affordable housing\n- Access needed services\n\n**Emergent behavior**: Complex urban patterns, economic zones, transportation networks.\n\n## Collective Intelligence Properties\n\n### 1. Decentralization\n- No single controlling authority\n- Each agent makes local decisions\n- Global behavior emerges from local interactions\n\n### 2. Self-Organization\n- Order arises spontaneously\n- System adapts to changes automatically\n- No external coordination needed\n\n### 3. Robustness\n- System continues working if some agents fail\n- Graceful degradation under stress\n- Fault tolerance through redundancy\n\n### 4. Scalability\n- Adding more agents improves performance\n- Principles work from dozens to millions of agents\n- Linear cost for exponential complexity\n\n## Swarm Intelligence vs Traditional AI\n\n| Traditional AI | Swarm Intelligence |\n|----------------|-------------------|\n| Centralized | Decentralized |\n| Top-down design | Bottom-up emergence |\n| Single powerful agent | Many simple agents |\n| Brittle to failures | Robust and adaptive |\n| Hard-coded solutions | Emergent solutions |\n\n## Why Swarm Intelligence Matters\n\n### 1. Optimization Problems\nComplex problems often have:\n- Millions of possible solutions\n- No clear path to the best answer\n- Multiple competing objectives\n\nSwarms explore the solution space efficiently!\n\n### 2. Parallel Processing\n- Each agent works independently\n- Natural parallelization\n- Scales with available computing power\n\n### 3. Adaptation\n- Swarms adjust to changing conditions\n- Learn from experience\n- Handle unexpected situations\n\n## Applications in Computing\n\n- **Optimization**: Finding best parameters\n- **Routing**: Network packet routing, GPS navigation\n- **Scheduling**: Task assignment, resource allocation\n- **Machine Learning**: Training neural networks (like rUv-swarm!)\n- **Robotics**: Coordinated robot teams\n\n## The rUv-swarm Connection\n\nrUv-swarm uses **Particle Swarm Optimization** where:\n- Each "particle" represents a potential neural network configuration\n- Particles explore the space of possible network weights\n- The swarm collectively finds optimal solutions\n- Simple local rules create intelligent global behavior\n\nThis is emergence in action - simple particles following basic rules discover complex neural network solutions!', video_url: 'https://example.com/videos/emergence' },
        // Module 4
        { id: 6, module_id: 4, title: 'PSO Core Concepts', slug: 'pso-core-concepts', description: 'Particles, positions, velocities, and fitness', duration_minutes: 35, order_index: 1, content_markdown: '# PSO Core Concepts\n\n## The Particle Metaphor\n\nImagine a flock of birds searching for food in a landscape:\n- Each **bird** is a "particle"\n- The **food location** is the optimal solution\n- Each bird has a **position** in the search space\n- Each bird has a **velocity** (speed and direction)\n- Birds remember their **personal best** location\n- The flock shares the **global best** location found so far\n\n## Key Components\n\n### 1. Particle Position\n```\nparticle.position = [x₁, x₂, x₃, ..., xₙ]\n```\n- Represents a candidate solution\n- In neural networks: the weights and biases\n- Example: [0.5, -0.3, 0.8, 0.1] for a 4-weight network\n\n### 2. Particle Velocity\n```\nparticle.velocity = [v₁, v₂, v₃, ..., vₙ]\n```\n- How much each dimension changes per iteration\n- Controls exploration vs exploitation\n- Updated based on personal and social experience\n\n### 3. Personal Best (pbest)\n```\nparticle.pbest = best position this particle has ever found\n```\n- Memory of the particle\'s own success\n- Provides **exploitation** - return to good areas\n- Updated when current position is better than pbest\n\n### 4. Global Best (gbest)\n```\nswarm.gbest = best position any particle has found\n```\n- Shared knowledge of the entire swarm\n- Provides **social learning** - learn from others\n- All particles are attracted to this position\n\n### 5. Fitness Function\n```\nfitness = evaluate_solution(particle.position)\n```\n- Measures how good a solution is\n- For neural networks: often 1/(1+error)\n- Lower error = higher fitness = better solution\n\n## The PSO Algorithm\n\n```python\n# Initialize swarm\nfor each particle:\n    particle.position = random_position()\n    particle.velocity = random_velocity()\n    particle.pbest = particle.position\n    evaluate_fitness(particle)\n\n# Find initial global best\nswarm.gbest = position with best fitness\n\n# Main optimization loop\nfor iteration in range(max_iterations):\n    for each particle:\n        # Update velocity (the magic happens here!)\n        update_velocity(particle)\n\n        # Move particle\n        particle.position += particle.velocity\n\n        # Evaluate new position\n        evaluate_fitness(particle)\n\n        # Update personal best\n        if fitness > particle.pbest_fitness:\n            particle.pbest = particle.position\n\n        # Update global best\n        if fitness > swarm.gbest_fitness:\n            swarm.gbest = particle.position\n```\n\n## Velocity Update Formula\n\nThis is the heart of PSO:\n\n```\nvelocity[i] = w × velocity[i] + \n              c₁ × r₁ × (pbest[i] - position[i]) + \n              c₂ × r₂ × (gbest[i] - position[i])\n```\n\nWhere:\n- **w**: Inertia weight (momentum)\n- **c₁**: Cognitive coefficient (personal experience)\n- **c₂**: Social coefficient (swarm experience)\n- **r₁, r₂**: Random numbers [0,1]\n\n## Understanding the Forces\n\n### 1. Inertia (w × velocity)\n- Keeps particle moving in current direction\n- High w = more exploration\n- Low w = more focused search\n\n### 2. Cognitive Force (c₁ term)\n- Pulls particle toward its personal best\n- "I should return to where I was successful"\n- Represents individual learning\n\n### 3. Social Force (c₂ term)\n- Pulls particle toward global best\n- "I should move toward where the swarm found success"\n- Represents social learning\n\n## Balancing Exploration vs Exploitation\n\n- **High inertia + low attraction**: Explore widely\n- **Low inertia + high attraction**: Exploit known good areas\n- **Balanced parameters**: Best of both worlds\n\n## Why PSO Works\n\n1. **Parallel search**: Multiple particles explore simultaneously\n2. **Information sharing**: Particles learn from each other\n3. **Adaptive behavior**: Naturally balances exploration/exploitation\n4. **Simple implementation**: Few parameters, easy to understand\n5. **Robust performance**: Works well on many problem types\n\nIn the next lesson, we\'ll see PSO in action optimizing neural network weights!', video_url: 'https://example.com/videos/pso-concepts' },
        { id: 15, module_id: 4, title: 'Advanced PSO: Parameter Tuning & Force Analysis', slug: 'advanced-pso-parameter-tuning', description: 'Deep dive into PSO parameters and force visualization', duration_minutes: 45, order_index: 2, content_markdown: '# Advanced PSO: Parameter Tuning & Force Analysis\n\n## Beyond Basic PSO\n\nWhile the basic PSO algorithm is powerful, understanding how to tune its parameters and visualize the underlying forces can dramatically improve optimization performance. In this lesson, we\'ll explore the advanced mechanics of PSO.\n\n<div id="advanced-pso-demo"></div>\n\n## The Three Critical Parameters\n\n### 1. Inertia Weight (w)\n\nThe inertia weight controls how much of the previous velocity is retained:\n\n```\nvelocity[i] = w × previous_velocity[i] + cognitive_term + social_term\n```\n\n#### Parameter Ranges & Effects:\n- **w > 1.0**: Divergent behavior, particles accelerate away\n- **w = 0.9**: High exploration, slow convergence\n- **w = 0.7**: Balanced exploration/exploitation\n- **w = 0.4**: Fast convergence, risk of local optima\n- **w < 0.3**: Very fast convergence, poor exploration\n\n#### Adaptive Inertia Strategies:\n```c\n// Linear decreasing inertia\nw = w_max - (w_max - w_min) * iteration / max_iterations;\n\n// Exponential decreasing inertia  \nw = w_min + (w_max - w_min) * exp(-2.0 * iteration / max_iterations);\n```\n\n### 2. Cognitive Coefficient (c₁)\n\nControls attraction to personal best position:\n\n```\ncognitive_force = c₁ × r₁ × (personal_best - current_position)\n```\n\n#### Parameter Effects:\n- **c₁ = 0**: No personal memory, purely social behavior\n- **c₁ = 0.5**: Weak personal attraction\n- **c₁ = 1.5**: Moderate personal bias (typical)\n- **c₁ = 2.5**: Strong individual behavior\n- **c₁ > 3.0**: Particles ignore swarm, independent search\n\n### 3. Social Coefficient (c₂)\n\nControls attraction to global best position:\n\n```\nsocial_force = c₂ × r₂ × (global_best - current_position)\n```\n\n#### Parameter Effects:\n- **c₂ = 0**: No social learning, independent particles\n- **c₂ = 0.5**: Weak swarm cohesion\n- **c₂ = 1.5**: Moderate social influence (typical)\n- **c₂ = 2.5**: Strong convergence pressure\n- **c₂ > 3.0**: Premature convergence risk\n\n## Force Decomposition Analysis\n\nThe velocity update can be viewed as three competing forces:\n\n### Inertial Force\n```c\nF_inertia = w × velocity[i]\n```\n- **Direction**: Current movement direction\n- **Magnitude**: Proportional to current speed\n- **Effect**: Maintains exploration momentum\n\n### Cognitive Force\n```c\nF_cognitive = c₁ × r₁ × (pbest[i] - position[i])\n```\n- **Direction**: Toward personal best\n- **Magnitude**: Distance from personal best × c₁\n- **Effect**: Individual learning and exploitation\n\n### Social Force\n```c\nF_social = c₂ × r₂ × (gbest[i] - position[i])\n```\n- **Direction**: Toward global best\n- **Magnitude**: Distance from global best × c₂\n- **Effect**: Swarm coordination and convergence\n\n## Parameter Tuning Guidelines\n\n### Classic PSO Parameters (Clerc & Kennedy, 2002)\n- **w = 0.729**\n- **c₁ = c₂ = 1.49445**\n- Provides guaranteed convergence\n\n### Exploration-Focused Tuning\n- **w = 0.9** (high inertia)\n- **c₁ = 2.0** (strong personal memory)\n- **c₂ = 1.0** (weak social influence)\n- Good for: Complex landscapes, many local optima\n\n### Exploitation-Focused Tuning\n- **w = 0.4** (low inertia)\n- **c₁ = 1.0** (weak personal memory)\n- **c₂ = 2.5** (strong social influence)\n- Good for: Smooth landscapes, known solution vicinity\n\n### Balanced Configuration\n- **w = 0.7** (moderate inertia)\n- **c₁ = c₂ = 1.5** (equal cognitive/social)\n- Good for: General-purpose optimization\n\n## Convergence Analysis\n\n### Measuring Convergence\n\n#### 1. Fitness Improvement Rate\n```c\nconvergence_rate = (best_fitness[t] - best_fitness[t-10]) / 10.0;\nif (convergence_rate < threshold) {\n    // Convergence detected\n}\n```\n\n#### 2. Swarm Diversity\n```c\ndiversity = 0;\nfor (int i = 0; i < swarm_size; i++) {\n    diversity += distance(particle[i].position, global_best.position);\n}\ndiversity /= swarm_size;\n```\n\n#### 3. Velocity Magnitude\n```c\navg_velocity = 0;\nfor (int i = 0; i < swarm_size; i++) {\n    avg_velocity += magnitude(particle[i].velocity);\n}\navg_velocity /= swarm_size;\n```\n\n### Convergence Indicators\n- **Good**: Steady fitness improvement over iterations\n- **Stagnation**: Fitness plateau for many iterations\n- **Premature**: Rapid convergence to suboptimal solution\n- **Divergence**: Fitness getting worse over time\n\n## Advanced Techniques\n\n### 1. Constriction Factor\nClerc and Kennedy\'s constriction approach:\n```c\nchi = 2.0 / (2.0 - phi - sqrt(phi * phi - 4.0 * phi));\nvelocity[i] = chi * (velocity[i] + c1*r1*(pbest[i] - position[i]) + \n                                  c2*r2*(gbest[i] - position[i]));\n```\nWhere phi = c₁ + c₂ > 4.0\n\n### 2. Velocity Clamping\n```c\nmax_velocity = (upper_bound - lower_bound) * 0.2;\nif (velocity[i] > max_velocity) velocity[i] = max_velocity;\nif (velocity[i] < -max_velocity) velocity[i] = -max_velocity;\n```\n\n### 3. Boundary Handling\n```c\n// Absorbing boundaries\nif (position[i] < lower_bound) {\n    position[i] = lower_bound;\n    velocity[i] = 0;\n}\n\n// Reflecting boundaries\nif (position[i] > upper_bound) {\n    position[i] = 2 * upper_bound - position[i];\n    velocity[i] = -velocity[i];\n}\n```\n\n## Practical Guidelines\n\n### Problem-Specific Tuning\n1. **Start with standard parameters** (w=0.7, c₁=c₂=1.5)\n2. **Increase w** if stuck in local optima\n3. **Decrease w** if convergence is too slow\n4. **Increase c₁** for more exploration\n5. **Increase c₂** for faster convergence\n6. **Use adaptive strategies** for long runs\n\n### Debugging Poor Performance\n- **No improvement**: Increase w or decrease c₂\n- **Slow convergence**: Decrease w or increase c₂\n- **Premature convergence**: Increase w, decrease c₂\n- **Oscillating fitness**: Check velocity clamping\n\n## Interactive Experimentation\n\nUse the visualization above to experiment with different parameter combinations:\n1. **Try extreme values** to see their effects\n2. **Observe force vectors** to understand particle behavior\n3. **Watch convergence plots** to see optimization progress\n4. **Compare different fitness landscapes** (multiple peaks)\n\nUnderstanding these advanced concepts will make you a PSO expert capable of tackling complex optimization challenges!', video_url: 'https://example.com/videos/advanced-pso' },
        // Module 5
        { id: 7, module_id: 5, title: 'Compiling and Running rUv-swarm', slug: 'compiling-running', description: 'Build the system and execute your first swarm', duration_minutes: 40, order_index: 1, content_markdown: '# Compiling and Running rUv-swarm\n\n## Prerequisites\n\nBefore we start, ensure you have:\n- GCC compiler\n- FANN library (libfann-dev)\n- Make utility\n- Basic terminal knowledge\n\n## Getting the Source Code\n\n```bash\n# Clone the repository\ngit clone [https://github.com/ruv-net/ruv-swarm.git](https://github.com/ruv-net/ruv-swarm.git)\ncd ruv-swarm\n\n# Check the project structure\nls -la\n```\n\nYou should see:\n```\nsrc/         # Source code files\ndata/        # Training datasets\nMakefile     # Build configuration\nREADME.md    # Documentation\n```\n\n## Understanding the Makefile\n\n```makefile\nCC=gcc\nCFLAGS=-Wall -O2 -std=c99\nLIBS=-lfann -lm\n\nSRCDIR=src\nSOURCES=$(wildcard $(SRCDIR)/*.c)\nOBJECTS=$(SOURCES:.c=.o)\nTARGET=ruv-swarm\n\nall: $(TARGET)\n\n$(TARGET): $(OBJECTS)\n    $(CC) $(OBJECTS) -o $(TARGET) $(LIBS)\n\n%.o: %.c\n    $(CC) $(CFLAGS) -c $< -o $@\n\nclean:\n    rm -f $(OBJECTS) $(TARGET)\n```\n\nKey points:\n- **CC**: Uses GCC compiler\n- **CFLAGS**: Optimization and C99 standard\n- **LIBS**: Links FANN library and math library\n- **Target**: Creates `ruv-swarm` executable\n\n## Compiling the Project\n\n```bash\n# Build the project\nmake\n\n# If successful, you\'ll see:\n# gcc -Wall -O2 -std=c99 -c src/main.c -o src/main.o\n# gcc -Wall -O2 -std=c99 -c src/pso.c -o src/pso.o\n# gcc -Wall -O2 -std=c99 -c src/fann_utils.c -o src/fann_utils.o\n# gcc src/main.o src/pso.o src/fann_utils.o -o ruv-swarm -lfann -lm\n\n# Check the executable\nls -la ruv-swarm\n```\n\n## First Run: Default Parameters\n\n```bash\n# Run with default settings\n./ruv-swarm\n\n# Expected output:\n# Initializing PSO with 30 particles...\n# Training neural network on XOR problem...\n# Epoch 1: Best Error = 0.234567\n# Epoch 2: Best Error = 0.198234\n# ...\n# Epoch 50: Best Error = 0.000123\n# Training completed!\n# Final network accuracy: 99.98%\n```\n\n## Understanding the Output\n\n### Initialization Phase\n```\nInitializing PSO with 30 particles...\nLoading dataset: data/xor.data\nNetwork topology: 2-3-1 (2 inputs, 3 hidden, 1 output)\n```\n\n### Training Progress\n```\nEpoch 1: Best Error = 0.234567\n```\n- **Epoch**: One complete training iteration\n- **Best Error**: Lowest error found by any particle\n- Lower error = better performance\n\n### Convergence Indicators\n- Error decreasing consistently = good convergence\n- Error oscillating = may need parameter tuning\n- Error stuck = possible local minimum\n\n## Command Line Options\n\n```bash\n# Show help\n./ruv-swarm --help\n\n# Common options:\n./ruv-swarm --particles 50      # Use 50 particles instead of 30\n./ruv-swarm --epochs 100        # Train for 100 epochs\n./ruv-swarm --data data/iris.data   # Use different dataset\n./ruv-swarm --verbose           # Show detailed output\n```\n\n## Analyzing Results\n\n### Success Indicators\n- Final error < 0.01 (usually)\n- Network passes all test cases\n- Convergence within reasonable epochs\n\n### Troubleshooting\n- **High error**: Increase particles or epochs\n- **No convergence**: Adjust PSO parameters\n- **Compile errors**: Check FANN library installation\n\n## Next Steps\n\nNow that you can run rUv-swarm, experiment with different parameters and observe how they affect:\n1. Training speed (epochs to convergence)\n2. Final accuracy (lowest error achieved)\n3. Consistency (run multiple times)\n\nIn the practitioner level, we\'ll dive deep into the code to understand exactly how this magic happens!', video_url: 'https://example.com/videos/compiling-running' },
        // Module 6 (Practitioner)
        { id: 8, module_id: 6, title: 'FANN Library Architecture', slug: 'fann-architecture', description: 'Understanding FANN\'s design and capabilities', duration_minutes: 45, order_index: 1, content_markdown: '# FANN Library Architecture\n\n## What is FANN?\n\nThe **Fast Artificial Neural Network (FANN)** library is a free, open-source neural network library written in C. It\'s designed for:\n- **Speed**: Highly optimized C implementation\n- **Portability**: Runs on multiple platforms\n- **Simplicity**: Easy-to-use API\n- **Flexibility**: Supports various network types\n\n## Key Features\n\n### 1. Network Types\n- **Feedforward networks**: Standard multilayer perceptrons\n- **Shortcut connections**: Skip-layer connections for efficiency\n- **Fully connected**: Every neuron connected to next layer\n\n### 2. Training Algorithms\n- **Backpropagation**: Classic gradient-based learning\n- **RPROP**: Resilient backpropagation (faster)\n- **Quickprop**: Quasi-Newton method\n- **Cascade training**: Automatic network growth\n\n### 3. Activation Functions\nFANN supports 17+ activation functions:\n- Linear, Sigmoid, Sigmoid Symmetric\n- Gaussian, Elliot, Elliot Symmetric\n- Sin, Cos, Sin Symmetric, Cos Symmetric\n- And more!\n\n## Core FANN Data Structures\n\n### 1. Neural Network (`struct fann`)\n```c\nstruct fann {\n    unsigned int num_input;      // Number of input neurons\n    unsigned int num_output;     // Number of output neurons\n    unsigned int total_neurons;  // Total neurons in network\n    fann_type **weights;         // Connection weights\n    // ... many more fields\n};\n```\n\n### 2. Training Data (`struct fann_train_data`)\n```c\nstruct fann_train_data {\n    unsigned int num_data;       // Number of training patterns\n    unsigned int num_input;      // Inputs per pattern\n    unsigned int num_output;     // Outputs per pattern\n    fann_type **input;           // Input patterns\n    fann_type **output;          // Target outputs\n};\n```\n\n## Essential FANN Functions\n\n### Network Creation\n```c\n// Create standard network: layers specify neurons per layer\nstruct fann *fann_create_standard(unsigned int num_layers, ...);\n\n// Example: 2 inputs, 5 hidden, 1 output\nstruct fann *ann = fann_create_standard(3, 2, 5, 1);\n```\n\n### Network Configuration\n```c\n// Set activation function for hidden layers\nfann_set_activation_function_hidden(ann, FANN_SIGMOID);\n\n// Set activation function for output layer\nfann_set_activation_function_output(ann, FANN_SIGMOID);\n\n// Set training algorithm\nfann_set_training_algorithm(ann, FANN_TRAIN_RPROP);\n```\n\n### Training\n```c\n// Load training data from file\nstruct fann_train_data *data = fann_read_train_from_file("xor.data");\n\n// Train the network\nfann_train_on_data(ann, data, max_epochs, epochs_between_reports, desired_error);\n```\n\n### Testing/Running\n```c\n// Run network on input\nfann_type *output = fann_run(ann, input_array);\n\n// Test network on dataset\nfloat mse = fann_test_data(ann, test_data);\n```\n\n### Memory Management\n```c\n// Clean up\nfann_destroy_train_data(data);\nfann_destroy(ann);\n```\n\n## FANN Data File Format\n\nTraining data files use a simple text format:\n```\n4 2 1         // 4 patterns, 2 inputs, 1 output\n0 0           // Input pattern 1\n0             // Expected output 1\n0 1           // Input pattern 2\n1             // Expected output 2\n1 0           // Input pattern 3\n1             // Expected output 3\n1 1           // Input pattern 4\n0             // Expected output 4\n```\n\n## Why rUv-swarm Uses FANN\n\n1. **Performance**: C implementation is fast\n2. **Reliability**: Battle-tested, stable library\n3. **Flexibility**: Easy to configure networks\n4. **Integration**: Clean C API works well with PSO\n5. **Community**: Well-documented, widely used\n\n## FANN in the rUv-swarm Pipeline\n\n```\n1. PSO particle represents network weights\n2. FANN creates network with those weights\n3. FANN trains/tests network on data\n4. Error feeds back to PSO for optimization\n5. Repeat until optimal weights found\n```\n\nThis tight integration makes rUv-swarm incredibly efficient at finding optimal neural network configurations!', video_url: 'https://example.com/videos/fann-architecture' },
        // Module 7
        { id: 9, module_id: 7, title: 'Understanding fann_utils.c', slug: 'understanding-fann-utils', description: 'Deep dive into the FANN utility functions', duration_minutes: 50, order_index: 1, content_markdown: '# Understanding fann_utils.c\n\n## Overview\n\nThe `fann_utils.c` file contains wrapper functions that bridge between the PSO algorithm and the FANN library. These utilities make it easy to:\n- Create networks with PSO-optimized weights\n- Train networks using particle positions\n- Evaluate fitness for the swarm\n\n## Key Functions Analysis\n\n### 1. `create_network_from_weights()`\n\n```c\nstruct fann *create_network_from_weights(double *weights, int num_weights) {\n    // Create standard 2-3-1 network for XOR\n    struct fann *ann = fann_create_standard(3, 2, 3, 1);\n\n    // Set activation functions\n    fann_set_activation_function_hidden(ann, FANN_SIGMOID);\n    fann_set_activation_function_output(ann, FANN_SIGMOID);\n\n    // Apply weights from PSO particle\n    set_network_weights(ann, weights, num_weights);\n\n    return ann;\n}\n```\n\n**Purpose**: Convert a PSO particle position into a functional neural network.\n\n**Key insight**: This is where the magic happens - PSO positions become network weights!\n\n### 2. `set_network_weights()`\n\n```c\nvoid set_network_weights(struct fann *ann, double *weights, int num_weights) {\n    fann_connection *connections = malloc(sizeof(fann_connection) * num_weights);\n\n    // Get all connections\n    fann_get_connection_array(ann, connections);\n\n    // Set weights from particle position\n    for (int i = 0; i < num_weights; i++) {\n        connections[i].weight = (fann_type)weights[i];\n    }\n\n    // Apply back to network\n    fann_set_weight_array(ann, connections, num_weights);\n\n    free(connections);\n}\n```\n\n**Purpose**: Map particle dimensions to network connections.\n\n**Critical detail**: The order of weights matters - must match FANN\'s internal connection ordering!\n\n### 3. `train_network()`\n\n```c\ndouble train_network(double *weights, int num_weights, \n                       struct fann_train_data *train_data) {\n    // Create network from particle weights\n    struct fann *ann = create_network_from_weights(weights, num_weights);\n\n    // Test network on training data (no actual training!)\n    float mse = fann_test_data(ann, train_data);\n\n    // Convert MSE to fitness (lower error = higher fitness)\n    double fitness = 1.0 / (1.0 + mse);\n\n    fann_destroy(ann);\n    return fitness;\n}\n```\n\n**Important**: Despite the name, this function doesn\'t train - it evaluates!\n\n**Why**: PSO handles the "training" by evolving particle positions. FANN just evaluates how good those positions are.\n\n### 4. `test_network()`\n\n```c\nvoid test_network(struct fann *ann, struct fann_train_data *test_data) {\n    printf("Testing network on %d patterns:\\n", test_data->num_data);\n\n    for (int i = 0; i < test_data->num_data; i++) {\n        fann_type *output = fann_run(ann, test_data->input[i]);\n\n        printf("Input: [%.1f, %.1f] Expected: [%.1f] Got: [%.3f]\\n",\n               test_data->input[i][0], test_data->input[i][1],\n               test_data->output[i][0], output[0]);\n    }\n}\n```\n\n**Purpose**: Human-readable testing output for debugging and verification.\n\n## Weight Mapping Strategy\n\n### Network Topology: 2-3-1\n```\nInput Layer (2 neurons) → Hidden Layer (3 neurons) → Output Layer (1 neuron)\n```\n\n### Connection Count Calculation\n```\nConnections = (input_neurons × hidden_neurons) + (hidden_neurons × output_neurons)\n            = (2 × 3) + (3 × 1)\n            = 6 + 3 = 9 connections\n```\n\n### Weight Array Mapping\n```c\n// FANN internal connection order:\nweights[0] = input[0] → hidden[0]\nweights[1] = input[1] → hidden[0]\nweights[2] = input[0] → hidden[1]\nweights[3] = input[1] → hidden[1]\nweights[4] = input[0] → hidden[2]\nweights[5] = input[1] → hidden[2]\nweights[6] = hidden[0] → output[0]\nweights[7] = hidden[1] → output[0]\nweights[8] = hidden[2] → output[0]\n```\n\n## Error Handling\n\n### Memory Management\n```c\n// Always pair creation with destruction\nstruct fann *ann = create_network_from_weights(weights, num_weights);\n// ... use network ...\nfann_destroy(ann);  // Essential!\n```\n\n### Bounds Checking\n```c\nif (num_weights != EXPECTED_WEIGHTS) {\n    fprintf(stderr, "Error: Expected %d weights, got %d\\n", \n            EXPECTED_WEIGHTS, num_weights);\n    return -1;\n}\n```\n\n## Integration with PSO\n\n### Fitness Evaluation Loop\n```c\n// In PSO algorithm:\nfor (int i = 0; i < swarm_size; i++) {\n    // Each particle position represents network weights\n    double fitness = train_network(particles[i].position, \n                                     num_dimensions,\n                                     training_data);\n    particles[i].fitness = fitness;\n}\n```\n\n### Best Solution Extraction\n```c\n// After PSO converges:\nstruct fann *best_network = create_network_from_weights(\n    global_best_position, \n    num_dimensions\n);\n\n// Test the optimized network\ntest_network(best_network, test_data);\n```\n\n## Performance Considerations\n\n1. **Network Creation Overhead**: Creating/destroying networks is expensive\n2. **Memory Allocation**: Each evaluation allocates/frees memory\n3. **FANN Optimization**: FANN itself is highly optimized C code\n\n## Common Pitfalls\n\n1. **Weight Array Size**: Must match network topology exactly\n2. **Memory Leaks**: Always destroy networks after use\n3. **Thread Safety**: FANN networks are not thread-safe\n4. **Precision**: Converting between double (PSO) and fann_type\n\nThis wrapper design elegantly separates concerns - PSO handles optimization, FANN handles neural network computation!', video_url: 'https://example.com/videos/fann-utils-code' },
        // Module 8 (Architect)
        { id: 10, module_id: 8, title: 'Genetic Algorithms vs PSO', slug: 'genetic-algorithms-vs-pso', description: 'Compare evolutionary approaches to optimization', duration_minutes: 60, order_index: 1, content_markdown: '# Genetic Algorithms vs PSO\n\n## Introduction to Genetic Algorithms\n\n**Genetic Algorithms (GA)** are inspired by natural evolution and genetics. Like PSO, they\'re population-based optimization algorithms, but they use different mechanisms for finding optimal solutions.\n\n## Core Concepts\n\n### Population and Individuals\n- **Population**: Collection of candidate solutions (like PSO swarm)\n- **Individual**: Single candidate solution (like PSO particle)\n- **Chromosome**: Encoded representation of a solution\n- **Gene**: Individual component of a chromosome\n\n### Genetic Operators\n\n#### 1. Selection\nChoose parents for reproduction based on fitness:\n- **Tournament Selection**: Pick best from random subset\n- **Roulette Wheel**: Probability proportional to fitness\n- **Rank Selection**: Based on relative ranking\n\n#### 2. Crossover (Recombination)\nCombine two parents to create offspring:\n```\nParent 1: [0.5, -0.3, 0.8, 0.1, -0.2]\nParent 2: [0.1,  0.7, -0.4, 0.6,  0.9]\n\nSingle-Point Crossover at position 2:\nChild 1:  [0.5, -0.3 | -0.4, 0.6,  0.9]\nChild 2:  [0.1,  0.7 | 0.8, 0.1, -0.2]\n```\n\n#### 3. Mutation\nRandom changes to maintain diversity:\n```\nBefore: [0.5, -0.3, 0.8, 0.1, -0.2]\nAfter:  [0.5, -0.1, 0.8, 0.1, -0.2]  // Mutated gene 2\n```\n\n## GA Algorithm Structure\n\n```python\n# Initialize population\npopulation = create_random_population(pop_size)\nevaluate_fitness(population)\n\nfor generation in range(max_generations):\n    # Selection: Choose parents\n    parents = select_parents(population)\n\n    # Crossover: Create offspring\n    offspring = crossover(parents)\n\n    # Mutation: Add random changes\n    mutate(offspring)\n\n    # Replacement: Form new population\n    population = replace(population, offspring)\n\n    # Evaluation\n    evaluate_fitness(population)\n```\n\n## PSO vs GA Comparison\n\n| Aspect | PSO | Genetic Algorithm |\n|--------|-----|-------------------|\n| **Inspiration** | Bird flocking behavior | Natural evolution |\n| **Population** | Swarm of particles | Population of individuals |\n| **Information Sharing** | Global best position | Crossover between parents |\n| **Memory** | Each particle remembers personal best | No individual memory |\n| **Operators** | Velocity update | Selection, crossover, mutation |\n| **Convergence** | Continuous movement toward optima | Discrete generational improvement |\n| **Parameters** | w, c₁, c₂ | Selection pressure, crossover/mutation rates |\n\n## Detailed Comparison\n\n### 1. Search Strategy\n\n#### PSO:\n- **Continuous movement**: Particles flow through search space\n- **Social learning**: All particles know global best\n- **Exploitation focused**: Strong attraction to known good areas\n\n#### GA:\n- **Discrete generations**: Population replaced each cycle\n- **Recombination**: Mix successful solutions\n- **Exploration focused**: Mutation maintains diversity\n\n### 2. Implementation Complexity\n\n#### PSO:\n```c\n// Simple velocity update\nvelocity[i] = w * velocity[i] + \n              c1 * r1 * (pbest[i] - position[i]) + \n              c2 * r2 * (gbest[i] - position[i]);\n```\n\n#### GA:\n```c\n// Multiple operations needed\nparents = tournament_selection(population);\noffspring = single_point_crossover(parents);\ngaussian_mutation(offspring, mutation_rate);\npopulation = generational_replacement(population, offspring);\n```\n\n### 3. Performance Characteristics\n\n#### PSO Advantages:\n- **Faster convergence**: Direct movement toward good solutions\n- **Fewer parameters**: Only w, c₁, c₂ to tune\n- **Continuous optimization**: Natural for real-valued problems\n- **Simple implementation**: Straightforward algorithm\n\n#### GA Advantages:\n- **Better exploration**: Crossover creates novel combinations\n- **Escapes local optima**: Mutation provides random jumps\n- **Flexible representation**: Works with binary, real, or custom encodings\n- **Proven theory**: Extensive mathematical analysis available\n\n### 4. When to Use Each\n\n#### Choose PSO for:\n- Continuous optimization problems\n- Fast convergence requirements\n- Limited tuning time\n- Real-time applications\n\n#### Choose GA for:\n- Discrete optimization problems\n- Complex search landscapes with many local optima\n- When solution diversity is important\n- Combinatorial optimization\n\n## Hybrid Approaches\n\n### PSO-GA Hybrids\nCombine the best of both worlds:\n- Use GA crossover to create new particles\n- Apply PSO velocity updates for fine-tuning\n- Switch between GA and PSO phases\n\n### Adaptive Selection\n- Start with GA for exploration\n- Switch to PSO for exploitation\n- Monitor convergence to decide switching point\n\n## Implementation in rUv-swarm Context\n\nFor neural network weight optimization:\n\n### PSO Approach (Current):\n```c\n// Direct weight optimization\nfor (int i = 0; i < num_weights; i++) {\n    new_weights[i] = apply_pso_update(particles[p].position[i]);\n}\n```\n\n### GA Approach (Alternative):\n```c\n// Evolutionary weight optimization\nparent1 = tournament_selection(population);\nparent2 = tournament_selection(population);\nchild_weights = uniform_crossover(parent1.weights, parent2.weights);\ngaussian_mutation(child_weights, 0.1);\n```\n\n## Performance Comparison on XOR\n\nTypical results for XOR problem:\n\n| Algorithm | Avg Generations | Success Rate | Best Error |\n|-----------|-----------------|--------------|------------|\n| PSO       | 45              | 95%          | 0.001      |\n| GA        | 78              | 85%          | 0.003      |\n| PSO-GA    | 52              | 98%          | 0.0008     |\n\n## Conclusion\n\nBoth PSO and GA are powerful optimization algorithms with different strengths:\n- **PSO**: Fast, simple, great for continuous problems\n- **GA**: Robust, flexible, excellent for exploration\n- **Hybrid**: Combines advantages of both approaches\n\nThe choice depends on your specific problem characteristics and requirements. In the next lesson, we\'ll implement a simple GA to replace PSO in rUv-swarm!', video_url: 'https://example.com/videos/ga-vs-pso' },
    ],
    code_exercises: [
        { id: 1, lesson_id: 7, title: 'Compile and Run rUv-swarm', description: 'Build the rUv-swarm project and execute it with default parameters', starter_code: '// This is a simulated compilation environment\n// In real use, you would run these commands in your terminal:\n\n/*\nStep 1: Clone the repository\ngit clone https://github.com/ruv-net/ruv-swarm.git\ncd ruv-swarm\n\nStep 2: Compile the project\nmake\n\nStep 3: Run with default parameters\n./ruv-swarm\n\nYour task: Examine the output and identify the key metrics\n*/\n\n#include <stdio.h>\n\nint main() {\n    printf("rUv-swarm Simulation\\n");\n    printf("====================\\n");\n    printf("Initializing PSO with 30 particles...\\n");\n    printf("Training neural network on XOR problem...\\n");\n\n    // TODO: Add a loop to simulate training epochs\n    // Show decreasing error over time\n\n    printf("Training completed!\\n");\n    return 0;\n}', solution_code: '#include <stdio.h>\n\nint main() {\n    printf("rUv-swarm Simulation\\n");\n    printf("====================\\n");\n    printf("Initializing PSO with 30 particles...\\n");\n    printf("Loading dataset: data/xor.data\\n");\n    printf("Network topology: 2-3-1\\n");\n    printf("Training neural network on XOR problem...\\n\\n");\n\n    // Simulate training epochs with decreasing error\n    double error = 0.5;\n    for (int epoch = 1; epoch <= 50; epoch += 5) {\n        error = error * 0.8; // Simulate convergence\n        printf("Epoch %d: Best Error = %.6f\\n", epoch, error);\n    }\n\n    printf("\\nTraining completed!\\n");\n    printf("Final network accuracy: 99.98%%\\n");\n    printf("\\nKey observations:\\n");\n    printf("- Error decreased from 0.5 to %.6f\\n", error);\n    printf("- Network converged in 50 epochs\\n");\n    printf("- XOR problem successfully solved\\n");\n\n    return 0;\n}', difficulty: 1, order_index: 1, hints: '["Look for decreasing error values", "Note the epoch progression", "Observe the final accuracy metric"]' }
    ],
    quizzes: [
        { id: 1, module_id: 2, title: 'XOR Problem and Neural Networks Quiz', description: 'Test your understanding of the XOR problem and neural network fundamentals', passing_score: 75, time_limit_minutes: 30, max_attempts: 3, is_published: true }
    ],
    quiz_questions: [
        { id: 1, quiz_id: 1, question_text: 'What makes the XOR problem challenging for single-layer perceptrons?', question_type: 'multiple_choice', points: 10, order_index: 1, explanation: 'XOR is not linearly separable, requiring multiple layers to solve.' },
        { id: 2, quiz_id: 1, question_text: 'In Particle Swarm Optimization, what does "gbest" represent?', question_type: 'multiple_choice', points: 10, order_index: 2, explanation: 'Global best (gbest) is the best position found by any particle in the entire swarm.' },
        { id: 3, quiz_id: 1, question_text: 'True or False: Neural networks with only linear activation functions can solve the XOR problem.', question_type: 'true_false', points: 5, order_index: 3, explanation: 'False. Linear activation functions cannot create the non-linear decision boundary needed for XOR.' }
    ],
    quiz_answers: [
        { id: 1, question_id: 1, answer_text: 'It requires too much memory', is_correct: false, order_index: 1 },
        { id: 2, question_id: 1, answer_text: 'The data is not linearly separable', is_correct: true, order_index: 2 },
        { id: 3, question_id: 1, answer_text: 'It has too many input variables', is_correct: false, order_index: 3 },
        { id: 4, question_id: 1, answer_text: 'The training data is too small', is_correct: false, order_index: 4 },
        { id: 5, question_id: 2, answer_text: 'Global best position found by the entire swarm', is_correct: true, order_index: 1 },
        { id: 6, question_id: 2, answer_text: 'Good best position for each particle', is_correct: false, order_index: 2 },
        { id: 7, question_id: 2, answer_text: 'Gradient-based estimation technique', is_correct: false, order_index: 3 },
        { id: 8, question_id: 2, answer_text: 'Genetic algorithm best solution', is_correct: false, order_index: 4 },
        { id: 9, question_id: 3, answer_text: 'True', is_correct: false, order_index: 1 },
        { id: 10, question_id: 3, answer_text: 'False', is_correct: true, order_index: 2 }
    ],
    achievements: [
        { id: 1, name: 'First Steps', description: 'Complete your first lesson', criteria: '{"type": "lesson_completion", "count": 1}', points: 10, icon_url: '/static/icons/first-steps.png' },
        { id: 2, name: 'XOR Master', description: 'Successfully understand and explain the XOR problem', criteria: '{"type": "quiz_score", "quiz": "xor", "min_score": 90}', points: 25, icon_url: '/static/icons/xor-master.png' },
        { id: 3, name: 'Swarm Intelligence', description: 'Complete all Foundations level modules', criteria: '{"type": "course_completion", "level": "foundations"}', points: 50, icon_url: '/static/icons/swarm-intelligence.png' },
        { id: 4, name: 'Code Warrior', description: 'Successfully complete 10 code exercises', criteria: '{"type": "code_exercises", "count": 10}', points: 75, icon_url: '/static/icons/code-warrior.png' },
        { id: 5, name: 'Neural Architect', description: 'Complete the entire rUv-swarm course series', criteria: '{"type": "course_completion", "level": "architect"}', points: 200, icon_url: '/static/icons/neural-architect.png' }
    ],
    enrollments: [
        { id: 1, user_id: 3, course_id: 1, status: 'in_progress', progress_percentage: 65.50 },
        { id: 2, user_id: 4, course_id: 1, status: 'in_progress', progress_percentage: 80.00 },
        { id: 3, user_id: 4, course_id: 2, status: 'enrolled', progress_percentage: 15.25 },
        { id: 4, user_id: 5, course_id: 1, status: 'completed', progress_percentage: 100.00 },
        { id: 5, user_id: 5, course_id: 2, status: 'in_progress', progress_percentage: 45.00 },
    ],
    lesson_progress: [
        { id: 1, user_id: 3, lesson_id: 1, completed_at: '2025-07-25T10:00:00Z', progress_percentage: 100 },
        { id: 2, user_id: 3, lesson_id: 2, progress_percentage: 50 },
    ],
    user_achievements: [
        { id: 1, user_id: 3, achievement_id: 1, earned_at: '2025-07-25T10:00:00Z' },
        { id: 2, user_id: 5, achievement_id: 1, earned_at: '2025-07-20T10:00:00Z' },
        { id: 3, user_id: 5, achievement_id: 3, earned_at: '2025-07-28T12:00:00Z' },
    ]
};

// --- Interactive Components ---

// 1. Activation Function Visualizer (D3.js)
const ActivationFunctionVisualizer = () => {
    const d3Container = useRef(null);
    const [inputValue, setInputValue] = useState(1);

    const functions = {
        Sigmoid: (x) => 1 / (1 + Math.exp(-x)),
        Tanh: (x) => Math.tanh(x),
        ReLU: (x) => Math.max(0, x),
        'Leaky ReLU': (x) => Math.max(0.01 * x, x),
    };

    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);
            svg.selectAll("*").remove(); // Clear previous renders

            const margin = { top: 40, right: 30, bottom: 50, left: 50 };
            const width = 500 - margin.left - margin.right;
            const height = 350 - margin.top - margin.bottom;

            const chart = svg
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
            const y = d3.scaleLinear().domain([-1.5, 1.5]).range([height, 0]);

            chart.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).attr("color", "#9ca3af");
            chart.append("g").call(d3.axisLeft(y)).attr("color", "#9ca3af");

            // Add grid lines
            chart.append("g").attr("class", "grid").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(-height).tickFormat("")).style("stroke", "#4b5563").style("stroke-opacity", .5);
            chart.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).style("stroke", "#4b5563").style("stroke-opacity", .5);

            const colors = d3.scaleOrdinal(d3.schemeCategory10);
            const data = d3.range(-5, 5.1, 0.1);

            Object.keys(functions).forEach((name, i) => {
                chart.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", colors(i))
                    .attr("stroke-width", 2.5)
                    .attr("d", d3.line().x(d => x(d)).y(d => y(functions[name](d))));
            });

            // Input line and point
            const inputGroup = chart.append("g");
            const inputLine = inputGroup.append("line")
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", "4");

            const inputPoints = Object.keys(functions).map((name, i) =>
                inputGroup.append("circle")
                    .attr("r", 5)
                    .attr("fill", colors(i))
            );

            const updateInput = (val) => {
                inputLine.attr("x1", x(val)).attr("y1", y(-1.5)).attr("x2", x(val)).attr("y2", y(1.5));
                inputPoints.forEach((circle, i) => {
                    const name = Object.keys(functions)[i];
                    circle.attr("cx", x(val)).attr("cy", y(functions[name](val)));
                });
            };
            
            updateInput(inputValue);
        }
    }, [inputValue, functions]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
            <h3 className="text-xl font-bold text-white mb-4">Interactive Activation Functions</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-grow w-full">
                    <svg ref={d3Container} />
                </div>
                <div className="w-full md:w-64 bg-gray-800 p-4 rounded-lg">
                     <label htmlFor="inputValue" className="block mb-2 text-sm font-medium text-gray-300">Input X = {inputValue.toFixed(2)}</label>
                    <input
                        type="range"
                        min="-5"
                        max="5"
                        step="0.1"
                        value={inputValue}
                        onChange={(e) => setInputValue(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-4 space-y-2">
                        {Object.keys(functions).map((name, i) => (
                            <div key={name} className="flex justify-between items-center text-sm">
                                <span style={{ color: d3.schemeCategory10[i] }} className="font-semibold">{name}:</span>
                                <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded">{functions[name](inputValue).toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. 3D Network Topology Visualizer (Three.js)
const NetworkTopologyVisualizer = () => {
    const mountRef = useRef(null);
    const [topology, setTopology] = useState([2, 3, 1]); // Default: 2-3-1

    useEffect(() => {
        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.z = 15;

        const group = new THREE.Group();
        scene.add(group);

        // Create nodes
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nodeMaterials = [
            new THREE.MeshBasicMaterial({ color: 0x3b82f6 }), // Input
            new THREE.MeshBasicMaterial({ color: 0x16a34a }), // Hidden
            new THREE.MeshBasicMaterial({ color: 0xdc2626 }), // Output
        ];

        const layerSpacing = 7;
        const nodeSpacing = 3;
        const nodes = [];
        let maxNodesInLayer = 0;

        topology.forEach(layerSize => {
            if (layerSize > maxNodesInLayer) maxNodesInLayer = layerSize;
        });

        const totalWidth = (topology.length - 1) * layerSpacing;

        topology.forEach((layerSize, layerIndex) => {
            const layerNodes = [];
            const layerX = -totalWidth / 2 + layerIndex * layerSpacing;
            const material = nodeMaterials[layerIndex === 0 ? 0 : layerIndex === topology.length - 1 ? 2 : 1];

            for (let i = 0; i < layerSize; i++) {
                const node = new THREE.Mesh(sphereGeometry, material);
                const y = (i - (layerSize - 1) / 2) * nodeSpacing;
                node.position.set(layerX, y, 0);
                group.add(node);
                layerNodes.push(node);
            }
            nodes.push(layerNodes);
        });

        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.5 });
        for (let i = 0; i < nodes.length - 1; i++) {
            for (const startNode of nodes[i]) {
                for (const endNode of nodes[i + 1]) {
                    const points = [startNode.position, endNode.position];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial);
                    group.add(line);
                }
            }
        }

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
             if (mount) {
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(mount) mount.removeChild(renderer.domElement);
        };
    }, [topology]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
             <h3 className="text-xl font-bold text-white mb-4">Interactive Network Topology</h3>
             <div className="flex justify-center space-x-2 mb-4">
                 <button onClick={() => setTopology([2,3,1])} className={`px-3 py-1 text-sm rounded ${JSON.stringify(topology) === JSON.stringify([2,3,1]) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Standard (2-3-1)</button>
                 <button onClick={() => setTopology([4,6,6,2])} className={`px-3 py-1 text-sm rounded ${JSON.stringify(topology) === JSON.stringify([4,6,6,2]) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Deeper (4-6-6-2)</button>
                 <button onClick={() => setTopology([3,8,2])} className={`px-3 py-1 text-sm rounded ${JSON.stringify(topology) === JSON.stringify([3,8,2]) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Wider (3-8-2)</button>
             </div>
            <div ref={mountRef} style={{ width: '100%', height: '400px' }} className="rounded-md" />
            <p className="text-center text-sm text-gray-400 mt-2">Click and drag to rotate. Scroll to zoom.</p>
        </div>
    );
};

// 3. XOR Problem Visualizer (D3.js)
const XorProblemVisualizer = () => {
    const d3Container = useRef(null);
    const [transformed, setTransformed] = useState(false);

    const xorData = [
        { x: 0, y: 0, class: 0 },
        { x: 0, y: 1, class: 1 },
        { x: 1, y: 0, class: 1 },
        { x: 1, y: 1, class: 0 },
    ];
    
    // Simple non-linear transformation
    const transform = d => ({ x: d.x + d.y, y: d.x * d.y, class: d.class });

    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);
            svg.selectAll("*").remove();

            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 400 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const chart = svg
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const data = transformed ? xorData.map(transform) : xorData;
            const xDomain = d3.extent(data, d => d.x);
            const yDomain = d3.extent(data, d => d.y);
            
            const x = d3.scaleLinear().domain([xDomain[0] - 0.5, xDomain[1] + 0.5]).range([0, width]);
            const y = d3.scaleLinear().domain([yDomain[0] - 0.5, yDomain[1] + 0.5]).range([height, 0]);

            chart.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).attr("color", "#9ca3af");
            chart.append("g").call(d3.axisLeft(y)).attr("color", "#9ca3af");
            
            const color = d3.scaleOrdinal().domain([0, 1]).range(["#f97316", "#3b82f6"]);

            const circles = chart.selectAll("circle").data(data, d => `${d.x}-${d.y}`);
            
            circles.enter()
                .append("circle")
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y))
                .attr("r", 0)
                .attr("fill", d => color(d.class))
                .transition()
                .duration(500)
                .attr("r", 10);

            circles.transition()
                .duration(1000)
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y));

            // Add separating line if transformed
            if (transformed) {
                chart.append("line")
                    .attr("x1", x(0.5))
                    .attr("y1", y(yDomain[0] - 0.5))
                    .attr("x2", x(0.5))
                    .attr("y2", y(yDomain[1] + 0.5))
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"));
            }
        }
    }, [transformed]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Interactive XOR Problem</h3>
            <svg ref={d3Container} />
            <div className="mt-4">
                <button onClick={() => setTransformed(!transformed)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    {transformed ? 'Reset to Original Problem' : 'Show Hidden Layer Transformation'}
                </button>
            </div>
        </div>
    );
};


// --- React Markdown Component ---
// A simple markdown parser to render lesson content.
// In a real app, you'd use a library like 'react-markdown'.
const SimpleMarkdown = ({ content, lessonSlug }) => {
    const parts = content.split(/<div id="(.+?)"><\/div>/);
    
    return (
        <div className="prose prose-lg max-w-none text-gray-200">
            {parts.map((part, index) => {
                if (index % 2 === 1) { // This is an ID for an interactive component
                    if (part === "interactive-activation-functions") {
                        return <ActivationFunctionDemo key={index} />;
                    }
                    if (part === "interactive-network-topology") {
                        return <NetworkTopologyDemo key={index} />;
                    }
                    if (part === "interactive-xor-problem") {
                        return <XorProblemVisualizer key={index} />;
                    }
                    // New interactive components for rUv-swarm Foundations
                    if (part === "interactive-neural-network") {
                        return <InteractiveNeuralNetwork key={index} />;
                    }
                    if (part === "interactive-xor-demo") {
                        return <InteractiveXOR key={index} />;
                    }
                    if (part === "swarm-intelligence-demo") {
                        return <SwarmIntelligenceDemo key={index} />;
                    }
                    if (part === "pso-visualization") {
                        return <PSOVisualization key={index} />;
                    }
                    if (part === "advanced-pso-demo") {
                        return <AdvancedPSODemo key={index} />;
                    }
                    if (part === "ruv-swarm-simulation") {
                        return <RuvSwarmSimulation key={index} />;
                    }
                    if (part === "fann-utils-demo") {
                        return <FANNUtilsDemo key={index} />;
                    }
                    if (part === "genetic-algorithm-demo") {
                        return <GeneticAlgorithmDemo key={index} />;
                    }
                    return null;
                }

                // This is a regular text part
                return part.split('\n').map((line, lineIndex) => {
                     const key = `${index}-${lineIndex}`;
                    if (line.startsWith('# ')) {
                        return <h1 key={key} className="text-3xl font-bold text-white mb-4 mt-6 border-b border-gray-600 pb-2">{line.substring(2)}</h1>;
                    }
                    if (line.startsWith('## ')) {
                        return <h2 key={key} className="text-2xl font-semibold text-gray-100 mb-3 mt-5">{line.substring(3)}</h2>;
                    }
                    if (line.startsWith('### ')) {
                        return <h3 key={key} className="text-xl font-semibold text-gray-200 mb-2 mt-4">{line.substring(4)}</h3>;
                    }
                    if (line.startsWith('`')) {
                         const lang = line.substring(3);
                         let codeLines = [];
                         let i = lineIndex + 1;
                         // This logic is simplified and might not handle all markdown code block cases
                         return (
                             <pre key={key} className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
                                 <code className={`language-${lang} text-sm`}>{line.replace(/`/g, '')}</code>
                             </pre>
                         );
                    }
                    if (line.startsWith('- ')) {
                        return <li key={key} className="ml-6 list-disc">{line.substring(2)}</li>;
                    }
                    if (line.startsWith('|')) {
                        return null; // Simplified, tables handled by a library in a real app
                    }
                    if (line.trim() === '') {
                        return <br key={key} />;
                    }
                    if (line.includes('|---')) {
                        return null; 
                    }
                    return <p key={key} className="my-2 leading-relaxed">{line}</p>;
                });
            })}
        </div>
    );
};

// --- Context for App State ---
const AppContext = createContext();

// --- Main App Component ---
const App = () => {
    const [currentUser, setCurrentUser] = useState(courseData.users.find(u => u.role === 'student'));
    const [view, setView] = useState('dashboard'); // dashboard, course, lesson, quiz, profile
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const contextValue = {
        currentUser, setCurrentUser,
        view, setView,
        selectedCourseId, setSelectedCourseId,
        selectedLessonId, setSelectedLessonId,
        selectedQuizId, setSelectedQuizId,
    };
    
    const students = courseData.users.filter(u => u.role === 'student');

    return (
        <AppContext.Provider value={contextValue}>
            <div className="bg-gray-900 text-white min-h-screen font-sans">
                <Header userDropdownOpen={userDropdownOpen} setUserDropdownOpen={setUserDropdownOpen} students={students} />
                <main className="p-4 sm:p-6 lg:p-8">
                    <ViewManager />
                </main>
            </div>
        </AppContext.Provider>
    );
};

// --- Header Component ---
const Header = ({ userDropdownOpen, setUserDropdownOpen, students }) => {
    const { currentUser, setCurrentUser, setView } = useContext(AppContext);

    const switchUser = (userId) => {
        const user = courseData.users.find(u => u.id === userId);
        setCurrentUser(user);
        setUserDropdownOpen(false);
        setView('dashboard');
    };

    return (
        <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('dashboard')}>
                <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <h1 className="text-2xl font-bold text-white">rUv-swarm Learning</h1>
            </div>
            <div className="relative">
                <div className="flex items-center space-x-4">
                     <button onClick={() => setView('profile')} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                        <User size={20} />
                        <span>My Profile</span>
                    </button>
                    <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                        <User size={20} />
                        <span>{currentUser.firstName} {currentUser.lastName}</span>
                        <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-lg shadow-xl py-1 z-50">
                        <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-600">Switch User</div>
                        {students.map(user => (
                            <a key={user.id} href="#" onClick={(e) => { e.preventDefault(); switchUser(user.id); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600">
                                {user.firstName} {user.lastName} ({user.role})
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

// --- View Manager ---
const ViewManager = () => {
    const { view } = useContext(AppContext);

    switch (view) {
        case 'dashboard': return <CourseDashboard />;
        case 'course': return <CourseView />;
        case 'lesson': return <LessonView />;
        case 'quiz': return <QuizView />;
        case 'profile': return <ProfileView />;
        default: return <CourseDashboard />;
    }
};

// --- Course Dashboard ---
const CourseDashboard = () => {
    const { setView, setSelectedCourseId, currentUser } = useContext(AppContext);
    
    const handleCourseSelect = (id) => {
        setSelectedCourseId(id);
        setView('course');
    };

    const getCourseProgress = (courseId) => {
        const enrollment = courseData.enrollments.find(e => e.user_id === currentUser.id && e.course_id === courseId);
        return enrollment ? { status: enrollment.status, progress: enrollment.progress_percentage } : null;
    };

    return (
        <div>
            <h2 className="text-4xl font-extrabold mb-8 text-blue-300">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courseData.courses.map(course => {
                    const progress = getCourseProgress(course.id);
                    return (
                        <div key={course.id} onClick={() => handleCourseSelect(course.id)} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col">
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                                    <span className="capitalize bg-blue-900 px-2 py-1 rounded">{course.level}</span>
                                    <div className="flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        <span>{course.duration_hours} hours</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">Difficulty:</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < course.difficulty ? 'text-yellow-400' : 'text-gray-600'} fill={i < course.difficulty ? 'currentColor' : 'none'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 flex-grow">{course.description}</p>
                                {progress && (
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-sm font-semibold ${progress.status === 'completed' ? 'text-green-400' : 'text-blue-400'}`}>
                                                {progress.status === 'completed' ? 'Completed' : `In Progress: ${progress.progress}%`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress.progress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Course View ---
const CourseView = () => {
    const { selectedCourseId, setView } = useContext(AppContext);
    const course = courseData.courses.find(c => c.id === selectedCourseId);
    const modules = courseData.modules.filter(m => m.course_id === course.id).sort((a, b) => a.order_index - b.order_index);
    const instructor = courseData.users.find(u => u.id === course.instructor_id);

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => setView('dashboard')} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Courses</span>
            </button>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
                <h2 className="text-5xl font-extrabold mb-4 text-white">{course.title}</h2>
                <div className="flex items-center space-x-2 text-gray-400 mb-6">
                    <User size={16} />
                    <span>Instructor: {instructor.firstName} {instructor.lastName}</span>
                </div>
                <p className="text-lg text-gray-300 mb-6">{course.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <h4 className="font-bold text-lg text-white mb-2">Prerequisites</h4>
                        <p>{course.prerequisites}</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <h4 className="font-bold text-lg text-white mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {course.learning_objectives.split('\n').map((obj, i) => obj.trim() && <li key={i}>{obj.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-6 text-blue-300">Course Content</h3>
            <div className="space-y-4">
                {modules.map(module => <ModuleItem key={module.id} module={module} />)}
            </div>
        </div>
    );
};

const ModuleItem = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { setView, setSelectedLessonId, setSelectedQuizId, currentUser } = useContext(AppContext);
    const lessons = courseData.lessons.filter(l => l.module_id === module.id).sort((a, b) => a.order_index - b.order_index);
    const quizzes = courseData.quizzes.filter(q => q.module_id === module.id);

    const handleLessonClick = (id) => {
        setSelectedLessonId(id);
        setView('lesson');
    };
    
    const handleQuizClick = (id) => {
        setSelectedQuizId(id);
        setView('quiz');
    };

    const getLessonStatus = (lessonId) => {
        const progress = courseData.lesson_progress.find(lp => lp.user_id === currentUser.id && lp.lesson_id === lessonId);
        if (!progress) return 'not_started';
        if (progress.progress_percentage === 100) return 'completed';
        return 'in_progress';
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 text-left">
                <div className="flex items-center">
                    <BookOpen className="mr-4 text-blue-400" size={24} />
                    <div>
                        <h4 className="text-xl font-bold text-white">{module.title}</h4>
                        <p className="text-gray-400">{module.description}</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {isOpen && (
                <div className="p-5 border-t border-gray-700">
                    <ul className="space-y-3">
                        {lessons.map(lesson => {
                            const status = getLessonStatus(lesson.id);
                            return (
                                <li key={lesson.id} onClick={() => handleLessonClick(lesson.id)} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                                    <div className="flex items-center">
                                        {status === 'completed' && <CheckCircle size={20} className="mr-3 text-green-500" />}
                                        {status === 'in_progress' && <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 border-2 border-blue-300"></div>}
                                        {status === 'not_started' && <div className="w-5 h-5 mr-3 rounded-full border-2 border-gray-500"></div>}
                                        <span className="text-gray-200">{lesson.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{lesson.duration_minutes} min</span>
                                </li>
                            );
                        })}
                        {quizzes.map(quiz => (
                             <li key={quiz.id} onClick={() => handleQuizClick(quiz.id)} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                                <div className="flex items-center">
                                    <Award size={20} className="mr-3 text-yellow-500" />
                                    <span className="text-gray-200 font-semibold">{quiz.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">{quiz.time_limit_minutes} min</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Lesson View ---
const LessonView = () => {
    const { selectedLessonId, setView, setSelectedLessonId, setSelectedCourseId } = useContext(AppContext);
    const lesson = courseData.lessons.find(l => l.id === selectedLessonId);
    const module = courseData.modules.find(m => m.id === lesson.module_id);
    const course = courseData.courses.find(c => c.id === module.course_id);
    const exercises = courseData.code_exercises.filter(e => e.lesson_id === lesson.id);
    const allLessonsInModule = courseData.lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index);
    const currentIndex = allLessonsInModule.findIndex(l => l.id === lesson.id);

    const goToCourseView = () => {
        setSelectedCourseId(course.id);
        setView('course');
    };
    
    const goToLesson = (lessonId) => {
        setSelectedLessonId(lessonId);
    };

    return (
        <div>
            <div className="mb-6 text-sm text-gray-400">
                <span className="cursor-pointer hover:underline" onClick={goToCourseView}>{course.title}</span>
                <span className="mx-2">/</span>
                <span>{module.title}</span>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-4xl font-extrabold mb-2 text-white">{lesson.title}</h2>
                <p className="text-gray-400 mb-6">{lesson.description}</p>
                <div className="border-t border-gray-700 pt-6">
                    <SimpleMarkdown content={lesson.content_markdown} lessonSlug={lesson.slug} />
                </div>
                {exercises.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-4 text-blue-300">Code Exercises</h3>
                        {exercises.map(ex => <CodeExercise key={ex.id} exercise={ex} />)}
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-8">
                {currentIndex > 0 ? (
                    <button onClick={() => goToLesson(allLessonsInModule[currentIndex - 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Previous Lesson
                    </button>
                ) : <div></div>}
                {currentIndex < allLessonsInModule.length - 1 ? (
                    <button onClick={() => goToLesson(allLessonsInModule[currentIndex + 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Next Lesson
                    </button>
                ) : <div></div>}
            </div>
        </div>
    );
};

// --- Code Exercise Component ---
const CodeExercise = ({ exercise }) => {
    const [code, setCode] = useState(exercise.starter_code);
    const [output, setOutput] = useState('');
    const [showSolution, setShowSolution] = useState(false);

    const handleRun = () => {
        // Simulate running the code
        setOutput(exercise.solution_code.split('// Simulate training epochs with decreasing error')[1] || "Simulated execution...");
    };
    
    const handleShowSolution = () => {
        setCode(exercise.solution_code);
        setShowSolution(true);
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-bold mb-2 text-white">{exercise.title}</h4>
            <p className="text-gray-400 mb-4">{exercise.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-gray-300">Your Code</h5>
                    <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-64 bg-black text-white p-4 rounded-md font-mono text-sm border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-gray-300">Output</h5>
                    <pre className="w-full h-64 bg-black text-white p-4 rounded-md font-mono text-sm border border-gray-700 overflow-auto">{output}</pre>
                </div>
            </div>
            <div className="mt-4 flex space-x-4">
                <button onClick={handleRun} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Run Code</button>
                <button onClick={handleShowSolution} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Show Solution</button>
            </div>
        </div>
    );
};

// --- Quiz View ---
const QuizView = () => {
    const { selectedQuizId, setView, setSelectedCourseId, currentUser } = useContext(AppContext);
    const quiz = courseData.quizzes.find(q => q.id === selectedQuizId);
    const questions = courseData.quiz_questions.filter(q => q.quiz_id === quiz.id).sort((a, b) => a.order_index - b.order_index);
    const module = courseData.modules.find(m => m.id === quiz.module_id);
    const course = courseData.courses.find(c => c.id === module.course_id);

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        let totalPoints = 0;
        questions.forEach(q => {
            totalPoints += q.points;
            const correctAnswer = courseData.quiz_answers.find(a => a.question_id === q.id && a.is_correct);
            if (answers[q.id] === correctAnswer.id) {
                correctAnswers += q.points;
            }
        });
        setScore(Math.round((correctAnswers / totalPoints) * 100));
        setSubmitted(true);
    };

    const goToCourseView = () => {
        setSelectedCourseId(course.id);
        setView('course');
    };

    if (submitted) {
        return <QuizResult quiz={quiz} questions={questions} answers={answers} score={score} onRetake={() => { setSubmitted(false); setAnswers({}); setScore(0); }} onBack={goToCourseView} />;
    }

    return (
        <div className="max-w-3xl mx-auto">
             <button onClick={goToCourseView} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Course</span>
            </button>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">{quiz.title}</h2>
                <p className="text-gray-400 mb-6">{quiz.description}</p>
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="border-t border-gray-700 pt-6">
                            <p className="font-semibold text-lg mb-4 text-gray-200">{index + 1}. {q.question_text}</p>
                            <div className="space-y-3">
                                {courseData.quiz_answers.filter(a => a.question_id === q.id).sort((a,b) => a.order_index - b.order_index).map(ans => (
                                    <label key={ans.id} className="flex items-center p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                                        <input type="radio" name={`q-${q.id}`} value={ans.id} onChange={() => handleAnswerChange(q.id, ans.id)} className="mr-4 w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                                        <span>{ans.answer_text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmit} className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors">
                    Submit Answers
                </button>
            </div>
        </div>
    );
};

const QuizResult = ({ quiz, questions, answers, score, onRetake, onBack }) => {
    const passed = score >= quiz.passing_score;
    return (
        <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Quiz Results</h2>
                <p className="text-5xl font-extrabold my-6" style={{ color: passed ? '#4ade80' : '#f87171' }}>{score}%</p>
                <p className={`text-2xl font-semibold mb-6 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                    {passed ? 'Congratulations, you passed!' : 'You did not pass. Keep studying!'}
                </p>
                <div className="my-8">
                    {questions.map(q => {
                        const userAnswerId = answers[q.id];
                        const correctAnswer = courseData.quiz_answers.find(a => a.question_id === q.id && a.is_correct);
                        const isCorrect = userAnswerId === correctAnswer.id;
                        return (
                            <div key={q.id} className="text-left p-4 mb-4 bg-gray-900 rounded-lg">
                                <p className="font-semibold text-gray-200">{q.question_text}</p>
                                <div className={`flex items-center mt-2 p-2 rounded ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                    {isCorrect ? <CheckCircle className="text-green-500 mr-2" /> : <XCircle className="text-red-500 mr-2" />}
                                    <p>Your answer: {courseData.quiz_answers.find(a => a.id === userAnswerId)?.answer_text || 'Not answered'}</p>
                                </div>
                                {!isCorrect && (
                                    <div className="flex items-center mt-2 p-2 rounded bg-green-900/50">
                                        <CheckCircle className="text-green-500 mr-2" />
                                        <p>Correct answer: {correctAnswer.answer_text}</p>
                                    </div>
                                )}
                                <p className="text-sm text-gray-400 mt-2 italic">{q.explanation}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center space-x-4">
                    <button onClick={onRetake} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">Retake Quiz</button>
                    <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Back to Course</button>
                </div>
            </div>
        </div>
    );
};

// --- Profile View ---
const ProfileView = () => {
    const { currentUser, setView } = useContext(AppContext);
    const userEnrollments = courseData.enrollments.filter(e => e.user_id === currentUser.id);
    const userAchievements = courseData.user_achievements.filter(ua => ua.user_id === currentUser.id);

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('dashboard')} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
            </button>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8 flex items-center space-x-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold">
                    {currentUser.firstName[0]}{currentUser.lastName[0]}
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-white">{currentUser.firstName} {currentUser.lastName}</h2>
                    <p className="text-blue-300">{currentUser.email}</p>
                    <p className="text-gray-400 mt-2">{currentUser.bio}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4 text-blue-300">My Courses</h3>
                    <div className="space-y-4">
                        {userEnrollments.map(enrollment => {
                            const course = courseData.courses.find(c => c.id === enrollment.course_id);
                            return (
                                <div key={enrollment.id} className="bg-gray-900 p-4 rounded-lg">
                                    <h4 className="font-bold text-lg text-white">{course.title}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`capitalize text-sm px-2 py-1 rounded ${enrollment.status === 'completed' ? 'bg-green-800 text-green-300' : 'bg-blue-800 text-blue-300'}`}>{enrollment.status.replace('_', ' ')}</span>
                                        <span className="font-semibold text-gray-300">{enrollment.progress_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${enrollment.progress_percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4 text-yellow-300">My Achievements</h3>
                    <div className="space-y-3">
                        {userAchievements.map(userAch => {
                            const achievement = courseData.achievements.find(a => a.id === userAch.achievement_id);
                            return (
                                <div key={userAch.id} className="flex items-center bg-gray-900 p-3 rounded-lg">
                                    <Award size={24} className="text-yellow-400 mr-4" />
                                    <div>
                                        <h4 className="font-bold text-white">{achievement.name}</h4>
                                        <p className="text-sm text-gray-400">{achievement.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                         {userAchievements.length === 0 && <p className="text-gray-400">No achievements yet. Keep learning!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;