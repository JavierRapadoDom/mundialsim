// Motor de simulación de partidos minuto a minuto.
// Un partido se crea con newMatch() y se avanza con tick(); cada tick es un
// minuto de juego y devuelve los eventos generados en él.

import { bestXI } from '../data/squads.js'

export const TACTICS = {
  defensiva: { atk: 0.78, def: 1.18, label: 'Defensiva', icon: '🛡️' },
  equilibrada: { atk: 1, def: 1, label: 'Equilibrada', icon: '⚖️' },
  ofensiva: { atk: 1.25, def: 0.82, label: 'Ofensiva', icon: '⚔️' },
}

// La presión alta roba balones (debilita el ataque rival) pero agota a tus
// jugadores y trae más tarjetas; la baja reserva energía a cambio de ceder campo.
export const PRESSING = {
  baja: { oppAtk: 1.05, def: 0.96, decay: 0.82, cards: 0.8, label: 'Baja', icon: '🧘' },
  media: { oppAtk: 1, def: 1, decay: 1, cards: 1, label: 'Media', icon: '👟' },
  alta: { oppAtk: 0.91, def: 1.05, decay: 1.32, cards: 1.35, label: 'Alta', icon: '🔥' },
}

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)]

const TXT = {
  golDEL: ['¡GOOOOL! {p} fusila a la red tras una jugada eléctrica', '¡GOL de {p}! Definición de killer dentro del área', '¡GOOOOL! {p} aparece donde nacen los goles y no perdona'],
  golMED: ['¡GOLAZO de {p}! Zapatazo desde la frontal que se cuela por la escuadra', '¡GOL! {p} llega desde segunda línea y empala a la perfección'],
  golDEF: ['¡GOL de {p}! Cabezazo imperial a la salida de un córner', '¡GOL! {p} sube al remate y sorprende a toda la defensa'],
  atajada: ['{g} vuela y saca una mano prodigiosa al disparo de {p}', '¡Qué parada de {g}! Le ahoga el grito de gol a {p}', '{p} remata a bocajarro pero {g} responde con reflejos felinos'],
  palo: ['¡AL PALO! El disparo de {p} se estrella en la madera', '¡Increíble! {p} cruza demasiado el balón y el poste le niega el gol'],
  fuera: ['{p} lo intenta desde lejos pero se marcha rozando el palo', 'Ocasión clara para {p}, que manda el balón a las nubes', '{p} recorta dentro del área pero su disparo se va desviado'],
  amarilla: ['Tarjeta amarilla para {p} por una dura entrada', 'El colegiado amonesta a {p} por cortar la contra', '{p} ve la amarilla por protestar'],
  roja: ['¡ROJA DIRECTA! {p} deja a su equipo con uno menos', '¡Expulsado {p}! Entrada criminal y a la calle'],
  segunda: ['¡Segunda amarilla y EXPULSIÓN de {p}!'],
  lesion: ['{p} se duele en el césped y pide el cambio', 'Malas noticias: {p} no puede continuar'],
  penalti: ['¡PENALTI! Derriban a {p} dentro del área y el árbitro no duda', '¡PENALTI tras revisión del VAR! Mano clara en el área'],
  penGol: ['¡GOL DE PENALTI! {p} engaña al portero con sangre fría', '¡GOL! {p} la pone donde las arañas tejen su tela'],
  penFallo: ['¡LO PARA EL PORTERO! {g} adivina las intenciones de {p}', '¡FUERA! {p} manda el penalti a las gradas. Increíble'],
}

function fmt(template, p, g) {
  return template.replace('{p}', p?.n ?? '').replace('{g}', g?.n ?? '')
}

// La energía con la que un jugador arranca el partido depende de su frescura
// acumulada en el torneo (fit 100 → 100 de salida; fit 40 → 73).
const startStamina = p => Math.min(100, 55 + 0.45 * (p.fit ?? 100))

function prepareSide(team, setup) {
  const { xi, bench } = setup?.xi
    ? { xi: [...setup.xi], bench: [...setup.bench] }
    : bestXI(setup?.squad ?? [], setup?.formation ?? '4-3-3')
  return {
    team,
    formation: setup?.formation ?? '4-3-3',
    tactic: setup?.tactic ?? 'equilibrada',
    pressing: setup?.pressing ?? 'media',
    players: xi.map(p => ({ ...p, stamina: startStamina(p), yc: 0, off: false, goals: 0, assists: 0, enterMin: 0, exitMin: null })),
    bench: bench.map(p => ({ ...p, stamina: startStamina(p), yc: 0, off: false, goals: 0, assists: 0, enterMin: null, exitMin: null })),
    subs: 5,
    stats: { shots: 0, onTarget: 0, possession: 50, corners: 0, fouls: 0 },
  }
}

export function newMatch(homeTeam, awayTeam, homeSetup, awaySetup, opts = {}) {
  return {
    home: prepareSide(homeTeam, homeSetup),
    away: prepareSide(awayTeam, awaySetup),
    minute: 0,
    phase: '1H', // 1H → HT → 2H → FT | (eliminatoria) ET1 → ETHT → ET2 → AET → PENS
    score: [0, 0],
    knockout: !!opts.knockout,
    userSide: opts.userSide ?? null, // 'home' | 'away' | null
    stadium: opts.stadium ?? 'Estadio Azteca · Ciudad de México',
    events: [],
    addedTime: { 1: 2 + Math.floor(Math.random() * 3), 2: 3 + Math.floor(Math.random() * 3) },
    rand: Math.random,
    seedEvents: [],
  }
}

const onPitch = side => side.players.filter(p => !p.off)

function effRating(p) {
  return p.r * (0.72 + 0.28 * (p.stamina / 100))
}

function attackPower(side, oppSide) {
  const ps = onPitch(side)
  const att = ps.filter(p => p.pos === 'DEL')
  const mid = ps.filter(p => p.pos === 'MED')
  const base =
    (att.reduce((s, p) => s + effRating(p), 0) + mid.reduce((s, p) => s + effRating(p) * 0.6, 0)) /
    Math.max(1, att.length + mid.length * 0.6)
  const menMod = ps.length / 11
  const oppPress = oppSide ? PRESSING[oppSide.pressing].oppAtk : 1
  return base * TACTICS[side.tactic].atk * oppPress * menMod * menMod
}

function defensePower(side) {
  const ps = onPitch(side)
  const def = ps.filter(p => p.pos === 'DEF')
  const gk = ps.find(p => p.pos === 'POR')
  const mid = ps.filter(p => p.pos === 'MED')
  const base =
    (def.reduce((s, p) => s + effRating(p), 0) + (gk ? effRating(gk) * 0.8 : 0) + mid.reduce((s, p) => s + effRating(p) * 0.35, 0)) /
    Math.max(1, def.length + (gk ? 0.8 : 0) + mid.length * 0.35)
  return base * TACTICS[side.tactic].def * PRESSING[side.pressing].def * (ps.length / 11)
}

const keeper = side => onPitch(side).find(p => p.pos === 'POR')

function weightedShooter(rand, side) {
  const ps = onPitch(side).filter(p => p.pos !== 'POR')
  const weights = ps.map(p => (p.pos === 'DEL' ? 6 : p.pos === 'MED' ? 3 : 1) * (p.r / 80))
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = rand() * total
  for (let i = 0; i < ps.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return ps[i]
  }
  return ps[ps.length - 1]
}

function pushEvent(m, ev) {
  m.events.push(ev)
  return ev
}

function displayMinute(m) {
  if (m.phase === '1H' && m.minute > 45) return `45+${m.minute - 45}`
  if (m.phase === '2H' && m.minute > 90) return `90+${m.minute - 90}`
  return String(m.minute)
}

function resolveChance(m, atkKey, out) {
  const rand = m.rand
  const atkSide = m[atkKey]
  const defKey = atkKey === 'home' ? 'away' : 'home'
  const defSide = m[defKey]
  const shooter = weightedShooter(rand, atkSide)
  const gk = keeper(defSide)
  atkSide.stats.shots++

  // Penalti ocasional
  if (rand() < 0.045) {
    pushEvent(m, { min: displayMinute(m), type: 'penalti', side: atkKey, text: fmt(pick(rand, TXT.penalti), shooter) })
    const taker = onPitch(atkSide).filter(p => p.pos !== 'POR').sort((a, b) => b.r - a.r)[0]
    if (rand() < 0.76) {
      m.score[atkKey === 'home' ? 0 : 1]++
      taker.goals++
      atkSide.stats.onTarget++
      out.push(pushEvent(m, { min: displayMinute(m), type: 'gol', side: atkKey, player: taker, text: fmt(pick(rand, TXT.penGol), taker), score: [...m.score] }))
    } else {
      out.push(pushEvent(m, { min: displayMinute(m), type: 'fallo', side: atkKey, text: fmt(pick(rand, TXT.penFallo), taker, gk) }))
    }
    return
  }

  const gkQ = gk ? effRating(gk) : 60
  let pGoal = 0.26 * (effRating(shooter) / 85) * (82 / gkQ)
  pGoal = Math.max(0.08, Math.min(0.55, pGoal))
  const roll = rand()

  if (roll < pGoal) {
    m.score[atkKey === 'home' ? 0 : 1]++
    shooter.goals++
    atkSide.stats.onTarget++
    const txtPool = TXT['gol' + shooter.pos] ?? TXT.golDEL
    let text = fmt(pick(rand, txtPool), shooter)
    // Asistencia: en ~2 de cada 3 goles hay un pasador
    if (rand() < 0.65) {
      const mates = onPitch(atkSide).filter(p => p !== shooter && p.pos !== 'POR')
      if (mates.length) {
        const weights = mates.map(p => (p.pos === 'MED' ? 3 : p.pos === 'DEL' ? 2 : 1))
        const total = weights.reduce((a, b) => a + b, 0)
        let r2 = rand() * total
        let assister = mates[0]
        for (let i = 0; i < mates.length; i++) { r2 -= weights[i]; if (r2 <= 0) { assister = mates[i]; break } }
        assister.assists++
        text += ` (asistencia de ${assister.n})`
      }
    }
    out.push(pushEvent(m, { min: displayMinute(m), type: 'gol', side: atkKey, player: shooter, text, score: [...m.score] }))
  } else if (roll < pGoal + 0.32) {
    atkSide.stats.onTarget++
    out.push(pushEvent(m, { min: displayMinute(m), type: 'atajada', side: atkKey, text: fmt(pick(rand, TXT.atajada), shooter, gk) }))
  } else if (roll < pGoal + 0.42) {
    out.push(pushEvent(m, { min: displayMinute(m), type: 'palo', side: atkKey, text: fmt(pick(rand, TXT.palo), shooter) }))
  } else {
    out.push(pushEvent(m, { min: displayMinute(m), type: 'fuera', side: atkKey, text: fmt(pick(rand, TXT.fuera), shooter) }))
  }
}

function aiAutoSub(m, sideKey, outPlayer, evts) {
  const side = m[sideKey]
  if (side.subs <= 0) { outPlayer.off = true; return }
  const candidates = side.bench.filter(p => !p.off && p.pos === outPlayer.pos)
  const sub = candidates[0] ?? side.bench.filter(p => !p.off)[0]
  if (!sub) { outPlayer.off = true; return }
  doSub(m, sideKey, outPlayer.id, sub.id)
  evts.push(m.events[m.events.length - 1])
}

function discipline(m, sideKey, out) {
  const rand = m.rand
  const side = m[sideKey]
  if (rand() < 0.022 * PRESSING[side.pressing].cards) {
    const ps = onPitch(side)
    const weights = ps.map(p => (p.pos === 'DEF' ? 3 : p.pos === 'MED' ? 2 : 1))
    const total = weights.reduce((a, b) => a + b, 0)
    let roll = rand() * total
    let victim = ps[0]
    for (let i = 0; i < ps.length; i++) { roll -= weights[i]; if (roll <= 0) { victim = ps[i]; break } }
    side.stats.fouls++

    if (rand() < 0.045) {
      victim.off = true
      victim.red = true
      victim.exitMin = m.minute
      out.push(pushEvent(m, { min: displayMinute(m), type: 'roja', side: sideKey, player: victim, text: fmt(pick(rand, TXT.roja), victim) }))
    } else {
      victim.yc++
      if (victim.yc >= 2) {
        victim.off = true
        victim.red = true
        victim.exitMin = m.minute
        out.push(pushEvent(m, { min: displayMinute(m), type: 'roja', side: sideKey, player: victim, text: fmt(TXT.segunda[0], victim) }))
      } else {
        out.push(pushEvent(m, { min: displayMinute(m), type: 'amarilla', side: sideKey, player: victim, text: fmt(pick(rand, TXT.amarilla), victim) }))
      }
    }
  }

  // Lesiones en pleno partido (la fatiga las hace más probables)
  const ps2 = onPitch(side)
  const tiredFactor = ps2.filter(p => p.stamina < 40).length * 0.0012
  if (rand() < 0.0022 + tiredFactor) {
    const weights = ps2.map(p => (p.stamina < 40 ? 3 : 1))
    const total = weights.reduce((a, b) => a + b, 0)
    let roll2 = rand() * total
    let victim = ps2[0]
    for (let i = 0; i < ps2.length; i++) { roll2 -= weights[i]; if (roll2 <= 0) { victim = ps2[i]; break } }
    victim.injured = true
    out.push(pushEvent(m, { min: displayMinute(m), type: 'lesion', side: sideKey, player: victim, text: fmt(pick(rand, TXT.lesion), victim) }))
    if (sideKey !== m.userSide) aiAutoSub(m, sideKey, victim, out)
  }
}

// La IA reacciona al marcador
function aiTactics(m) {
  const aiKeys = ['home', 'away'].filter(k => k !== m.userSide)
  for (const k of aiKeys) {
    const idx = k === 'home' ? 0 : 1
    const diff = m.score[idx] - m.score[1 - idx]
    const side = m[k]
    if (m.minute > 65 && diff < 0) { side.tactic = 'ofensiva'; side.pressing = 'alta' }
    else if (m.minute > 70 && diff > 0) { side.tactic = 'defensiva'; side.pressing = 'baja' }
    // Cambios por cansancio a partir del 60'
    if (m.minute > 60 && side.subs > 2 && m.rand() < 0.05) {
      const tired = onPitch(side).filter(p => p.pos !== 'POR' && p.stamina < 55).sort((a, b) => a.stamina - b.stamina)[0]
      if (tired) aiAutoSub(m, k, tired, [])
    }
  }
}

export function tick(m) {
  if (m.phase === 'FT' || m.phase === 'AET' || m.phase === 'PENS') return []
  const out = []
  const rand = m.rand

  // Reanudaciones tras descanso
  if (m.phase === 'HT') {
    m.phase = '2H'
    out.push(pushEvent(m, { min: '46', type: 'inicio', text: '¡Arranca la segunda parte!' }))
  } else if (m.phase === 'ETHT') {
    m.phase = 'ET2'
    out.push(pushEvent(m, { min: '106', type: 'inicio', text: 'Comienza la segunda parte de la prórroga' }))
  }

  m.minute++
  if (m.minute === 1) out.push(pushEvent(m, { min: '1', type: 'inicio', text: `¡Rueda el balón en ${m.stadium}!` }))

  // Desgaste físico (la mentalidad y la presión marcan la intensidad)
  for (const k of ['home', 'away']) {
    const base = m[k].tactic === 'ofensiva' ? 0.75 : m[k].tactic === 'defensiva' ? 0.55 : 0.62
    const intensity = base * PRESSING[m[k].pressing].decay
    for (const p of onPitch(m[k])) p.stamina = Math.max(10, p.stamina - intensity * (p.pos === 'POR' ? 0.3 : 1))
  }

  const atkH = attackPower(m.home, m.away)
  const atkA = attackPower(m.away, m.home)
  const defH = defensePower(m.home)
  const defA = defensePower(m.away)

  // Posesión
  const possH = (atkH * 1.04) / (atkH * 1.04 + atkA)
  m.home.stats.possession = Math.round((m.home.stats.possession * (m.minute - 1) + possH * 100) / m.minute)
  m.away.stats.possession = 100 - m.home.stats.possession

  // Ocasiones (ventaja local ligera)
  const base = 0.047
  const pH = base * Math.pow((atkH * 1.05) / defA, 2.4)
  const pA = base * Math.pow(atkA / defH, 2.4)
  if (rand() < pH) resolveChance(m, 'home', out)
  else if (rand() < pA) resolveChance(m, 'away', out)

  discipline(m, 'home', out)
  discipline(m, 'away', out)
  aiTactics(m)

  // Transiciones de fase
  const endings = {
    '1H': 45 + m.addedTime[1],
    '2H': 90 + m.addedTime[2],
    ET1: 105,
    ET2: 120,
  }
  if (m.phase in endings && m.minute >= endings[m.phase]) {
    if (m.phase === '1H') {
      m.phase = 'HT'
      m.minute = 45
      out.push(pushEvent(m, { min: '45', type: 'descanso', text: `Descanso. ${m.home.team.name} ${m.score[0]} - ${m.score[1]} ${m.away.team.name}`, score: [...m.score] }))
    } else if (m.phase === '2H') {
      m.minute = 90
      if (m.knockout && m.score[0] === m.score[1]) {
        m.phase = 'ET1'
        m.home.subs++
        m.away.subs++
        out.push(pushEvent(m, { min: '90', type: 'descanso', text: '¡Empate al final de los 90 minutos! Nos vamos a la prórroga (sustitución extra disponible)', score: [...m.score] }))
      } else {
        m.phase = 'FT'
        out.push(pushEvent(m, { min: '90', type: 'final', text: `¡FINAL DEL PARTIDO! ${m.home.team.name} ${m.score[0]} - ${m.score[1]} ${m.away.team.name}`, score: [...m.score] }))
      }
    } else if (m.phase === 'ET1') {
      m.phase = 'ETHT'
      out.push(pushEvent(m, { min: '105', type: 'descanso', text: 'Final de la primera parte de la prórroga', score: [...m.score] }))
    } else if (m.phase === 'ET2') {
      if (m.score[0] === m.score[1]) {
        m.phase = 'PENS'
        out.push(pushEvent(m, { min: '120', type: 'penales', text: '¡TANDA DE PENALTIS! El billete se decide desde los once metros', score: [...m.score] }))
      } else {
        m.phase = 'AET'
        out.push(pushEvent(m, { min: '120', type: 'final', text: `¡FINAL DE LA PRÓRROGA! ${m.home.team.name} ${m.score[0]} - ${m.score[1]} ${m.away.team.name}`, score: [...m.score] }))
      }
    }
  }
  return out
}

export function doSub(m, sideKey, outId, inId) {
  const side = m[sideKey]
  if (side.subs <= 0) return false
  const outP = side.players.find(p => p.id === outId && !p.off)
  const inP = side.bench.find(p => p.id === inId && !p.off)
  if (!outP || !inP) return false
  outP.off = true
  outP.subbed = true
  outP.exitMin = m.minute
  inP.enterMin = m.minute
  side.bench = side.bench.filter(p => p.id !== inId)
  side.players.push(inP)
  side.subs--
  pushEvent(m, {
    min: displayMinute(m), type: 'cambio', side: sideKey,
    text: `Cambio en ${side.team.name}: entra ${inP.n} por ${outP.n}`,
  })
  return true
}

export function setTactic(m, sideKey, tactic) {
  m[sideKey].tactic = tactic
}

export function setPressing(m, sideKey, level) {
  m[sideKey].pressing = level
}

// Minutos disputados por un jugador en este partido
export function minutesOf(p, m) {
  if (p.enterMin == null) return 0
  const end = p.exitMin ?? Math.min(m.minute, 120)
  return Math.max(0, end - p.enterMin)
}

export const isPaused = m => ['HT', 'ETHT', 'FT', 'AET', 'PENS'].includes(m.phase)
export const isOver = m => ['FT', 'AET'].includes(m.phase) || m.phase === 'DONE'

// ───────── Tanda de penaltis automática (IA vs IA) ─────────
export function autoPens(homeSide, awaySide, rand = Math.random) {
  const takers = side => onPitch(side).filter(p => p.pos !== 'POR').sort((a, b) => b.r - a.r)
  const tH = takers(homeSide), tA = takers(awaySide)
  const gH = keeper(homeSide), gA = keeper(awaySide)
  let sH = 0, sA = 0
  const pConv = (taker, gk) => Math.max(0.5, Math.min(0.9, 0.74 + (taker.r - (gk?.r ?? 70)) * 0.004))
  for (let i = 0; i < 5; i++) {
    if (rand() < pConv(tH[i % tH.length], gA)) sH++
    // Si ya está decidido, paramos (regla real); simplificado: seguimos tirando los 5
    if (rand() < pConv(tA[i % tA.length], gH)) sA++
  }
  let round = 5
  while (sH === sA && round < 20) {
    if (rand() < pConv(tH[round % tH.length], gA)) sH++
    if (rand() < pConv(tA[round % tA.length], gH)) sA++
    round++
  }
  if (sH === sA) sH++ // desempate de emergencia
  return [sH, sA]
}

// ───────── Simulación instantánea (partidos de la IA) ─────────
export function quickSim(homeTeam, awayTeam, homeSquad, awaySquad, knockout = false) {
  const m = newMatch(homeTeam, awayTeam, { squad: homeSquad }, { squad: awaySquad }, { knockout })
  let guard = 0
  while (!isOver(m) && m.phase !== 'PENS' && guard++ < 400) tick(m)
  const result = {
    score: [...m.score],
    scorers: {
      home: m.home.players.concat(m.home.bench).filter(p => p.goals > 0).map(p => ({ n: p.n, g: p.goals })),
      away: m.away.players.concat(m.away.bench).filter(p => p.goals > 0).map(p => ({ n: p.n, g: p.goals })),
    },
    pens: null,
  }
  if (m.phase === 'PENS') {
    result.pens = autoPens(m.home, m.away)
  }
  result.match = m // para aplicar fatiga, progresión y lesiones al torneo
  return result
}
