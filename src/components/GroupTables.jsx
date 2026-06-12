import { GROUPS, TEAM_BY_ID } from '../data/teams.js'
import { standings } from '../engine/tournament.js'

export default function GroupTables({ t }) {
  const groupsDone = t.stage !== 'groups'
  return (
    <div className="groups-grid">
      {GROUPS.map(g => {
        const rows = standings(t, g)
        return (
          <div className="group-box" key={g}>
            <div className="group-box-title">GRUPO {g}</div>
            <table className="standings">
              <thead>
                <tr><th></th><th className="left">Equipo</th><th>PJ</th><th>DG</th><th>PTS</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const team = TEAM_BY_ID[r.id]
                  const cls = groupsDone ? (i < 2 ? 'qualified' : i === 2 ? 'maybe' : 'out') : ''
                  return (
                    <tr key={r.id} className={`${cls} ${r.id === t.userTeamId ? 'user-row' : ''}`}>
                      <td className="pos-cell">{i + 1}</td>
                      <td className="left">{team.flag} {team.code}</td>
                      <td>{r.pj}</td>
                      <td>{r.gf - r.gc > 0 ? '+' : ''}{r.gf - r.gc}</td>
                      <td className="pts">{r.pts}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
