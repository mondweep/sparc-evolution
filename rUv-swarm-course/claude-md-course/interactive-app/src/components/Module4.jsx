import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ArrowRight, Play, Settings } from 'lucide-react'

const Module4 = ({ onComplete, isCompleted, onNavigate }) => {
  const [agentCount, setAgentCount] = useState(5)
  const [topology, setTopology] = useState('hierarchical')
  const [taskComplexity, setTaskComplexity] = useState('medium')

  const getRecommendedAgents = (complexity) => {
    switch(complexity) {
      case 'simple': return '3-4 agents'
      case 'medium': return '5-7 agents'  
      case 'complex': return '8-12 agents'
      default: return '5 agents'
    }
  }

  return (
    <div className="fade-in">
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Users size={48} style={{ marginBottom: '20px' }} />
          <h1>Module 4: Swarm Orchestration Patterns</h1>
          <p>Design and implement effective multi-agent coordination strategies</p>
        </motion.div>
      </div>

      <div className="lesson-card">
        <h2>🎯 Interactive Swarm Configuration</h2>
        <p>Configure a virtual swarm and see the recommended settings:</p>
        
        <div className="interactive-component">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h4>Configuration</h4>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Task Complexity:</label>
                <select 
                  value={taskComplexity} 
                  onChange={(e) => setTaskComplexity(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="simple">Simple (1-3 components)</option>
                  <option value="medium">Medium (4-6 components)</option>
                  <option value="complex">Complex (7+ components)</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Topology:</label>
                <select 
                  value={topology} 
                  onChange={(e) => setTopology(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="hierarchical">Hierarchical</option>
                  <option value="mesh">Mesh</option>
                  <option value="ring">Ring</option>
                  <option value="star">Star</option>
                </select>
              </div>
            </div>
            
            <div>
              <h4>Recommendations</h4>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Recommended Agents:</strong> {getRecommendedAgents(taskComplexity)}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Selected Topology:</strong> {topology}
                </div>
                <div style={{ 
                  background: taskComplexity === 'complex' ? '#fff3cd' : '#d4edda',
                  padding: '15px',
                  borderRadius: '4px',
                  border: `1px solid ${taskComplexity === 'complex' ? '#ffeaa7' : '#c3e6cb'}`
                }}>
                  <strong>Performance Impact:</strong><br/>
                  {taskComplexity === 'simple' && 'Fast coordination, minimal overhead'}
                  {taskComplexity === 'medium' && 'Balanced coordination and performance'}
                  {taskComplexity === 'complex' && 'Maximum coordination, highest performance gains'}
                </div>
              </div>
            </div>
          </div>
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
          <h3 style={{ margin: 0, marginBottom: '8px' }}>Swarm Orchestration Complete!</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Final module: Advanced configuration and optimization
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
            onNavigate('module5')
          }}
        >
          Continue to Module 5
          <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </div>
  )
}

export default Module4