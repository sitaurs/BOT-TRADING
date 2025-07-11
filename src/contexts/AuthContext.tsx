import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => Promise<boolean>
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('dashboard_token')
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (inputToken: string): Promise<boolean> => {
    try {
      // Test the token by making a request to the status endpoint
      const response = await fetch('/api/status', {
        headers: {
          'Authorization': `Bearer ${inputToken}`
        }
      })

      if (response.ok) {
        localStorage.setItem('dashboard_token', inputToken)
        setToken(inputToken)
        setIsAuthenticated(true)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('dashboard_token')
    setToken(null)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}