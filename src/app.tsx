import { AnimatePresence } from 'motion/react'
import { useGuide } from './hooks/useGuide'
import { useTheme } from './hooks/useTheme'
import { PromptInput } from './components/prompt/PromptInput'
import { LoadingScreen } from './components/prompt/LoadingScreen'
import { GuideView } from './components/guide/GuideView'
import { ThemeToggle } from './components/ui/ThemeToggle'

export function App() {
  const guide = useGuide()
  const { theme, toggle } = useTheme()

  return (
    <main
      className="min-h-dvh transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-fg-primary)' }}
    >
      {/* Toggle de tema — fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle theme={theme} onToggle={toggle} />
      </div>

      <AnimatePresence mode="wait">
        {(guide.status === 'idle' || guide.status === 'error') && (
          <PromptInput
            key="prompt"
            prompt={guide.prompt}
            error={guide.error}
            onPromptChange={guide.setPrompt}
            onSubmit={guide.generate}
          />
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