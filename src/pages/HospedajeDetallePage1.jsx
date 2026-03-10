import { useParams, Link } from 'react-router-dom'
import { Phone, MapPin, MessageCircle, ArrowLeft, Navigation } from 'lucide-react'
import { useHospedajes } from '../hooks/useHospedajes'
import { SERVICIOS, CATEGORIAS } from '../utils/serviciosConfig'
import { whatsappUrl, googleMapsUrl } from '../utils/formatters'

export default function HospedajeDetallePage() {
  const { id } = useParams()
  const { getById } = useHospedajes()
  const h = getById(id)

  if (!h) {
    return (
      <div className="text-center py-32">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="font-display text-2xl text-noche mb-2">Hospedaje no encontrado</h2>
        <Link to="/hospedajes" className="btn-primary mt-6 mx-auto">Ver todos los hospedajes</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BACK */}
      <Link to="/hospedajes" className="inline-flex items-center gap-2 text-tierra-500 hover:text-tierra-700 text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Volver al listado
      </Link>

      {/* GALERÍA placeholder (se reemplaza en PROMPT 4) */}
      <div className="rounded-card overflow-hidden bg-gradient-to-br from-yunga-700 to-tierra-600
                      h-64 md:h-96 flex items-center justify-center mb-8">
        <span className="text-8xl opacity-20">
          {h.categoria === 'cabaña' ? '🛖' : h.categoria === 'camping' ? '⛺' : '🏡'}
        </span>
        <div className="absolute top-4 left-4 badge-categoria">
          {CATEGORIAS[h.categoria]?.emoji} {h.categoria}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INFO PRINCIPAL */}
        <div className="lg:col-span-2">
          <h1 className="font-display text-4xl text-noche mb-2">{h.nombre}</h1>
          <div className="flex items-center gap-1.5 text-tierra-400 mb-6">
            <MapPin size={15} /><span>{h.direccion}</span>
          </div>
          <p className="text-tierra-700 leading-relaxed mb-8">{h.descripcion}</p>

          {/* SERVICIOS */}
          <h2 className="font-display text-2xl text-noche mb-4">Servicios y comodidades</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {h.servicios.map(s => (
              <div key={s} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-arena-dark">
                <span className="text-xl">{SERVICIOS[s]?.emoji ?? '✓'}</span>
                <span className="text-sm font-medium text-noche">{SERVICIOS[s]?.label ?? s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL CONTACTO */}
        <div>
          <div className="bg-white rounded-card shadow-card p-6 sticky top-20">
            <h3 className="font-display text-xl text-noche mb-4">Contacto</h3>
            
            <a href={`tel:${h.telefono}`}
               className="btn-primary w-full justify-center mb-3">
              <Phone size={18} /> {h.telefono}
            </a>

            <a href={whatsappUrl(h.whatsapp, h.nombre)}
               target="_blank" rel="noopener noreferrer"
               className="w-full bg-[#25D366] hover:bg-[#20ba58] text-white font-semibold
                          px-6 py-3 rounded-btn flex items-center gap-2 justify-center
                          transition-colors duration-200 mb-6">
              <MessageCircle size={18} /> Contactar por WhatsApp
            </a>

            <div className="border-t border-arena-dark pt-5">
              <p className="text-xs text-tierra-400 uppercase tracking-wider font-semibold mb-2">Ubicación</p>
              <p className="text-sm text-tierra-700 mb-4">{h.direccion}</p>
              
              {/* Mapa placeholder (se reemplaza en PROMPT 5) */}
              <div className="h-36 bg-yunga-50 rounded-xl border border-arena-dark flex items-center justify-center mb-4">
                <span className="text-tierra-300 text-sm">Mapa (PROMPT 5)</span>
              </div>

              <a href={googleMapsUrl(h.coordenadas.lat, h.coordenadas.lng, h.nombre)}
                 target="_blank" rel="noopener noreferrer"
                 className="btn-secondary w-full justify-center">
                <Navigation size={16} /> Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
