# Claude Code Configuration - SPARC Development (Optimized)

## 🚨 CRITICAL: CONCURRENT EXECUTION

**GOLDEN RULE**: ALL operations MUST be in ONE message - NEVER sequential!

### ✅ CORRECT Pattern:
```javascript
[Single Message]:
  - TodoWrite { todos: [ALL 5-10+ todos] }
  - Task("Agent 1", "full instructions", "type")
  - Task("Agent 2", "full instructions", "type")
  - Read("file1.js"), Read("file2.js")
  - Write("out1.js"), Write("out2.js")
  - Bash("npm install"), Bash("npm test")
```

### ❌ WRONG Pattern:
```javascript
Message 1: TodoWrite { single todo }
Message 2: Task("Agent 1")
Message 3: Read("file1.js")
// 6x slower!
```

## SPARC Commands

### Core:
- `npx claude-flow sparc modes` - List modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute mode
- `npx claude-flow sparc tdd "<feature>"` - Full TDD workflow

### Batch (Parallel):
- `npx claude-flow sparc batch <modes> "<task>"` - Multiple modes
- `npx claude-flow sparc pipeline "<task>"` - Full pipeline

### Build:
- `npm run build/test/lint/typecheck`

## Available Agents (54 Total)

### Core: 
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Swarm:
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus:
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance:
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

### GitHub:
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

### SPARC:
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized:
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`, `tdd-london-swarm`, `production-validator`, `migration-planner`, `swarm-init`

## Agent Patterns

### Full-Stack (8 agents):
```bash
Task("Architecture", "...", "system-architect")
Task("Backend", "...", "backend-dev")
Task("Frontend", "...", "mobile-dev")
Task("Database", "...", "coder")
Task("API Docs", "...", "api-docs")
Task("CI/CD", "...", "cicd-engineer")
Task("Testing", "...", "performance-benchmarker")
Task("Validation", "...", "production-validator")
```

### Distributed Systems (6 agents):
```bash
Task("Byzantine", "...", "byzantine-coordinator")
Task("Raft", "...", "raft-manager")
Task("Gossip", "...", "gossip-coordinator")
Task("CRDT", "...", "crdt-synchronizer")
Task("Security", "...", "security-manager")
Task("Performance", "...", "perf-analyzer")
```

## Key Rules

### Claude Code DOES:
- ALL file operations (Read/Write/Edit)
- ALL code generation
- ALL bash commands
- ALL implementation
- ALL TodoWrite operations
- ALL git/npm operations

### MCP Tools ONLY:
- Coordination/planning
- Memory management
- Performance tracking
- Swarm orchestration

### Agent Coordination Protocol:
```bash
# BEFORE:
npx claude-flow@alpha hooks pre-task --description "[task]"

# DURING (after EVERY file op):
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "agent/[step]"

# AFTER:
npx claude-flow@alpha hooks post-task --task-id "[task]"
```

### TodoWrite Rules:
- ALWAYS batch 5-10+ todos in ONE call
- NEVER multiple TodoWrite calls
- Include ALL priority levels

### Task Tool Rules:
- SPAWN all agents in ONE message
- Include FULL instructions
- NEVER sequential spawning

## Performance Tips
- Batch Everything
- Parallel First
- Memory is Key
- Monitor Progress
- Auto-Optimize

## Links
- Docs: https://github.com/ruvnet/claude-flow
- SPARC: https://github.com/ruvnet/claude-code-flow/docs/sparc.md