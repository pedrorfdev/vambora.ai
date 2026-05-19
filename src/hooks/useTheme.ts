import { useState, useEffect } from 'react'

export type Theme = 'dark' | 'light'
export type ColorTheme = 'blue' | 'yellow' | 'green'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Lê preferência salva, senão usa preferência do sistema
    const saved = localStorage.getItem('vambora-theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('vambora-color') as ColorTheme | null
    if (saved) return saved
    return 'blue' // Default
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else {
      root.removeAttribute('data-theme')
    }
    localStorage.setItem('vambora-theme', theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-color', colorTheme)
    localStorage.setItem('vambora-color', colorTheme)
  }, [colorTheme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return { theme, toggle, colorTheme, setColorTheme }
}