import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const [theme, setTheme] = useState('Light')
  const [accentColor, setAccentColor] = useState('#9fe870')

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'
  }

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    const effectiveTheme = newTheme === 'System' ? getSystemTheme() : newTheme
    
    if (effectiveTheme === 'Dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const applyAccentColor = (color) => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', color)
    root.style.setProperty('--color-primary-hover', `${color}cc`)
    root.style.setProperty('--color-primary-pale', `${color}20`)
  }

  useEffect(() => {
    if (!user) {
      const systemTheme = getSystemTheme()
      setTheme(systemTheme)
      applyTheme(systemTheme)
      return
    }
    loadTheme()
  }, [user])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'System') {
        applyTheme('System')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const loadTheme = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('theme, accent_color')
      .eq('user_id', user.id)
      .single()

    if (data && !error) {
      const userTheme = data.theme || 'Light'
      setTheme(userTheme)
      setAccentColor(data.accent_color || '#9fe870')
      applyTheme(userTheme)
      applyAccentColor(data.accent_color || '#9fe870')
    } else {
      const systemTheme = getSystemTheme()
      setTheme(systemTheme)
      applyTheme(systemTheme)
    }
  }

  const updateTheme = async (newTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    
    if (user) {
      await supabase
        .from('user_settings')
        .update({ theme: newTheme })
        .eq('user_id', user.id)
    }
  }

  const updateAccentColor = async (color) => {
    setAccentColor(color)
    applyAccentColor(color)
    
    if (user) {
      await supabase
        .from('user_settings')
        .update({ accent_color: color })
        .eq('user_id', user.id)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, updateTheme, updateAccentColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}