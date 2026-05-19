// ─────────────────────────────────────────────
// ThemeToggle.tsx — Controles de Tema e Cor
// ─────────────────────────────────────────────

import { motion } from 'motion/react'
import { Sun, Moon, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import type { Theme, ColorTheme } from '../../hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  colorTheme: ColorTheme
  onSelectColor: (c: ColorTheme) => void
}

export function ThemeToggle({ theme, onToggle, colorTheme, onSelectColor }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-bg-border)',
      }}
    >
      {/* Botão Chevron (toggle colors no mobile) */}
      <button 
        className="sm:hidden p-1.5 rounded-full transition-transform duration-300"
        style={{ color: 'var(--color-fg-secondary)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        onClick={(e) => { e.stopPropagation(); setIsOpen(v => !v) }}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Seletor de Cores */}
      <div className={`flex items-center gap-2.5 transition-all duration-300 overflow-hidden ${isOpen ? 'w-auto opacity-100 pr-3 border-r' : 'w-0 opacity-0 sm:w-auto sm:opacity-100 sm:pr-3 sm:border-r'}`} style={{ borderColor: 'var(--color-bg-border)' }}>
        {(['blue', 'yellow', 'green', 'red', 'purple'] as ColorTheme[]).map(color => {
          const bg = 
            color === 'blue' ? 'linear-gradient(135deg, #818CF8, #6366F1)' :
            color === 'yellow' ? 'linear-gradient(135deg, #FCD34D, #F59E0B)' :
            color === 'green' ? 'linear-gradient(135deg, #00C48C, #00A878)' :
            color === 'red' ? 'linear-gradient(135deg, #F87171, #EF4444)' :
            'linear-gradient(135deg, #C084FC, #A855F7)'
            
          const shadowColor = 
            color === 'blue' ? 'rgba(99, 102, 241, 0.5)' :
            color === 'yellow' ? 'rgba(245, 158, 11, 0.5)' :
            color === 'green' ? 'rgba(0, 168, 120, 0.5)' :
            color === 'red' ? 'rgba(239, 68, 68, 0.5)' :
            'rgba(168, 85, 247, 0.5)'

          return (
            <button
              key={color}
              onClick={() => onSelectColor(color)}
              className="w-5 h-5 rounded-full transition-transform hover:scale-110 flex items-center justify-center relative cursor-pointer"
              style={{
                background: bg,
                boxShadow: colorTheme === color ? `0 0 12px ${shadowColor}` : 'none',
                opacity: colorTheme === color ? 1 : 0.35,
                border: colorTheme === color ? 'none' : '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {colorTheme === color && (
                <motion.div layoutId="activeColor" className="absolute inset-0 rounded-full border-2 border-white opacity-90" style={{ mixBlendMode: 'overlay' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Dark/Light Toggle */}
      <button
        onClick={onToggle}
        title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        className="relative flex items-center cursor-pointer transition-all duration-300"
        style={{
          width: 50,
          height: 26,
          borderRadius: 999,
          background: isDark
            ? 'linear-gradient(135deg, rgba(15,23,30,0.9) 0%, rgba(30,20,50,0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255,220,100,0.25) 0%, rgba(255,180,50,0.15) 100%)',
          border: isDark
            ? '1px solid rgba(129,140,248,0.3)'
            : '1px solid rgba(232,160,32,0.4)',
          padding: '2px',
        }}
      >
        <motion.div
          animate={{ x: isDark ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 20,
            height: 20,
            background: isDark
              ? 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)'
              : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
            boxShadow: isDark
              ? '0 2px 8px rgba(99,102,241,0.5)'
              : '0 2px 8px rgba(245,158,11,0.5)',
            flexShrink: 0,
          }}
        >
          {isDark
            ? <Moon size={10} strokeWidth={2} color="#fff" />
            : <Sun size={11} strokeWidth={2.5} color="#fff" />
          }
        </motion.div>

        <div
          className="absolute flex items-center justify-between w-full px-1.5"
          style={{ opacity: 0.35, pointerEvents: 'none' }}
        >
          <span style={{ width: 20 }} />
          {isDark
            ? <Sun size={9} strokeWidth={2} color="#818CF8" style={{ position: 'absolute', left: 6 }} />
            : <Moon size={9} strokeWidth={2} color="#8B6914" style={{ position: 'absolute', right: 6 }} />
          }
        </div>
      </button>
    </div>
  )
}