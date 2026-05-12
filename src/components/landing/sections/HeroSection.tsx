// ─────────────────────────────────────────────
// HeroSection.tsx
//
// Imagem de fundo tela cheia + overlay escuro
// Copy do manifesto integrado acima do prompt
// Leque de destinos abaixo — hover pula, click gera
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface HeroSectionProps {
  onSubmit: (prompt: string) => void
  error?: string | null
}

// Imagem de fundo — Rio de Janeiro aerial, alta qualidade
const BG_IMAGE = 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2400&q=90'

// Destinos do leque — 7 cards em semicírculo
const FAN_DESTINATIONS = [
  {
    url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=300&q=80',
    label: 'Florianópolis', estado: 'SC',
    prompt: 'Florianópolis, SC — 4 dias, praias e gastronomia local',
    rot: -54, tx: -260, ty: 40,
  },
  {
    url: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=300&q=80',
    label: 'Chapada', estado: 'BA',
    prompt: 'Chapada Diamantina, BA — 6 dias, trilhas e cachoeiras',
    rot: -36, tx: -160, ty: 10,
  },
  {
    url: 'https://images.unsplash.com/photo-1548963670-c94ea3d0e9ea?auto=format&fit=crop&w=300&q=80',
    label: 'Salvador', estado: 'BA',
    prompt: 'Salvador, BA — 4 dias, cultura e gastronomia baiana',
    rot: -18, tx: -70, ty: -4,
  },
  {
    url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=300&q=80',
    label: 'Rio de Janeiro', estado: 'RJ',
    prompt: 'Rio de Janeiro, RJ — 5 dias, pontos turísticos e cultura carioca',
    rot: 0, tx: 0, ty: -8,
  },
  {
    url: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=300&q=80',
    label: 'Lençóis', estado: 'MA',
    prompt: 'Lençóis Maranhenses, MA — 4 dias, dunas e lagoas',
    rot: 18, tx: 70, ty: -4,
  },
  {
    url: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?auto=format&fit=crop&w=300&q=80',
    label: 'Gramado', estado: 'RS',
    prompt: 'Gramado, RS — 3 dias, gastronomia e clima de montanha',
    rot: 36, tx: 160, ty: 10,
  },
  {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=300&q=80',
    label: 'Pantanal', estado: 'MS',
    prompt: 'Pantanal, MS — 4 dias, ecoturismo e vida selvagem',
    rot: 54, tx: 260, ty: 40,
  },
]

const ROTATING_WORDS = ['praias', 'trilhas', 'festivais', 'sabores', 'aventuras', 'histórias']

// Card individual do leque
function FanCard({
  dest, index, isVisible, onSelect,
}: {
  dest: typeof FAN_DESTINATIONS[0]
  index: number
  isVisible: boolean
  onSelect: (prompt: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const W = 90
  const H = 120

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(dest.prompt)}
      className="absolute rounded-xl overflow-hidden cursor-pointer"
      style={{
        width: W,
        height: H,
        left: '50%',
        bottom: 0,
        marginLeft: -W / 2,
        transformOrigin: '50% 100%',
        border: hovered
          ? '1.5px solid var(--color-yellow-border)'
          : '1px solid rgba(255,255,255,0.12)',
        boxShadow: hovered
          ? 'var(--shadow-yellow), 0 8px 32px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      initial={{ rotate: dest.rot, x: dest.tx, y: 120, opacity: 0, scale: 0.7 }}
      animate={isVisible
        ? {
          rotate: dest.rot,
          x: dest.tx,
          y: hovered ? dest.ty - 14 : dest.ty,
          opacity: 1,
          scale: hovered ? 1.08 : 1,
          transition: {
            rotate: { duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
            y: hovered
              ? { duration: 0.25, ease: 'easeOut' }
              : { duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.5, delay: index * 0.06 },
            scale: { duration: 0.2, ease: 'easeOut' },
          },
        }
        : {}
      }
    >
      <img
        src={dest.url}
        alt={dest.label}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Overlay base */}
      <div
        className="absolute inset-0"
        style={{
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
          transition: 'background 0.2s',
        }}
      />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
        <p
          className="text-xs font-semibold leading-tight"
          style={{ color: hovered ? 'var(--color-yellow)' : 'rgba(255,255,255,0.9)' }}
        >
          {dest.label}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>
          {dest.estado}
        </p>
      </div>

      {/* Glow no topo ao hover */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: 'var(--color-yellow)' }}
        />
      )}
    </motion.button>
  )
}

export function HeroSection({ onSubmit, error }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('')
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [fanVisible, setFanVisible] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setFanVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % ROTATING_WORDS.length), 2400)
    return () => clearInterval(t)
  }, [])

  function handleSubmit(p?: string) {
    const text = p ?? prompt
    if (!text.trim()) return
    setIsCollapsing(true)
    setTimeout(() => onSubmit(text), 600)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden">

      {/* ── Imagem de fundo ── */}
      <div className="absolute inset-0">
        <img
          src={BG_IMAGE}
          alt="Brasil"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.45) saturate(0.8)' }}
        />
        {/* Overlay gradiente — escurece bottom pra o leque e top pro conteúdo */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(to bottom, rgba(15,14,13,0.7) 0%, rgba(15,14,13,0.3) 30%, rgba(15,14,13,0.3) 60%, rgba(15,14,13,0.92) 100%)',
            ].join(', '),
          }}
        />
      </div>

      {/* ── Conteúdo central ── */}
      <motion.div
        className="relative flex flex-col items-center gap-6 px-6 text-center w-full"
        style={{ zIndex: 2, paddingBottom: '220px' }}
        animate={isCollapsing
          ? { opacity: 0, scale: 0.96, transition: { duration: 0.35, delay: 0.2 } }
          : { opacity: 1, scale: 1 }
        }
      >
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(232,184,75,0.15)',
              border: '1px solid rgba(232,184,75,0.35)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L13.5 8H20L14.5 12L16.5 18.5L11 14.5L5.5 18.5L7.5 12L2 8H8.5L11 2Z"
                fill="var(--color-yellow)" opacity="0.9" />
            </svg>
          </div>

          {/* Nome */}
          <h1
            className="font-serif tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              color: '#F2EEE8',
              lineHeight: 0.95,
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            vambora<span style={{ color: 'var(--color-yellow)' }}>.ai</span>
          </h1>

          {/* Manifesto integrado */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(242,238,232,0.55)',
              maxWidth: '480px',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            O Brasil é grande demais pra ficar parado.{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ color: 'var(--color-yellow)', fontWeight: 400 }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
            {' '}te esperam.
          </p>
        </motion.div>

        {/* Input de prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(28,26,24,0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={() => { }}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={'Descreva sua viagem...\nEx: Floripa em maio, 4 dias, casal, R$2.000'}
              rows={3}
              className="w-full bg-transparent resize-none outline-none leading-relaxed px-6 pt-5 pb-3"
              style={{
                color: '#F2EEE8',
                fontSize: '0.9375rem',
                caretColor: 'var(--color-yellow)',
                fontFamily: 'var(--font-sans)',
              }}
            />

            <div className="flex items-center justify-between px-5 pb-4 pt-1">
              <div>
                {error
                  ? <p className="text-xs font-medium" style={{ color: '#f87171' }}>{error}</p>
                  : <p style={{ fontSize: '0.7rem', color: 'rgba(242,238,232,0.25)' }}>
                    Enter para gerar · Shift+Enter nova linha
                  </p>
                }
              </div>
              <button
                onClick={() => handleSubmit()}
                disabled={!prompt.trim()}
                className="btn-primary disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
              >
                Vambora →
              </button>
            </div>
          </div>

          {/* Hint leque */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-3 text-center"
            style={{ fontSize: '0.7rem', color: 'rgba(242,238,232,0.3)', letterSpacing: '0.08em' }}
          >
            ou escolha um destino abaixo
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ── Leque de destinos ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex justify-center"
        style={{
          height: '200px',
          zIndex: 3,
          pointerEvents: isCollapsing ? 'none' : 'auto',
        }}
        animate={isCollapsing
          ? { opacity: 0, y: 40, transition: { duration: 0.3 } }
          : { opacity: 1, y: 0 }
        }
      >
        {FAN_DESTINATIONS.map((dest, i) => (
          <FanCard
            key={dest.label}
            dest={dest}
            index={i}
            isVisible={fanVisible}
            onSelect={(p) => handleSubmit(p)}
          />
        ))}
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute right-8 bottom-8 flex flex-col items-center gap-2"
        style={{ zIndex: 4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span
          style={{
            fontSize: '0.6rem',
            color: 'rgba(242,238,232,0.25)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          explorar
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'rgba(242,238,232,0.25)', fontSize: '0.7rem' }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  )
}