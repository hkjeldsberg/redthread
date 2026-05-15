import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { averageCycleLength, getCurrentCycleDay } from '@/lib/cycle'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/innlogging')

  const mens = supabase.schema('mens')
  const [{ data: cycles }, { data: profile }] = await Promise.all([
    mens
      .from('cycles')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })
      .limit(12),
    mens
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
  ])

  const sisteSyklus = cycles?.[0] ?? null
  const profileCycleLength = profile?.cycle_length ?? 28
  const periodLength = profile?.period_length ?? 5

  if (!sisteSyklus) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="w-16 h-0.5 bg-primary/60 mx-auto mb-8" />
        <h2 className="text-2xl font-semibold text-on-surface mb-3 tracking-tight">
          Ingen syklus registrert
        </h2>
        <p className="text-on-surface-variant text-base mb-8 leading-relaxed">
          Registrer første dag av menstruasjonen for å se anbefalinger.
        </p>
        <Link
          href="/syklus"
          className="inline-block bg-on-surface text-surface text-sm px-6 py-3 rounded font-medium hover:bg-inverse-surface transition-colors"
        >
          Registrer syklus
        </Link>
      </div>
    )
  }

  const startDates = (cycles ?? []).map(c => c.start_date)
  const learned = averageCycleLength(startDates)
  const effectiveCycleLength = learned ?? profileCycleLength
  const actualDay = getCurrentCycleDay(sisteSyklus.start_date)

  return (
    <DashboardClient
      cycleId={sisteSyklus.id}
      startDate={sisteSyklus.start_date}
      cycleLength={effectiveCycleLength}
      periodLength={periodLength}
      actualDay={actualDay}
      learnedFromCycles={learned !== null ? startDates.length : 0}
      profileCycleLength={profileCycleLength}
    />
  )
}
