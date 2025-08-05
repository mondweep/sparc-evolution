import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Brain, 
  Users, 
  Clock, 
  Target, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react'

const Overview = ({ onComplete, isCompleted, onNavigate }) => {
  const [activeMetric, setActiveMetric] = useState(0)

  const metrics = [
    { icon: TrendingUp, value: '2.8-4.4x', label: 'Speed Improvement', color: '#27ae60' },
    { icon: Brain, value: '84.8%', label: 'SWE-Bench Solve Rate', color: '#3498db' },
    { icon: Zap, value: '32.3%', label: 'Token Reduction', color: '#e74c3c' },
    { icon: Users, value: '27+', label: 'Neural Models', color: '#9b59b6' }
  ]

  const learningObjectives = [
    'Understand every section of the CLAUDE.md configuration',
    'Implement proper parallel execution patterns',
    'Configure MCP tools for optimal coordination',
    'Design effective swarm architectures',
    'Troubleshoot common configuration issues',
    'Optimize performance for production deployments'
  ]

  const modules = [
    { 
      title: 'Understanding Claude Flow', 
      duration: '60 min',
      description: 'Master the fundamentals of Claude Flow coordination and parallel execution philosophy'
    },
    { 
      title: 'Parallel Execution Fundamentals', 
      duration: '90 min',
      description: 'Learn the five mandatory concurrent patterns and batch operation techniques'
    },
    { 
      title: 'MCP Tools & Coordination', 
      duration: '75 min',
      description: 'Understand the critical separation between coordination and execution'
    },
    { 
      title: 'Swarm Orchestration Patterns', 
      duration: '90 min',
      description: 'Design and implement effective multi-agent coordination strategies'
    },
    { 
      title: 'Advanced Configuration', 
      duration: '75 min',
      description: 'Master memory management, performance optimization, and deployment'
    }
  ]

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Claude Flow Configuration Mastery</h1>
          <p>Master advanced AI coordination and achieve unprecedented performance gains</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px', 
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Clock size={24} style={{ marginBottom: '8px' }} />
              <div>6 Hours</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Target size={24} style={{ marginBottom: '8px' }} />
              <div>Advanced</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BookOpen size={24} style={{ marginBottom: '8px' }} />
              <div>5 Modules</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="lesson-card">
        <h2>Performance Impact</h2>
        <p>Students who master <a 
          href="https://github.com/ruvnet/claude-flow" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#0066cc',
            textDecoration: 'none',
            borderBottom: '1px solid transparent',
            transition: 'border-bottom-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.borderBottomColor = '#0066cc'}
          onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
        >Claude Flow</a> configuration achieve remarkable improvements:</p>
        
        <div className="stats-grid">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                className="stat-card"
                style={{ 
                  cursor: 'pointer',
                  border: activeMetric === index ? `3px solid ${metric.color}` : '3px solid transparent'
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveMetric(index)}
              >
                <Icon size={32} style={{ color: metric.color, marginBottom: '15px' }} />
                <span className="stat-number" style={{ color: metric.color }}>
                  {metric.value}
                </span>
                <div className="stat-label">{metric.label}</div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          key={activeMetric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px',
            borderLeft: `4px solid ${metrics[activeMetric].color}`
          }}
        >
          {activeMetric === 0 && (
            <p><strong>Speed Improvement:</strong> Proper parallel execution patterns eliminate sequential bottlenecks, achieving 2.8-4.4x faster completion times through coordinated batch operations.</p>
          )}
          {activeMetric === 1 && (
            <p><strong>Problem Solving:</strong> Advanced coordination strategies enable higher success rates on complex software engineering benchmarks through distributed intelligence.</p>
          )}
          {activeMetric === 2 && (
            <p><strong>Efficiency Gains:</strong> Intelligent task breakdown and batching reduces redundant token usage while maintaining or improving output quality.</p>
          )}
          {activeMetric === 3 && (
            <p><strong>Neural Diversity:</strong> Access to multiple specialized agent types provides diverse cognitive approaches to problem-solving and implementation.</p>
          )}
        </motion.div>
      </div>

      {/* Learning Objectives */}
      <div className="lesson-card">
        <h2>What You'll Master</h2>
        <p>By completing this course, you will achieve the following learning objectives:</p>
        
        <div style={{ marginTop: '25px' }}>
          {learningObjectives.map((objective, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                margin: '15px 0',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}
            >
              <CheckCircle size={20} style={{ color: '#27ae60', flexShrink: 0 }} />
              <span>{objective}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Modules */}
      <div className="lesson-card">
        <h2>Course Structure</h2>
        <p>The course is organized into five comprehensive modules, each building upon previous concepts:</p>
        
        <div style={{ marginTop: '25px' }}>
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              style={{ 
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '25px',
                margin: '15px 0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)' 
              }}
              onClick={() => onNavigate(`module${index + 1}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                    Module {index + 1}: {module.title}
                  </h3>
                  <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
                    {module.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    color: '#95a5a6',
                    fontSize: '0.9em'
                  }}>
                    <Clock size={16} />
                    <span>{module.duration}</span>
                  </div>
                </div>
                <ArrowRight size={20} style={{ color: '#3498db', marginTop: '10px' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Prerequisites and Getting Started */}
      <div className="lesson-card">
        <h2>Prerequisites & Getting Started</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h3>Prerequisites</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              <li>Experience with Claude Code</li>
              <li>Basic understanding of AI systems</li>
              <li>Familiarity with command-line operations</li>
              <li>Understanding of parallel computing (helpful)</li>
            </ul>
          </div>
          <div>
            <h3>What You'll Need</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              <li>Access to Claude Code environment</li>
              <li>Text editor or IDE</li>
              <li>Terminal/command line access</li>
              <li>2-3 hours of focused study time</li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #90caf9'
        }}>
          <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>💡 Study Tip</h4>
          <p style={{ margin: 0, color: '#1565c0' }}>
            This course includes interactive components and hands-on exercises. 
            Have your Claude Code environment ready to practice the concepts as you learn them.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
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
          <h3 style={{ margin: 0, marginBottom: '8px' }}>Ready to Begin?</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Start with Module 1 to understand Claude Flow fundamentals
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
            onNavigate('module1')
          }}
        >
          Start Learning
          <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </div>
  )
}

export default Overview