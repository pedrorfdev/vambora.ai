// ─────────────────────────────────────────────
// App.tsx — Controlador de telas do Vambora.ai
//
// idle     → LandingPage (hero + seções)
// loading  → LoadingScreen
// success  → GuideView
// error    → LandingPage com erro
// ─────────────────────────────────────────────

import { AnimatePresence } from 'motion/react'
import { useGuide } from './hooks/useGuide'
import { useTheme } from './hooks/useTheme'
import { LandingPage } from './components/landing/LandingPage'
import { LoadingScreen } from './components/prompt/LoadingScreen'
import { GuideView } from './components/guide/GuideView'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { motion } from 'motion/react'

export function App() {
  const guide = useGuide()
  const { theme, toggle } = useTheme()

  function handlePromptSubmit(prompt: string) {
    guide.setPrompt(prompt)
    guide.generate(prompt)
  }

  return (
    <main
      className="min-h-dvh transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-fg-primary)' }}
    >
      {/* Toggle de tema — fixo no canto, só no guia e loading */}
      {guide.status !== 'idle' && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      )}

      <AnimatePresence mode="wait">

        {(guide.status === 'idle' || guide.status === 'error') && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onPromptSubmit={handlePromptSubmit} />
          </motion.div>
        )}

        {guide.status === 'loading' && (
          <LoadingScreen
            key="loading"
            message={guide.loadingMessage}
          />
        )}

        {guide.status === 'success' && guide.guide && (
          <GuideView
            key="guide"
            guide={guide.guide}
            onReset={guide.reset}
            onAdapt={guide.adapt}
            isAdapting={guide.isAdapting}
            adaptMessage={guide.loadingMessage}
          />
        )}

      </AnimatePresence>
    </main>
  )
}