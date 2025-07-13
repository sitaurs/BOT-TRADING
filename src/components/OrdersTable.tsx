import { RefreshCw, TrendingUp, Clock, X } from 'lucide-react'

interface OrdersTableProps {
  orders: {
    pending: any[]
    live: any[]
  }
  onRefresh: () => void
}

export default function OrdersTable({ orders, onRefresh }: OrdersTableProps) {
  const allOrders = [
    ...orders.live.map(order => ({ ...order, status: 'live' })),
    ...orders.pending.map(order => ({ ...order, status: 'pending' }))
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders Management</h2>
          <p className="text-white/60">Monitor and manage your trading positions</p>
        </div>
        
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Symbol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">SL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">TP</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Volume</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Ticket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {allOrders.map((order, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {order.status === 'live' ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">Live</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">Pending</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {order.data?.symbol || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-white/80">
                    {order.data?.type?.replace('ORDER_TYPE_', '') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-white/80">
                    {order.data?.price || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-red-400">
                    {order.data?.sl || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-green-400">
                    {order.data?.tp || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-white/80">
                    {order.data?.volume || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-white/80 font-mono">
                    #{order.data?.ticket || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {allOrders.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No orders found</p>
              <p className="text-white/40 text-sm">Orders will appear here when they are created</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}