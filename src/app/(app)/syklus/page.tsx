'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Cycle } from '@/types'

function formaterDato(dato: string) {
  return new Date(dato).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
}

function varighetDager(start: string, slutt: string | null): string {
  if (!slutt) return 'pågår'
  const d = Math.round((new Date(slutt).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
  return `${d} dag${d !== 1 ? 'er' : ''}`
}

const iDagStr = () => new Date().toISOString().split('T')[0]

export default function SyklusPage() {
  const [sykluser, setSykluser] = useState<Cycle[]>([])
  const [laster, setLaster] = useState(true)
  const [lagrer, setLagrer] = useState(false)
  const [sletter, setSletter] = useState<string | null>(null)
  const [feil, setFeil] = useState<string | null>(null)

  // Form state for new/historical entry
  const [startDato, setStartDato] = useState(iDagStr())
  const [sluttDato, setSluttDato] = useState('')
  const [pågår, setPågår] = useState(true)

  // End-date for active cycle
  const [avsluttDato, setAvsluttDato] = useState(iDagStr())

  const åpenSyklus = sykluser.find(s => !s.end_date) ?? null

  useEffect(() => {
    hentSykluser()
  }, [])

  async function hentSykluser() {
    const supabase = createClient()
    const { data } = await supabase
      .schema('mens')
      .from('cycles')
      .select('*')
      .order('start_date', { ascending: false })
    setSykluser(data ?? [])
    setLaster(false)
  }

  async function registrerMenstruasjon() {
    setFeil(null)
    if (!pågår && sluttDato && sluttDato < startDato) {
      setFeil('Sluttdato kan ikke være før startdato.')
      return
    }
    setLagrer(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.schema('mens').from('cycles').insert({
      user_id: user.id,
      start_date: startDato,
      end_date: pågår ? null : (sluttDato || null),
    })

    if (error) { setFeil(error.message); setLagrer(false); return }
    await hentSykluser()
    setStartDato(iDagStr())
    setSluttDato('')
    setPågår(true)
    setLagrer(false)
  }

  async function avsluttMenstruasjon() {
    if (!åpenSyklus) return
    if (avsluttDato < åpenSyklus.start_date) {
      setFeil('Sluttdato kan ikke være før startdato.')
      return
    }
    setFeil(null)
    setLagrer(true)
    const supabase = createClient()

    const { error } = await supabase
      .schema('mens')
      .from('cycles')
      .update({ end_date: avsluttDato })
      .eq('id', åpenSyklus.id)

    if (error) { setFeil(error.message); setLagrer(false); return }
    await hentSykluser()
    setAvsluttDato(iDagStr())
    setLagrer(false)
  }

  async function slettSyklus(id: string) {
    setFeil(null)
    setSletter(id)
    const supabase = createClient()
    const { error } = await supabase.schema('mens').from('cycles').delete().eq('id', id)
    if (error) setFeil(error.message)
    else await hentSykluser()
    setSletter(null)
  }

  return (
    <div className="space-y-12">
      {/* Active cycle */}
      {åpenSyklus && (
        <section className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-base font-bold uppercase tracking-widest text-primary">Menstruasjon pågår</p>
          </div>
          <p className="text-base text-on-surface-variant mb-6">
            Startet {formaterDato(åpenSyklus.start_date)}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-base font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">
                Når sluttet blødningen?
              </label>
              <input
                type="date"
                value={avsluttDato}
                min={åpenSyklus.start_date}
                max={iDagStr()}
                onChange={e => setAvsluttDato(e.target.value)}
                className="bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={avsluttMenstruasjon}
              disabled={lagrer}
              className="bg-on-surface text-surface text-base font-medium px-5 py-2.5 rounded hover:bg-inverse-surface disabled:opacity-50 transition-colors"
            >
              {lagrer ? 'Lagrer…' : 'Avslutt menstruasjon'}
            </button>
          </div>

          {feil && <p className="text-error text-base mt-3">{feil}</p>}
        </section>
      )}

      {/* Log new / historical */}
      <section className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-5 sm:p-6">
        <p className="text-base font-medium text-on-surface mb-5">
          {åpenSyklus ? 'Legg til tidligere menstruasjon' : 'Registrer menstruasjon'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">
              Startdato
            </label>
            <input
              type="date"
              value={startDato}
              max={iDagStr()}
              onChange={e => setStartDato(e.target.value)}
              className="bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={pågår}
              onClick={() => setPågår(p => !p)}
              className={`relative w-10 h-6 rounded-full transition-colors ${pågår ? 'bg-primary' : 'bg-outline-variant'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-surface shadow transition-transform ${pågår ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
            <span className="text-base text-on-surface-variant">Pågår fortsatt</span>
          </div>

          {!pågår && (
            <div>
              <label className="block text-base font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">
                Sluttdato
              </label>
              <input
                type="date"
                value={sluttDato}
                min={startDato}
                max={iDagStr()}
                onChange={e => setSluttDato(e.target.value)}
                className="bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
              />
            </div>
          )}

          <button
            onClick={registrerMenstruasjon}
            disabled={lagrer}
            className="bg-on-surface text-surface text-base font-medium px-5 py-2.5 rounded hover:bg-inverse-surface disabled:opacity-50 transition-colors"
          >
            {lagrer ? 'Lagrer…' : 'Registrer'}
          </button>
        </div>

        {!åpenSyklus && feil && <p className="text-error text-base mt-3">{feil}</p>}
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="red-thread-line flex-grow" />
        <span className="text-base font-bold text-primary/60 tracking-widest uppercase">Historikk</span>
        <div className="red-thread-line w-12" />
      </div>

      {/* History */}
      <div>
        {laster ? (
          <p className="text-base text-on-surface-variant/60">Laster…</p>
        ) : sykluser.length === 0 ? (
          <p className="text-base text-on-surface-variant/60">Ingen sykluser registrert ennå.</p>
        ) : (
          <div className="space-y-3">
            {sykluser.map(s => (
              <div
                key={s.id}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 sm:px-6 py-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-base font-medium text-on-surface">{formaterDato(s.start_date)}</p>
                  {s.end_date && (
                    <p className="text-base text-on-surface-variant/60 mt-0.5">til {formaterDato(s.end_date)}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-base font-semibold px-3 py-1 rounded-full ${
                      !s.end_date ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {varighetDager(s.start_date, s.end_date)}
                  </span>
                  <button
                    onClick={() => slettSyklus(s.id)}
                    disabled={sletter === s.id}
                    className="text-on-surface-variant/40 hover:text-error disabled:opacity-50 transition-colors"
                    title="Slett"
                    aria-label="Slett syklus"
                  >
                    {sletter === s.id ? '…' : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
