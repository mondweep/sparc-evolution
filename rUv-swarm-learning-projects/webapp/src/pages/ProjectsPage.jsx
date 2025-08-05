import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  Lock, 
  ArrowRight,
  BookOpen,
  Target,
  Award
} from 'lucide-react'

const ProjectsPage = ({ projects, progress }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getProjectStatus = (projectId) => {
    const isCompleted = progress.completedProjects.includes(projectId)
    const isCurrent = projectId === progress.currentProject
    const isLocked = projectId > progress.currentProject

    if (isCompleted) return { status: 'completed', icon: CheckCircle, color: 'text-green-500' }
    if (isCurrent) return { status: 'current', icon: Clock, color: 'text-purple-400' }
    if (isLocked) return { status: 'locked', icon: Lock, color: 'text-slate-500' }
    return { status: 'available', icon: Target, color: 'text-blue-400' }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Header */}
      <motion.section variants={itemVariants} className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-6xl mb-6"
          >
            📚
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            All Learning{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Master rUv-swarm through {projects.length} progressive hands-on projects. 
            From basic concepts to advanced neural learning systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/project/${progress.currentProject}`}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Continue Learning
              <ArrowRight className="inline ml-2" size={18} />
            </Link>
            
            <Link
              to="/"
              className="border-2 border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Progress Summary */}
      <motion.section variants={itemVariants} className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {progress.completedProjects.length}
                </div>
                <div className="text-slate-400">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {progress.currentProject <= projects.length ? 1 : 0}
                </div>
                <div className="text-slate-400">In Progress</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.max(0, projects.length - progress.currentProject)}
                </div>
                <div className="text-slate-400">Remaining</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round((progress.completedProjects.length / projects.length) * 100)}%
                </div>
                <div className="text-slate-400">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <motion.section variants={itemVariants} className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => {
              const projectStatus = getProjectStatus(project.id)
              const StatusIcon = projectStatus.icon
              const isAccessible = projectStatus.status !== 'locked'
              
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ scale: isAccessible ? 1.02 : 1 }}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all duration-200 ${
                    projectStatus.status === 'completed' ? 'border-green-500/50 bg-green-500/5' :
                    projectStatus.status === 'current' ? 'border-purple-500/50 bg-purple-500/5' :
                    projectStatus.status === 'locked' ? 'border-slate-700 opacity-60' :
                    'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          projectStatus.status === 'completed' ? 'bg-green-500/20' :
                          projectStatus.status === 'current' ? 'bg-purple-500/20' :
                          projectStatus.status === 'locked' ? 'bg-slate-700/50' :
                          'bg-slate-700'
                        }`}>
                          {projectStatus.status === 'locked' ? (
                            <Lock className="text-slate-500" size={24} />
                          ) : (
                            project.icon
                          )}
                        </div>
                        
                        <div>
                          <h3 className={`text-xl font-bold ${
                            projectStatus.status === 'locked' ? 'text-slate-500' : 'text-white'
                          }`}>
                            Project {project.id}: {project.title}
                          </h3>
                          <p className={`text-sm ${
                            projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {project.subtitle}
                          </p>
                        </div>
                      </div>

                      <StatusIcon className={projectStatus.color} size={24} />
                    </div>

                    {/* Project Description */}
                    <p className={`mb-4 leading-relaxed ${
                      projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      {project.description}
                    </p>

                    {/* Project Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                        </span>
                        <span className={`flex items-center space-x-1 ${
                          projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          <Clock size={14} />
                          <span>{project.estimatedTime}</span>
                        </span>
                      </div>

                      <div className={`text-sm ${
                        projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {project.objectives?.length || 0} objectives
                      </div>
                    </div>

                    {/* Project Objectives Preview */}
                    {project.objectives && project.objectives.length > 0 && (
                      <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${
                          projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-300'
                        }`}>
                          Key Learning Objectives:
                        </h4>
                        <ul className="space-y-1">
                          {project.objectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className={`text-sm flex items-start space-x-2 ${
                              projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{objective}</span>
                            </li>
                          ))}
                          {project.objectives.length > 3 && (
                            <li className={`text-sm ${
                              projectStatus.status === 'locked' ? 'text-slate-600' : 'text-slate-500'
                            }`}>
                              +{project.objectives.length - 3} more objectives...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Special Features (for Project 6) */}
                    {project.specialFeatures && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Special Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.specialFeatures.slice(0, 4).map((feature, index) => (
                            <div key={index} className="text-xs bg-slate-900/50 rounded px-2 py-1 text-slate-400">
                              {feature.icon} {feature.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className={`text-xs px-2 py-1 rounded ${
                        projectStatus.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        projectStatus.status === 'current' ? 'bg-purple-500/20 text-purple-400' :
                        projectStatus.status === 'locked' ? 'bg-slate-700/50 text-slate-500' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {projectStatus.status === 'completed' ? '✅ Completed' :
                         projectStatus.status === 'current' ? '🔄 In Progress' :
                         projectStatus.status === 'locked' ? '🔒 Locked' :
                         '📚 Available'}
                      </div>

                      {projectStatus.status !== 'locked' ? (
                        <Link
                          to={`/project/${project.id}`}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                            projectStatus.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                            projectStatus.status === 'current' 
                              ? 'bg-purple-600 text-white hover:bg-purple-700' :
                              'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          <span>
                            {projectStatus.status === 'completed' ? 'Review' :
                             projectStatus.status === 'current' ? 'Continue' :
                             'Start'}
                          </span>
                          <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <div className="px-4 py-2 rounded-lg bg-slate-700/30 text-slate-500 cursor-not-allowed">
                          Complete previous projects to unlock
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Learning Path */}
      <motion.section variants={itemVariants} className="py-12 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Your Learning Journey</h2>
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {projects.map((project, index) => {
              const projectStatus = getProjectStatus(project.id)
              const StatusIcon = projectStatus.icon
              
              return (
                <div key={project.id} className="flex items-center flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    projectStatus.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                    projectStatus.status === 'current' ? 'bg-purple-500 border-purple-500 text-white' :
                    projectStatus.status === 'locked' ? 'bg-slate-700 border-slate-600 text-slate-500' :
                    'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    {projectStatus.status === 'completed' ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="font-bold">{project.id}</span>
                    )}
                  </div>
                  
                  {index < projects.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      progress.completedProjects.includes(project.id) ? 'bg-green-500' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          
          <p className="text-slate-400 mt-6">
            Complete projects in order to unlock advanced concepts and build your expertise
          </p>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default ProjectsPage