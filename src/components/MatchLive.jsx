import { useEffect, useMemo, useRef, useState } from 'react'
import { newMatch, tick, doSub, setTactic, setPressing, isOver, TACTICS, PRESSING } from '../engine/match.js'
import Penalties from './Penalties.jsx'

const EVENT_ICON = {
  gol: '⚽', atajada: '🧤', palo: '🥅', fuera: '💨', amarilla: '🟨', roja: '🟥',
  lesion: '🚑', cambio: '🔁', inicio: '▶️', descanso: '⏸️', final: '🏁',
  penalti: '⚠️', fallo: '❌', penales: '🎯',
}

const onPitch = side => side.players.filter(p => !p.off)

function buildResult(m, pens = null) {
  const goalsOf = side =>
    side.players.concat(side.bench).filter(p => p.goals > 0).map(p => ({ n: p.n, g: p.goals }))
  return { score: [...m.score], pens, scorers: { home: goalsOf(m.home), away: goalsOf(m.away) }, match: m }
}

function PitchSide({ side, top, color }) {
  // El visitante defiende la portería superior; el local, la inferior.
  const rows = ['DEL', 'MED', 'DEF', 'POR']
  const ordered = top ? [...rows].reverse() : rows
  return (
    <div className={`pitch-half ${top ? 'top' : 'bottom'}`}>
      {ordered.map(pos => (
        <div className="pitch-row" key={pos}>
          {onPitch(side).filter(p => p.pos === pos).map(p => (
            <div className="pitch-player" key={p.id} title={`${p.n} · ${p.r} · energía ${Math.round(p.stamina)}%`}>
              <span className="pp-dot" style={{ background: color }}>
                {p.num}
                {p.yc > 0 && <i className="pp-yc" />}
              </span>
              <span className="pp-name">
                {p.n.split(' ').slice(-1)[0]}
                {p.goals > 0 && ` ⚽${p.goals > 1 ? '×' + p.goals : ''}`}
              </span>
              <span className="pp-stamina"><i style={{ width: `${p.stamina}%` }} /></span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function SubsModal({ m, sideKey, onClose, rerender }) {
  const side = m[sideKey]
  const [outP, setOutP] = useState(null)
  const injured = onPitch(side).filter(p => p.injured)

  const confirm = inP => {
    if (!outP) return
    if (doSub(m, sideKey, outP.id, inP.id)) {
      setOutP(null)
      rerender()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">🔁 Sustituciones — quedan {side.subs}</h3>
        {injured.length > 0 && <p className="modal-warn">🚑 {injured.map(p => p.n).join(', ')} está lesionado: ¡cámbialo!</p>}
        <div className="subs-cols">
          <div>
            <h4>En el campo (elige quién sale)</h4>
            <div className="pm-list">
              {onPitch(side).map(p => (
                <button key={p.id} className={`pm-player ${outP?.id === p.id ? 'sel' : ''} ${p.injured ? 'injured' : ''}`} onClick={() => setOutP(p)}>
                  <span className="pm-pos">{p.pos}</span>
                  <span className="pm-name">{p.n} {p.injured && '🚑'}</span>
                  <span className="pm-r">⚡{Math.round(p.stamina)}%</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4>Banquillo (elige quién entra)</h4>
            <div className="pm-list">
              {side.bench.filter(p => !p.off).map(p => (
                <button key={p.id} className={`pm-player ${!outP ? 'dim' : ''}`} disabled={!outP || side.subs <= 0} onClick={() => confirm(p)}>
                  <span className="pm-pos">{p.pos}</span>
                  <span className="pm-name">{p.n} {p.star && '★'}</span>
                  <span className="pm-r">{p.r}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}

export default function MatchLive({ homeTeam, awayTeam, userSide, userSetup, aiSquads, knockout, stadium, onFinish }) {
  const mRef = useRef(null)
  if (!mRef.current) {
    const homeSetup = userSide === 'home' ? userSetup : { squad: aiSquads.home }
    const awaySetup = userSide === 'away' ? userSetup : { squad: aiSquads.away }
    mRef.current = newMatch(homeTeam, awayTeam, homeSetup, awaySetup, { knockout, userSide, stadium })
  }
  const m = mRef.current

  const [, setN] = useState(0)
  const rerender = () => setN(n => n + 1)
  const [speed, setSpeed] = useState(1)
  const [showSubs, setShowSubs] = useState(false)
  const [pensDone, setPensDone] = useState(null)
  const feedRef = useRef(null)

  const over = isOver(m)
  const inPens = m.phase === 'PENS' && !pensDone
  const paused = speed === 0 || showSubs || over || inPens || ['HT', 'ETHT'].includes(m.phase) && speed === 0

  useEffect(() => {
    if (speed === 0 || showSubs || over || m.phase === 'PENS') return
    const id = setInterval(() => {
      const evts = tick(m)
      for (const e of evts) {
        if (['descanso', 'final', 'penales'].includes(e.type)) setSpeed(0)
        if (e.type === 'lesion' && e.side === userSide) { setSpeed(0); setShowSubs(true) }
      }
      rerender()
    }, 650 / speed)
    return () => clearInterval(id)
  }, [speed, showSubs, over, m.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0
  }, [m.events.length])

  const userTeamSide = m[userSide]
  const phaseLabel = {
    '1H': '1ª PARTE', HT: 'DESCANSO', '2H': '2ª PARTE', FT: 'FINAL',
    ET1: 'PRÓRROGA', ETHT: 'DESCANSO PRÓRROGA', ET2: 'PRÓRROGA', AET: 'FINAL PRÓRROGA', PENS: 'PENALTIS',
  }[m.phase]

  const goalscorers = side =>
    m[side].players.concat(m[side].bench).filter(p => p.goals > 0)
      .map(p => `${p.n.split(' ').slice(-1)[0]} ⚽${p.goals > 1 ? '×' + p.goals : ''}`).join(' · ')

  const finishNow = (pens = null) => onFinish(buildResult(m, pens))

  const events = useMemo(() => [...m.events].reverse(), [m.events.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="live">
      {/* Marcador */}
      <div className="scoreboard">
        <div className="sb-team">
          <span className="sb-flag">{homeTeam.flag}</span>
          <span className="sb-name">{homeTeam.name}</span>
          {userSide === 'home' && <span className="sb-you">TÚ</span>}
        </div>
        <div className="sb-center">
          <div className="sb-score">{m.score[0]} <span className="sb-dash">–</span> {m.score[1]}</div>
          <div className="sb-minute">{m.phase === 'HT' ? 'DESCANSO' : `${Math.min(m.minute, 120)}'`}</div>
          <div className="sb-phase">{phaseLabel}{knockout && ' · ELIMINATORIA'}</div>
        </div>
        <div className="sb-team right">
          {userSide === 'away' && <span className="sb-you">TÚ</span>}
          <span className="sb-name">{awayTeam.name}</span>
          <span className="sb-flag">{awayTeam.flag}</span>
        </div>
      </div>
      <div className="sb-scorers">
        <span>{goalscorers('home')}</span>
        <span className="sb-stadium">🏟️ {stadium}</span>
        <span>{goalscorers('away')}</span>
      </div>

      {/* Controles */}
      <div className="live-controls">
        {!over && !inPens && (
          <>
            <button className={`btn ${speed === 0 ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSpeed(speed === 0 ? 1 : 0)}>
              {speed === 0 ? '▶️ Reanudar' : '⏸️ Pausa'}
            </button>
            {[1, 2, 4].map(s => (
              <button key={s} className={`btn btn-ghost speed ${speed === s ? 'on' : ''}`} onClick={() => setSpeed(s)}>x{s}</button>
            ))}
            <button className="btn btn-ghost" onClick={() => { setSpeed(0); setShowSubs(true) }}>
              🔁 Cambios ({userTeamSide.subs})
            </button>
            <div className="tactic-group">
              <span className="tg-label" title="Mentalidad">Tác.</span>
              {Object.entries(TACTICS).map(([k, v]) => (
                <button
                  key={k}
                  className={`chip ${userTeamSide.tactic === k ? 'on' : ''}`}
                  title={`Mentalidad ${v.label.toLowerCase()}`}
                  onClick={() => { setTactic(m, userSide, k); rerender() }}
                >
                  {v.icon}
                </button>
              ))}
              <span className="tg-label" title="Presión">Pres.</span>
              {Object.entries(PRESSING).map(([k, v]) => (
                <button
                  key={k}
                  className={`chip ${userTeamSide.pressing === k ? 'on' : ''}`}
                  title={`Presión ${v.label.toLowerCase()}: ${k === 'alta' ? 'roba balones, agota y trae tarjetas' : k === 'baja' ? 'reserva energía, cede campo' : 'equilibrada'}`}
                  onClick={() => { setPressing(m, userSide, k); rerender() }}
                >
                  {v.icon}
                </button>
              ))}
            </div>
          </>
        )}
        {over && (
          <button className="btn btn-gold btn-big" onClick={() => finishNow()}>
            🏁 Continuar con el torneo
          </button>
        )}
      </div>

      <div className="live-grid">
        {/* Campo */}
        <div className="pitch">
          <div className="pitch-lines" aria-hidden="true">
            <div className="pl-circle" /><div className="pl-half" /><div className="pl-area top" /><div className="pl-area bottom" />
          </div>
          <PitchSide side={m.away} top color={awayTeam.colors[0]} />
          <PitchSide side={m.home} top={false} color={homeTeam.colors[0]} />
        </div>

        {/* Panel derecho: stats + eventos */}
        <div className="live-side">
          <div className="stats-box">
            <h4>📊 Estadísticas</h4>
            <div className="stat-row">
              <span>{m.home.stats.possession}%</span>
              <div className="stat-label">Posesión</div>
              <span>{m.away.stats.possession}%</span>
            </div>
            <div className="poss-bar">
              <i style={{ width: `${m.home.stats.possession}%`, background: homeTeam.colors[0] }} />
            </div>
            {[
              ['Tiros', 'shots'], ['A puerta', 'onTarget'], ['Faltas', 'fouls'],
            ].map(([lab, key]) => (
              <div className="stat-row" key={key}>
                <span>{m.home.stats[key]}</span>
                <div className="stat-label">{lab}</div>
                <span>{m.away.stats[key]}</span>
              </div>
            ))}
          </div>

          <div className="feed" ref={feedRef}>
            {events.map((e, i) => (
              <div className={`feed-item ${e.type} ${i === 0 ? 'new' : ''}`} key={events.length - i}>
                <span className="feed-min">{e.min}'</span>
                <span className="feed-icon">{EVENT_ICON[e.type] ?? '·'}</span>
                <span className="feed-text">{e.text}</span>
              </div>
            ))}
            {events.length === 0 && <div className="feed-item inicio"><span className="feed-text">Pulsa ▶️ para comenzar el partido…</span></div>}
          </div>
        </div>
      </div>

      {showSubs && <SubsModal m={m} sideKey={userSide} onClose={() => setShowSubs(false)} rerender={rerender} />}

      {inPens && (
        <Penalties
          m={m}
          onDone={pens => { setPensDone(pens); finishNow(pens) }}
        />
      )}
    </div>
  )
}
