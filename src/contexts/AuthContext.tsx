import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string
  email?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
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
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('dashboard_user')
    const savedAuth = localStorage.getItem('dashboard_auth')
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this should be server-side
    const defaultCredentials = {
      username: 'admin',
      password: 'admin123'
    }

    if (username === defaultCredentials.username && password === defaultCredentials.password) {
      const userData = { username, email: 'admin@tradingbot.com' }
      localStorage.setItem('dashboard_user', JSON.stringify(userData))
      localStorage.setItem('dashboard_auth', 'true')
      setUser(userData)
      setIsAuthenticated(true)
      return true
    }
    
    return false
  }

  const logout = () => {
    localStorage.removeItem('dashboard_user')
    localStorage.removeItem('dashboard_auth')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}