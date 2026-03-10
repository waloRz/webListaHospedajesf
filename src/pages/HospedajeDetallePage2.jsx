/**
 * HospedajeDetallePage — src/pages/HospedajeDetallePage.jsx
 * Ruta: /hospedaje/:id
 *
 * LAYOUT:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ← Volver al listado                                         │
 * ├─────────────────────────────────────────────────────────────┤
 * │  GaleriaImagenes (grid desktop / carousel mobile)           │
 * ├──────────────────────────────────────┬──────────────────────┤
 * │  INFO PRINCIPAL (col-span-2)         │ PANEL CONTACTO       │
 * │  - Nombre + categoría                │ sticky top-20        │
 * │  - Dirección                         │ - Botón llamar       │
 * │  - Descripción completa              │ - Botón WhatsApp     │
 * │  - Grid de servicios con íconos      │ - Ubicación          │
 * │  - Tags de tipo de turismo           │ - Mapa (PROMPT 5)    │
 * │                                      │ - Cómo llegar        │
 * └──────────────────────────────────────┴──────────────────────┘
 */
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Phone, MessageCircle, Navigation,
  Wifi, Car, Coffee, PawPrint, Flame, Waves, Snowflake,
  Utensils, ShowerHead, Thermometer, Compass, Beef,
} from 'lucide-react'
import { useHospedajes }    from '../hooks/useHospedajes'
import { SERVICIOS, CATEGORIAS, CATEGORIAS_TURISMO } from '../utils/serviciosConfig'
import { whatsappUrl, googleMapsUrl, formatPrecio }  from '../utils/formatters'
import GaleriaImagenes      from '../components/galeria/GaleriaImagenes'

// Mapa de íconos lucide para la grilla de servicios
const ICONOS_SERVICIO = {
  wifi:               <Wifi        size={18} strokeWidth={2} />,
  desayuno:           <Coffee      size={18} strokeWidth={2} />,
  estacionamiento:    <Car         size={18} strokeWidth={2} />,
  admite_mascotas:    <PawPrint    size={18} strokeWidth={2} />,
  quincho:            <Flame       size={18} strokeWidth={2} />,
  parrilla:           <Beef        size={18} strokeWidth={2} />,
  pileta:             <Waves       size={18} strokeWidth={2} />,
  aire_acondicionado: <Snowflake   size={18} strokeWidth={2} />,
  acceso_rio:         <Waves       size={18} strokeWidth={2} />,
  cocina_equipada:    <Utensils    size={18} strokeWidth={2} />,
  sanitarios:         <ShowerHead  size={18} strokeWidth={2} />,
  agua_caliente:      <Thermometer size={18} strokeWidth={2} />,
  fogon:              <Flame       size={18} strokeWidth={2} />,
  guias_locales:      <Compass     size={18} strokeWidth={2} />,
}

export default function HospedajeDetallePage() {
  const { id }    = useParams()
  const { getById } = useHospedajes()
  const h = getById(id)

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (!h) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="font-display text-2xl text-noche mb-3">Hospedaje no encontrado</h2>
        <p className="text-tierra-400 text-sm mb-8">
          El hospedaje con ID <code className="bg-arena-dark px-1.5 py-0.5 rounded">{id}</code> no existe o fue removido.
        </p>
        <Link to="/hospedajes" className="btn-primary">
          Ver todos los hospedajes
        </Link>
      </div>
    )
  }

  // Datos derivados
  const catInfo          = CATEGORIAS[h.categoria] ?? { emoji: '🏠', label: h.categoria }
  const precioFormateado = formatPrecio(h.precio_desde, h.moneda)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── BREADCRUMB / VOLVER ─────────────────────────────────────────── */}
      <Link
        to="/hospedajes"
        className="inline-flex items-center gap-2
                   text-tierra-500 hover:text-tierra-700
                   text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Volver al listado
      </Link>

      {/* ══════════════════════════════════════════════════════════════════════
          GALERÍA — reemplaza el placeholder del PROMPT anterior
          Recibe el array completo de imagenes + imagen_portada como primera.
          La galería se encarga del layout mobile vs desktop internamente.
      ══════════════════════════════════════════════════════════════════════ */}
      <GaleriaImagenes
        imagenes={
          // Construir array: portada primero, luego el resto sin duplicar
          h.imagen_portada
            ? [h.imagen_portada, ...h.imagenes.filter(url => url !== h.imagen_portada)]
            : h.imagenes
        }
        nombre={h.nombre}
        categoria={h.categoria}
      />

      {/* ── LAYOUT: info principal + panel contacto ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ══════════════════════════════════════════════════════════════════
            COLUMNA IZQUIERDA — Información principal (lg: 2/3 del ancho)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* ── A. Encabezado: nombre + badge + precio ── */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <h1 className="font-display text-3xl md:text-4xl text-noche leading-tight">
                {h.nombre}
              </h1>
              {precioFormateado && (
                <div className="shrink-0 bg-tierra-50 border border-tierra-200
                                rounded-xl px-4 py-2 text-right">
                  <p className="text-tierra-400 text-[10px] uppercase tracking-widest">desde</p>
                  <p className="text-tierra-600 font-bold text-lg leading-none">
                    {precioFormateado}
                  </p>
                  <p className="text-tierra-300 text-xs">/ noche</p>
                </div>
              )}
            </div>

            {/* Badge categoría + dirección */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5
                               bg-noche text-barro-400
                               text-xs font-bold uppercase tracking-wider
                               px-3 py-1.5 rounded-full">
                {catInfo.emoji} {catInfo.label}
              </span>
              <span className="flex items-center gap-1.5 text-tierra-400">
                <MapPin size={14} className="shrink-0" strokeWidth={2} />
                {h.direccion}
              </span>
            </div>
          </div>

          {/* ── B. Descripción completa ── */}
          <div>
            <h2 className="font-display text-xl text-noche mb-3">
              Sobre el hospedaje
            </h2>
            <p className="text-tierra-700 leading-relaxed text-[15px]">
              {h.descripcion}
            </p>
          </div>

          {/* ── C. Servicios y comodidades ── */}
          <div>
            <h2 className="font-display text-xl text-noche mb-4">
              Servicios y comodidades
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {h.servicios.map(key => {
                const info  = SERVICIOS[key]
                const icono = ICONOS_SERVICIO[key]
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2.5
                               p-3 bg-white rounded-xl
                               border border-arena-dark
                               hover:border-tierra-200 hover:bg-tierra-50
                               transition-colors duration-150"
                  >
                    <span className="text-yunga-500 shrink-0">
                      {icono ?? <span className="text-lg">{info?.emoji}</span>}
                    </span>
                    <span className="text-sm font-medium text-noche leading-snug">
                      {info?.label ?? key}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── D. Tipo de turismo (tags) ── */}
          {h.categorias_turismo?.length > 0 && (
            <div>
              <h2 className="font-display text-xl text-noche mb-3">
                Ideal para
              </h2>
              <div className="flex flex-wrap gap-2">
                {h.categorias_turismo.map(key => {
                  const info = CATEGORIAS_TURISMO[key]
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5
                                 bg-yunga-50 border border-yunga-200
                                 text-yunga-700 text-sm font-medium
                                 px-3 py-1.5 rounded-full"
                    >
                      <span>{info?.emoji}</span>
                      {info?.label ?? key}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

        </div>
        {/* ── FIN columna izquierda ── */}

        {/* ══════════════════════════════════════════════════════════════════
            COLUMNA DERECHA — Panel de contacto (lg: 1/3 del ancho)
            sticky top-20: se mantiene visible al hacer scroll
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-card shadow-card p-6 sticky top-20">

            <h3 className="font-display text-xl text-noche mb-5">
              Contacto
            </h3>

            {/* Botón llamar — <a href="tel:"> activa la app de teléfono en mobile */}
            <a
              href={`tel:${h.telefono.replace(/[\s\-()+]/g, '')}`}
              className="btn-primary w-full justify-center mb-3"
            >
              <Phone size={18} />
              {h.telefono}
            </a>

            {/* Botón WhatsApp */}
            <a
              href={whatsappUrl(h.whatsapp, h.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba58] text-white
                         font-semibold px-6 py-3 rounded-btn
                         flex items-center gap-2 justify-center
                         transition-colors duration-200 mb-7"
            >
              <MessageCircle size={18} />
              Contactar por WhatsApp
            </a>

            {/* Ubicación + mapa */}
            <div className="border-t border-arena-dark pt-5">
              <p className="text-xs text-tierra-400 uppercase tracking-wider
                             font-bold mb-2">
                Ubicación
              </p>
              <p className="text-sm text-tierra-700 leading-relaxed mb-4">
                {h.direccion}
              </p>

              {/* Mapa placeholder — se reemplaza en PROMPT 5 */}
              <div className="h-36 bg-yunga-50 rounded-xl border border-arena-dark
                               flex flex-col items-center justify-center mb-4 gap-1">
                <span className="text-3xl">🗺️</span>
                <span className="text-tierra-300 text-xs">Mapa — PROMPT 5</span>
              </div>

              {/* Botón "Cómo llegar" → abre Google Maps */}
              <a
                href={googleMapsUrl(h.coordenadas.lat, h.coordenadas.lng, h.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                <Navigation size={16} />
                Cómo llegar
              </a>
            </div>

          </div>
        </div>
        {/* ── FIN columna derecha ── */}

      </div>
    </div>
  )
}
