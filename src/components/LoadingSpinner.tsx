import { TrendingUp } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
            <TrendingUp className="w-6 h-6 text-primary-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white/80 text-center">Loading dashboard...</p>
        </div>
      </div>
    </div>
  )
}