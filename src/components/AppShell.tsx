'use client'

import { createContext, useContext, useState } from 'react'

export interface SliderConfig {
  startDate: string
  cycleLength: number
  periodLength: number
  actualDay: number
}

interface AppCtx {
  detaljer: boolean
  toggleDetaljer: () => void
  previewDay: number
  setPreviewDay: (d: number) => void
  slider: SliderConfig | null
  setSlider: (s: SliderConfig | null) => void
}

const Ctx = createContext<AppCtx | null>(null)

export function useApp(): AppCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppShell>')
  return ctx
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [detaljer, setDetaljer] = useState(false)
  const [previewDay, setPreviewDay] = useState(1)
  const [slider, setSlider] = useState<SliderConfig | null>(null)

  return (
    <Ctx.Provider
      value={{
        detaljer,
        toggleDetaljer: () => setDetaljer(d => !d),
        previewDay,
        setPreviewDay,
        slider,
        setSlider,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
