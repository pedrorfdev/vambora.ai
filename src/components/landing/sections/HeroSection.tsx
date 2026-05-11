// ─────────────────────────────────────────────
// HeroSection.tsx — Hero estilo Roasted/Cosmos
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface HeroSectionProps {
  onSubmit: (prompt: string) => void
}

const FLOATING_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80',
    label: 'Rio de Janeiro',
    initialX: -420, initialY: -180, initialRot: -15, w: 180,
  },
  {
    url: 'https://images.unsplash.com/photo-1560449752-8b6ead57b89a?w=300&q=80',
    label: 'Salvador',
    initialX: 380, initialY: -220, initialRot: 12, w: 200,
  },
  {
    url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=300&q=80',
    label: 'Florianópolis',
    initialX: -380, initialY: 200, initialRot: 8, w: 170,
  },
  {
    url: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=300&q=80',
    label: 'Chapada Diamantina',
    initialX: 400, initialY: 180, initialRot: -10, w: 190,
  },
  {
    url: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=300&q=80',
    label: 'Gramado',
    initialX: -200, initialY: -320, initialRot: 6, w: 155,
  },
  {
    url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=300&q=80',
    label: 'Amazônia',
    initialX: 220, initialY: -300, initialRot: -7, w: 165,
  },
  {
    url: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=300&q=80',
    label: 'Lençóis Maranhenses',
    initialX: -260, initialY: 300, initialRot: -12, w: 175,
  },
  {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=300&q=80',
    label: 'Pantanal',
    initialX: 260, initialY: 290, initialRot: 9, w: 160,
  },
]

const ROTATING_WORDS = ['aventuras', 'praias', 'trilhas', 'festivais', 'sabores', 'histórias']

const EXAMPLE_PROMPTS = [
  'Floripa em maio, 4 dias, casal, R$2.000',
  'Rio de Janeiro no carnaval, 5 dias',
  'Chapada Diamantina, trilhas, julho',
  'Salvador, Réveillon, família com criança',
]

function FloatingCard({
  image, index, isCollapsing, isVisible,
}: {
  image: typeof FLOATING_IMAGES[0]
  index: number
  isCollapsing: boolean
  isVisible: boolean
}) {
  const h = Math.round(image.w * 1.35)

  return (
    <motion.div
      className="absolute rounded-2xl overflow-hidden pointer-events-none"
      style={{
        width: image.w, height: h,
        left: '50%', top: '50%',
        marginLeft: -image.w / 2,
        marginTop: -h / 2,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.3 }}
      animate={
        isCollapsing
          ? { x: 0, y: 0, rotate: 0, scale: 0, opacity: 0,
              transition: { duration: 0.5, ease: [0.4, 0, 1, 1], delay: index * 0.03 } }
          : isVisible
          ? { x: image.initialX, y: image.initialY, rotate: image.initialRot, opacity: 1, scale: 1,
              transition: {
                x: { duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                rotate: { duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.5, delay: index * 0.08 },
                scale: { duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
              } }
          : {}
      }
    >
      <motion.div
        className="w-full h-full"
        animate={isVisible && !isCollapsing ? { y: [0, -8, 4, -6, 0] } : { y: 0 }}
        transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 + 1.2 }}
      >
        <img src={image.url} alt={image.label} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/15" />
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{image.label}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function HeroSection({ onSubmit }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('')
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setCardsVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  function handleSubmit() {
    if (!prompt.trim()) return
    setIsCollapsing(true)
    setTimeout(() => onSubmit(prompt), 650)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
      style={{ background: '#080808' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 65% at 50% 50%, transparent 0%, rgba(8,8,8,0.75) 60%, rgba(8,8,8,0.97) 100%)',
          zIndex: 2,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        {FLOATING_IMAGES.map((img, i) => (
          <FloatingCard key={img.label} image={img} index={i} isCollapsing={isCollapsing} isVisible={cardsVisible} />
        ))}
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-8 px-6 text-center w-full"
        style={{ zIndex: 3 }}
        animate={isCollapsing
          ? { opacity: 0, scale: 0.95, transition: { duration: 0.35, delay: 0.25 } }
          : { opacity: 1, scale: 1 }
        }
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 0 60px rgba(201,168,76,0.1)',
            }}
          >
            <span className="text-2xl">✈</span>
          </div>
          <h1
            className="text-serif font-normal tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#F0EDE6', lineHeight: 1 }}
          >
            vambora<span style={{ color: '#C9A84C' }}>.ai</span>
          </h1>
          <div className="flex items-center gap-2 text-base" style={{ color: 'rgba(240,237,230,0.45)' }}>
            <span>Guia inteligente para suas</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ color: '#C9A84C', display: 'inline-block' }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Input maior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          <div
            className="rounded-2xl transition-all duration-200"
            style={{
              background: 'rgba(18,18,18,0.92)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Descreva sua viagem dos sonhos...\nEx: Floripa em maio, 4 dias, casal, R$2.000`}
              rows={4}
              className="w-full bg-transparent resize-none outline-none leading-relaxed px-7 pt-6 pb-4"
              style={{
                color: '#F0EDE6',
                fontSize: '1rem',
                caretColor: '#C9A84C',
              }}
            />

            {/* Exemplos rápidos */}
            <div className="px-6 pb-3 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map(ex => (
                <button
                  key={ex}
                  onClick={() => { setPrompt(ex); textareaRef.current?.focus() }}
                  className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(240,237,230,0.45)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
                    e.currentTarget.style.color = '#C9A84C'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = 'rgba(240,237,230,0.45)'
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between px-6 pb-5 pt-2">
              <span style={{ fontSize: '0.72rem', color: 'rgba(240,237,230,0.2)' }}>
                Enter para gerar · Shift+Enter nova linha
              </span>
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="btn-primary text-sm px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Vambora →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-2 mt-2"
        >
          <span style={{ fontSize: '0.65rem', color: 'rgba(240,237,230,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            role para explorar
          </span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'rgba(240,237,230,0.2)', fontSize: '0.75rem' }}
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  )
}