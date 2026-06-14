// Lógica del torneo: fase de grupos (12 grupos de 4, pasan los 2 primeros y
// los 8 mejores terceros), dieciseisavos, octavos, cuartos, semis y final.

import { TEAMS, TEAM_BY_ID, GROUPS, groupTeams, STADIUMS, FINAL_STADIUM } from '../data/teams.js'
import { getSquad } from '../data/squads.js'
import { quickSim, minutesOf, roleMods } from './match.js'
import { groupDate, koDate, restDaysFor } from '../data/calendar.js'

export const STAGES = ['groups', 'R32', 'R16', 'QF', 'SF', 'F', 'done']
export const STAGE_LABEL = {
  groups: 'Fase de grupos', R32: 'Dieciseisavos de final', R16: 'Octavos de final',
  QF: 'Cuartos de final', SF: 'Semifinales', F: 'Gran Final', done: 'Torneo finalizado',
}

const stadiumFor = i => STADIUMS[i % STADIUMS.length]

export function newTournament(userTeamId) {
  // Calendario de grupos: J1 (1v2, 3v4), J2 (1v3, 4v2), J3 (4v1, 2v3)
  const fixtures = []
  let si = 0
  for (let round = 1; round <= 3; round++) {
    for (const g of GROUPS) {
      const [a, b, c, d] = groupTeams(g).map(t => t.id)
      const pairs = round === 1 ? [[a, b], [c, d]] : round === 2 ? [[a, c], [d, b]] : [[d, a], [b, c]]
      for (const [h, w] of pairs) {
        fixtures.push({ id: `G${g}R${round}-${h}`, group: g, round, home: h, away: w, played: false, score: null, scorers: null, stadium: stadiumFor(si++), date: groupDate(g, round) })
      }
    }
  }
  return {
    userTeamId,
    stage: 'groups',
    round: 1, // jornada actual de grupos
    fixtures, // partidos de grupos
    bracket: { R32: [], R16: [], QF: [], SF: [], F: [] },
    champion: null,
    userAlive: true,
    userEliminatedAt: null,
    pstate: {}, // estado vivo de cada jugador del torneo (fatiga, progresión, lesiones, stats)
    news: [], // parte médico y noticias del torneo
    morale: 62, // moral del equipo del usuario (15-100): sube/baja con los resultados
    legend: null, // leyenda añadida a la plantilla del usuario (si la ruleta lo concede)
    legendPhase: 'roulette', // roulette → pick → done
    roles: {}, // { playerId: { intensity, role } } configurado por el usuario
  }
}

// ───────── Moral del equipo del usuario ─────────
// La moral alta levanta el rendimiento del equipo (clave para que un modesto
// con buena racha pueda dar la campanada). Se modela en el partido vía moraleMod.
export const moraleMod = morale => Math.max(0.95, Math.min(1.07, 1 + ((morale ?? 62) - 60) * 0.0013))

export function moraleLabel(m) {
  return m >= 85 ? 'Eufórica' : m >= 70 ? 'Alta' : m >= 50 ? 'Normal' : m >= 32 ? 'Baja' : 'Hundida'
}

// Actualiza la moral tras el partido del usuario, según el resultado y si era
// favorito o no (ganar a un grande dispara la moral; perder ante un inferior la hunde).
export function updateUserMorale(t, f) {
  const isHome = f.home === t.userTeamId
  const oppId = isHome ? f.away : f.home
  const myR = TEAM_BY_ID[t.userTeamId].rating, oppR = TEAM_BY_ID[oppId].rating
  const my = f.score[isHome ? 0 : 1], opp = f.score[isHome ? 1 : 0]
  let res
  if (my > opp) res = 'W'
  else if (my < opp) res = 'L'
  else if (f.pens) res = (isHome ? f.pens[0] > f.pens[1] : f.pens[1] > f.pens[0]) ? 'W' : 'L'
  else res = 'D'
  const underdog = oppR - myR >= 5, favorite = myR - oppR >= 5
  let delta
  if (res === 'W') delta = underdog ? 15 : favorite ? 4 : 9
  else if (res === 'D') delta = underdog ? 6 : favorite ? -5 : 1
  else delta = underdog ? -3 : favorite ? -12 : -7
  t.morale = Math.max(15, Math.min(100, (t.morale ?? 62) + delta))
  return delta
}

// ───────── Estado persistente de jugadores ─────────
// fit: frescura 0-100 · dev: subida de media · inj: partidos de baja (-1 = todo
// el torneo) · sus: partidos de sanción · pj/min/g/a/yc: estadísticas

export function pst(t, p) {
  let s = t.pstate[p.id]
  if (!s) {
    s = { age: p.age, fit: 100, dev: 0, inj: 0, sus: 0, pj: 0, min: 0, g: 0, a: 0, yc: 0, rc: 0 }
    t.pstate[p.id] = s
  }
  return s
}

// Plantilla base + la leyenda añadida (si la hay para este equipo)
function rosterOf(t, team) {
  const base = getSquad(team)
  return (t.legend && t.legend.team === team.id) ? [...base, t.legend] : base
}

// Plantilla con el estado del torneo aplicado (media efectiva, energía, bajas,
// y los roles/intensidad configurados por el usuario, que la simulación lee).
export function effSquad(t, team) {
  const roles = t.roles ?? {}
  return rosterOf(t, team).map(p => {
    const s = t.pstate[p.id]
    const cfg = roles[p.id] ?? { intensity: 'normal', role: 'equilibrado' }
    return {
      ...p,
      r: Math.min(96, p.r + (s?.dev ?? 0)),
      baseR: p.r,
      dev: s?.dev ?? 0,
      fit: s?.fit ?? 100,
      inj: s?.inj ?? 0,
      sus: s?.sus ?? 0,
      intensity: cfg.intensity,
      role: cfg.role,
      ...roleMods(cfg.intensity, cfg.role),
      stats: { pj: s?.pj ?? 0, min: s?.min ?? 0, g: s?.g ?? 0, a: s?.a ?? 0, yc: s?.yc ?? 0, rc: s?.rc ?? 0 },
    }
  })
}

export const availableSquad = (t, team) => effSquad(t, team).filter(p => p.inj === 0 && p.sus === 0)

// Los jóvenes explotan en un gran torneo; un veterano como mucho araña +1
const DEV_CAP = age => (age <= 20 ? 6 : age <= 23 ? 4 : age <= 27 ? 2 : 1)
const DEV_RATE = age => (age <= 20 ? 0.5 : age <= 23 ? 0.3 : age <= 27 ? 0.11 : age <= 30 ? 0.04 : 0.015)

function pushNews(t, text) {
  t.news.unshift(text)
  if (t.news.length > 14) t.news.pop()
}

function rollInjury(t, p, team, context) {
  const leve = Math.random() < 0.86
  const s = pst(t, p)
  if (leve) {
    s.inj = 1 + (Math.random() < 0.45 ? 1 : 0)
    pushNews(t, `🤕 ${p.n} (${team.flag} ${team.code}) ${context}: se pierde ${s.inj} partido${s.inj > 1 ? 's' : ''}`)
  } else {
    s.inj = -1
    pushNews(t, `🚑 ${p.n} (${team.flag} ${team.code}) ${context}: lesión grave, ¡adiós al Mundial!`)
  }
}

// Aplica al torneo las consecuencias de un partido ya jugado: minutos, goles,
// asistencias, fatiga, tarjetas, sanciones, lesiones y progresión de media.
export function applyMatchEffects(t, m) {
  if (!m) return
  const totalMin = Math.min(m.minute, 120)
  for (const side of [m.home, m.away]) {
    const team = side.team
    // Los lesionados/sancionados que no jugaron cumplen un partido
    const appeared = new Set(side.players.map(p => p.id))
    for (const p of rosterOf(t, team)) {
      if (appeared.has(p.id)) continue
      const s = t.pstate[p.id]
      if (!s) continue
      if (s.inj > 0) s.inj--
      if (s.sus > 0) s.sus--
    }
    // Jugadores que participaron
    for (const p of side.players) {
      const mins = minutesOf(p, m)
      if (mins <= 0 && !p.red && !p.injured) continue
      const s = pst(t, p)
      s.pj += mins > 0 ? 1 : 0
      s.min += mins
      s.g += p.goals
      s.a += p.assists
      s.yc += p.yc
      // Fatiga: ~45 puntos por partido completo (los porteros apenas se desgastan)
      const wear = mins * (p.pos === 'POR' ? 0.12 : 0.5)
      s.fit = Math.max(5, s.fit - wear)
      // Sanción por expulsión
      if (p.red) {
        s.sus = Math.max(s.sus, 1)
        s.rc = (s.rc ?? 0) + 1
        pushNews(t, `🟥 ${p.n} (${team.flag} ${team.code}) sancionado: se pierde el próximo partido`)
      }
      // Lesión sufrida durante el partido
      if (p.injured) {
        rollInjury(t, p, team, 'se retiró lesionado')
      } else if (mins > 0) {
        // Lesión post-partido: muy baja probabilidad, crece con la sobrecarga
        const overload = s.fit < 30 ? 0.014 : s.fit < 50 ? 0.006 : 0
        if (Math.random() < 0.0016 + overload) rollInjury(t, p, team, 'sobrecargado tras el partido')
      }
      // Progresión de media: los jóvenes con minutos crecen más rápido
      if (mins > 0 && s.dev < DEV_CAP(p.age)) {
        const perf = (p.goals + p.assists) * 0.18
        if (Math.random() < (mins / 90) * (DEV_RATE(p.age) + perf)) {
          s.dev++
          if (s.dev >= 2) pushNews(t, `📈 ${p.n} (${team.flag} ${team.code}) está brillando: su media sube a ${Math.min(96, baseOf(t, p) + s.dev)}`)
        }
      }
    }
  }
}

const baseOf = (t, p) => p.baseR ?? p.r

// Recuperación entre rondas según los días de descanso reales del calendario:
// más descanso y más juventud → mejor recuperación. En las eliminatorias, con
// los partidos más juntos, la fatiga pasa factura.
export function applyRecovery(t, restDays) {
  const days = restDays ?? 5
  for (const [, s] of Object.entries(t.pstate)) {
    const perDay = Math.max(3.5, Math.min(9, 6.5 + (28 - (s.age ?? 27)) * 0.12))
    s.fit = Math.min(100, s.fit + Math.max(12, Math.min(100, days * perDay)))
  }
}

// ───────── Clasificación ─────────
export function standings(t, group) {
  const rows = {}
  for (const team of groupTeams(group)) {
    rows[team.id] = { id: team.id, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }
  }
  for (const f of t.fixtures.filter(f => f.group === group && f.played)) {
    const [gh, ga] = f.score
    const H = rows[f.home], A = rows[f.away]
    H.pj++; A.pj++; H.gf += gh; H.gc += ga; A.gf += ga; A.gc += gh
    if (gh > ga) { H.g++; A.p++; H.pts += 3 }
    else if (gh < ga) { A.g++; H.p++; A.pts += 3 }
    else { H.e++; A.e++; H.pts++; A.pts++ }
  }
  return Object.values(rows).sort(
    (a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf || TEAM_BY_ID[b.id].rating - TEAM_BY_ID[a.id].rating
  )
}

const sortRecord = (a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf

function qualified(t) {
  const winners = [], runners = [], thirds = []
  for (const g of GROUPS) {
    const rows = standings(t, g)
    winners.push(rows[0]); runners.push(rows[1]); thirds.push(rows[2])
  }
  winners.sort(sortRecord); runners.sort(sortRecord); thirds.sort(sortRecord)
  return { winners, runners, thirds: thirds.slice(0, 8) }
}

function buildR32(t) {
  const { winners, runners, thirds } = qualified(t)
  const W = winners.map(r => r.id), R = runners.map(r => r.id), T = thirds.map(r => r.id)
  // Emparejamientos sembrados (simplificación del cuadro oficial)
  const pairs = [
    [W[0], T[7]], [R[3], R[4]], [W[7], R[8]], [W[8], T[0]],
    [W[3], T[4]], [R[0], R[7]], [W[4], T[3]], [W[11], R[9]],
    [W[1], T[6]], [R[2], R[5]], [W[6], R[11]], [W[9], T[1]],
    [W[2], T[5]], [R[1], R[6]], [W[5], T[2]], [W[10], R[10]],
  ]
  // Evitar duelos del mismo grupo en R32 con un intercambio sencillo
  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = pairs[i]
    if (TEAM_BY_ID[a].group === TEAM_BY_ID[b].group) {
      const j = (i + 4) % pairs.length
      const tmp = pairs[i][1]
      pairs[i][1] = pairs[j][1]
      pairs[j][1] = tmp
    }
  }
  return pairs.map(([h, a], i) => ({
    id: `R32-${i}`, home: h, away: a, played: false, score: null, pens: null, stadium: stadiumFor(i + 3), date: koDate('R32', i),
  }))
}

function nextRoundFixtures(matches, stageKey) {
  const out = []
  for (let i = 0; i < matches.length; i += 2) {
    out.push({
      id: `${stageKey}-${i / 2}`,
      home: winnerOf(matches[i]),
      away: winnerOf(matches[i + 1]),
      played: false, score: null, pens: null,
      stadium: stageKey === 'F' ? FINAL_STADIUM : stadiumFor(i * 2 + 5),
      date: koDate(stageKey, i / 2),
    })
  }
  return out
}

export function winnerOf(f) {
  if (!f.played) return null
  const [h, a] = f.score
  if (h !== a) return h > a ? f.home : f.away
  if (f.pens) return f.pens[0] > f.pens[1] ? f.home : f.away
  return null // empate sin penaltis (fase de grupos)
}

// ───────── Partidos pendientes / del usuario ─────────
export function currentMatches(t) {
  if (t.stage === 'groups') return t.fixtures.filter(f => f.round === t.round)
  if (t.stage === 'done') return []
  return t.bracket[t.stage]
}

export function userMatch(t) {
  if (!t.userAlive) return null
  return currentMatches(t).find(f => !f.played && (f.home === t.userTeamId || f.away === t.userTeamId)) ?? null
}

function simFixture(t, f, knockout) {
  const H = TEAM_BY_ID[f.home], A = TEAM_BY_ID[f.away]
  const res = quickSim(H, A, availableSquad(t, H), availableSquad(t, A), knockout)
  f.played = true
  f.score = res.score
  f.pens = res.pens
  f.scorers = res.scorers
  applyMatchEffects(t, res.match)
}

export function recordUserResult(t, f, result) {
  f.played = true
  f.score = result.score
  f.pens = result.pens ?? null
  f.scorers = result.scorers ?? null
}

// Simula los partidos de la IA de la ronda actual y avanza si está completa
export function advance(t) {
  const matches = currentMatches(t)
  for (const f of matches) {
    if (!f.played) simFixture(t, f, t.stage !== 'groups')
  }
  // Días de descanso reales hasta la siguiente ronda
  applyRecovery(t, restDaysFor(t.stage, t.round))

  if (t.stage === 'groups') {
    if (t.round < 3) { t.round++; return t }
    // Fin de grupos → ¿se clasifica el usuario?
    t.stage = 'R32'
    t.bracket.R32 = buildR32(t)
    const inR32 = t.bracket.R32.some(f => f.home === t.userTeamId || f.away === t.userTeamId)
    if (!inR32) { t.userAlive = false; t.userEliminatedAt = 'groups' }
    return t
  }

  // Eliminatorias: comprobar si el usuario sigue vivo
  if (t.userAlive && t.stage !== 'groups') {
    const uf = matches.find(f => f.home === t.userTeamId || f.away === t.userTeamId)
    if (uf && winnerOf(uf) !== t.userTeamId) {
      t.userAlive = false
      t.userEliminatedAt = t.stage
    }
  }

  const order = ['R32', 'R16', 'QF', 'SF', 'F']
  const idx = order.indexOf(t.stage)
  if (t.stage === 'F') {
    t.champion = winnerOf(t.bracket.F[0])
    t.stage = 'done'
    return t
  }
  const nextStage = order[idx + 1]
  t.bracket[nextStage] = nextRoundFixtures(matches, nextStage)
  t.stage = nextStage
  return t
}

// Si el usuario fue eliminado: simula todo lo que queda hasta coronar campeón
export function simulateToEnd(t) {
  let guard = 0
  while (t.stage !== 'done' && guard++ < 20) advance(t)
  return t
}

export const teamName = id => TEAM_BY_ID[id]?.name ?? '—'
export const teamFlag = id => TEAM_BY_ID[id]?.flag ?? ''

// ───────── Clasificaciones individuales del torneo ─────────
// Resuelve los ids de pstate a nombre/equipo (todas las plantillas + la leyenda)
function playerIndex(t) {
  const idx = {}
  for (const team of TEAMS) for (const p of getSquad(team)) idx[p.id] = { n: p.n, team: team.id, npos: p.npos }
  if (t.legend) idx[t.legend.id] = { n: t.legend.n, team: t.legend.team, npos: t.legend.npos }
  return idx
}

export function leaderboards(t) {
  const idx = playerIndex(t)
  const rows = []
  for (const [id, s] of Object.entries(t.pstate ?? {})) {
    const info = idx[id]
    if (!info) continue
    rows.push({ id, n: info.n, team: info.team, npos: info.npos, g: s.g ?? 0, a: s.a ?? 0, yc: s.yc ?? 0, rc: s.rc ?? 0, min: s.min ?? 0 })
  }
  const top = (key, tie) => rows.filter(r => r[key] > 0)
    .sort((a, b) => b[key] - a[key] || (b[tie] - a[tie]) || a.min - b.min)
    .slice(0, 10)
  return {
    scorers: top('g', 'a'),
    assisters: top('a', 'g'),
    yellows: top('yc', 'rc'),
    reds: top('rc', 'yc'),
  }
}

// ───────── Prensa tras el partido del usuario ─────────
const pickArr = a => a[Math.floor(Math.random() * a.length)]
const NEXT_LABEL = { groups: 'la siguiente jornada', R32: 'octavos de final', R16: 'cuartos de final', QF: 'las semifinales', SF: 'la GRAN FINAL', F: 'lo más alto' }

export function pressHeadline(t, f, result) {
  const isHome = f.home === t.userTeamId
  const me = TEAM_BY_ID[t.userTeamId], opp = TEAM_BY_ID[isHome ? f.away : f.home]
  const my = f.score[isHome ? 0 : 1], their = f.score[isHome ? 1 : 0]
  const pens = f.pens
  const wonPens = pens && (isHome ? pens[0] > pens[1] : pens[1] > pens[0])
  const res = my > their ? 'W' : my < their ? 'L' : (pens ? (wonPens ? 'W' : 'L') : 'D')
  const ko = t.stage !== 'groups'
  const score = `${my}-${their}`
  const next = NEXT_LABEL[t.stage] ?? 'la siguiente ronda'
  const scorers = result?.scorers?.[isHome ? 'home' : 'away'] ?? []
  const star = [...scorers].sort((a, b) => b.g - a.g)[0]
  const sN = star?.n ?? null

  let pool
  if (res === 'W' && pens) pool = [`¡${me.name} sobrevive en los penaltis y se mete en ${next}!`, `Lotería desde los once metros: ${me.name} avanza a ${next}`, `Noche de infarto: ${me.name} elimina a ${opp.name} en la tanda`]
  else if (res === 'W' && my - their >= 3) pool = sN ? [`${sN} lidera la goleada de ${me.name} (${score})`, `Recital de ${me.name}: ${score} ante ${opp.name}`, `${me.name} pasa por encima de ${opp.name}`] : [`${me.name} golea a ${opp.name} (${score})`, `Festival de ${me.name}: ${score}`]
  else if (res === 'W' && ko) pool = sN ? [`${sN} mete a ${me.name} en ${next}`, `${me.name} sufre pero se cuela en ${next}`, `¡${me.name} sigue soñando! A ${next} tras ganar a ${opp.name}`] : [`${me.name} avanza a ${next} tras vencer a ${opp.name}`, `${me.name} ya está en ${next}`]
  else if (res === 'W') pool = sN ? [`${sN} decide y ${me.name} gana a ${opp.name}`, `${me.name} se lleva los tres puntos (${score})`, `Triunfo de ${me.name} con sello de ${sN}`] : [`${me.name} suma de tres ante ${opp.name} (${score})`, `Victoria trabajada de ${me.name}: ${score}`]
  else if (res === 'D') pool = [`${me.name} reparte puntos con ${opp.name} (${score})`, `${me.name} no pasa del empate ante ${opp.name}`, `Tablas entre ${me.name} y ${opp.name}`]
  else if (res === 'L' && ko) pool = [`Adiós al sueño: ${me.name} cae ante ${opp.name}`, `Noche negra: ${me.name} se despide del Mundial`, `${opp.name} deja fuera a ${me.name} (${score})`]
  else pool = [`Tropiezo de ${me.name} frente a ${opp.name} (${score})`, `Derrota de ${me.name}: ${score}`, `${me.name} complica su camino tras caer con ${opp.name}`]

  const subs = res === 'W' ? ['La afición se entrega', 'Euforia desbordada en la grada', 'A seguir soñando'] : res === 'D' ? ['Sabor agridulce', 'Tocará apretar', 'No fue suficiente'] : ['Decepción en las gradas', 'Día para olvidar', 'Toca levantarse rápido']
  return { masthead: pickArr(['EL MUNDIALISTA', 'DIARIO MUNDIAL', 'LA GACETA DEPORTIVA', 'GOL DIGITAL', 'PLANETA FÚTBOL']), headline: pickArr(pool), sub: pickArr(subs), starName: sN }
}
