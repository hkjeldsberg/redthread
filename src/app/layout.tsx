import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Rød tråd',
  description: 'Følg menstruasjonssyklusen din',
  icons: {
    icon: 'https://img.icons8.com/?size=160&id=hS9AgNEWwXmL&format=png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-on-surface antialiased">{children}</body>
    </html>
  )
}
