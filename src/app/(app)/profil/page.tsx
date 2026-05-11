'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const ressurser = [
  {
    kategori: 'Dr. Annette Dragland – Hele deg',
    lenker: [
      { tittel: 'Boken «Hele deg – veien til bedre helse»', url: 'https://www.annettedragland.no/heledeg/' },
      { tittel: 'Kildeliste til boken (PDF)', url: 'https://www.annettedragland.no/wp-content/uploads/2025/05/Kilder-til-boken-Hele-Deg-.pdf' },
      { tittel: 'Podcast: Leger om livet', url: 'https://www.annettedragland.no/' },
    ],
  },
  {
    kategori: 'Norske kilder',
    lenker: [
      { tittel: 'Volvat – Menstruasjonssyklusen', url: 'https://www.volvat.no/tjenester/gynekologi/menstruasjonssyklus/' },
      { tittel: 'NHI – Mensen og trening', url: 'https://nhi.no/trening/aktivitet-og-helse/treningsrad-generelle/mensen-og-trening' },
      { tittel: 'SATS – Trening og menstruasjonssyklus', url: 'https://www.sats.no/magasin/trening/trening-og-menstruasjonssyklus/mensen-og-trening' },
      { tittel: 'FHI – Folkehelserapporten (kosthold)', url: 'https://www.fhi.no/he/folkehelserapporten/levevaner/kosthold/' },
    ],
  },
  {
    kategori: 'Syklusfaser',
    lenker: [
      { tittel: 'Mayo Clinic – Menstrual cycle overview', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186' },
      { tittel: 'Office on Women\'s Health – Your menstrual cycle', url: 'https://www.womenshealth.gov/menstrual-cycle' },
      { tittel: 'ACOG – Menstruation in girls and adolescents', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents' },
    ],
  },
  {
    kategori: 'Trening',
    lenker: [
      { tittel: 'Dr. Stacy Sims – Roar (Women\'s physiology)', url: 'https://www.drstacysims.com' },
      { tittel: 'NASM – Cycle syncing and exercise', url: 'https://www.nasm.org/resources/cycle-syncing' },
    ],
  },
  {
    kategori: 'Ernæring',
    lenker: [
      { tittel: 'Academy of Nutrition and Dietetics', url: 'https://www.eatright.org' },
      { tittel: 'Healthline – Best foods for each phase', url: 'https://www.healthline.com/nutrition/cycle-syncing' },
    ],
  },
  {
    kategori: 'Faste',
    lenker: [
      { tittel: 'Dr. Mindy Pelz – Fast Like a Girl', url: 'https://www.mindypelz.com' },
      { tittel: 'Jean Hailes Foundation – Energy and hormonal health', url: 'https://jeanhailes.org.au' },
    ],
  },
]

export default function ProfilPage() {
  const [profil, setProfil] = useState<Partial<Profile>>({
    age: undefined,
    has_given_birth: false,
    cycle_length: 28,
    period_length: 5,
    other_notes: '',
  })
  const [laster, setLaster] = useState(true)
  const [lagrer, setLagrer] = useState(false)
  const [lagret, setLagret] = useState(false)
  const [feil, setFeil] = useState<string | null>(null)

  useEffect(() => {
    async function hent() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.schema('mens').from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfil(data)
      setLaster(false)
    }
    hent()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeil(null)
    setLagret(false)
    setLagrer(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .schema('mens')
      .from('profiles')
      .upsert({
        id: user.id,
        ...profil,
        updated_at: new Date().toISOString(),
      })

    if (error) { setFeil(error.message) } else { setLagret(true) }
    setLagrer(false)
  }

  if (laster) return <p className="text-sm text-on-surface-variant/60">Laster…</p>

  const inputCls = 'w-full bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors'
  const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1'

  return (
    <div className="space-y-12">
      {/* Profile form */}
      <section className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-on-surface mb-6 tracking-tight">Din informasjon</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className={labelCls}>Alder</label>
              <input
                type="number"
                min={10}
                max={60}
                value={profil.age ?? ''}
                onChange={e => setProfil(p => ({ ...p, age: e.target.value ? Number(e.target.value) : undefined }))}
                className={inputCls}
                placeholder="25"
              />
            </div>
            <div>
              <label className={labelCls}>Sykkellengde (dager)</label>
              <input
                type="number"
                min={21}
                max={45}
                value={profil.cycle_length ?? 28}
                onChange={e => setProfil(p => ({ ...p, cycle_length: Number(e.target.value) }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Periodlengde (dager)</label>
              <input
                type="number"
                min={2}
                max={10}
                value={profil.period_length ?? 5}
                onChange={e => setProfil(p => ({ ...p, period_length: Number(e.target.value) }))}
                className={inputCls}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-base cursor-pointer text-on-surface">
                <input
                  type="checkbox"
                  checked={profil.has_given_birth ?? false}
                  onChange={e => setProfil(p => ({ ...p, has_given_birth: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                Har født
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls}>Notater (valgfritt)</label>
            <textarea
              rows={3}
              value={profil.other_notes ?? ''}
              onChange={e => setProfil(p => ({ ...p, other_notes: e.target.value }))}
              placeholder="Evt. relevante helsenoter…"
              className={inputCls + ' resize-none'}
            />
          </div>

          {feil && <p className="text-error text-sm">{feil}</p>}
          {lagret && <p className="text-primary text-sm">Lagret.</p>}

          <button
            type="submit"
            disabled={lagrer}
            className="bg-on-surface text-surface text-sm font-medium px-5 py-2.5 rounded hover:bg-inverse-surface disabled:opacity-50 transition-colors"
          >
            {lagrer ? 'Lagrer…' : 'Lagre'}
          </button>
        </form>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="red-thread-line flex-grow" />
        <span className="text-xs font-bold text-primary/60 tracking-widest uppercase">Kilder</span>
        <div className="red-thread-line w-12" />
      </div>

      {/* Resources */}
      <div className="space-y-4">
        {ressurser.map(gruppe => (
          <article key={gruppe.kategori} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 sm:p-6">
            <p className="text-xs font-bold text-on-surface-variant/60 tracking-widest uppercase mb-3">
              {gruppe.kategori}
            </p>
            <ul className="space-y-2">
              {gruppe.lenker.map(l => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-primary hover:text-primary-container underline underline-offset-2"
                  >
                    {l.tittel}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
