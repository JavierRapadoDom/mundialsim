// Convocatorias oficiales del Mundial 2026: los 26 jugadores reales de cada
// selección salen de realSquads.js. La valoración de cada jugador es la de su
// ficha de figura (teams.js) o, si no, se deriva de forma determinista de la
// fuerza del equipo y su experiencia internacional.

import { REAL_SQUADS } from './realSquads.js'
import { NATURAL_POS, inferSpecific, FORMATION_SLOTS, SPEC_LINE, posPenalty } from './positions.js'

const POS_MAP = { GK: 'POR', DF: 'DEF', MF: 'MED', FW: 'DEL' }
const POS_ORDER = { POR: 0, DEF: 1, MED: 2, DEL: 3 }

function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const cache = {}

export function getSquad(team) {
  if (cache[team.id]) return cache[team.id]
  const data = REAL_SQUADS[team.id]
  const stars = team.stars ?? {}
  const minStar = Math.min(...Object.values(stars), team.rating)

  const squad = data.players.map(([num, pos, n, age, caps, club, cap]) => {
    const starR = stars[n]
    let r
    if (starR != null) {
      r = starR
    } else {
      // Determinista: fuerza del equipo + veteranía (caps) + variación por nombre
      const capsBonus = Math.min(6, Math.floor(caps / 12))
      const variance = hashStr(team.id + n) % 5
      r = Math.max(57, Math.min(minStar - 1, team.rating - 13 + capsBonus + variance))
    }
    return {
      id: `${team.id}-${num}`,
      n,
      pos: POS_MAP[pos],
      club,
      r,
      age,
      caps,
      num,
      star: starR != null,
      captain: !!cap,
    }
  })

  squad.sort((a, b) => POS_ORDER[a.pos] - POS_ORDER[b.pos] || b.r - a.r)

  // Demarcación natural: real para las figuras, inferida (determinista) para el
  // resto repartiendo roles realistas dentro de cada línea.
  const lineIdx = { POR: 0, DEF: 0, MED: 0, DEL: 0 }
  for (const p of squad) {
    p.npos = NATURAL_POS[p.n] ?? inferSpecific(p.pos, lineIdx[p.pos]++)
  }

  cache[team.id] = squad
  return squad
}

export const coachOf = teamId => REAL_SQUADS[teamId]?.coach ?? null

export const FORMATIONS = {
  '4-3-3': { DEF: 4, MED: 3, DEL: 3 },
  '4-4-2': { DEF: 4, MED: 4, DEL: 2 },
  '4-2-3-1': { DEF: 4, MED: 5, DEL: 1 },
  '3-5-2': { DEF: 3, MED: 5, DEL: 2 },
  '5-3-2': { DEF: 5, MED: 3, DEL: 2 },
}

// Mejor XI posible para una formación dada. Si los jugadores traen estado de
// torneo (fit), pesa la frescura: un suplente fresco puede ganarle el puesto
// a un titular fundido.
const xiScore = p => p.r * (p.fit != null ? 0.85 + 0.15 * (p.fit / 100) : 1)

export function bestXI(squad, formation = '4-3-3') {
  const shape = { POR: 1, ...FORMATIONS[formation] }
  const xi = []
  for (const pos of ['POR', 'DEF', 'MED', 'DEL']) {
    const players = squad.filter(p => p.pos === pos).sort((a, b) => xiScore(b) - xiScore(a))
    xi.push(...players.slice(0, shape[pos]))
  }
  const bench = squad.filter(p => !xi.includes(p))
  return { xi, bench }
}

// Coloca el mejor XI en las casillas de la formación, minimizando las
// penalizaciones posicionales. Cada titular sale con su casilla (slotPos,
// slotX, slotY) y su penalización para el partido (posPen).
export function assignFormation(squad, formation = '4-3-3') {
  const { xi, bench } = bestXI(squad, formation)
  const slots = (FORMATION_SLOTS[formation] ?? FORMATION_SLOTS['4-3-3']).map((s, idx) => ({ ...s, idx }))

  const place = (slot, p) => { assigned[slot.idx] = { ...p, slotPos: slot.pos, slotX: slot.x, slotY: slot.y, posPen: posPenalty(p.npos, slot.pos) } }
  const assigned = new Array(slots.length)
  const pool = new Set(xi)

  // 1) Reparto por líneas, minimizando penalización dentro de cada línea
  const byLine = { POR: [], DEF: [], MED: [], DEL: [] }
  for (const s of slots) byLine[SPEC_LINE[s.pos]].push(s)
  for (const line of ['POR', 'DEF', 'MED', 'DEL']) {
    const players = xi.filter(p => p.pos === line && pool.has(p))
    for (const slot of byLine[line]) {
      let best = null, bestScore = Infinity
      for (const p of players) {
        if (!pool.has(p)) continue
        const score = posPenalty(p.npos, slot.pos) * 100 - p.r
        if (score < bestScore) { bestScore = score; best = p }
      }
      if (best) { place(slot, best); pool.delete(best) }
    }
  }

  // 2) Rellena casillas que quedaron vacías (líneas con menos jugadores que
  // casillas, p. ej. por bajas) con el mejor jugador disponible que quede.
  for (const slot of slots) {
    if (assigned[slot.idx]) continue
    let best = null, bestScore = Infinity
    for (const p of pool) {
      const score = posPenalty(p.npos, slot.pos) * 100 - p.r
      if (score < bestScore) { bestScore = score; best = p }
    }
    if (best) { place(slot, best); pool.delete(best) }
  }

  return { xi: assigned.filter(Boolean), bench }
}

// Media efectiva (descontando penalización posicional)
export const effR = p => p.r - (p.posPen ?? 0)

export const avgRating = players =>
  players.length ? Math.round(players.reduce((s, p) => s + p.r, 0) / players.length) : 0
