import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import DashboardHome from './pages/DashboardHome'
import ActiveTrades from './pages/ActiveTrades'
import PendingTrades from './pages/PendingTrades'
import ManualControl from './pages/ManualControl'
import PromptManager from './pages/PromptManager'
import TradingSettings from './pages/TradingSettings'
import SystemSettings from './pages/SystemSettings'

export default function Dashboard() {

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/active-trades" element={<ActiveTrades />} />
              <Route path="/pending-trades" element={<PendingTrades />} />
              <Route path="/manual-control" element={<ManualControl />} />
              <Route path="/prompts" element={<PromptManager />} />
              <Route path="/trading-settings" element={<TradingSettings />} />
              <Route path="/system-settings" element={<SystemSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}