import { useState, useEffect } from 'react'
import { TrendingUp, RefreshCw, X, Edit } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ActiveTrades() {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setTrades(data.live || [])
      }
    } catch (error) {
      console.error('Failed to fetch active trades:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades()
    const interval = setInterval(fetchTrades, 10000)
    return () => clearInterval(interval)
  }, [])

  const closeTrade = async (symbol: string) => {
    if (!confirm(`Are you sure you want to close ${symbol}?`)) return
    
    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `/cls ${symbol}` })
      })
      
      if (response.ok) {
        fetchTrades()
      }
    } catch (error) {
      console.error('Failed to close trade:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto"></div>
          <p className="text-white/80 mt-4 text-center">Loading active trades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Active Trades</h2>
          <p className="text-white/60">Monitor your live trading positions</p>
        </div>
        
        <button
          onClick={fetchTrades}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
          }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {trades.length === 0 ? (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
          <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Active Trades</h3>
          <p className="text-white/60">Your active trades will appear here when positions are opened</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.map((trade, index) => (
            <div key={index} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{trade.data?.symbol}</h3>
                    <p className="text-green-400 text-sm font-medium">LIVE</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => closeTrade(trade.data?.symbol)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Type:</span>
                  <span className="text-white font-medium">
                    {trade.data?.type?.replace('ORDER_TYPE_', '') || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Entry Price:</span>
                  <span className="text-white font-medium">{trade.data?.price || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Stop Loss:</span>
                  <span className="text-red-400 font-medium">{trade.data?.sl || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Take Profit:</span>
                  <span className="text-green-400 font-medium">{trade.data?.tp || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Volume:</span>
                  <span className="text-white font-medium">{trade.data?.volume || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Ticket:</span>
                  <span className="text-white/80 font-mono text-sm">#{trade.data?.ticket || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">P&L:</span>
                  <span className="text-green-400 font-semibold">+$0.00</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}