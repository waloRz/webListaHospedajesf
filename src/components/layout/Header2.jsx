/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  Header — src/components/layout/Header.jsx                             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * COMPORTAMIENTO GENERAL:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Estado TRANSPARENTE (solo en homepage, antes de scroll)                 │
 * │   - Fondo: transparente (el hero se ve debajo)                          │
 * │   - Logo/nav: colores claros                                            │
 * │   - Sombra: ninguna                                                     │
 * │   - Barra de búsqueda: VISIBLE (solo homepage)                          │
 * │                                                                         │
 * │ Estado SÓLIDO (todas las páginas, o al scrollear en homepage)           │
 * │   - Fondo: bg-teal-600 con backdrop-blur (Turquesa vibrante)            │
 * │   - Logo/nav: colores claros (texto blanco, acento ámbar)               │
 * │   - Sombra: shadow-header                                               │
 * │   - Barra de búsqueda: OCULTA (se desvanece al scrollear)               │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Mountain,
  Menu,
  X,
  Search,
  Home,
  Hotel,
  Map,
  Mail,
  ChevronRight,
  Phone,
} from "lucide-react";

// ── Definición de los ítems de navegación ────────────────────────────────────
const NAV_ITEMS = [
  {
    to: "/",
    label: "Inicio",
    icono: <Home size={16} strokeWidth={2} />,
    end: true,
  },
  {
    to: "/hospedajes",
    label: "Hospedajes",
    icono: <Hotel size={16} strokeWidth={2} />,
    end: false,
  },
  {
    to: "/mapa",
    label: "Mapa",
    icono: <Map size={16} strokeWidth={2} />,
    end: false,
  },
  {
    to: "/contacto",
    label: "Contacto",
    icono: <Mail size={16} strokeWidth={2} />,
    end: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Header({ transparente = false }) {
  const navigate = useNavigate();

  // ── Estado ───────────────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Ref para el input de búsqueda
  const inputRef = useRef(null);

  // ── Detectar scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Bloquear scroll del body ─────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerAbierto]);

  // ── Cerrar drawer con Escape ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ── Enviar búsqueda ──────────────────────────────────────────────────────
  const handleBuscar = useCallback(
    (e) => {
      e?.preventDefault();
      const q = busqueda.trim();
      if (!q) {
        navigate("/hospedajes");
      } else {
        navigate(`/hospedajes?q=${encodeURIComponent(q)}`);
      }
      setBusqueda("");
      setDrawerAbierto(false);
    },
    [busqueda, navigate],
  );

  const mostrarBusqueda = transparente && !scrolled;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER PRINCIPAL
      ══════════════════════════════════════════════════════════════════════ */}
      <header
        className={`
    sticky top-0 z-50
    transition-all duration-300 ease-in-out 
    /* Gradiente: Turquesa -> Azul Cielo -> Azul Profundo */
    bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-400
    backdrop-blur-md shadow-lg
  `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── FILA PRINCIPAL ── */}
          <div className="flex items-center justify-between h-16 gap-6">
            {/* ── LOGO ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="Ir al inicio — Hospedajes San Francisco Jujuy"
            >
              <Mountain
                size={28}
                strokeWidth={1.5}
                className="text-amber-400 group-hover:text-amber-300
                           transition-all duration-300 group-hover:scale-110"
              />
              <span className="font-display leading-none">
                <span className="text-white text-[17px] tracking-tight">
                  Hospedajes{" "}
                </span>
                <span
                  className="text-amber-400 text-[17px] tracking-tight
                                 group-hover:text-amber-300 transition-colors duration-200"
                >
                  San Francisco
                </span>
              </span>
            </Link>

            {/* ── NAV DESKTOP ── */}
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
                    ${
                      isActive
                        ? "text-amber-400 bg-white/[0.10]"
                        : "text-white/90 hover:text-white hover:bg-white/[0.08]"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`
                          absolute bottom-0.5 left-1/2 -translate-x-1/2
                          h-0.5 bg-amber-400 rounded-full
                          transition-all duration-300 origin-center
                          ${isActive ? "w-4 opacity-100" : "w-0 opacity-0"}
                        `}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── BOTÓN HAMBURGUESA ── */}
            <button
              onClick={() => setDrawerAbierto(true)}
              className="md:hidden flex items-center justify-center
                         w-9 h-9 rounded-lg
                         text-white/80 hover:text-white
                         hover:bg-white/10
                         transition-all duration-200 active:scale-90"
              aria-label="Abrir menú de navegación"
              aria-expanded={drawerAbierto}
              aria-controls="drawer-mobile"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>

          {/* ── BARRA DE BÚSQUEDA RÁPIDA ── */}
          <div
            className={`
              hidden md:block
              overflow-hidden
              transition-all duration-400 ease-in-out
              ${
                mostrarBusqueda
                  ? "max-h-20 opacity-100 pb-4"
                  : "max-h-0 opacity-0 pb-0"
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
              <Search
                size={16}
                strokeWidth={2}
                className="absolute left-4 top-1/2 -translate-y-1/2
                           text-white/40 pointer-events-none"
              />
              <input
                ref={inputRef}
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar hospedaje por nombre, categoría o servicio…"
                className="w-full pl-11 pr-36 py-3
                           bg-white/10 backdrop-blur-sm
                           border border-white/15 hover:border-white/25
                           focus:border-amber-400/60 focus:bg-white/15 text-white
                           placeholder:text-white/40 text-sm
                           rounded-xl outline-none
                           transition-all duration-200"
                autoComplete="off"
                aria-label="Buscar hospedajes"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2
             flex items-center gap-1.5
             /* Fondo naranja vibrante con gradiente interno */
             bg-gradient-to-br from-orange-500 to-amber-600
             hover:from-orange-400 hover:to-amber-500
             text-white text-xs font-bold uppercase tracking-wider
             px-4 py-2 rounded-lg
             /* Sombra de color (Glow) que hace match con el botón */
             shadow-[0_0_15px_rgba(245,158,11,0.4)]
             hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]
             /* Animaciones */
             transition-all duration-300 active:scale-95
             border border-white/20"
>
  <Search size={13} strokeWidth={3} className="drop-shadow-sm" />
  <span className="drop-shadow-sm">Buscar</span>
                
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAY DEL DRAWER 
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        onClick={() => setDrawerAbierto(false)}
        aria-hidden="true"
        className={`
          md:hidden fixed inset-0 z-[55]
          bg-slate-900/70 backdrop-blur-[2px]
          transition-opacity duration-300
          ${drawerAbierto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          DRAWER MOBILE
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
    /* Gradiente vertical: Verde Bosque -> Turquesa Oscuro */
    bg-gradient-to-b from-emerald-900 to-teal-900
    flex flex-col
    shadow-[-8px_0_40px_rgba(0,0,0,0.3)]
    transition-transform duration-300 ease-out
    ${drawerAbierto ? "translate-x-0" : "translate-x-full"}
  `}
      >
        {/* ── Cabecera del drawer ── */}
        <div
          className="flex items-center justify-between
                        px-5 py-4 border-b border-white/10"
        >
          <Link
            to="/"
            onClick={() => setDrawerAbierto(false)}
            className="flex items-center gap-2"
          >
            <Mountain size={22} strokeWidth={1.5} className="text-amber-400" />
            <span className="font-display text-sm text-white">
              San <span className="text-amber-400">Francisco</span>
            </span>
          </Link>
          <button
            onClick={() => setDrawerAbierto(false)}
            className="w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20 text-white/70
                       hover:text-white
                       transition-all duration-150 active:scale-90"
            aria-label="Cerrar menú"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Buscador dentro del drawer ── */}
        <div className="px-5 py-4 border-b border-white/10">
          <form onSubmit={handleBuscar} className="relative">
            <Search
              size={14}
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2
                         text-white/40 pointer-events-none"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar hospedaje…"
              className="w-full pl-9 pr-4 py-2.5
                         bg-white/10 border border-white/10
                         focus:border-amber-400/50 focus:bg-white/15 text-white
                         placeholder:text-white/40 text-sm
                         rounded-xl outline-none transition-all duration-200"
              autoComplete="off"
            />
          </form>
        </div>

        {/* ── Nav links del drawer ── */}
        <nav
          className="flex-1 px-3 py-3 overflow-y-auto"
          aria-label="Menú mobile"
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest
                        text-white/40 px-3 mb-2"
          >
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
                ${
                  isActive
                    ? "bg-white/10 text-amber-400"
                    : "text-white/80 hover:text-white hover:bg-white/[0.05]"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`shrink-0 transition-colors ${isActive ? "text-amber-400" : "text-white/50"}`}
                  >
                    {icono}
                  </span>
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  <ChevronRight
                    size={14}
                    strokeWidth={2}
                    className={`shrink-0 transition-all duration-200
                      ${
                        isActive
                          ? "text-amber-400 translate-x-0.5"
                          : "text-white/30 group-hover:text-white/50"
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── CTA inferior del drawer ── */}
        <div className="px-5 py-5 border-t border-white/10">
          <Link
            to="/mapa"
            onClick={() => setDrawerAbierto(false)}
            className="flex items-center gap-3
                       bg-gradient-to-r from-orange-600 to-amber-500 text-white
                       rounded-xl px-4 py-3.5
                       hover:from-orange-500 hover:to-amber-400
                       transition-all duration-200 active:scale-[0.97] shadow-lg"
          >
            <div
              className="w-8 h-8 rounded-lg bg-white/20
                            flex items-center justify-center shrink-0"
            >
              <Map size={16} strokeWidth={2} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white drop-shadow-sm">
                Ver mapa de hospedajes
              </p>
              <p className="text-xs text-white/80 truncate">
                San Francisco, Valle Grande, Jujuy
              </p>
            </div>
            <ChevronRight
              size={16}
              strokeWidth={2}
              className="text-white/70 shrink-0"
            />
          </Link>
        </div>
      </aside>
    </>
  );
}
