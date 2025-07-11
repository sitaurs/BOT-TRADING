import React, { useState, useEffect } from 'react'
import { FileText, Save, RefreshCw, Edit, Eye } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function PromptManager() {
  const [prompts, setPrompts] = useState<string[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [promptContent, setPromptContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { theme } = useTheme()

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.files || [])
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPromptContent = async (filename: string) => {
    try {
      const response = await fetch(`/api/prompts?file=${filename}`)
      if (response.ok) {
        const data = await response.json()
        setPromptContent(data.content || '')
      }
    } catch (error) {
      console.error('Failed to fetch prompt content:', error)
    }
  }

  const savePrompt = async () => {
    if (!selectedPrompt) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: selectedPrompt,
          content: promptContent
        })
      })
      
      if (response.ok) {
        setIsEditing(false)
        alert('Prompt saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save prompt:', error)
      alert('Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [])

  useEffect(() => {
    if (selectedPrompt) {
      fetchPromptContent(selectedPrompt)
      setIsEditing(false)
    }
  }, [selectedPrompt])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 mx-auto"></div>
          <p className="text-white/80 mt-4 text-center">Loading prompts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Prompt Manager</h2>
          <p className="text-white/60">Edit and manage AI prompts for trading analysis</p>
        </div>
        
        <button
          onClick={fetchPrompts}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
          }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Prompt List */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Available Prompts</h3>
          <div className="space-y-2">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setSelectedPrompt(prompt)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                  selectedPrompt === prompt
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium truncate">{prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Editor */}
        <div className="lg:col-span-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          {selectedPrompt ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  <h3 className="text-lg font-semibold text-white">{selectedPrompt}</h3>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'bg-gray-500/20 text-gray-300' 
                        : 'text-white'
                    }`}
                    style={!isEditing ? { 
                      background: `linear-gradient(135deg, ${theme.primaryColor}40, ${theme.secondaryColor}40)` 
                    } : {}}
                  >
                    {isEditing ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{isEditing ? 'Preview' : 'Edit'}</span>
                  </button>
                  
                  {isEditing && (
                    <button
                      onClick={savePrompt}
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
                      <span>Save</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="h-[600px]">
                {isEditing ? (
                  <textarea
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value)}
                    className="w-full h-full bg-black/30 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent resize-none font-mono text-sm"
                    style={{ focusRingColor: theme.primaryColor }}
                    placeholder="Enter prompt content..."
                  />
                ) : (
                  <div className="w-full h-full bg-black/30 border border-white/20 rounded-xl p-4 overflow-y-auto">
                    <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                      {promptContent || 'Select a prompt to view its content'}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Prompt Selected</h3>
                <p className="text-white/60">Select a prompt from the list to view and edit its content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}