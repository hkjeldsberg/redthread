'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegistrerPage() {
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
    const { error } = await supabase.auth.signUp({ email, password: passord })

    if (error) {
      setFeil(error.message)
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
        <p className="text-xs font-bold text-primary/60 tracking-widest uppercase mb-2">Rød tråd</p>
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface mb-10">Opprett konto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-1">Passord</label>
            <input
              type="password"
              value={passord}
              onChange={e => setPassord(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary px-0 py-2 text-base focus:outline-none transition-colors"
            />
            <p className="text-xs text-on-surface-variant/60 mt-1">Minst 6 tegn</p>
          </div>

          {feil && <p className="text-error text-sm">{feil}</p>}

          <button
            type="submit"
            disabled={laster}
            className="w-full bg-on-surface text-surface rounded text-sm font-medium px-4 py-3 hover:bg-inverse-surface disabled:opacity-50 transition-colors"
          >
            {laster ? 'Oppretter konto…' : 'Registrer deg'}
          </button>
        </form>

        <p className="text-sm text-on-surface-variant mt-8 text-center">
          Har du konto?{' '}
          <Link href="/innlogging" className="text-primary underline underline-offset-2">
            Logg inn
          </Link>
        </p>
      </div>
    </div>
  )
}
