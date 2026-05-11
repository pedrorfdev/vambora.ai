// ─────────────────────────────────────────────
// ManifestoSection.tsx — Copy de tela cheia
//
// Fundo quase preto, texto elegante centralizado,
// elementos sutis flutuando. Cada linha de texto
// entra escalonada conforme entra na viewport.
// ─────────────────────────────────────────────

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const LINES = [
  { text: 'O Brasil é grande demais',  serif: true,  size: 'clamp(2.2rem, 5vw, 4rem)' },
  { text: 'pra ficar parado.',          serif: true,  size: 'clamp(2.2rem, 5vw, 4rem)' },
  { text: '',                           serif: false, size: '1rem' }, // espaço
  { text: 'São 8,5 milhões de km² de praias, trilhas,',  serif: false, size: 'clamp(1rem, 2vw, 1.2rem)' },
  { text: 'sabores, festas e histórias esperando por você.',  serif: false, size: 'clamp(1rem, 2vw, 1.2rem)' },
  { text: '',                           serif: false, size: '1rem' },
  { text: 'Você só precisa dizer: vambora.',  serif: true, size: 'clamp(1.4rem, 3vw, 2rem)' },
]

// Elementos decorativos flutuando ao fundo
function BackgroundOrb({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, var(--color-yellow-glow) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export function ManifestoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="relative min-h-dvh flex items-center justify-center overflow-hidden py-32"
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Orbs decorativos */}
      <BackgroundOrb x="10%" y="20%" size={300} delay={0} />
      <BackgroundOrb x="70%" y="60%" size={250} delay={1.5} />
      <BackgroundOrb x="40%" y="80%" size={200} delay={0.8} />

      {/* Linha decorativa horizontal */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-yellow-border), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-yellow-border), transparent)' }}
      />

      <div ref={ref} className="relative max-w-4xl mx-auto px-8 text-center">
        {LINES.map((line, i) => {
          if (!line.text) return <div key={i} className="h-6" />
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={line.serif ? 'text-serif' : ''}
              style={{
                fontSize: line.size,
                color: line.serif ? 'var(--color-fg-primary)' : 'var(--color-fg-secondary)',
                lineHeight: 1.3,
                fontWeight: line.serif ? 400 : 300,
              }}
            >
              {/* Destaca "vambora" em amarelo */}
              {line.text.includes('vambora') ? (
                <>
                  {line.text.split('vambora')[0]}
                  <span style={{ color: 'var(--color-yellow)' }}>vambora</span>
                  {line.text.split('vambora')[1]}
                </>
              ) : line.text}
            </motion.p>
          )
        })}

        {/* CTA sutil */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: LINES.length * 0.12 + 0.2 }}
          className="mt-16"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-outline"
          >
            Começar agora →
          </button>
        </motion.div>
      </div>
    </section>
  )
}