/**
 * BottomNav — src/components/layout/BottomNav.jsx
 *
 * Barra de navegación fija en la parte inferior, visible solo en mobile (md:hidden).
 * Muestra los 4 ítems principales con ícono + label.
 * El ítem activo resalta con color cielo y una línea indicadora arriba.
 */

import { NavLink } from 'react-router-dom'
import { Home, Hotel, Map, Mail } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',           label: 'Inicio',     icono: Home,  end: true  },
  { to: '/hospedajes', label: 'Hospedajes', icono: Hotel, end: false },
  { to: '/mapa',       label: 'Mapa',       icono: Map,   end: false },
  { to: '/contacto',   label: 'Contacto',   icono: Mail,  end: false },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50
                    bg-white border-t border-arena-dark
                    shadow-[0_-2px_16px_rgba(26,35,50,0.10)]">
      <div className="grid grid-cols-4 h-16">
        {NAV_ITEMS.map(({ to, label, icono: Icono, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center gap-0.5
              text-[10px] font-semibold tracking-wide
              transition-colors duration-150
              ${isActive
                ? 'text-cielo-500'
                : 'text-tierra-300 hover:text-tierra-500'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Línea indicadora arriba del ítem activo */}
                {isActive && (
                  <span className="absolute top-0 inset-x-3 h-[2.5px]
                                   bg-cielo-500 rounded-full" />
                )}
                <Icono
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
