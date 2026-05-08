// ─────────────────────────────────────────────
// ThemeToggle.tsx — Botão dark/light
// ─────────────────────────────────────────────

import { motion } from 'motion/react'

interface ThemeToggleProps {
  theme: 'dark' | 'light'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        w-10 h-10 rounded-xl flex items-center justify-center
        border transition-all duration-200 cursor-pointer
      "
      style={{
        background: 'var(--color-bg-card)',
        borderColor: 'var(--color-bg-border)',
        color: 'var(--color-fg-secondary)',
      }}
      title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
        transition={{ duration: 0.2 }}
        className="text-base leading-none"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </motion.span>
    </motion.button>
  )
}