import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Clock,
  Terminal,
  FileText,
  Settings,
  Cog,
  Activity
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/active-trades', label: 'Active Trades', icon: TrendingUp },
  { path: '/pending-trades', label: 'Pending Trades', icon: Clock },
  { path: '/manual-control', label: 'Manual Control', icon: Terminal },
  { path: '/prompts', label: 'Prompt Manager', icon: FileText },
  { path: '/trading-settings', label: 'Trading Settings', icon: Settings },
  { path: '/system-settings', label: 'System Settings', icon: Cog },
]

export default function Sidebar() {
  const { theme } = useTheme()

  return (
    <div className="w-64 backdrop-blur-md bg-white/10 border-r border-white/10 flex flex-col relative z-20">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
            }}
          >
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Trading Bot</h1>
            <p className="text-xs text-white/60">Professional Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon 
                        className={`w-5 h-5 ${isActive ? 'text-white' : ''}`}
                        style={isActive ? { color: theme.primaryColor } : {}}
                      />
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/80">System Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}