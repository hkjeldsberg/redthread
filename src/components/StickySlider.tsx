'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getPhase, phaseInfo } from '@/lib/cycle'
import { useApp } from './AppShell'
import SymptomSheet from './SymptomSheet'

export default function StickySlider() {
  const { slider, previewDay, setPreviewDay } = useApp()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <AnimatePresence initial={false}>
        {slider && (
          <motion.div
            key="sticky-slider"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-outline-variant/20"
          >
            <Inner
              previewDay={previewDay}
              setPreviewDay={setPreviewDay}
              cycleLength={slider.cycleLength}
              periodLength={slider.periodLength}
              actualDay={slider.actualDay}
              onOpenSymptoms={() => setSheetOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {slider && (
        <SymptomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          cycleId={slider.cycleId}
          cycleDay={previewDay}
        />
      )}
    </>
  )
}

function Inner({
  previewDay,
  setPreviewDay,
  cycleLength,
  periodLength,
  actualDay,
  onOpenSymptoms,
}: {
  previewDay: number
  setPreviewDay: (d: number) => void
  cycleLength: number
  periodLength: number
  actualDay: number
  onOpenSymptoms: () => void
}) {
  const clampedActual = Math.min(actualDay, cycleLength)
  const fase = getPhase(previewDay, periodLength, cycleLength)
  const info = phaseInfo[fase]
  const progressPct = (previewDay / cycleLength) * 100
  const isToday = previewDay === clampedActual

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4">
      <div className="hidden sm:flex items-center gap-2 shrink-0 w-36">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        <span className={`text-sm font-semibold ${info.color} tracking-tight`}>{info.label}</span>
      </div>
      <span className="sm:hidden w-2 h-2 rounded-full bg-primary shrink-0" />

      <div className="flex-1 relative">
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full relative">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary/40 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
          <motion.div
            className="absolute top-1/2 w-5 h-5 bg-primary rounded-full border-2 border-surface shadow-md"
            animate={{ left: `calc(${progressPct}% - 10px)`, y: '-50%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={cycleLength}
          value={previewDay}
          onChange={e => setPreviewDay(Number(e.target.value))}
          aria-label="Velg dag i syklus"
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-10 -top-4 touch-none"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-semibold text-on-surface tabular-nums">
          <span className="hidden sm:inline">Dag </span>{previewDay}
        </span>
        <span className="text-xs text-on-surface-variant/60 tabular-nums">/ {cycleLength}</span>
        <button
          onClick={() => setPreviewDay(clampedActual)}
          aria-hidden={isToday}
          className={`ml-1 text-xs text-primary hover:text-primary-container underline underline-offset-2 transition-opacity duration-150 ${isToday ? 'invisible pointer-events-none' : 'visible'}`}
        >
          I dag
        </button>
      </div>

      {/* Symptom button */}
      <button
        onClick={onOpenSymptoms}
        aria-label="Logg symptomer for denne dagen"
        title="Logg symptomer"
        className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface border border-outline-variant/50 hover:border-outline-variant rounded-full px-2.5 py-1 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="hidden sm:inline">Symptom</span>
      </button>
    </div>
  )
}
