import React, { useState, useEffect } from 'react';

const Module6 = () => {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedTopic, setSelectedTopic] = useState('overview');
  const [showHookDemo, setShowHookDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [exerciseComplete, setExerciseComplete] = useState({});

  const levels = {
    beginner: { icon: '🌱', name: 'Beginner', color: '#27ae60' },
    intermediate: { icon: '🌿', name: 'Intermediate', color: '#3498db' },
    advanced: { icon: '🌳', name: 'Advanced', color: '#8e44ad' }
  };

  const topics = {
    overview: 'Configuration Overview',
    hooks: 'Workflow Hooks',
    mcp: 'MCP Architecture',
    features: 'Advanced Features',
    performance: 'Performance Optimization',
    troubleshooting: 'Troubleshooting'
  };

  const hookWorkflow = [
    { name: 'Pre-Edit Hook', description: 'Prepares workspace before editing', color: '#3498db' },
    { name: 'Post-Edit Hook', description: 'Formats and learns from changes', color: '#27ae60' },
    { name: 'Pre-Command Hook', description: 'Validates safety before commands', color: '#f39c12' },
    { name: 'Post-Command Hook', description: 'Learns from command results', color: '#e74c3c' },
    { name: 'Session End Hook', description: 'Saves progress and generates summary', color: '#9b59b6' }
  ];

  const learningRoadmap = {
    1: { title: 'Foundation Week', focus: 'Basic concepts and setup', level: 'beginner' },
    2: { title: 'Configuration Week', focus: 'Understanding settings.json', level: 'beginner' },
    3: { title: 'Hooks Introduction', focus: 'First hook implementations', level: 'intermediate' },
    4: { title: 'Hook Coordination', focus: 'Multi-hook workflows', level: 'intermediate' },
    5: { title: 'MCP Deep Dive', focus: 'Agent communication', level: 'intermediate' },
    6: { title: 'Performance Tuning', focus: 'Optimization strategies', level: 'intermediate' },
    7: { title: 'Advanced Features', focus: 'Neural training & memory', level: 'advanced' },
    8: { title: 'Custom Workflows', focus: 'Building custom hooks', level: 'advanced' },
    9: { title: 'Topology Mastery', focus: 'Swarm coordination', level: 'advanced' },
    10: { title: 'Error Handling', focus: 'Self-healing systems', level: 'advanced' },
    11: { title: 'Integration', focus: 'GitHub & external tools', level: 'advanced' },
    12: { title: 'Expert Level', focus: 'Contributing & mentoring', level: 'advanced' }
  };

  const configExamples = {
    beginner: {
      title: 'Basic Configuration',
      description: 'Essential settings to get started',
      code: `{
  "env": {
    "CLAUDE_FLOW_HOOKS_ENABLED": "true",
    "CLAUDE_FLOW_AUTO_COMMIT": "false"
  },
  "features": {
    "parallelExecution": true,
    "autoTopologySelection": true
  },
  "performance": {
    "maxAgents": 3
  }
}`
    },
    intermediate: {
      title: 'Enhanced Configuration',
      description: 'Adding coordination and optimization',
      code: `{
  "features": {
    "parallelExecution": true,
    "neuralTraining": true,
    "bottleneckAnalysis": true,
    "smartAutoSpawning": true
  },
  "performance": {
    "maxAgents": 6,
    "tokenOptimization": true,
    "cacheEnabled": true
  }
}`
    },
    advanced: {
      title: 'Expert Configuration',
      description: 'Full feature set with custom optimizations',
      code: `{
  "features": {
    "autoTopologySelection": true,
    "parallelExecution": true,
    "neuralTraining": true,
    "bottleneckAnalysis": true,
    "smartAutoSpawning": true,
    "selfHealingWorkflows": true,
    "crossSessionMemory": true,
    "githubIntegration": true
  },
  "performance": {
    "maxAgents": 12,
    "agentSpecialization": {
      "security-expert": {
        "triggers": ["security", "auth", "crypto"]
      }
    }
  }
}`
    }
  };

  const troubleshootingIssues = [
    {
      problem: "Hooks aren't running",
      symptoms: "Code isn't being formatted, no automatic context loading",
      solution: `"env": { "CLAUDE_FLOW_HOOKS_ENABLED": "true" }`
    },
    {
      problem: "Performance is slow",
      symptoms: "Long delays, timeouts, poor responsiveness",
      solution: `"performance": { "maxAgents": 5, "cacheEnabled": true }`
    },
    {
      problem: "Memory usage is high",
      symptoms: "System slowing down, out of memory errors",
      solution: `"features": { "crossSessionMemory": false }`
    }
  ];

  const exercises = {
    beginner: [
      { id: 1, title: 'Enable Basic Features', description: 'Turn on parallel execution and neural training' },
      { id: 2, title: 'Set Agent Limit', description: 'Configure maxAgents to 3 for learning' },
      { id: 3, title: 'Watch Hooks Work', description: 'Observe how post-edit hooks format your code' }
    ],
    intermediate: [
      { id: 4, title: 'Custom Hook Arguments', description: 'Add --run-tests to post-edit hook' },
      { id: 5, title: 'MCP Configuration', description: 'Set up custom MCP server environment' },
      { id: 6, title: 'Performance Tuning', description: 'Optimize settings for your workflow' }
    ],
    advanced: [
      { id: 7, title: 'Agent Specialization', description: 'Create custom agent types for your domain' },
      { id: 8, title: 'Memory Architecture', description: 'Design cross-session memory patterns' },
      { id: 9, title: 'Custom Workflows', description: 'Build deployment hooks and integrations' }
    ]
  };

  const HookVisualizer = () => (
    <div className="interactive-component">
      <h4>🔗 Hook Workflow Visualizer</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        {hookWorkflow.map((hook, index) => (
          <div
            key={index}
            style={{
              background: currentStep === index ? hook.color : '#f8f9fa',
              color: currentStep === index ? 'white' : '#333',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1,
              margin: '0 5px',
              border: currentStep === index ? `3px solid ${hook.color}` : '1px solid #ddd'
            }}
            onClick={() => setCurrentStep(index)}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{hook.name}</div>
            <div style={{ fontSize: '0.8em' }}>{hook.description}</div>
          </div>
        ))}
      </div>
      
      <div className="component-controls">
        <button 
          className="control-button"
          onClick={() => setCurrentStep((prev) => (prev + 1) % hookWorkflow.length)}
        >
          Next Hook
        </button>
        <button 
          className="control-button secondary"
          onClick={() => setShowHookDemo(!showHookDemo)}
        >
          {showHookDemo ? 'Hide' : 'Show'} Demo
        </button>
      </div>

      {showHookDemo && (
        <div style={{ background: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h5 style={{ color: '#3498db', marginBottom: '10px' }}>
            {hookWorkflow[currentStep].name} Example:
          </h5>
          <pre style={{ margin: 0, fontFamily: 'Monaco, monospace', fontSize: '14px' }}>
            {currentStep === 0 && `npx claude-flow hooks pre-edit --file "src/App.jsx"
→ Loading context for React component
→ Assigning frontend specialist agent
→ Preparing workspace with component patterns`}
            {currentStep === 1 && `npx claude-flow hooks post-edit --file "src/App.jsx"
→ Formatting JSX code with Prettier
→ Updating memory with component patterns
→ Training neural model on React best practices`}
            {currentStep === 2 && `npx claude-flow hooks pre-command --command "npm install"
→ Validating package.json exists
→ Checking for security vulnerabilities
→ Preparing npm cache optimization`}
            {currentStep === 3 && `npx claude-flow hooks post-command --command "npm test"
→ Analyzing test results: 15/15 passed
→ Storing successful test patterns
→ Updating performance metrics`}
            {currentStep === 4 && `npx claude-flow hooks session-end
→ Generating session summary: 8 files modified
→ Persisting project state and decisions
→ Exporting productivity metrics`}
          </pre>
        </div>
      )}
    </div>
  );

  const ConfigurationPlayground = () => (
    <div className="interactive-component">
      <h4>⚙️ Configuration Playground</h4>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {Object.entries(levels).map(([key, level]) => (
          <button
            key={key}
            className={selectedLevel === key ? 'control-button' : 'control-button secondary'}
            onClick={() => setSelectedLevel(key)}
          >
            {level.icon} {level.name}
          </button>
        ))}
      </div>

      <div style={{ background: '#2c3e50', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ 
          background: levels[selectedLevel].color, 
          color: 'white', 
          padding: '15px',
          fontWeight: 'bold'
        }}>
          {levels[selectedLevel].icon} {configExamples[selectedLevel].title}
        </div>
        <div style={{ padding: '20px' }}>
          <p style={{ color: '#bdc3c7', marginBottom: '15px' }}>
            {configExamples[selectedLevel].description}
          </p>
          <pre style={{ 
            color: '#ecf0f1', 
            margin: 0,
            fontFamily: 'Monaco, monospace',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {configExamples[selectedLevel].code}
          </pre>
        </div>
      </div>
    </div>
  );

  const LearningRoadmap = () => (
    <div className="interactive-component">
      <h4>📚 12-Week Learning Roadmap</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          className="control-button secondary"
          onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
          disabled={currentWeek === 1}
        >
          ← Previous Week
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
          Week {currentWeek} of 12
        </span>
        <button
          className="control-button secondary"
          onClick={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
          disabled={currentWeek === 12}
        >
          Next Week →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        {Object.entries(learningRoadmap).map(([week, content]) => (
          <div
            key={week}
            style={{
              background: parseInt(week) === currentWeek ? '#e3f2fd' : 'white',
              border: parseInt(week) === currentWeek ? '2px solid #3498db' : '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setCurrentWeek(parseInt(week))}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Week {week}</span>
              <span>{levels[content.level].icon}</span>
            </div>
            <h5 style={{ margin: '10px 0 5px', color: '#2c3e50' }}>{content.title}</h5>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9em' }}>{content.focus}</p>
          </div>
        ))}
      </div>

      {learningRoadmap[currentWeek] && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h5 style={{ color: '#2c3e50', marginBottom: '15px' }}>
            {levels[learningRoadmap[currentWeek].level].icon} Week {currentWeek}: {learningRoadmap[currentWeek].title}
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {exercises[learningRoadmap[currentWeek].level]?.map((exercise) => (
              <div
                key={exercise.id}
                style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  border: exerciseComplete[exercise.id] ? '2px solid #27ae60' : '1px solid #ddd'
                }}
              >
                <h6 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{exercise.title}</h6>
                <p style={{ margin: '0 0 15px', fontSize: '0.9em', color: '#7f8c8d' }}>
                  {exercise.description}
                </p>
                <button
                  className={exerciseComplete[exercise.id] ? 'control-button' : 'control-button secondary'}
                  onClick={() => setExerciseComplete(prev => ({
                    ...prev,
                    [exercise.id]: !prev[exercise.id]
                  }))}
                  style={{ fontSize: '0.8em', padding: '5px 10px' }}
                >
                  {exerciseComplete[exercise.id] ? '✅ Complete' : 'Mark Complete'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TroubleshootingGuide = () => (
    <div className="interactive-component">
      <h4>🔧 Interactive Troubleshooting Guide</h4>
      <div style={{ display: 'grid', gap: '15px' }}>
        {troubleshootingIssues.map((issue, index) => (
          <details key={index} style={{ background: 'white', borderRadius: '8px', padding: '15px' }}>
            <summary style={{ 
              fontWeight: 'bold', 
              color: '#e74c3c', 
              cursor: 'pointer',
              marginBottom: '10px'
            }}>
              🚨 {issue.problem}
            </summary>
            <div style={{ marginLeft: '20px' }}>
              <p style={{ margin: '10px 0', color: '#7f8c8d' }}>
                <strong>Symptoms:</strong> {issue.symptoms}
              </p>
              <div style={{ background: '#2c3e50', color: '#ecf0f1', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ color: '#27ae60' }}>Solution:</strong>
                <pre style={{ margin: '10px 0 0', fontFamily: 'Monaco, monospace', fontSize: '14px' }}>
                  {issue.solution}
                </pre>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );

  const MCPArchitecture = () => (
    <div className="interactive-component">
      <h4>🔗 MCP (Model Context Protocol) Architecture</h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr 1fr', 
        gap: '20px', 
        alignItems: 'center',
        margin: '20px 0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: '#3498db', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '10px'
          }}>
            <h5 style={{ margin: 0 }}>Claude Code</h5>
            <p style={{ margin: '5px 0 0', fontSize: '0.8em' }}>Execution Engine</p>
          </div>
          <div style={{ fontSize: '0.8em', color: '#7f8c8d' }}>
            • File Operations<br/>
            • Code Generation<br/>
            • Command Execution
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: '#9b59b6', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '10px'
          }}>
            <h5 style={{ margin: 0 }}>MCP Server</h5>
            <p style={{ margin: '5px 0 0', fontSize: '0.8em' }}>Communication Bridge</p>
          </div>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            fontSize: '0.8em',
            color: '#7f8c8d'
          }}>
            • Inter-Agent Communication<br/>
            • Shared Memory<br/>
            • Event Broadcasting<br/>
            • Resource Management
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: '#e74c3c', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '10px'
          }}>
            <h5 style={{ margin: 0 }}>Claude Flow</h5>
            <p style={{ margin: '5px 0 0', fontSize: '0.8em' }}>Coordination Layer</p>
          </div>
          <div style={{ fontSize: '0.8em', color: '#7f8c8d' }}>
            • Agent Spawning<br/>
            • Task Orchestration<br/>
            • Memory Management
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#f39c12', 
        color: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <h5 style={{ margin: '0 0 10px' }}>🧠 Shared Memory & Context</h5>
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          Persistent knowledge base accessible by all components
        </p>
      </div>
    </div>
  );

  return (
    <div className="module-content">
      <div className="module-header">
        <h1>⚙️ Claude Flow Configuration Mastery</h1>
        <p>Master the art of configuring Claude Flow from beginner to expert level</p>
      </div>

      <div className="lesson-card fade-in">
        <h2>🎓 Progressive Learning Path</h2>
        <p>
          This module takes you on a journey from complete beginner to advanced Claude Flow user. 
          You'll learn to configure, optimize, and master the sophisticated coordination system 
          that makes Claude Code intelligent, efficient, and safe.
        </p>

        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
          {Object.entries(levels).map(([key, level]) => (
            <div
              key={key}
              style={{
                background: level.color,
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                flex: 1
              }}
            >
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>{level.icon}</div>
              <h4 style={{ margin: '0 0 10px' }}>{level.name}</h4>
              <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.9 }}>
                {key === 'beginner' && 'Basic concepts and setup'}
                {key === 'intermediate' && 'Coordination and optimization'}
                {key === 'advanced' && 'Mastery and customization'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="lesson-card fade-in">
        <h2>🔗 Understanding Workflow Hooks</h2>
        <p>
          Hooks are automated scripts that run at specific moments in your development workflow. 
          Think of them as a personal assistant who automatically handles routine tasks at exactly 
          the right moment.
        </p>

        <HookVisualizer />

        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
          <h4 style={{ color: '#27ae60', margin: '0 0 15px' }}>🌱 Real-World Analogy</h4>
          <p style={{ margin: 0 }}>
            Imagine you have a smart assistant who automatically organizes your desk when you sit down to work, 
            proofreads and files your documents when you finish writing, and backs up your work when you leave 
            the office. Hooks do exactly this for your coding workflow!
          </p>
        </div>
      </div>

      <div className="lesson-card fade-in">
        <h2>⚙️ Interactive Configuration</h2>
        <p>
          Explore different configuration levels and see how settings change as you progress 
          from beginner to advanced usage.
        </p>

        <ConfigurationPlayground />
      </div>

      <div className="lesson-card fade-in">
        <h2>🔗 MCP Architecture Deep Dive</h2>
        <p>
          Model Context Protocol (MCP) is the universal translator that allows different AI tools 
          to communicate and coordinate. Understanding this architecture is key to mastering Claude Flow.
        </p>

        <MCPArchitecture />

        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
          <h4 style={{ color: '#3498db', margin: '0 0 15px' }}>🌿 Key Benefits</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Scalability:</strong> Add new AI tools without reconfiguration</li>
            <li><strong>Coordination:</strong> Multiple agents work together seamlessly</li>
            <li><strong>Persistence:</strong> Shared context survives individual agent restarts</li>
            <li><strong>Performance:</strong> Optimized communication reduces latency</li>
          </ul>
        </div>
      </div>

      <div className="lesson-card fade-in">
        <h2>📚 Learning Roadmap</h2>
        <p>
          Follow this 12-week structured learning path to progress from beginner to expert. 
          Each week builds upon the previous one with hands-on exercises and real-world projects.
        </p>

        <LearningRoadmap />
      </div>

      <div className="lesson-card fade-in">
        <h2>🔧 Troubleshooting Guide</h2>
        <p>
          Common issues and their solutions. Learn to diagnose and fix configuration problems quickly.
        </p>

        <TroubleshootingGuide />
      </div>

      <div className="lesson-card fade-in">
        <h2>🚀 Performance Benefits</h2>
        <p>
          When properly configured, Claude Flow with Claude Code delivers exceptional performance improvements:
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">84.8%</span>
            <span className="stat-label">SWE-Bench Solve Rate</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">32.3%</span>
            <span className="stat-label">Token Reduction</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">2.8-4.4x</span>
            <span className="stat-label">Speed Improvement</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">27+</span>
            <span className="stat-label">Neural Models</span>
          </div>
        </div>

        <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
          <h4 style={{ color: '#856404', margin: '0 0 15px' }}>🌳 Expert Insight</h4>
          <p style={{ margin: 0, color: '#856404' }}>
            These performance improvements come from intelligent coordination, parallel execution, 
            and neural pattern learning. The more you use Claude Flow, the smarter and faster it becomes 
            at understanding your specific workflow and preferences.
          </p>
        </div>
      </div>

      <div className="lesson-card fade-in">
        <h2>🎯 Next Steps</h2>
        <p>Ready to start your Claude Flow mastery journey?</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: '#27ae60', margin: '0 0 15px' }}>🌱 Beginners</h4>
            <p style={{ margin: '0 0 15px', fontSize: '0.9em' }}>
              Start with Week 1 of the learning roadmap and basic configuration exercises.
            </p>
            <button className="control-button" style={{ background: '#27ae60' }}>
              Start Learning Path
            </button>
          </div>
          
          <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: '#3498db', margin: '0 0 15px' }}>🌿 Intermediate</h4>
            <p style={{ margin: '0 0 15px', fontSize: '0.9em' }}>
              Dive into hook coordination and MCP architecture for better workflows.
            </p>
            <button className="control-button" style={{ background: '#3498db' }}>
              Explore Hooks
            </button>
          </div>
          
          <div style={{ background: '#f3e5f5', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: '#8e44ad', margin: '0 0 15px' }}>🌳 Advanced</h4>
            <p style={{ margin: '0 0 15px', fontSize: '0.9em' }}>
              Master custom workflows, neural training, and contribute to the ecosystem.
            </p>
            <button className="control-button" style={{ background: '#8e44ad' }}>
              Advanced Topics
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        textAlign: 'center',
        margin: '30px 0'
      }}>
        <h3 style={{ margin: '0 0 15px' }}>🚀 Ready to Transform Your Development Workflow?</h3>
        <p style={{ margin: '0 0 20px', opacity: 0.9 }}>
          Join thousands of developers who have mastered Claude Flow configuration to achieve 
          faster, smarter, and more efficient coding workflows.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="https://github.com/ruvnet/claude-flow" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            📚 Claude Flow Documentation
          </a>
          <button 
            className="control-button"
            style={{ 
              background: 'rgba(255,255,255,0.9)', 
              color: '#667eea',
              fontWeight: 'bold'
            }}
            onClick={() => setCurrentWeek(1)}
          >
            🎯 Start Week 1
          </button>
        </div>
      </div>
    </div>
  );
};

export default Module6;