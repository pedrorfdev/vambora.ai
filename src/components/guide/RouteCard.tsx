import { motion } from 'motion/react'
import { mapsLink } from '../../lib/deeplinks'
import type { RouteDay } from '../../types/guide'

interface RouteCardProps {
  day: RouteDay
  index: number
}

const PERIODO_CONFIG = {
  'manhã':  { icon: '🌅', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20' },
  'tarde':  { icon: '☀️', color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20' },
  'noite':  { icon: '🌙', color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  border: 'border-indigo-400/20' },
}

export function RouteCard({ day, index }: RouteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="card p-5"
    >
      {/* Header do dia */}
      <div className="flex items-center gap-3 mb-5">
        <div className="
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0
          bg-yellow-glow border border-yellow-border
        ">
          <span className="text-xs font-bold text-yellow">
            {day.dia}
          </span>
        </div>
        <h3 className="text-base font-medium text-text-primary">
          {day.titulo}
        </h3>
      </div>

      {/* Paradas */}
      <div className="flex flex-col gap-3">
        {day.paradas.map((parada, i) => {
          const config = PERIODO_CONFIG[parada.periodo]
          return (
            <a
              key={i}
              href={mapsLink(parada.maps_query)}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group flex gap-3 p-3 rounded-lg
                bg-black-soft border border-black-border
                hover:border-yellow-border hover:bg-yellow-glow
                transition-all duration-200 cursor-pointer no-underline
              "
            >
              {/* Badge do período */}
              <div className={`
                shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-xs font-medium h-fit
                ${config.bg} ${config.border} ${config.color} border
              `}>
                {config.icon} {parada.periodo}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary group-hover:text-yellow transition-colors">
                    {parada.local}
                  </p>
                  <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    ver no maps ↗
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {parada.descricao}
                </p>
                <p className="text-xs text-yellow mt-1.5 opacity-70">
                  💡 {parada.dica_local}
                </p>
              </div>
            </a>
          )
        })}
      </div>
    </motion.div>
  )
}