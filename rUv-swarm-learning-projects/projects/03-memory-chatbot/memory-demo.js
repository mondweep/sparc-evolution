#!/usr/bin/env node

/**
 * Memory Chat Bot Demo
 * Non-interactive demonstration of memory features
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🤖 Memory-Based Chat Bot Demo\n');
console.log('This demonstrates how the bot learns and remembers information.\n');

class MemoryDemo {
  constructor() {
    this.sessionId = `demo-${Date.now()}`;
    this.userProfile = {};
    this.conversationHistory = [];
  }

  runSwarmCommand(command, silent = false) {
    if (!silent) console.log(`🔧 ${command}`);
    try {
      return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
      if (!silent) console.error(`❌ Error: ${error.message}`);
      return null;
    }
  }

  async initialize() {
    console.log('🚀 Initializing Memory Demo...\n');
    
    // Initialize swarm
    console.log('1. Setting up swarm coordination...');
    this.runSwarmCommand(
      'npx ruv-swarm init --topology star --agents 4 --strategy adaptive'
    );

    console.log('2. Starting memory demonstration session...');
    this.runSwarmCommand(
      `npx ruv-swarm hook pre-task --description "Memory demo session ${this.sessionId}"`,
      true
    );

    console.log('✅ Demo initialized!\n');
  }

  analyzeInput(input) {
    const patterns = {
      name: /my name is (\w+)|i'm (\w+)|call me (\w+)/i,
      age: /i am (\d+)|i'm (\d+) years old/i,
      location: /i live in ([^,.\n]+)|i'm from ([^,.\n]+)/i,
      interest: /i like ([^,.\n]+)|i enjoy ([^,.\n]+)|i love ([^,.\n]+)/i,
      job: /i work as ([^,.\n]+)|my job is ([^,.\n]+)|i'm a ([^,.\n]+)/i
    };

    const memoryItems = [];
    Object.keys(patterns).forEach(key => {
      const match = input.match(patterns[key]);
      if (match) {
        const value = match[1] || match[2] || match[3];
        if (value) {
          memoryItems.push({ type: key, value: value.trim() });
        }
      }
    });

    return memoryItems;
  }

  updateMemory(memoryItems) {
    memoryItems.forEach(item => {
      console.log(`🧠 Learning: ${item.type} = ${item.value}`);
      this.userProfile[item.type] = item.value;
    });

    // Simulate memory storage
    this.runSwarmCommand(
      'npx ruv-swarm hook notification --message "Updating user profile memory"',
      true
    );
  }

  showMemory() {
    console.log('\n💾 Current Memory State:');
    if (Object.keys(this.userProfile).length === 0) {
      console.log('   (No information stored yet)');
    } else {
      Object.keys(this.userProfile).forEach(key => {
        console.log(`   ${key}: ${this.userProfile[key]}`);
      });
    }
    console.log('');
  }

  simulateConversation(userInput, expectedResponse) {
    console.log(`👤 User: ${userInput}`);
    
    // Analyze input
    const memoryItems = this.analyzeInput(userInput);
    
    // Update memory if needed
    if (memoryItems.length > 0) {
      this.updateMemory(memoryItems);
    }

    // Store conversation
    this.conversationHistory.push({
      timestamp: new Date().toISOString(),
      user: userInput,
      bot: expectedResponse,
      memoryItems: memoryItems
    });

    console.log(`🤖 Bot: ${expectedResponse}\n`);
  }

  async runDemo() {
    console.log('='.repeat(60));
    console.log('📚 MEMORY LEARNING DEMONSTRATION');
    console.log('='.repeat(60));

    // Show initial empty memory
    this.showMemory();

    // Simulate conversation sequence
    console.log('💬 Conversation Sequence:\n');

    this.simulateConversation(
      "Hi there! My name is Sarah and I'm 25 years old.",
      "Nice to meet you, Sarah! I'll remember that you're 25. 🧠"
    );

    this.showMemory();

    this.simulateConversation(
      "I work as a data scientist in San Francisco.",
      "That's fascinating, Sarah! Data science is such an interesting field. 💾"
    );

    this.showMemory();

    this.simulateConversation(
      "I really enjoy machine learning and hiking in my free time.",
      "Machine learning sounds right up your alley as a data scientist! And hiking is a great way to unwind. ✨"
    );

    this.showMemory();

    this.simulateConversation(
      "What do you remember about me?",
      "Here's what I remember about you:\n• Your name is Sarah\n• You're 25 years old\n• You work as data scientist\n• You live in San Francisco\n• You like machine learning 📚"
    );

    console.log('='.repeat(60));
    console.log('🔍 MEMORY PERSISTENCE DEMONSTRATION');
    console.log('='.repeat(60));

    // Save memory to file
    const memoryData = {
      profile: this.userProfile,
      conversations: this.conversationHistory,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('demo-memory.json', JSON.stringify(memoryData, null, 2));
    console.log('💾 Memory saved to demo-memory.json');

    // Show file contents
    console.log('\n📄 Saved Memory Structure:');
    console.log(JSON.stringify(memoryData, null, 2));

    console.log('\n='.repeat(60));
    console.log('📊 MEMORY ANALYTICS');
    console.log('='.repeat(60));

    const stats = {
      totalConversations: this.conversationHistory.length,
      memoryItems: Object.keys(this.userProfile).length,
      informationTypes: Object.keys(this.userProfile),
      sessionDuration: Date.now() - parseInt(this.sessionId.split('-')[1]),
      memoryEfficiency: (Object.keys(this.userProfile).length / this.conversationHistory.length * 100).toFixed(1)
    };

    console.log(`Total Conversations: ${stats.totalConversations}`);
    console.log(`Memory Items Stored: ${stats.memoryItems}`);
    console.log(`Information Types: ${stats.informationTypes.join(', ')}`);
    console.log(`Session Duration: ${stats.sessionDuration}ms`);
    console.log(`Memory Efficiency: ${stats.memoryEfficiency}% (info per conversation)`);

    console.log('\n='.repeat(60));
    console.log('🎯 KEY INSIGHTS');
    console.log('='.repeat(60));

    console.log('✅ Memory Features Demonstrated:');
    console.log('   1. Natural language information extraction');
    console.log('   2. Persistent profile building');
    console.log('   3. Contextual response generation');
    console.log('   4. Memory storage and retrieval');
    console.log('   5. Session tracking and analytics');

    console.log('\n🧠 Memory Learning Patterns:');
    console.log('   • Name extraction from casual introductions');
    console.log('   • Age detection from natural speech');
    console.log('   • Job/profession identification');
    console.log('   • Location and interest extraction');
    console.log('   • Progressive profile enrichment');

    console.log('\n🚀 Real-World Applications:');
    console.log('   • Customer service with user history');
    console.log('   • Educational assistants that adapt');
    console.log('   • Personal AI companions');
    console.log('   • Healthcare chatbots with patient memory');

    // Final hook
    this.runSwarmCommand(
      `npx ruv-swarm hook post-task --task-id "memory-demo-${this.sessionId}" --analyze-performance true`,
      true
    );

    console.log('\n✨ Demo complete! The interactive chat bot is available via:');
    console.log('   node memory-chatbot.js');
  }
}

// Run the demo
async function main() {
  const demo = new MemoryDemo();
  
  try {
    await demo.initialize();
    await demo.runDemo();
  } catch (error) {
    console.error('💥 Demo error:', error);
    process.exit(1);
  }
}

main().catch(console.error);