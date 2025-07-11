import React from 'react'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  Terminal,
  Activity,
  Users,
  Calendar,
  FileText
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: TrendingUp },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'manual', label: 'Manual Control', icon: Terminal },
  { id: 'scheduler', label: 'Scheduler', icon: Calendar },
  { id: 'prompts', label: 'Prompt Manager', icon: FileText },
  { id: 'recipients', label: 'Recipients', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 glass-dark border-r border-white/10 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Trading Bot</h1>
            <p className="text-xs text-white/60">Dashboard v2.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/80">System Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}