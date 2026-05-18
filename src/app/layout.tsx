import type { Metadata } from 'next'
import { Caveat, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' })

export const metadata: Metadata = {
  title: 'Rød tråd',
  description: 'Følg menstruasjonssyklusen din',
  icons: {
    icon: 'https://img.icons8.com/?size=160&id=hS9AgNEWwXmL&format=png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={`${dmSans.variable} ${caveat.variable} h-full`}>
      <body className="min-h-full bg-background text-on-surface antialiased">{children}</body>
    </html>
  )
}
