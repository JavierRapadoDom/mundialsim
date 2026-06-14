import { createPortal } from 'react-dom'
import { SPEC_FULL } from '../data/positions.js'
import { coachOf } from '../data/squads.js'

const POS_COLOR = { POR: '#f4a261', DEF: '#4895ef', MED: '#2dc653', DEL: '#e63946' }
const LINE_LABEL = { POR: 'Portería', DEF: 'Defensa', MED: 'Centro del campo', DEL: 'Ataque' }

const initials = name => {
  const parts = name.replace(/[^\p{L} ]/gu, '').trim().split(/\s+/)
  const a = parts[0]?.[0] ?? ''
  const b = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? '')
  return (a + b).toUpperCase()
}

// Avatar determinista: camiseta en los colores del equipo con dorsal e iniciales.
// (No hay fotos reales de los 1248 jugadores; el avatar identifica a cada uno.)
export function Avatar({ player, team, size = 132 }) {
  const [c1, c2] = team.colors
  const gid = `g-${player.id}`
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="avatar">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#${gid})`} stroke="rgba(255,255,255,.25)" strokeWidth="2" />
      <circle cx="60" cy="60" r="58" fill="rgba(0,0,0,.18)" />
      {/* hombros / camiseta */}
      <path d="M22 120 Q22 86 60 84 Q98 86 98 120 Z" fill="rgba(255,255,255,.14)" />
      <text x="60" y="58" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="40" fill="#fff" style={{ textShadow: '0 2px 6px rgba(0,0,0,.5)' }}>{initials(player.n)}</text>
      <text x="60" y="104" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="20" fill="#fff" opacity="0.92">#{player.num}</text>
      <text x="98" y="26" textAnchor="middle" fontSize="20">{team.flag}</text>
    </svg>
  )
}

function curiosities(p, team, squad) {
  const facts = []
  const byCaps = [...squad].sort((a, b) => b.caps - a.caps)
  const capsRank = byCaps.findIndex(x => x.id === p.id) + 1
  const byAge = [...squad].sort((a, b) => b.age - a.age)
  const oldest = byAge[0], youngest = byAge[byAge.length - 1]

  // Leyenda: datos propios de su época, no internacionalidades del torneo actual
  if (p.legend) {
    facts.push(`🏆 Leyenda de la selección, traída en su mejor versión`)
    facts.push(`🕰️ En su prime jugaba en el ${p.club} (${p.era})`)
    facts.push(`⭐ Media en su apogeo: ${p.r}`)
    if (p.posSet?.length > 1) facts.push(`🔄 Podía jugar de ${SPEC_FULL[p.posSet[0]].toLowerCase()} y de ${SPEC_FULL[p.posSet[1]].toLowerCase()}`)
    if (p.dev > 0) facts.push(`📈 Aún rinde: +${p.dev} de media en este Mundial`)
    return facts
  }

  if (p.captain) facts.push('🎽 Lleva el brazalete de capitán de la selección')
  if (p.star) facts.push('⭐ Es una de las figuras del equipo')
  if (capsRank === 1) facts.push(`🧢 El jugador más internacional de la convocatoria (${p.caps} partidos)`)
  else if (capsRank <= 3) facts.push(`🧢 ${capsRank}º jugador con más internacionalidades del equipo (${p.caps})`)
  if (p.caps >= 100) facts.push('💯 Pertenece al club de los centenarios de internacionalidades')
  if (p.id === youngest.id) facts.push(`🐣 El más joven de la lista, con solo ${p.age} años`)
  else if (p.age <= 20) facts.push(`✨ Una de las grandes promesas (${p.age} años)`)
  if (p.id === oldest.id) facts.push(`🦉 El más veterano de la convocatoria, con ${p.age} años`)
  else if (p.age >= 35) facts.push(`🧓 Veteranía pura a sus ${p.age} años`)
  if (p.caps <= 5) facts.push(`🌱 Debutante o casi: apenas ${p.caps} partidos con la absoluta`)

  const byR = [...squad].sort((a, b) => b.r - a.r)
  const rRank = byR.findIndex(x => x.id === p.id) + 1
  if (rRank === 1) facts.push('👑 El jugador de mayor media del equipo')
  if (p.posSet && p.posSet.length >= 3) facts.push(`🎯 Comodín total: rinde en ${p.posSet.length} demarcaciones distintas`)
  else if (p.posSet && p.posSet.length === 2) facts.push(`🔄 Polivalente: juega de ${SPEC_FULL[p.posSet[0]].toLowerCase()} y de ${SPEC_FULL[p.posSet[1]].toLowerCase()}`)
  facts.push(`🏟️ Juega en el ${p.club}`)
  if (p.dev > 0) facts.push(`📈 Ha subido ${p.dev} de media durante este Mundial`)
  return facts
}

export default function PlayerCard({ player, team, squad, onClose }) {
  if (!player) return null
  const st = player.stats // disponible si viene del simulador (effSquad)
  const facts = curiosities(player, team, squad)
  const lineColor = POS_COLOR[player.pos]

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal player-modal" onClick={e => e.stopPropagation()} style={{ '--c1': team.colors[0], '--c2': team.colors[1] }}>
        <button className="pc-close" onClick={onClose}>✕</button>

        <header className="pc-head">
          <Avatar player={player} team={team} />
          <div className="pc-id">
            <div className="pc-tags">
              <span className="pc-pos" style={{ background: lineColor }}>{player.npos}</span>
              {player.legend && <span className="tag tag-champ">🏆 Leyenda</span>}
              {player.star && !player.legend && <span className="tag tag-champ">★ Figura</span>}
              {player.captain && <span className="tag">Ⓒ Capitán</span>}
            </div>
            <h2 className="pc-name">{player.n}</h2>
            <div className="pc-sub">{team.flag} {team.name} · #{player.num}</div>
            <div className="pc-role">{SPEC_FULL[player.npos]} · {LINE_LABEL[player.pos]}</div>
            {player.posSet && player.posSet.length > 1 && (
              <div className="pc-altpos">
                🔄 También: {player.posSet.slice(1).map(x => <span key={x} className="pc-altpos-chip">{x}</span>)}
              </div>
            )}
          </div>
          <div className="pc-rating">
            <div className="pc-rating-num">{player.r}{player.dev > 0 && <span className="dev-up"> ▲{player.dev}</span>}</div>
            <div className="pc-rating-lab">MEDIA</div>
          </div>
        </header>

        <div className="pc-grid">
          <div className="pc-stat"><div className="pc-stat-num">{player.age}</div><div className="pc-stat-lab">años (prime)</div></div>
          {player.legend
            ? <div className="pc-stat"><div className="pc-stat-num" style={{ fontSize: '15px' }}>{player.era}</div><div className="pc-stat-lab">su época</div></div>
            : <div className="pc-stat"><div className="pc-stat-num">{player.caps}</div><div className="pc-stat-lab">internacionalidades</div></div>}
          <div className="pc-stat"><div className="pc-stat-num">{player.npos}</div><div className="pc-stat-lab">demarcación</div></div>
          {st && st.pj > 0 && (
            <>
              <div className="pc-stat"><div className="pc-stat-num">{st.pj}</div><div className="pc-stat-lab">partidos (Mundial)</div></div>
              <div className="pc-stat"><div className="pc-stat-num">{st.min}'</div><div className="pc-stat-lab">minutos</div></div>
              <div className="pc-stat"><div className="pc-stat-num">{st.g}</div><div className="pc-stat-lab">goles</div></div>
              <div className="pc-stat"><div className="pc-stat-num">{st.a}</div><div className="pc-stat-lab">asistencias</div></div>
              <div className="pc-stat"><div className="pc-stat-num">{st.yc}</div><div className="pc-stat-lab">amarillas</div></div>
            </>
          )}
        </div>

        <div className="pc-personal">
          <div className="pc-row"><span>Club</span><b>{player.club}</b></div>
          <div className="pc-row"><span>Seleccionador</span><b>{coachOf(team.id)}</b></div>
          <div className="pc-row"><span>Grupo</span><b>{team.group}</b></div>
        </div>

        <h3 className="pc-facts-title">💡 Datos curiosos</h3>
        <ul className="pc-facts">
          {facts.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>
    </div>,
    document.body
  )
}
