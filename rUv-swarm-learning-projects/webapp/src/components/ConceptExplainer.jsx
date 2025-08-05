import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, BookOpen, Lightbulb, Info } from 'lucide-react'

const ConceptExplainer = ({ concepts }) => {
  const [expandedConcept, setExpandedConcept] = useState(null)

  const toggleConcept = (index) => {
    setExpandedConcept(expandedConcept === index ? null : index)
  }

  const getConceptIcon = (name) => {
    if (name.toLowerCase().includes('swarm') || name.toLowerCase().includes('topology')) return '🐝'
    if (name.toLowerCase().includes('agent')) return '🤖'
    if (name.toLowerCase().includes('memory') || name.toLowerCase().includes('storage')) return '🧠'
    if (name.toLowerCase().includes('neural') || name.toLowerCase().includes('learning')) return '🧬'
    if (name.toLowerCase().includes('api') || name.toLowerCase().includes('endpoint')) return '🚀'
    if (name.toLowerCase().includes('code') || name.toLowerCase().includes('analysis')) return '🔍'
    if (name.toLowerCase().includes('database') || name.toLowerCase().includes('persistence')) return '💾'
    if (name.toLowerCase().includes('coordination') || name.toLowerCase().includes('orchestration')) return '🎯'
    return '💡'
  }

  const getDetailedExplanation = (concept) => {
    const explanations = {
      'Swarm Topologies': {
        details: 'Different network structures for agent communication',
        examples: [
          'Mesh: All agents connected to each other - best for collaborative tasks',
          'Hierarchical: Tree structure with parent-child relationships - good for structured workflows',
          'Star: Central coordinator with peripheral agents - ideal for centralized control',
          'Ring: Circular communication pattern - perfect for pipeline processing'
        ],
        useCases: ['Task coordination', 'Knowledge sharing', 'Distributed processing']
      },
      'Agent Types': {
        details: 'Specialized roles that agents can take within the swarm',
        examples: [
          'Researcher: Gathers and analyzes information from various sources',
          'Coder: Implements solutions and writes code based on requirements',
          'Analyst: Performs data analysis and pattern recognition',
          'Tester: Validates implementations and runs quality assurance',
          'Coordinator: Manages workflow and orchestrates agent activities',
          'Architect: Designs system architecture and technical specifications'
        ],
        useCases: ['Role-based task distribution', 'Specialized problem solving', 'Efficient workflow management']
      },
      'Memory System': {
        details: 'Persistent storage mechanism for cross-session and cross-agent knowledge sharing',
        examples: [
          'Key-value storage for simple data persistence',
          'Cross-session memory for maintaining context between runs',
          'Agent-to-agent knowledge transfer through shared memory',
          'Pattern storage for learned behaviors and improvements'
        ],
        useCases: ['Context preservation', 'Learning from experience', 'Knowledge accumulation']
      },
      'Neural Pattern Training': {
        details: 'Machine learning system where agents learn from data and improve performance',
        examples: [
          'Pattern recognition from coordination data',
          'Mathematical analysis: avgDuration = 8500ms ÷ 8 = 1063ms',
          'Confidence evolution: 50.0% → 94.3% improvement',
          'Cross-agent knowledge transfer in ring topology'
        ],
        useCases: ['Performance optimization', 'Adaptive behavior', 'Continuous improvement']
      },
      'MCP Integration': {
        details: 'Model Context Protocol tools that enable Claude Code integration',
        examples: [
          'Seamless integration with Claude Code assistant',
          'Real-time swarm coordination through Claude interface',
          'Advanced orchestration capabilities',
          'Automated workflow management'
        ],
        useCases: ['AI assistant integration', 'Enhanced coordination', 'Workflow automation']
      }
    }

    return explanations[concept.name] || {
      details: concept.description,
      examples: ['Interactive examples available in the learning modules'],
      useCases: ['Hands-on practice', 'Real-world applications']
    }
  }

  return (
    <div className="space-y-4">
      {concepts.map((concept, index) => {
        const isExpanded = expandedConcept === index
        const explanation = getDetailedExplanation(concept)
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-slate-600 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleConcept(index)}
              className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getConceptIcon(concept.name)}</span>
                <div>
                  <h3 className="font-semibold text-white">{concept.name}</h3>
                  <p className="text-sm text-slate-400">{concept.description}</p>
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400"
              >
                <ChevronRight size={20} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-600"
                >
                  <div className="p-4 bg-slate-900/50 space-y-4">
                    {/* Detailed Explanation */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Info className="text-blue-400" size={16} />
                        <h4 className="font-medium text-white">Detailed Explanation</h4>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {explanation.details}
                      </p>
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="text-green-400" size={16} />
                        <h4 className="font-medium text-white">Examples</h4>
                      </div>
                      <ul className="space-y-1">
                        {explanation.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="text-slate-300 text-sm flex items-start space-x-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="text-yellow-400" size={16} />
                        <h4 className="font-medium text-white">Use Cases</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {explanation.useCases.map((useCase, useCaseIndex) => (
                          <span
                            key={useCaseIndex}
                            className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/20"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Elements */}
                    <div className="pt-2 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          💡 Try the interactive exercises to practice this concept
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              // Navigate to Terminal tab to practice
                              const terminalTab = document.querySelector('[data-tab="terminal"]');
                              if (terminalTab) {
                                terminalTab.click();
                              } else {
                                alert(`💡 Practice Tip for ${concept.name}:\n\nTry the Terminal tab to practice these commands!\n\nFor example:\n• npx ruv-swarm init --topology mesh\n• npx ruv-swarm agent spawn --type researcher`);
                              }
                            }}
                            className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors"
                          >
                            Practice
                          </button>
                          <button 
                            onClick={() => {
                              // Open external resources
                              const urls = {
                                'Swarm Topologies': 'https://ruv-swarm-tutorial.netlify.app/#swarm-topologies',
                                'Agent Types': 'https://ruv-swarm-tutorial.netlify.app/#agent-types',
                                'Memory System': 'https://ruv-swarm-tutorial.netlify.app/#memory-system',
                                'Neural Pattern Training': 'https://ruv-swarm-tutorial.netlify.app/#neural-learning',
                                'MCP Integration': 'https://ruv-swarm-tutorial.netlify.app/#mcp-integration'
                              };
                              const url = urls[concept.name] || 'https://ruv-swarm-tutorial.netlify.app/';
                              window.open(url, '_blank');
                            }}
                            className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded transition-colors"
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: concepts.length * 0.1 + 0.3 }}
        className="bg-slate-800/30 rounded-lg p-4 border border-slate-600"
      >
        <h3 className="font-semibold text-white mb-2 flex items-center">
          <BookOpen className="mr-2 text-blue-400" size={16} />
          Additional Learning Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <a
            href="https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>📚</span>
            <span>Official Documentation</span>
          </a>
          <a
            href="https://ruv-swarm-tutorial.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>🌐</span>
            <span>Online Tutorial</span>
          </a>
          <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors text-left">
            <span>💡</span>
            <span>Interactive Examples</span>
          </button>
          <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-left">
            <span>🎯</span>
            <span>Practice Exercises</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ConceptExplainer