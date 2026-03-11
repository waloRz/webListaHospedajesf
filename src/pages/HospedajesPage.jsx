/**
 * HospedajesPage — src/pages/HospedajesPage.jsx
 * Ruta: /hospedajes
 *
 * LAYOUT GENERAL:
 * ┌──────────────────────────────────────────────────────────┐
 * │ ENCABEZADO (título + contador de resultados)             │
 * ├──────────────────────────────────────────────────────────┤
 * │ MOBILE:  [Botón flotante "Filtros (N)"] ← abre drawer   │
 * │          GRID de cards (1 columna)                       │
 * │                                                          │
 * │ DESKTOP: ┌──────────────┬──────────────────────────────┐│
 * │          │ FiltroPanel  │ GRID de cards (2 columnas)   ││
 * │          │ w-72 sticky  │ sm:grid-cols-2               ││
 * │          └──────────────┴──────────────────────────────┘│
 * └──────────────────────────────────────────────────────────┘
 */
import { useState } from 'react'
import SEOHead from '../seo/SEOHead'
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { useHospedajes }  from '../hooks/useHospedajes'
import HospedajeCard      from '../components/hospedaje/HospedajeCard'
import FiltroPanel        from '../components/filtros/FiltroPanel'

export default function HospedajesPage() {
  // Estado local: apertura del drawer mobile
  const [drawerAbierto, setDrawerAbierto] = useState(false)

  // Hook central: filtros + lista filtrada + helpers
  const {
    hospedajesFiltrados,
    filtros,
    toggleFiltro,
    setBusqueda,
    resetFiltros,
    hayFiltrosActivos,
    cantidadFiltrosActivos,
    contarPorCategoria,
  } = useHospedajes()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEOHead
        title="Todos los hospedajes en San Francisco, Jujuy"
        description="Explorá el listado completo de hospedajes en San Francisco, Valle Grande, Jujuy. Filtrá por categoría, servicios y tipo de turismo."
        keywords="listado hospedajes San Francisco Jujuy, hosterías Valle Grande, cabañas jujuy, camping jujuy"
        appendSiteName={true}
      />

      {/* ── ENCABEZADO ──────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl text-noche mb-1">
            Hospedajes en la zona
          </h1>
          {/* Contador dinámico de resultados */}
          <p className="text-tierra-500 text-sm">
            {hospedajesFiltrados.length === 0 ? (
              <span className="text-tierra-300">Sin resultados para los filtros actuales</span>
            ) : (
              <>
                <span className="font-semibold text-noche">
                  {hospedajesFiltrados.length}
                </span>
                {' '}hospedaje{hospedajesFiltrados.length !== 1 ? 's' : ''} encontrado{hospedajesFiltrados.length !== 1 ? 's' : ''}
                {hayFiltrosActivos && (
                  <span className="text-tierra-400 ml-1">
                    · {cantidadFiltrosActivos} filtro{cantidadFiltrosActivos !== 1 ? 's' : ''} activo{cantidadFiltrosActivos !== 1 ? 's' : ''}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* ── BOTÓN "FILTROS" — solo visible en mobile (lg:hidden) ────────
            Muestra badge con cantidad de filtros activos.
            Al hacer click abre el drawer desde abajo.
        ── */}
        <button
          onClick={() => setDrawerAbierto(true)}
          className="lg:hidden flex items-center gap-2
                     bg-yunga-500 hover:bg-yunga-400 rounded-xl
                     px-5 py-3 text-base font-bold text-white
                     shadow-md hover:shadow-lg transition-all
                     active:scale-[0.97]"
        >
          <SlidersHorizontal size={15} strokeWidth={2} />
          Filtros
          {/* Badge de cantidad */}
          {cantidadFiltrosActivos > 0 && (
            <span className="w-5 h-5 rounded-full bg-tierra-500 text-white
                             text-[11px] font-bold flex items-center justify-center">
              {cantidadFiltrosActivos}
            </span>
          )}
        </button>
      </div>

      {/* ── LAYOUT PRINCIPAL: aside + grid ──────────────────────────────── */}
      <div className="flex gap-8 items-start">

        {/* ── PANEL LATERAL DESKTOP (lg: siempre visible, mobile: oculto)
            El FiltroPanel tiene su propia lógica para mostrarse como
            aside estático en desktop vs drawer mobile.
            En desktop ocupa w-72 (288px) fijo.
        ── */}
        <div className="hidden lg:block w-72 shrink-0">
          <FiltroPanel
            filtros={filtros}
            toggleFiltro={toggleFiltro}
            setBusqueda={setBusqueda}
            resetFiltros={resetFiltros}
            hayFiltrosActivos={hayFiltrosActivos}
            cantidadResultados={hospedajesFiltrados.length}
            contarPorCategoria={contarPorCategoria}
            abierto={false}
            onCerrar={() => {}}
          />
        </div>

        {/* ── DRAWER MOBILE (siempre montado, posición fixed, z-50)
            El componente controla su visibilidad internamente con translate-y.
            Se pasa abierto={drawerAbierto} para que sepa cuándo deslizar.
        ── */}
        <div className="lg:hidden">
          <FiltroPanel
            filtros={filtros}
            toggleFiltro={toggleFiltro}
            setBusqueda={setBusqueda}
            resetFiltros={resetFiltros}
            hayFiltrosActivos={hayFiltrosActivos}
            cantidadResultados={hospedajesFiltrados.length}
            contarPorCategoria={contarPorCategoria}
            abierto={drawerAbierto}
            onCerrar={() => setDrawerAbierto(false)}
          />
        </div>

        {/* ── GRILLA DE RESULTADOS ────────────────────────────────────────
            El ancho del padre cambia dependiendo del breakpoint:
              mobile:  100% (el aside no ocupa espacio)
              desktop: calc(100% - 288px - 32px gap) → flex-1

            Grilla responsive:
              mobile:  1 columna
              sm/md:   2 columnas (tablet)
              (NO 3 columnas acá porque el aside ya ocupa 288px)
        ── */}
        <div className="flex-1 min-w-0">

          {hospedajesFiltrados.length === 0 ? (
            /* ── Estado vacío ── */
            <div className="text-center py-24 bg-white rounded-2xl
                            border border-arena-dark">
              <p className="text-6xl mb-4">🔍</p>
              <p className="font-display text-xl text-noche mb-2">
                Sin resultados
              </p>
              <p className="text-tierra-400 text-sm mb-6 max-w-xs mx-auto">
                Probá con otros filtros o combinaciones de categorías y servicios
              </p>
              <button
                onClick={resetFiltros}
                className="btn-primary mx-auto"
              >
                Limpiar todos los filtros
              </button>
            </div>

          ) : (
            /* ── Grid de cards ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hospedajesFiltrados.map(h => (
                <HospedajeCard
                  key={h.id}
                  hospedaje={h}
                  variant="default"
                />
              ))}
            </div>
          )}

        </div>
        {/* ── FIN grilla ── */}

      </div>
      {/* ── FIN layout principal ── */}

    </div>
  )
}
