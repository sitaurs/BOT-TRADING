import { useState } from 'react'
import { LogOut, Moon, Sun, Play, Pause, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleDarkMode } = useTheme()
  const [isSchedulerPaused, setIsSchedulerPaused] = useState(false)

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  const toggleScheduler = async () => {
    try {
      const response = await fetch(`/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: isSchedulerPaused ? '/resume' : '/pause' 
        })
      })
      
      if (response.ok) {
        setIsSchedulerPaused(!isSchedulerPaused)
      }
    } catch (error) {
      console.error('Failed to toggle scheduler:', error)
    }
  }

  return (
    <header className="backdrop-blur-md bg-white/10 border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-white/60 text-sm">Monitor and control your trading bot</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Scheduler Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/70">Scheduler:</span>
            <button
              onClick={toggleScheduler}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isSchedulerPaused 
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
              }`}
            >
              {isSchedulerPaused ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm">Paused</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Running</span>
                </>
              )}
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            {theme.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          <div className="h-6 w-px bg-white/20"></div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-white/60">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}