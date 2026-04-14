/**
 * BottomNav — src/components/layout/BottomNav.jsx
 *
 * Barra de navegación fija en la parte inferior, visible solo en mobile (md:hidden).
 * Muestra los 4 ítems principales con ícono personalizado + label.
 * El ítem activo resalta con color cielo y una línea indicadora arriba.
 *
 * Íconos: /public/img/nav/inicio.webp | hospedaje.webp | mapa.webp | contacto.webp
 */

import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/',           label: 'Inicio',     icono: '/img/nav/inicio.webp',    end: true  },
  { to: '/hospedajes', label: 'Hospedajes', icono: '/img/nav/hospedaje.webp', end: false },
  { to: '/mapa',       label: 'Mapa',       icono: '/img/nav/mapa.webp',      end: false },
  { to: '/contacto',   label: 'Contacto',   icono: '/img/nav/contacto.webp',  end: false },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50
                    bg-white border-t border-arena-dark
                    shadow-[0_-2px_16px_rgba(26,35,50,0.10)]">
      <div className="grid grid-cols-4 h-16">
        {NAV_ITEMS.map(({ to, label, icono, end }) => (
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

                {/* Ícono personalizado WebP
                    opacity-50 inactivo → opacity-100 activo
                    El filtro cielo solo aplica cuando está activo */}
                <img
                  src={icono}
                  alt={label}
                  width={22}
                  height={22}
                  className={`
                    object-contain transition-all duration-150
                    ${isActive ? 'opacity-100' : 'opacity-40'}
                  `}
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
