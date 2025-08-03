# Project 1: Hello Swarm

## Overview
This is your first hands-on project with ruv-swarm. You'll learn the fundamental concepts of swarm-based coordination and how to use basic ruv-swarm commands.

## Learning Objectives
- Initialize a swarm with different topologies
- Spawn various types of agents
- Understand agent roles and communication
- Use memory for persistence
- Monitor swarm performance

## Key Concepts

### 1. Swarm Topologies
- **Mesh**: All agents can communicate with each other (good for collaborative tasks)
- **Hierarchical**: Tree-like structure with parent-child relationships (good for structured workflows)
- **Star**: Central coordinator with peripheral agents (good for centralized control)
- **Ring**: Agents connected in a circular pattern (good for pipeline processing)

### 2. Agent Types
- **Researcher**: Gathers and analyzes information
- **Coder**: Implements solutions and writes code
- **Analyst**: Performs data analysis and pattern recognition
- **Tester**: Validates and tests implementations
- **Coordinator**: Manages workflow and agent coordination
- **Architect**: Designs system architecture

### 3. Memory System
- Persistent storage across sessions
- Key-value based storage
- Enables agents to share knowledge

## Running the Project

```bash
# Option 1: Run directly
node hello-swarm.js

# Option 2: Run with npm
npm init -y
npm start
```

## Experiments to Try

1. **Change Topology**: Modify the `--topology` parameter to see different communication patterns:
   ```bash
   npx ruv-swarm swarm init --topology hierarchical --max-agents 5
   ```

2. **Add More Agents**: Spawn additional agents of different types:
   ```bash
   npx ruv-swarm agent spawn --type tester --name "Eve"
   ```

3. **Complex Tasks**: Try orchestrating more complex tasks:
   ```bash
   npx ruv-swarm task orchestrate --task "Analyze the weather API and suggest improvements" --strategy adaptive
   ```

4. **Memory Patterns**: Store and retrieve complex data:
   ```bash
   npx ruv-swarm memory store --key "project-data" --value '{"status": "learning", "progress": 25}'
   ```

## Understanding the Output

When you run the application, you'll see:
1. Swarm initialization confirmation
2. Agent spawning messages with unique IDs
3. Status reports showing topology and active agents
4. Task orchestration results
5. Memory operations confirmations
6. Performance metrics for each agent

## Next Steps
Once comfortable with basic swarm operations, move to Project 2: Task Coordinator to learn about more complex multi-agent coordination patterns.