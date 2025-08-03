#!/usr/bin/env node

/**
 * Project 2: Task Coordinator
 * Learning objectives:
 * - Multi-agent task orchestration
 * - Parallel vs sequential execution
 * - Agent communication patterns
 * - Building a real coordination system
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📋 Task Coordinator - Multi-Agent Orchestration\n');

// Task Manager Class
class TaskCoordinator {
  constructor() {
    this.tasks = [];
    this.agents = [];
    this.results = [];
    this.startTime = Date.now();
  }

  // Helper to run commands
  runCommand(command, silent = false) {
    if (!silent) {
      console.log(`🔧 Executing: ${command}`);
    }
    try {
      return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      return null;
    }
  }

  // Initialize swarm with specific topology
  async initializeSwarm(topology = 'hierarchical', maxAgents = 6) {
    console.log(`\n🐝 Initializing ${topology} swarm with up to ${maxAgents} agents...`);
    
    const result = this.runCommand(
      `npx ruv-swarm init --topology ${topology} --agents ${maxAgents} --strategy adaptive`
    );
    
    console.log('✅ Swarm initialized');
    
    // Pre-task hook
    this.runCommand(
      'npx ruv-swarm hook pre-task --description "Multi-agent task coordination session"'
    );
    
    return result;
  }

  // Define agent roles
  defineAgents() {
    this.agents = [
      {
        type: 'coordinator',
        name: 'TaskMaster',
        role: 'Oversees task distribution and progress',
        tasks: []
      },
      {
        type: 'analyst',
        name: 'DataAnalyzer',
        role: 'Analyzes requirements and data',
        tasks: []
      },
      {
        type: 'architect',
        name: 'SystemDesigner',
        role: 'Designs system architecture',
        tasks: []
      },
      {
        type: 'coder',
        name: 'Developer1',
        role: 'Implements core features',
        tasks: []
      },
      {
        type: 'coder',
        name: 'Developer2',
        role: 'Implements additional features',
        tasks: []
      },
      {
        type: 'tester',
        name: 'QualityAssurer',
        role: 'Tests and validates implementation',
        tasks: []
      }
    ];

    console.log('\n👥 Agent Roles Defined:');
    this.agents.forEach(agent => {
      console.log(`  ${this.getAgentEmoji(agent.type)} ${agent.name}: ${agent.role}`);
    });
  }

  getAgentEmoji(type) {
    const emojis = {
      coordinator: '🎯',
      analyst: '📊',
      architect: '🏗️',
      coder: '💻',
      tester: '🧪',
      researcher: '🔍'
    };
    return emojis[type] || '🤖';
  }

  // Create a complex task that needs coordination
  createComplexTask() {
    console.log('\n📝 Creating Complex Task: Build a Todo API\n');
    
    this.tasks = [
      // Analysis Phase
      { id: 1, name: 'Analyze Requirements', agent: 'DataAnalyzer', phase: 'analysis', deps: [] },
      { id: 2, name: 'Research Best Practices', agent: 'DataAnalyzer', phase: 'analysis', deps: [] },
      
      // Design Phase
      { id: 3, name: 'Design API Structure', agent: 'SystemDesigner', phase: 'design', deps: [1, 2] },
      { id: 4, name: 'Design Database Schema', agent: 'SystemDesigner', phase: 'design', deps: [1] },
      
      // Implementation Phase
      { id: 5, name: 'Setup Project Structure', agent: 'Developer1', phase: 'implementation', deps: [3] },
      { id: 6, name: 'Implement Database Models', agent: 'Developer1', phase: 'implementation', deps: [4, 5] },
      { id: 7, name: 'Create API Endpoints', agent: 'Developer2', phase: 'implementation', deps: [3, 5] },
      { id: 8, name: 'Add Authentication', agent: 'Developer2', phase: 'implementation', deps: [7] },
      
      // Testing Phase
      { id: 9, name: 'Write Unit Tests', agent: 'QualityAssurer', phase: 'testing', deps: [6, 7] },
      { id: 10, name: 'Integration Testing', agent: 'QualityAssurer', phase: 'testing', deps: [8, 9] },
      
      // Coordination
      { id: 11, name: 'Final Review', agent: 'TaskMaster', phase: 'review', deps: [10] }
    ];

    console.log('Task Breakdown:');
    console.log(this.visualizeTaskDependencies());
  }

  // Visualize task dependencies
  visualizeTaskDependencies() {
    let output = '\n';
    const phases = ['analysis', 'design', 'implementation', 'testing', 'review'];
    
    phases.forEach(phase => {
      const phaseTasks = this.tasks.filter(t => t.phase === phase);
      if (phaseTasks.length > 0) {
        output += `\n${phase.toUpperCase()}:\n`;
        phaseTasks.forEach(task => {
          const deps = task.deps.length > 0 ? ` (depends on: ${task.deps.join(', ')})` : '';
          output += `  [${task.id}] ${task.name} → ${task.agent}${deps}\n`;
        });
      }
    });
    
    return output;
  }

  // Simulate parallel execution
  async executeParallel() {
    console.log('\n⚡ PARALLEL EXECUTION STRATEGY\n');
    
    const phases = ['analysis', 'design', 'implementation', 'testing', 'review'];
    let completedTasks = new Set();
    
    for (const phase of phases) {
      console.log(`\n📍 Phase: ${phase.toUpperCase()}`);
      
      // Get all tasks that can run in parallel (dependencies met)
      const availableTasks = this.tasks.filter(task => {
        return task.phase === phase && 
               task.deps.every(dep => completedTasks.has(dep));
      });
      
      if (availableTasks.length > 0) {
        console.log(`🚀 Running ${availableTasks.length} tasks in parallel:`);
        
        // Simulate parallel execution
        await Promise.all(availableTasks.map(async task => {
          await this.executeTask(task);
          completedTasks.add(task.id);
        }));
      }
    }
    
    const parallelTime = Date.now() - this.startTime;
    console.log(`\n⏱️  Parallel execution time: ${parallelTime}ms`);
    return parallelTime;
  }

  // Simulate sequential execution
  async executeSequential() {
    console.log('\n🔄 SEQUENTIAL EXECUTION STRATEGY\n');
    
    const startTime = Date.now();
    
    for (const task of this.tasks) {
      await this.executeTask(task);
    }
    
    const sequentialTime = Date.now() - startTime;
    console.log(`\n⏱️  Sequential execution time: ${sequentialTime}ms`);
    return sequentialTime;
  }

  // Execute a single task
  async executeTask(task) {
    const agent = this.agents.find(a => a.name === task.agent);
    const emoji = this.getAgentEmoji(agent.type);
    
    console.log(`  ${emoji} ${task.agent}: Starting "${task.name}"`);
    
    // Simulate work with hook
    this.runCommand(
      `npx ruv-swarm hook notification --message "${task.agent} working on: ${task.name}"`,
      true // silent
    );
    
    // Simulate task execution time (100-300ms)
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Record result
    this.results.push({
      taskId: task.id,
      taskName: task.name,
      agent: task.agent,
      status: 'completed',
      timestamp: Date.now()
    });
    
    // Post-edit hook (simulating file changes)
    if (task.phase === 'implementation') {
      this.runCommand(
        `npx ruv-swarm hook post-edit --file "src/${task.name.toLowerCase().replace(/ /g, '-')}.js"`,
        true // silent
      );
    }
    
    console.log(`  ${emoji} ${task.agent}: Completed "${task.name}" ✓`);
  }

  // Generate coordination report
  generateReport() {
    console.log('\n📊 COORDINATION REPORT\n');
    
    // Agent workload
    console.log('Agent Workload Distribution:');
    this.agents.forEach(agent => {
      const taskCount = this.tasks.filter(t => t.agent === agent.name).length;
      const bar = '█'.repeat(taskCount * 2);
      console.log(`  ${this.getAgentEmoji(agent.type)} ${agent.name}: ${bar} (${taskCount} tasks)`);
    });
    
    // Phase distribution
    console.log('\nPhase Distribution:');
    const phases = ['analysis', 'design', 'implementation', 'testing', 'review'];
    phases.forEach(phase => {
      const count = this.tasks.filter(t => t.phase === phase).length;
      console.log(`  ${phase}: ${count} tasks`);
    });
    
    // Dependency complexity
    const avgDeps = this.tasks.reduce((sum, t) => sum + t.deps.length, 0) / this.tasks.length;
    console.log(`\nDependency Complexity: ${avgDeps.toFixed(1)} avg dependencies per task`);
  }

  // Save coordination data
  saveCoordinationData() {
    const data = {
      timestamp: new Date().toISOString(),
      swarmTopology: 'hierarchical',
      agents: this.agents,
      tasks: this.tasks,
      results: this.results,
      performance: {
        totalTasks: this.tasks.length,
        totalAgents: this.agents.length
      }
    };
    
    const filename = 'coordination-session.json';
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n💾 Coordination data saved to ${filename}`);
  }
}

// Main execution
async function main() {
  const coordinator = new TaskCoordinator();
  
  try {
    // Initialize swarm
    await coordinator.initializeSwarm('hierarchical', 6);
    
    // Define agents and create task
    coordinator.defineAgents();
    coordinator.createComplexTask();
    
    // Compare execution strategies
    console.log('\n🔬 COMPARING EXECUTION STRATEGIES');
    console.log('=' .repeat(50));
    
    // Parallel execution
    const parallelTime = await coordinator.executeParallel();
    
    console.log('\n' + '='.repeat(50));
    
    // Reset for sequential
    coordinator.results = [];
    coordinator.startTime = Date.now();
    
    // Sequential execution
    const sequentialTime = await coordinator.executeSequential();
    
    // Performance comparison
    console.log('\n🏁 PERFORMANCE COMPARISON:');
    console.log(`  Parallel Time: ${parallelTime}ms`);
    console.log(`  Sequential Time: ${sequentialTime}ms`);
    console.log(`  Speed Improvement: ${(sequentialTime / parallelTime).toFixed(2)}x faster with parallel execution`);
    
    // Generate report
    coordinator.generateReport();
    
    // Save data
    coordinator.saveCoordinationData();
    
    console.log('\n✅ Task coordination demonstration complete!');
    console.log('\n💡 Key Insights:');
    console.log('  1. Parallel execution is significantly faster for independent tasks');
    console.log('  2. Proper dependency management is crucial for coordination');
    console.log('  3. Different agent types handle different phases of work');
    console.log('  4. Hooks provide coordination points between agents');
    console.log('  5. Real implementation would happen in Claude Code, not the agents');
    
  } catch (error) {
    console.error('❌ Coordination failed:', error);
  }
}

// Run the coordinator
main().catch(console.error);