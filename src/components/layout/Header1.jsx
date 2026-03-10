import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Mountain } from 'lucide-react'

export default function Header({ transparente = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const esTransparente = transparente && !scrolled

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${esTransparente ? 'bg-transparent' : 'bg-noche shadow-header'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Mountain size={26} className="text-barro-400 group-hover:text-barro-300 transition-colors" />
            <span className="font-display text-lg  text-arena leading-none">
              Hospedajes <span className="text-barro-400">San Francisco</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[{ to: '/', label: 'Inicio' }, { to: '/hospedajes', label: 'Hospedajes' }, { to: '/mapa', label: 'Mapa' }].map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-barro-400' : 'text-arena/70 hover:text-arena'}`
                }>{label}</NavLink>
            ))}
          </nav>

          <button className="md:hidden text-arena/80 hover:text-arena" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="md:hidden bg-noche-light border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {[{ to: '/', label: 'Inicio' }, { to: '/hospedajes', label: 'Hospedajes' }, { to: '/mapa', label: 'Mapa' }].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuAbierto(false)}
              className={({ isActive }) => `text-base font-medium py-1 ${isActive ? 'text-barro-400' : 'text-arena/80'}`}>
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
