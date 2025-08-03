#!/usr/bin/env node

/**
 * Project 4: Code Analyzer
 * Learning objectives:
 * - Multi-agent code review and analysis
 * - Pattern recognition in code
 * - Memory-based code intelligence
 * - Collaborative analysis workflows
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Code Analyzer - Multi-Agent Code Review System\n');

class CodeAnalyzer {
  constructor() {
    this.sessionId = `analysis-${Date.now()}`;
    this.analysisResults = [];
    this.codeMemory = {}; // Store patterns and insights
    this.agents = [];
    this.codePatterns = {
      security: [],
      performance: [],
      maintainability: [],
      bugs: [],
      suggestions: []
    };
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

  // Initialize swarm for code analysis
  async initializeSwarm() {
    console.log('🚀 Initializing Code Analysis Swarm...\n');
    
    // Use mesh topology for collaborative analysis
    console.log('1. Setting up mesh topology for collaborative analysis...');
    this.runSwarmCommand(
      'npx ruv-swarm init --topology mesh --agents 6 --strategy specialized'
    );

    // Pre-task hook
    this.runSwarmCommand(
      `npx ruv-swarm hook pre-task --description "Code analysis session ${this.sessionId}"`,
      true
    );

    // Define specialized code review agents
    this.defineAnalysisAgents();
    
    console.log('✅ Code analysis swarm initialized!\n');
  }

  // Define specialized agents for different aspects of code analysis
  defineAnalysisAgents() {
    this.agents = [
      {
        type: 'security',
        name: 'SecurityAuditor',
        role: 'Identifies security vulnerabilities and risks',
        expertise: ['SQL injection', 'XSS', 'authentication', 'data validation'],
        patterns: []
      },
      {
        type: 'performance',
        name: 'PerformanceOptimizer',
        role: 'Analyzes performance bottlenecks and inefficiencies',
        expertise: ['algorithmic complexity', 'memory usage', 'database queries', 'caching'],
        patterns: []
      },
      {
        type: 'maintainability',
        name: 'CodeQualityExpert',
        role: 'Evaluates code maintainability and best practices',
        expertise: ['code structure', 'naming conventions', 'documentation', 'design patterns'],
        patterns: []
      },
      {
        type: 'bugs',
        name: 'BugHunter',
        role: 'Detects potential bugs and logical errors',
        expertise: ['null pointers', 'race conditions', 'edge cases', 'error handling'],
        patterns: []
      },
      {
        type: 'architecture',
        name: 'ArchitectureReviewer',
        role: 'Evaluates overall system design and patterns',
        expertise: ['design patterns', 'separation of concerns', 'scalability', 'modularity'],
        patterns: []
      },
      {
        type: 'coordinator',
        name: 'ReviewCoordinator',
        role: 'Orchestrates analysis and synthesizes findings',
        expertise: ['prioritization', 'reporting', 'team coordination'],
        patterns: []
      }
    ];

    console.log('👥 Code Analysis Agents Defined:');
    this.agents.forEach(agent => {
      const emoji = this.getAgentEmoji(agent.type);
      console.log(`  ${emoji} ${agent.name}: ${agent.role}`);
    });
    console.log('');
  }

  getAgentEmoji(type) {
    const emojis = {
      security: '🛡️',
      performance: '⚡',
      maintainability: '🔧',
      bugs: '🐛',
      architecture: '🏗️',
      coordinator: '🎯'
    };
    return emojis[type] || '🤖';
  }

  // Create sample code files for analysis
  createSampleCode() {
    console.log('📝 Creating sample code files for analysis...\n');

    // Sample 1: Security issues
    const securityCode = `
// user-auth.js - Authentication module with security issues
const express = require('express');
const mysql = require('mysql');

function authenticateUser(username, password) {
    // SECURITY ISSUE: SQL Injection vulnerability
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    
    // SECURITY ISSUE: Database connection without proper error handling
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // SECURITY ISSUE: Empty password
        database: 'users'
    });
    
    connection.query(query, (error, results) => {
        if (error) {
            // SECURITY ISSUE: Exposing internal errors to client
            console.log("Database error: " + error);
            return null;
        }
        return results;
    });
}

// SECURITY ISSUE: No input validation
function createUser(userData) {
    const query = "INSERT INTO users VALUES ('" + userData.username + "', '" + userData.password + "')";
    // More vulnerable code...
}

module.exports = { authenticateUser, createUser };
`;

    // Sample 2: Performance issues
    const performanceCode = `
// data-processor.js - Data processing with performance issues
class DataProcessor {
    constructor() {
        this.cache = new Map();
    }

    // PERFORMANCE ISSUE: O(n²) algorithm
    findDuplicates(arr) {
        const duplicates = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    duplicates.push(arr[i]);
                }
            }
        }
        return duplicates;
    }

    // PERFORMANCE ISSUE: Synchronous file operations in loop
    processFiles(filePaths) {
        const results = [];
        filePaths.forEach(filePath => {
            const content = fs.readFileSync(filePath, 'utf8'); // Blocking I/O
            results.push(this.processContent(content));
        });
        return results;
    }

    // PERFORMANCE ISSUE: No caching, expensive computation repeated
    calculateExpensiveValue(input) {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(input * i);
        }
        return result;
    }

    // PERFORMANCE ISSUE: Memory leak potential
    storeInCache(key, value) {
        this.cache.set(key, value); // Never cleared
    }
}

module.exports = DataProcessor;
`;

    // Sample 3: Maintainability issues
    const maintainabilityCode = `
// order-manager.js - Poor maintainability example
function processOrder(o) { // BAD: Unclear parameter name
    // BAD: No documentation
    // BAD: Magic numbers
    if (o.total > 1000) {
        o.discount = 0.1;
    } else if (o.total > 500) {
        o.discount = 0.05;
    }
    
    // BAD: Long function with multiple responsibilities
    o.tax = o.total * 0.08;
    o.shipping = o.total > 50 ? 0 : 9.99;
    
    // BAD: Nested conditions and repeated code
    if (o.type === 'express') {
        if (o.weight > 10) {
            o.shipping = o.shipping * 2;
        }
        o.deliveryDays = 1;
    } else if (o.type === 'standard') {
        if (o.weight > 10) {
            o.shipping = o.shipping * 1.5;
        }
        o.deliveryDays = 5;
    } else {
        if (o.weight > 10) {
            o.shipping = o.shipping * 1.2;
        }
        o.deliveryDays = 10;
    }
    
    // BAD: Direct database access in business logic
    const db = require('./database');
    db.query("UPDATE orders SET status = 'processed' WHERE id = " + o.id);
    
    return o;
}

// BAD: Global variables
var orderCount = 0;
var lastOrderId = null;

module.exports = { processOrder };
`;

    // Sample 4: Bug-prone code
    const buggyCode = `
// inventory-manager.js - Code with potential bugs
class InventoryManager {
    constructor() {
        this.items = null; // BUG: Should be initialized as empty array
    }

    addItem(item) {
        // BUG: No null check for items array
        this.items.push(item);
    }

    removeItem(itemId) {
        // BUG: No bounds checking
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == itemId) { // BUG: Using == instead of ===
                this.items.splice(i, 1);
                break; // BUG: What if there are duplicates?
            }
        }
    }

    calculateTotal() {
        let total = 0;
        // BUG: No null/undefined check
        this.items.forEach(item => {
            total += item.price * item.quantity; // BUG: What if price or quantity is undefined?
        });
        return total;
    }

    // BUG: Async function without proper error handling
    async updateInventory() {
        const response = await fetch('/api/inventory'); // No try-catch
        const data = response.json(); // BUG: Missing await
        this.items = data.items;
    }

    // BUG: Potential race condition
    processOrder(order) {
        order.items.forEach(orderItem => {
            const inventoryItem = this.findItem(orderItem.id);
            inventoryItem.quantity -= orderItem.quantity; // BUG: No check if item exists
        });
    }
}

module.exports = InventoryManager;
`;

    // Write sample files
    fs.writeFileSync('sample-user-auth.js', securityCode);
    fs.writeFileSync('sample-data-processor.js', performanceCode);
    fs.writeFileSync('sample-order-manager.js', maintainabilityCode);
    fs.writeFileSync('sample-inventory-manager.js', buggyCode);

    console.log('✅ Created 4 sample code files with various issues:');
    console.log('  - sample-user-auth.js (security vulnerabilities)');
    console.log('  - sample-data-processor.js (performance issues)');
    console.log('  - sample-order-manager.js (maintainability problems)');
    console.log('  - sample-inventory-manager.js (potential bugs)');
    console.log('');
  }

  // Analyze code with specialized agents
  async analyzeCode() {
    console.log('🔍 Starting Multi-Agent Code Analysis...\n');
    console.log('=' .repeat(60));

    const files = [
      'sample-user-auth.js',
      'sample-data-processor.js', 
      'sample-order-manager.js',
      'sample-inventory-manager.js'
    ];

    for (const file of files) {
      await this.analyzeFile(file);
    }

    // Generate comprehensive report
    this.generateAnalysisReport();
  }

  async analyzeFile(filename) {
    console.log(`\n📄 Analyzing: ${filename}`);
    console.log('-'.repeat(40));

    const code = fs.readFileSync(filename, 'utf8');
    const fileAnalysis = {
      filename,
      issues: [],
      suggestions: [],
      metrics: {}
    };

    // Each agent analyzes the code from their perspective
    for (const agent of this.agents) {
      if (agent.type === 'coordinator') continue; // Coordinator works later

      console.log(`\n${this.getAgentEmoji(agent.type)} ${agent.name} analyzing...`);
      
      const agentFindings = await this.runAgentAnalysis(agent, code, filename);
      fileAnalysis.issues.push(...agentFindings.issues);
      fileAnalysis.suggestions.push(...agentFindings.suggestions);

      // Store findings in agent's memory
      agent.patterns.push(...agentFindings.patterns);

      // Use hook to simulate agent coordination
      this.runSwarmCommand(
        `npx ruv-swarm hook notification --message "${agent.name} analyzed ${filename}"`,
        true
      );
    }

    this.analysisResults.push(fileAnalysis);
    
    // Post-edit hook for each file analysis
    this.runSwarmCommand(
      `npx ruv-swarm hook post-edit --file "${filename}"`,
      true
    );
  }

  async runAgentAnalysis(agent, code, filename) {
    const findings = {
      issues: [],
      suggestions: [],
      patterns: []
    };

    // Simulate different types of analysis based on agent expertise
    switch (agent.type) {
      case 'security':
        findings.issues.push(...this.findSecurityIssues(code, filename));
        findings.suggestions.push(...this.generateSecuritySuggestions(code));
        break;
        
      case 'performance':
        findings.issues.push(...this.findPerformanceIssues(code, filename));
        findings.suggestions.push(...this.generatePerformanceSuggestions(code));
        break;
        
      case 'maintainability':
        findings.issues.push(...this.findMaintainabilityIssues(code, filename));
        findings.suggestions.push(...this.generateMaintainabilitySuggestions(code));
        break;
        
      case 'bugs':
        findings.issues.push(...this.findPotentialBugs(code, filename));
        findings.suggestions.push(...this.generateBugFixSuggestions(code));
        break;
        
      case 'architecture':
        findings.issues.push(...this.findArchitectureIssues(code, filename));
        findings.suggestions.push(...this.generateArchitectureSuggestions(code));
        break;
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    return findings;
  }

  findSecurityIssues(code, filename) {
    const issues = [];
    
    if (code.includes('SELECT * FROM') && code.includes("' + ")) {
      issues.push({
        type: 'security',
        severity: 'critical',
        title: 'SQL Injection Vulnerability',
        description: 'Direct string concatenation in SQL queries allows SQL injection attacks',
        line: this.findLineNumber(code, "' + "),
        agent: 'SecurityAuditor'
      });
    }

    if (code.includes("password: ''") || code.includes('password: ""')) {
      issues.push({
        type: 'security',
        severity: 'high',
        title: 'Empty Database Password',
        description: 'Database connection uses empty password, exposing system to unauthorized access',
        line: this.findLineNumber(code, "password: ''"),
        agent: 'SecurityAuditor'
      });
    }

    if (code.includes('console.log') && code.includes('error')) {
      issues.push({
        type: 'security',
        severity: 'medium',
        title: 'Information Disclosure',
        description: 'Error messages exposed to console may leak sensitive information',
        line: this.findLineNumber(code, 'console.log'),
        agent: 'SecurityAuditor'
      });
    }

    return issues;
  }

  findPerformanceIssues(code, filename) {
    const issues = [];

    if (code.includes('for (let i = 0; i < arr.length; i++)') && 
        code.includes('for (let j = i + 1; j < arr.length; j++)')) {
      issues.push({
        type: 'performance',
        severity: 'high',
        title: 'O(n²) Algorithm Complexity',
        description: 'Nested loops create quadratic time complexity, inefficient for large datasets',
        line: this.findLineNumber(code, 'for (let i = 0'),
        agent: 'PerformanceOptimizer'
      });
    }

    if (code.includes('readFileSync')) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        title: 'Synchronous File I/O',
        description: 'Blocking file operations can cause performance bottlenecks',
        line: this.findLineNumber(code, 'readFileSync'),
        agent: 'PerformanceOptimizer'
      });
    }

    if (code.includes('this.cache.set') && !code.includes('delete') && !code.includes('clear')) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        title: 'Potential Memory Leak',
        description: 'Cache grows indefinitely without cleanup mechanism',
        line: this.findLineNumber(code, 'this.cache.set'),
        agent: 'PerformanceOptimizer'
      });
    }

    return issues;
  }

  findMaintainabilityIssues(code, filename) {
    const issues = [];

    // Magic numbers
    const magicNumbers = code.match(/\b(?:\d+\.?\d*)\b/g) || [];
    if (magicNumbers.length > 3) {
      issues.push({
        type: 'maintainability',
        severity: 'medium',
        title: 'Magic Numbers',
        description: 'Hard-coded numbers should be replaced with named constants',
        line: 1,
        agent: 'CodeQualityExpert'
      });
    }

    // Long functions (rough estimate based on line count)
    const lines = code.split('\n');
    const functionMatches = code.match(/function\s+\w+|=>\s*{/g) || [];
    if (lines.length > 50 && functionMatches.length < 3) {
      issues.push({
        type: 'maintainability',
        severity: 'high',
        title: 'Long Function',
        description: 'Function is too long and handles multiple responsibilities',
        line: 1,
        agent: 'CodeQualityExpert'
      });
    }

    // Poor variable names
    if (code.includes('function processOrder(o)')) {
      issues.push({
        type: 'maintainability',
        severity: 'low',
        title: 'Poor Variable Naming',
        description: 'Parameter name "o" is not descriptive',
        line: this.findLineNumber(code, 'function processOrder(o)'),
        agent: 'CodeQualityExpert'
      });
    }

    return issues;
  }

  findPotentialBugs(code, filename) {
    const issues = [];

    if (code.includes('this.items = null') || code.includes('this.items.push')) {
      issues.push({
        type: 'bug',
        severity: 'high',
        title: 'Null Pointer Exception Risk',
        description: 'Array initialized as null but used without null checking',
        line: this.findLineNumber(code, 'this.items = null'),
        agent: 'BugHunter'
      });
    }

    if (code.includes(' == ') && !code.includes(' === ')) {
      issues.push({
        type: 'bug',
        severity: 'medium',
        title: 'Type Coercion Bug Risk',
        description: 'Using == instead of === can cause unexpected type coercion',
        line: this.findLineNumber(code, ' == '),
        agent: 'BugHunter'
      });
    }

    if (code.includes('await') && code.includes('try') === false) {
      issues.push({
        type: 'bug',
        severity: 'high',
        title: 'Unhandled Promise Rejection',
        description: 'Async operation without proper error handling',
        line: this.findLineNumber(code, 'await'),
        agent: 'BugHunter'
      });
    }

    return issues;
  }

  findArchitectureIssues(code, filename) {
    const issues = [];

    if (code.includes("require('./database')") && !filename.includes('database')) {
      issues.push({
        type: 'architecture',
        severity: 'medium',
        title: 'Tight Coupling',
        description: 'Business logic directly accesses database layer',
        line: this.findLineNumber(code, "require('./database')"),
        agent: 'ArchitectureReviewer'
      });
    }

    if (code.includes('var ') && code.includes('= null')) {
      issues.push({
        type: 'architecture',
        severity: 'low',
        title: 'Global State',
        description: 'Global variables make code harder to test and maintain',
        line: this.findLineNumber(code, 'var '),
        agent: 'ArchitectureReviewer'
      });
    }

    return issues;
  }

  generateSecuritySuggestions(code) {
    const suggestions = [];
    
    if (code.includes('SELECT * FROM')) {
      suggestions.push({
        type: 'security',
        title: 'Use Parameterized Queries',
        description: 'Replace string concatenation with parameterized queries to prevent SQL injection',
        example: 'const query = "SELECT * FROM users WHERE username = ? AND password = ?";'
      });
    }

    return suggestions;
  }

  generatePerformanceSuggestions(code) {
    const suggestions = [];
    
    if (code.includes('for (let i = 0; i < arr.length; i++)')) {
      suggestions.push({
        type: 'performance',
        title: 'Use Set for Duplicate Detection',
        description: 'Replace O(n²) nested loops with Set-based approach for O(n) complexity',
        example: 'const seen = new Set(); const duplicates = arr.filter(item => seen.has(item) ? true : (seen.add(item), false));'
      });
    }

    return suggestions;
  }

  generateMaintainabilitySuggestions(code) {
    const suggestions = [];
    
    suggestions.push({
      type: 'maintainability',
      title: 'Extract Constants',
      description: 'Replace magic numbers with named constants',
      example: 'const DISCOUNT_THRESHOLD_HIGH = 1000; const DISCOUNT_RATE_HIGH = 0.1;'
    });

    return suggestions;
  }

  generateBugFixSuggestions(code) {
    const suggestions = [];
    
    if (code.includes('this.items = null')) {
      suggestions.push({
        type: 'bug',
        title: 'Initialize Array Properly',
        description: 'Initialize items as empty array instead of null',
        example: 'this.items = [];'
      });
    }

    return suggestions;
  }

  generateArchitectureSuggestions(code) {
    const suggestions = [];
    
    suggestions.push({
      type: 'architecture',
      title: 'Implement Repository Pattern',
      description: 'Separate business logic from data access using repository pattern',
      example: 'class OrderRepository { async updateStatus(orderId, status) { /* database logic */ } }'
    });

    return suggestions;
  }

  findLineNumber(code, searchText) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i + 1;
      }
    }
    return 1;
  }

  // Generate comprehensive analysis report
  generateAnalysisReport() {
    console.log('\n\n📊 COMPREHENSIVE CODE ANALYSIS REPORT');
    console.log('='.repeat(60));

    // Summary statistics
    const totalIssues = this.analysisResults.reduce((sum, file) => sum + file.issues.length, 0);
    const issuesBySeverity = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    const issuesByType = {
      security: 0,
      performance: 0,
      maintainability: 0,
      bug: 0,
      architecture: 0
    };

    // Collect statistics
    this.analysisResults.forEach(file => {
      file.issues.forEach(issue => {
        issuesBySeverity[issue.severity]++;
        issuesByType[issue.type]++;
      });
    });

    console.log(`\n📈 Analysis Summary:`);
    console.log(`   Total Files Analyzed: ${this.analysisResults.length}`);
    console.log(`   Total Issues Found: ${totalIssues}`);
    console.log(`   Agents Deployed: ${this.agents.length}`);

    console.log(`\n🚨 Issues by Severity:`);
    Object.keys(issuesBySeverity).forEach(severity => {
      const count = issuesBySeverity[severity];
      const emoji = this.getSeverityEmoji(severity);
      console.log(`   ${emoji} ${severity.toUpperCase()}: ${count}`);
    });

    console.log(`\n🔍 Issues by Type:`);
    Object.keys(issuesByType).forEach(type => {
      const count = issuesByType[type];
      const emoji = this.getAgentEmoji(type);
      console.log(`   ${emoji} ${type}: ${count}`);
    });

    // Detailed file reports
    console.log(`\n📄 Detailed File Analysis:`);
    this.analysisResults.forEach(file => {
      console.log(`\n   📁 ${file.filename}:`);
      console.log(`      Issues found: ${file.issues.length}`);
      
      if (file.issues.length > 0) {
        console.log(`      Top issues:`);
        file.issues.slice(0, 3).forEach(issue => {
          const emoji = this.getSeverityEmoji(issue.severity);
          console.log(`        ${emoji} ${issue.title} (${issue.agent})`);
        });
      }
    });

    // Agent performance
    console.log(`\n👥 Agent Performance:`);
    this.agents.forEach(agent => {
      if (agent.type === 'coordinator') return;
      
      const agentIssues = this.analysisResults.reduce((count, file) => {
        return count + file.issues.filter(issue => issue.agent === agent.name).length;
      }, 0);
      
      const emoji = this.getAgentEmoji(agent.type);
      console.log(`   ${emoji} ${agent.name}: ${agentIssues} issues identified`);
    });

    // Save detailed report
    this.saveAnalysisReport();

    console.log(`\n💡 Recommendations:`);
    console.log(`   1. Address critical security vulnerabilities immediately`);
    console.log(`   2. Refactor performance bottlenecks in high-traffic areas`);
    console.log(`   3. Improve code maintainability through better structure`);
    console.log(`   4. Add comprehensive error handling and testing`);
    console.log(`   5. Consider architectural patterns for better separation of concerns`);
  }

  getSeverityEmoji(severity) {
    const emojis = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    return emojis[severity] || '⚪';
  }

  saveAnalysisReport() {
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      files: this.analysisResults,
      agents: this.agents,
      summary: {
        totalFiles: this.analysisResults.length,
        totalIssues: this.analysisResults.reduce((sum, file) => sum + file.issues.length, 0),
        agentCount: this.agents.length
      }
    };

    fs.writeFileSync('analysis-report.json', JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed analysis report saved to: analysis-report.json`);

    // Notify swarm of completion
    this.runSwarmCommand(
      `npx ruv-swarm hook post-task --task-id "code-analysis-${this.sessionId}" --analyze-performance true`,
      true
    );
  }

  // Clean up sample files
  cleanup() {
    const sampleFiles = [
      'sample-user-auth.js',
      'sample-data-processor.js',
      'sample-order-manager.js',
      'sample-inventory-manager.js'
    ];

    console.log(`\n🧹 Cleaning up sample files...`);
    sampleFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    console.log(`✅ Sample files cleaned up`);
  }
}

// Main execution
async function main() {
  const analyzer = new CodeAnalyzer();
  
  try {
    await analyzer.initializeSwarm();
    analyzer.createSampleCode();
    await analyzer.analyzeCode();
    
    console.log('\n✨ Code analysis complete!');
    console.log('\n🔍 Key Insights:');
    console.log('   • Multi-agent analysis provides comprehensive code review');
    console.log('   • Different agents catch different types of issues');
    console.log('   • Collaborative approach improves code quality coverage');
    console.log('   • Memory-based patterns help agents learn and improve over time');
    
    // Ask user if they want to keep sample files
    console.log('\n❓ Keep sample files for further analysis? (they contain intentional issues)');
    console.log('   Files: sample-*.js');
    console.log('   Report: analysis-report.json');
    
  } catch (error) {
    console.error('💥 Analysis failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Analysis interrupted. Report saved.');
  process.exit(0);
});

// Run the analyzer
main().catch(console.error);