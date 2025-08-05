import React from 'react'
import { ExternalLink, Github, User } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Course Curator */}
          <div className="flex items-center space-x-2 text-slate-300">
            <User size={16} className="text-purple-400" />
            <span className="text-sm">
              <span className="font-medium">Course Curator:</span>{' '}
              <a
                href="https://www.linkedin.com/in/mondweepchakravorty/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center space-x-1"
              >
                <span>Mondweep Chakravorty</span>
                <ExternalLink size={12} />
              </a>
            </span>
          </div>

          {/* Repository Reference */}
          <div className="flex items-center space-x-2 text-slate-300">
            <Github size={16} className="text-cyan-400" />
            <span className="text-sm">
              <span>Learning tool for:</span>{' '}
              <a
                href="https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center space-x-1"
              >
                <span>rUv-swarm Repository</span>
                <ExternalLink size={12} />
              </a>
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            Interactive learning platform for mastering rUv-swarm multi-agent coordination through progressive hands-on projects
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer