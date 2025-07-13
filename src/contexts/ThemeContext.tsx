import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeSettings {
  isDarkMode: boolean
  primaryColor: string
  secondaryColor: string
  backgroundImage?: string
  backgroundColor: string
}

interface ThemeContextType {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
  toggleDarkMode: () => void
}

const defaultTheme: ThemeSettings = {
  isDarkMode: true,
  primaryColor: '#6366f1',
  secondaryColor: '#d946ef',
  backgroundColor: '#0f172a',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard_theme')
    if (savedTheme) {
      setTheme({ ...defaultTheme, ...JSON.parse(savedTheme) })
    }
  }, [])

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    const newTheme = { ...theme, ...updates }
    setTheme(newTheme)
    localStorage.setItem('dashboard_theme', JSON.stringify(newTheme))
  }

  const toggleDarkMode = () => {
    updateTheme({ isDarkMode: !theme.isDarkMode })
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, toggleDarkMode }}>
      <div 
        className={`min-h-screen transition-all duration-300 ${
          theme.isDarkMode ? 'dark' : ''
        }`}
        style={{
          background: theme.backgroundImage 
            ? `url(${theme.backgroundImage})` 
            : `linear-gradient(135deg, ${theme.backgroundColor}, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}