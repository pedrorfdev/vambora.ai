// ─────────────────────────────────────────────
// ThemeToggle.tsx — Botão dark/light
// ─────────────────────────────────────────────

import { motion } from 'motion/react'

interface ThemeToggleProps {
  theme: 'dark' | 'light'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center"
      style={{ 
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        border: '1px solid var(--color-bg-border)'
      }}
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ background: 'var(--color-yellow)' }}
      >
        <span className="text-[10px] leading-none select-none">
          {isDark ? '🌙' : '☀️'}
        </span>
      </motion.div>
      <div className="flex justify-between w-full px-1.5 opacity-30">
        <span className="text-[10px]">☀️</span>
        <span className="text-[10px]">🌙</span>
      </div>
    </button>
  )
}