// ─────────────────────────────────────────────
// App.tsx — Controlador de telas
//
// Sem React Router. O status do useGuide decide
// qual tela está visível. O AnimatePresence do
// Motion cuida das transições entre elas.
// ─────────────────────────────────────────────

import { AnimatePresence } from 'motion/react'
import { useGuide } from './hooks/useGuide'
import { PromptInput } from './components/prompt/PromptInput'
import { LoadingScreen } from './components/prompt/LoadingScreen'
import { GuideView } from './components/guide/GuideView'

export function App() {
  const guide = useGuide()

  return (
    <main className="min-h-dvh bg-(--color-black) text-text-primary">
      <AnimatePresence mode="wait">

        {/* Tela de prompt — estado inicial e erro */}
        {(guide.status === 'idle' || guide.status === 'error') && (
          <PromptInput
            key="prompt"
            prompt={guide.prompt}
            error={guide.error}
            onPromptChange={guide.setPrompt}
            onSubmit={guide.generate}
          />
        )}

        {/* Loading — AI processando */}
        {guide.status === 'loading' && (
          <LoadingScreen
            key="loading"
            message={guide.loadingMessage}
          />
        )}

        {/* Guia gerado — sucesso */}
        {guide.status === 'success' && guide.guide && (
          <GuideView
            key="guide"
            guide={guide.guide}
            onReset={guide.reset}
          />
        )}

      </AnimatePresence>
    </main>
  )
}