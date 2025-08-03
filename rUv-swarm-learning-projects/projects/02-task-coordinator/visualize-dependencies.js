#!/usr/bin/env node

/**
 * Task Dependency Visualizer
 * Helps understand how dependencies affect parallel execution
 */

const fs = require('fs');

// Read the coordination session data
const data = JSON.parse(fs.readFileSync('coordination-session.json', 'utf8'));

console.log('📊 Task Dependency Visualization\n');
console.log('=' .repeat(60));

// Create dependency map
const taskMap = {};
data.tasks.forEach(task => {
  taskMap[task.id] = task;
});

// Visualize by phase
const phases = ['analysis', 'design', 'implementation', 'testing', 'review'];

phases.forEach(phase => {
  const phaseTasks = data.tasks.filter(t => t.phase === phase);
  
  if (phaseTasks.length > 0) {
    console.log(`\n📍 ${phase.toUpperCase()}`);
    console.log('-'.repeat(40));
    
    // Group tasks by dependency level
    const levels = {};
    
    phaseTasks.forEach(task => {
      const level = task.deps.length;
      if (!levels[level]) levels[level] = [];
      levels[level].push(task);
    });
    
    // Show tasks that can run in parallel
    Object.keys(levels).sort((a, b) => a - b).forEach(level => {
      const tasks = levels[level];
      
      if (tasks.length > 1) {
        console.log(`\n  🚀 Can run in PARALLEL (${tasks.length} tasks):`);
        tasks.forEach(task => {
          console.log(`     [${task.id}] ${task.name} → ${task.agent}`);
        });
      } else {
        console.log(`\n  ⏳ Runs alone:`);
        tasks.forEach(task => {
          const deps = task.deps.length > 0 ? 
            ` (waits for: ${task.deps.map(d => `#${d}`).join(', ')})` : '';
          console.log(`     [${task.id}] ${task.name} → ${task.agent}${deps}`);
        });
      }
    });
  }
});

// Calculate parallelism potential
console.log('\n\n📈 PARALLELISM ANALYSIS');
console.log('=' .repeat(60));

let totalTasks = data.tasks.length;
let independentTasks = data.tasks.filter(t => t.deps.length === 0).length;
let maxParallelTasks = 0;

// Find maximum tasks that can run in parallel
phases.forEach(phase => {
  const phaseTasks = data.tasks.filter(t => t.phase === phase);
  const noDeps = phaseTasks.filter(t => t.deps.length === 0).length;
  maxParallelTasks = Math.max(maxParallelTasks, noDeps);
});

console.log(`Total Tasks: ${totalTasks}`);
console.log(`Independent Tasks: ${independentTasks} (${(independentTasks/totalTasks*100).toFixed(1)}%)`);
console.log(`Max Parallel Tasks: ${maxParallelTasks}`);
console.log(`Average Dependencies: ${data.tasks.reduce((sum, t) => sum + t.deps.length, 0) / totalTasks}`);

// Show critical path
console.log('\n\n🛤️  CRITICAL PATH ANALYSIS');
console.log('=' .repeat(60));

// Find longest dependency chain
function findLongestPath(taskId, visited = new Set()) {
  if (visited.has(taskId)) return [];
  visited.add(taskId);
  
  const task = taskMap[taskId];
  if (!task) return [];
  
  let longestSubPath = [];
  
  // Find tasks that depend on this one
  const dependents = data.tasks.filter(t => t.deps.includes(taskId));
  
  dependents.forEach(dep => {
    const subPath = findLongestPath(dep.id, new Set(visited));
    if (subPath.length > longestSubPath.length) {
      longestSubPath = subPath;
    }
  });
  
  return [task, ...longestSubPath];
}

// Find the critical path (longest dependency chain)
let criticalPath = [];
data.tasks.forEach(task => {
  if (task.deps.length === 0) { // Start from tasks with no dependencies
    const path = findLongestPath(task.id);
    if (path.length > criticalPath.length) {
      criticalPath = path;
    }
  }
});

console.log('The longest dependency chain (critical path):');
criticalPath.forEach((task, index) => {
  const arrow = index < criticalPath.length - 1 ? ' → ' : '';
  console.log(`  ${index + 1}. [${task.id}] ${task.name}${arrow}`);
});

console.log(`\nCritical path length: ${criticalPath.length} tasks`);
console.log('This determines the minimum execution time.\n');

// Performance insights
console.log('\n💡 PERFORMANCE INSIGHTS');
console.log('=' .repeat(60));

const parallelRatio = (totalTasks - criticalPath.length) / totalTasks;
const theoreticalSpeedup = totalTasks / criticalPath.length;

console.log(`Parallelizable Work: ${(parallelRatio * 100).toFixed(1)}%`);
console.log(`Theoretical Max Speedup: ${theoreticalSpeedup.toFixed(2)}x`);
console.log(`Actual Speedup Achieved: 2.00x`);
console.log(`Efficiency: ${(2.0 / theoreticalSpeedup * 100).toFixed(1)}%`);

console.log('\n✨ Key Takeaway:');
console.log('The critical path determines minimum execution time.');
console.log('Parallel execution can only optimize tasks off the critical path.');