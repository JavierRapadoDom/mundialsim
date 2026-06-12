import { useMemo, useState } from 'react'
import { FORMATIONS, bestXI, avgRating } from '../data/squads.js'
import { TACTICS, PRESSING } from '../engine/match.js'

const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }
const fitColor = fit => (fit >= 70 ? 'var(--green)' : fit >= 40 ? 'var(--gold)' : 'var(--red)')

export default function PreMatch({ team, opponent, squad, knockout, stadium, onStart, onBack }) {
  const available = useMemo(() => squad.filter(p => p.inj === 0 && p.sus === 0), [squad])
  const out = useMemo(() => squad.filter(p => p.inj !== 0 || p.sus > 0), [squad])
  const [formation, setFormation] = useState('4-3-3')
  const [tactic, setTactic] = useState('equilibrada')
  const [pressing, setPressing] = useState('media')
  const initial = useMemo(() => bestXI(available, formation), [available, formation])
  const [xi, setXi] = useState(initial.xi)
  const [bench, setBench] = useState(initial.bench)
  const [selected, setSelected] = useState(null) // jugador del XI marcado para intercambio

  const changeFormation = f => {
    setFormation(f)
    const { xi: nxi, bench: nbench } = bestXI(available, f)
    setXi(nxi)
    setBench(nbench)
    setSelected(null)
  }

  const swap = benchPlayer => {
    if (!selected) return
    setXi(xi.map(p => (p.id === selected.id ? benchPlayer : p)))
    setBench(bench.map(p => (p.id === benchPlayer.id ? selected : p)))
    setSelected(null)
  }

  const Row = ({ p, inXI }) => (
    <button
      key={p.id}
      className={`pm-player ${selected?.id === p.id ? 'sel' : ''} ${!inXI && selected && selected.pos !== p.pos ? 'dim' : ''}`}
      onClick={() => (inXI ? setSelected(selected?.id === p.id ? null : p) : swap(p))}
      disabled={!inXI && !selected}
    >
      <span className="pm-pos" style={{ background: POS_COLOR[p.pos] }}>{p.pos}</span>
      <span className="pm-num">#{p.num}</span>
      <span className="pm-name">{p.n} {p.star && '★'}</span>
      <span className="pm-fit" title={`Energía ${Math.round(p.fit)}%`}>
        <i className="fit-bar"><b style={{ width: `${p.fit}%`, background: fitColor(p.fit) }} /></i>
        {Math.round(p.fit)}
      </span>
      <span className="pm-r">
        {p.r}{p.dev > 0 && <em className="dev-up">▲</em>}
      </span>
    </button>
  )

  return (
    <div className="prematch">
      <button className="btn btn-ghost back-btn" onClick={onBack}>← Volver al torneo</button>

      <div className="pm-header">
        <h1 className="page-title">
          {team.flag} {team.name} <span className="vs">VS</span> {opponent.flag} {opponent.name}
        </h1>
        <p className="page-sub">
          {knockout ? '⚡ Eliminatoria directa' : 'Fase de grupos'} · 🏟️ {stadium}
        </p>
      </div>

      <div className="pm-grid">
        <div className="pm-col">
          <h3 className="pm-title">Formación</h3>
          <div className="chips">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} className={`chip ${formation === f ? 'on' : ''}`} onClick={() => changeFormation(f)}>{f}</button>
            ))}
          </div>

          <h3 className="pm-title">Mentalidad</h3>
          <div className="chips">
            {Object.entries(TACTICS).map(([k, v]) => (
              <button key={k} className={`chip ${tactic === k ? 'on' : ''}`} onClick={() => setTactic(k)}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          <h3 className="pm-title">Presión</h3>
          <div className="chips">
            {Object.entries(PRESSING).map(([k, v]) => (
              <button key={k} className={`chip ${pressing === k ? 'on' : ''}`} onClick={() => setPressing(k)} title="La presión alta roba balones pero agota y trae tarjetas">
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          <div className="pm-meta">
            <div className="pm-meta-box">
              <div className="pm-meta-num">{avgRating(xi)}</div>
              <div className="pm-meta-lab">media de tu XI</div>
            </div>
            <div className="pm-meta-box">
              <div className="pm-meta-num" style={{ color: fitColor(xi.reduce((s, p) => s + p.fit, 0) / Math.max(1, xi.length)) }}>
                {Math.round(xi.reduce((s, p) => s + p.fit, 0) / Math.max(1, xi.length))}%
              </div>
              <div className="pm-meta-lab">energía del XI</div>
            </div>
            <div className="pm-meta-box">
              <div className="pm-meta-num">{opponent.rating}</div>
              <div className="pm-meta-lab">rival ({opponent.code})</div>
            </div>
          </div>

          {out.length > 0 && (
            <div className="pm-out">
              <h3 className="pm-title">🏥 Bajas</h3>
              {out.map(p => (
                <div className="pm-out-row" key={p.id}>
                  <span>{p.n}</span>
                  <span className="pm-out-why">
                    {p.inj === -1 ? '🚑 todo el torneo' : p.inj > 0 ? `🤕 ${p.inj} part.` : `🟥 sanción (${p.sus})`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-big pm-start" onClick={() => onStart({ formation, tactic, pressing, xi, bench })}>
            ⚽ ¡Al campo!
          </button>
          <p className="pm-hint">💡 Toca un titular y luego un suplente para intercambiarlos. Vigila la energía: un crack fundido rinde menos que un suplente fresco.</p>
        </div>

        <div className="pm-col">
          <h3 className="pm-title">Once titular ({formation})</h3>
          <div className="pm-list">{xi.map(p => <Row key={p.id} p={p} inXI />)}</div>
        </div>

        <div className="pm-col">
          <h3 className="pm-title">Banquillo</h3>
          <div className="pm-list">{bench.map(p => <Row key={p.id} p={p} inXI={false} />)}</div>
        </div>
      </div>
    </div>
  )
}
