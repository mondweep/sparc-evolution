import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Code
} from 'lucide-react'

const Module2 = ({ onComplete, isCompleted, onNavigate }) => {
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState('sequential')

  // Simulation data for parallel vs sequential
  const sequentialSteps = [
    { id: 1, task: 'Create project structure', time: 100, status: 'pending' },
    { id: 2, task: 'Setup frontend', time: 200, status: 'pending' },
    { id: 3, task: 'Setup backend', time: 200, status: 'pending' },
    { id: 4, task: 'Configure database', time: 150, status: 'pending' },
    { id: 5, task: 'Write tests', time: 180, status: 'pending' },
    { id: 6, task: 'Deploy application', time: 120, status: 'pending' }
  ]

  const parallelSteps = [
    { id: 1, task: 'Batch: All project setup', time: 300, status: 'pending', parallel: true },
    { id: 2, task: 'Batch: All configurations', time: 250, status: 'pending', parallel: true },
    { id: 3, task: 'Batch: All validations', time: 200, status: 'pending', parallel: true }
  ]

  const [steps, setSteps] = useState(sequentialSteps)

  useEffect(() => {
    if (simulationRunning) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1)
        } else {
          setSimulationRunning(false)
          setShowComparison(true)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [simulationRunning, currentStep, steps.length])

  const startSimulation = (type) => {
    setSelectedPattern(type)
    setSteps(type === 'sequential' ? sequentialSteps : parallelSteps)
    setCurrentStep(0)
    setSimulationRunning(true)
    setShowComparison(false)
  }

  const resetSimulation = () => {
    setSimulationRunning(false)
    setCurrentStep(0)
    setShowComparison(false)
  }

  const totalSequentialTime = sequentialSteps.reduce((acc, step) => acc + step.time, 0)
  const totalParallelTime = parallelSteps.reduce((acc, step) => acc + step.time, 0)
  const speedImprovement = ((totalSequentialTime - totalParallelTime) / totalSequentialTime * 100).toFixed(1)

  const codeExamples = {
    wrong: `// ❌ WRONG: Sequential Approach
Message 1: TodoWrite { todos: [{ id: "1", content: "Setup", ... }] }
Message 2: TodoWrite { todos: [{ id: "2", content: "Build", ... }] }
Message 3: Write("file1.js", content1)
Message 4: Write("file2.js", content2)
Message 5: Bash("npm install")
Message 6: Bash("npm test")`,
    correct: `// ✅ CORRECT: Parallel Approach
[BatchTool - Message 1]:
  // Update ALL todos at once
  TodoWrite { todos: [
    { id: "1", content: "Setup project", status: "completed", priority: "high" },
    { id: "2", content: "Build features", status: "in_progress", priority: "high" },
    { id: "3", content: "Write tests", status: "pending", priority: "medium" },
    { id: "4", content: "Deploy app", status: "pending", priority: "medium" }
  ]}
  
  // Write ALL files at once
  Write("package.json", packageConfig)
  Write("src/index.js", indexContent)
  Write("tests/app.test.js", testContent)
  
  // Run ALL commands at once
  Bash("npm install")
  Bash("npm run lint")
  Bash("npm test")`
  }

  return (
    <div className="fade-in">
      {/* Module Header */}
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Zap size={48} style={{ marginBottom: '20px' }} />
          <h1>Module 2: Parallel Execution Fundamentals</h1>
          <p>Master the five mandatory concurrent patterns and achieve 2.8-4.4x speed improvements</p>
        </motion.div>
      </div>

      {/* The Golden Rule */}
      <div className="lesson-card">
        <h2>The Golden Rule of Claude Flow</h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '1.5em',
          fontWeight: 'bold',
          margin: '20px 0'
        }}>
          "1 MESSAGE = ALL RELATED OPERATIONS"
        </div>
        <p>
          This isn't just a technical requirement—it's a fundamental shift in thinking about AI operations. 
          Every Claude Flow operation must follow this principle to achieve optimal performance and coordination.
        </p>
      </div>

      {/* Interactive Simulation */}
      <div className="lesson-card">
        <h2>📊 Interactive Execution Comparison</h2>
        <p>See the dramatic difference between sequential and parallel execution patterns:</p>
        
        <div className="interactive-component">
          <div className="component-controls">
            <button 
              className="control-button"
              onClick={() => startSimulation('sequential')}
              disabled={simulationRunning}
            >
              <Play size={16} style={{ marginRight: '8px' }} />
              Run Sequential
            </button>
            <button 
              className="control-button"
              onClick={() => startSimulation('parallel')}
              disabled={simulationRunning}
            >
              <Zap size={16} style={{ marginRight: '8px' }} />
              Run Parallel
            </button>
            <button 
              className="control-button secondary"
              onClick={resetSimulation}
            >
              <RotateCcw size={16} style={{ marginRight: '8px' }} />
              Reset
            </button>
          </div>

          {/* Simulation Visualization */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '30px', 
            borderRadius: '8px',
            minHeight: '300px'
          }}>
            <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>
              {selectedPattern === 'sequential' ? 'Sequential Execution' : 'Parallel Execution'}
              {simulationRunning && (
                <motion.span 
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ marginLeft: '10px' }}
                >
                  Running...
                </motion.span>
              )}
            </h4>

            <div style={{ marginBottom: '20px' }}>
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px',
                    margin: '8px 0',
                    background: index <= currentStep ? '#e8f5e8' : 'white',
                    border: index === currentStep && simulationRunning ? '2px solid #27ae60' : '1px solid #ddd',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {index <= currentStep ? (
                    <CheckCircle size={20} style={{ color: '#27ae60' }} />
                  ) : (
                    <Clock size={20} style={{ color: '#95a5a6' }} />
                  )}
                  <span style={{ flex: 1 }}>{step.task}</span>
                  <span style={{ 
                    background: step.parallel ? '#3498db' : '#95a5a6',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8em'
                  }}>
                    {step.time}ms
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Comparison Results */}
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: '#e8f5e8', 
                  padding: '20px', 
                  borderRadius: '8px',
                  marginTop: '20px',
                  border: '2px solid #27ae60'
                }}
              >
                <h4 style={{ color: '#27ae60', marginBottom: '15px' }}>
                  <TrendingUp size={20} style={{ marginRight: '8px' }} />
                  Performance Comparison
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#e74c3c' }}>
                      {totalSequentialTime}ms
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#7f8c8d' }}>Sequential Time</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#27ae60' }}>
                      {totalParallelTime}ms
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#7f8c8d' }}>Parallel Time</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#3498db' }}>
                      {speedImprovement}%
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#7f8c8d' }}>Faster</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Five Mandatory Patterns */}
      <div className="lesson-card">
        <h2>🔴 Five Mandatory Concurrent Patterns</h2>
        <p>Every Claude Flow operation must follow these critical patterns:</p>
        
        <div style={{ marginTop: '25px' }}>
          {[
            { 
              title: 'TodoWrite Batching', 
              description: 'ALWAYS batch 5-10+ todos in ONE call',
              icon: '📝',
              color: '#e74c3c'
            },
            { 
              title: 'Task Tool Spawning', 
              description: 'ALL agents in ONE message with full instructions',
              icon: '🤖',
              color: '#9b59b6'
            },
            { 
              title: 'File Operations', 
              description: 'Batch ALL reads/writes/edits together',
              icon: '📁',
              color: '#3498db'
            },
            { 
              title: 'Bash Commands', 
              description: 'Group ALL terminal operations in one message',
              icon: '⚡',
              color: '#f39c12'
            },
            { 
              title: 'Memory Operations', 
              description: 'Concurrent store/retrieve operations',
              icon: '🧠',
              color: '#27ae60'
            }
          ].map((pattern, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                margin: '15px 0',
                background: 'white',
                border: `2px solid ${pattern.color}`,
                borderRadius: '12px'
              }}
            >
              <div style={{ 
                fontSize: '2em',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                {pattern.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: pattern.color, margin: '0 0 8px 0' }}>
                  {pattern.title}
                </h4>
                <p style={{ margin: 0, color: '#7f8c8d' }}>
                  {pattern.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Comparison */}
      <div className="lesson-card">
        <h2>💻 Code Implementation Examples</h2>
        <p>See the difference between incorrect sequential and correct parallel patterns:</p>
        
        <div className="code-comparison">
          <div>
            <div className="code-label incorrect">❌ WRONG: Sequential</div>
            <div className="code-block incorrect">
              <pre>{codeExamples.wrong}</pre>
            </div>
          </div>
          <div>
            <div className="code-label correct">✅ CORRECT: Parallel</div>
            <div className="code-block correct">
              <pre>{codeExamples.correct}</pre>
            </div>
          </div>
        </div>

        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Critical Point</h4>
          <p style={{ margin: 0, color: '#856404' }}>
            The parallel approach is not just faster—it's the ONLY correct way to implement Claude Flow. 
            Sequential operations break coordination and prevent proper swarm functionality.
          </p>
        </div>
      </div>

      {/* Checklist Tool */}
      <div className="lesson-card">
        <h2>✅ Concurrent Execution Checklist</h2>
        <p>Before sending ANY message, validate these requirements:</p>
        
        <div className="interactive-component">
          <div style={{ 
            background: '#f8f9fa', 
            padding: '25px', 
            borderRadius: '8px'
          }}>
            {[
              'Are ALL related TodoWrite operations batched together?',
              'Are ALL Task spawning operations in ONE message?',
              'Are ALL file operations (Read/Write/Edit) batched together?',
              'Are ALL bash commands grouped in ONE message?',
              'Are ALL memory operations concurrent?'
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                margin: '15px 0',
                padding: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <CheckCircle size={20} style={{ color: '#27ae60' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          
          <div style={{ 
            background: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h4 style={{ color: '#721c24', marginBottom: '10px' }}>🚨 If ANY answer is "No"</h4>
            <p style={{ margin: 0, color: '#721c24', fontWeight: 'bold' }}>
              You MUST combine operations into a single message!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <div>
          <h3 style={{ margin: 0, marginBottom: '8px' }}>Module 2 Complete!</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Next: Learn about MCP Tools and their coordination role
          </p>
        </div>
        <motion.button
          className="control-button"
          style={{ 
            background: 'white', 
            color: '#667eea', 
            fontWeight: 'bold',
            fontSize: '1.1em',
            padding: '15px 30px'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onComplete()
            onNavigate('module3')
          }}
        >
          Continue to Module 3
          <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </div>
  )
}

export default Module2