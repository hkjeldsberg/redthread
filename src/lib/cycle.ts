import type { DraglandPillarFocus, Phase, PhaseDetails, Recommendation } from '@/types'

export function getCurrentCycleDay(startDate: string): number {
  const start = new Date(startDate)
  const today = new Date()
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
}

export function getPhase(cycleDay: number, periodLength: number, cycleLength: number): Phase {
  if (cycleDay <= periodLength) return 'menstruasjon'
  if (cycleDay <= 12) return 'follikulær'
  if (cycleDay <= 15) return 'eggløsning'
  return 'luteal'
}

// Compute average cycle length (days between consecutive start_dates).
// Returns null if not enough data (< 2 cycles).
export function averageCycleLength(startDatesDesc: string[]): number | null {
  if (startDatesDesc.length < 2) return null
  const diffs: number[] = []
  for (let i = 0; i < startDatesDesc.length - 1; i++) {
    const newer = new Date(startDatesDesc[i])
    const older = new Date(startDatesDesc[i + 1])
    const d = Math.round((newer.getTime() - older.getTime()) / (1000 * 60 * 60 * 24))
    if (d > 14 && d < 60) diffs.push(d) // sanity bound to drop bad data
  }
  if (diffs.length === 0) return null
  return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length)
}

export const phaseInfo: Record<Phase, { label: string; color: string; bg: string; description: string }> = {
  menstruasjon: {
    label: 'Menstruasjon',
    color: 'text-primary',
    bg: 'bg-primary-container',
    description: 'Kroppen kvitter seg med livmorslimhinnen. Østrogen og progesteron er lave.',
  },
  'follikulær': {
    label: 'Follikulær fase',
    color: 'text-[#c08040]',
    bg: 'bg-[#f6e6d8]',
    description: 'Østrogen stiger og forbereder kroppen for eggløsning. Energinivået øker gradvis.',
  },
  eggløsning: {
    label: 'Eggløsning',
    color: 'text-[#8a6db0]',
    bg: 'bg-[#d8c8e8]',
    description: 'LH-topp utløser eggløsning. Østrogen er på sitt høyeste — energi og styrke er optimal.',
  },
  luteal: {
    label: 'Lutealfase',
    color: 'text-[#7a5c6a]',
    bg: 'bg-[#fde8e0]',
    description: 'Progesteron stiger. Kroppstemperaturen øker. Kroppen forbereder seg på menstruasjon.',
  },
}

// Dragland's 5 pillars (Hele deg) — phase-specific focus.
// Pillar most worth prioritizing during each phase, based on phase physiology
// and Dragland-cited evidence (e.g., søvn ↔ insulin/inflammasjon, ro ↔ HPA-akse).
export const draglandFocus: Record<Phase, DraglandPillarFocus> = {
  menstruasjon: {
    pilar: 'Ro & stress',
    råd: 'Senk tempoet. Lavt østrogen og progesteron gjør kroppen mer sensitiv for stress. Pust dypt, kuldeeksponering på ansiktet eller varmt bad kan stimulere vagusnerven og dempe smerte. Prioriter nære relasjoner og rolige måltider.',
  },
  'follikulær': {
    pilar: 'Bevegelse',
    råd: 'Bygg kapasitet nå. Trening øker BDNF, hippocampus og telomerlengde (jf. studier i Helsemodellen). 4×4-intervaller eller styrke 3–4 ganger i uka utnytter den beste hormonelle vinduet for adaptasjon.',
  },
  eggløsning: {
    pilar: 'Mat',
    råd: 'Stabil mat over hele dagen. Variér grønnsaker (brokkoli, blomkål), velg ren, lite ultraprosessert mat — UPF er knyttet til betennelse og dårligere tarmflora. Tidsbegrenset spising bør ikke være for stramt nå.',
  },
  luteal: {
    pilar: 'Søvn',
    råd: 'Beskytt søvnen. Søvnmangel én natt gir insulinresistens (Donga 2010), og lutealfasen forverrer ofte søvn. Mørkt og kjølig rom, ingen skjerm før leggetid, og 7–9 timer. Magnesium og D-vitamin støtter søvnkvalitet (Gao 2018).',
  },
}

export const phaseDetails: Record<Phase, PhaseDetails> = {
  menstruasjon: {
    hormoner: 'Østrogen og progesteron er på sitt laveste. Prostaglandiner utløser sammentrekninger i livmoren.',
    fysiologi: 'Jernverdier kan falle pga. blodtap. Søvnkvalitet kan forstyrres første dager. Smertesensitivitet er høyere.',
  },
  'follikulær': {
    hormoner: 'FSH stimulerer follikler i eggstokkene. Østrogen stiger jevnt mot eggløsning.',
    fysiologi: 'Forbedret insulinfølsomhet, økt smertetoleranse, og bedre evne til muskeloppbygging. Hvilepuls er lav.',
  },
  eggløsning: {
    hormoner: 'LH-topp utløser eggløsning. Østrogen når sin høyeste verdi, deretter et lite fall. Testosteron er forhøyet.',
    fysiologi: 'Maksimal styrke og koordinasjon. Økt risiko for korsbåndsskade pga. høyt østrogen og leddslakkhet — fokus på god teknikk.',
  },
  luteal: {
    hormoner: 'Progesteron dominerer (gult legeme). Østrogen synker. Mot slutten av fasen faller begge hormonene bratt.',
    fysiologi: 'Kjernetemperatur øker 0,3–0,5 °C. Basalt stoffskifte øker 5–10 %. Søvn kan forverres siste uke. Kortisol er mer reaktivt.',
  },
}

export const recommendations: Record<Phase, Recommendation> = {
  menstruasjon: {
    trening: {
      tittel: 'Lett bevegelse',
      intensitet: 'Lav',
      beskrivelse: 'Lytt til kroppen. Lett aktivitet er bra, men unngå hard belastning de første dagene.',
      øvelser: ['Gåtur', 'Yoga / yin yoga', 'Lett tøying', 'Rolig svømming'],
      detaljer: 'Lave hormonnivåer reduserer energi og restitusjon. Lett bevegelse øker blodgjennomstrømning og kan dempe kramper. Mange opplever økt energi mot slutten av menstruasjonen — da kan du gradvis trappe opp.',
    },
    mat: {
      tittel: 'Jerntett kosthold',
      fokus: 'Jern, magnesium, omega-3',
      beskrivelse: 'Erstatt tapt jern og reduser betennelse med antioksidantrik mat.',
      matvarer: ['Mørk bladgrønt (spinat, grønnkål)', 'Rødt kjøtt / linser', 'Mørk sjokolade', 'Fet fisk', 'Bær'],
      detaljer: 'Blodtapet under menstruasjon kan gi mild jernmangel. Hem-jern (kjøtt, fisk) absorberes bedre enn plante-jern. Kombinér plante-jern med C-vitamin (paprika, sitrus) for bedre opptak. Magnesium kan dempe kramper og forbedre søvn. Reduser ultraprosessert mat — Dragland viser at UPF er sterkt koblet til økt inflammasjon (Lane 2024, Quetglas-Llabrés 2023).',
    },
    faste: {
      tittel: 'Faste ikke anbefalt',
      anbefaling: 'unngå',
      vindu: 'Unngå faste',
      beskrivelse: 'Kroppen trenger energi og næring nå. Hopp over faste og spis regelmessig for å støtte hormonbalansen.',
      detaljer: 'Lave østrogen- og progesteronnivåer gjør kroppen mer sensitiv for stress. Aggressiv faste kan øke kortisol og forverre symptomer. Spis 3–4 jevne måltider for å støtte blodsukkerregulering og energi.',
    },
  },
  'follikulær': {
    trening: {
      tittel: 'Bygg styrke',
      intensitet: 'Moderat–høy',
      beskrivelse: 'Stigende østrogen gir bedre smertetoleranse og kraftutvikling. Ideelt for tung styrketrening og HIIT.',
      øvelser: ['Tung styrketrening', 'HIIT', 'Løping', 'Crossfit / funksjonell trening'],
      detaljer: 'Studier (Sims, Wikström-Frisén) viser at flere styrkeøkter i follikulærfasen kan gi raskere muskel- og styrkeprogresjon enn jevn fordeling over hele syklusen. Restitusjon mellom økter er også bedre i denne fasen.',
    },
    mat: {
      tittel: 'Komplekse karbohydrater',
      fokus: 'Karbohydrater, fiber, lettere proteiner',
      beskrivelse: 'Fyll opp glykogenlagrene til de harde øktene. Østrogen forbedrer insulinfølsomheten.',
      matvarer: ['Havregrøt', 'Quinoa / brun ris', 'Søtpotet', 'Egg', 'Grønnsaker', 'Bær og frukt'],
      detaljer: 'Høyere østrogen forbedrer insulinfølsomheten — kroppen håndterer karbohydrater bedre. Dette er fasen kroppen er best rustet til å hente energi fra karbohydrater. Fiber-rik mat støtter også god østrogenmetabolisme via tarmen.',
    },
    faste: {
      tittel: 'Gunstig for intermittent faste',
      anbefaling: 'anbefalt',
      vindu: '13–16 timer',
      beskrivelse: 'Kroppen tåler stress bedre i denne fasen. 13–16 timers faste er trygt og kan støtte fettforbrenning.',
      detaljer: 'Lavere kortisol-reaktivitet og høyere stresstoleranse gjør dette til den tryggeste fasen for intermittent faste. Pelz og andre anbefaler 13–16 timer (f.eks. 16:8). Dragland viser at tidsbegrenset spising kan forbedre insulinfølsomhet (Sutton 2018, Cell Metab) og redusere inflammasjon (Xie 2022, Nat Commun). Lytt på kropp og energi — kvinner som trener hardt bør holde fastene kortere.',
    },
  },
  eggløsning: {
    trening: {
      tittel: 'Topp ytelse',
      intensitet: 'Høy',
      beskrivelse: 'Energi og styrke er på topp. Perfekt tid for personlige rekorder og høyintensiv trening.',
      øvelser: ['Maksimal styrketrening', 'Sprintintervaller', 'Konkurranse / test', 'Gruppetrening'],
      detaljer: 'Maksimal motorisk kontroll, styrke og VO₂maks. Vær obs: høyt østrogen øker leddslakkhet — flere studier finner forhøyet risiko for korsbåndsruptur rundt eggløsning. Prioriter teknikk og oppvarming, særlig ved hopp og retningsskifter.',
    },
    mat: {
      tittel: 'Antioksidanter og fiber',
      fokus: 'Antioksidanter, sink, B-vitaminer',
      beskrivelse: 'Støtt eggcellen og lever i denne fasen med næringstett, variert kost.',
      matvarer: ['Brokkoli og blomkål', 'Frø (gresskar, solsikke)', 'Kylling / laks', 'Grønne grønnsaker', 'Avokado'],
      detaljer: 'Korsblomstrede grønnsaker (brokkoli, blomkål) inneholder DIM/I3C som støtter leverens østrogenmetabolisme — viktig når østrogen topper seg. Sink og B6 støtter neste fases progesteronproduksjon.',
    },
    faste: {
      tittel: 'Vær forsiktig',
      anbefaling: 'forsiktig',
      vindu: 'Maks 13 timer',
      beskrivelse: 'Høyt østrogen kan øke kortisolsensitiviteten. Hold eventuell faste kort (maks 13 timer) og spis nok.',
      detaljer: 'Østrogentoppen påvirker GnRH-pulser. Aggressiv faste her kan forstyrre eggløsningen, særlig hvis du allerede er i kalorimangel eller trener mye. Hold deg innenfor 12–13 timer og sørg for tilstrekkelig totalt energiinntak.',
    },
  },
  luteal: {
    trening: {
      tittel: 'Roligere trening',
      intensitet: 'Lav–moderat',
      beskrivelse: 'Progesteron hever kjernetemperaturen og reduserer utholdenhet. Prioriter restitusjon.',
      øvelser: ['Rolig styrketrening', 'Pilatès', 'Yoga', 'Sykkel i rolig tempo', 'Gåtur'],
      detaljer: 'Høyere kroppstemperatur reduserer prestasjon ved utholdenhetstrening, særlig i varme. Progesteron øker også proteinnedbrytning — vurder ekstra protein etter økt. Mot slutten av fasen kan tretthet og PMS-symptomer ramme søvn og motivasjon: gjør lavere volum.',
    },
    mat: {
      tittel: 'Sunt fett og protein',
      fokus: 'Sunt fett, protein, magnesium, komplekse karbohydrater',
      beskrivelse: 'Stoffskiftet øker med 5–10 %. Spis litt mer og prioriter mettende mat som stabiliserer blodsukkeret.',
      matvarer: ['Avokado', 'Nøtter og frø', 'Laks / makrell', 'Egg', 'Belgvekster', 'Søtpotet'],
      detaljer: 'Basalmetabolismen øker 5–10 % — et lite kaloriunderskudd nå kan oppleves som strengt. Magnesium (mørk sjokolade, nøtter, bladgrønt) demper PMS, kramper og søvnvansker. Trygge komplekse karbohydrater på kvelden støtter serotoninproduksjon og søvn. Kostholdet påvirker søvnen direkte (St-Onge 2016, Adv Nutr) — særlig viktig i denne fasen.',
    },
    faste: {
      tittel: 'Unngå faste',
      anbefaling: 'unngå',
      vindu: 'Unngå faste',
      beskrivelse: 'Kroppen bygger progesteron og trenger energi. Lang faste kan øke kortisol og forstyrre hormonsyklusen.',
      detaljer: 'Progesteronproduksjon krever energi og kolesterol. Lengre faste her øker kortisol, kan forverre PMS og forstyrre neste menstruasjon. Dragland beskriver hvordan høye kortisolnivåer over tid øker sykdomsrisiko (Vogelzangs 2010) og forstyrrer HPA-aksen — særlig kritisk i lutealfasen. Hvis du må faste: hold under 12 timer, og kun de første dagene av lutealfasen.',
    },
  },
}
