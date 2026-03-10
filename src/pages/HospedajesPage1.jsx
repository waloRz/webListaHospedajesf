import { Link } from 'react-router-dom'
import { MapPin, Phone, SlidersHorizontal } from 'lucide-react'
import { useHospedajes } from '../hooks/useHospedajes'
import { CATEGORIAS, SERVICIOS } from '../utils/serviciosConfig'

export default function HospedajesPage() {
  const { hospedajesFiltrados, filtros, toggleFiltro, resetFiltros } = useHospedajes()

  const categoriasOpciones = Object.entries(CATEGORIAS)
  const serviciosOpciones  = Object.entries(SERVICIOS).slice(0, 8)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl text-noche mb-2">Todos los hospedajes</h1>
      <p className="text-tierra-500 mb-8">{hospedajesFiltrados.length} hospedaje{hospedajesFiltrados.length !== 1 ? 's' : ''} disponibles en la zona</p>

      {/* FILTROS */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-noche">
          <SlidersHorizontal size={16} /> Filtrar por categoría
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categoriasOpciones.map(([key, val]) => (
            <button key={key}
              onClick={() => toggleFiltro('categoria', key)}
              className={`filtro-chip ${filtros.categoria.includes(key) ? 'activo' : ''}`}>
              {val.emoji} {val.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-noche">
          Filtrar por servicios
        </div>
        <div className="flex flex-wrap gap-2">
          {serviciosOpciones.map(([key, val]) => (
            <button key={key}
              onClick={() => toggleFiltro('servicios', key)}
              className={`filtro-chip ${filtros.servicios.includes(key) ? 'activo' : ''}`}>
              {val.emoji} {val.label}
            </button>
          ))}
          {(filtros.categoria.length > 0 || filtros.servicios.length > 0) && (
            <button onClick={resetFiltros}
              className="text-sm text-tierra-500 hover:text-tierra-700 font-medium px-3 py-2 underline">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      {hospedajesFiltrados.length === 0 ? (
        <div className="text-center py-20 text-tierra-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-display text-xl">No encontramos hospedajes con esos filtros</p>
          <button onClick={resetFiltros} className="btn-primary mt-6 mx-auto">Limpiar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {hospedajesFiltrados.map(h => (
            <Link key={h.id} to={`/hospedaje/${h.id}`} className="card-hospedaje group">
              <div className="h-52 bg-gradient-to-br from-yunga-700 to-tierra-600 relative flex items-center justify-center">
                <span className="text-6xl opacity-30">
                  {h.categoria === 'cabaña' ? '🛖' : h.categoria === 'camping' ? '⛺' : '🏡'}
                </span>
                <div className="absolute top-3 left-3 badge-categoria">
                  {CATEGORIAS[h.categoria]?.emoji} {h.categoria}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-noche mb-1">{h.nombre}</h3>
                <div className="flex items-center gap-1 text-tierra-400 text-sm mb-3">
                  <MapPin size={13} /><span className="truncate">{h.direccion.split(',')[0]}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {h.servicios.slice(0, 4).map(s => (
                    <span key={s} className="tag-servicio">
                      {SERVICIOS[s]?.emoji} {SERVICIOS[s]?.label ?? s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-arena-dark">
                  <span className="flex items-center gap-1.5 text-tierra-500 text-sm">
                    <Phone size={13} /> {h.telefono}
                  </span>
                  <span className="text-yunga-600 text-sm font-semibold group-hover:underline">Ver detalle →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
