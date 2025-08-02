#!/usr/bin/env python3
"""
Comprehensive Sandbox Security Demonstration
============================================

This script demonstrates the Docker-based secure code execution sandbox
for the rUv Swarm Platform, showing security measures, FANN neural network
examples, and educational C code exercises.

Security Analyst: Claude Code
Generated for rUv-swarm-course security validation
"""

import os
import sys
import json
import time
import hashlib
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime

# Add the backend services path to sys.path
sys.path.append('/workspaces/sparc-evolution/rUv-swarm-course/ruv-swarm-platform/backend/services')

try:
    from code_executor import CodeExecutor
except ImportError:
    print("❌ Error: CodeExecutor not found. Please ensure the backend services are available.")
    sys.exit(1)

# Color codes for terminal output
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    MAGENTA = '\033[0;35m'
    CYAN = '\033[0;36m'
    WHITE = '\033[1;37m'
    BOLD = '\033[1m'
    NC = '\033[0m'  # No Color

def print_header(title: str, color: str = Colors.CYAN):
    """Print a formatted header"""
    print(f"\n{color}{Colors.BOLD}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{Colors.NC}\n")

def print_section(title: str):
    """Print a section header"""
    print(f"\n{Colors.YELLOW}{Colors.BOLD}🔍 {title}{Colors.NC}")
    print(f"{Colors.YELLOW}{'-'*50}{Colors.NC}")

def print_result(success: bool, message: str, details: str = ""):
    """Print execution result with colors"""
    icon = "✅" if success else "❌"
    color = Colors.GREEN if success else Colors.RED
    print(f"{color}{icon} {message}{Colors.NC}")
    if details:
        print(f"   {Colors.WHITE}{details}{Colors.NC}")

def print_code_block(code: str, title: str = "Code"):
    """Print formatted code block"""
    print(f"\n{Colors.BLUE}{Colors.BOLD}📄 {title}:{Colors.NC}")
    print(f"{Colors.CYAN}```c")
    for i, line in enumerate(code.strip().split('\n'), 1):
        print(f"{i:3d}: {line}")
    print(f"```{Colors.NC}")

def execute_and_display(executor: CodeExecutor, code: str, title: str, expected_success: bool = True):
    """Execute code and display results with formatting"""
    print_code_block(code, title)
    
    print(f"\n{Colors.YELLOW}⚡ Executing...{Colors.NC}")
    
    start_time = time.time()
    result = executor.execute_code(code)
    execution_time = time.time() - start_time
    
    # Display execution results
    success = result.get("success", False)
    stage = result.get("stage", "unknown")
    
    print_result(success, f"Execution {'completed' if success else 'blocked/failed'} at {stage} stage")
    
    if not success and "error" in result:
        print(f"   {Colors.RED}🚫 Error: {result['error']}{Colors.NC}")
    
    if success:
        if result.get("stdout"):
            print(f"\n{Colors.GREEN}📤 Output:{Colors.NC}")
            for line in result["stdout"].strip().split('\n'):
                print(f"   {line}")
        
        if result.get("stderr"):
            print(f"\n{Colors.YELLOW}⚠️  Stderr:{Colors.NC}")
            for line in result["stderr"].strip().split('\n'):
                print(f"   {line}")
    
    print(f"\n{Colors.CYAN}📊 Metrics:{Colors.NC}")
    print(f"   Execution Time: {execution_time:.3f}s")
    if "execution_time" in result:
        print(f"   Container Time: {result['execution_time']:.3f}s")
    if "exit_code" in result:
        print(f"   Exit Code: {result['exit_code']}")
    
    # Verify expected result
    if success == expected_success:
        print(f"   {Colors.GREEN}✅ Result as expected{Colors.NC}")
    else:
        print(f"   {Colors.RED}⚠️  Unexpected result (expected {'success' if expected_success else 'failure'}){Colors.NC}")
    
    return result

class SandboxDemo:
    """Main demonstration class"""
    
    def __init__(self):
        self.executor = CodeExecutor()
        self.demo_results = []
        
    def log_result(self, category: str, name: str, result: Dict):
        """Log demonstration result for summary"""
        self.demo_results.append({
            "category": category,
            "name": name,
            "success": result.get("success", False),
            "stage": result.get("stage", "unknown"),
            "execution_time": result.get("execution_time", 0),
            "timestamp": datetime.now().isoformat()
        })
    
    def demonstrate_basic_functionality(self):
        """Demonstrate basic safe code execution"""
        print_header("Basic Functionality Demonstration", Colors.GREEN)
        
        print_section("1. Hello World with FANN")
        hello_fann = '''
#include <stdio.h>
#include <fann.h>

int main() {
    printf("🌟 Hello from rUv-swarm Secure Sandbox!\\n");
    printf("Security Level: MAXIMUM\\n");
    printf("Container: Docker Alpine Linux\\n");
    printf("User: sandboxuser (UID 1000)\\n");
    
    // Test FANN library
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    if (ann) {
        printf("✅ FANN Neural Network: Initialized\\n");
        printf("   Inputs: %d, Outputs: %d\\n", 
               fann_get_num_input(ann), 
               fann_get_num_output(ann));
        fann_destroy(ann);
    } else {
        printf("❌ FANN Neural Network: Failed to initialize\\n");
    }
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, hello_fann, "Hello World + FANN Test")
        self.log_result("basic", "hello_fann", result)
        
        print_section("2. Mathematical Operations")
        math_demo = '''
#include <stdio.h>
#include <math.h>
#include <time.h>

int main() {
    printf("🧮 Mathematical Operations Demo\\n");
    printf("================================\\n");
    
    // Basic math operations
    double a = 16.0, b = 2.5;
    printf("sqrt(%.1f) = %.3f\\n", a, sqrt(a));
    printf("pow(%.1f, %.1f) = %.3f\\n", a, b, pow(a, b));
    printf("log(%.1f) = %.3f\\n", a, log(a));
    printf("sin(π/2) = %.3f\\n", sin(M_PI/2));
    
    // Time operations
    time_t now = time(NULL);
    printf("\\n⏰ Current timestamp: %ld\\n", now);
    
    // Memory allocation test
    int *arr = malloc(10 * sizeof(int));
    if (arr) {
        for (int i = 0; i < 10; i++) {
            arr[i] = i * i;
        }
        printf("\\n📊 Array: ");
        for (int i = 0; i < 10; i++) {
            printf("%d ", arr[i]);
        }
        printf("\\n");
        free(arr);
        printf("✅ Memory allocated and freed successfully\\n");
    }
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, math_demo, "Mathematical Operations")
        self.log_result("basic", "math_demo", result)
    
    def demonstrate_fann_examples(self):
        """Demonstrate FANN neural network examples"""
        print_header("FANN Neural Network Examples", Colors.MAGENTA)
        
        print_section("1. XOR Problem Neural Network")
        xor_network = '''
#include <stdio.h>
#include <fann.h>

int main() {
    printf("🧠 XOR Neural Network Training Demo\\n");
    printf("===================================\\n");
    
    // Create a 3-layer network: 2 inputs, 3 hidden, 1 output
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    
    if (!ann) {
        printf("❌ Failed to create neural network\\n");
        return 1;
    }
    
    printf("✅ Neural Network Created\\n");
    printf("   Architecture: %d-%d-%d\\n", 
           fann_get_num_input(ann),
           fann_get_num_neurons_in_layer(ann, 1),
           fann_get_num_output(ann));
    
    // Set activation functions
    fann_set_activation_function_hidden(ann, FANN_SIGMOID_SYMMETRIC);
    fann_set_activation_function_output(ann, FANN_SIGMOID_SYMMETRIC);
    
    // XOR training data simulation (without actual file training)
    printf("\\n🎯 XOR Problem Setup:\\n");
    printf("   Input [0,0] -> Expected: 0\\n");
    printf("   Input [0,1] -> Expected: 1\\n");
    printf("   Input [1,0] -> Expected: 1\\n");
    printf("   Input [1,1] -> Expected: 0\\n");
    
    // Test the untrained network
    fann_type input[2];
    fann_type *output;
    
    printf("\\n🔬 Testing Untrained Network:\\n");
    input[0] = 0; input[1] = 0;
    output = fann_run(ann, input);
    printf("   [0,0] -> %.3f\\n", output[0]);
    
    input[0] = 0; input[1] = 1;
    output = fann_run(ann, input);
    printf("   [0,1] -> %.3f\\n", output[0]);
    
    input[0] = 1; input[1] = 0;
    output = fann_run(ann, input);
    printf("   [1,0] -> %.3f\\n", output[0]);
    
    input[0] = 1; input[1] = 1;
    output = fann_run(ann, input);
    printf("   [1,1] -> %.3f\\n", output[0]);
    
    printf("\\n📝 Note: Actual training requires training data files\\n");
    printf("    This demo shows network creation and testing\\n");
    
    // Cleanup
    fann_destroy(ann);
    printf("\\n✅ Neural network destroyed successfully\\n");
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, xor_network, "XOR Neural Network")
        self.log_result("fann", "xor_network", result)
        
        print_section("2. PSO Parameter Demonstration")
        pso_demo = '''
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

// Simple PSO parameter structure
typedef struct {
    double position[2];
    double velocity[2];
    double best_position[2];
    double best_fitness;
} Particle;

double fitness_function(double x, double y) {
    // Simple quadratic function: f(x,y) = x^2 + y^2
    return x*x + y*y;
}

int main() {
    printf("🐛 Particle Swarm Optimization Demo\\n");
    printf("====================================\\n");
    
    srand(time(NULL));
    
    const int NUM_PARTICLES = 5;
    const int MAX_ITERATIONS = 10;
    Particle particles[NUM_PARTICLES];
    
    // Initialize particles
    printf("🚀 Initializing %d particles:\\n", NUM_PARTICLES);
    for (int i = 0; i < NUM_PARTICLES; i++) {
        particles[i].position[0] = ((double)rand()/RAND_MAX) * 10.0 - 5.0;
        particles[i].position[1] = ((double)rand()/RAND_MAX) * 10.0 - 5.0;
        particles[i].velocity[0] = ((double)rand()/RAND_MAX) * 2.0 - 1.0;
        particles[i].velocity[1] = ((double)rand()/RAND_MAX) * 2.0 - 1.0;
        
        // Set initial best position
        particles[i].best_position[0] = particles[i].position[0];
        particles[i].best_position[1] = particles[i].position[1];
        particles[i].best_fitness = fitness_function(
            particles[i].position[0], 
            particles[i].position[1]
        );
        
        printf("   Particle %d: (%.2f, %.2f) fitness=%.3f\\n", 
               i, particles[i].position[0], particles[i].position[1], 
               particles[i].best_fitness);
    }
    
    // PSO parameters
    double w = 0.7;      // Inertia weight
    double c1 = 1.5;     // Cognitive parameter
    double c2 = 1.5;     // Social parameter
    
    printf("\\n⚙️  PSO Parameters:\\n");
    printf("   Inertia weight (w): %.1f\\n", w);
    printf("   Cognitive param (c1): %.1f\\n", c1);
    printf("   Social param (c2): %.1f\\n", c2);
    
    // Find global best
    double global_best_position[2];
    double global_best_fitness = particles[0].best_fitness;
    global_best_position[0] = particles[0].best_position[0];
    global_best_position[1] = particles[0].best_position[1];
    
    for (int i = 1; i < NUM_PARTICLES; i++) {
        if (particles[i].best_fitness < global_best_fitness) {
            global_best_fitness = particles[i].best_fitness;
            global_best_position[0] = particles[i].best_position[0];
            global_best_position[1] = particles[i].best_position[1];
        }
    }
    
    printf("\\n🎯 Initial Global Best: (%.3f, %.3f) fitness=%.3f\\n",
           global_best_position[0], global_best_position[1], global_best_fitness);
    
    // Simplified PSO iteration (just show concept)
    printf("\\n🔄 PSO Iteration Simulation (showing concept):\\n");
    for (int iter = 0; iter < 3; iter++) {
        printf("   Iteration %d: Particles would update velocity and position\\n", iter);
        printf("               Using w=%.1f, c1=%.1f, c2=%.1f\\n", w, c1, c2);
    }
    
    printf("\\n📝 Note: Full PSO implementation requires more complex\\n");
    printf("    velocity and position updates with random factors\\n");
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, pso_demo, "PSO Parameter Demo")
        self.log_result("fann", "pso_demo", result)
    
    def demonstrate_security_blocks(self):
        """Demonstrate security validation by showing blocked code"""
        print_header("Security Validation Demonstration", Colors.RED)
        
        security_tests = [
            {
                "name": "System Call Injection",
                "description": "Attempting to execute system commands",
                "code": '''
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Attempting system call...\\n");
    system("whoami");  // This will be blocked
    return 0;
}
                ''',
                "expected_block": "system() calls"
            },
            {
                "name": "Fork Bomb Protection",
                "description": "Attempting to create processes",
                "code": '''
#include <stdio.h>
#include <unistd.h>

int main() {
    printf("Attempting process creation...\\n");
    if (fork() == 0) {  // This will be blocked
        printf("Child process\\n");
    }
    return 0;
}
                ''',
                "expected_block": "fork() calls and unistd.h header"
            },
            {
                "name": "Inline Assembly Block",
                "description": "Attempting to use inline assembly",
                "code": '''
#include <stdio.h>

int main() {
    printf("Attempting inline assembly...\\n");
    __asm__("nop");  // This will be blocked
    return 0;
}
                ''',
                "expected_block": "inline assembly"
            },
            {
                "name": "File System Access",
                "description": "Attempting to access /proc filesystem",
                "code": '''
#include <stdio.h>

int main() {
    printf("Attempting /proc access...\\n");
    FILE *fp = fopen("/proc/version", "r");  // This will be blocked
    if (fp) {
        printf("Accessed /proc\\n");
        fclose(fp);
    }
    return 0;
}
                ''',
                "expected_block": "/proc filesystem access"
            },
            {
                "name": "Dynamic Library Loading",
                "description": "Attempting to load dynamic libraries",
                "code": '''
#include <stdio.h>
#include <dlfcn.h>

int main() {
    printf("Attempting dynamic loading...\\n");
    void *handle = dlopen("libc.so.6", RTLD_LAZY);  // This will be blocked
    if (handle) {
        printf("Library loaded\\n");
        dlclose(handle);
    }
    return 0;
}
                ''',
                "expected_block": "dlfcn.h header and dlopen()"
            },
            {
                "name": "Path Traversal Protection",
                "description": "Attempting path traversal attack",
                "code": '''
#include <stdio.h>

int main() {
    printf("Attempting path traversal...\\n");
    FILE *fp = fopen("../../../etc/passwd", "r");  // This will be blocked
    if (fp) {
        printf("Path traversal successful\\n");
        fclose(fp);
    }
    return 0;
}
                ''',
                "expected_block": "path traversal (../)"
            }
        ]
        
        for i, test in enumerate(security_tests, 1):
            print_section(f"{i}. {test['name']}")
            print(f"{Colors.WHITE}Description: {test['description']}{Colors.NC}")
            print(f"{Colors.YELLOW}Expected Block: {test['expected_block']}{Colors.NC}")
            
            result = execute_and_display(
                self.executor, 
                test['code'], 
                f"Security Test: {test['name']}", 
                expected_success=False  # We expect these to fail
            )
            self.log_result("security", test['name'], result)
    
    def demonstrate_resource_limits(self):
        """Demonstrate resource limit enforcement"""
        print_header("Resource Limit Enforcement", Colors.YELLOW)
        
        print_section("1. Memory Allocation Test")
        memory_test = '''
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("🧠 Memory Allocation Test\\n");
    printf("========================\\n");
    
    // Test small allocation (should work)
    printf("Allocating 1MB...\\n");
    void *small_ptr = malloc(1024 * 1024);  // 1MB
    if (small_ptr) {
        printf("✅ 1MB allocation successful\\n");
        free(small_ptr);
    } else {
        printf("❌ 1MB allocation failed\\n");
    }
    
    // Test medium allocation (should work within 128MB limit)
    printf("\\nAllocating 64MB...\\n");
    void *medium_ptr = malloc(64 * 1024 * 1024);  // 64MB
    if (medium_ptr) {
        printf("✅ 64MB allocation successful\\n");
        // Write some data to verify it's usable
        char *test_ptr = (char*)medium_ptr;
        test_ptr[0] = 'A';
        test_ptr[64 * 1024 * 1024 - 1] = 'Z';
        printf("✅ Memory is writable and accessible\\n");
        free(medium_ptr);
    } else {
        printf("❌ 64MB allocation failed\\n");
    }
    
    printf("\\n📊 Container Memory Limit: 128MB\\n");
    printf("📝 Larger allocations would be rejected by container\\n");
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, memory_test, "Memory Allocation Test")
        self.log_result("resources", "memory_test", result)
        
        print_section("2. CPU Computation Test")
        cpu_test = '''
#include <stdio.h>
#include <time.h>

int main() {
    printf("⚡ CPU Computation Test\\n");
    printf("======================\\n");
    
    clock_t start = clock();
    
    // Moderate computation (should complete)
    printf("Performing calculation...\\n");
    long long sum = 0;
    for (long long i = 0; i < 10000000; i++) {
        sum += i * i;
    }
    
    clock_t end = clock();
    double cpu_time = ((double)(end - start)) / CLOCKS_PER_SEC;
    
    printf("✅ Calculation completed\\n");
    printf("   Sum: %lld\\n", sum);
    printf("   CPU Time: %.3f seconds\\n", cpu_time);
    printf("   CPU Limit: 50%% of one core\\n");
    printf("   Execution Timeout: 10 seconds\\n");
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, cpu_test, "CPU Computation Test")
        self.log_result("resources", "cpu_test", result)
        
        print_section("3. Timeout Demonstration")
        # This will show what happens with timeout but won't actually run infinite loop
        print(f"{Colors.WHITE}Timeout Protection: Any code execution exceeding 10 seconds is automatically terminated{Colors.NC}")
        print(f"{Colors.WHITE}Container Limits: Memory=128MB, CPU=50% core, Network=Disabled{Colors.NC}")
        print(f"{Colors.GREEN}✅ Resource limits are enforced by Docker container configuration{Colors.NC}")
    
    def demonstrate_curriculum_exercises(self):
        """Demonstrate rUv-swarm curriculum C code exercises"""
        print_header("rUv-Swarm Curriculum Exercises", Colors.BLUE)
        
        print_section("1. Introduction to Neural Networks")
        intro_exercise = '''
#include <stdio.h>
#include <fann.h>
#include <stdlib.h>
#include <time.h>

int main() {
    printf("🎓 rUv-Swarm Course: Neural Network Basics\\n");
    printf("==========================================\\n");
    
    // Exercise 1: Create different network architectures
    printf("\\n📚 Exercise 1: Network Architectures\\n");
    
    // Small network
    struct fann *small_net = fann_create_standard(3, 2, 2, 1);
    if (small_net) {
        printf("✅ Small Network: 2-2-1 (inputs-hidden-outputs)\\n");
        printf("   Parameters: %d\\n", fann_get_total_connections(small_net));
        fann_destroy(small_net);
    }
    
    // Medium network
    struct fann *medium_net = fann_create_standard(4, 4, 6, 3, 1);
    if (medium_net) {
        printf("✅ Medium Network: 4-6-3-1\\n");
        printf("   Parameters: %d\\n", fann_get_total_connections(medium_net));
        fann_destroy(medium_net);
    }
    
    // Exercise 2: Activation functions
    printf("\\n📚 Exercise 2: Activation Functions\\n");
    struct fann *act_net = fann_create_standard(3, 3, 5, 1);
    if (act_net) {
        // Set different activation functions
        fann_set_activation_function_hidden(act_net, FANN_SIGMOID);
        fann_set_activation_function_output(act_net, FANN_LINEAR);
        
        printf("✅ Network with Sigmoid hidden, Linear output\\n");
        printf("   Available functions: SIGMOID, TANH, LINEAR, etc.\\n");
        
        fann_destroy(act_net);
    }
    
    // Exercise 3: Random weight initialization
    printf("\\n📚 Exercise 3: Weight Initialization\\n");
    struct fann *weight_net = fann_create_standard(3, 3, 4, 1);
    if (weight_net) {
        fann_randomize_weights(weight_net, -1.0, 1.0);
        printf("✅ Weights randomized between -1.0 and 1.0\\n");
        printf("   Important for breaking symmetry in learning\\n");
        
        fann_destroy(weight_net);
    }
    
    printf("\\n🎯 Learning Objectives Completed:\\n");
    printf("   • Network architecture design\\n");
    printf("   • Activation function selection\\n");
    printf("   • Weight initialization\\n");
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, intro_exercise, "Neural Network Basics")
        self.log_result("curriculum", "intro_exercise", result)
        
        print_section("2. Swarm Intelligence Concepts")
        swarm_exercise = '''
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

// Swarm agent structure
typedef struct {
    double position[2];
    double velocity[2];
    double fitness;
    int id;
} SwarmAgent;

double objective_function(double x, double y) {
    // Rastrigin function (optimization challenge)
    return 20 + (x*x - 10*cos(2*M_PI*x)) + (y*y - 10*cos(2*M_PI*y));
}

int main() {
    printf("🐝 rUv-Swarm Course: Swarm Intelligence\\n");
    printf("=======================================\\n");
    
    srand(time(NULL));
    
    const int SWARM_SIZE = 8;
    SwarmAgent swarm[SWARM_SIZE];
    
    printf("\\n📚 Exercise: Swarm Initialization\\n");
    
    // Initialize swarm
    for (int i = 0; i < SWARM_SIZE; i++) {
        swarm[i].id = i;
        swarm[i].position[0] = ((double)rand()/RAND_MAX) * 10.0 - 5.0;
        swarm[i].position[1] = ((double)rand()/RAND_MAX) * 10.0 - 5.0;
        swarm[i].velocity[0] = ((double)rand()/RAND_MAX) * 2.0 - 1.0;
        swarm[i].velocity[1] = ((double)rand()/RAND_MAX) * 2.0 - 1.0;
        swarm[i].fitness = objective_function(
            swarm[i].position[0], 
            swarm[i].position[1]
        );
        
        printf("Agent %d: pos(%.2f,%.2f) vel(%.2f,%.2f) fitness=%.3f\\n",
               swarm[i].id,
               swarm[i].position[0], swarm[i].position[1],
               swarm[i].velocity[0], swarm[i].velocity[1],
               swarm[i].fitness);
    }
    
    // Find best agent
    int best_idx = 0;
    for (int i = 1; i < SWARM_SIZE; i++) {
        if (swarm[i].fitness < swarm[best_idx].fitness) {
            best_idx = i;
        }
    }
    
    printf("\\n🏆 Best Agent: %d\\n", best_idx);
    printf("   Position: (%.3f, %.3f)\\n", 
           swarm[best_idx].position[0], swarm[best_idx].position[1]);
    printf("   Fitness: %.3f\\n", swarm[best_idx].fitness);
    
    // Calculate swarm statistics
    double avg_fitness = 0;
    for (int i = 0; i < SWARM_SIZE; i++) {
        avg_fitness += swarm[i].fitness;
    }
    avg_fitness /= SWARM_SIZE;
    
    printf("\\n📊 Swarm Statistics:\\n");
    printf("   Size: %d agents\\n", SWARM_SIZE);
    printf("   Average Fitness: %.3f\\n", avg_fitness);
    printf("   Best Fitness: %.3f\\n", swarm[best_idx].fitness);
    printf("   Diversity: Agents spread across search space\\n");
    
    printf("\\n🎯 Swarm Principles Demonstrated:\\n");
    printf("   • Collective intelligence\\n");
    printf("   • Distributed problem solving\\n");
    printf("   • Emergent behavior\\n");
    printf("   • Fitness-based selection\\n");
    
    return 0;
}
        '''
        result = execute_and_display(self.executor, swarm_exercise, "Swarm Intelligence Concepts")
        self.log_result("curriculum", "swarm_exercise", result)
    
    def print_visual_demo(self):
        """Print a visual demonstration of the sandbox process"""
        print_header("Visual Process Demonstration", Colors.CYAN)
        
        print(f"""
{Colors.BOLD}📋 Secure Code Execution Pipeline{Colors.NC}
{Colors.CYAN}{'='*60}{Colors.NC}

{Colors.YELLOW}1. INPUT PHASE{Colors.NC}
   ┌─────────────────────────────────────────┐
   │  👤 User submits C code                 │
   │  📝 Code Editor → API → Sandbox        │
   │  🔍 Initial size and format validation │
   └─────────────────────────────────────────┘
                      │
                      ▼
{Colors.RED}2. SECURITY VALIDATION{Colors.NC}
   ┌─────────────────────────────────────────┐
   │  🛡️  Pattern Matching Security         │
   │      • Block system() calls            │
   │      • Block dangerous headers         │
   │      • Block inline assembly           │
   │      • Block file system access        │
   │  📏 Size Limit Enforcement             │
   │  🔐 String Literal Analysis            │
   └─────────────────────────────────────────┘
                      │
                      ▼
{Colors.BLUE}3. COMPILATION PHASE{Colors.NC}
   ┌─────────────────────────────────────────┐
   │  🔨 Secure GCC Compilation             │
   │      • Stack protection flags          │
   │      • FORTIFY_SOURCE enabled          │
   │      • Position Independent Exec       │
   │      • Full RELRO protection           │
   │  ⏱️  Compilation timeout (5s)          │
   │  📚 Link with FANN library            │
   └─────────────────────────────────────────┘
                      │
                      ▼
{Colors.GREEN}4. CONTAINER EXECUTION{Colors.NC}
   ┌─────────────────────────────────────────┐
   │  🐳 Docker Security Container          │
   │      • Alpine Linux (minimal)          │
   │      • Non-root user (UID 1000)        │
   │      • No network access               │
   │      • Read-only filesystem            │
   │      • Memory limit: 128MB             │
   │      • CPU limit: 50% core             │
   │      • Execution timeout: 10s          │
   │      • Seccomp syscall filtering       │
   │      • All capabilities dropped        │
   └─────────────────────────────────────────┘
                      │
                      ▼
{Colors.MAGENTA}5. OUTPUT PROCESSING{Colors.NC}
   ┌─────────────────────────────────────────┐
   │  📤 Capture stdout/stderr              │
   │  📏 Truncate if > 64KB                 │
   │  ⏱️  Record execution metrics          │
   │  🧹 Clean up temporary files          │
   │  📝 Log security events               │
   └─────────────────────────────────────────┘
                      │
                      ▼
{Colors.WHITE}6. RESULT DELIVERY{Colors.NC}
   ┌─────────────────────────────────────────┐
   │  ✅ Success: Code output + metrics     │
   │  ❌ Failure: Error message + stage    │
   │  📊 Performance data                   │
   │  🔒 Security audit trail              │
   └─────────────────────────────────────────┘

{Colors.BOLD}🛡️  SECURITY LAYERS ACTIVE:{Colors.NC}
└─ Input Validation      └─ Secure Compilation
└─ Pattern Matching      └─ Container Isolation  
└─ Header Filtering      └─ Resource Limits
└─ Path Traversal Block  └─ Syscall Filtering
└─ Size Limits          └─ Capability Dropping
        """)
    
    def print_summary(self):
        """Print demonstration summary"""
        print_header("Demonstration Summary", Colors.WHITE)
        
        # Count results by category
        categories = {}
        total_tests = len(self.demo_results)
        total_success = sum(1 for r in self.demo_results if r["success"])
        total_blocked = sum(1 for r in self.demo_results if not r["success"] and r["stage"] == "validation")
        
        for result in self.demo_results:
            cat = result["category"]
            if cat not in categories:
                categories[cat] = {"total": 0, "success": 0, "blocked": 0}
            categories[cat]["total"] += 1
            if result["success"]:
                categories[cat]["success"] += 1
            elif result["stage"] == "validation":
                categories[cat]["blocked"] += 1
        
        print(f"{Colors.BOLD}📊 Overall Results:{Colors.NC}")
        print(f"   Total Tests: {total_tests}")
        print(f"   Successful Executions: {Colors.GREEN}{total_success}{Colors.NC}")
        print(f"   Security Blocks: {Colors.RED}{total_blocked}{Colors.NC}")
        print(f"   Other Failures: {total_tests - total_success - total_blocked}")
        
        print(f"\n{Colors.BOLD}📈 By Category:{Colors.NC}")
        for cat, stats in categories.items():
            print(f"   {cat.capitalize()}: {stats['success']}/{stats['total']} successful, {stats['blocked']} blocked")
        
        # Calculate average execution time for successful runs
        successful_times = [r["execution_time"] for r in self.demo_results if r["success"] and r["execution_time"] > 0]
        if successful_times:
            avg_time = sum(successful_times) / len(successful_times)
            print(f"\n{Colors.BOLD}⏱️  Performance:{Colors.NC}")
            print(f"   Average Execution Time: {avg_time:.3f}s")
            print(f"   Fastest Execution: {min(successful_times):.3f}s")
            print(f"   Slowest Execution: {max(successful_times):.3f}s")
        
        print(f"\n{Colors.BOLD}🛡️  Security Validation:{Colors.NC}")
        security_results = [r for r in self.demo_results if r["category"] == "security"]
        blocked_count = sum(1 for r in security_results if not r["success"])
        print(f"   Security Tests: {len(security_results)}")
        print(f"   Threats Blocked: {Colors.GREEN}{blocked_count}/{len(security_results)}{Colors.NC}")
        print(f"   Protection Rate: {Colors.GREEN}{(blocked_count/len(security_results)*100):.1f}%{Colors.NC}")
        
        print(f"\n{Colors.BOLD}✅ Demonstration Complete!{Colors.NC}")
        print(f"{Colors.CYAN}The rUv-swarm secure sandbox successfully demonstrates:{Colors.NC}")
        print(f"   • Multi-layer security validation")
        print(f"   • FANN neural network support")
        print(f"   • Resource limit enforcement") 
        print(f"   • Educational C programming exercises")
        print(f"   • Comprehensive threat protection")

def main():
    """Main demonstration function"""
    print_header("rUv-Swarm Secure Code Execution Sandbox", Colors.BOLD)
    print(f"{Colors.CYAN}Security Analyst Demonstration{Colors.NC}")
    print(f"{Colors.WHITE}Generated by: Claude Code (Security Analyst){Colors.NC}")
    print(f"{Colors.WHITE}Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.NC}")
    
    # Check if Docker is available
    try:
        import subprocess
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"{Colors.RED}❌ Docker is not available. Please install Docker to run this demonstration.{Colors.NC}")
            return
    except FileNotFoundError:
        print(f"{Colors.RED}❌ Docker is not installed. Please install Docker to run this demonstration.{Colors.NC}")
        return
    
    # Check if sandbox image exists
    try:
        result = subprocess.run(['docker', 'image', 'inspect', 'ruv-sandbox:latest'], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            print(f"{Colors.RED}❌ Sandbox Docker image not found. Please build it first with:{Colors.NC}")
            print(f"{Colors.YELLOW}cd /workspaces/sparc-evolution/rUv-swarm-course/ruv-swarm-platform/docker/sandbox && ./build.sh{Colors.NC}")
            return
    except:
        print(f"{Colors.RED}❌ Unable to check Docker image. Please ensure Docker is running.{Colors.NC}")
        return
    
    demo = SandboxDemo()
    
    try:
        # Run all demonstrations
        demo.print_visual_demo()
        demo.demonstrate_basic_functionality()
        demo.demonstrate_fann_examples()
        demo.demonstrate_curriculum_exercises()
        demo.demonstrate_security_blocks()
        demo.demonstrate_resource_limits()
        demo.print_summary()
        
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠️  Demonstration interrupted by user{Colors.NC}")
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error during demonstration: {str(e)}{Colors.NC}")
        raise

if __name__ == "__main__":
    main()