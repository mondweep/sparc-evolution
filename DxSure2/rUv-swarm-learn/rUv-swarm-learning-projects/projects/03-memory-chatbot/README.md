# Project 3: Memory-Based Chat Bot

## Overview
This project demonstrates how to use ruv-swarm's persistent memory features to build a conversational agent that remembers user information across sessions. The bot learns about users and provides contextual responses based on stored memories.

## Learning Objectives
- Understand persistent memory storage and retrieval
- Implement context management across sessions
- Build conversational agents with memory
- Create advanced memory query patterns
- Use ruv-swarm hooks for conversation tracking

## Key Features

### 🧠 Memory Capabilities
- **User Profile**: Remembers name, age, location, interests, job
- **Conversation History**: Stores recent conversations
- **Session Management**: Tracks chat sessions over time
- **Persistent Storage**: Survives application restarts

### 🤖 Conversational Features
- **Natural Language Processing**: Extracts information from casual conversation
- **Contextual Responses**: Uses memory to personalize interactions
- **Intent Recognition**: Understands different types of user requests
- **Help System**: Built-in guidance for users

### 🔧 ruv-swarm Integration
- **Star Topology**: Centralized coordination for chat management
- **Hook System**: Tracks conversation events and memory updates
- **Memory Simulation**: Demonstrates how MCP tools would work
- **Performance Tracking**: Monitors chat session metrics

## How It Works

### 1. Memory Storage Pattern
```javascript
memoryKeys = {
  profile: 'user/profile',           // User information
  conversation: 'conversation/history', // Chat history
  preferences: 'user/preferences',   // User preferences
  context: 'session/context'         // Session context
}
```

### 2. Information Extraction
The bot uses pattern matching to extract information:
- **Name**: "My name is John", "I'm Sarah", "Call me Mike"
- **Age**: "I am 25", "I'm 30 years old"
- **Location**: "I live in New York", "I'm from London"
- **Interests**: "I like coding", "I enjoy music"
- **Job**: "I work as a developer", "I'm a teacher"

### 3. Contextual Responses
Based on stored memory, the bot provides personalized responses:
- Uses user's name in conversations
- References previously mentioned interests
- Connects current topics to stored information

## Running the Project

### Basic Usage
```bash
# Start the chat bot
node memory-chatbot.js

# The bot will:
# 1. Initialize ruv-swarm coordination
# 2. Load any existing memory
# 3. Start the conversation interface
```

### Interactive Commands
- **General chat**: Just type naturally
- **help**: Show available commands
- **memory**: Display what the bot remembers
- **clear**: Clear all stored memory (with confirmation)
- **quit**: Exit the chat bot

### Sample Conversation
```
🤖 Bot > Hello! I'm your memory-based chat bot.
I don't know you yet, but I'd love to learn about you! 🌟

You > Hi, my name is Alex and I'm 28 years old
🧠 Learning: name = Alex
🧠 Learning: age = 28
🤖 Bot > Got it! I'll remember that. 🧠 Alex!

You > I work as a software engineer
🧠 Learning: job = software engineer
🤖 Bot > Thanks for sharing! I've stored that information. 💾 Alex!

You > What do you remember about me?
🤖 Bot > Here's what I remember about you:
• Your name is Alex
• You're 28 years old
• You work as software engineer 📚
```

## Memory Architecture

### Local Storage Simulation
```json
{
  "profile": {
    "name": "Alex",
    "age": "28",
    "job": "software engineer",
    "location": "San Francisco",
    "interest": "coding"
  },
  "recentConversations": [
    {
      "timestamp": "2025-01-01T10:30:00Z",
      "user": "Hi, my name is Alex",
      "bot": "Nice to meet you, Alex!",
      "analysis": {
        "intent": "memory_update",
        "memoryItems": [{"type": "name", "value": "Alex"}]
      }
    }
  ],
  "lastActive": "2025-01-01T10:30:00Z",
  "sessionId": "chat-1641034200000"
}
```

### ruv-swarm Integration
In a real implementation with MCP tools:
```javascript
// Initialize memory-focused swarm
mcp__ruv-swarm__swarm_init({ 
  topology: 'star', 
  maxAgents: 4, 
  strategy: 'memory-optimized' 
})

// Store user information
mcp__ruv-swarm__memory_usage({
  action: 'store',
  key: 'user/profile/alex',
  value: userProfile
})

// Retrieve conversation context
mcp__ruv-swarm__memory_usage({
  action: 'retrieve',
  key: 'conversation/history',
  limit: 10
})
```

## Advanced Features

### 1. Pattern Recognition
The bot recognizes various conversation patterns:
- **Identity sharing**: Name, age, location
- **Interest expression**: Likes, dislikes, hobbies
- **Work context**: Job, profession, workplace
- **Memory queries**: "What do you remember?"
- **Help requests**: Need assistance or guidance

### 2. Context Awareness
- **Personalized greetings**: Uses stored name
- **Interest connections**: Links topics to known interests
- **Conversation continuity**: References previous interactions
- **Progressive learning**: Builds knowledge over time

### 3. Memory Management
- **Automatic saving**: Stores information during conversation
- **Periodic backups**: Saves conversation history every 5 messages
- **Session tracking**: Maintains session IDs and timestamps
- **Memory cleanup**: Option to clear stored information

## Real-World Applications

### 1. Customer Service Bots
- Remember customer preferences and history
- Provide personalized support experiences
- Track issue resolution across sessions

### 2. Educational Assistants
- Track student progress and learning preferences
- Adapt teaching methods based on student profile
- Remember previous lessons and topics covered

### 3. Personal AI Assistants
- Learn user habits and preferences
- Provide contextual recommendations
- Maintain long-term relationship with user

### 4. Healthcare Chatbots
- Remember patient medical history
- Track symptoms and treatments over time
- Provide personalized health advice

## Learning Insights

### Memory vs Stateless
**Traditional Chatbots** (stateless):
- Treat each conversation as new
- No context between sessions
- Generic responses
- Limited personalization

**Memory-Based Chatbots**:
- Build user profiles over time
- Maintain conversation context
- Personalized interactions
- Relationship development

### Storage Strategies
1. **Key-Value Storage**: Simple profile information
2. **Conversation Logs**: Historical interaction data
3. **Session Management**: Temporal context tracking
4. **Preference Learning**: Behavioral pattern storage

## Performance Considerations

### Memory Efficiency
- Store only relevant information
- Implement memory expiration policies
- Use compression for large datasets
- Regular cleanup of old sessions

### Response Time
- Cache frequently accessed memories
- Use efficient query patterns
- Implement lazy loading for large profiles
- Optimize pattern matching algorithms

## Next Steps

After mastering this project, you can:
1. **Add emotion recognition** to memory storage
2. **Implement memory search** with natural language
3. **Create memory sharing** between multiple bots
4. **Build conversation summarization** features
5. **Add voice interface** with memory integration

## Integration with Claude Code

When using with Claude Code's MCP tools:
```javascript
// Initialize memory-focused swarm
await mcp__ruv-swarm__swarm_init({
  topology: 'star',
  maxAgents: 4,
  strategy: 'memory-focused'
})

// Create memory management agents
await mcp__ruv-swarm__agent_spawn({
  type: 'memory_manager',
  name: 'ProfileKeeper'
})

// Orchestrate conversation with memory
await mcp__ruv-swarm__task_orchestrate({
  task: 'Manage conversational memory',
  strategy: 'adaptive',
  memory: true
})
```

This project provides the foundation for building sophisticated conversational AI systems that can maintain context and build relationships with users over time.