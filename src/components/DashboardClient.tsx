'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { draglandFocus, getPhase, phaseDetails, phaseInfo, recommendations } from '@/lib/cycle'
import RecommendationCard from './RecommendationCard'
import { useApp } from './AppShell'

const DAGER = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø']
const MÅNEDER = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

const fasteBadge: Record<string, { tekst: string; farge: string }> = {
  anbefalt: { tekst: 'Anbefalt', farge: 'bg-primary/10 text-primary' },
  forsiktig: { tekst: 'Vær forsiktig', farge: 'bg-amber-100 text-amber-800' },
  unngå: { tekst: 'Unngå', farge: 'bg-error-container text-on-error-container' },
}

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
  const startOffset = (firstDay.getDay() + 6) % 7 // Mon=0

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const today = new Date()

  return (
    <div>
      <h4 className="text-sm font-semibold text-on-surface mb-3">
        {MÅNEDER[month]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-on-surface-variant/40 mb-1">
        {DAGER.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} className="aspect-square" />
          const date = new Date(year, month, day)
          const cycleDay = getCycleDayForDate(date, startDate, cycleLength)
          const isPeriod = cycleDay <= periodLength
          const isPeriodStart = cycleDay === 1
          const isToday = date.toDateString() === today.toDateString()
          const isSelected = !isToday && cycleDay === previewDay

          const base = 'aspect-square text-xs flex items-center justify-center transition-all relative'
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
  const { detaljer, previewDay, setPreviewDay, setSlider } = useApp()

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

  const today = new Date()
  const months = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
      {/* Feed (left) */}
      <div className="flex-1 min-w-0 w-full space-y-8 sm:space-y-12">
        {/* Phase + progress card */}
        <section className="bg-surface-container-low rounded-xl p-5 sm:p-6 border border-outline-variant/10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/70">
              Dag {previewDay} av {cycleLength}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-3 tracking-tight">{info.label}</h2>
          <p className="text-base text-on-surface-variant leading-relaxed mb-4">{info.description}</p>

          <AnimatePresence initial={false}>
            {detaljer && (
              <motion.div
                key="phase-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mb-6 grid sm:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Hormoner</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{details.hormoner}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Fysiologi</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{details.fysiologi}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </section>

        {/* Dragland-pillar focus */}
        <aside className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              Helhetlig fokus
            </span>
            <span className="text-xs text-on-surface-variant">· {dragland.pilar}</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">{dragland.råd}</p>
          <p className="text-xs text-on-surface-variant/60 mt-3">
            Basert på Annette Draglands rammeverk i <em>Hele deg</em> (5 pilarer: søvn, mat, bevegelse, ro &amp; stress, relasjoner).
          </p>
        </aside>

        {/* Section divider */}
        <div className="flex items-center gap-4">
          <div className="red-thread-line flex-grow" />
          <span className="text-xs font-bold text-primary/60 tracking-widest uppercase whitespace-nowrap">
            Daglige Anbefalinger
          </span>
          <div className="red-thread-line w-12" />
        </div>

        <div className="space-y-6">
          <RecommendationCard
            kategori="Trening"
            tittel={rec.trening.tittel}
            badge={{ tekst: rec.trening.intensitet }}
            beskrivelse={rec.trening.beskrivelse}
            liste={rec.trening.øvelser}
            variant="bullets"
            detaljer={detaljer ? rec.trening.detaljer : undefined}
          />
          <RecommendationCard
            kategori="Mat"
            tittel={rec.mat.tittel}
            badge={{ tekst: rec.mat.fokus.split(',')[0] }}
            beskrivelse={rec.mat.beskrivelse}
            liste={rec.mat.matvarer}
            variant="chips"
            detaljer={detaljer ? rec.mat.detaljer : undefined}
          />
          <RecommendationCard
            kategori="Faste"
            tittel={rec.faste.tittel}
            badge={fasteBadge[rec.faste.anbefaling]}
            beskrivelse={rec.faste.beskrivelse}
            liste={[rec.faste.vindu]}
            variant="chips"
            detaljer={detaljer ? rec.faste.detaljer : undefined}
          />
        </div>
      </div>

      {/* Calendar sidebar (right) */}
      <aside className="lg:w-80 w-full shrink-0">
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-5 sm:p-6 lg:sticky lg:top-32">
          <h3 className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase mb-5">
            Forutsagte Perioder
          </h3>
          <div className="space-y-6">
            {months.map(({ year, month }) => (
              <CalendarMonth
                key={`${year}-${month}`}
                year={year}
                month={month}
                startDate={startDate}
                cycleLength={cycleLength}
                periodLength={periodLength}
                previewDay={previewDay}
                onDayClick={setPreviewDay}
              />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <span>Forventet periode­start</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="w-3 h-3 bg-primary/15 rounded-full" />
              <span>Menstruasjon</span>
            </div>
            <p className="text-xs text-on-surface-variant/60 pt-2">
              {learnedFromCycles >= 2 ? (
                <>Forutsagt syklus: <span className="font-semibold text-on-surface">{cycleLength} dager</span> (snitt av {learnedFromCycles} loggede sykluser).</>
              ) : (
                <>Forutsagt syklus: <span className="font-semibold text-on-surface">{profileCycleLength} dager</span> (fra profil — logg flere sykluser for læring).</>
              )}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
