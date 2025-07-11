import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, DollarSign, Clock, AlertTriangle, BarChart3 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function DashboardHome() {
  const [status, setStatus] = useState<string>('')
  const [orders, setOrders] = useState<any>({ pending: [], live: [] })
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  const fetchData = async () => {
    try {
      const [statusRes, ordersRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/orders')
      ])
      
      if (statusRes.ok) {
        const statusData = await statusRes.json()
        setStatus(statusData.message || '')
      }
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const totalOrders = orders.pending.length + orders.live.length
  const pendingCount = orders.pending.length
  const liveCount = orders.live.length

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Activity,
      color: theme.primaryColor,
      change: '+12%'
    },
    {
      title: 'Live Positions',
      value: liveCount,
      icon: TrendingUp,
      color: '#10b981',
      change: '+5%'
    },
    {
      title: 'Pending Orders',
      value: pendingCount,
      icon: Clock,
      color: '#f59e0b',
      change: '-2%'
    },
    {
      title: 'Daily P&L',
      value: '$0.00',
      icon: DollarSign,
      color: theme.secondaryColor,
      change: '+0%'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto"></div>
          <p className="text-white/80 mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Trading Dashboard</h1>
            <p className="text-white/60">Real-time monitoring and control center</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '40' }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Status */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Bot Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-xl p-4 max-h-64 overflow-y-auto">
            <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
              {status || 'Loading status...'}
            </pre>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          
          <div className="space-y-3">
            {orders.live.slice(0, 3).map((order: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-black/20 rounded-xl">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{order.data?.symbol || 'Unknown'}</p>
                  <p className="text-white/60 text-sm">Live Position</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">Active</p>
                  <p className="text-white/60 text-sm">#{order.data?.ticket || 'N/A'}</p>
                </div>
              </div>
            ))}
            
            {orders.pending.slice(0, 2).map((order: any, index: number) => (
              <div key={`pending-${index}`} className="flex items-center space-x-3 p-3 bg-black/20 rounded-xl">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{order.data?.symbol || 'Unknown'}</p>
                  <p className="text-white/60 text-sm">Pending Order</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-medium">Waiting</p>
                  <p className="text-white/60 text-sm">#{order.data?.ticket || 'N/A'}</p>
                </div>
              </div>
            ))}

            {totalOrders === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}