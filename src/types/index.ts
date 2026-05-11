export type Phase = 'menstruasjon' | 'follikulær' | 'eggløsning' | 'luteal'

export interface CyclePhase {
  name: Phase
  label: string
  days: string
  color: string
  description: string
}

export interface Recommendation {
  trening: {
    tittel: string
    intensitet: string
    beskrivelse: string
    øvelser: string[]
    detaljer: string
  }
  mat: {
    tittel: string
    fokus: string
    beskrivelse: string
    matvarer: string[]
    detaljer: string
  }
  faste: {
    tittel: string
    anbefaling: 'anbefalt' | 'forsiktig' | 'unngå'
    vindu: string
    beskrivelse: string
    detaljer: string
  }
}

export interface PhaseDetails {
  hormoner: string
  fysiologi: string
}

export interface DraglandPillarFocus {
  pilar: 'Søvn' | 'Mat' | 'Bevegelse' | 'Ro & stress' | 'Relasjoner'
  råd: string
}

export interface Profile {
  id: string
  age: number | null
  has_given_birth: boolean
  cycle_length: number
  period_length: number
  other_notes: string | null
  created_at: string
  updated_at: string
}

export interface Cycle {
  id: string
  user_id: string
  start_date: string
  end_date: string | null
  notes: string | null
  created_at: string
}
