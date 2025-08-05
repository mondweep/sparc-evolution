export const projectsConfig = [
  {
    id: 1,
    title: "Hello Swarm",
    subtitle: "Basic Introduction to rUv-Swarm",
    description: "Learn fundamental concepts of swarm-based coordination and ruv-swarm commands",
    difficulty: "Beginner",
    estimatedTime: "20 minutes",
    icon: "🐝",
    color: "from-blue-500 to-cyan-500",
    objectives: [
      "Initialize a swarm with different topologies",
      "Spawn various types of agents", 
      "Understand agent roles and communication",
      "Use memory for persistence",
      "Monitor swarm performance"
    ],
    concepts: [
      { name: "Swarm Topologies", description: "Mesh, Hierarchical, Star, and Ring patterns" },
      { name: "Agent Types", description: "Researcher, Coder, Analyst, Tester, Coordinator, Architect" },
      { name: "Memory System", description: "Persistent storage and key-value based knowledge sharing" }
    ],
    commands: [
      {
        command: "npx ruv-swarm init --topology mesh --agents 4",
        description: "Initialize a mesh topology swarm with 4 agents",
        output: "✅ Swarm initialized with mesh topology"
      },
      {
        command: "npx ruv-swarm status",
        description: "Check current swarm status",
        output: "🐝 Swarm Status: ACTIVE\\n├── Topology: mesh\\n├── Agents: 4/4 active"
      },
      {
        command: "npx ruv-swarm hook pre-task --description \"Learning ruv-swarm basics\"",
        description: "Test pre-task hook for coordination",
        output: "🔧 Pre-task hook executed successfully"
      }
    ],
    codeExample: `#!/usr/bin/env node

/**
 * Project 1: Hello Swarm - Basic Introduction
 * Learning objectives:
 * - Understand ruv-swarm architecture
 * - Initialize a basic swarm
 * - Learn about hooks and coordination
 */

const { execSync } = require('child_process');

console.log('🐝 Welcome to Hello Swarm!');

// Initialize swarm with mesh topology
execSync('npx ruv-swarm init --topology mesh --agents 4');

// Check status
const status = execSync('npx ruv-swarm status', { encoding: 'utf-8' });
console.log(status);`,
    experiments: [
      {
        title: "Change Topology",
        description: "Try different topologies to see communication patterns",
        command: "npx ruv-swarm init --topology hierarchical --agents 5"
      },
      {
        title: "Add More Agents", 
        description: "Spawn additional agents of different types",
        command: "npx ruv-swarm agent spawn --type tester --name \"Eve\""
      },
      {
        title: "Memory Operations",
        description: "Store and retrieve data in swarm memory",
        command: "npx ruv-swarm memory store --key \"project-data\" --value '{\"status\": \"learning\"}'"
      }
    ]
  },
  
  {
    id: 2,
    title: "Task Coordinator", 
    subtitle: "Multi-Agent Task Orchestration",
    description: "Build a task coordination system using MCP tools and multiple specialized agents",
    difficulty: "Intermediate",
    estimatedTime: "45 minutes",
    icon: "🎯",
    color: "from-purple-500 to-pink-500",
    objectives: [
      "Use MCP tools for coordination",
      "Orchestrate complex multi-step workflows",
      "Implement agent specialization patterns",
      "Track performance metrics",
      "Store coordination data in database"
    ],
    concepts: [
      { name: "MCP Integration", description: "Model Context Protocol tools for Claude Code integration" },
      { name: "Agent Specialization", description: "TaskMaster, DataAnalyzer, SystemDesigner roles" },
      { name: "Database Persistence", description: "SQLite storage for coordination events" }
    ],
    commands: [
      {
        command: "npx ruv-swarm init --topology hierarchical --agents 6",
        description: "Initialize hierarchical swarm for task coordination",
        output: "✅ Hierarchical swarm initialized with 6 agents"
      },
      {
        command: "npx ruv-swarm task orchestrate --task \"Build REST API\" --strategy adaptive",
        description: "Orchestrate complex task with adaptive strategy",
        output: "🎯 Task orchestration started with 6 specialized agents"
      }
    ],
    codeExample: `// Task Coordinator with specialized agents
class TaskCoordinator {
  constructor() {
    this.agents = [
      { type: 'TaskMaster', role: 'Coordinates overall workflow' },
      { type: 'DataAnalyzer', role: 'Analyzes requirements and data' },
      { type: 'SystemDesigner', role: 'Designs system architecture' },
      { type: 'Developer1', role: 'Implements backend features' },
      { type: 'Developer2', role: 'Implements frontend features' },
      { type: 'QualityAssurer', role: 'Tests and validates implementation' }
    ];
  }

  async orchestrateTask(task) {
    // Initialize hierarchical swarm
    await this.runSwarmCommand('init --topology hierarchical --agents 6');
    
    // Assign specialized roles
    for (const agent of this.agents) {
      await this.assignAgentRole(agent);
    }
    
    // Execute coordinated workflow
    return await this.executeWorkflow(task);
  }
}`,
    experiments: [
      {
        title: "Different Agent Counts",
        description: "Try coordination with different numbers of agents",
        command: "npx ruv-swarm init --agents 3"
      },
      {
        title: "Complex Task Orchestration",
        description: "Orchestrate multi-phase development projects", 
        command: "npx ruv-swarm task orchestrate --task \"Full-stack app\" --phases 5"
      }
    ]
  },

  {
    id: 3,
    title: "Memory Chatbot",
    subtitle: "Persistent Memory Systems", 
    description: "Create an intelligent chatbot that learns and remembers across conversations",
    difficulty: "Intermediate",
    estimatedTime: "35 minutes",
    icon: "🧠",
    color: "from-green-500 to-teal-500",
    objectives: [
      "Implement persistent memory across sessions",
      "Build conversational AI with context",
      "Use memory for learning and adaptation",
      "Create intelligent response generation",
      "Track conversation history and patterns"
    ],
    concepts: [
      { name: "Persistent Memory", description: "Cross-session data storage and retrieval" },
      { name: "Context Management", description: "Maintaining conversation context and history" },
      { name: "Learning Patterns", description: "Adapting responses based on interaction history" }
    ],
    commands: [
      {
        command: "npx ruv-swarm memory store --key \"user-preferences\" --value '{\"name\": \"Alice\"}'",
        description: "Store user preferences in persistent memory",
        output: "💾 Memory stored successfully"
      },
      {
        command: "npx ruv-swarm memory retrieve --key \"conversation-*\"",
        description: "Retrieve conversation history",
        output: "🧠 Retrieved 15 conversation entries"
      }
    ],
    codeExample: `class MemoryChatbot {
  constructor() {
    this.conversationHistory = [];
    this.userContext = new Map();
  }

  async chat(message, userId) {
    // Retrieve user context from persistent memory
    const context = await this.getContext(userId);
    
    // Generate contextual response
    const response = await this.generateResponse(message, context);
    
    // Store conversation in memory
    await this.storeConversation(userId, message, response);
    
    return response;
  }

  async getContext(userId) {
    return await this.runSwarmCommand(
      \`memory retrieve --key "user-\${userId}-context"\`
    );
  }
}`
  },

  {
    id: 4, 
    title: "Code Analyzer",
    subtitle: "Multi-Agent Code Analysis",
    description: "Build a comprehensive code analysis system using swarm intelligence",
    difficulty: "Advanced",
    estimatedTime: "50 minutes", 
    icon: "🔍",
    color: "from-orange-500 to-red-500",
    objectives: [
      "Analyze codebases with multiple specialized agents",
      "Detect patterns, issues, and improvements",
      "Generate comprehensive analysis reports",
      "Coordinate between analysis agents",
      "Provide actionable recommendations"
    ],
    concepts: [
      { name: "Code Pattern Recognition", description: "Identifying common patterns and anti-patterns" },
      { name: "Multi-Agent Analysis", description: "Coordinated analysis from different perspectives" },
      { name: "Report Generation", description: "Comprehensive analysis reporting" }
    ]
  },

  {
    id: 5,
    title: "API Builder", 
    subtitle: "Automated API Generation",
    description: "Automatically generate REST APIs using coordinated agent workflows",
    difficulty: "Advanced",
    estimatedTime: "60 minutes",
    icon: "🚀", 
    color: "from-cyan-500 to-blue-500",
    objectives: [
      "Generate REST API endpoints automatically",
      "Coordinate database schema design",
      "Implement authentication and validation",
      "Generate comprehensive documentation",
      "Deploy and test the generated API"
    ],
    concepts: [
      { name: "API Generation", description: "Automated endpoint and route creation" },
      { name: "Schema Coordination", description: "Database design through agent collaboration" },
      { name: "Documentation Automation", description: "Auto-generated API documentation" }
    ]
  },

  {
    id: 6,
    title: "Neural Learning",
    subtitle: "Advanced Neural Pattern Training", 
    description: "Demonstrate real machine learning with neural pattern training and adaptive learning",
    difficulty: "Expert",
    estimatedTime: "75 minutes",
    icon: "🧬",
    color: "from-pink-500 to-rose-500",
    objectives: [
      "Master advanced neural pattern recognition",
      "Implement adaptive learning systems", 
      "Create cross-agent knowledge transfer",
      "Develop self-improving coordination",
      "Measure learning performance improvements"
    ],
    concepts: [
      { name: "Neural Pattern Training", description: "Real machine learning with mathematical analysis" },
      { name: "Adaptive Learning", description: "Continuous improvement through experience" },
      { name: "Knowledge Transfer", description: "Cross-agent learning and pattern sharing" },
      { name: "Performance Metrics", description: "Measurable learning improvements and evolution" }
    ],
    commands: [
      {
        command: "node neural-learning-live-demo.js",
        description: "Run live neural learning demonstration",
        output: "🧠 NEURAL LEARNING: 90 patterns learned, 415% improvement"
      }
    ],
    codeExample: `class NeuralLearningAgent {
  constructor(type, dataFocus) {
    this.type = type;
    this.dataFocus = dataFocus; 
    this.confidence = 0.5;
    this.patterns = [];
  }

  async learnFromData(data) {
    // Mathematical analysis of coordination data
    const patterns = this.analyzePatterns(data);
    
    // Update confidence based on learning
    this.confidence += patterns.length * 0.02;
    
    // Store learned patterns
    this.patterns.push(...patterns);
    
    return {
      patternsLearned: patterns.length,
      confidence: this.confidence,
      totalPatterns: this.patterns.length
    };
  }
}`,
    specialFeatures: [
      {
        title: "Real Mathematical Learning",
        description: "Actual calculations: avgDuration = 8500ms ÷ 8 = 1063ms",
        icon: "🧮"
      },
      {
        title: "Measurable Evolution", 
        description: "Confidence growth: 50.0% → 94.3% across all agents",
        icon: "📈"
      },
      {
        title: "Knowledge Transfer",
        description: "Cross-agent pattern sharing in ring topology",
        icon: "🔄"
      },
      {
        title: "Performance Gains",
        description: "415% cumulative improvement through learning",
        icon: "🚀"
      }
    ]
  },

  {
    id: 7,
    title: "Real-World App",
    subtitle: "Full-Stack Application Coordination",
    description: "Build a complete real-world application using all learned swarm coordination techniques",
    difficulty: "Expert", 
    estimatedTime: "90 minutes",
    icon: "🏗️",
    color: "from-violet-500 to-purple-500",
    objectives: [
      "Integrate all previous learning into one project",
      "Build full-stack application with swarm coordination", 
      "Implement advanced agent workflows",
      "Deploy production-ready application",
      "Demonstrate mastery of swarm intelligence"
    ],
    concepts: [
      { name: "Full-Stack Coordination", description: "Frontend, backend, and database agent coordination" },
      { name: "Production Deployment", description: "Real-world application deployment patterns" },
      { name: "Advanced Integration", description: "Combining all learned swarm techniques" }
    ]
  }
];

export const getProjectById = (id) => {
  return projectsConfig.find(project => project.id === parseInt(id));
};

export const getNextProject = (currentId) => {
  const nextId = parseInt(currentId) + 1;
  return nextId <= projectsConfig.length ? getProjectById(nextId) : null;
};

export const getPreviousProject = (currentId) => {
  const prevId = parseInt(currentId) - 1;
  return prevId >= 1 ? getProjectById(prevId) : null;
};