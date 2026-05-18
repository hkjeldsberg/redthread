'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

const PREDEFINED = [
  'Kramper', 'Oppblåsthet', 'Hodepine', 'Trøtthet',
  'Humørsvingninger', 'Lavt energi', 'Høyt energi',
  'Søvnproblemer', 'Brystømhet', 'Kvalme', 'Ryggsmerter', 'Godt humør',
]

interface Props {
  open: boolean
  onClose: () => void
  cycleId: string
  cycleDay: number
}

export default function SymptomSheet({ open, onClose, cycleId, cycleDay }: Props) {
  const [active, setActive] = useState<Set<string>>(new Set())
  const [customPool, setCustomPool] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [loadingActive, setLoadingActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    load()
  }, [open, cycleId, cycleDay])

  async function load() {
    setLoadingActive(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: dayLogs }, { data: allLogs }] = await Promise.all([
        supabase.schema('mens').from('symptom_logs')
          .select('symptom')
          .eq('cycle_id', cycleId)
          .eq('cycle_day', cycleDay),
        supabase.schema('mens').from('symptom_logs')
          .select('symptom')
          .eq('user_id', user.id),
      ])

      setActive(new Set((dayLogs ?? []).map((l: { symptom: string }) => l.symptom)))

      const allNames = [...new Set((allLogs ?? []).map((l: { symptom: string }) => l.symptom as string))]
      setCustomPool(allNames.filter(n => !PREDEFINED.includes(n)))
    } catch {
      // Table may not exist yet — chips show without active state
    } finally {
      setLoadingActive(false)
    }
  }

  async function toggle(symptom: string) {
    // Optimistic update first
    const wasActive = active.has(symptom)
    if (wasActive) {
      setActive(prev => { const s = new Set(prev); s.delete(symptom); return s })
    } else {
      setActive(prev => new Set([...prev, symptom]))
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (wasActive) {
        await supabase.schema('mens').from('symptom_logs')
          .delete()
          .eq('cycle_id', cycleId)
          .eq('cycle_day', cycleDay)
          .eq('symptom', symptom)
      } else {
        await supabase.schema('mens').from('symptom_logs').insert({
          user_id: user.id,
          cycle_id: cycleId,
          cycle_day: cycleDay,
          symptom,
        })
      }
    } catch {
      // Revert optimistic update on failure
      if (wasActive) {
        setActive(prev => new Set([...prev, symptom]))
      } else {
        setActive(prev => { const s = new Set(prev); s.delete(symptom); return s })
      }
    }
  }

  async function addCustom() {
    const name = input.trim()
    if (!name) return
    setInput('')
    if (!PREDEFINED.includes(name) && !customPool.includes(name)) {
      setCustomPool(prev => [...prev, name])
    }
    await toggle(name)
    inputRef.current?.focus()
  }

  const allChips = [...PREDEFINED, ...customPool]

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-xl max-h-[80vh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-outline-variant rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 pt-2 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-semibold text-on-surface">Symptomer</h3>
                <p className="text-base text-on-surface-variant/60">Dag {cycleDay}</p>
              </div>
              <button
                onClick={onClose}
                className="text-on-surface-variant/60 hover:text-on-surface p-1 transition-colors"
                aria-label="Lukk"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-8 pt-1">
              <div className={`flex flex-wrap gap-2 transition-opacity ${loadingActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {allChips.map(chip => {
                  const isActive = active.has(chip)
                  const isCustom = !PREDEFINED.includes(chip)
                  return (
                    <button
                      key={chip}
                      onClick={() => toggle(chip)}
                      className={`px-3 py-1.5 rounded-full text-base font-medium transition-all border ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary shadow-sm'
                          : 'bg-transparent text-on-surface border-outline-variant hover:border-primary/60'
                      } ${isCustom ? 'border-dashed' : ''}`}
                    >
                      {chip}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-outline-variant/20">
                <p className="text-base font-semibold uppercase tracking-widest text-on-surface-variant/60 mb-3">
                  Legg til eget symptom
                </p>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                    placeholder="F.eks. tørr hud…"
                    className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
                  />
                  <button
                    onClick={addCustom}
                    disabled={!input.trim()}
                    className="bg-primary text-on-primary text-base font-medium px-4 py-2 rounded-lg disabled:opacity-40 transition-opacity"
                  >
                    Legg til
                  </button>
                </div>
                {customPool.length > 0 && (
                  <p className="text-base text-on-surface-variant/50 mt-2">
                    Egne symptomer vises med stiplet kant.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
