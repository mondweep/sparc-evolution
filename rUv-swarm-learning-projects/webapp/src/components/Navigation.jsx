import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Home, BookOpen, Award, Settings } from 'lucide-react'

const Navigation = ({ progress }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  const completionPercentage = (progress.completedProjects.length / progress.totalProjects) * 100

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      description: 'Learning dashboard'
    },
    { 
      path: '/projects', 
      label: 'Projects', 
      icon: BookOpen,
      description: '7 progressive projects'
    },
    { 
      path: '/achievements', 
      label: 'Progress', 
      icon: Award,
      description: 'Track your learning'
    }
  ]

  return (
    <>
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                🐝
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white">rUv-Swarm</h1>
                <p className="text-xs text-purple-300">Interactive Learning</p>
              </div>
            </Link>

            {/* Progress Bar */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                  <span>Learning Progress</span>
                  <span>{progress.completedProjects.length}/{progress.totalProjects}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-slate-800 border-t border-slate-700"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {/* Mobile Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                <span>Learning Progress</span>
                <span>{progress.completedProjects.length}/{progress.totalProjects}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm opacity-70">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </nav>

      {/* Current Project Indicator */}
      {progress.currentProject <= progress.totalProjects && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-center py-2 text-sm"
        >
          <span className="font-medium">Current Project: </span>
          <span>Project {progress.currentProject} - {
            progress.currentProject === 1 ? 'Hello Swarm' :
            progress.currentProject === 2 ? 'Task Coordinator' :
            progress.currentProject === 3 ? 'Memory Chatbot' :
            progress.currentProject === 4 ? 'Code Analyzer' :
            progress.currentProject === 5 ? 'API Builder' :
            progress.currentProject === 6 ? 'Neural Learning' :
            'Real-World App'
          }</span>
        </motion.div>
      )}
    </>
  )
}

export default Navigation