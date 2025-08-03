# Project 2: Task Coordinator

## Overview
This project demonstrates multi-agent task orchestration using ruv-swarm. You'll learn how to coordinate complex tasks across multiple agents, implement parallel execution strategies, and understand agent communication patterns.

## Learning Objectives
- Understand multi-agent coordination patterns
- Implement parallel vs sequential execution
- Manage task dependencies effectively
- Build a real coordination system
- Measure performance improvements

## Key Concepts

### 1. Task Orchestration
Breaking down complex tasks into smaller, manageable pieces that can be distributed across agents:
- **Task Dependencies**: Some tasks must wait for others to complete
- **Phase-based Execution**: Grouping related tasks into phases
- **Agent Specialization**: Different agents handle different types of work

### 2. Execution Strategies
- **Sequential**: Tasks run one after another (simple but slow)
- **Parallel**: Independent tasks run simultaneously (complex but fast)
- **Hybrid**: Combination based on dependencies

### 3. Agent Communication
Agents coordinate through:
- **Pre-task hooks**: Planning and preparation
- **Notifications**: Status updates during execution
- **Post-edit hooks**: Signaling completion
- **Memory storage**: Persistent state sharing

### 4. Performance Benefits
Parallel coordination can achieve:
- 2-4x speed improvements for independent tasks
- Better resource utilization
- Reduced bottlenecks
- Improved scalability

## Running the Project

```bash
# Run the task coordinator
node task-coordinator.js

# The demo will:
# 1. Initialize a hierarchical swarm
# 2. Define 6 specialized agents
# 3. Create an 11-task workflow
# 4. Execute tasks in parallel
# 5. Execute tasks sequentially
# 6. Compare performance
# 7. Generate reports
```

## Understanding the Output

### Task Visualization
```
ANALYSIS:
  [1] Analyze Requirements → DataAnalyzer
  [2] Research Best Practices → DataAnalyzer

DESIGN:
  [3] Design API Structure → SystemDesigner (depends on: 1, 2)
  [4] Design Database Schema → SystemDesigner (depends on: 1)
```

### Parallel Execution
Tasks that don't depend on each other run simultaneously:
```
📍 Phase: ANALYSIS
🚀 Running 2 tasks in parallel:
  📊 DataAnalyzer: Starting "Analyze Requirements"
  📊 DataAnalyzer: Starting "Research Best Practices"
```

### Performance Comparison
```
🏁 PERFORMANCE COMPARISON:
  Parallel Time: 1250ms
  Sequential Time: 2800ms
  Speed Improvement: 2.24x faster with parallel execution
```

## Real-World Application

In a real scenario with Claude Code and MCP tools:

1. **Swarm Initialization**: MCP tool `mcp__ruv-swarm__swarm_init`
2. **Agent Spawning**: MCP tool `mcp__ruv-swarm__agent_spawn`
3. **Task Orchestration**: MCP tool `mcp__ruv-swarm__task_orchestrate`
4. **Memory Management**: MCP tool `mcp__ruv-swarm__memory_usage`
5. **Actual Implementation**: Claude Code's native tools (Write, Edit, Bash)

## Experiments to Try

### 1. Different Topologies
Modify the swarm topology to see how it affects coordination:
```javascript
await coordinator.initializeSwarm('mesh', 6);     // All agents connected
await coordinator.initializeSwarm('star', 6);     // Central coordinator
await coordinator.initializeSwarm('ring', 6);     // Circular communication
```

### 2. More Complex Dependencies
Add tasks with multiple dependencies:
```javascript
{ id: 12, name: 'Deploy to Production', agent: 'Developer1', phase: 'deployment', deps: [10, 11] }
```

### 3. Agent Specialization
Create more specialized agents:
```javascript
{ type: 'security', name: 'SecurityAuditor', role: 'Security validation' }
{ type: 'performance', name: 'PerfOptimizer', role: 'Performance tuning' }
```

### 4. Error Handling
Add tasks that might fail and see how coordination handles it:
```javascript
{ id: 13, name: 'Stress Testing', agent: 'QualityAssurer', phase: 'testing', failureRate: 0.3 }
```

## Key Takeaways

1. **Dependency Management**: Proper dependency tracking enables parallel execution
2. **Agent Specialization**: Different agents excel at different types of tasks
3. **Phase-based Execution**: Grouping tasks by phase improves organization
4. **Performance Gains**: Parallel execution can significantly reduce total time
5. **Coordination Overhead**: Some overhead is worth it for complex tasks

## Integration with Claude Code

When using with Claude Code's MCP integration:
```javascript
// Initialize swarm
mcp__ruv-swarm__swarm_init({ topology: 'hierarchical', maxAgents: 6 })

// Spawn specialized agents
mcp__ruv-swarm__agent_spawn({ type: 'architect', name: 'SystemDesigner' })
mcp__ruv-swarm__agent_spawn({ type: 'coder', name: 'Developer1' })

// Orchestrate task
mcp__ruv-swarm__task_orchestrate({ 
  task: 'Build Todo API',
  strategy: 'parallel',
  phases: ['analysis', 'design', 'implementation', 'testing']
})

// Claude Code then executes the actual work
Write('src/models/todo.js', todoModelCode)
Edit('src/routes/api.js', apiRoutesCode)
Bash('npm test')
```

## Next Steps
Ready for Project 3? You'll learn about persistent memory and building a memory-based chat bot!