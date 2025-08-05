import React from 'react'
import { motion } from 'framer-motion'
import { Code2, ArrowRight, Award } from 'lucide-react'

const Module5 = ({ onComplete, isCompleted, onNavigate }) => {
  return (
    <div className="fade-in">
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Code2 size={48} style={{ marginBottom: '20px' }} />
          <h1>Module 5: Advanced Configuration</h1>
          <p>Master memory management, performance optimization, and deployment strategies</p>
        </motion.div>
      </div>

      <div className="lesson-card">
        <h2>🧠 Memory Coordination Patterns</h2>
        <p>Advanced memory management for cross-agent coordination:</p>
        
        <div className="code-block correct">
          <pre>{`// Memory coordination pattern
mcp__claude-flow__memory_usage
  action: "store"
  key: "swarm-{id}/agent-{name}/{step}"
  value: {
    timestamp: Date.now(),
    decision: "what was decided",
    implementation: "what was built",
    nextSteps: ["step1", "step2"],
    dependencies: ["dep1", "dep2"]
  }`}</pre>
        </div>
      </div>

      <div className="lesson-card">
        <h2>⚡ Performance Optimization Tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            'Batch Everything',
            'Parallel First',
            'Memory is Key',
            'Monitor Progress',
            'Auto-Optimize'
          ].map((tip, index) => (
            <div key={index} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#2c3e50' }}>{tip}</h4>
            </div>
          ))}
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
          <h3 style={{ margin: 0, marginBottom: '8px' }}>All Modules Complete!</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Take the final assessment to earn your certification
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
            onNavigate('quiz')
          }}
        >
          Take Final Quiz
          <Award size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </div>
  )
}

export default Module5