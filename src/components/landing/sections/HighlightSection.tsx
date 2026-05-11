// ─────────────────────────────────────────────
// HighlightSection.tsx — Card grande com brilho
// ─────────────────────────────────────────────

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

function Particle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left: x, top: y, background: 'var(--color-yellow)' }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: [0, -20, -40] }}
      transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  )
}

const PARTICLES = [
  { x: '10%', y: '80%', delay: 0 },
  { x: '25%', y: '90%', delay: 0.4 },
  { x: '60%', y: '85%', delay: 0.8 },
  { x: '80%', y: '75%', delay: 0.2 },
  { x: '45%', y: '92%', delay: 1.1 },
  { x: '70%', y: '88%', delay: 0.6 },
]

const FEATURES = [
  { icon: '🔍', title: 'Busca em tempo real', desc: 'Eventos, preços e novidades atualizados agora.' },
  { icon: '🗺', title: 'Roteiro dia a dia', desc: 'Manhã, tarde e noite — sem você precisar pensar.' },
  { icon: '💰', title: 'Orçamento honesto', desc: 'Estimativas reais, não aquelas que te decepcionam na viagem.' },
]

export function HighlightSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-28" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Card visual */}
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, var(--color-yellow-glow) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                height: 420,
                border: '1px solid var(--color-yellow-border)',
                boxShadow: 'var(--shadow-yellow)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=700&q=85"
                alt="Florianópolis"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
              />
              {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

              {/* Brilho rotativo */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(201,168,76,0.15) 20%, transparent 40%)',
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="badge-yellow text-xs mb-3 inline-block">✦ destino em destaque</span>
                <h3 className="text-serif text-2xl font-normal" style={{ color: '#F0EDE6' }}>
                  Florianópolis, SC
                </h3>
                <p className="text-sm mt-1" style={{ color: 'rgba(240,237,230,0.6)' }}>
                  42 praias · Lagoa da Conceição · gastronomia açoriana
                </p>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-10"
          >
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest mb-4 block"
                style={{ color: 'var(--color-yellow)' }}
              >
                inteligência de verdade
              </span>
              <h2
                className="text-serif font-normal"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#F0EDE6', lineHeight: 1.25 }}
              >
                Não é um gerador de texto. É um guia que pesquisa pra você.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(240,237,230,0.5)' }}>
                Enquanto você toma aquele café, a IA tá consultando eventos reais,
                verificando a época do ano e montando um roteiro que faz sentido.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4 items-start"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F0EDE6' }}>{f.title}</p>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(240,237,230,0.5)' }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}