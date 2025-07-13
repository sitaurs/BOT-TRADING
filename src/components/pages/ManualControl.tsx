import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Terminal, Send, Copy, Trash2, Play, BarChart3, DollarSign, Pause, Users } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ManualControl() {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const { theme } = useTheme()

  const quickCommands = [
    { label: 'Bot Status', command: '/status', icon: BarChart3, color: theme.primaryColor },
    { label: 'Daily Profit', command: '/profit_today', icon: DollarSign, color: '#10b981' },
    { label: 'Pause Bot', command: '/pause', icon: Pause, color: '#f59e0b' },
    { label: 'Resume Bot', command: '/resume', icon: Play, color: '#10b981' },
    { label: 'List Recipients', command: '/list_recipients', icon: Users, color: theme.secondaryColor },
  ]

  const pairCommands = [
    { label: 'Close EURUSD', command: '/cls EURUSD' },
    { label: 'Close GBPUSD', command: '/cls GBPUSD' },
    { label: 'Close USDJPY', command: '/cls USDJPY' },
    { label: 'Close USDCHF', command: '/cls USDCHF' },
  ]

  const executeCommand = async () => {
    if (!command.trim()) return

    setIsLoading(true)
    setHistory(prev => [...prev, command])

    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          <p className="text-white/60">Execute bot commands and monitor responses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Command Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-5 h-5" style={{ color: theme.primaryColor }} />
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
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent font-mono"
                  style={{ '--tw-ring-color': theme.primaryColor } as CSSProperties }
                  disabled={isLoading}
                />
                <button
                  onClick={executeCommand}
                  disabled={isLoading || !command.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
                  }}
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
                <div className="bg-black/30 border border-white/20 rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                    {output || 'Command output will appear here...'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="space-y-6">
          {/* Main Commands */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Commands</h3>
            <div className="space-y-3">
              {quickCommands.map((cmd, index) => {
                const Icon = cmd.icon
                return (
                  <button
                    key={index}
                    onClick={() => setCommand(cmd.command)}
                    className="w-full flex items-center space-x-3 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cmd.color + '20' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: cmd.color }} />
                    </div>
                    <span className="font-medium">{cmd.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pair Commands */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Close Positions</h3>
            <div className="space-y-2">
              {pairCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => setCommand(cmd.command)}
                  className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-mono text-sm"
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Command History */}
          {history.length > 0 && (
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
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