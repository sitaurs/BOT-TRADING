import React, { useState } from 'react'
import { Terminal, Send, Copy, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ManualControl() {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const { token } = useAuth()

  const commonCommands = [
    '/status',
    '/profit_today',
    '/pause',
    '/resume',
    '/list_recipients',
    '/cls EURUSD',
    '/cls GBPUSD',
    '/cls USDJPY'
  ]

  const executeCommand = async () => {
    if (!command.trim()) return

    setIsLoading(true)
    setHistory(prev => [...prev, command])

    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ command: command.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setOutput(data.messages.join('\n'))
      } else {
        setOutput('Error: Failed to execute command')
      }
    } catch (error) {
      setOutput(`Error: ${error}`)
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      executeCommand()
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
  }

  const clearOutput = () => {
    setOutput('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manual Control</h2>
          <p className="text-white/60">Execute bot commands directly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Command Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Command Terminal</h3>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter command (e.g., /status)"
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  disabled={isLoading}
                />
                <button
                  onClick={executeCommand}
                  disabled={isLoading || !command.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Output */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/80">Output</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyOutput}
                      disabled={!output}
                      className="p-1 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={clearOutput}
                      disabled={!output}
                      className="p-1 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-black/30 border border-white/20 rounded-xl p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                    {output || 'Command output will appear here...'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Commands</h3>
            <div className="space-y-2">
              {commonCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => setCommand(cmd)}
                  className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-mono text-sm"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Command History */}
          {history.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Commands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.slice(-10).reverse().map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => setCommand(cmd)}
                    className="w-full text-left px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-mono text-sm truncate"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}