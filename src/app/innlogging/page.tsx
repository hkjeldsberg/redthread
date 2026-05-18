'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function InnloggingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [passord, setPassord] = useState('')
  const [feil, setFeil] = useState<string | null>(null)
  const [laster, setLaster] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeil(null)
    setLaster(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: passord })

    if (error) {
      setFeil('Feil e-post eller passord.')
      setLaster(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
      <div className="thread-bg absolute top-0 right-0 w-32 h-screen pointer-events-none" />
      <div className="w-full max-w-sm relative">
        <p className="text-base font-bold text-primary/60 tracking-widest uppercase mb-2">Rød tråd</p>
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface mb-10">Logg inn</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-base font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">Passord</label>
            <input
              type="password"
              value={passord}
              onChange={e => setPassord(e.target.value)}
              required
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
            />
          </div>

          {feil && <p className="text-error text-base">{feil}</p>}

          <button
            type="submit"
            disabled={laster}
            className="w-full bg-on-surface text-surface rounded text-base font-medium px-4 py-3 hover:bg-inverse-surface disabled:opacity-50 transition-colors"
          >
            {laster ? 'Logger inn…' : 'Logg inn'}
          </button>
        </form>

        <p className="text-base text-on-surface-variant mt-8 text-center">
          Ingen konto?{' '}
          <Link href="/registrer" className="text-primary underline underline-offset-2">
            Registrer deg
          </Link>
        </p>
      </div>
    </div>
  )
}
