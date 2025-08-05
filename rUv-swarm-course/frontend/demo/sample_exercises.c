/*
 * rUv-Swarm Course Sample C Code Exercises
 * =========================================
 * 
 * This file contains sample C code exercises designed for the rUv-swarm
 * curriculum, demonstrating neural networks, swarm intelligence, and
 * secure programming practices.
 * 
 * All code is designed to execute safely within the Docker sandbox
 * with comprehensive security validation.
 */

// ============================================================================
// Exercise 1: Basic Neural Network with FANN
// ============================================================================

#include <stdio.h>
#include <fann.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

/*
 * Exercise 1a: Create Your First Neural Network
 * Learn to create and configure neural networks
 */
void exercise_1a_basic_network() {
    printf("🧠 Exercise 1a: Basic Neural Network\n");
    printf("====================================\n");
    
    // Student Task: Create a 3-layer network
    // Input layer: 3 neurons
    // Hidden layer: 5 neurons  
    // Output layer: 2 neurons
    struct fann *network = fann_create_standard(3, 3, 5, 2);
    
    if (network) {
        printf("✅ Network created successfully!\n");
        printf("   Inputs: %d\n", fann_get_num_input(network));
        printf("   Outputs: %d\n", fann_get_num_output(network));
        printf("   Total connections: %d\n", fann_get_total_connections(network));
        
        // Clean up
        fann_destroy(network);
    } else {
        printf("❌ Failed to create network\n");
    }
}

/*
 * Exercise 1b: Activation Functions
 * Experiment with different activation functions
 */
void exercise_1b_activation_functions() {
    printf("\n🔥 Exercise 1b: Activation Functions\n");
    printf("===================================\n");
    
    struct fann *network = fann_create_standard(3, 4, 6, 1);
    
    if (network) {
        // Set different activation functions
        fann_set_activation_function_hidden(network, FANN_SIGMOID_SYMMETRIC);
        fann_set_activation_function_output(network, FANN_LINEAR);
        
        printf("✅ Activation functions set:\n");
        printf("   Hidden layers: Sigmoid Symmetric\n");
        printf("   Output layer: Linear\n");
        
        // Test with sample input
        fann_type input[4] = {0.5, -0.3, 0.8, 0.1};
        fann_type *output = fann_run(network, input);
        
        printf("   Sample output: %.4f\n", output[0]);
        
        fann_destroy(network);
    }
}

/*
 * Exercise 1c: XOR Problem Setup
 * Classic neural network learning problem
 */
void exercise_1c_xor_problem() {
    printf("\n🎯 Exercise 1c: XOR Problem\n");
    printf("===========================\n");
    
    // Create network for XOR: 2 inputs, 3 hidden, 1 output
    struct fann *xor_net = fann_create_standard(3, 2, 3, 1);
    
    if (xor_net) {
        printf("✅ XOR Network Architecture:\n");
        printf("   2 inputs → 3 hidden → 1 output\n");
        
        // Set appropriate activation functions for XOR
        fann_set_activation_function_hidden(xor_net, FANN_SIGMOID_SYMMETRIC);
        fann_set_activation_function_output(xor_net, FANN_SIGMOID_SYMMETRIC);
        
        // Test all XOR combinations (untrained network)
        fann_type inputs[4][2] = {{0,0}, {0,1}, {1,0}, {1,1}};
        double expected[4] = {0, 1, 1, 0};
        
        printf("\n📊 XOR Truth Table (Untrained Network):\n");
        for (int i = 0; i < 4; i++) {
            fann_type *output = fann_run(xor_net, inputs[i]);
            printf("   [%.0f,%.0f] → %.3f (expected: %.0f)\n", 
                   inputs[i][0], inputs[i][1], output[0], expected[i]);
        }
        
        printf("\n📝 Note: Training requires external data files\n");
        printf("    This demonstrates network structure and testing\n");
        
        fann_destroy(xor_net);
    }
}

// ============================================================================
// Exercise 2: Swarm Intelligence Basics
// ============================================================================

/*
 * Particle structure for swarm algorithms
 */
typedef struct {
    double position[2];      // 2D position
    double velocity[2];      // 2D velocity
    double best_position[2]; // Personal best position
    double fitness;          // Current fitness
    double best_fitness;     // Personal best fitness
    int id;                  // Particle identifier
} Particle;

/*
 * Simple fitness function for optimization
 * Sphere function: f(x,y) = x² + y²
 * Global minimum at (0,0) with value 0
 */
double sphere_function(double x, double y) {
    return x*x + y*y;
}

/*
 * Exercise 2a: Particle Initialization
 * Learn to set up a particle swarm
 */
void exercise_2a_particle_init() {
    printf("\n🐛 Exercise 2a: Particle Swarm Initialization\n");
    printf("==============================================\n");
    
    srand(time(NULL));
    
    const int SWARM_SIZE = 6;
    Particle swarm[SWARM_SIZE];
    
    printf("Initializing %d particles:\n", SWARM_SIZE);
    
    // Initialize each particle
    for (int i = 0; i < SWARM_SIZE; i++) {
        swarm[i].id = i;
        
        // Random position in [-5, 5] x [-5, 5]
        swarm[i].position[0] = ((double)rand()/RAND_MAX) * 10.0 - 5.0;
        swarm[i].position[1] = ((double)rand()/RAND_MAX) * 10.0 - 5.0;
        
        // Random velocity in [-1, 1] x [-1, 1]
        swarm[i].velocity[0] = ((double)rand()/RAND_MAX) * 2.0 - 1.0;
        swarm[i].velocity[1] = ((double)rand()/RAND_MAX) * 2.0 - 1.0;
        
        // Calculate fitness
        swarm[i].fitness = sphere_function(swarm[i].position[0], swarm[i].position[1]);
        
        // Initialize personal best
        swarm[i].best_position[0] = swarm[i].position[0];
        swarm[i].best_position[1] = swarm[i].position[1];
        swarm[i].best_fitness = swarm[i].fitness;
        
        printf("   Particle %d: pos(%.2f,%.2f) vel(%.2f,%.2f) fitness=%.3f\n",
               swarm[i].id,
               swarm[i].position[0], swarm[i].position[1],
               swarm[i].velocity[0], swarm[i].velocity[1],
               swarm[i].fitness);
    }
    
    // Find global best
    int global_best_idx = 0;
    for (int i = 1; i < SWARM_SIZE; i++) {
        if (swarm[i].fitness < swarm[global_best_idx].fitness) {
            global_best_idx = i;
        }
    }
    
    printf("\n🏆 Global Best: Particle %d\n", global_best_idx);
    printf("   Position: (%.3f, %.3f)\n", 
           swarm[global_best_idx].position[0], 
           swarm[global_best_idx].position[1]);
    printf("   Fitness: %.3f\n", swarm[global_best_idx].fitness);
}

/*
 * Exercise 2b: PSO Parameters
 * Understanding particle swarm optimization parameters
 */
void exercise_2b_pso_parameters() {
    printf("\n⚙️  Exercise 2b: PSO Parameters\n");
    printf("==============================\n");
    
    // PSO hyperparameters
    double inertia_weight = 0.729;        // w: controls exploration vs exploitation
    double cognitive_param = 1.49445;     • c1: attraction to personal best
    double social_param = 1.49445;        • c2: attraction to global best
    
    printf("📊 PSO Parameter Configuration:\n");
    printf("   Inertia Weight (w):     %.3f\n", inertia_weight);
    printf("   Cognitive Parameter (c1): %.3f\n", cognitive_param);
    printf("   Social Parameter (c2):   %.3f\n", social_param);
    
    printf("\n📚 Parameter Effects:\n");
    printf("   • High w → More exploration, slower convergence\n");
    printf("   • Low w → Less exploration, faster convergence\n");
    printf("   • High c1 → Strong personal memory influence\n");
    printf("   • High c2 → Strong social/global influence\n");
    
    // Velocity update equation (conceptual)
    printf("\n🔄 Velocity Update Equation:\n");
    printf("   v[i] = w*v[i] + c1*r1*(pbest[i] - pos[i]) + c2*r2*(gbest - pos[i])\n");
    printf("   Where r1, r2 are random numbers [0,1]\n");
    
    // Position update equation
    printf("\n📍 Position Update Equation:\n");
    printf("   pos[i] = pos[i] + v[i]\n");
}

/*
 * Exercise 2c: Swarm Behavior Analysis
 * Analyze collective swarm behavior
 */
void exercise_2c_swarm_behavior() {
    printf("\n🐝 Exercise 2c: Swarm Behavior Analysis\n");
    printf("=======================================\n");
    
    const int SWARM_SIZE = 8;
    Particle swarm[SWARM_SIZE];
    
    // Initialize swarm (simplified)
    srand(42); // Fixed seed for reproducible results
    for (int i = 0; i < SWARM_SIZE; i++) {
        swarm[i].id = i;
        swarm[i].position[0] = ((double)rand()/RAND_MAX) * 6.0 - 3.0;
        swarm[i].position[1] = ((double)rand()/RAND_MAX) * 6.0 - 3.0;
        swarm[i].fitness = sphere_function(swarm[i].position[0], swarm[i].position[1]);
    }
    
    // Calculate swarm statistics
    double center_x = 0, center_y = 0;
    double avg_fitness = 0;
    double min_fitness = swarm[0].fitness;
    double max_fitness = swarm[0].fitness;
    
    for (int i = 0; i < SWARM_SIZE; i++) {
        center_x += swarm[i].position[0];
        center_y += swarm[i].position[1];
        avg_fitness += swarm[i].fitness;
        
        if (swarm[i].fitness < min_fitness) min_fitness = swarm[i].fitness;
        if (swarm[i].fitness > max_fitness) max_fitness = swarm[i].fitness;
    }
    
    center_x /= SWARM_SIZE;
    center_y /= SWARM_SIZE;
    avg_fitness /= SWARM_SIZE;
    
    // Calculate diversity (average distance from center)
    double diversity = 0;
    for (int i = 0; i < SWARM_SIZE; i++) {
        double dx = swarm[i].position[0] - center_x;
        double dy = swarm[i].position[1] - center_y;
        diversity += sqrt(dx*dx + dy*dy);
    }
    diversity /= SWARM_SIZE;
    
    printf("📊 Swarm Statistics:\n");
    printf("   Size: %d particles\n", SWARM_SIZE);
    printf("   Center: (%.3f, %.3f)\n", center_x, center_y);
    printf("   Average Fitness: %.3f\n", avg_fitness);
    printf("   Best Fitness: %.3f\n", min_fitness);
    printf("   Worst Fitness: %.3f\n", max_fitness);
    printf("   Diversity: %.3f\n", diversity);
    printf("   Fitness Range: %.3f\n", max_fitness - min_fitness);
    
    printf("\n🎯 Swarm Intelligence Principles:\n");
    printf("   • Decentralized control\n");
    printf("   • Local interactions → Global behavior\n");
    printf("   • Self-organization\n");
    printf("   • Adaptive exploration\n");
}

// ============================================================================
// Exercise 3: Neuroevolution Concepts
// ============================================================================

/*
 * Exercise 3a: Network Evolution Setup
 * Combine neural networks with evolutionary algorithms
 */
void exercise_3a_neuroevolution_setup() {
    printf("\n🧬 Exercise 3a: Neuroevolution Setup\n");
    printf("====================================\n");
    
    const int POPULATION_SIZE = 4;
    struct fann *population[POPULATION_SIZE];
    double fitness_scores[POPULATION_SIZE];
    
    printf("Creating neural network population:\n");
    
    // Create population of neural networks
    for (int i = 0; i < POPULATION_SIZE; i++) {
        population[i] = fann_create_standard(3, 3, 4, 1);
        
        if (population[i]) {
            // Randomize weights differently for each network
            fann_randomize_weights(population[i], -2.0 + i*0.5, 2.0 - i*0.5);
            
            // Simulate fitness evaluation (random for demo)
            fitness_scores[i] = ((double)rand()/RAND_MAX) * 100.0;
            
            printf("   Network %d: %d connections, fitness=%.2f\n", 
                   i, fann_get_total_connections(population[i]), fitness_scores[i]);
        }
    }
    
    // Find best network
    int best_idx = 0;
    for (int i = 1; i < POPULATION_SIZE; i++) {
        if (fitness_scores[i] > fitness_scores[best_idx]) {
            best_idx = i;
        }
    }
    
    printf("\n🏆 Best Network: %d (fitness=%.2f)\n", best_idx, fitness_scores[best_idx]);
    
    printf("\n🔄 Evolution Process:\n");
    printf("   1. Initialize population\n");
    printf("   2. Evaluate fitness\n");
    printf("   3. Select parents\n");
    printf("   4. Crossover & mutation\n");
    printf("   5. Replace population\n");
    printf("   6. Repeat until convergence\n");
    
    // Cleanup
    for (int i = 0; i < POPULATION_SIZE; i++) {
        if (population[i]) {
            fann_destroy(population[i]);
        }
    }
}

/*
 * Exercise 3b: Fitness Function Design
 * Learn to create effective fitness functions
 */
void exercise_3b_fitness_functions() {
    printf("\n🎯 Exercise 3b: Fitness Function Design\n");
    printf("=======================================\n");
    
    printf("📚 Common Fitness Function Types:\n\n");
    
    // Classification fitness
    printf("1. Classification Accuracy:\n");
    printf("   fitness = (correct_predictions / total_predictions) * 100\n");
    printf("   Example: 85%% accuracy = 85.0 fitness\n\n");
    
    // Regression fitness  
    printf("2. Mean Squared Error (lower is better):\n");
    printf("   fitness = 1.0 / (1.0 + MSE)\n");
    printf("   Converts minimization to maximization problem\n\n");
    
    // Multi-objective fitness
    printf("3. Multi-Objective (weighted sum):\n");
    printf("   fitness = w1*accuracy + w2*speed + w3*size_penalty\n");
    printf("   Balance multiple competing objectives\n\n");
    
    // Demonstration with sample values
    double accuracy = 0.87;
    double mse = 0.03;
    double speed_score = 0.92;
    
    double class_fitness = accuracy * 100;
    double regr_fitness = 1.0 / (1.0 + mse);
    double multi_fitness = 0.5*accuracy + 0.3*speed_score + 0.2*(1.0-mse);
    
    printf("📊 Sample Fitness Calculations:\n");
    printf("   Classification: %.2f\n", class_fitness);
    printf("   Regression: %.3f\n", regr_fitness);
    printf("   Multi-objective: %.3f\n", multi_fitness);
    
    printf("\n💡 Design Tips:\n");
    printf("   • Higher values = better fitness\n");
    printf("   • Scale appropriately (0-100 or 0-1)\n");
    printf("   • Consider problem constraints\n");
    printf("   • Test with known solutions\n");
}

// ============================================================================
// Main Exercise Runner
// ============================================================================

int main() {
    printf("🎓 rUv-Swarm Course: C Programming Exercises\n");
    printf("=============================================\n");
    printf("Secure Sandbox Environment: Docker Alpine Linux\n");
    printf("Neural Network Library: FANN (Fast Artificial Neural Network)\n");
    printf("Compiler: GCC with security flags\n");
    printf("Execution: Sandboxed with resource limits\n\n");
    
    // Run all exercises
    exercise_1a_basic_network();
    exercise_1b_activation_functions();
    exercise_1c_xor_problem();
    
    exercise_2a_particle_init();
    exercise_2b_pso_parameters();
    exercise_2c_swarm_behavior();
    
    exercise_3a_neuroevolution_setup();
    exercise_3b_fitness_functions();
    
    printf("\n🎉 All Exercises Completed Successfully!\n");
    printf("========================================\n");
    printf("✅ Neural network fundamentals\n");
    printf("✅ Swarm intelligence concepts\n");
    printf("✅ Neuroevolution principles\n");
    printf("✅ Secure C programming practices\n\n");
    
    printf("🎯 Next Steps:\n");
    printf("   • Implement actual PSO algorithm\n");
    printf("   • Create training data for XOR\n");
    printf("   • Build complete neuroevolution system\n");
    printf("   • Experiment with different architectures\n");
    
    return 0;
}