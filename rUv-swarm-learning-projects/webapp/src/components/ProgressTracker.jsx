import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Lock, Trophy, Clock, Target, Minimize2, Maximize2 } from 'lucide-react'

const ProgressTracker = ({ progress }) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const { completedProjects, currentProject, totalProjects } = progress
  const completionPercentage = (completedProjects.length / totalProjects) * 100
  
  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first project", threshold: 1 },
    { id: 2, title: "Coordinator", description: "Master task coordination", threshold: 2 },
    { id: 3, title: "Memory Master", description: "Build persistent systems", threshold: 3 },
    { id: 4, title: "Code Analyst", description: "Analyze code with swarms", threshold: 4 },
    { id: 5, title: "API Architect", description: "Generate APIs automatically", threshold: 5 },
    { id: 6, title: "Neural Pioneer", description: "Achieve neural learning", threshold: 6 },
    { id: 7, title: "Swarm Master", description: "Complete all projects", threshold: 7 }
  ]

  const unlockedAchievements = achievements.filter(
    achievement => completedProjects.length >= achievement.threshold
  )

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isMinimized ? '64px' : '320px'
      }}
      transition={{ delay: 1, duration: 0.3 }}
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl z-40 ${
        isMinimized ? 'p-3' : 'p-6'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${isMinimized ? 'mb-0' : 'mb-6'}`}>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          {!isMinimized && (
            <div>
              <h2 className="text-lg font-bold text-white">Learning Progress</h2>
              <p className="text-sm text-slate-400">Track your swarm mastery</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
          title={isMinimized ? 'Expand progress tracker' : 'Minimize progress tracker'}
        >
          {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
        </button>
      </div>

      {/* Content - hidden when minimized */}
      {!isMinimized && (
        <>
          {/* Overall Progress */}
          <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Overall Progress</span>
          <span className="text-sm text-slate-400">{completedProjects.length}/{totalProjects}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
          </motion.div>
        </div>
        <div className="text-center mt-2">
          <span className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</span>
          <span className="text-sm text-slate-400 ml-1">Complete</span>
        </div>
      </div>

      {/* Project Status */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Project Status
        </h3>
        <div className="space-y-2">
          {Array.from({ length: totalProjects }, (_, i) => {
            const projectId = i + 1
            const isCompleted = completedProjects.includes(projectId)
            const isCurrent = projectId === currentProject
            const isLocked = projectId > currentProject
            
            return (
              <motion.div
                key={projectId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                  isCompleted ? 'bg-green-500/10 border border-green-500/20' :
                  isCurrent ? 'bg-purple-500/10 border border-purple-500/20' :
                  'bg-slate-800/50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-5 h-5 text-purple-400" />
                  </motion.div>
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-slate-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isCompleted ? 'text-green-400' :
                    isCurrent ? 'text-purple-400' :
                    isLocked ? 'text-slate-500' :
                    'text-slate-300'
                  }`}>
                    Project {projectId}
                  </div>
                  <div className="text-xs text-slate-500">
                    {projectId === 1 ? 'Hello Swarm' :
                     projectId === 2 ? 'Task Coordinator' :
                     projectId === 3 ? 'Memory Chatbot' :
                     projectId === 4 ? 'Code Analyzer' :
                     projectId === 5 ? 'API Builder' :
                     projectId === 6 ? 'Neural Learning' :
                     'Real-World App'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
          <Trophy className="w-4 h-4 mr-2" />
          Achievements ({unlockedAchievements.length}/{achievements.length})
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement)
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: isUnlocked ? [0, 360, 0] : 0
                }}
                transition={{ 
                  duration: 0.3,
                  rotateY: { duration: 0.6, delay: isUnlocked ? 0.2 : 0 }
                }}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
                    : 'bg-slate-800/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                    : 'bg-slate-600 text-slate-400'
                }`}>
                  {isUnlocked ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isUnlocked ? 'text-yellow-400' : 'text-slate-500'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {achievement.description}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
        </>
      )}
    </motion.div>
  )
}

export default ProgressTracker