import { useMemo, useRef, useState } from 'react'
import { legendsOf, materializeLegend } from '../data/legends.js'
import { SPEC_FULL } from '../data/positions.js'
import { Avatar } from './PlayerCard.jsx'

const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }
const SEG_BASE = [
  { win: true, icon: '⭐', label: 'Leyenda para tu selección' },
  { win: false, icon: '🍂', label: 'La próxima será' },
  { win: true, icon: '⭐', label: 'Leyenda para tu selección' },
  { win: false, icon: '🍂', label: 'La próxima será' },
]

// ───────── Ruleta de la suerte ─────────
export function LegendRoulette({ team, onResult }) {
  const segments = useMemo(() => {
    // baraja determinista por equipo pero con 2 premios y 2 vacíos
    const a = [...SEG_BASE]
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
    return a
  }, [])
  const [current, setCurrent] = useState(-1)
  const [landed, setLanded] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const runningRef = useRef(false)

  const spin = () => {
    if (runningRef.current || landed !== null) return
    runningRef.current = true
    setSpinning(true)
    const result = Math.floor(Math.random() * 4)
    const steps = []
    let idx = Math.floor(Math.random() * 4)
    const total = 20 + Math.floor(Math.random() * 4)
    for (let i = 0; i < total; i++) { steps.push(idx); idx = (idx + 1) % 4 }
    while (steps[steps.length - 1] !== result) steps.pop()
    let i = 0
    const tick = () => {
      setCurrent(steps[i])
      i++
      if (i < steps.length) setTimeout(tick, 55 + Math.pow(i / steps.length, 2.4) * 330)
      else { setLanded(result); setSpinning(false); runningRef.current = false }
    }
    tick()
  }

  const won = landed !== null && segments[landed].win

  return (
    <div className="legend-intro">
      <h1 className="page-title">🎰 La ruleta del destino</h1>
      <p className="page-sub">
        {team.flag} <b>{team.name}</b> arranca el Mundial. Gira la ruleta: si la suerte sonríe, una <b>leyenda</b> de tu selección saldrá del retiro para jugar este torneo contigo.
      </p>

      <div className="roulette">
        {segments.map((s, i) => (
          <div key={i} className={`roul-seg ${s.win ? 'win' : 'lose'} ${current === i ? 'lit' : ''} ${landed === i ? 'landed' : ''}`}>
            <div className="roul-icon">{s.icon}</div>
            <div className="roul-label">{s.label}</div>
          </div>
        ))}
      </div>

      {landed === null ? (
        <button className="btn btn-gold btn-big roul-spin" onClick={spin} disabled={spinning}>
          {spinning ? '🎲 Girando…' : '🎯 ¡Girar la ruleta!'}
        </button>
      ) : (
        <div className={`roul-result ${won ? 'win' : 'lose'}`}>
          <div className="roul-result-title">{won ? '⭐ ¡LEYENDA PARA TU SELECCIÓN!' : '🍂 La próxima será…'}</div>
          <p>{won ? 'Elige a tu leyenda para que dispute el Mundial.' : `Esta vez la fortuna no acompaña a ${team.name}, pero el torneo es tuyo.`}</p>
          <button className="btn btn-primary btn-big" onClick={() => onResult(won)}>
            {won ? '➡️ Elegir leyenda' : '⚽ Empezar el Mundial'}
          </button>
        </div>
      )}
    </div>
  )
}

// ───────── Elección de leyenda (5 cartas) ─────────
export function LegendPicker({ team, onPick }) {
  const legends = legendsOf(team.id)
  return (
    <div className="legend-intro">
      <h1 className="page-title">⭐ Elige a tu leyenda</h1>
      <p className="page-sub">Una de estas glorias de {team.flag} {team.name} se unirá a tu plantilla en su mejor versión. Elige con cabeza: jugará todo el torneo.</p>

      <div className="legend-grid">
        {legends.map((d, i) => {
          const mat = materializeLegend(team.id, d)
          return (
            <button key={i} className="legend-card" style={{ '--c1': team.colors[0], '--c2': team.colors[1] }} onClick={() => onPick(mat)}>
              <Avatar player={{ ...mat, id: `lg-${i}` }} team={team} size={104} />
              <div className="legend-pos" style={{ background: POS_COLOR[mat.pos] }}>{d.npos}</div>
              <div className="legend-name">{d.n}</div>
              <div className="legend-role">{SPEC_FULL[d.npos]}</div>
              <div className="legend-meta">{d.club} · {d.era}</div>
              <div className="legend-rating">{d.r}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
