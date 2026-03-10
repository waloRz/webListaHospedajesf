/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  FiltroPanel — src/components/filtros/FiltroPanel.jsx                  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * COMPORTAMIENTO POR BREAKPOINT:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ MOBILE  (< 1024px / lg)                                                 │
 * │   El panel vive FUERA del flujo normal.                                 │
 * │   Se activa con el botón flotante "Filtros (N)" en HospedajesPage.     │
 * │   Aparece como drawer deslizando desde ABAJO con overlay oscuro.       │
 * │   Props requeridas: abierto={bool} onCerrar={fn}                       │
 * │                                                                         │
 * │ DESKTOP (≥ 1024px / lg)                                                 │
 * │   El panel es un aside fijo de w-72 (288px) en el layout de 2 columnas │
 * │   definido en HospedajesPage. El prop abierto/onCerrar se ignora.      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * SECCIONES DENTRO DEL PANEL (de arriba a abajo):
 *   1. Header del panel (título + botón cerrar mobile + "Limpiar todo")
 *   2. Buscador por nombre
 *   3. Filtro por CATEGORÍA (checkboxes con contador de resultados)
 *   4. Filtro por SERVICIOS (checkboxes con ícono lucide)
 *   5. Filtro por TIPO DE TURISMO (checkboxes)
 *   6. Footer sticky con botón "Ver X resultados" (solo mobile)
 *
 * Props:
 *   filtros              {object}   — estado actual del hook useHospedajes
 *   toggleFiltro         {fn}       — fn(campo, valor) para marcar/desmarcar
 *   setBusqueda          {fn}       — fn(string) para actualizar búsqueda libre
 *   resetFiltros         {fn}       — limpia todos los filtros
 *   hayFiltrosActivos    {bool}     — true si hay al menos 1 filtro activo
 *   cantidadResultados   {number}   — qty para el botón "Ver N resultados"
 *   contarPorCategoria   {object}   — { 'hostería': 2, ... } para los badges
 *   abierto              {bool}     — controla visibilidad del drawer mobile
 *   onCerrar             {fn}       — cierra el drawer mobile
 */

import { useRef, useEffect } from 'react'
import {
  X, Search, SlidersHorizontal,
  Wifi, Car, Coffee, PawPrint, Flame,
  Waves, Snowflake, Utensils, ChevronDown,
} from 'lucide-react'
import {
  CATEGORIAS,
  SERVICIOS,
  CATEGORIAS_TURISMO,
} from '../../utils/serviciosConfig'

// ── Íconos lucide para cada servicio (subset de los que muestra el filtro) ──
const ICONO_FILTRO = {
  wifi:               <Wifi        size={14} strokeWidth={2} />,
  desayuno:           <Coffee      size={14} strokeWidth={2} />,
  estacionamiento:    <Car         size={14} strokeWidth={2} />,
  admite_mascotas:    <PawPrint    size={14} strokeWidth={2} />,
  quincho:            <Flame       size={14} strokeWidth={2} />,
  pileta:             <Waves       size={14} strokeWidth={2} />,
  aire_acondicionado: <Snowflake   size={14} strokeWidth={2} />,
  cocina_equipada:    <Utensils    size={14} strokeWidth={2} />,
}

// Servicios que muestra el filtro (los 8 más relevantes para turismo)
const SERVICIOS_FILTRO = [
  'wifi', 'desayuno', 'estacionamiento', 'admite_mascotas',
  'quincho', 'pileta', 'aire_acondicionado', 'cocina_equipada',
]

// ─────────────────────────────────────────────────────────────────────────────

export default function FiltroPanel({
  filtros,
  toggleFiltro,
  setBusqueda,
  resetFiltros,
  hayFiltrosActivos,
  cantidadResultados,
  contarPorCategoria,
  abierto,
  onCerrar,
}) {
  // Ref para el drawer: permite enfocar al abrirse (accesibilidad)
  const drawerRef = useRef(null)

  // Cuando el drawer mobile se abre: bloquear scroll del body y enfocar el panel
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden'
      drawerRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    // Cleanup si el componente se desmonta mientras está abierto
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && abierto) onCerrar() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [abierto, onCerrar])

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAY — solo mobile (lg:hidden)
          Fondo semitransparente sobre el contenido cuando el drawer está abierto.
          Click en el overlay cierra el drawer.
          transition-opacity: aparece y desaparece suavemente.
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        onClick={onCerrar}
        className={`
          lg:hidden fixed inset-0 z-40 bg-noche/60 backdrop-blur-[2px]
          transition-opacity duration-300
          ${abierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════════
          PANEL PRINCIPAL
          ──────────────────────────────────────────────────────────────────
          MOBILE:   posición fixed, bottom-0, ancho 100%, altura hasta 90vh,
                    drawer que sube desde abajo con translate-y.
                    rounded-t-2xl (esquinas redondeadas solo arriba).
                    z-50 para estar sobre el overlay (z-40).

          DESKTOP:  posición relativa en el flujo normal (lg:static),
                    ancho fijo w-72 (288px), sin translate, sin rounded especial.
                    El padre (HospedajesPage) lo ubica en un aside.
      ══════════════════════════════════════════════════════════════════════ */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        aria-label="Panel de filtros"
        className={`
          /* ─── MOBILE: drawer desde abajo ─── */
          fixed bottom-0 left-0 right-0 z-50
          max-h-[90vh] overflow-y-auto
          bg-white rounded-t-2xl shadow-[0_-8px_40px_rgba(26,35,50,0.18)]
          transition-transform duration-300 ease-out
          ${abierto ? 'translate-y-0' : 'translate-y-full'}

          /* ─── DESKTOP: panel lateral estático ─── */
          lg:static lg:translate-y-0 lg:rounded-2xl lg:shadow-card
          lg:max-h-none lg:overflow-visible
          lg:w-72 lg:self-start lg:sticky lg:top-24
        `}
      >

        {/* ── Handle visual (solo mobile) ─────────────────────────────────
            La barra gris arriba del drawer que indica que se puede arrastrar.
            En desktop se oculta (lg:hidden).
        ── */}
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-arena-dark rounded-full" />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 1 — HEADER DEL PANEL
            ────────────────────────────────────────────────────────────────
            Posición: sticky top-0 dentro del aside para que permanezca
            visible al hacer scroll dentro del panel.
            Contiene: ícono + título + botón cerrar (mobile) + limpiar filtros
        ══════════════════════════════════════════════════════════════════ */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-4 pb-3
                        border-b border-arena-dark
                        flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-tierra-500" strokeWidth={2} />
            <span className="font-semibold text-noche text-sm">Filtrar hospedajes</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón "Limpiar todo" — solo visible si hay filtros activos */}
            {hayFiltrosActivos && (
              <button
                onClick={resetFiltros}
                className="text-xs text-tierra-400 hover:text-tierra-600
                           font-medium underline underline-offset-2
                           transition-colors duration-150"
              >
                Limpiar todo
              </button>
            )}
            {/* Botón cerrar — solo en mobile (lg:hidden) */}
            <button
              onClick={onCerrar}
              className="lg:hidden w-7 h-7 flex items-center justify-center
                         rounded-full bg-arena hover:bg-arena-dark
                         text-tierra-500 transition-colors duration-150"
              aria-label="Cerrar filtros"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Contenedor scrollable del cuerpo del panel */}
        <div className="px-5 py-4 flex flex-col gap-6 pb-24 lg:pb-5">

          {/* ════════════════════════════════════════════════════════════════
              SECCIÓN 2 — BÚSQUEDA POR NOMBRE
              ──────────────────────────────────────────────────────────────
              Input de texto con ícono de lupa a la izquierda.
              Botón "×" para limpiar el campo (aparece solo si hay texto).
              onChange llama a setBusqueda() del hook.
              El placeholder sugiere tipos de búsqueda posibles.
          ════════════════════════════════════════════════════════════════ */}
          <div>
            <SectionLabel>Buscar por nombre</SectionLabel>
            <div className="relative">
              <Search
                size={15}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-tierra-300 pointer-events-none"
              />
              <input
                type="text"
                value={filtros.busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="ej: hostería, cabaña..."
                className="w-full pl-9 pr-8 py-2.5 text-sm
                           bg-arena/60 border border-arena-dark rounded-xl
                           text-noche placeholder-tierra-300
                           focus:outline-none focus:ring-2 focus:ring-tierra-300
                           focus:border-tierra-400 transition-all duration-150"
              />
              {/* Botón limpiar búsqueda */}
              {filtros.busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2
                             text-tierra-300 hover:text-tierra-500 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECCIÓN 3 — FILTRO POR CATEGORÍA
              ──────────────────────────────────────────────────────────────
              CheckboxItem personalizado (no <input type="checkbox"> nativo).
              Cada ítem muestra: emoji + label + badge con cantidad de hospedajes.
              Estado activo: fondo tierra-500, texto blanco, check visible.
              Estado inactivo: borde arena-dark, texto tierra-600.
              Se itera sobre CATEGORIAS de serviciosConfig.js
          ════════════════════════════════════════════════════════════════ */}
          <div>
            <SectionLabel>Categoría de hospedaje</SectionLabel>
            <div className="flex flex-col gap-1.5">
              {Object.entries(CATEGORIAS).map(([key, val]) => {
                const activo = filtros.categoria.includes(key)
                const cantidad = contarPorCategoria[key] ?? 0
                return (
                  <CheckboxItem
                    key={key}
                    activo={activo}
                    onClick={() => toggleFiltro('categoria', key)}
                    icono={<span className="text-base leading-none">{val.emoji}</span>}
                    label={val.label}
                    badge={cantidad > 0 ? cantidad : null}
                  />
                )
              })}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECCIÓN 4 — FILTRO POR SERVICIOS
              ──────────────────────────────────────────────────────────────
              Usa íconos de lucide-react (más consistentes visualmente que emojis).
              Solo muestra los 8 servicios más relevantes (SERVICIOS_FILTRO).
              Lógica AND: el hospedaje debe tener TODOS los servicios marcados.
              Por eso el label dice "Deben incluir:" en vez de "Al menos uno de:"
          ════════════════════════════════════════════════════════════════ */}
          <div>
            <SectionLabel
              hint="El hospedaje debe incluir todos los seleccionados"
            >
              Servicios y comodidades
            </SectionLabel>
            <div className="flex flex-col gap-1.5">
              {SERVICIOS_FILTRO.map(key => {
                const info   = SERVICIOS[key]
                const icono  = ICONO_FILTRO[key]
                const activo = filtros.servicios.includes(key)
                if (!info) return null
                return (
                  <CheckboxItem
                    key={key}
                    activo={activo}
                    onClick={() => toggleFiltro('servicios', key)}
                    icono={<span className="text-yunga-500">{icono}</span>}
                    label={info.label}
                  />
                )
              })}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECCIÓN 5 — FILTRO POR TIPO DE TURISMO
              ──────────────────────────────────────────────────────────────
              Lógica OR: muestra si el hospedaje pertenece a AL MENOS UNO
              de los tipos de turismo seleccionados.
              Grid de 2 columnas para aprovechar el espacio horizontal.
          ════════════════════════════════════════════════════════════════ */}
          <div>
            <SectionLabel
              hint="Muestra si coincide con alguno de los seleccionados"
            >
              Tipo de turismo
            </SectionLabel>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CATEGORIAS_TURISMO).map(([key, val]) => {
                const activo = filtros.turismo.includes(key)
                return (
                  <CheckboxItem
                    key={key}
                    activo={activo}
                    onClick={() => toggleFiltro('turismo', key)}
                    icono={<span className="text-base leading-none">{val.emoji}</span>}
                    label={val.label}
                    compact
                  />
                )
              })}
            </div>
          </div>

        </div>
        {/* ── FIN del cuerpo scrollable ──────────────────────────────────── */}

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 6 — FOOTER STICKY (solo mobile, lg:hidden)
            ────────────────────────────────────────────────────────────────
            Pegado al fondo del drawer.
            Muestra el botón "Ver N resultados" para aplicar y cerrar el panel.
            El número se actualiza en tiempo real mientras el usuario filtra.
            Si hay 0 resultados cambia el estilo para indicar que no hay nada.
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden sticky bottom-0 bg-white border-t border-arena-dark
                        px-5 py-4 shadow-[0_-4px_16px_rgba(26,35,50,0.08)]">
          <button
            onClick={onCerrar}
            disabled={cantidadResultados === 0}
            className={`
              w-full py-3 rounded-xl font-semibold text-sm
              transition-all duration-200
              flex items-center justify-center gap-2
              ${cantidadResultados === 0
                ? 'bg-arena-dark text-tierra-300 cursor-not-allowed'
                : 'bg-tierra-500 hover:bg-tierra-400 text-white active:scale-[0.98]'
              }
            `}
          >
            {cantidadResultados === 0
              ? 'Sin resultados para estos filtros'
              : `Ver ${cantidadResultados} hospedaje${cantidadResultados !== 1 ? 's' : ''}`
            }
          </button>
        </div>

      </aside>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTES INTERNOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SectionLabel — Título de sección dentro del panel
 * hint: texto secundario pequeño debajo del título (opcional)
 */
function SectionLabel({ children, hint }) {
  return (
    <div className="mb-2.5">
      <p className="text-xs font-bold uppercase tracking-wider text-tierra-500">
        {children}
      </p>
      {hint && (
        <p className="text-[10px] text-tierra-300 mt-0.5 leading-snug">{hint}</p>
      )}
    </div>
  )
}

/**
 * CheckboxItem — Fila de checkbox personalizada
 *
 * Props:
 *   activo   {bool}     — si está marcado
 *   onClick  {fn}       — handler del click
 *   icono    {ReactNode}— ícono a la izquierda (emoji o lucide)
 *   label    {string}   — texto del ítem
 *   badge    {number}   — número entre paréntesis (opcional, para categorías)
 *   compact  {bool}     — reduce padding y texto (para grilla de 2 cols)
 *
 * Anatomía del ítem:
 * ┌──────────────────────────────────────────────────────┐
 * │ [check box] [ícono] Label del ítem          [(badge)]│
 * └──────────────────────────────────────────────────────┘
 *
 * El "checkbox" es un div visual custom (no <input>), más fácil de estilizar.
 */
function CheckboxItem({ activo, onClick, icono, label, badge, compact = false }) {
  return (
    <button
      role="checkbox"
      aria-checked={activo}
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 text-left
        rounded-xl border transition-all duration-150
        ${compact ? 'px-2.5 py-2' : 'px-3 py-2.5'}
        ${activo
          ? 'bg-tierra-50 border-tierra-300 text-tierra-700'
          : 'bg-white border-arena-dark text-tierra-600 hover:border-tierra-200 hover:bg-arena/50'
        }
      `}
    >
      {/* ── Checkbox visual ── */}
      <span
        className={`
          shrink-0 w-4 h-4 rounded flex items-center justify-center
          border transition-colors duration-150
          ${activo
            ? 'bg-tierra-500 border-tierra-500'
            : 'bg-white border-tierra-200'
          }
        `}
      >
        {activo && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-none stroke-white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4l2.5 2.5L9 1" />
          </svg>
        )}
      </span>

      {/* ── Ícono ── */}
      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
        {icono}
      </span>

      {/* ── Label ── */}
      <span className={`flex-1 leading-none ${compact ? 'text-xs' : 'text-sm'} font-medium`}>
        {label}
      </span>

      {/* ── Badge de cantidad (para categorías) ── */}
      {badge !== null && badge !== undefined && (
        <span className={`
          shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full
          ${activo
            ? 'bg-tierra-200 text-tierra-700'
            : 'bg-arena-dark text-tierra-400'
          }
        `}>
          {badge}
        </span>
      )}
    </button>
  )
}
