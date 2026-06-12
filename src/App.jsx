import { useState } from 'react'
import Home from './views/Home.jsx'
import Teams from './views/Teams.jsx'
import TeamDetail from './views/TeamDetail.jsx'
import Simulator from './views/Simulator.jsx'

const NAV = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'teams', label: 'Equipos', icon: '🌎' },
  { id: 'sim', label: 'Simulador', icon: '🎮' },
]

export default function App() {
  const [route, setRoute] = useState({ page: 'home', teamId: null })

  const go = (page, teamId = null) => {
    setRoute({ page, teamId })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app">
      <div className="bg-decor" aria-hidden="true">
        <div className="blob blob-red" />
        <div className="blob blob-green" />
        <div className="blob blob-blue" />
      </div>

      <header className="topbar">
        <button className="brand" onClick={() => go('home')}>
          <span className="brand-ball">⚽</span>
          <span className="brand-text">
            MUNDIAL<b>26</b>
          </span>
          <span className="brand-hosts">🇺🇸 🇨🇦 🇲🇽</span>
        </button>
        <nav className="nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn ${route.page === n.id || (n.id === 'teams' && route.page === 'team') ? 'active' : ''}`}
              onClick={() => go(n.id)}
            >
              <span className="nav-icon">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="content" key={route.page + (route.teamId ?? '')}>
        {route.page === 'home' && <Home go={go} />}
        {route.page === 'teams' && <Teams go={go} />}
        {route.page === 'team' && <TeamDetail teamId={route.teamId} go={go} />}
        {route.page === 'sim' && <Simulator go={go} />}
      </main>

      <footer className="footer">
        <span>Copa Mundial de la FIFA 2026™ · Estados Unidos · Canadá · México</span>
        <span className="footer-note">Web no oficial creada con ⚽ y React · Convocatorias oficiales de 26 jugadores (junio 2026)</span>
      </footer>
    </div>
  )
}
