import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  Brain, 
  Zap, 
  Award, 
  ArrowRight,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react'

const HomePage = ({ progress, projects }) => {
  const completionPercentage = (progress.completedProjects.length / progress.totalProjects) * 100
  
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-8xl mb-6"
          >
            🐝
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Master{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Agent
            </span>
            <br />
            Coordination
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Learn rUv-swarm through 7 progressive hands-on projects. 
            From basic swarm initialization to advanced neural learning systems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/project/${progress.currentProject}`}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {progress.completedProjects.length === 0 ? 'Start Learning' : 'Continue Learning'}
              <ArrowRight className="inline ml-2" size={20} />
            </Link>
            
            <Link
              to="/projects"
              className="border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Progress Overview */}
      <motion.section variants={itemVariants} className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{progress.totalProjects}</h3>
                <p className="text-slate-300">Interactive Projects</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{progress.completedProjects.length}</h3>
                <p className="text-slate-300">Completed</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{Math.round(completionPercentage)}%</h3>
                <p className="text-slate-300">Progress</p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Learning Progress</span>
                <span className="text-slate-400">{progress.completedProjects.length}/{progress.totalProjects}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section variants={itemVariants} className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What You'll Learn
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Multi-Agent Coordination",
                description: "Master the art of coordinating multiple AI agents working together toward common goals",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Brain,
                title: "Neural Learning Systems", 
                description: "Build actual machine learning systems with measurable performance improvements",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Real-Time Adaptation",
                description: "Create systems that adapt and improve through experience and cross-agent knowledge transfer",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: BookOpen,
                title: "Hands-On Projects",
                description: "7 progressive projects from basic concepts to advanced real-world applications",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Award,
                title: "Measurable Progress",
                description: "Track your learning with interactive feedback and performance metrics",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: ArrowRight,
                title: "Production Ready",
                description: "Build applications that are ready for real-world deployment and scaling",
                color: "from-cyan-500 to-blue-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200"
              >
                <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Preview */}
      <motion.section variants={itemVariants} className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Learning Path
          </h2>
          
          <div className="space-y-6">
            {projects.slice(0, 3).map((project) => {
              const isCompleted = progress.completedProjects.includes(project.id)
              const isCurrent = project.id === progress.currentProject
              const isLocked = project.id > progress.currentProject
              
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 ${
                    isCompleted ? 'border-green-500/50' :
                    isCurrent ? 'border-purple-500/50' :
                    isLocked ? 'border-slate-700' :
                    'border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'bg-green-500/20' :
                      isCurrent ? 'bg-purple-500/20' :
                      'bg-slate-700/50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="text-green-500" size={32} />
                      ) : isCurrent ? (
                        <Clock className="text-purple-400" size={32} />
                      ) : isLocked ? (
                        <Lock className="text-slate-500" size={32} />
                      ) : (
                        project.icon
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-xl font-bold ${
                          isCompleted ? 'text-green-400' :
                          isCurrent ? 'text-purple-400' :
                          isLocked ? 'text-slate-500' :
                          'text-white'
                        }`}>
                          Project {project.id}: {project.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          project.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {project.difficulty}
                        </span>
                      </div>
                      
                      <p className={`mb-3 ${
                        isLocked ? 'text-slate-500' : 'text-slate-300'
                      }`}>
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>⏱️ {project.estimatedTime}</span>
                          <span>🎯 {project.objectives?.length || 0} objectives</span>
                        </div>
                        
                        {!isLocked && (
                          <Link
                            to={`/project/${project.id}`}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              isCompleted 
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                              isCurrent 
                                ? 'bg-purple-600 text-white hover:bg-purple-700' :
                                'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/projects"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block"
            >
              View All {projects.length} Projects
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default HomePage