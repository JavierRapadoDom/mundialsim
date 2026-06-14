import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { newMatch, tick, doSub, setTactic, setPressing, applyHalftimeTalk, rollTalk, TALK_DELTA, TALK_REACTION, isOver, TACTICS, PRESSING } from '../engine/match.js'
import { penaltyForSet } from '../data/positions.js'
import Penalties from './Penalties.jsx'

// Opciones de charla del descanso según el marcador. tier: 2 idónea, 1 ok, 0 mal.
function htOptions(diff) {
  if (diff < 0) return [
    { icon: '🔥', label: '«¡Creed, esto no ha acabado!»', tier: 2 },
    { icon: '😤', label: '«¡Más intensidad o fuera!»', tier: 1 },
    { icon: '🧊', label: '«Calma, sin volverse locos»', tier: 0 },
  ]
  if (diff === 0) return [
    { icon: '⚡', label: '«Un golpe más y cae»', tier: 2 },
    { icon: '🎯', label: '«Orden y paciencia»', tier: 1 },
    { icon: '🧊', label: '«Tranquilos, ya llegará»', tier: 0 },
  ]
  return [
    { icon: '🎯', label: '«Concentración hasta el final»', tier: 2 },
    { icon: '⚔️', label: '«A por el segundo»', tier: 1 },
    { icon: '😌', label: '«Está hecho, a especular»', tier: 0 },
  ]
}

function HalftimeTalk({ m, sideKey, onDone }) {
  const idx = sideKey === 'home' ? 0 : 1
  const diff = m.score[idx] - m.score[1 - idx]
  const opts = htOptions(diff)
  const situ = diff < 0 ? 'Vais por detrás' : diff === 0 ? 'Todo en tablas' : 'Vais por delante'
  const [result, setResult] = useState(null) // { delta, outcome }

  const choose = tier => {
    const outcome = rollTalk(tier)
    setResult({ outcome, delta: TALK_DELTA[outcome] })
  }

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal ht-modal">
        <h3 className="modal-title">🗣️ Charla del descanso</h3>
        {!result ? (
          <>
            <p className="subs-help">{situ} ({m.score[0]}–{m.score[1]}). ¿Qué les dices? Elige el tono… pero cómo reaccionen no depende solo de ti.</p>
            <div className="ht-opts">
              {opts.map((o, i) => (
                <button key={i} className="ht-opt" onClick={() => choose(o.tier)}>
                  <span className="ht-icon">{o.icon}</span>
                  <span className="ht-label">{o.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (() => {
          const r = TALK_REACTION[result.outcome]
          const cls = result.delta > 0.03 ? 'good' : result.delta > 0 ? 'ok' : result.delta === 0 ? 'flat' : 'bad'
          return (
            <div className="ht-result">
              <div className={`ht-reaction ${cls}`}>
                <div className="ht-reaction-icon">{r.icon}</div>
                <div className="ht-reaction-text">{r.text}</div>
                <div className="ht-reaction-eff">{result.delta >= 0 ? '+' : ''}{Math.round(result.delta * 100)}% rendimiento en la 2ª parte</div>
              </div>
              <button className="btn btn-primary btn-big" onClick={() => onDone(result.delta)}>▶️ Salir a la 2ª parte</button>
            </div>
          )
        })()}
      </div>
    </div>,
    document.body
  )
}

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
            <div className="pitch-player" key={p.id} title={`${p.n} · ${p.r} · energía ${Math.round(p.stamina)}%${p.id === side.talismanId ? ' · ⭐ talismán' : ''}${p.superSub ? ' · 🔥 revulsivo' : ''}`}>
              <span className="pp-dot" style={{ background: color }}>
                {p.num}
                {p.yc > 0 && <i className="pp-yc" />}
                {p.id === side.talismanId && <i className="pp-badge pp-tal">⭐</i>}
                {p.superSub && <i className="pp-badge pp-super">🔥</i>}
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

const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }
const stamColor = s => (s >= 60 ? 'var(--green)' : s >= 35 ? 'var(--gold)' : 'var(--red)')

function SubRow({ p, onClick, selected, disabled, dim, isBench, slotPos, talisman }) {
  // Penalización si este suplente entrara en la casilla del que sale
  const pen = isBench && slotPos ? penaltyForSet(p.posSet, slotPos) : 0
  return (
    <button className={`sub-row ${selected ? 'sel' : ''} ${dim ? 'dim' : ''} ${p.injured ? 'injured' : ''} ${talisman ? 'talisman' : ''}`} disabled={disabled} onClick={onClick}>
      <span className="sub-pos" style={{ background: POS_COLOR[p.pos] }}>{p.npos}</span>
      <span className="sub-main">
        <span className="sub-name">{p.n} {talisman && <em title="Talismán">⭐</em>}{p.star && <em className="star-mini">★</em>}{p.captain && <em className="cap-badge">Ⓒ</em>}{p.superSub && <em title="Revulsivo"> 🔥</em>}{p.injured && ' 🚑'}</span>
        <span className="sub-meta">
          #{p.num} · {p.age} años
          {p.goals > 0 && <em className="sub-goal"> · ⚽{p.goals}</em>}
          {p.assists > 0 && <em> · 🅰️{p.assists}</em>}
          {p.yc > 0 && <em className="sub-yc"> · 🟨</em>}
          {isBench && pen > 0 && <em className="sub-pen"> · de {slotPos}: -{pen}</em>}
        </span>
      </span>
      <span className="sub-right">
        <b className="sub-r">{p.r}</b>
        <span className="sub-stam" title={`Energía ${Math.round(p.stamina)}%`}>
          <i><s style={{ width: `${p.stamina}%`, background: stamColor(p.stamina) }} /></i>
          <em>{Math.round(p.stamina)}%</em>
        </span>
      </span>
    </button>
  )
}

function SubsModal({ m, sideKey, onClose, rerender }) {
  const side = m[sideKey]
  const [outP, setOutP] = useState(null)
  const injured = onPitch(side).filter(p => p.injured)

  const confirm = inP => {
    if (!outP) return
    if (doSub(m, sideKey, outP.id, inP.id)) { setOutP(null); rerender() }
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">🔁 Sustituciones — quedan {side.subs}</h3>
        {injured.length > 0 && <p className="modal-warn">🚑 {injured.map(p => p.n).join(', ')} está lesionado: ¡cámbialo antes de que juegues con uno menos!</p>}
        <p className="subs-help">Elige quién sale y después quién entra. Verás media, energía, goles y tarjetas de cada uno.</p>
        <div className="subs-cols">
          <div>
            <h4>⬇️ En el campo {outP && <span className="subs-pick">— sale {outP.n.split(' ').slice(-1)[0]}</span>}</h4>
            <div className="pm-list">
              {onPitch(side).map(p => (
                <SubRow key={p.id} p={p} talisman={p.id === side.talismanId} selected={outP?.id === p.id} onClick={() => setOutP(p)} />
              ))}
            </div>
          </div>
          <div>
            <h4>⬆️ Banquillo {outP && `(entra en ${outP.slotPos})`}</h4>
            <div className="pm-list">
              {side.bench.filter(p => !p.off).map(p => (
                <SubRow key={p.id} p={p} isBench slotPos={outP?.slotPos} dim={!outP} disabled={!outP || side.subs <= 0} onClick={() => confirm(p)} />
              ))}
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
      </div>
    </div>,
    document.body
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

      {m.phase === 'HT' && !userTeamSide.htTalk && !showSubs && (
        <HalftimeTalk m={m} sideKey={userSide} onDone={delta => { applyHalftimeTalk(m, userSide, delta); rerender() }} />
      )}

      {inPens && (
        <Penalties
          m={m}
          onDone={pens => { setPensDone(pens); finishNow(pens) }}
        />
      )}
    </div>
  )
}
