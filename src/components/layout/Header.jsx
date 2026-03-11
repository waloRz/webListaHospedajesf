/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  Header — src/components/layout/Header.jsx                             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * COMPORTAMIENTO GENERAL:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Estado TRANSPARENTE (solo en homepage, antes de scroll)                 │
 * │   - Fondo: transparente (el hero se ve debajo)                          │
 * │   - Logo/nav: colores claros (text-arena)                               │
 * │   - Sombra: ninguna                                                     │
 * │   - Barra de búsqueda: VISIBLE (solo homepage)                          │
 * │                                                                         │
 * │ Estado SÓLIDO (todas las páginas, o al scrollear en homepage)           │
 * │   - Fondo: bg-noche (#1A2332) con backdrop-blur                        │
 * │   - Logo/nav: colores claros (texto arena, acento barro)                │
 * │   - Sombra: shadow-header                                               │
 * │   - Barra de búsqueda: OCULTA (se desvanece al scrollear)               │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * LAYOUT HEADER:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  🏔 Hospedajes San Francisco  │  Inicio Hospedajes Mapa Contacto  │ ☰│
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  [🔍  Buscar hospedaje por nombre o categoría...]  [Buscar]          │ ← solo homepage + no scrolled
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * DRAWER MOBILE:
 * Se desliza desde la DERECHA (off-canvas) cubriendo el 80% del ancho.
 * Contiene: logo pequeño, nav links con íconos, barra de búsqueda,
 * y una sección de acceso rápido al mapa.
 * Se cierra con: botón ✕, click en overlay, o tecla Escape.
 *
 * Props:
 *   transparente {bool} — true solo cuando la ruta es "/" (Homepage)
 *                         Lo maneja Layout.jsx automáticamente.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useNavigate }                from 'react-router-dom'
import {
  Mountain, Menu, X, Search, Home, Hotel,
  Map, Mail, ChevronRight, Phone,
} from 'lucide-react'

// ── Definición de los ítems de navegación ────────────────────────────────────
// Se usa tanto en la nav desktop como en el drawer mobile.
const NAV_ITEMS = [
  { to: '/',           label: 'Inicio',     icono: <Home   size={16} strokeWidth={2} />, end: true  },
  { to: '/hospedajes', label: 'Hospedajes', icono: <Hotel  size={16} strokeWidth={2} />, end: false },
  { to: '/mapa',       label: 'Mapa',       icono: <Map    size={16} strokeWidth={2} />, end: false },
  { to: '/contacto',   label: 'Contacto',   icono: <Mail   size={16} strokeWidth={2} />, end: false },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function Header({ transparente = false }) {
  const navigate = useNavigate()

  // ── Estado ───────────────────────────────────────────────────────────────
  const [scrolled,      setScrolled]      = useState(false)
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [busqueda,      setBusqueda]      = useState('')

  // Ref para el input de búsqueda (para enfocar con atajos de teclado)
  const inputRef = useRef(null)

  // ── Detectar scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    // Inicializar el estado al montar (por si ya hay scroll)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Bloquear scroll del body cuando el drawer está abierto ───────────────
  useEffect(() => {
    document.body.style.overflow = drawerAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerAbierto])

  // ── Cerrar drawer con Escape ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerAbierto(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // ── Enviar búsqueda ──────────────────────────────────────────────────────
  const handleBuscar = useCallback((e) => {
    e?.preventDefault()
    const q = busqueda.trim()
    if (!q) {
      navigate('/hospedajes')
    } else {
      // Navega a /hospedajes con el query como parámetro de URL.
      // HospedajesPage puede leer esto con useSearchParams() en el futuro.
      // Por ahora lleva a la página y el filtro manual aplica.
      navigate(`/hospedajes?q=${encodeURIComponent(q)}`)
    }
    setBusqueda('')
    setDrawerAbierto(false)
  }, [busqueda, navigate])

  // ── Derivados de estado ───────────────────────────────────────────────────
  // El header es transparente SOLO si estamos en la home Y no se ha scrolleado
  const esTransparente = transparente && !scrolled
  // La barra de búsqueda se muestra solo si estamos en home Y no scrolleado
  const mostrarBusqueda = transparente && !scrolled

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER PRINCIPAL
          ────────────────────────────────────────────────────────────────────
          sticky top-0 z-50: siempre visible al tope de la pantalla.

          Transición de color:
            transparente → bg-transparent (deja ver el hero debajo)
            sólido       → bg-noche/95 + backdrop-blur-md (cristal oscuro)

          La altura varía:
            Con barra de búsqueda (home, no scrolleado): h-auto (dos filas)
            Sin barra de búsqueda: h-16 (una fila de 64px)
      ══════════════════════════════════════════════════════════════════════ */}
      <header
        className={`
          sticky top-0 z-50
          transition-all duration-300 ease-in-out
          ${esTransparente
            ? 'bg-cielo-500/90 backdrop-blur-sm'
            : 'bg-cielo-500 shadow-header'
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── FILA PRINCIPAL: logo + nav + hamburguesa ── */}
          <div className="flex items-center justify-between h-16 gap-6">

            {/* ── LOGO ─────────────────────────────────────────────────────
                Fuente: font-display (Playfair Display) — serif elegante.
                "Hospedajes" en text-arena, "San Francisco" en text-barro-400.
                El ícono Mountain de lucide cambia de tamaño y color con hover.
            ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="Ir al inicio — Hospedajes San Francisco Jujuy"
            >
              {/* Ícono de montaña: rotación sutil en hover */}
              <Mountain
                size={28}
                strokeWidth={1.5}
                className="text-noche group-hover:text-noche/70
                           transition-all duration-300 group-hover:scale-110"
              />
              {/* Texto del logo: dos partes con colores distintos */}
              <span className="font-display leading-none">
                <span className="text-white text-[17px] tracking-tight">
                  Hospedajes en{' '}
                </span>
                <span className="text-noche text-[17px] tracking-tight
                                 group-hover:text-noche/70 transition-colors duration-200">
                  San Francisco
                </span>
              </span>
            </Link>

            {/* ── NAV DESKTOP (md y arriba) ─────────────────────────────────
                hidden en mobile, flex en md+.
                Cada NavLink tiene:
                  - Estado activo: text-barro-400 + línea indicadora abajo
                  - Estado hover: text-arena (desde arena/60)
                  - Transición suave de color
            ── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Navegación principal"
            >
              {NAV_ITEMS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `
                    relative px-3.5 py-2 rounded-lg
                    text-sm font-medium tracking-wide
                    transition-all duration-200
                    ${isActive
                      ? 'text-white font-semibold bg-black/[0.12]'
                      : 'text-white/90 hover:text-white hover:bg-black/[0.08]'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {/* Línea indicadora activa — aparecer con scale */}
                      <span
                        className={`
                          absolute bottom-0.5 left-1/2 -translate-x-1/2
                          h-0.5 bg-barro-400 rounded-full
                          transition-all duration-300 origin-center
                          ${isActive ? 'w-4 opacity-100 bg-noche' : 'w-0 opacity-0 bg-noche'}
                        `}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── BOTÓN HAMBURGUESA (mobile, < md) ────────────────────────
                Alterna entre ícono Menu y X con animación.
                aria-expanded para accesibilidad de lectores de pantalla.
            ── */}
            <button
              onClick={() => setDrawerAbierto(true)}
              className="md:hidden flex items-center justify-center
                         w-9 h-9 rounded-lg
                         text-white/90 hover:text-white
                         hover:bg-black/10
                         transition-all duration-200 active:scale-90"
              aria-label="Abrir menú de navegación"
              aria-expanded={drawerAbierto}
              aria-controls="drawer-mobile"
            >
              <Menu size={22} strokeWidth={2} />
            </button>

          </div>
          {/* ── FIN fila principal ── */}

          {/* ══════════════════════════════════════════════════════════════
              BARRA DE BÚSQUEDA RÁPIDA
              ────────────────────────────────────────────────────────────
              Solo se muestra en la homepage Y antes de hacer scroll.
              Transición: opacity + max-height + padding (smooth desvanecido).

              Al enviar: navega a /hospedajes (con query si hay texto).
              En desktop: bajo la fila principal, ancho completo.
              En mobile: oculto (el drawer tiene su propia búsqueda).
          ══════════════════════════════════════════════════════════════ */}
          <div
            className={`
              hidden md:block
              overflow-hidden
              transition-all duration-400 ease-in-out
              ${mostrarBusqueda
                ? 'max-h-20 opacity-100 pb-4'
                : 'max-h-0 opacity-0 pb-0'
              }
            `}
            aria-hidden={!mostrarBusqueda}
          >
            <form
              onSubmit={handleBuscar}
              className="relative flex items-center"
              role="search"
              aria-label="Buscar hospedajes"
            >
              {/* Ícono de búsqueda */}
              <Search
                size={16}
                strokeWidth={2}
                className="absolute left-4 top-1/2 -translate-y-1/2
                           text-white/50 pointer-events-none"
              />

              {/* Input de búsqueda */}
              <input
                ref={inputRef}
                type="search"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar hospedaje por nombre, categoría o servicio…"
                className="w-full pl-11 pr-36 py-3
                           bg-black/10 backdrop-blur-sm
                           border border-black/10 hover:border-black/20
                           focus:border-noche/40 focus:bg-black/15
                           text-white placeholder-white/50 text-sm
                           rounded-xl outline-none
                           transition-all duration-200"
                autoComplete="off"
                aria-label="Buscar hospedajes"
              />

              {/* Botón enviar */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2
                           flex items-center gap-1.5
                           bg-tierra-500 hover:bg-tierra-400
                           text-white text-xs font-semibold
                           px-4 py-2 rounded-lg
                           transition-colors duration-200 active:scale-[0.96]"
              >
                <Search size={13} strokeWidth={2.5} />
                Buscar
              </button>
            </form>
          </div>
          {/* ── FIN barra de búsqueda ── */}

        </div>
      </header>
      {/* ── FIN header principal ── */}

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAY DEL DRAWER (mobile)
          ────────────────────────────────────────────────────────────────────
          Fondo semitransparente que oscurece el contenido cuando el drawer
          está abierto. Click en el overlay cierra el drawer.
          z-[55]: entre el header (z-50) y el drawer (z-[60]).
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        onClick={() => setDrawerAbierto(false)}
        aria-hidden="true"
        className={`
          md:hidden fixed inset-0 z-[55]
          bg-noche-dark/70 backdrop-blur-[2px]
          transition-opacity duration-300
          ${drawerAbierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          DRAWER MOBILE — Panel lateral derecho
          ────────────────────────────────────────────────────────────────────
          Posición: fixed right-0, ocupa el 80% del ancho de la pantalla.
          Animación: translate-x-full (fuera) → translate-x-0 (dentro).
          z-[60]: sobre el overlay.

          CONTENIDO DEL DRAWER (de arriba a abajo):
          ┌──────────────────────────────┐
          │ [🏔 Logo]           [✕]      │  ← Cabecera
          ├──────────────────────────────┤
          │ [🔍 Buscar...]    [Ir]       │  ← Búsqueda
          ├──────────────────────────────┤
          │ 🏠 Inicio              →     │
          │ 🏨 Hospedajes          →     │  ← Nav links
          │ 🗺 Mapa                →     │
          │ ✉ Contacto             →     │
          ├──────────────────────────────┤
          │ 📞 Acceso rápido al mapa     │  ← CTA inferior
          └──────────────────────────────┘
      ══════════════════════════════════════════════════════════════════════ */}
      <aside
        id="drawer-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`
          md:hidden
          fixed top-0 right-0 bottom-0 z-[60]
          w-4/5 max-w-xs
          bg-cielo-700 flex flex-col
          shadow-[−8px_0_40px_rgba(0,0,0,0.3)]
          transition-transform duration-300 ease-out
          ${drawerAbierto ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

        {/* ── Cabecera del drawer ── */}
        <div className="flex items-center justify-between
                        px-5 py-4 border-b border-black/10">
          {/* Logo compacto */}
          <Link
            to="/"
            onClick={() => setDrawerAbierto(false)}
            className="flex items-center gap-2"
          >
            <Mountain size={22} strokeWidth={1.5} className="text-noche" />
            <span className="font-display text-sm text-white">
              Hospedajes en <span className="text-noche">SF</span>
            </span>
          </Link>

          {/* Botón cerrar */}
          <button
            onClick={() => setDrawerAbierto(false)}
            className="w-8 h-8 flex items-center justify-center
                       rounded-full bg-black/10 hover:bg-black/20
                       text-white/80 hover:text-white
                       transition-all duration-150 active:scale-90"
            aria-label="Cerrar menú"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Buscador dentro del drawer ── */}
        <div className="px-5 py-4 border-b border-black/10">
          <form onSubmit={handleBuscar} className="relative">
            <Search
              size={14}
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2
                         text-arena/35 pointer-events-none"
            />
            <input
              type="search"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar hospedaje…"
              className="w-full pl-9 pr-4 py-2.5
                         bg-black/10 border border-black/10
                         focus:border-noche/40 focus:bg-black/15
                         text-white placeholder-white/45 text-sm
                         rounded-xl outline-none transition-all duration-200"
              autoComplete="off"
            />
          </form>
        </div>

        {/* ── Nav links del drawer ─────────────────────────────────────────
            Cada ítem: ícono + label + chevron derecho.
            Estado activo: fondo tierra/10, texto barro-400.
            Al hacer click cierra el drawer automáticamente.
        ── */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label="Menú mobile">
          <p className="text-[10px] font-bold uppercase tracking-widest
                        text-white/40 px-3 mb-2">
            Navegación
          </p>
          {NAV_ITEMS.map(({ to, label, icono, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setDrawerAbierto(false)}
              className={({ isActive }) => `
                flex items-center gap-3
                px-3 py-3.5 rounded-xl mb-1
                transition-all duration-150
                ${isActive
                  ? 'bg-black/15 text-white font-semibold'
                  : 'text-white/80 hover:text-white hover:bg-black/[0.08]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Ícono de la sección */}
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {icono}
                  </span>
                  {/* Label */}
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  {/* Chevron */}
                  <ChevronRight
                    size={14}
                    strokeWidth={2}
                    className={`shrink-0 transition-all duration-200
                      ${isActive
                        ? 'text-white translate-x-0.5'
                        : 'text-white/30'
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── CTA inferior del drawer ──────────────────────────────────────
            Zona visual de acceso rápido al mapa.
            Separada del nav por un borde superior.
            Se diseñó con gradiente tierra para llamar la atención.
        ── */}
        <div className="px-5 py-5 border-t border-black/10">
          <Link
            to="/mapa"
            onClick={() => setDrawerAbierto(false)}
            className="flex items-center gap-3
                       bg-noche/30 hover:bg-noche/40
                       text-white rounded-xl px-4 py-3.5
                       transition-all duration-200 active:scale-[0.97]"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15
                             flex items-center justify-center shrink-0">
              <Map size={16} strokeWidth={2} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                Ver mapa de hospedajes
              </p>
              <p className="text-xs text-white/55 truncate">
                San Francisco, Valle Grande, Jujuy
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={2} className="text-white/40 shrink-0" />
          </Link>
        </div>

      </aside>
      {/* ── FIN drawer mobile ── */}
    </>
  )
}
