// ─────────────────────────────────────────────
// ManifestoSection.tsx — Prova de valor
//
// Copy emocional + 3 stats + CTA scroll pro topo
// ─────────────────────────────────────────────

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const STATS = [
  { value: '27', label: 'estados mapeados', suffix: '' },
  { value: '30', label: 'segundos pra um roteiro', suffix: 's' },
  { value: 'I.A.', label: 'curadoria premium', suffix: '' },
]

const LINES = [
  { text: 'O Brasil é grande demais', isMain: true },
  { text: 'pra ficar parado.', isMain: true },
  { text: 'São 8,5 milhões de km² de praias, trilhas, sabores,', isMain: false },
  { text: 'festas e histórias esperando por você.', isMain: false },
]

function BackgroundOrb({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: 'radial-gradient(circle, var(--color-yellow-glow) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }}
      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
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
      {/* Linha topo */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-yellow-border), transparent)' }}
      />

      <BackgroundOrb x="5%" y="15%" size={320} delay={0} />
      <BackgroundOrb x="65%" y="55%" size={280} delay={1.5} />
      <BackgroundOrb x="35%" y="75%" size={220} delay={0.8} />

      <div ref={ref} className="relative max-w-4xl mx-auto px-8 text-center">

        {/* Copy */}
        <div className="mb-16">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
              className=""
              style={{
                fontSize: line.isMain ? 'clamp(2.2rem, 5vw, 4rem)' : 'clamp(0.95rem, 2vw, 1.2rem)',
                color: line.isMain ? 'var(--color-fg-primary)' : 'var(--color-fg-secondary)',
                lineHeight: line.isMain ? 1.15 : 1.7,
                fontWeight: line.isMain ? 800 : 400,
                marginBottom: line.isMain ? '0.1em' : '0',
                letterSpacing: line.isMain ? '-0.02em' : '0',
              }}
            >
              {line.text.includes('vambora')
                ? <>
                  {line.text.split('vambora')[0]}
                  <span style={{ color: 'var(--color-yellow)' }}>vambora</span>
                  {line.text.split('vambora')[1]}
                </>
                : line.text
              }
            </motion.p>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl"
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-bg-border)',
              }}
            >
              <p
                className=""
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: 'var(--color-yellow)',
                  lineHeight: 1,
                  fontWeight: 800,
                }}
              >
                {stat.value}<span style={{ fontSize: '0.6em', opacity: 0.7 }}>{stat.suffix}</span>
              </p>
              <p
                className="text-xs text-center"
                style={{ color: 'var(--color-fg-muted)', lineHeight: 1.4 }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary"
          >
            Bora planejar! →
          </button>
        </motion.div>
      </div>

      {/* Linha bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-yellow-border), transparent)' }}
      />
    </section>
  )
}