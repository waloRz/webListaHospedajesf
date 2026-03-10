/**
 * MapaPage — src/pages/MapaPage.jsx
 * Ruta: /mapa
 *
 * LAYOUT:
 * ┌────────────────────────────────────────────────────┐
 * │ Encabezado + contador de hospedajes                │
 * ├────────────────────────────────────────────────────┤
 * │                                                    │
 * │   MapaTodos (h-[500px] md:h-[620px])               │
 * │   - Todos los marcadores                           │
 * │   - Leyenda categorías                             │
 * │   - Botón centrar                                  │
 * │                                                    │
 * ├────────────────────────────────────────────────────┤
 * │ Lista de hospedajes debajo del mapa (mobile-first) │
 * │ con link "Ver detalle" en cada ítem                │
 * └────────────────────────────────────────────────────┘
 */
import { Link } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import { MapPin, Phone, ArrowRight } from 'lucide-react'
import { useHospedajes } from '../hooks/useHospedajes'
import { CATEGORIAS }    from '../utils/serviciosConfig'
import MapaTodos         from '../components/mapa/MapaTodos'

export default function MapaPage() {
  const { hospedajes } = useHospedajes()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEOHead
        title="Mapa de hospedajes — San Francisco, Jujuy"
        description="Mapa interactivo con todos los hospedajes en San Francisco, Valle Grande, Jujuy. Encontrá la ubicación exacta de cada alojamiento."
        keywords="mapa hospedajes San Francisco Jujuy, ubicación cabañas jujuy, cómo llegar San Francisco Valle Grande"
        appendSiteName={true}
      />

      {/* ── ENCABEZADO ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="font-display text-4xl text-noche mb-1">
          Mapa de hospedajes
        </h1>
        <p className="text-tierra-500">
          <span className="font-semibold text-noche">{hospedajes.length}</span>
          {' '}hospedaje{hospedajes.length !== 1 ? 's' : ''} en San Francisco, Valle Grande, Jujuy
        </p>
      </div>

      {/* ── MAPA PRINCIPAL ──────────────────────────────────────────────── */}
      <MapaTodos
        hospedajes={hospedajes}
        className="h-[380px] md:h-[520px] mb-10 shadow-card"
      />

      {/* ── LISTA DE HOSPEDAJES DEBAJO DEL MAPA ─────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl text-noche mb-4">
          Todos los hospedajes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospedajes.map(h => {
            const catInfo = CATEGORIAS[h.categoria] ?? { emoji: '🏠', label: h.categoria }
            return (
              <Link
                key={h.id}
                to={`/hospedaje/${h.id}`}
                className="flex items-center gap-3 p-4
                           bg-white rounded-xl border border-arena-dark
                           hover:border-tierra-300 hover:shadow-card
                           transition-all duration-200 group"
              >
                {/* Ícono de categoría */}
                <div className="w-10 h-10 rounded-xl bg-arena
                                flex items-center justify-center shrink-0 text-xl">
                  {catInfo.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-noche truncate
                                group-hover:text-tierra-600 transition-colors">
                    {h.nombre}
                  </p>
                  <p className="text-xs text-tierra-400 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin size={10} strokeWidth={2.5} className="shrink-0" />
                    {h.direccion.split(',')[0]}
                  </p>
                  {h.telefono && (
                    <p className="text-xs text-tierra-400 flex items-center gap-1 mt-0.5">
                      <Phone size={10} strokeWidth={2.5} className="shrink-0" />
                      {h.telefono}
                    </p>
                  )}
                </div>

                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="text-tierra-300 group-hover:text-tierra-500
                             shrink-0 transition-colors"
                />
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}
