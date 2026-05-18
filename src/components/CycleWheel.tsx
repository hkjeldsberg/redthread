'use client'

import { getPhase, phaseInfo } from '@/lib/cycle'

const R = 148
const INNER = 106

function slicePath(i: number, total: number): string {
  const a0 = (i / total) * Math.PI * 2 - Math.PI / 2
  const a1 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2
  const r0 = INNER + 4
  const r1 = R - 4
  const pts = (a: number, r: number): [number, number] => [Math.cos(a) * r, Math.sin(a) * r]
  const [x0, y0] = pts(a0, r0)
  const [x1, y1] = pts(a0, r1)
  const [x2, y2] = pts(a1, r1)
  const [x3, y3] = pts(a1, r0)
  return `M ${x0} ${y0} L ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r0} ${r0} 0 0 0 ${x0} ${y0} Z`
}

function sliceColor(day: number, periodLength: number, cycleLength: number): string {
  const phase = getPhase(day, periodLength, cycleLength)
  const ovDay = Math.round(cycleLength * 0.5)
  if (phase === 'eggløsning' && Math.abs(day - ovDay) <= 1) return '#8a6db0'
  const map: Record<string, string> = {
    menstruasjon: '#f2c9cf',
    'follikulær': '#f6e6d8',
    eggløsning: '#d8c8e8',
    luteal: '#fde8e0',
  }
  return map[phase] ?? '#fde8e0'
}

interface Props {
  cycleLength: number
  periodLength: number
  previewDay: number
  onDayClick: (day: number) => void
}

export default function CycleWheel({ cycleLength, periodLength, previewDay, onDayClick }: Props) {
  const phase = getPhase(previewDay, periodLength, cycleLength)
  const info = phaseInfo[phase]
  const pinAngle = ((previewDay - 0.5) / cycleLength) * Math.PI * 2 - Math.PI / 2
  const pinX = Math.cos(pinAngle) * (R + 2)
  const pinY = Math.sin(pinAngle) * (R + 2)
  const vb = R + 24

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const scale = (vb * 2) / rect.width
    const dx = (e.clientX - rect.left) * scale - vb
    const dy = (e.clientY - rect.top) * scale - vb
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < INNER || dist > R + 20) return
    let angle = Math.atan2(dy, dx) + Math.PI / 2
    if (angle < 0) angle += Math.PI * 2
    const day = Math.max(1, Math.min(cycleLength, Math.ceil((angle / (Math.PI * 2)) * cycleLength)))
    onDayClick(day)
  }

  const ticks = [1, 7, 14, 21].filter(d => d <= cycleLength)

  return (
    <svg
      viewBox={`-${vb} -${vb} ${vb * 2} ${vb * 2}`}
      className="w-full max-w-[300px] mx-auto cursor-pointer select-none"
      onClick={handleClick}
      aria-label="Syklushjul — klikk for å velge dag"
    >
      <circle r={R} fill="none" stroke="#e8c8c8" strokeWidth="1" />
      <circle r={INNER} fill="#fcf7f3" stroke="#e8c8c8" strokeWidth="1" />

      {Array.from({ length: cycleLength }).map((_, i) => (
        <path
          key={i}
          d={slicePath(i, cycleLength)}
          fill={sliceColor(i + 1, periodLength, cycleLength)}
          stroke="#fcf7f3"
          strokeWidth="1.5"
        />
      ))}

      {ticks.map(day => {
        const a = ((day - 0.5) / cycleLength) * Math.PI * 2 - Math.PI / 2
        const r = R + 15
        return (
          <text
            key={day}
            x={Math.cos(a) * r}
            y={Math.sin(a) * r}
            fontSize="11"
            fill="#7a5c6a"
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={day === previewDay ? 700 : 400}
          >
            {day}
          </text>
        )
      })}

      {/* Pin marker */}
      <circle cx={pinX} cy={pinY} r="9" fill="#b85968" stroke="#fcf7f3" strokeWidth="3" />

      {/* Center text */}
      <text x="0" y="-14" textAnchor="middle" fontSize="10" fill="#7a5c6a" letterSpacing="2">
        DAG {previewDay} / {cycleLength}
      </text>
      <text
        x="0"
        y="18"
        textAnchor="middle"
        fontSize="26"
        fill="#b85968"
        fontWeight="600"
        fontFamily="var(--font-caveat), Caveat, cursive"
      >
        {info.label}
      </text>
    </svg>
  )
}
