import { useMemo, useState } from 'react'
import { FORMATIONS, assignFormation, effR } from '../data/squads.js'
import { TACTICS, PRESSING } from '../engine/match.js'
import { penaltyForSet, fitOf, SPEC_FULL } from '../data/positions.js'

const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }
const fitColor = fit => (fit >= 70 ? 'var(--green)' : fit >= 40 ? 'var(--gold)' : 'var(--red)')
const lastName = n => n.split(' ').slice(-1)[0]

// Charlas de vestuario: el tono ideal depende de si eres favorito o inferior.
const TALKS = {
  arenga: { icon: '📣', label: 'Arenga', desc: '«¡Salid a comeros el campo!»' },
  confianza: { icon: '🧊', label: 'Confianza', desc: '«Tranquilos, sabéis jugar a esto»' },
  foco: { icon: '🎯', label: 'Exigencia', desc: '«Máxima concentración, sin relajarse»' },
}
// Efecto de cada tono según el contexto (+rendimiento si aciertas)
function talkEffect(tone, role) {
  const table = {
    underdog: { arenga: 0.05, confianza: 0.02, foco: -0.015 },
    even: { confianza: 0.05, arenga: 0.025, foco: 0.025 },
    favorite: { foco: 0.05, confianza: 0.02, arenga: -0.01 },
  }
  return table[role][tone] ?? 0
}

export default function PreMatch({ team, opponent, squad, knockout, stadium, dateLabel, morale = 62, baseMoraleMod = 1, onStart, onBack }) {
  const available = useMemo(() => squad.filter(p => p.inj === 0 && p.sus === 0), [squad])
  const out = useMemo(() => squad.filter(p => p.inj !== 0 || p.sus > 0), [squad])
  const ratingGap = opponent.rating - team.rating
  const role = ratingGap >= 5 ? 'underdog' : ratingGap <= -5 ? 'favorite' : 'even'
  const [talk, setTalk] = useState(null)
  const talkMod = talk ? talkEffect(talk, role) : 0
  const finalMoraleMod = Math.max(0.9, Math.min(1.12, baseMoraleMod + talkMod))
  const [formation, setFormation] = useState('4-3-3')
  const [tactic, setTactic] = useState(role === 'underdog' ? 'cerrojo' : 'equilibrada')
  const [pressing, setPressing] = useState('media')
  const initial = useMemo(() => assignFormation(available, formation), [available, formation])
  const [xi, setXi] = useState(initial.xi)
  const [bench, setBench] = useState(initial.bench)
  const [sel, setSel] = useState(null) // { kind:'slot', i } | { kind:'bench', id }

  const applyLineup = (nxi, nbench) => { setXi(nxi); setBench(nbench); setSel(null) }

  const changeFormation = f => {
    setFormation(f)
    const { xi: nxi, bench: nbench } = assignFormation(available, f)
    applyLineup(nxi, nbench)
  }

  const autoLineup = () => {
    const { xi: nxi, bench: nbench } = assignFormation(available, formation)
    applyLineup(nxi, nbench)
  }

  const swapSlots = (i, j) => {
    const a = xi[i], b = xi[j]
    const nx = [...xi]
    nx[i] = { ...b, slotPos: a.slotPos, slotX: a.slotX, slotY: a.slotY, posPen: penaltyForSet(b.posSet, a.slotPos) }
    nx[j] = { ...a, slotPos: b.slotPos, slotX: b.slotX, slotY: b.slotY, posPen: penaltyForSet(a.posSet, b.slotPos) }
    setXi(nx)
  }

  const subIn = (benchId, i) => {
    const bp = bench.find(p => p.id === benchId)
    if (!bp) return
    const { slotPos, slotX, slotY } = xi[i]
    const { posPen, ...oldCore } = xi[i]
    const nx = [...xi]
    nx[i] = { ...bp, slotPos, slotX, slotY, posPen: penaltyForSet(bp.posSet, slotPos) }
    setXi(nx)
    setBench(bench.filter(p => p.id !== benchId).concat(stripSlot(oldCore)))
  }

  const stripSlot = p => { const { slotPos, slotX, slotY, ...rest } = p; return rest }

  const clickSlot = i => {
    if (!sel) return setSel({ kind: 'slot', i })
    if (sel.kind === 'slot') { if (sel.i === i) setSel(null); else { swapSlots(sel.i, i); setSel(null) } }
    else { subIn(sel.id, i); setSel(null) }
  }
  const clickBench = p => {
    if (sel?.kind === 'slot') { subIn(p.id, sel.i); setSel(null) }
    else if (sel?.kind === 'bench' && sel.id === p.id) setSel(null)
    else setSel({ kind: 'bench', id: p.id })
  }

  const xiEffAvg = Math.round(xi.reduce((s, p) => s + effR(p), 0) / Math.max(1, xi.length))
  const xiFit = Math.round(xi.reduce((s, p) => s + p.fit, 0) / Math.max(1, xi.length))
  const misfits = xi.filter(p => p.posPen > 0).length

  return (
    <div className="prematch">
      <button className="btn btn-ghost back-btn" onClick={onBack}>← Volver al torneo</button>

      <div className="pm-header">
        <h1 className="page-title">
          {team.flag} {team.name} <span className="vs">VS</span> {opponent.flag} {opponent.name}
        </h1>
        <p className="page-sub">
          {knockout ? '⚡ Eliminatoria directa' : 'Fase de grupos'} · 🏟️ {stadium}{dateLabel ? ` · 📅 ${dateLabel}` : ''}
        </p>
      </div>

      {role === 'underdog' && (
        <div className="pm-tip">
          🐲 <b>Eres claramente inferior sobre el papel.</b> El plan <b>🚌 Muro y contra</b> y una buena <b>arenga</b> son tu mejor vía para dar la campanada y llevarlos a los penaltis.
        </div>
      )}

      <div className="pm-grid2">
        {/* Ajustes */}
        <div className="pm-col">
          <h3 className="pm-title">Charla de vestuario</h3>
          <div className="chips">
            {Object.entries(TALKS).map(([k, v]) => {
              const eff = talkEffect(k, role)
              return (
                <button key={k} className={`chip ${talk === k ? 'on' : ''}`} onClick={() => setTalk(talk === k ? null : k)} title={v.desc}>
                  {v.icon} {v.label}
                </button>
              )
            })}
          </div>
          {talk && (
            <p className={`talk-fx ${talkMod > 0.03 ? 'good' : talkMod > 0 ? 'ok' : 'bad'}`}>
              {TALKS[talk].desc} — {talkMod > 0.03 ? '🔥 el equipo salta enchufado' : talkMod > 0 ? '👍 buen ambiente' : '😬 no era el mensaje, se tensan'}
              {` (${talkMod >= 0 ? '+' : ''}${Math.round(talkMod * 100)}% rendimiento)`}
            </p>
          )}

          <h3 className="pm-title">Formación</h3>
          <div className="chips">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} className={`chip ${formation === f ? 'on' : ''}`} onClick={() => changeFormation(f)}>{f}</button>
            ))}
          </div>

          <h3 className="pm-title">Mentalidad</h3>
          <div className="chips">
            {Object.entries(TACTICS).map(([k, v]) => (
              <button key={k} className={`chip ${tactic === k ? 'on' : ''} ${k === 'cerrojo' ? 'chip-bus' : ''}`} onClick={() => setTactic(k)} title={k === 'cerrojo' ? 'Te atrincheras y sales a la contra: concedes pocas ocasiones (más aún contra rivales fuertes) y las tuyas son letales. Ideal para llevar a un grande a los penaltis.' : ''}>{v.icon} {v.label}</button>
            ))}
          </div>

          <h3 className="pm-title">Presión</h3>
          <div className="chips">
            {Object.entries(PRESSING).map(([k, v]) => (
              <button key={k} className={`chip ${pressing === k ? 'on' : ''}`} onClick={() => setPressing(k)} title="La presión alta roba balones pero agota y trae tarjetas">{v.icon} {v.label}</button>
            ))}
          </div>

          <div className="pm-meta">
            <div className="pm-meta-box">
              <div className="pm-meta-num">{xiEffAvg}</div>
              <div className="pm-meta-lab">media efectiva</div>
            </div>
            <div className="pm-meta-box">
              <div className="pm-meta-num" style={{ color: fitColor(xiFit) }}>{xiFit}%</div>
              <div className="pm-meta-lab">energía del XI</div>
            </div>
            <div className="pm-meta-box">
              <div className="pm-meta-num" style={{ color: misfits ? 'var(--red)' : 'var(--text)' }}>{misfits}</div>
              <div className="pm-meta-lab">fuera de sitio</div>
            </div>
          </div>

          {misfits > 0 && <p className="pm-warn">⚠️ {misfits} jugador{misfits > 1 ? 'es' : ''} fuera de su demarcación: rendirán por debajo de su media en este partido.</p>}

          {out.length > 0 && (
            <div className="pm-out">
              <h3 className="pm-title">🏥 Bajas</h3>
              {out.map(p => (
                <div className="pm-out-row" key={p.id}>
                  <span>{p.n}</span>
                  <span className="pm-out-why">{p.inj === -1 ? '🚑 todo el torneo' : p.inj > 0 ? `🤕 ${p.inj} part.` : `🟥 sanción (${p.sus})`}</span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-ghost pm-auto" onClick={autoLineup}>✨ Alineación automática</button>
          <button className="btn btn-primary btn-big pm-start" onClick={() => onStart({ formation, tactic, pressing, xi, bench, moraleMod: finalMoraleMod })}>⚽ ¡Al campo!</button>
          <p className="pm-hint">💡 Toca dos jugadores del campo para intercambiarlos, o un titular y luego un suplente para sustituirlo. Muchos jugadores pueden actuar en varias demarcaciones sin penalización (mira su ficha). El color del borde indica si juega en su sitio.</p>
        </div>

        {/* Campo con la formación */}
        <div className="pm-pitch-col">
          <div className="pm-formation-label">{formation} · toca para mover jugadores</div>
          <div className="pm-pitch">
            <div className="pitch-lines" aria-hidden="true">
              <div className="pl-circle" /><div className="pl-half" /><div className="pl-area top" /><div className="pl-area bottom" />
            </div>
            {xi.map((p, i) => {
              const fit = fitOf(p.posPen)
              const selected = sel?.kind === 'slot' && sel.i === i
              return (
                <button
                  key={p.id}
                  className={`slot fit-${fit.key} ${selected ? 'sel' : ''}`}
                  style={{ left: `${p.slotX}%`, top: `${p.slotY}%`, '--pc': POS_COLOR[p.pos] }}
                  onClick={() => clickSlot(i)}
                  title={`${p.n} — posiciones: ${p.posSet.join(', ')}${p.posPen > 0 ? ` · jugando de ${p.slotPos} (-${p.posPen})` : ` · juega de ${p.slotPos} ✓`} · energía ${Math.round(p.fit)}%`}
                >
                  <span className="slot-tag">{p.slotPos}</span>
                  <span className="slot-num">{p.num}</span>
                  <span className="slot-name">{lastName(p.n)}{p.star && ' ★'}</span>
                  <span className="slot-foot">
                    <b className="slot-r">{effR(p)}{p.posPen > 0 && <em className="slot-pen">-{p.posPen}</em>}</b>
                    <i className="slot-fit"><s style={{ width: `${p.fit}%`, background: fitColor(p.fit) }} /></i>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="pm-legend">
            <span><i className="lg ok" /> En su posición</span>
            <span><i className="lg adapt" /> Adaptado</span>
            <span><i className="lg warn" /> Improvisado</span>
            <span><i className="lg bad" /> Fuera de sitio</span>
          </div>
        </div>

        {/* Banquillo */}
        <div className="pm-col">
          <h3 className="pm-title">Banquillo</h3>
          <div className="pm-list">
            {bench.map(p => (
              <button
                key={p.id}
                className={`pm-player ${sel?.kind === 'bench' && sel.id === p.id ? 'sel' : ''} ${sel?.kind === 'slot' ? 'pulse-target' : ''}`}
                onClick={() => clickBench(p)}
              >
                <span className="pm-pos" style={{ background: POS_COLOR[p.pos] }}>{p.npos}</span>
                <span className="pm-num">#{p.num}</span>
                <span className="pm-name">{p.n} {p.star && '★'}</span>
                <span className="pm-fit" title={`Energía ${Math.round(p.fit)}%`}>
                  <i className="fit-bar"><b style={{ width: `${p.fit}%`, background: fitColor(p.fit) }} /></i>{Math.round(p.fit)}
                </span>
                <span className="pm-r">{p.r}{p.dev > 0 && <em className="dev-up">▲</em>}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
