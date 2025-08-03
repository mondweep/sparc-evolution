# Claude Flow Configuration Quiz

## Module 1: Understanding Claude Flow

### Question 1: What is the Golden Rule of Claude Flow?
A) Always use MCP tools for file operations  
B) One message equals all related operations  
C) Sequential execution is preferred  
D) TodoWrite should contain only one item  

**Correct Answer: B**  
**Explanation**: The Golden Rule states "1 MESSAGE = ALL RELATED OPERATIONS" - this is fundamental to achieving parallel execution and optimal performance.

### Question 2: What performance improvement can be achieved with proper Claude Flow configuration?
A) 10-20% faster execution  
B) 50% token reduction  
C) 2.8-4.4x speed improvement  
D) No measurable improvement  

**Correct Answer: C**  
**Explanation**: Claude Flow achieves 2.8-4.4x speed improvements along with 32.3% token reduction and 84.8% SWE-Bench solve rate.

## Module 2: Parallel Execution Fundamentals

### Question 3: How many todos should be included in a single TodoWrite call?
A) Exactly 1  
B) 2-3 todos maximum  
C) 5-10+ todos minimum  
D) It doesn't matter  

**Correct Answer: C**  
**Explanation**: TodoWrite MUST ALWAYS include 5-10+ todos in a SINGLE call to maintain proper coordination and atomic state updates.

### Question 4: Which of the following is the CORRECT way to create a project structure?
A) 
```
Message 1: Bash("mkdir src")
Message 2: Bash("mkdir tests")  
Message 3: Bash("mkdir docs")
```

B)
```
Message 1: [BatchTool]
  - Bash("mkdir -p project/{src,tests,docs}")
  - Write("package.json", content)
  - TodoWrite { todos: [5+ todos] }
```

**Correct Answer: B**  
**Explanation**: All related operations must be batched in a single message for optimal parallel execution.

## Module 3: MCP Tools and Coordination

### Question 5: What is the role of MCP tools in Claude Flow?
A) Execute all file operations  
B) Generate code and run commands  
C) Coordinate and plan Claude Code's actions  
D) Replace Claude Code entirely  

**Correct Answer: C**  
**Explanation**: MCP tools coordinate and plan, while Claude Code executes. Think of MCP as the "brain" and Claude Code as the "hands."

### Question 6: Which operations should NEVER be performed by MCP tools?
A) Memory management  
B) Performance tracking  
C) File creation and editing  
D) Swarm coordination  

**Correct Answer: C**  
**Explanation**: MCP tools NEVER write files, execute bash commands, or generate code - that's Claude Code's responsibility.

### Question 7: What is the correct workflow pattern?
A) MCP → MCP → Claude Code → MCP → Claude Code  
B) Claude Code → MCP → Claude Code → MCP  
C) MCP setup → Claude Code execution → MCP memory storage  
D) Only use Claude Code, never MCP  

**Correct Answer: C**  
**Explanation**: The correct pattern is MCP coordination setup, Claude Code execution of actual work, then MCP memory storage.

## Module 4: Swarm Orchestration Patterns

### Question 8: When spawning agents, you must:
A) Spawn them one by one across multiple messages  
B) Spawn ALL agents in ONE message with full instructions  
C) Use only MCP tools to spawn agents  
D) Spawn agents without coordination instructions  

**Correct Answer: B**  
**Explanation**: ALL agents must be spawned in ONE message with full coordination instructions to enable proper parallel execution.

### Question 9: How many agents should be used for a complex task (7+ components)?
A) 3-4 agents  
B) 5-7 agents  
C) 8-12 agents  
D) Always exactly 5 agents  

**Correct Answer: C**  
**Explanation**: Complex tasks with 7+ components should use 8-12 agents for optimal coordination and task distribution.

### Question 10: What hooks must every agent run BEFORE starting work?
A) Only post-task hooks  
B) pre-task and session-restore hooks  
C) No hooks are required  
D) Only notification hooks  

**Correct Answer: B**  
**Explanation**: Agents must run pre-task hooks to load context and session-restore hooks to maintain coordination state.

## Module 5: Advanced Configuration

### Question 11: How should agent memory be managed?
A) Each agent manages its own memory independently  
B) No memory management needed  
C) Use memory for ALL cross-agent coordination with structured keys  
D) Only store memory at the end of tasks  

**Correct Answer: C**  
**Explanation**: Memory must be used for ALL cross-agent coordination using structured keys like "swarm-{id}/agent-{name}/{step}".

### Question 12: What should you do if you need to perform 6 related operations?
A) Send 6 separate messages  
B) Group them into 2-3 messages  
C) Put all 6 operations in 1 message  
D) Perform them sequentially  

**Correct Answer: C**  
**Explanation**: Following the Golden Rule, all related operations must be batched into a single message for optimal performance.

## Scenario-Based Questions

### Question 13: You need to build a REST API with authentication, database, and tests. What's the correct approach?

A) **Sequential Approach**:
```
Message 1: Setup project
Message 2: Create database
Message 3: Build authentication
Message 4: Create API endpoints
Message 5: Write tests
```

B) **Parallel Approach**:
```
[BatchTool - Message 1]:
  - Bash("mkdir -p api/{src,tests,docs}")
  - Write("package.json", config)
  - Write("server.js", serverCode)
  - TodoWrite { todos: [8+ todos with mixed statuses] }
```

**Correct Answer: B**  
**Explanation**: The parallel approach batches all related setup operations and includes comprehensive todo management in a single message.

### Question 14: An agent has just completed a file operation. What should it do next?
A) Nothing - continue to next task  
B) Run post-edit hook to store progress in memory  
C) Send a message to other agents  
D) Update its own local todo list  

**Correct Answer: B**  
**Explanation**: After EVERY file operation, agents must run post-edit hooks to store progress in memory for cross-agent coordination.

### Question 15: You notice coordination is failing between agents. What's the most likely cause?
A) Too many agents in the swarm  
B) Agents are not using hooks for coordination  
C) The task is too complex  
D) MCP tools are executing instead of coordinating  

**Correct Answer: B**  
**Explanation**: The most common cause of coordination failure is agents not following the mandatory hook protocol for memory sharing and state updates.

## Scoring

- **13-15 correct**: Master Level - You understand Claude Flow principles completely
- **10-12 correct**: Advanced Level - Good understanding with minor gaps
- **7-9 correct**: Intermediate Level - Basic understanding, need more practice
- **Below 7**: Beginner Level - Review course materials and retake quiz

## Answer Key Summary

1. B - Golden Rule: One message = all related operations
2. C - 2.8-4.4x speed improvement
3. C - 5-10+ todos minimum per TodoWrite
4. B - Batch all operations in single message
5. C - MCP tools coordinate, don't execute
6. C - MCP tools never handle file operations
7. C - MCP setup → Claude Code execution → MCP storage
8. B - Spawn ALL agents in ONE message
9. C - 8-12 agents for complex tasks
10. B - pre-task and session-restore hooks required
11. C - Memory for ALL cross-agent coordination
12. C - All related operations in 1 message
13. B - Parallel approach with batched operations
14. B - Run post-edit hook after file operations
15. B - Missing hook coordination is common failure cause