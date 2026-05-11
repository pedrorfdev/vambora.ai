// ─────────────────────────────────────────────
// LandingPage.tsx — Orquestrador da landing
//
// Junta todas as seções em ordem.
// O scroll acontece aqui — cada seção ocupa
// pelo menos 100vh e entra conforme o usuário rola.
// ─────────────────────────────────────────────

import { HeroSection } from './sections/HeroSection'
import { AboutSection } from './sections/AboutSection'
import { HighlightSection } from './sections/HighlightSection'
import { ManifestoSection } from './sections/ManifestoSection'
import { DestinationsSection } from './sections/DestinationsSection'
import { LandingFooter } from './sections/LandingFooter'

interface LandingPageProps {
  onPromptSubmit: (prompt: string) => void
  error?: string | null
}

export function LandingPage({ onPromptSubmit, error }: LandingPageProps) {
  return (
    <div
      className="min-h-dvh overflow-x-hidden"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <HeroSection onSubmit={onPromptSubmit} error={error} />
      <AboutSection />
      <HighlightSection />
      <ManifestoSection />
      <DestinationsSection onSelect={onPromptSubmit} />
      <LandingFooter />
    </div>
  )
}