import { useState } from 'react'
import { Save, Palette, User, Lock, Upload, Image } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

export default function SystemSettings() {
  const { theme, updateTheme } = useTheme()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [credentials, setCredentials] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const colorPresets = [
    { name: 'Purple-Blue', primary: '#6366f1', secondary: '#d946ef' },
    { name: 'Green-Teal', primary: '#10b981', secondary: '#06b6d4' },
    { name: 'Orange-Red', primary: '#f59e0b', secondary: '#ef4444' },
    { name: 'Pink-Purple', primary: '#ec4899', secondary: '#8b5cf6' },
    { name: 'Blue-Cyan', primary: '#3b82f6', secondary: '#06b6d4' },
  ]

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    updateTheme({ [type === 'primary' ? 'primaryColor' : 'secondaryColor']: color })
  }

  const handlePresetSelect = (preset: any) => {
    updateTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    })
  }

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateTheme({ backgroundImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBackgroundImage = () => {
    updateTheme({ backgroundImage: undefined })
  }

  const saveSystemSettings = async () => {
    setSaving(true)
    // Simulate save operation
    setTimeout(() => {
      setSaving(false)
      alert('System settings saved successfully!')
    }, 1000)
  }

  const updatePassword = async () => {
    if (credentials.newPassword !== credentials.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    if (credentials.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }

    // Simulate password update
    alert('Password updated successfully!')
    setCredentials({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-white/60">Customize appearance and manage account settings</p>
        </div>
        
        <button
          onClick={saveSystemSettings}
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
        {/* Theme Settings */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-5 h-5" style={{ color: theme.primaryColor }} />
            <h3 className="text-lg font-semibold text-white">Theme Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">Color Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset)}
                    className="flex items-center space-x-2 p-3 bg-black/20 hover:bg-black/30 rounded-xl transition-all duration-200"
                  >
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="flex-1 px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Background Settings */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">Background</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                    id="background-upload"
                  />
                  <label
                    htmlFor="background-upload"
                    className="flex items-center space-x-2 px-4 py-2 bg-black/30 hover:bg-black/40 border border-white/20 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">Upload Image</span>
                  </label>
                  
                  {theme.backgroundImage && (
                    <button
                      onClick={removeBackgroundImage}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {theme.backgroundImage && (
                  <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                    <Image className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">Custom background applied</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-5 h-5" style={{ color: theme.secondaryColor }} />
            <h3 className="text-lg font-semibold text-white">Account Settings</h3>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="p-4 bg-black/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{user?.username}</h4>
                  <p className="text-white/60 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="w-4 h-4 text-white/60" />
                <h4 className="text-white font-medium">Change Password</h4>
              </div>
              
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={credentials.currentPassword}
                  onChange={(e) => setCredentials(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                />
                
                <input
                  type="password"
                  placeholder="New Password"
                  value={credentials.newPassword}
                  onChange={(e) => setCredentials(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                />
                
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent"
                />
                
                <button
                  onClick={updatePassword}
                  className="w-full px-4 py-3 rounded-xl transition-all duration-200 text-white"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}