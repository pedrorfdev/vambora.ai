// ─────────────────────────────────────────────
// LoadingScreen.tsx — Loading com rota animada
//
// Mostra uma linha pontilhada de Pin A até Pin B
// com um avião percorrendo o caminho enquanto
// a IA processa. Micro-textos rotativos embaixo.
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface LoadingScreenProps {
  message: string
}

// SVG do pin de mapa
function MapPin({ color = 'var(--color-yellow)', size = 28, pulsing = false }: {
  color?: string
  size?: number
  pulsing?: boolean
}) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size + 8 }}>
      {pulsing && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 1.8,
            height: size * 1.8,
            background: color,
            opacity: 0.15,
            top: '50%',
            left: '50%',
            marginLeft: -(size * 1.8) / 2,
            marginTop: -(size * 1.8) / 2,
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <svg width={size} height={size + 8} viewBox="0 0 24 30" fill="none">
        <path
          d="M12 0C7.58 0 4 3.58 4 8C4 14 12 24 12 24C12 24 20 14 20 8C20 3.58 16.42 0 12 0Z"
          fill={color}
        />
        <circle cx="12" cy="8" r="3.5" fill="rgba(15,14,13,0.6)" />
      </svg>
    </div>
  )
}

// Bonequinho caminhando (SVG path customizado)
function WalkIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--color-yellow)">
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
    </svg>
  )
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  // Progresso falso — avança devagar pra dar sensação de trabalho
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 92) return p  // Para em 92% — completa quando o guia chegar
        const step = p < 40 ? 1.8 : p < 70 ? 1.2 : 0.5
        return Math.min(p + step, 92)
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // Largura da trilha em px (usada pros cálculos de posição)
  const TRACK_W = 320
  const planeX = (progress / 100) * TRACK_W

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-dvh flex flex-col items-center justify-center gap-12 px-6"
      style={{ background: 'var(--color-bg-base)' }}
    >

      {/* ── Mapa de rota ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-8"
      >
        {/* Trilha com pins e avião */}
        <div
          className="relative flex items-center"
          style={{ width: TRACK_W, height: 80 }}
        >
          {/* Pin A — origem */}
          <div className="absolute left-0 flex flex-col items-center gap-1" style={{ top: '50%', transform: 'translateY(-60%)' }}>
            <MapPin color="var(--color-fg-muted)" size={24} />
            <span style={{ fontSize: '0.6rem', color: 'var(--color-fg-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              origem
            </span>
          </div>

          {/* Linha pontilhada da trilha */}
          <div
            className="absolute"
            style={{
              left: 20,
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              height: 2,
              background: 'var(--color-bg-border)',
              borderRadius: 2,
            }}
          >
            {/* Progresso preenchido */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, var(--color-yellow-dim), var(--color-yellow))',
                width: `${progress}%`,
                transition: 'width 0.2s linear',
              }}
            />

            {/* Pontilhado decorativo no fundo */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(to right, transparent 0px, transparent 6px, var(--color-bg-soft) 6px, var(--color-bg-soft) 8px)',
                opacity: 0.4,
              }}
            />
          </div>

          {/* Avião animado */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{
              left: 12 + (planeX * (TRACK_W - 40) / TRACK_W),
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'left 0.2s linear',
              filter: 'drop-shadow(0 0 6px rgba(232,184,75,0.5))',
            }}
          >
            {/* Glow no avião */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 32, height: 32, background: 'var(--color-yellow-glow)', filter: 'blur(8px)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <WalkIcon size={20} />
          </motion.div>

          {/* Pin B — destino */}
          <div className="absolute right-0 flex flex-col items-center gap-1" style={{ top: '50%', transform: 'translateY(-60%)' }}>
            <MapPin color="var(--color-yellow)" size={24} pulsing={progress > 80} />
            <span style={{ fontSize: '0.6rem', color: 'var(--color-yellow)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              destino
            </span>
          </div>
        </div>

        {/* Barra de progresso slim */}
        <div
          className="rounded-full overflow-hidden"
          style={{ width: TRACK_W, height: 2, background: 'var(--color-bg-border)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--color-yellow-dim), var(--color-yellow-soft))',
              width: `${progress}%`,
              transition: 'width 0.2s linear',
            }}
          />
        </div>
      </motion.div>

      {/* ── Textos ── */}
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--color-fg-primary)',
              fontFamily: 'var(--font-sans)',
              textAlign: 'center',
            }}
          >
            {message}
          </motion.p>
        </AnimatePresence>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', textAlign: 'center' }}>
          Montando seu roteiro personalizado...
        </p>

        {/* Dots de loading */}
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 4, height: 4, background: 'var(--color-yellow)' }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>

    </motion.div>
  )
}