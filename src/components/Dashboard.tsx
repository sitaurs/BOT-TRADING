import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StatusCard from './StatusCard'
import OrdersTable from './OrdersTable'
import ManualControl from './ManualControl'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [status, setStatus] = useState<string>('')
  const [orders, setOrders] = useState<any>({ pending: [], live: [] })
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setStatus(data.message || '')
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchStatus(), fetchOrders()])
      setLoading(false)
    }
    
    loadData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [token])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="glass rounded-2xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto"></div>
            <p className="text-white/80 mt-4 text-center">Loading dashboard...</p>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return <StatusCard status={status} orders={orders} />
      case 'orders':
        return <OrdersTable orders={orders} onRefresh={fetchOrders} />
      case 'manual':
        return <ManualControl />
      default:
        return <StatusCard status={status} orders={orders} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex h-screen relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}