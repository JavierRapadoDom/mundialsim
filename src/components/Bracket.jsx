import { TEAM_BY_ID } from '../data/teams.js'
import { winnerOf } from '../engine/tournament.js'

const ROUNDS = [
  ['R32', 'Dieciseisavos'],
  ['R16', 'Octavos'],
  ['QF', 'Cuartos'],
  ['SF', 'Semifinales'],
  ['F', 'FINAL 🏆'],
]

function Slot({ id, score, pens, win, user }) {
  const team = id ? TEAM_BY_ID[id] : null
  return (
    <div className={`bk-slot ${win ? 'win' : ''} ${user ? 'user' : ''}`}>
      <span className="bk-team">{team ? `${team.flag} ${team.code}` : '· · ·'}</span>
      <span className="bk-score">
        {score != null ? score : ''}
        {pens != null && <small> ({pens})</small>}
      </span>
    </div>
  )
}

export default function Bracket({ t }) {
  return (
    <div className="bracket-scroll">
      <div className="bracket">
        {ROUNDS.map(([key, label]) => (
          <div className="bk-round" key={key}>
            <div className="bk-round-title">{label}</div>
            <div className="bk-matches">
              {(t.bracket[key] ?? []).map(f => {
                const w = winnerOf(f)
                return (
                  <div className="bk-match" key={f.id}>
                    <Slot id={f.home} score={f.played ? f.score[0] : null} pens={f.pens?.[0]} win={f.played && w === f.home} user={f.home === t.userTeamId} />
                    <Slot id={f.away} score={f.played ? f.score[1] : null} pens={f.pens?.[1]} win={f.played && w === f.away} user={f.away === t.userTeamId} />
                  </div>
                )
              })}
              {(t.bracket[key] ?? []).length === 0 && (
                <div className="bk-empty">Por definir…</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
