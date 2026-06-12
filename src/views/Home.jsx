import { useEffect, useState } from 'react'
import { TEAMS } from '../data/teams.js'

const FINAL_DATE = new Date('2026-07-19T19:00:00')

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target.getTime() - now)
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  }
}

const FACTS = [
  { icon: '🌍', big: '48', label: 'selecciones', sub: 'el Mundial más grande de la historia' },
  { icon: '🏟️', big: '104', label: 'partidos', sub: 'en 16 estadios espectaculares' },
  { icon: '🗽', big: '3', label: 'países anfitriones', sub: 'EE. UU., Canadá y México' },
  { icon: '🏆', big: '19 JUL', label: 'la gran final', sub: 'MetLife Stadium, Nueva York' },
]

export default function Home({ go }) {
  const cd = useCountdown(FINAL_DATE)
  const top8 = [...TEAMS].sort((a, b) => b.rating - a.rating).slice(0, 8)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge pulse">🔴 EL MUNDIAL ESTÁ EN JUEGO</div>
        <h1 className="hero-title">
          <span className="t-red">MUN</span>
          <span className="t-green">DIAL</span>
          <span className="t-blue">2026</span>
        </h1>
        <p className="hero-sub">
          Estados Unidos · Canadá · México — 48 selecciones, un solo trofeo.
          Explora cada convocatoria y vive tu propio Mundial en el simulador.
        </p>

        <div className="countdown">
          <div className="countdown-label">⏳ Cuenta atrás para la Gran Final</div>
          <div className="countdown-grid">
            {[['Días', cd.d], ['Horas', cd.h], ['Min', cd.m], ['Seg', cd.s]].map(([l, v]) => (
              <div className="cd-box" key={l}>
                <div className="cd-num">{String(v).padStart(2, '0')}</div>
                <div className="cd-lab">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary btn-big" onClick={() => go('sim')}>
            🎮 Jugar el simulador
          </button>
          <button className="btn btn-ghost btn-big" onClick={() => go('teams')}>
            🌎 Ver los 48 equipos
          </button>
        </div>
      </section>

      <section className="facts">
        {FACTS.map(f => (
          <div className="fact-card" key={f.label}>
            <div className="fact-icon">{f.icon}</div>
            <div className="fact-big">{f.big}</div>
            <div className="fact-label">{f.label}</div>
            <div className="fact-sub">{f.sub}</div>
          </div>
        ))}
      </section>

      <section className="favorites">
        <h2 className="section-title">⭐ Las grandes favoritas</h2>
        <div className="fav-grid">
          {top8.map((t, i) => (
            <button className="fav-card" key={t.id} style={{ '--c1': t.colors[0], '--c2': t.colors[1], '--d': `${i * 70}ms` }} onClick={() => go('team', t.id)}>
              <span className="fav-rank">#{i + 1}</span>
              <span className="fav-flag">{t.flag}</span>
              <span className="fav-name">{t.name}</span>
              <span className="fav-rating">{t.rating}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
