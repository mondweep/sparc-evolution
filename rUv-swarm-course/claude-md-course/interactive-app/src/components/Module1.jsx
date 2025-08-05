import React from 'react'
import { motion } from 'framer-motion'
import { Brain, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react'

const Module1 = ({ onComplete, isCompleted, onNavigate }) => {
  return (
    <div className="fade-in">
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Brain size={48} style={{ marginBottom: '20px' }} />
          <h1>Module 1: Understanding Claude Flow</h1>
          <p>Master the fundamentals of AI coordination and parallel execution philosophy</p>
        </motion.div>
      </div>

      <div className="lesson-card">
        <h2>What is Claude Flow?</h2>
        <p>Claude Flow represents a paradigm shift from traditional sequential AI operations to coordinated, parallel execution.</p>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '25px', 
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h4><Lightbulb size={20} style={{ marginRight: '10px', color: '#f39c12' }} />Core Concept</h4>
          <div style={{ fontSize: '1.1em', fontFamily: 'monospace', textAlign: 'center', margin: '15px 0' }}>
            <div style={{ color: '#e74c3c' }}>Traditional AI: One task → Complete → Next task</div>
            <div style={{ margin: '10px 0' }}>↓</div>
            <div style={{ color: '#27ae60' }}>Claude Flow: Multiple tasks → Coordinate → Execute in parallel</div>
          </div>
        </div>
      </div>

      <div className="lesson-card">
        <h2>Performance Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <TrendingUp size={32} style={{ color: '#27ae60', marginBottom: '15px' }} />
            <span className="stat-number" style={{ color: '#27ae60' }}>84.8%</span>
            <div className="stat-label">SWE-Bench Solve Rate</div>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: '#3498db' }}>32.3%</span>
            <div className="stat-label">Token Reduction</div>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: '#e74c3c' }}>2.8-4.4x</span>
            <div className="stat-label">Speed Improvement</div>
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
          <h3 style={{ margin: 0, marginBottom: '8px' }}>Ready for Parallel Execution?</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Continue to Module 2 to learn the five mandatory patterns
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
            onNavigate('module2')
          }}
        >
          Continue to Module 2
          <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </div>
  )
}

export default Module1