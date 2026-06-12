// Convocatorias oficiales del Mundial 2026: los 26 jugadores reales de cada
// selección salen de realSquads.js. La valoración de cada jugador es la de su
// ficha de figura (teams.js) o, si no, se deriva de forma determinista de la
// fuerza del equipo y su experiencia internacional.

import { REAL_SQUADS } from './realSquads.js'

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

export const avgRating = players =>
  players.length ? Math.round(players.reduce((s, p) => s + p.r, 0) / players.length) : 0
