// ─────────────────────────────────────────────
// PromptInput.tsx — Tela inicial do Vambora.ai
// ─────────────────────────────────────────────

import { useRef } from 'react'
import { motion } from 'motion/react'

interface PromptInputProps {
  prompt: string
  error: string | null
  onPromptChange: (value: string) => void
  onSubmit: () => void
}

const EXAMPLE_PROMPTS = [
  'Floripa, semana que vem, 4 dias, R$1.500',
  'Rio de Janeiro no carnaval, casal, 5 dias',
  'Chapada Diamantina, trilhas, julho, 7 dias',
  'Salvador, Réveillon, família com criança',
  'Bonito MS, ecoturismo, 3 dias, R$2.000',
  'Lençóis Maranhenses, férias de julho',
]

export function PromptInput({ prompt, error, onPromptChange, onSubmit }: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-24"
      style={{ background: 'var(--color-bg-base)' }}
    >

      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex flex-col items-center gap-5 mb-16"
      >
        <div className="w-16 h-16 rounded-2xl bg-yellow-glow border border-yellow-border flex items-center justify-center shadow-[0_0_48px_var(--color-yellow-glow)]">
          <span className="text-3xl">✈</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-serif text-5xl font-normal tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            vambora<span style={{ color: 'var(--color-yellow)' }}>.ai</span>
          </h1>
          <p className="text-base text-center max-w-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Fala o destino, a data e o orçamento —
            <br />a gente monta o roteiro.
          </p>
        </div>
      </motion.div>

      {/* ── Input principal ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div 
          className={`
            rounded-2xl transition-all duration-200
            focus-within:shadow-[0_0_0_4px_var(--color-yellow-glow)]
            ${error ? 'border-red-500/40 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]' : 'focus-within:border-[var(--color-yellow-border)]'}
          `}
          style={{
            background: 'var(--color-bg-card)',
            border: error ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--color-bg-border)'
          }}
        >
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Floripa em maio, 4 dias, casal, orçamento de R$2.000..."
            rows={3}
            className="
              w-full bg-transparent resize-none outline-none
              text-base leading-relaxed
              px-6 pt-5 pb-3
              placeholder:text-text-muted
            "
            style={{ color: 'var(--color-text-primary)' }}
          />

          {/* Rodapé do input */}
          <div className="flex items-center justify-between px-5 pb-4 pt-1">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Enter para gerar · Shift+Enter nova linha
            </span>
            <button
              onClick={onSubmit}
              disabled={!prompt.trim()}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            >
              Vambora →
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-center text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* ── Exemplos ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 flex flex-col items-center gap-4 w-full max-w-2xl"
      >
        <p className="text-xs tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
          Experimente um desses:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_PROMPTS.map(example => (
            <button
              key={example}
              onClick={() => {
                onPromptChange(example)
                textareaRef.current?.focus()
              }}
              className="
                text-xs px-4 py-2 rounded-full cursor-pointer
                transition-all duration-200
                hover:shadow-[var(--shadow-yellow)] hover:-translate-y-0.5
              "
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-bg-border)',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-yellow-border)';
                e.currentTarget.style.color = 'var(--color-yellow)';
                e.currentTarget.style.background = 'var(--color-yellow-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-bg-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.background = 'var(--color-bg-card)';
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-24 text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        powered by Gemini · feito com 🇧🇷
      </motion.p>

    </motion.div>
  )
}