#!/usr/bin/env node

/**
 * Project 1: Hello Swarm - Basic Introduction
 * Learning objectives:
 * - Understand ruv-swarm architecture
 * - Initialize a basic swarm
 * - Learn about hooks and coordination
 * - Understand the separation between ruv-swarm (coordination) and Claude Code (execution)
 */

const { execSync } = require('child_process');

console.log('🐝 Welcome to Hello Swarm - Your First ruv-swarm Application!\n');
console.log('📚 This tutorial demonstrates the basics of ruv-swarm coordination.\n');

// Helper function to execute commands
function runCommand(command, description) {
  console.log(`\n📋 ${description}`);
  console.log(`🔧 Command: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    console.log('✅ Output:', output.trim());
    return output;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('=== PART 1: Understanding ruv-swarm Architecture ===');
  console.log('\nruv-swarm provides:');
  console.log('  🧠 Coordination layer for AI agents');
  console.log('  💾 Persistent memory across sessions');
  console.log('  🔄 Hooks for workflow automation');
  console.log('  📊 Performance tracking and optimization');
  console.log('\nClaude Code provides:');
  console.log('  ✍️  All file operations and code generation');
  console.log('  🖥️  Command execution and system operations');
  console.log('  🔧 Implementation of actual work');
  
  console.log('\n=== PART 2: Check ruv-swarm Installation ===');
  
  // Check version
  runCommand(
    'npx ruv-swarm --version',
    'Checking ruv-swarm version'
  );

  // Check available commands
  runCommand(
    'npx ruv-swarm --help',
    'Viewing available commands'
  );

  console.log('\n=== PART 3: Initialize a Basic Swarm ===');
  
  // Initialize swarm with different topologies
  console.log('\n🔍 Swarm topologies available:');
  console.log('  - mesh: All agents communicate with each other');
  console.log('  - hierarchical: Tree structure with parent-child relationships');
  console.log('  - star: Central coordinator with peripheral agents');
  console.log('  - ring: Circular communication pattern');
  
  runCommand(
    'npx ruv-swarm init --topology mesh --agents 4',
    'Initializing a mesh topology swarm with 4 agents'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check status
  runCommand(
    'npx ruv-swarm status',
    'Checking swarm status'
  );

  console.log('\n=== PART 4: Understanding Hooks ===');
  console.log('\nHooks allow automated coordination:');
  console.log('  - pre-task: Before starting work');
  console.log('  - post-edit: After file modifications');
  console.log('  - notification: For sharing updates');
  console.log('  - session management: Save/restore state');
  
  // Test a simple hook
  runCommand(
    'npx ruv-swarm hook pre-task --description "Learning ruv-swarm basics"',
    'Testing pre-task hook'
  );

  console.log('\n=== PART 5: Working with MCP Server ===');
  console.log('\nThe MCP server enables:');
  console.log('  - Integration with Claude Code');
  console.log('  - Access to coordination tools via mcp__ruv-swarm__ prefix');
  console.log('  - Real-time swarm monitoring');
  console.log('\nTo use with Claude Code:');
  console.log('  1. Add MCP server: claude mcp add ruv-swarm npx ruv-swarm mcp start');
  console.log('  2. Use tools like mcp__ruv-swarm__swarm_init in Claude Code');

  console.log('\n=== PART 6: Key Concepts Summary ===');
  console.log('\n✅ What we learned:');
  console.log('  1. ruv-swarm is a coordination layer, not an executor');
  console.log('  2. It provides swarm topologies for different use cases');
  console.log('  3. Hooks enable workflow automation');
  console.log('  4. MCP integration allows Claude Code to use swarm features');
  console.log('  5. Agents are cognitive patterns, not actual code writers');
  
  console.log('\n🎯 Real-world analogy:');
  console.log('  Think of ruv-swarm as a project manager (coordination)');
  console.log('  And Claude Code as the development team (execution)');
  
  console.log('\n🚀 Ready for Project 2?');
  console.log('  Next, we\'ll build a Task Coordinator that uses MCP tools');
  console.log('  to orchestrate complex multi-step workflows!');
}

// Run the application
main().catch(error => {
  console.error('Application error:', error);
  process.exit(1);
});