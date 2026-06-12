// Convocatorias oficiales del Mundial 2026: los 26 jugadores reales de cada
// selección salen de realSquads.js. La valoración de cada jugador es la de su
// ficha de figura (teams.js) o, si no, se deriva de forma determinista de la
// fuerza del equipo y su experiencia internacional.

import { REAL_SQUADS } from './realSquads.js'
import { posSetFor, FORMATION_SLOTS, penaltyForSet } from './positions.js'

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

  // Demarcaciones: posSet = todas las posiciones que puede ocupar sin
  // penalización (real para figuras, inferida para el resto). npos = principal.
  const lineIdx = { POR: 0, DEF: 0, MED: 0, DEL: 0 }
  for (const p of squad) {
    const idx = lineIdx[p.pos]++
    p.posSet = posSetFor(p.n, p.pos, idx)
    p.npos = p.posSet[0]
  }

  cache[team.id] = squad
  return squad
}

export const coachOf = teamId => REAL_SQUADS[teamId]?.coach ?? null

export const FORMATIONS = {
  '4-3-3': { DEF: 4, MED: 3, DEL: 3 },
  '4-4-2': { DEF: 4, MED: 4, DEL: 2 },
  '4-2-3-1': { DEF: 4, MED: 5, DEL: 1 },
  '4-1-4-1': { DEF: 4, MED: 5, DEL: 1 },
  '4-4-2 ◇': { DEF: 4, MED: 4, DEL: 2 },
  '3-5-2': { DEF: 3, MED: 5, DEL: 2 },
  '3-4-3': { DEF: 3, MED: 4, DEL: 3 },
  '3-4-1-2': { DEF: 3, MED: 5, DEL: 2 },
  '5-3-2': { DEF: 5, MED: 3, DEL: 2 },
  '5-4-1': { DEF: 5, MED: 4, DEL: 1 },
}

// Peso por frescura: un suplente fresco puede ganarle el puesto a un titular
// fundido (solo cuando los jugadores traen estado de torneo).
const fitW = p => (p.fit != null ? 0.85 + 0.15 * (p.fit / 100) : 1)

// Coloca a los 11 mejores en las casillas de la formación maximizando la suma
// de medias EFECTIVAS (media − penalización posicional) y la frescura. Como
// honra el conjunto de posiciones de cada jugador, un polivalente como Messi
// puede ir de MCO o de ED sin penalización. Cada titular sale con su casilla
// (slotPos/slotX/slotY) y su penalización para el partido (posPen).
export function assignFormation(squad, formation = '4-3-3') {
  const slots = FORMATION_SLOTS[formation] ?? FORMATION_SLOTS['4-3-3']
  const players = squad.filter(Boolean)

  // Asignación voraz global: ordena todas las parejas (casilla, jugador) por
  // valor efectivo y va fijando las mejores que no choquen.
  // Al valorar cada pareja, la penalización pesa más (×2.2) que en el partido
  // real para que el once automático prefiera a un jugador en su sitio antes
  // que a otro algo mejor pero improvisado. La penalización aplicada al partido
  // sigue siendo la real (pr.pen).
  const pairs = []
  for (let si = 0; si < slots.length; si++) {
    for (const p of players) {
      const pen = penaltyForSet(p.posSet, slots[si].pos)
      pairs.push({ si, p, pen, val: (p.r - pen * 2.2) * fitW(p) })
    }
  }
  pairs.sort((a, b) => b.val - a.val)

  const assigned = new Array(slots.length)
  const used = new Set()
  let filled = 0
  for (const pr of pairs) {
    if (filled === slots.length) break
    if (assigned[pr.si] || used.has(pr.p.id)) continue
    const s = slots[pr.si]
    assigned[pr.si] = { ...pr.p, slotPos: s.pos, slotX: s.x, slotY: s.y, posPen: pr.pen }
    used.add(pr.p.id)
    filled++
  }

  const bench = players.filter(p => !used.has(p.id)).sort((a, b) => b.r - a.r)
  return { xi: assigned.filter(Boolean), bench }
}

// Mejor XI por líneas (lo usa el resto del código que aún lo importe)
export function bestXI(squad, formation = '4-3-3') {
  const { xi, bench } = assignFormation(squad, formation)
  return { xi, bench }
}

// Media efectiva (descontando penalización posicional)
export const effR = p => p.r - (p.posPen ?? 0)

export const avgRating = players =>
  players.length ? Math.round(players.reduce((s, p) => s + p.r, 0) / players.length) : 0
