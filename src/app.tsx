// ─────────────────────────────────────────────
// App.tsx — Controlador de telas do Vambora.ai
// ─────────────────────────────────────────────

import { motion, AnimatePresence } from 'motion/react'
import { useGuide } from './hooks/useGuide'
import { useTheme } from './hooks/useTheme'
import { LandingPage } from './components/landing/LandingPage'
import { LoadingScreen } from './components/prompt/LoadingScreen'
import { GuideView } from './components/guide/GuideView'
import { ThemeToggle } from './components/ui/ThemeToggle'

export function App() {
  const guide = useGuide()
  const { theme, toggle } = useTheme()

  async function handlePromptSubmit(prompt: string) {
    guide.setPrompt(prompt)
    guide.generate(prompt)
  }

  return (
    <main className="min-h-dvh transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-fg-primary)' }}
    >
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-100">
        <ThemeToggle theme={theme} onToggle={toggle} />
      </div>

      <AnimatePresence mode="wait">

        {(guide.status === 'idle' || guide.status === 'error') && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
            <LandingPage
              onPromptSubmit={handlePromptSubmit}
              error={guide.error}
            />
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