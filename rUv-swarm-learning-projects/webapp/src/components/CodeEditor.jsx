import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Copy, 
  Download, 
  RotateCcw, 
  Save, 
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react'

const CodeEditor = ({ code, onChange, language = 'javascript', project }) => {
  const [isExecuting, setIsExecuting] = useState(false)
  const [output, setOutput] = useState([])
  const [showOutput, setShowOutput] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lineNumbers, setLineNumbers] = useState(true)
  const textareaRef = useRef(null)

  const executeCode = async () => {
    setIsExecuting(true)
    setShowOutput(true)
    
    // Simulate code execution
    setOutput([{ 
      type: 'info', 
      content: '🚀 Executing code...',
      timestamp: Date.now()
    }])

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Simulate realistic output based on project
    const simulatedOutput = generateSimulatedOutput(code, project)
    setOutput(prev => [...prev, ...simulatedOutput])
    
    setIsExecuting(false)
  }

  const generateSimulatedOutput = (code, project) => {
    const outputs = []
    
    if (code.includes('console.log')) {
      // Extract console.log statements and simulate their output
      const consoleMatches = code.match(/console\.log\(['"`]([^'"`]*)['"`]\)/g)
      if (consoleMatches) {
        consoleMatches.forEach(match => {
          const message = match.match(/console\.log\(['"`]([^'"`]*)['"`]\)/)[1]
          outputs.push({
            type: 'output',
            content: message,
            timestamp: Date.now()
          })
        })
      }
    }

    if (code.includes('ruv-swarm')) {
      outputs.push({
        type: 'success',
        content: '✅ rUv-swarm commands detected and would be executed',
        timestamp: Date.now()
      })
      
      if (code.includes('init')) {
        outputs.push({
          type: 'output',
          content: '🐝 Swarm initialized successfully\n├── Topology: mesh\n├── Agents: 4 active\n└── Status: READY',
          timestamp: Date.now()
        })
      }
    }

    if (code.includes('class') || code.includes('function')) {
      outputs.push({
        type: 'success',
        content: '✅ Code structure looks good!',
        timestamp: Date.now()
      })
    }

    // Project-specific outputs
    if (project) {
      switch (project.id) {
        case 1:
          outputs.push({
            type: 'output',
            content: '🐝 Welcome to Hello Swarm!\n✅ Basic swarm concepts demonstrated',
            timestamp: Date.now()
          })
          break
        case 2:
          outputs.push({
            type: 'output',
            content: '🎯 Task coordination system active\n👥 6 specialized agents ready',
            timestamp: Date.now()
          })
          break
        case 6:
          outputs.push({
            type: 'output',
            content: '🧠 Neural learning patterns detected\n📊 Learning confidence: 94.3%\n🔄 415% performance improvement',
            timestamp: Date.now()
          })
          break
        default:
          outputs.push({
            type: 'output',
            content: `✅ Project ${project.id} code executed successfully`,
            timestamp: Date.now()
          })
      }
    }

    if (outputs.length === 0) {
      outputs.push({
        type: 'output',
        content: '✅ Code execution completed',
        timestamp: Date.now()
      })
    }

    return outputs
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-${project?.id || 'code'}.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetCode = () => {
    if (project?.codeExample && confirm('Reset to original code? Your changes will be lost.')) {
      onChange(project.codeExample)
    }
  }

  const saveCode = () => {
    localStorage.setItem(`project-${project?.id}-code`, code)
    // Show brief success message
    setOutput(prev => [...prev, {
      type: 'success',
      content: '💾 Code saved locally',
      timestamp: Date.now()
    }])
    setShowOutput(true)
  }

  const handleKeyDown = (e) => {
    // Tab key handling for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      onChange(newValue)
      
      // Set cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }

  const codeLines = code.split('\n')

  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-700 overflow-hidden ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h3 className="font-semibold text-white">
            {project ? `Project ${project.id} - ${project.title}` : 'Code Editor'}
          </h3>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {language}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={lineNumbers ? 'Hide line numbers' : 'Show line numbers'}
          >
            {lineNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={copyCode}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Copy code"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={downloadCode}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Download code"
          >
            <Download size={16} />
          </button>
          <button
            onClick={saveCode}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Save code locally"
          >
            <Save size={16} />
          </button>
          {project?.codeExample && (
            <button
              onClick={resetCode}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Reset to original"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex">
        {/* Line Numbers */}
        {lineNumbers && (
          <div className="bg-slate-800/50 text-slate-500 font-mono text-sm select-none min-w-[3rem] text-right">
            {codeLines.map((_, index) => (
              <div key={index} className="px-2 py-0.5 leading-6">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Code Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-96 p-4 bg-transparent text-white font-mono text-sm resize-none outline-none leading-6"
            style={{ 
              minHeight: isFullscreen ? 'calc(100vh - 200px)' : '400px',
              tabSize: 2
            }}
            spellCheck={false}
            placeholder="Enter your code here..."
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-t border-slate-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Play size={16} />
            <span>{isExecuting ? 'Executing...' : 'Run Code'}</span>
          </button>
          
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2"
          >
            {showOutput ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showOutput ? 'Hide Output' : 'Show Output'}</span>
          </button>
        </div>
        
        <div className="text-xs text-slate-500">
          Lines: {codeLines.length} • Characters: {code.length}
        </div>
      </div>

      {/* Output Panel */}
      {showOutput && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-slate-700 bg-slate-900"
        >
          <div className="p-4">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
              <Play className="mr-2" size={16} />
              Execution Output
            </h4>
            
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm max-h-48 overflow-y-auto">
              {output.length === 0 && (
                <div className="text-slate-500">No output yet. Run your code to see results.</div>
              )}
              
              {output.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`mb-1 ${
                    line.type === 'output' ? 'text-green-400' :
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'success' ? 'text-green-300' :
                    line.type === 'info' ? 'text-blue-400' :
                    'text-slate-300'
                  }`}
                >
                  <pre className="whitespace-pre-wrap">{line.content}</pre>
                </motion.div>
              ))}
              
              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-yellow-400 flex items-center space-x-2"
                >
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>Processing...</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CodeEditor