import { motion } from 'motion/react'
import type { Guide } from '../../types/guide'

interface GuideHeaderProps {
  guide: Guide
  onReset: () => void
}



export function GuideHeader({ guide, onReset }: GuideHeaderProps) {
  const { destino, periodo, clima, dica_golden } = guide

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onReset}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          ← Nova busca
        </button>
        <span className="text-xs text-text-muted badge-yellow">
          guia gerado
        </span>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-serif text-5xl font-normal text-text-primary tracking-tight">
            {destino.nome}
          </h1>
          <span className="text-2xl text-text-muted font-light">
            {destino.estado}
          </span>
        </div>
        <p className="mt-2 text-text-secondary text-base max-w-lg">
          {destino.descricao_curta}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="badge-blue text-xs">
          📅 {periodo.data_inicio} → {periodo.data_fim} · {periodo.total_dias} dias
        </div>
        <div className="badge-emerald text-xs">
          🌡 {clima.temperatura_media} · {clima.condicao}
        </div>
        <div className="badge-yellow text-xs">
          ✨ Melhor época: {clima.melhor_epoca}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {destino.destaques.map(d => (
          <span
            key={d}
            className="
              text-xs px-3 py-1 rounded-full
              bg-black-card border border-black-border
              text-text-secondary
            "
          >
            {d}
          </span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="
          relative p-4 rounded-xl overflow-hidden
          bg-yellow-glow
          border border-yellow-border
        "
      >
        {/* Linha decorativa lateral */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow rounded-full" />
        <div className="pl-4">
          <span className="text-xs font-semibold text-yellow uppercase tracking-widest">
            ✦ Dica golden
          </span>
          <p className="mt-1 text-sm text-text-primary leading-relaxed">
            {dica_golden}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}