// ─────────────────────────────────────────────
// LoadingScreen.tsx — Loading do Vambora.ai
//
// Exibe os micro-textos rotativos enquanto a AI
// processa. A mensagem vem do useGuide e muda
// a cada 2.2s com animação de fade+slide.
// ─────────────────────────────────────────────

import { AnimatePresence, motion } from 'motion/react'

interface LoadingScreenProps {
  message: string
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-dvh flex flex-col items-center justify-center gap-10 px-4"
    >
      {/* Ícone animado */}
      <div className="relative flex items-center justify-center">
        {/* Anel externo pulsando */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-20 h-20 rounded-full border border-yellow-border"
        />
        {/* Anel médio girando */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute w-14 h-14 rounded-full border-t border-yellow border-r-transparent border-b-transparent border-l-transparent"
        />
        {/* Ícone central */}
        <div className="w-10 h-10 rounded-xl bg-yellow-glow border border-yellow-border flex items-center justify-center">
          <span className="text-yellow text-lg">✈</span>
        </div>
      </div>

      {/* Micro-texto rotativo */}
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="text-serif text-xl text-text-primary text-center"
          >
            {message}
          </motion.p>
        </AnimatePresence>

        <p className="text-sm text-text-muted text-center">
          Montando seu roteiro personalizado...
        </p>
      </div>

      {/* Barra de progresso indeterminada */}
      <div className="w-48 h-0.5 bg-bg-border rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/2 bg-linear-to-r from-transparent via-yellow to-transparent rounded-full"
        />
      </div>
    </motion.div>
  )
}