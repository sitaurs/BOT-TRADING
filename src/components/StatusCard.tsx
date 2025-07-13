import { TrendingUp, Activity, DollarSign, Clock, AlertTriangle } from 'lucide-react'

interface StatusCardProps {
  status: string
  orders: {
    pending: any[]
    live: any[]
  }
}

export default function StatusCard({ status, orders }: StatusCardProps) {
  const totalOrders = orders.pending.length + orders.live.length
  const pendingCount = orders.pending.length
  const liveCount = orders.live.length

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Live Positions',
      value: liveCount,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: '+5%'
    },
    {
      title: 'Pending Orders',
      value: pendingCount,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      change: '-2%'
    },
    {
      title: 'Daily P&L',
      value: '$0.00',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      change: '+0%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Status */}
        <div className="glass rounded-2xl p-6">
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
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          
          <div className="space-y-3">
            {orders.live.slice(0, 3).map((order, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-black/20 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
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
            
            {orders.pending.slice(0, 2).map((order, index) => (
              <div key={`pending-${index}`} className="flex items-center space-x-3 p-3 bg-black/20 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
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