import React, { useState, useEffect } from 'react'
import { Settings, Save, Plus, Trash2, DollarSign, TrendingUp } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function TradingSettings() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPair, setNewPair] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const { theme } = useTheme()

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.env || {})
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ env: settings })
      })
      
      if (response.ok) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  const addSupportedPair = () => {
    if (!newPair.trim()) return
    
    const currentPairs = settings.SUPPORTED_PAIRS ? settings.SUPPORTED_PAIRS.split(',') : []
    const updatedPairs = [...currentPairs, newPair.trim().toUpperCase()].join(',')
    updateSetting('SUPPORTED_PAIRS', updatedPairs)
    setNewPair('')
  }

  const removeSupportedPair = (pairToRemove: string) => {
    const currentPairs = settings.SUPPORTED_PAIRS ? settings.SUPPORTED_PAIRS.split(',') : []
    const updatedPairs = currentPairs.filter((pair: string) => pair.trim() !== pairToRemove).join(',')
    updateSetting('SUPPORTED_PAIRS', updatedPairs)
  }

  const addApiKey = () => {
    if (!newApiKey.trim()) return
    
    // Find the next available CHART_IMG_KEY_N
    let keyIndex = 1
    while (settings[`CHART_IMG_KEY_${keyIndex}`]) {
      keyIndex++
    }
    
    updateSetting(`CHART_IMG_KEY_${keyIndex}`, newApiKey.trim())
    setNewApiKey('')
  }

  const removeApiKey = (keyName: string) => {
    const newSettings = { ...settings }
    delete newSettings[keyName]
    setSettings(newSettings)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto"></div>
          <p className="text-white/80 mt-4 text-center">Loading settings...</p>
        </div>
      </div>
    )
  }

  const supportedPairs = settings.SUPPORTED_PAIRS ? settings.SUPPORTED_PAIRS.split(',') : []
  const chartApiKeys = Object.keys(settings).filter(key => key.startsWith('CHART_IMG_KEY_'))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Settings</h2>
          <p className="text-white/60">Configure trading parameters and API settings</p>
        </div>
        
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white disabled:opacity-50"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
          }}
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Parameters */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-5 h-5" style={{ color: theme.primaryColor }} />
            <h3 className="text-lg font-semibold text-white">Trading Parameters</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Trade Volume</label>
              <input
                type="number"
                step="0.01"
                value={settings.TRADE_VOLUME || ''}
                onChange={(e) => updateSetting('TRADE_VOLUME', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Monitoring Interval (minutes)</label>
              <input
                type="number"
                value={settings.MONITORING_INTERVAL_MINUTES || ''}
                onChange={(e) => updateSetting('MONITORING_INTERVAL_MINUTES', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="2"
              />
            </div>
          </div>
        </div>

        {/* Supported Pairs */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-5 h-5" style={{ color: theme.secondaryColor }} />
            <h3 className="text-lg font-semibold text-white">Supported Pairs</h3>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPair}
                onChange={(e) => setNewPair(e.target.value)}
                placeholder="e.g., EURUSD"
                className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
              />
              <button
                onClick={addSupportedPair}
                className="px-4 py-2 rounded-xl transition-all duration-200 text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {supportedPairs.map((pair: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                  <span className="text-white font-medium">{pair.trim()}</span>
                  <button
                    onClick={() => removeSupportedPair(pair.trim())}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Broker API Settings */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-5 h-5" style={{ color: theme.primaryColor }} />
            <h3 className="text-lg font-semibold text-white">Broker API Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Broker API Base URL</label>
              <input
                type="url"
                value={settings.BROKER_API_BASE_URL || ''}
                onChange={(e) => updateSetting('BROKER_API_BASE_URL', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="https://your-broker-api-url.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Broker API Key</label>
              <input
                type="password"
                value={settings.BROKER_API_KEY || ''}
                onChange={(e) => updateSetting('BROKER_API_KEY', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Your broker API key"
              />
            </div>
          </div>
        </div>

        {/* Chart API Keys */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-5 h-5" style={{ color: theme.secondaryColor }} />
            <h3 className="text-lg font-semibold text-white">Chart API Keys</h3>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="Enter new API key"
                className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
              />
              <button
                onClick={addApiKey}
                className="px-4 py-2 rounded-xl transition-all duration-200 text-white"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {chartApiKeys.map((keyName: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                  <div>
                    <span className="text-white/60 text-sm">{keyName}</span>
                    <p className="text-white font-mono text-sm">
                      {settings[keyName]?.substring(0, 20)}...
                    </p>
                  </div>
                  <button
                    onClick={() => removeApiKey(keyName)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}