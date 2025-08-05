import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Target, Trophy } from 'lucide-react'

const ObjectiveTracker = ({ objectives, completed, onToggle }) => {
  const completionPercentage = (completed.length / objectives.length) * 100

  const getObjectiveIcon = (objective) => {
    if (objective.toLowerCase().includes('initialize') || objective.toLowerCase().includes('init')) return '🚀'
    if (objective.toLowerCase().includes('spawn') || objective.toLowerCase().includes('create')) return '🤖'
    if (objective.toLowerCase().includes('understand') || objective.toLowerCase().includes('learn')) return '🧠'
    if (objective.toLowerCase().includes('memory') || objective.toLowerCase().includes('storage')) return '💾'
    if (objective.toLowerCase().includes('monitor') || objective.toLowerCase().includes('track')) return '📊'
    if (objective.toLowerCase().includes('coordinate') || objective.toLowerCase().includes('orchestrate')) return '🎯'
    if (objective.toLowerCase().includes('implement') || objective.toLowerCase().includes('build')) return '🏗️'
    if (objective.toLowerCase().includes('analyze') || objective.toLowerCase().includes('analysis')) return '🔍'
    if (objective.toLowerCase().includes('generate') || objective.toLowerCase().includes('create')) return '⚡'
    if (objective.toLowerCase().includes('deploy') || objective.toLowerCase().includes('production')) return '🚀'
    if (objective.toLowerCase().includes('test') || objective.toLowerCase().includes('validate')) return '✅'
    if (objective.toLowerCase().includes('neural') || objective.toLowerCase().includes('learning')) return '🧬'
    return '🎯'
  }

  const getPriorityColor = (index) => {
    // High priority for first objectives, medium for middle, low for last
    if (index < objectives.length * 0.3) return 'text-red-400 border-red-400/30'
    if (index < objectives.length * 0.7) return 'text-yellow-400 border-yellow-400/30'
    return 'text-green-400 border-green-400/30'
  }

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-400" size={20} />
            <h3 className="font-semibold text-white">Learning Progress</h3>
          </div>
          <span className="text-sm text-slate-400">
            {completed.length}/{objectives.length} completed
          </span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3"
            />
          </motion.div>
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</span>
          <span className="text-sm text-slate-400 ml-1">Complete</span>
        </div>
      </div>

      {/* Objectives List */}
      <div className="space-y-3">
        {objectives.map((objective, index) => {
          const isCompleted = completed.includes(index)
          const priorityColor = getPriorityColor(index)
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                isCompleted 
                  ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                  : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500'
              }`}
              onClick={() => onToggle(index)}
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  animate={{ 
                    scale: isCompleted ? [1, 1.2, 1] : 1,
                    rotate: isCompleted ? [0, 360, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className="mt-0.5"
                >
                  {isCompleted ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <Circle className="text-slate-400 hover:text-slate-300" size={24} />
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getObjectiveIcon(objective)}</span>
                    <h4 className={`font-medium transition-colors ${
                      isCompleted ? 'text-green-400' : 'text-white'
                    }`}>
                      Objective {index + 1}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${priorityColor}`}>
                      {index < objectives.length * 0.3 ? 'High' : 
                       index < objectives.length * 0.7 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  
                  <p className={`text-sm transition-colors ${
                    isCompleted ? 'text-green-300' : 'text-slate-300'
                  }`}>
                    {objective}
                  </p>
                  
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 text-xs text-green-400"
                    >
                      <CheckCircle size={12} />
                      <span>Completed! Great job! 🎉</span>
                    </motion.div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded ${
                    isCompleted 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-slate-600/50 text-slate-400'
                  }`}>
                    {isCompleted ? 'Done' : 'Todo'}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Completion Celebration */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6 text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1, repeat: 2 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Congratulations! All Objectives Complete!
          </h3>
          
          <p className="text-green-300 mb-4">
            You've successfully mastered all the learning objectives for this project. 
            Ready to move on to the next challenge?
          </p>
          
          <div className="flex justify-center space-x-3">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
              Complete Project
            </button>
            <button className="border border-green-500/50 hover:border-green-500 text-green-400 hover:text-green-300 px-4 py-2 rounded-lg font-medium transition-colors">
              Review Learning
            </button>
          </div>
        </motion.div>
      )}

      {/* Tips and Hints */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
        <h4 className="font-medium text-white mb-2 flex items-center">
          <Target className="mr-2 text-blue-400" size={16} />
          Learning Tips
        </h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Click on objectives to mark them as complete</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Try the interactive terminal and code editor to practice</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>High priority objectives are essential for project completion</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Complete all objectives to unlock the next project</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ObjectiveTracker