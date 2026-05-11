import AppShell from '@/components/AppShell'
import Nav from '@/components/Nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="thread-bg fixed top-0 right-0 w-32 h-screen pointer-events-none" />
      <AppShell>
        <Nav />
        <main className="pt-28 sm:pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">{children}</main>
      </AppShell>
    </div>
  )
}
