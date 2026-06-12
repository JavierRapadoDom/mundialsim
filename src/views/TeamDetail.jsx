import { useMemo } from 'react'
import { TEAM_BY_ID, groupTeams } from '../data/teams.js'
import { getSquad, avgRating, coachOf } from '../data/squads.js'

const POS_LABEL = { POR: 'Porteros', DEF: 'Defensas', MED: 'Centrocampistas', DEL: 'Delanteros' }
const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }

export default function TeamDetail({ teamId, go }) {
  const team = TEAM_BY_ID[teamId]
  const squad = useMemo(() => (team ? getSquad(team) : []), [team])
  if (!team) return <p className="empty">Equipo no encontrado.</p>

  const rivals = groupTeams(team.group).filter(t => t.id !== team.id)
  const stars = squad.filter(p => p.star).sort((a, b) => b.r - a.r).slice(0, 6)

  return (
    <div className="team-detail">
      <button className="btn btn-ghost back-btn" onClick={() => go('teams')}>← Todos los equipos</button>

      <header className="td-hero" style={{ '--c1': team.colors[0], '--c2': team.colors[1] }}>
        <div className="td-flag">{team.flag}</div>
        <div className="td-info">
          <div className="td-tags">
            <span className="tag">GRUPO {team.group}</span>
            <span className="tag">{team.confed}</span>
            {team.host && <span className="tag tag-host">ANFITRIÓN</span>}
            {team.champion && <span className="tag tag-champ">🏆 CAMPEÓN {team.champion}</span>}
            {team.playoff && <span className="tag tag-playoff">VÍA REPESCA</span>}
          </div>
          <h1 className="td-name">{team.name}</h1>
          <div className="td-nick">«{team.nick}» · DT: {coachOf(team.id)}</div>
        </div>
        <div className="td-rating">
          <div className="td-rating-num">{team.rating}</div>
          <div className="td-rating-lab">VALORACIÓN</div>
          <div className="td-rating-sub">Media XI: {avgRating(squad.slice(0, 11))}</div>
        </div>
      </header>

      <section className="td-rivals">
        <span className="td-rivals-label">Rivales en el Grupo {team.group}:</span>
        {rivals.map(r => (
          <button key={r.id} className="rival-chip" onClick={() => go('team', r.id)}>
            {r.flag} {r.name}
          </button>
        ))}
      </section>

      <section>
        <h2 className="section-title">✨ Figuras del equipo</h2>
        <div className="stars-grid">
          {stars.map((p, i) => (
            <div className="star-card" key={p.id} style={{ '--c1': team.colors[0], '--c2': team.colors[1], '--d': `${i * 80}ms` }}>
              <div className="star-pos" style={{ background: POS_COLOR[p.pos] }}>{p.pos}</div>
              <div className="star-num">#{p.num}</div>
              <div className="star-name">{p.n} {p.captain && <span className="cap-badge">Ⓒ</span>}</div>
              <div className="star-club">{p.club}</div>
              <div className="star-rating">{p.r}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">📋 Convocatoria oficial · {squad.length} jugadores convocados</h2>
        {['POR', 'DEF', 'MED', 'DEL'].map(pos => (
          <div key={pos} className="squad-block">
            <h3 className="squad-pos-title" style={{ color: POS_COLOR[pos] }}>{POS_LABEL[pos]}</h3>
            <table className="squad-table">
              <thead>
                <tr><th>#</th><th>Jugador</th><th>Club</th><th>Edad</th><th>Int.</th><th>Media</th></tr>
              </thead>
              <tbody>
                {squad.filter(p => p.pos === pos).map(p => (
                  <tr key={p.id} className={p.star ? 'row-star' : ''}>
                    <td className="td-num">{p.num}</td>
                    <td className="td-player">
                      {p.n} {p.captain && <span className="cap-badge">Ⓒ</span>} {p.star && <span className="star-mini">★</span>}
                    </td>
                    <td className="td-club">{p.club}</td>
                    <td>{p.age}</td>
                    <td className="td-caps">{p.caps}</td>
                    <td>
                      <div className="rating-wrap">
                        <div className="rating-bar"><span style={{ width: `${p.r}%`, background: POS_COLOR[pos] }} /></div>
                        <span className="rating-num">{p.r}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <div className="td-cta">
        <button className="btn btn-primary btn-big" onClick={() => go('sim')}>
          🎮 Jugar el Mundial con {team.flag} {team.name}
        </button>
      </div>
    </div>
  )
}
