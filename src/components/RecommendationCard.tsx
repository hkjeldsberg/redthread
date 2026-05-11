'use client'

import { AnimatePresence, motion } from 'motion/react'

interface Props {
  tittel: string
  kategori: string
  badge?: { tekst: string; farge?: string }
  beskrivelse: string
  liste: string[]
  variant?: 'bullets' | 'chips'
  detaljer?: string
}

export default function RecommendationCard({ tittel, kategori, badge, beskrivelse, liste, variant = 'bullets', detaljer }: Props) {
  return (
    <article className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 sm:p-6 transition-colors hover:bg-surface-bright">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase">
          {kategori}
        </span>
        {badge && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.farge ?? 'bg-surface-container-high text-on-surface-variant'}`}>
            {badge.tekst}
          </span>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-on-surface mb-2 tracking-tight">{tittel}</h3>
      <p className="text-base text-on-surface-variant mb-4 leading-relaxed">{beskrivelse}</p>

      {variant === 'chips' ? (
        <div className="flex flex-wrap gap-2">
          {liste.map((item, i) => (
            <span key={i} className="bg-surface px-3 py-1 rounded-lg text-xs border border-outline-variant/20">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {liste.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm sm:text-base text-on-surface">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence initial={false}>
        {detaljer && (
          <motion.div
            key="hvorfor"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-4 border-t border-outline-variant/20">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Hvorfor</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">{detaljer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
