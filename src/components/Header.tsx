import React from 'react'
import { LogOut, Bell, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { logout } = useAuth()

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <header className="glass-dark border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-white/60 text-sm">Monitor your trading bot performance</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
            <RefreshCw className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-white/20"></div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}