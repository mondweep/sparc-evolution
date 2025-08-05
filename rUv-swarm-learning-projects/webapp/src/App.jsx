import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

// Components
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectPage from './pages/ProjectPage'
import ProgressTracker from './components/ProgressTracker'
import LoadingScreen from './components/LoadingScreen'
import Footer from './components/Footer'

// Project configurations
import { projectsConfig } from './config/projects'

function App() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({
    completedProjects: [],
    currentProject: 1,
    totalProjects: 7
  })

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('ruv-swarm-progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
    
    // Simulate initial loading
    setTimeout(() => setLoading(false), 2000)
  }, [])

  const updateProgress = (projectId, completed = false) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        completedProjects: completed 
          ? [...new Set([...prev.completedProjects, projectId])]
          : prev.completedProjects.filter(id => id !== projectId),
        currentProject: completed && projectId === prev.currentProject 
          ? Math.min(prev.currentProject + 1, prev.totalProjects)
          : prev.currentProject
      }
      
      // Save to localStorage
      localStorage.setItem('ruv-swarm-progress', JSON.stringify(newProgress))
      return newProgress
    })
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10">
          <Navigation progress={progress} />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={
                <HomePage 
                  progress={progress}
                  projects={projectsConfig}
                />
              } />
              <Route path="/projects" element={
                <ProjectsPage 
                  progress={progress}
                  projects={projectsConfig}
                />
              } />
              <Route path="/achievements" element={
                <HomePage 
                  progress={progress}
                  projects={projectsConfig}
                />
              } />
              <Route path="/project/:id" element={
                <ProjectPage 
                  progress={progress}
                  updateProgress={updateProgress}
                  projects={projectsConfig}
                />
              } />
            </Routes>
          </motion.main>
          
          <Footer />
          
          <ProgressTracker progress={progress} />
        </div>
      </div>
    </Router>
  )
}

export default App