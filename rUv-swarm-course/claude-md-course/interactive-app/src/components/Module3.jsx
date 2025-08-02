import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, ArrowRight, Brain, Code, CheckCircle, XCircle } from 'lucide-react'

const Module3 = ({ onComplete, isCompleted, onNavigate }) => {
  const [draggedItem, setDraggedItem] = useState(null)
  const [assignments, setAssignments] = useState({
    claudeCode: [],
    mcpTools: []
  })

  const tasks = [
    { id: 1, name: 'File Operations (Read/Write/Edit)', correct: 'claudeCode' },
    { id: 2, name: 'Memory Management', correct: 'mcpTools' },
    { id: 3, name: 'Code Generation', correct: 'claudeCode' },
    { id: 4, name: 'Swarm Coordination', correct: 'mcpTools' },
    { id: 5, name: 'Bash Commands', correct: 'claudeCode' },
    { id: 6, name: 'Performance Tracking', correct: 'mcpTools' },
    { id: 7, name: 'Todo Management', correct: 'claudeCode' },
    { id: 8, name: 'Neural Pattern Learning', correct: 'mcpTools' }
  ]

  const handleDragStart = (task) => {
    setDraggedItem(task)
  }

  const handleDrop = (category) => {
    if (draggedItem) {
      setAssignments(prev => ({
        ...prev,
        [category]: [...prev[category], draggedItem],
        // Remove from other category if it was there
        [category === 'claudeCode' ? 'mcpTools' : 'claudeCode']: 
          prev[category === 'claudeCode' ? 'mcpTools' : 'claudeCode'].filter(item => item.id !== draggedItem.id)
      }))
      setDraggedItem(null)
    }
  }

  const checkAnswers = () => {
    return tasks.every(task => {
      const assignedCategory = assignments.claudeCode.find(item => item.id === task.id) ? 'claudeCode' : 
                              assignments.mcpTools.find(item => item.id === task.id) ? 'mcpTools' : null
      return assignedCategory === task.correct
    })
  }

  const allAssigned = [...assignments.claudeCode, ...assignments.mcpTools].length === tasks.length

  return (
    <div className="fade-in">
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Settings size={48} style={{ marginBottom: '20px' }} />
          <h1>Module 3: MCP Tools & Coordination</h1>
          <p>Understand the critical separation between coordination and execution</p>
        </motion.div>
      </div>

      <div className="lesson-card">
        <h2>🧠 The Critical Separation of Concerns</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', margin: '25px 0' }}>
          <div style={{ 
            background: '#e3f2fd', 
            padding: '25px', 
            borderRadius: '12px',
            border: '2px solid #2196f3'
          }}>
            <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>
              <Code size={24} style={{ marginRight: '10px' }} />
              Claude Code (The Executor)
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>🔧 ALL file operations</li>
              <li>💻 ALL code generation</li>
              <li>🖥️ ALL bash commands</li>
              <li>🏗️ ALL implementation work</li>
              <li>📝 ALL TodoWrite operations</li>
            </ul>
          </div>
          <div style={{ 
            background: '#f3e5f5', 
            padding: '25px', 
            borderRadius: '12px',
            border: '2px solid #9c27b0'
          }}>
            <h3 style={{ color: '#7b1fa2', marginBottom: '15px' }}>
              <Brain size={24} style={{ marginRight: '10px' }} />
              MCP Tools (The Coordinator)
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>🎯 Coordination only</li>
              <li>💾 Memory management</li>
              <li>🤖 Neural features</li>
              <li>📊 Performance tracking</li>
              <li>🐝 Swarm orchestration</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lesson-card">
        <h2>🎯 Interactive Responsibility Matrix</h2>
        <p>Drag each task to the correct category to test your understanding:</p>
        
        <div className="interactive-component">
          {/* Available Tasks */}
          <div style={{ marginBottom: '30px' }}>
            <h4>Available Tasks</h4>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px',
              minHeight: '60px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #dee2e6'
            }}>
              {tasks.filter(task => 
                !assignments.claudeCode.find(item => item.id === task.id) &&
                !assignments.mcpTools.find(item => item.id === task.id)
              ).map(task => (
                <motion.div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  style={{
                    padding: '10px 15px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'grab',
                    userSelect: 'none'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, rotate: 5 }}
                >
                  {task.name}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('claudeCode')}
              style={{
                minHeight: '200px',
                padding: '20px',
                background: '#e3f2fd',
                border: '3px dashed #2196f3',
                borderRadius: '12px'
              }}
            >
              <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>Claude Code Tasks</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {assignments.claudeCode.map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '10px',
                      background: '#fff',
                      borderRadius: '6px',
                      border: allAssigned && task.correct === 'claudeCode' ? '2px solid #27ae60' : 
                             allAssigned && task.correct !== 'claudeCode' ? '2px solid #e74c3c' : '1px solid #ddd'
                    }}
                  >
                    {task.name}
                    {allAssigned && (
                      task.correct === 'claudeCode' ? 
                        <CheckCircle size={16} style={{ color: '#27ae60', marginLeft: '10px' }} /> :
                        <XCircle size={16} style={{ color: '#e74c3c', marginLeft: '10px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('mcpTools')}
              style={{
                minHeight: '200px',
                padding: '20px',
                background: '#f3e5f5',
                border: '3px dashed #9c27b0',
                borderRadius: '12px'
              }}
            >
              <h4 style={{ color: '#7b1fa2', marginBottom: '15px' }}>MCP Tools Tasks</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {assignments.mcpTools.map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '10px',
                      background: '#fff',
                      borderRadius: '6px',
                      border: allAssigned && task.correct === 'mcpTools' ? '2px solid #27ae60' : 
                             allAssigned && task.correct !== 'mcpTools' ? '2px solid #e74c3c' : '1px solid #ddd'
                    }}
                  >
                    {task.name}
                    {allAssigned && (
                      task.correct === 'mcpTools' ? 
                        <CheckCircle size={16} style={{ color: '#27ae60', marginLeft: '10px' }} /> :
                        <XCircle size={16} style={{ color: '#e74c3c', marginLeft: '10px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {allAssigned && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                padding: '20px',
                background: checkAnswers() ? '#d4edda' : '#f8d7da',
                border: checkAnswers() ? '2px solid #27ae60' : '2px solid #e74c3c',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              {checkAnswers() ? (
                <div style={{ color: '#155724' }}>
                  <CheckCircle size={24} style={{ marginRight: '10px' }} />
                  Perfect! You understand the separation of concerns.
                </div>
              ) : (
                <div style={{ color: '#721c24' }}>
                  <XCircle size={24} style={{ marginRight: '10px' }} />
                  Review the correct assignments. Remember: MCP coordinates, Claude Code executes.
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

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
          <h3 style={{ margin: 0, marginBottom: '8px' }}>Coordination Mastered!</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Next: Learn advanced swarm orchestration patterns
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
            onNavigate('module4')
          }}
        >
          Continue to Module 4
          <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </div>
  )
}

export default Module3