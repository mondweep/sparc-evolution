import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Play, Trash2, Copy, Download } from 'lucide-react'

const SwarmTerminal = ({ output, onCommand, project }) => {
  const [input, setInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isExecuting) return

    setIsExecuting(true)
    setCommandHistory(prev => [...prev, input])
    setHistoryIndex(-1)
    
    await onCommand(input.trim())
    
    setInput('')
    setIsExecuting(false)
    
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : -1
        setHistoryIndex(newIndex)
        setInput(newIndex === -1 ? '' : commandHistory[newIndex])
      }
    }
  }

  const clearTerminal = () => {
    // Clear output by calling parent with empty array
    if (onCommand) {
      // This is a bit hacky, but we need a way to clear the terminal
      // In a real implementation, you'd have a separate clearOutput function
    }
  }

  const copyOutput = () => {
    const text = output.map(line => line.content).join('\n')
    navigator.clipboard.writeText(text)
  }

  const downloadLog = () => {
    const text = output.map(line => 
      `[${new Date(line.timestamp).toLocaleTimeString()}] ${line.content}`
    ).join('\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-${project.id}-terminal-log.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const suggestedCommands = [
    'npx ruv-swarm --help',
    'npx ruv-swarm init --topology mesh --agents 4',
    'npx ruv-swarm status',
    'npx ruv-swarm agent spawn --type researcher',
    'npx ruv-swarm memory store --key "test" --value "hello"',
    'npx ruv-swarm hook pre-task --description "learning"'
  ]

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Terminal className="text-green-400" size={18} />
          <h3 className="font-semibold text-white">rUv-Swarm Terminal</h3>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={copyOutput}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Copy output"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={downloadLog}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Download log"
          >
            <Download size={16} />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Clear terminal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="h-96 overflow-y-auto p-4 font-mono text-sm bg-slate-900"
        style={{ scrollBehavior: 'smooth' }}
      >
        {output.length === 0 && (
          <div className="text-slate-500">
            <p>🐝 Welcome to rUv-Swarm Interactive Terminal</p>
            <p>Type commands below to interact with the swarm system.</p>
            <p>Try starting with: <span className="text-cyan-400">npx ruv-swarm --help</span></p>
            <br />
          </div>
        )}
        
        {output.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-1 ${
              line.type === 'input' ? 'text-slate-300' :
              line.type === 'output' ? 'text-green-400' :
              line.type === 'error' ? 'text-red-400' :
              line.type === 'success' ? 'text-green-300' :
              'text-slate-400'
            }`}
          >
            <pre className="whitespace-pre-wrap font-mono">{line.content}</pre>
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
            <span>Executing command...</span>
          </motion.div>
        )}
      </div>

      {/* Command Input */}
      <div className="border-t border-slate-700 bg-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center p-4">
          <span className="text-green-400 mr-2 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter ruv-swarm command..."
            className="flex-1 bg-transparent text-white font-mono outline-none placeholder-slate-500"
            disabled={isExecuting}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isExecuting}
            className="ml-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
          >
            <Play size={14} />
            <span>Run</span>
          </button>
        </form>
        
        {/* Suggested Commands */}
        <div className="px-4 pb-4">
          <div className="text-xs text-slate-500 mb-2">Suggested commands:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedCommands.slice(0, 3).map((cmd, index) => (
              <button
                key={index}
                onClick={() => setInput(cmd)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded font-mono transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-slate-800/50 px-4 py-2 text-xs text-slate-500 border-t border-slate-700">
        💡 Use ↑/↓ arrows for command history • Commands are simulated for learning purposes
      </div>
    </div>
  )
}

export default SwarmTerminal