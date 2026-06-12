import { useMemo, useState } from 'react'
import { TEAMS, TEAM_BY_ID, GROUPS, groupTeams } from '../data/teams.js'
import {
  newTournament, currentMatches, userMatch, recordUserResult, advance,
  simulateToEnd, winnerOf, STAGE_LABEL, effSquad, availableSquad, applyMatchEffects,
} from '../engine/tournament.js'
import PreMatch from '../components/PreMatch.jsx'
import MatchLive from '../components/MatchLive.jsx'
import GroupTables from '../components/GroupTables.jsx'
import Bracket from '../components/Bracket.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import { fmtDate, fmtDateLong } from '../data/calendar.js'

const SAVE_KEY = 'mundial26_save_v1'

const load = () => {
  try {
    const t = JSON.parse(localStorage.getItem(SAVE_KEY))
    if (!t) return null
    // Descarta partidas de versiones con equipos/grupos antiguos
    const valid = TEAM_BY_ID[t.userTeamId] && t.fixtures?.every(f => TEAM_BY_ID[f.home] && TEAM_BY_ID[f.away] && TEAM_BY_ID[f.home].group === f.group)
    if (!valid) return null
    // Migración de partidas previas al estado de jugadores
    t.pstate ??= {}
    t.news ??= []
    return t
  } catch { return null }
}
const save = t => localStorage.setItem(SAVE_KEY, JSON.stringify(t))
const clearSave = () => localStorage.removeItem(SAVE_KEY)

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 90 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 4,
      color: ['#e63946', '#2dc653', '#4895ef', '#ffd166', '#ffffff'][i % 5],
      size: 6 + Math.random() * 8,
    })), [])
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i key={i} style={{
          left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          background: p.color, width: p.size, height: p.size * 0.5,
        }} />
      ))}
    </div>
  )
}

function TeamPicker({ onPick }) {
  return (
    <div className="picker">
      <h1 className="page-title">🎮 Elige tu selección</h1>
      <p className="page-sub">Dirigirás a tu equipo partido a partido: alineación, táctica, cambios… ¡hasta levantar la Copa!</p>
      {GROUPS.map(g => (
        <div key={g} className="picker-group">
          <span className="picker-g">GRUPO {g}</span>
          <div className="picker-row">
            {groupTeams(g).map(t => (
              <button key={t.id} className="pick-card" style={{ '--c1': t.colors[0] }} onClick={() => onPick(t.id)}>
                <span className="pick-flag">{t.flag}</span>
                <span className="pick-name">{t.name}</span>
                <span className="pick-rating">{t.rating}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }

function fitColor(fit) {
  return fit >= 70 ? 'var(--green)' : fit >= 40 ? 'var(--gold)' : 'var(--red)'
}

function TeamStats({ t, team, onPlayer }) {
  const squad = effSquad(t, team)
  const avgFit = Math.round(squad.reduce((s, p) => s + p.fit, 0) / squad.length)
  const totalDev = squad.reduce((s, p) => s + p.dev, 0)
  const bajas = squad.filter(p => p.inj !== 0 || p.sus > 0).length
  return (
    <div className="team-stats">
      <div className="ts-summary">
        <div className="ts-box"><div className="ts-num" style={{ color: fitColor(avgFit) }}>{avgFit}%</div><div className="ts-lab">energía media</div></div>
        <div className="ts-box"><div className="ts-num" style={{ color: 'var(--green)' }}>{totalDev > 0 ? `+${totalDev}` : '—'}</div><div className="ts-lab">subidas de media</div></div>
        <div className="ts-box"><div className="ts-num" style={{ color: bajas ? 'var(--red)' : 'var(--text)' }}>{bajas}</div><div className="ts-lab">bajas actuales</div></div>
      </div>

      {t.news.length > 0 && (
        <div className="news-box">
          <h4>📰 Noticias del torneo</h4>
          {t.news.map((n, i) => <div className="news-item" key={i}>{n}</div>)}
        </div>
      )}

      <p className="subs-help">Toca cualquier jugador para ver su ficha completa.</p>
      <table className="squad-table stats-table">
        <thead>
          <tr>
            <th>#</th><th>Jugador</th><th>Pos.</th><th>Edad</th><th>Media</th><th>Energía</th>
            <th>PJ</th><th>Min</th><th>⚽</th><th>🅰️</th><th>🟨</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {squad.map(p => (
            <tr key={p.id} className={`clickable ${p.inj !== 0 || p.sus > 0 ? 'row-out' : p.star ? 'row-star' : ''}`} onClick={() => onPlayer(p)}>
              <td className="td-num">{p.num}</td>
              <td className="td-player">{p.n}{p.captain && <span className="cap-badge"> Ⓒ</span>}{p.star && <span className="star-mini"> ★</span>}</td>
              <td><span className="npos-chip" style={{ color: POS_COLOR[p.pos] }}>{p.npos}</span></td>
              <td>{p.age}</td>
              <td className="ts-rating">
                {p.r}
                {p.dev > 0 && <span className="dev-up"> ▲{p.dev}</span>}
              </td>
              <td>
                <div className="fit-wrap" title={`${Math.round(p.fit)}%`}>
                  <div className="fit-bar"><i style={{ width: `${p.fit}%`, background: fitColor(p.fit) }} /></div>
                  <span className="fit-num">{Math.round(p.fit)}</span>
                </div>
              </td>
              <td>{p.stats.pj}</td>
              <td>{p.stats.min}'</td>
              <td>{p.stats.g || '·'}</td>
              <td>{p.stats.a || '·'}</td>
              <td>{p.stats.yc || '·'}</td>
              <td className="ts-status">
                {p.inj === -1 ? '🚑 Baja todo el torneo'
                  : p.inj > 0 ? `🤕 Vuelve en ${p.inj} part.`
                  : p.sus > 0 ? `🟥 Sancionado (${p.sus})`
                  : '✅'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ResultBanner({ fixture, userTeamId }) {
  if (!fixture?.played) return null
  const H = TEAM_BY_ID[fixture.home], A = TEAM_BY_ID[fixture.away]
  const w = winnerOf(fixture)
  const isKO = fixture.pens != null || fixture.id?.startsWith('R') || fixture.id?.startsWith('Q') || fixture.id?.startsWith('S') || fixture.id?.startsWith('F')
  const userWon = w === userTeamId
  const draw = fixture.score[0] === fixture.score[1] && !fixture.pens
  return (
    <div className={`result-banner ${draw ? 'draw' : userWon ? 'won' : 'lost'}`}>
      <div className="rb-label">{draw ? '🤝 EMPATE' : userWon ? '🎉 ¡VICTORIA!' : '😞 DERROTA'}</div>
      <div className="rb-score">
        {H.flag} {H.code} {fixture.score[0]} – {fixture.score[1]} {A.code} {A.flag}
        {fixture.pens && <span className="rb-pens"> · penaltis {fixture.pens[0]}–{fixture.pens[1]}</span>}
      </div>
      {isKO && null}
    </div>
  )
}

export default function Simulator({ go }) {
  const [t, setT] = useState(load)
  const [screen, setScreen] = useState('hub') // hub | prematch | live
  const [setup, setSetup] = useState(null)
  const [lastFixture, setLastFixture] = useState(null)
  const [tab, setTab] = useState('equipo')
  const [selPlayer, setSelPlayer] = useState(null)

  const pick = id => {
    const nt = newTournament(id)
    save(nt)
    setT(nt)
    setLastFixture(null)
    setScreen('hub')
  }

  const reset = () => {
    if (!confirm('¿Seguro que quieres abandonar este Mundial y empezar de cero?')) return
    clearSave()
    setT(null)
    setLastFixture(null)
    setScreen('hub')
  }

  if (!t) return <TeamPicker onPick={pick} />

  const userTeam = TEAM_BY_ID[t.userTeamId]
  const um = userMatch(t)
  const knockout = t.stage !== 'groups'

  // ───── Partido en vivo ─────
  if (screen === 'live' && um && setup) {
    const H = TEAM_BY_ID[um.home], A = TEAM_BY_ID[um.away]
    const userSide = um.home === t.userTeamId ? 'home' : 'away'
    return (
      <MatchLive
        homeTeam={H} awayTeam={A} userSide={userSide} userSetup={setup}
        aiSquads={{ home: availableSquad(t, H), away: availableSquad(t, A) }}
        knockout={knockout} stadium={um.stadium}
        onFinish={result => {
          recordUserResult(t, um, result)
          applyMatchEffects(t, result.match)
          const nt = advance(structuredClone(t))
          save(nt)
          setT(nt)
          setLastFixture(um)
          setSetup(null)
          setScreen('hub')
          window.scrollTo({ top: 0 })
        }}
      />
    )
  }

  // ───── Preparación del partido ─────
  if (screen === 'prematch' && um) {
    const opponentId = um.home === t.userTeamId ? um.away : um.home
    return (
      <PreMatch
        team={userTeam}
        opponent={TEAM_BY_ID[opponentId]}
        squad={effSquad(t, userTeam)}
        knockout={knockout}
        stadium={um.stadium}
        dateLabel={fmtDateLong(um.date)}
        onBack={() => setScreen('hub')}
        onStart={s => { setSetup(s); setScreen('live'); window.scrollTo({ top: 0 }) }}
      />
    )
  }

  // ───── Campeón ─────
  if (t.stage === 'done') {
    const champ = TEAM_BY_ID[t.champion]
    const userChamp = t.champion === t.userTeamId
    return (
      <div className="champion">
        {userChamp && <Confetti />}
        <div className="champ-trophy">🏆</div>
        <h1 className="champ-title">{userChamp ? '¡CAMPEONES DEL MUNDO!' : 'CAMPEÓN DEL MUNDIAL 2026'}</h1>
        <div className="champ-team" style={{ '--c1': champ.colors[0], '--c2': champ.colors[1] }}>
          <span className="champ-flag">{champ.flag}</span> {champ.name}
        </div>
        {userChamp
          ? <p className="champ-sub">Has llevado a {champ.name} a la gloria eterna en el MetLife Stadium. 🥹</p>
          : <p className="champ-sub">Tu aventura con {userTeam.flag} {userTeam.name} terminó en {STAGE_LABEL[t.userEliminatedAt] ?? 'el camino'}. ¡La próxima será!</p>}
        <Bracket t={t} />
        <div className="hero-actions">
          <button className="btn btn-primary btn-big" onClick={() => { clearSave(); setT(null) }}>🔄 Jugar otro Mundial</button>
          <button className="btn btn-ghost btn-big" onClick={() => go('teams')}>🌎 Ver equipos</button>
        </div>
      </div>
    )
  }

  // ───── Hub del torneo ─────
  const roundMatches = currentMatches(t)
  return (
    <div className="hub">
      <div className="hub-header" style={{ '--c1': userTeam.colors[0], '--c2': userTeam.colors[1] }}>
        <div className="hub-team">
          <span className="hub-flag">{userTeam.flag}</span>
          <div>
            <div className="hub-name">{userTeam.name}</div>
            <div className="hub-nick">«{userTeam.nick}» · Grupo {userTeam.group}</div>
          </div>
        </div>
        <div className="hub-stage">
          <div className="hub-stage-label">{STAGE_LABEL[t.stage]}</div>
          {t.stage === 'groups' && <div className="hub-round">Jornada {t.round} de 3</div>}
        </div>
        <button className="btn btn-ghost" onClick={reset}>🗑️ Abandonar</button>
      </div>

      <ResultBanner fixture={lastFixture} userTeamId={t.userTeamId} />

      {um ? (
        <div className="next-match">
          <div className="nm-label">⚡ TU PRÓXIMO PARTIDO · {knockout ? STAGE_LABEL[t.stage] : `Jornada ${t.round}`}</div>
          <div className="nm-teams">
            <span className="nm-team">{TEAM_BY_ID[um.home].flag} {TEAM_BY_ID[um.home].name}</span>
            <span className="vs">VS</span>
            <span className="nm-team">{TEAM_BY_ID[um.away].flag} {TEAM_BY_ID[um.away].name}</span>
          </div>
          <div className="nm-stadium">🏟️ {um.stadium}{um.date ? ` · 📅 ${fmtDateLong(um.date)}` : ''}</div>
          <button className="btn btn-primary btn-big" onClick={() => setScreen('prematch')}>
            📋 Preparar alineación
          </button>
        </div>
      ) : !t.userAlive ? (
        <div className="next-match eliminated">
          <div className="nm-label">💔 ELIMINADO EN {STAGE_LABEL[t.userEliminatedAt]?.toUpperCase()}</div>
          <p>El sueño se acabó para {userTeam.flag} {userTeam.name}… pero el Mundial sigue.</p>
          <button
            className="btn btn-gold btn-big"
            onClick={() => { const nt = simulateToEnd(structuredClone(t)); save(nt); setT(nt) }}
          >
            ⏩ Ver cómo termina el Mundial
          </button>
        </div>
      ) : null}

      <div className="hub-tabs">
        <button className={`chip ${tab === 'equipo' ? 'on' : ''}`} onClick={() => setTab('equipo')}>👥 Equipo</button>
        <button className={`chip ${tab === 'grupos' ? 'on' : ''}`} onClick={() => setTab('grupos')}>📊 Grupos</button>
        <button className={`chip ${tab === 'cuadro' ? 'on' : ''}`} onClick={() => setTab('cuadro')}>🏆 Eliminatorias</button>
        <button className={`chip ${tab === 'ronda' ? 'on' : ''}`} onClick={() => setTab('ronda')}>📅 Esta ronda</button>
      </div>

      {tab === 'equipo' && <TeamStats t={t} team={userTeam} onPlayer={setSelPlayer} />}
      {tab === 'grupos' && <GroupTables t={t} />}
      {tab === 'cuadro' && <Bracket t={t} />}
      {tab === 'ronda' && (
        <div className="round-list">
          {[...roundMatches].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '')).map(f => (
            <div key={f.id} className={`round-match ${f.home === t.userTeamId || f.away === t.userTeamId ? 'mine' : ''}`}>
              <span className="rm-date">{fmtDate(f.date)}</span>
              <span className="rm-team">{TEAM_BY_ID[f.home].flag} {TEAM_BY_ID[f.home].name}</span>
              <span className="rm-score">{f.played ? `${f.score[0]} – ${f.score[1]}` : 'vs'}{f.pens && ` (${f.pens[0]}-${f.pens[1]})`}</span>
              <span className="rm-team right">{TEAM_BY_ID[f.away].name} {TEAM_BY_ID[f.away].flag}</span>
            </div>
          ))}
        </div>
      )}

      {selPlayer && <PlayerCard player={selPlayer} team={userTeam} squad={effSquad(t, userTeam)} onClose={() => setSelPlayer(null)} />}
    </div>
  )
}
