import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Code2, 
  Brain, 
  Zap, 
  Users, 
  Settings, 
  CheckCircle, 
  Clock,
  Target,
  Award
} from 'lucide-react'

// Components
import Overview from './components/Overview'
import Module1 from './components/Module1'
import Module2 from './components/Module2'
import Module3 from './components/Module3'
import Module4 from './components/Module4'
import Module5 from './components/Module5'
import Module6 from './components/Module6'
import Quiz from './components/Quiz'
import Progress from './components/Progress'

function App() {
  const [currentSection, setCurrentSection] = useState('overview')
  const [progress, setProgress] = useState({
    overview: false,
    module1: false,
    module2: false,
    module3: false,
    module4: false,
    module5: false,
    module6: false,
    quiz: false
  })

  const sections = [
    { id: 'overview', title: 'Course Overview', icon: BookOpen, component: Overview },
    { id: 'module1', title: 'Understanding Claude Flow', icon: Brain, component: Module1 },
    { id: 'module2', title: 'Parallel Execution', icon: Zap, component: Module2 },
    { id: 'module3', title: 'MCP Tools & Coordination', icon: Settings, component: Module3 },
    { id: 'module4', title: 'Swarm Orchestration', icon: Users, component: Module4 },
    { id: 'module5', title: 'Advanced Configuration', icon: Code2, component: Module5 },
    { id: 'module6', title: 'Configuration Mastery', icon: Settings, component: Module6 },
    { id: 'quiz', title: 'Final Assessment', icon: Award, component: Quiz }
  ]

  const markCompleted = (sectionId) => {
    setProgress(prev => ({
      ...prev,
      [sectionId]: true
    }))
  }

  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPercentage = (completedCount / sections.length) * 100

  const CurrentComponent = sections.find(s => s.id === currentSection)?.component || Overview

  return (
    <div className="course-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="course-header">
          <h2 style={{ marginBottom: '10px', fontSize: '1.5em' }}>
            Claude Flow Mastery
          </h2>
          <p style={{ opacity: 0.8, fontSize: '0.9em', marginBottom: '20px' }}>
            Configuration & Coordination
          </p>
          
          {/* Progress Overview */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9em' }}>Progress</span>
              <span style={{ fontSize: '0.9em' }}>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>
              {completedCount} of {sections.length} sections completed
            </div>
          </div>
        </div>

        <nav>
          <div className="nav-section">
            <h3>Course Content</h3>
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.a
                  key={section.id}
                  className={`nav-item ${currentSection === section.id ? 'active' : ''}`}
                  onClick={() => setCurrentSection(section.id)}
                  whileHover={{ x: 4 }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    opacity: progress[section.id] ? 1 : 0.8
                  }}
                >
                  <Icon size={18} />
                  <span style={{ flex: 1 }}>{section.title}</span>
                  {progress[section.id] && (
                    <CheckCircle size={16} style={{ color: '#27ae60' }} />
                  )}
                </motion.a>
              )
            })}
          </div>

          <div className="nav-section">
            <h3>Quick Stats</h3>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '0.9em'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <Clock size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Duration: 6 hours
              </div>
              <div style={{ marginBottom: '8px' }}>
                <Target size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Level: Advanced
              </div>
              <div>
                <Zap size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                2.8-4.4x Speed Gain
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8em', opacity: '0.8' }}>
                Now with Configuration Mastery!
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentComponent 
              onComplete={() => markCompleted(currentSection)}
              isCompleted={progress[currentSection]}
              onNavigate={setCurrentSection}
            />
          </motion.div>
        </AnimatePresence>

        {/* Course Curator Footer */}
        <motion.div
          style={{
            marginTop: '60px',
            padding: '25px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #dee2e6'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p style={{ 
            margin: 0, 
            color: '#6c757d',
            fontSize: '0.95em',
            fontWeight: '500'
          }}>
            <strong style={{ color: '#495057' }}>Course Curator:</strong> Mondweep Chakravorty (
            <a 
              href="https://www.linkedin.com/in/mondweepchakravorty/" 
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
            >
              LinkedIn
            </a>
            )
          </p>
        </motion.div>
      </main>
    </div>
  )
}

export default App