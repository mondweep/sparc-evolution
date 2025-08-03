#!/usr/bin/env node

/**
 * Project 3: Memory-Based Chat Bot
 * Learning objectives:
 * - Persistent memory storage and retrieval
 * - Context management across sessions
 * - Building conversational agents with memory
 * - Advanced memory query patterns
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

console.log('🤖 Memory-Based Chat Bot with ruv-swarm\n');

class MemoryChatBot {
  constructor() {
    this.sessionId = `chat-${Date.now()}`;
    this.conversationHistory = [];
    this.userProfile = {};
    this.memoryKeys = {
      profile: 'user/profile',
      conversation: 'conversation/history',
      preferences: 'user/preferences',
      context: 'session/context'
    };
    
    // Initialize readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Helper to run ruv-swarm commands
  runSwarmCommand(command, silent = false) {
    if (!silent) console.log(`🔧 ${command}`);
    try {
      return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
      if (!silent) console.error(`❌ Error: ${error.message}`);
      return null;
    }
  }

  // Initialize swarm and memory system
  async initializeBot() {
    console.log('🚀 Initializing Memory-Based Chat Bot...\n');
    
    // Initialize swarm with star topology (good for centralized chat coordination)
    console.log('1. Setting up swarm coordination...');
    this.runSwarmCommand(
      'npx ruv-swarm init --topology star --agents 4 --strategy adaptive'
    );

    // Pre-task hook to start conversation session
    this.runSwarmCommand(
      `npx ruv-swarm hook pre-task --description "Starting chat session ${this.sessionId}"`,
      true
    );

    // Try to load existing user profile and conversation history
    await this.loadUserMemory();
    
    console.log('✅ Chat bot initialized and ready!\n');
    this.showWelcomeMessage();
  }

  // Load existing memory from previous sessions
  async loadUserMemory() {
    console.log('2. Loading memory from previous sessions...');
    
    // Simulate loading memory (in real implementation, this would use MCP tools)
    // For now, we'll use local storage simulation
    
    try {
      if (fs.existsSync('user-memory.json')) {
        const savedMemory = JSON.parse(fs.readFileSync('user-memory.json', 'utf8'));
        this.userProfile = savedMemory.profile || {};
        this.conversationHistory = savedMemory.recentConversations || [];
        console.log('✅ Loaded existing user memory');
        
        if (this.userProfile.name) {
          console.log(`👋 Welcome back, ${this.userProfile.name}!`);
        }
      } else {
        console.log('🆕 No previous memory found - starting fresh');
      }
    } catch (error) {
      console.log('⚠️  Could not load previous memory - starting fresh');
    }
  }

  // Save memory to persistent storage
  async saveMemory(key, data) {
    // Simulate ruv-swarm memory storage
    console.log(`💾 Storing to memory: ${key}`);
    
    // Use hook to simulate memory storage
    this.runSwarmCommand(
      `npx ruv-swarm hook notification --message "Storing memory: ${key}"`,
      true
    );

    // Local simulation of memory storage
    const memoryData = {
      profile: this.userProfile,
      recentConversations: this.conversationHistory.slice(-10), // Keep last 10 conversations
      lastActive: new Date().toISOString(),
      sessionId: this.sessionId
    };
    
    fs.writeFileSync('user-memory.json', JSON.stringify(memoryData, null, 2));
    return true;
  }

  // Analyze user input for memory extraction
  analyzeUserInput(input) {
    const analysis = {
      intent: 'general',
      entities: [],
      sentiment: 'neutral',
      memoryItems: []
    };

    // Simple pattern matching for memory extraction
    const patterns = {
      name: /my name is (\w+)|i'm (\w+)|call me (\w+)/i,
      age: /i am (\d+)|i'm (\d+) years old/i,
      location: /i live in ([^,.\n]+)|i'm from ([^,.\n]+)/i,
      interest: /i like ([^,.\n]+)|i enjoy ([^,.\n]+)|i love ([^,.\n]+)/i,
      job: /i work as ([^,.\n]+)|my job is ([^,.\n]+)|i'm a ([^,.\n]+)/i
    };

    // Extract information for memory
    Object.keys(patterns).forEach(key => {
      const match = input.match(patterns[key]);
      if (match) {
        const value = match[1] || match[2] || match[3];
        if (value) {
          analysis.memoryItems.push({ type: key, value: value.trim() });
        }
      }
    });

    // Determine intent
    if (input.toLowerCase().includes('remember') || input.toLowerCase().includes('recall')) {
      analysis.intent = 'memory_query';
    } else if (analysis.memoryItems.length > 0) {
      analysis.intent = 'memory_update';
    } else if (input.toLowerCase().includes('help')) {
      analysis.intent = 'help';
    }

    return analysis;
  }

  // Update user profile with new information
  updateUserProfile(memoryItems) {
    let updated = false;
    
    memoryItems.forEach(item => {
      if (this.userProfile[item.type] !== item.value) {
        console.log(`🧠 Learning: ${item.type} = ${item.value}`);
        this.userProfile[item.type] = item.value;
        updated = true;
      }
    });

    if (updated) {
      this.saveMemory(this.memoryKeys.profile, this.userProfile);
    }

    return updated;
  }

  // Generate contextual response based on memory
  generateResponse(input, analysis) {
    let response = '';

    switch (analysis.intent) {
      case 'memory_update':
        this.updateUserProfile(analysis.memoryItems);
        response = this.getMemoryUpdateResponse(analysis.memoryItems);
        break;
        
      case 'memory_query':
        response = this.getMemoryQueryResponse(input);
        break;
        
      case 'help':
        response = this.getHelpResponse();
        break;
        
      default:
        response = this.getContextualResponse(input);
    }

    return response;
  }

  // Response for memory updates
  getMemoryUpdateResponse(memoryItems) {
    const responses = [
      "Got it! I'll remember that. 🧠",
      "Thanks for sharing! I've stored that information. 💾",
      "Interesting! I'll keep that in mind. ✨",
      "I've made a note of that. 📝"
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add personalized touch if we know their name
    if (this.userProfile.name) {
      return `${baseResponse} ${this.userProfile.name}!`;
    }
    
    return baseResponse;
  }

  // Response for memory queries
  getMemoryQueryResponse(input) {
    const memories = [];
    
    if (this.userProfile.name) {
      memories.push(`Your name is ${this.userProfile.name}`);
    }
    if (this.userProfile.age) {
      memories.push(`You're ${this.userProfile.age} years old`);
    }
    if (this.userProfile.location) {
      memories.push(`You live in ${this.userProfile.location}`);
    }
    if (this.userProfile.job) {
      memories.push(`You work as ${this.userProfile.job}`);
    }
    if (this.userProfile.interest) {
      memories.push(`You like ${this.userProfile.interest}`);
    }

    if (memories.length === 0) {
      return "I don't have much information about you yet. Tell me about yourself! 🤔";
    }

    return `Here's what I remember about you:\n${memories.map(m => `• ${m}`).join('\n')} 📚`;
  }

  // Contextual response using memory
  getContextualResponse(input) {
    const responses = [];

    // Personalized responses based on profile
    if (this.userProfile.name) {
      responses.push(`That's interesting, ${this.userProfile.name}!`);
      responses.push(`I see, ${this.userProfile.name}.`);
    }

    if (this.userProfile.interest && input.toLowerCase().includes(this.userProfile.interest.toLowerCase())) {
      responses.push(`I remember you mentioned you like ${this.userProfile.interest}! Tell me more about that.`);
    }

    if (this.userProfile.job && (input.toLowerCase().includes('work') || input.toLowerCase().includes('job'))) {
      responses.push(`Speaking of work, how are things going as ${this.userProfile.job}?`);
    }

    // Default responses
    const defaultResponses = [
      "That's fascinating! Tell me more. 🤔",
      "Interesting perspective! 💭",
      "I'd love to learn more about that. 🌟",
      "That sounds intriguing! 🚀"
    ];

    const allResponses = [...responses, ...defaultResponses];
    return allResponses[Math.floor(Math.random() * allResponses.length)];
  }

  // Help response
  getHelpResponse() {
    return `🤖 I'm a memory-based chat bot! Here's what I can do:

💾 **Memory Features:**
• Remember your name, age, location, interests, and job
• Recall information from previous conversations
• Build context over time

🗣️ **Try saying:**
• "My name is [your name]"
• "I'm [age] years old"
• "I live in [location]"
• "I work as [job]"
• "I like [interest]"
• "What do you remember about me?"

✨ **Commands:**
• 'help' - Show this help
• 'memory' - Show what I remember
• 'clear' - Clear memory (with confirmation)
• 'quit' - Exit the chat bot

Just chat naturally and I'll learn about you! 🌟`;
  }

  // Show welcome message
  showWelcomeMessage() {
    let welcome = "🤖 Hello! I'm your memory-based chat bot.\n";
    
    if (this.userProfile.name) {
      welcome += `Welcome back, ${this.userProfile.name}! 👋\n`;
    } else {
      welcome += "I don't know you yet, but I'd love to learn about you! 🌟\n";
    }
    
    welcome += "\nType 'help' for commands or just start chatting!\n";
    welcome += "I'll remember our conversation for next time. 💾\n";
    
    console.log(welcome);
  }

  // Main chat loop
  async startChat() {
    console.log("📝 Chat started! (Type 'quit' to exit)\n");
    
    const askQuestion = () => {
      const prompt = this.userProfile.name ? `${this.userProfile.name} > ` : 'You > ';
      
      this.rl.question(prompt, async (input) => {
        if (input.toLowerCase() === 'quit') {
          await this.endChat();
          return;
        }

        if (input.toLowerCase() === 'clear') {
          await this.clearMemory();
          askQuestion();
          return;
        }

        if (input.toLowerCase() === 'memory') {
          console.log('\n' + this.getMemoryQueryResponse(input) + '\n');
          askQuestion();
          return;
        }

        // Process the input
        const analysis = this.analyzeUserInput(input);
        const response = this.generateResponse(input, analysis);
        
        // Store conversation
        this.conversationHistory.push({
          timestamp: new Date().toISOString(),
          user: input,
          bot: response,
          analysis: analysis
        });

        // Save conversation history periodically
        if (this.conversationHistory.length % 5 === 0) {
          await this.saveMemory(this.memoryKeys.conversation, this.conversationHistory);
        }

        // Post-edit hook for conversation tracking
        this.runSwarmCommand(
          `npx ruv-swarm hook post-edit --file "conversation-${this.sessionId}.log"`,
          true
        );

        console.log(`\n🤖 Bot > ${response}\n`);
        
        askQuestion();
      });
    };

    askQuestion();
  }

  // Clear memory with confirmation
  async clearMemory() {
    console.log('\n⚠️  This will clear all stored memory about you.');
    this.rl.question('Are you sure? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        this.userProfile = {};
        this.conversationHistory = [];
        
        // Remove local memory file
        if (fs.existsSync('user-memory.json')) {
          fs.unlinkSync('user-memory.json');
        }
        
        console.log('🧹 Memory cleared! Starting fresh.\n');
        
        // Notify swarm
        this.runSwarmCommand(
          'npx ruv-swarm hook notification --message "User memory cleared"',
          true
        );
      } else {
        console.log('Memory preserved.\n');
      }
    });
  }

  // End chat session
  async endChat() {
    console.log('\n🤖 Thanks for chatting! Your memories have been saved. 💾');
    
    // Final memory save
    await this.saveMemory('session/final', {
      endTime: new Date().toISOString(),
      conversationCount: this.conversationHistory.length,
      sessionId: this.sessionId
    });

    // Post-task hook
    this.runSwarmCommand(
      `npx ruv-swarm hook post-task --task-id "chat-session-${this.sessionId}" --analyze-performance true`,
      true
    );

    // Show session stats
    console.log(`\n📊 Session Stats:`);
    console.log(`   Messages exchanged: ${this.conversationHistory.length}`);
    console.log(`   Information learned: ${Object.keys(this.userProfile).length} items`);
    console.log(`   Session ID: ${this.sessionId}`);
    
    if (this.userProfile.name) {
      console.log(`   Until next time, ${this.userProfile.name}! 👋`);
    }

    this.rl.close();
    process.exit(0);
  }
}

// Main execution
async function main() {
  const chatBot = new MemoryChatBot();
  
  try {
    await chatBot.initializeBot();
    await chatBot.startChat();
  } catch (error) {
    console.error('💥 Chat bot error:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Goodbye! Saving memories...');
  process.exit(0);
});

// Run the chat bot
main().catch(console.error);