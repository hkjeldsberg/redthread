'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { useApp } from './AppShell'
import StickySlider from './StickySlider'

const lenker = [
  { href: '/', label: 'Oversikt' },
  { href: '/syklus', label: 'Syklus' },
  { href: '/profil', label: 'Profil' },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { detaljer, toggleDetaljer } = useApp()
  const showToggle = pathname === '/'
  const [menyApen, setMenyApen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => setMenyApen(false), [pathname])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  async function loggUt() {
    setMenyApen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/innlogging')
    router.refresh()
  }

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 gap-3">
        <Link href="/" className="text-primary tracking-tight shrink-0 text-2xl" style={{ fontFamily: 'var(--font-caveat), cursive', fontWeight: 600 }}>
          Rød tråd
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-1">
          {lenker.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-1.5 text-base font-medium tracking-wide transition-colors ${
                  active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <AnimatePresence initial={false}>
            {showToggle && (
              <motion.button
                key="details-toggle"
                onClick={toggleDetaljer}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.96 }}
                title={detaljer ? 'Skjul detaljer' : 'Vis detaljer'}
                aria-pressed={detaljer}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-base font-medium border transition-colors ${
                  detaljer
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface text-primary border-primary/40 hover:bg-primary/10'
                }`}
              >
                <InfoIcon filled={detaljer} />
                <span className="hidden sm:inline">{detaljer ? 'Skjul detaljer' : 'Vis detaljer'}</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Logout — desktop only; on mobile it lives in the menu */}
          <button
            onClick={loggUt}
            title="Logg ut"
            aria-label="Logg ut"
            className="hidden md:inline-flex text-on-surface-variant hover:text-primary transition-colors"
          >
            <LogoutIcon />
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenyApen(o => !o)}
            aria-label={menyApen ? 'Lukk meny' : 'Åpne meny'}
            aria-expanded={menyApen}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-on-surface hover:bg-surface-container transition-colors"
          >
            {menyApen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence initial={false}>
        {menyApen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-outline-variant/20 bg-surface/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-3 flex flex-col gap-1 max-w-6xl mx-auto">
              {lenker.map(l => {
                const active = pathname === l.href
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2.5 rounded-md text-base font-medium tracking-wide transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              })}
              <button
                onClick={loggUt}
                className="mt-1 flex items-center gap-2 px-3 py-2.5 rounded-md text-base text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors text-left"
              >
                <LogoutIcon />
                Logg ut
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <StickySlider />
    </header>
  )
}

function InfoIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" stroke={filled ? 'white' : 'currentColor'} />
      <circle cx="12" cy="8" r="0.8" fill={filled ? 'white' : 'currentColor'} stroke="none" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  )
}
