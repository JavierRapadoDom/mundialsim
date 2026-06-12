import { useEffect, useRef, useState } from 'react'

// Tanda de penaltis interactiva: el usuario elige dónde tira y hacia dónde
// se lanza su portero. La IA decide al azar (ponderado por calidad).

const DIRS = ['L', 'C', 'R']
const DIR_LABEL = { L: '↖️ Izquierda', C: '⬆️ Centro', R: '↗️ Derecha' }

const onPitch = side => side.players.filter(p => !p.off)
const keeperOf = side => onPitch(side).find(p => p.pos === 'POR')
const takersOf = side => onPitch(side).filter(p => p.pos !== 'POR').sort((a, b) => b.r - a.r)

function resolveKick(dir, dive, taker, gk) {
  if (Math.random() < 0.07) return 'miss' // a las nubes
  if (dive === dir) {
    const saveP = Math.max(0.35, Math.min(0.78, 0.58 + ((gk?.r ?? 70) - taker.r) * 0.005))
    if (Math.random() < saveP) return 'save'
  }
  return 'goal'
}

function decided(kicks) {
  const score = s => kicks.filter(k => k.side === s && k.result === 'goal').length
  const count = s => kicks.filter(k => k.side === s).length
  const sH = score('home'), sA = score('away'), cH = count('home'), cA = count('away')
  if (cH <= 5 && cA <= 5) {
    const remH = 5 - cH, remA = 5 - cA
    if (sH > sA + remA || sA > sH + remH) return true
  }
  if (cH >= 5 && cA >= 5 && cH === cA && sH !== sA) return true
  return false
}

export default function Penalties({ m, onDone }) {
  const [kicks, setKicks] = useState([])
  const [flash, setFlash] = useState(null) // último resultado mostrado
  const [waiting, setWaiting] = useState(false)
  const doneRef = useRef(false)

  const score = s => kicks.filter(k => k.side === s && k.result === 'goal').length
  const count = s => kicks.filter(k => k.side === s).length
  const nextSide = count('home') === count('away') ? 'home' : 'away'
  const userKicks = nextSide === m.userSide
  const isDone = decided(kicks)

  const taker = side => {
    const list = takersOf(m[side])
    return list[count(side) % list.length]
  }

  const registerKick = (dir, dive) => {
    const side = nextSide
    const t = taker(side)
    const gk = keeperOf(m[side === 'home' ? 'away' : 'home'])
    const result = resolveKick(dir, dive, t, gk)
    setFlash({ side, result, taker: t, gk })
    setWaiting(true)
    setTimeout(() => {
      setKicks(ks => [...ks, { side, result, taker: t.n }])
      setFlash(null)
      setWaiting(false)
    }, 1400)
  }

  const userShoot = dir => {
    const dive = DIRS[Math.floor(Math.random() * 3)]
    registerKick(dir, dive)
  }

  const userDive = dive => {
    const dir = DIRS[Math.floor(Math.random() * 3)]
    registerKick(dir, dive)
  }

  // La IA tira sola contra la IA no existe aquí (el usuario siempre participa
  // de un lado), pero si el usuario es portero esperamos su elección.

  useEffect(() => {
    if (isDone && !doneRef.current) {
      doneRef.current = true
      setTimeout(() => onDone([score('home'), score('away')]), 1600)
    }
  }, [isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  const Dots = ({ side }) => {
    const sideKicks = kicks.filter(k => k.side === side)
    const total = Math.max(5, sideKicks.length)
    return (
      <div className="pen-dots">
        {Array.from({ length: total }).map((_, i) => {
          const k = sideKicks[i]
          return <span key={i} className={`pen-dot ${k ? (k.result === 'goal' ? 'goal' : 'fail') : ''}`}>{k ? (k.result === 'goal' ? '⚽' : '❌') : '·'}</span>
        })}
      </div>
    )
  }

  return (
    <div className="pens-overlay">
      <div className="pens-panel">
        <h2 className="pens-title">🥅 TANDA DE PENALTIS</h2>

        <div className="pens-score">
          <div className={`pens-team ${nextSide === 'home' ? 'turn' : ''}`}>
            <span className="pens-flag">{m.home.team.flag}</span> {m.home.team.code}
            <div className="pens-num">{score('home')}</div>
            <Dots side="home" />
          </div>
          <div className="pens-sep">—</div>
          <div className={`pens-team ${nextSide === 'away' ? 'turn' : ''}`}>
            <span className="pens-flag">{m.away.team.flag}</span> {m.away.team.code}
            <div className="pens-num">{score('away')}</div>
            <Dots side="away" />
          </div>
        </div>

        {flash && (
          <div className={`pen-flash ${flash.result}`}>
            {flash.result === 'goal' && `⚽ ¡GOL de ${flash.taker.n}!`}
            {flash.result === 'save' && `🧤 ¡${flash.gk?.n ?? 'El portero'} LO PARA!`}
            {flash.result === 'miss' && `💨 ¡${flash.taker.n} la manda fuera!`}
          </div>
        )}

        {!flash && !isDone && !waiting && (
          <div className="pen-action">
            {userKicks ? (
              <>
                <p className="pen-q">⚽ Tira <b>{taker(nextSide).n}</b> — ¿Dónde colocas el balón?</p>
                <div className="pen-btns">
                  {DIRS.map(d => (
                    <button key={d} className="btn btn-primary" onClick={() => userShoot(d)}>{DIR_LABEL[d]}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="pen-q">🧤 Tira <b>{taker(nextSide).n}</b> — ¿Hacia dónde se lanza tu portero?</p>
                <div className="pen-btns">
                  {DIRS.map(d => (
                    <button key={d} className="btn btn-gold" onClick={() => userDive(d)}>{DIR_LABEL[d]}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {isDone && (
          <div className="pen-flash goal">
            🏁 ¡Final de la tanda! {score('home') > score('away') ? m.home.team.name : m.away.team.name} avanza
          </div>
        )}
      </div>
    </div>
  )
}
