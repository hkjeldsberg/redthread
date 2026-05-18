'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { draglandFocus, getPhase, phaseDetails, phaseInfo, recommendations } from '@/lib/cycle'
import { useApp } from './AppShell'
import CycleWheel from './CycleWheel'
import { createClient } from '@/lib/supabase/client'

const DAGER = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø']
const MÅNEDER = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

function getCycleDayForDate(date: Date, startDate: string, cycleLength: number): number {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const diff = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return ((diff % cycleLength) + cycleLength) % cycleLength + 1
}

function CalendarMonth({
  year, month, startDate, cycleLength, periodLength, previewDay, onDayClick,
}: {
  year: number
  month: number
  startDate: string
  cycleLength: number
  periodLength: number
  previewDay: number
  onDayClick: (day: number) => void
}) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const today = new Date()

  return (
    <div>
      <h4 className="text-base font-semibold text-on-surface mb-3">
        {MÅNEDER[month]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-1 text-center text-base font-medium text-on-surface-variant/40 mb-1">
        {DAGER.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} className="aspect-1:3" />
          const date = new Date(year, month, day)
          const cycleDay = getCycleDayForDate(date, startDate, cycleLength)
          const isPeriod = cycleDay <= periodLength
          const isPeriodStart = cycleDay === 1
          const isToday = date.toDateString() === today.toDateString()
          const isSelected = !isToday && cycleDay === previewDay

          const base = 'aspect-1:3 text-base flex items-center justify-center transition-all relative'
          const periodCls = isPeriod
            ? isPeriodStart
              ? 'bg-primary text-on-primary font-bold rounded-full shadow'
              : 'bg-primary/15 text-primary font-semibold rounded-full'
            : 'text-on-surface hover:bg-surface-container rounded'
          const todayCls = isToday && !isPeriod ? 'border-2 border-on-surface rounded-full font-bold' : ''
          const selCls = isSelected ? 'ring-2 ring-on-surface ring-offset-1 ring-offset-surface-container-low' : ''

          return (
            <button
              key={day}
              onClick={() => onDayClick(cycleDay)}
              title={`Dag ${cycleDay}`}
              className={[base, periodCls, todayCls, selCls].join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SymptomInline({
  cycleId,
  cycleDay,
  onOpenSheet,
}: {
  cycleId: string
  cycleDay: number
  onOpenSheet: () => void
}) {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .schema('mens')
          .from('symptom_logs')
          .select('symptom')
          .eq('cycle_id', cycleId)
          .eq('cycle_day', cycleDay)
        if (!cancelled) {
          setSymptoms((data ?? []).map((l: { symptom: string }) => l.symptom))
        }
      } catch {
        // table may not exist yet
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [cycleId, cycleDay])

  if (loading) {
    return <p className="text-base text-on-surface-variant/50 italic">Laster...</p>
  }

  if (symptoms.length === 0) {
    return (
      <p
        className="text-base text-on-surface-variant/50 italic cursor-pointer hover:text-on-surface-variant transition-colors"
        onClick={onOpenSheet}
      >
        Ingen symptomer logget
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {symptoms.map(s => (
        <span
          key={s}
          className="px-3 py-1 rounded-full text-base font-medium bg-primary-container text-primary"
        >
          {s}
        </span>
      ))}
    </div>
  )
}

interface Props {
  cycleId: string
  startDate: string
  cycleLength: number
  periodLength: number
  actualDay: number
  learnedFromCycles: number
  profileCycleLength: number
}

export default function DashboardClient({ cycleId, startDate, cycleLength, periodLength, actualDay, learnedFromCycles, profileCycleLength }: Props) {
  const clampedActual = Math.min(actualDay, cycleLength)
  const { detaljer, previewDay, setPreviewDay, setSlider, setSheetOpen } = useApp()

  useEffect(() => {
    setPreviewDay(clampedActual)
    setSlider({ cycleId, startDate, cycleLength, periodLength, actualDay })
    return () => setSlider(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, cycleLength, periodLength, actualDay])

  const fase = getPhase(previewDay, periodLength, cycleLength)
  const info = phaseInfo[fase]
  const rec = recommendations[fase]
  const details = phaseDetails[fase]
  const dragland = draglandFocus[fase]
  const isToday = previewDay === clampedActual

  const today = new Date()
  const currentMonth = { year: today.getFullYear(), month: today.getMonth() }

  const articles = [
    {
      kategori: 'Trening',
      tittel: rec.trening.tittel,
      badge: rec.trening.intensitet,
      beskrivelse: rec.trening.beskrivelse,
      detaljer: rec.trening.detaljer,
    },
    {
      kategori: 'Mat',
      tittel: rec.mat.tittel,
      badge: rec.mat.fokus.split(',')[0],
      beskrivelse: rec.mat.beskrivelse,
      detaljer: rec.mat.detaljer,
    },
    {
      kategori: 'Faste',
      tittel: rec.faste.tittel,
      badge: rec.faste.vindu,
      beskrivelse: rec.faste.beskrivelse,
      detaljer: rec.faste.detaljer,
    },
  ]

  // First sentence of dragland.råd
  const draglandFirstSentence = dragland.råd.split('.')[0] + '.'

  return (
    <div className="flex mt-4 flex-col lg:flex-row gap-0 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/20 min-h-[600px]">

      {/* LEFT PANEL */}
      <section className="relative flex flex-col gap-4 p-6 sm:p-8 lg:p-8 lg:w-[52%] border-b lg:border-b-0 lg:border-r border-outline-variant/20">

        {/* Rotated stamp badge */}
        <div className="absolute top-6 right-6 w-16 h-16 border border-dashed border-primary rounded-full flex flex-col items-center justify-center text-primary rotate-[-8deg] text-[8px] uppercase tracking-widest select-none pointer-events-none">
          <span>DAG</span>
          <span className="font-caveat text-2xl font-semibold leading-none">{previewDay}</span>
          <span>av {cycleLength}</span>
        </div>

        {/* Phase title */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant/70 mb-1">
            {isToday ? 'I dag' : `Dag ${previewDay}`}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-semibold text-primary leading-none mb-2"
            style={{ fontFamily: 'var(--font-caveat), cursive' }}
          >
            {info.label}
          </h1>
          <p className="text-base text-on-surface-variant italic leading-relaxed max-w-sm">
            {info.description}
          </p>
        </div>

        {/* Cycle wheel */}
        <CycleWheel
          cycleLength={cycleLength}
          periodLength={periodLength}
          previewDay={previewDay}
          onDayClick={setPreviewDay}
        />

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-on-surface-variant uppercase tracking-wider -mt-2">
          <span className="flex items-center gap-1.5">
            <i className="w-2 h-2 rounded-full bg-primary-container not-italic inline-block" />
            Mens
          </span>
          <span className="flex items-center gap-1.5">
            <i className="w-2 h-2 rounded-full inline-block not-italic" style={{ background: '#f6e6d8' }} />
            Follikulær
          </span>
          <span className="flex items-center gap-1.5">
            <i className="w-2 h-2 rounded-full inline-block not-italic" style={{ background: '#8a6db0' }} />
            Eggløsning
          </span>
          <span className="flex items-center gap-1.5">
            <i className="w-2 h-2 rounded-full inline-block not-italic" style={{ background: '#fde8e0' }} />
            Luteal
          </span>
        </div>

        {/* Compact current-month calendar */}
        <div className="bg-surface-container-lowest/60 rounded-xl p-4 mt-2">
          <CalendarMonth
            year={currentMonth.year}
            month={currentMonth.month}
            startDate={startDate}
            cycleLength={cycleLength}
            periodLength={periodLength}
            previewDay={previewDay}
            onDayClick={setPreviewDay}
          />
          <div className="mt-4 pt-3 border-t border-outline-variant/20 space-y-1.5">
            <div className="flex items-center gap-2 text-base text-on-surface-variant">
              <span className="w-3 h-3 bg-primary rounded-full shrink-0" />
              <span>Forventet periodestart</span>
            </div>
            <div className="flex items-center gap-2 text-base text-on-surface-variant">
              <span className="w-3 h-3 bg-primary/15 rounded-full shrink-0" />
              <span>Menstruasjon</span>
            </div>
            <p className="text-base text-on-surface-variant/60 pt-1">
              {learnedFromCycles >= 2 ? (
                <>Forutsagt syklus: <span className="font-semibold text-on-surface">{cycleLength} dager</span> (snitt av {learnedFromCycles} sykluser).</>
              ) : (
                <>Forutsagt syklus: <span className="font-semibold text-on-surface">{profileCycleLength} dager</span> (fra profil).</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex flex-col gap-0 p-6 sm:p-8 lg:p-8 lg:flex-1 overflow-y-auto">

        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant/70 mb-4">
          Dagens anbefalinger
        </p>

        {/* Article rows */}
        {articles.map(article => (
          <article key={article.kategori} className="py-4 border-b border-dashed border-outline-variant/50 last:border-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant/70">
                {article.kategori}
              </span>
              <div className="flex-1 h-px bg-outline-variant/40" />
              <span className="text-[10px] text-primary uppercase tracking-wider">{article.badge}</span>
            </div>
            <h3
              className="text-2xl font-semibold text-on-surface leading-tight mb-1"
              style={{ fontFamily: 'var(--font-caveat), cursive' }}
            >
              {article.tittel}
            </h3>
            <p className="text-base text-on-surface-variant leading-relaxed">{article.beskrivelse}</p>

            {/* Expandable detaljer section */}
            <AnimatePresence initial={false}>
              {detaljer && (
                <motion.div
                  key={`detaljer-${article.kategori}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-outline-variant/20">
                    <p className="text-base font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Hvorfor</p>
                    <p className="text-base text-on-surface-variant leading-relaxed">{article.detaljer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        ))}

        {/* Helhetlig fokus card */}
        <div className="mt-4 p-4 rounded-xl bg-primary-container/40 border border-primary/10">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Helhetlig fokus
            </span>
            <span className="text-[10px] text-on-surface-variant">{dragland.pilar}</span>
          </div>
          <p
            className="text-xl text-on-surface leading-snug"
            style={{ fontFamily: 'var(--font-caveat), cursive' }}
          >
            {draglandFirstSentence}
          </p>

          {/* Expandable full råd */}
          <AnimatePresence initial={false}>
            {detaljer && (
              <motion.div
                key="dragland-detaljer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="text-base text-on-surface-variant leading-relaxed mt-2">{dragland.råd}</p>
                <p className="text-base text-on-surface-variant/60 mt-2">
                  Basert på Annette Draglands rammeverk i <em>Hele deg</em>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Symptoms section */}
        <div className="mt-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant/70 whitespace-nowrap">
              Symptomer · Dag {previewDay}
            </span>
            <div className="flex-1 h-px bg-outline-variant/40" />
            <button
              onClick={() => setSheetOpen(true)}
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary whitespace-nowrap hover:text-primary/70 transition-colors"
            >
              + Legg til
            </button>
          </div>
          <SymptomInline
            cycleId={cycleId}
            cycleDay={previewDay}
            onOpenSheet={() => setSheetOpen(true)}
          />
        </div>
      </section>
    </div>
  )
}
