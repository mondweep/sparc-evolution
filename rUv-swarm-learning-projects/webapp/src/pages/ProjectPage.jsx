import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Clock, 
  Target,
  Book,
  Terminal,
  Code,
  Lightbulb
} from 'lucide-react'

import { getProjectById, getNextProject, getPreviousProject } from '../config/projects'
import SwarmTerminal from '../components/SwarmTerminal'
import CodeEditor from '../components/CodeEditor'
import ConceptExplainer from '../components/ConceptExplainer'
import ObjectiveTracker from '../components/ObjectiveTracker'

const ProjectPage = ({ progress, updateProgress, projects }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id)
  const nextProject = getNextProject(id)
  const previousProject = getPreviousProject(id)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [completedObjectives, setCompletedObjectives] = useState([])
  const [terminalOutput, setTerminalOutput] = useState([])
  const [currentCode, setCurrentCode] = useState('')
  
  const isCompleted = progress.completedProjects.includes(parseInt(id))
  const isCurrent = parseInt(id) === progress.currentProject
  const isUnlocked = parseInt(id) <= progress.currentProject

  useEffect(() => {
    if (!project) {
      navigate('/')
      return
    }
    
    if (!isUnlocked) {
      navigate('/')
      return
    }
    
    // Load saved progress for this project
    const savedProgress = localStorage.getItem(`project-${id}-progress`)
    if (savedProgress) {
      const { objectives, code } = JSON.parse(savedProgress)
      setCompletedObjectives(objectives || [])
      setCurrentCode(code || project.codeExample || '')
    } else {
      setCurrentCode(project.codeExample || '')
    }
  }, [project, id, isUnlocked, navigate])

  const saveProjectProgress = () => {
    const progressData = {
      objectives: completedObjectives,
      code: currentCode,
      timestamp: Date.now()
    }
    localStorage.setItem(`project-${id}-progress`, JSON.stringify(progressData))
  }

  const handleObjectiveComplete = (objectiveIndex) => {
    const newCompleted = [...completedObjectives]
    if (newCompleted.includes(objectiveIndex)) {
      newCompleted.splice(newCompleted.indexOf(objectiveIndex), 1)
    } else {
      newCompleted.push(objectiveIndex)
    }
    setCompletedObjectives(newCompleted)
    saveProjectProgress()
  }

  const handleProjectComplete = () => {
    updateProgress(parseInt(id), true)
    setTerminalOutput(prev => [...prev, {
      type: 'success',
      content: `🎉 Congratulations! Project ${id} completed successfully!`,
      timestamp: Date.now()
    }])
  }

  const runCommand = async (command) => {
    setTerminalOutput(prev => [...prev, {
      type: 'input',
      content: `$ ${command}`,
      timestamp: Date.now()
    }])

    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Find matching command in project config
    const commandConfig = project.commands?.find(cmd => 
      cmd.command.includes(command.split(' ').slice(0, 3).join(' '))
    )

    if (commandConfig) {
      setTerminalOutput(prev => [...prev, {
        type: 'output',
        content: commandConfig.output,
        timestamp: Date.now()
      }])
    } else {
      // Generic responses for common ruv-swarm commands
      let output = ''
      if (command.includes('ruv-swarm init')) {
        output = '✅ Swarm initialized successfully\n🐝 Topology: mesh\n👥 Agents: 4 active'
      } else if (command.includes('ruv-swarm status')) {
        output = '🐝 Swarm Status: ACTIVE\n├── Topology: mesh\n├── Agents: 4/4 active\n└── Memory: 0 entries'
      } else if (command.includes('ruv-swarm hook')) {
        output = '🔧 Hook executed successfully\n📋 Task registered in swarm memory'
      } else {
        output = `Command executed: ${command}\n✅ Operation completed successfully`
      }
      
      setTerminalOutput(prev => [...prev, {
        type: 'output',
        content: output,
        timestamp: Date.now()
      }])
    }
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Book },
    { id: 'learn', label: 'Learn', icon: Lightbulb },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'terminal', label: 'Terminal', icon: Terminal }
  ]

  const projectCompletionPercentage = project.objectives 
    ? (completedObjectives.length / project.objectives.length) * 100 
    : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{project.icon}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Project {project.id}: {project.title}
                    </h1>
                    <p className="text-slate-400">{project.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  project.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {project.difficulty}
                </span>
                <span className="text-sm text-slate-400">⏱️ {project.estimatedTime}</span>
              </div>

              {!isCompleted && projectCompletionPercentage === 100 && (
                <button
                  onClick={handleProjectComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Complete Project
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {project.objectives && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Objectives Progress</span>
                <span className="text-sm text-slate-400">
                  {completedObjectives.length}/{project.objectives.length}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${projectCompletionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all duration-200 ${
                    isActive
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-4">Project Description</h2>
                  <p className="text-slate-300 mb-6">{project.description}</p>
                  
                  {project.objectives && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Learning Objectives</h3>
                      <ObjectiveTracker
                        objectives={project.objectives}
                        completed={completedObjectives}
                        onToggle={handleObjectiveComplete}
                      />
                    </div>
                  )}
                </div>

                {project.concepts && (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-4">Key Concepts</h2>
                    <ConceptExplainer concepts={project.concepts} />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'learn' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-4">Interactive Learning</h2>
                  <p className="text-slate-300 mb-6">
                    Follow along with the interactive exercises below to master the concepts in this project.
                  </p>
                  
                  {project.commands && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Try These Commands</h3>
                      {project.commands.map((cmd, index) => (
                        <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                          <div className="flex items-start justify-between mb-2">
                            <code className="text-cyan-400 font-mono text-sm">{cmd.command}</code>
                            <button
                              onClick={() => {
                                runCommand(cmd.command)
                                // Show a brief notification that command was executed
                                const notification = document.createElement('div')
                                notification.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
                                notification.innerHTML = '✅ Command executed! Check Terminal tab for output'
                                document.body.appendChild(notification)
                                setTimeout(() => {
                                  notification.remove()
                                }, 3000)
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              <Play size={14} className="inline mr-1" />
                              Run
                            </button>
                          </div>
                          <p className="text-slate-400 text-sm">{cmd.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CodeEditor
                  code={currentCode}
                  onChange={setCurrentCode}
                  language="javascript"
                  project={project}
                />
              </motion.div>
            )}

            {activeTab === 'terminal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SwarmTerminal
                  output={terminalOutput}
                  onCommand={runCommand}
                  project={project}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Status */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="mr-2" size={20} />
                Project Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCompleted ? 'bg-green-500/20 text-green-400' :
                    isCurrent ? 'bg-purple-500/20 text-purple-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-white font-medium">
                    {Math.round(projectCompletionPercentage)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Objectives</span>
                  <span className="text-slate-400">
                    {completedObjectives.length}/{project.objectives?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
              <div className="space-y-3">
                {previousProject && (
                  <Link
                    to={`/project/${previousProject.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                  >
                    <ArrowLeft size={16} />
                    <div>
                      <div className="font-medium">Previous</div>
                      <div className="text-sm text-slate-400">{previousProject.title}</div>
                    </div>
                  </Link>
                )}
                
                {nextProject && (
                  <Link
                    to={`/project/${nextProject.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                  >
                    <div className="flex-1">
                      <div className="font-medium">Next</div>
                      <div className="text-sm text-slate-400">{nextProject.title}</div>
                    </div>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>

            {/* Experiments */}
            {project.experiments && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Try These Experiments</h3>
                <div className="space-y-3">
                  {project.experiments.map((experiment, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-1">{experiment.title}</h4>
                      <p className="text-sm text-slate-400 mb-2">{experiment.description}</p>
                      <button
                        onClick={() => runCommand(experiment.command)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-mono"
                      >
                        {experiment.command}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage