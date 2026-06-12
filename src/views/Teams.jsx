import { useMemo, useState } from 'react'
import { TEAMS, GROUPS } from '../data/teams.js'

const CONFEDS = ['Todas', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']

export default function Teams({ go }) {
  const [query, setQuery] = useState('')
  const [confed, setConfed] = useState('Todas')
  const [group, setGroup] = useState('Todos')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TEAMS.filter(t =>
      (confed === 'Todas' || t.confed === confed) &&
      (group === 'Todos' || t.group === group) &&
      (!q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
    )
  }, [query, confed, group])

  const byGroup = useMemo(() => {
    const map = {}
    for (const t of filtered) (map[t.group] ??= []).push(t)
    return map
  }, [filtered])

  return (
    <div className="teams-page">
      <h1 className="page-title">Los 48 equipos</h1>
      <p className="page-sub">Toca cualquier selección para ver su convocatoria completa.</p>

      <div className="filters">
        <input
          className="search"
          placeholder="🔍 Buscar selección…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="chips">
          {CONFEDS.map(c => (
            <button key={c} className={`chip ${confed === c ? 'on' : ''}`} onClick={() => setConfed(c)}>{c}</button>
          ))}
        </div>
        <div className="chips">
          <button className={`chip ${group === 'Todos' ? 'on' : ''}`} onClick={() => setGroup('Todos')}>Todos</button>
          {GROUPS.map(g => (
            <button key={g} className={`chip ${group === g ? 'on' : ''}`} onClick={() => setGroup(g)}>Grupo {g}</button>
          ))}
        </div>
      </div>

      {Object.keys(byGroup).sort().map(g => (
        <section key={g} className="group-section">
          <h2 className="group-title"><span>GRUPO {g}</span></h2>
          <div className="team-grid">
            {byGroup[g].map((t, i) => (
              <button
                key={t.id}
                className="team-card"
                style={{ '--c1': t.colors[0], '--c2': t.colors[1], '--d': `${i * 60}ms` }}
                onClick={() => go('team', t.id)}
              >
                <div className="team-card-top">
                  <span className="team-flag">{t.flag}</span>
                  {t.host && <span className="tag tag-host">ANFITRIÓN</span>}
                  {t.champion && <span className="tag tag-champ">🏆 CAMPEÓN</span>}
                  {t.playoff && <span className="tag tag-playoff">REPESCA</span>}
                </div>
                <div className="team-card-name">{t.name}</div>
                <div className="team-card-nick">{t.nick}</div>
                <div className="team-card-bottom">
                  <span className="confed-badge">{t.confed}</span>
                  <div className="rating-wrap">
                    <div className="rating-bar"><span style={{ width: `${t.rating}%` }} /></div>
                    <span className="rating-num">{t.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && <p className="empty">No hay equipos que coincidan con tu búsqueda 😢</p>}
    </div>
  )
}
