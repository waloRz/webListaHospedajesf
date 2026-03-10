/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  HospedajeDetallePage — src/pages/HospedajeDetallePage.jsx             ║
 * ║  Ruta: /hospedaje/:id                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * SECCIONES (en orden, según PROMPT 6):
 *   1. GaleriaImagenes   — grid desktop / carousel mobile
 *   2. Header            — nombre, badge categoría, precio, dirección
 *   3. Descripción larga — párrafo completo "Sobre el hospedaje"
 *   4. Grid de servicios — íconos lucide + etiquetas
 *   5. Tipo de turismo   — tags "Ideal para"
 *   6. Información de contacto MOBILE — teléfono, WhatsApp, dirección
 *   7. Mapa              — MapaHospedaje con botón "Cómo llegar"
 *
 * LAYOUT GENERAL:
 *
 *   MOBILE (< lg):
 *   ┌──────────────────────────────────────┐
 *   │ ← Volver                            │
 *   │ [GaleriaImagenes — carousel]        │
 *   │ [Sección 2] Nombre + badge + precio │
 *   │ [Sección 3] Descripción             │
 *   │ [Sección 4] Grid servicios          │
 *   │ [Sección 5] Tags turismo            │
 *   │ [Sección 6] Contacto (inline)       │  ← solo mobile, visible en flujo
 *   │ [Sección 7] Mapa + Cómo llegar      │
 *   └──────────────────────────────────────┘
 *
 *   DESKTOP (≥ lg):
 *   ┌────────────────────────────┬──────────────────┐
 *   │ [GaleriaImagenes — grid]   │                  │
 *   ├────────────────────────────┤                  │
 *   │ [2] Nombre + badge         │  PANEL STICKY    │
 *   │ [3] Descripción            │  - Contacto      │
 *   │ [4] Grid servicios         │  - Mapa          │
 *   │ [5] Tags turismo           │  - Cómo llegar   │
 *   └────────────────────────────┴──────────────────┘
 *
 * La Sección 6 (contacto mobile) se oculta en desktop (lg:hidden).
 * El panel sticky de la derecha se oculta en mobile (hidden lg:block).
 */

import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Phone, MessageCircle, Navigation,
  Wifi, Car, Coffee, PawPrint, Flame, Waves, Snowflake,
  Utensils, ShowerHead, Thermometer, Compass, Beef, CheckCircle2,
} from 'lucide-react'
import { useHospedajes }                            from '../hooks/useHospedajes'
import { SERVICIOS, CATEGORIAS, CATEGORIAS_TURISMO } from '../utils/serviciosConfig'
import { whatsappUrl, googleMapsUrl, formatPrecio }  from '../utils/formatters'
import GaleriaImagenes  from '../components/galeria/GaleriaImagenes'
import SEOHead          from '../seo/SEOHead'
import { buildLodgingBusinessSchema, buildBreadcrumbSchema } from '../seo/jsonLdBuilders'
import { SITE_URL }     from '../seo/seoConfig'
import MapaHospedaje    from '../components/mapa/MapaHospedaje'

// ── Mapa ícono lucide → clave de servicio ────────────────────────────────────
// size=18 para la grilla de servicios; el color lo aplica el wrapper (.text-yunga-500)
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

// ─────────────────────────────────────────────────────────────────────────────

export default function HospedajeDetallePage() {
  const { id }      = useParams()
  const { getById } = useHospedajes()
  const h           = getById(id)

  // ══════════════════════════════════════════════════════════════════════════
  // 404 — Hospedaje no encontrado
  // ══════════════════════════════════════════════════════════════════════════
  if (!h) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center
                      text-center px-4 py-16">
        {/* Ilustración */}
        <div className="w-24 h-24 rounded-full bg-arena-dark
                        flex items-center justify-center mb-6 text-5xl">
          🏔️
        </div>
        <h1 className="font-display text-3xl text-noche mb-3">
          Hospedaje no encontrado
        </h1>
        <p className="text-tierra-400 text-sm max-w-sm mb-2">
          El hospedaje con ID{' '}
          <code className="bg-arena-dark px-2 py-0.5 rounded font-mono text-xs">
            {id}
          </code>{' '}
          no existe o fue removido del directorio.
        </p>
        <p className="text-tierra-300 text-xs mb-8">
          Verificá que la URL sea correcta o volvé al listado completo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/hospedajes" className="btn-primary">
            Ver todos los hospedajes
          </Link>
          <Link
            to="/"
            className="btn-secondary"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  // ── Datos derivados ──────────────────────────────────────────────────────
  const catInfo          = CATEGORIAS[h.categoria] ?? { emoji: '🏠', label: h.categoria }
  const precioFormateado = formatPrecio(h.precio_desde, h.moneda)
  const telefonoLimpio   = h.telefono.replace(/[\s\-()+]/g, '')

  // ── SEO: construir metadata dinámica para esta página ──────────────────
  const seoTitle       = h ? h.nombre : null
  const seoDescription = h ? h.descripcion.slice(0, 158) : null
  const seoOgImage     = h?.imagen_portada
    ? (h.imagen_portada.startsWith('http') ? h.imagen_portada : `${SITE_URL}${h.imagen_portada}`)
    : null
  const seoCanonical   = h ? `${SITE_URL}/hospedaje/${h.id}` : null
  const seoKeywords    = h
    ? [h.nombre, h.categoria, 'hospedaje', 'San Francisco Jujuy', 'Valle Grande', ...(h.categorias_turismo || [])].join(', ')
    : null

  // Array de imágenes: portada primero, sin duplicar
  const todasLasImagenes = h.imagen_portada
    ? [h.imagen_portada, ...h.imagenes.filter(url => url !== h.imagen_portada)]
    : h.imagenes

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ══════════════════════════════════════════════════════════════════════
          SEO: metadatos dinámicos de la página de detalle
          ──────────────────────────────────────────────────────────────────
          Equivalente a generateMetadata() en Next.js App Router.
          react-helmet-async sobreescribe el <head> del index.html con:
            - <title> dinámico con el nombre del hospedaje
            - <meta description> con los primeros 158 chars de la descripción
            - og:image con la imagen de portada del hospedaje
            - JSON-LD LodgingBusiness + BreadcrumbList
      ══════════════════════════════════════════════════════════════════════ */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        ogImage={seoOgImage}
        ogImageAlt={h ? `Foto de ${h.nombre} — San Francisco, Jujuy` : undefined}
        ogType="website"
        keywords={seoKeywords}
        appendSiteName={true}
        jsonLd={h ? [
          buildLodgingBusinessSchema(h),
          buildBreadcrumbSchema([
            { name: 'Inicio',      url: '/' },
            { name: 'Hospedajes',  url: '/hospedajes' },
            { name: h.nombre,      url: `/hospedaje/${h.id}` },
          ]),
        ] : undefined}
      />

      {/* ── BREADCRUMB ─────────────────────────────────────────────────────── */}
      <Link
        to="/hospedajes"
        className="inline-flex items-center gap-2
                   text-tierra-500 hover:text-tierra-700
                   text-sm font-medium mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Volver al listado
      </Link>

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 1 — GALERÍA DE IMÁGENES
          ──────────────────────────────────────────────────────────────────
          GaleriaImagenes maneja internamente:
            - Desktop: grid 5 slots estilo Airbnb
            - Mobile:  carousel Swiper
            - Lightbox con navegación por teclado
          mb-8 separa la galería del contenido de abajo.
      ══════════════════════════════════════════════════════════════════════ */}
      <GaleriaImagenes
        imagenes={todasLasImagenes}
        nombre={h.nombre}
        categoria={h.categoria}
      />

      {/* ── GRID PRINCIPAL: contenido (2/3) + panel sticky (1/3) ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-0">

        {/* ════════════════════════════════════════════════════════════════════
            COLUMNA IZQUIERDA — Contenido principal
            En mobile: ocupa 100% del ancho (col-1)
            En desktop: ocupa 2/3 (lg:col-span-2)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2">

          {/* ──────────────────────────────────────────────────────────────────
              SECCIÓN 2 — HEADER: nombre, badge categoría, precio, dirección
              ────────────────────────────────────────────────────────────────
              Layout:
              ┌──────────────────────────────┬──────────────┐
              │ [badge cat] [badge destacado]│  [$precio]   │
              │ NOMBRE DEL HOSPEDAJE         │              │
              │ 📍 Dirección completa        │              │
              └──────────────────────────────┴──────────────┘
          ────────────────────────────────────────────────────────────────── */}
          <div className="pt-2 pb-7 border-b border-arena-dark">

            {/* Fila badges + precio */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">

                {/* Badge categoría — fondo noche, texto barro */}
                <span className="inline-flex items-center gap-1.5
                                 bg-noche text-barro-400
                                 text-[11px] font-bold uppercase tracking-wider
                                 px-3 py-1.5 rounded-full">
                  {catInfo.emoji} {catInfo.label}
                </span>

                {/* Badge "Destacado" — solo si destacado === true */}
                {h.destacado && (
                  <span className="inline-flex items-center gap-1
                                   bg-barro-400 text-white
                                   text-[11px] font-bold uppercase tracking-wider
                                   px-3 py-1.5 rounded-full">
                    ⭐ Destacado
                  </span>
                )}
              </div>

              {/* Caja de precio — solo si existe precio_desde en el JSON */}
              {precioFormateado && (
                <div className="shrink-0 bg-tierra-50 border border-tierra-100
                                rounded-xl px-4 py-2.5 text-right">
                  <p className="text-tierra-300 text-[9px] uppercase tracking-widest mb-0.5">
                    desde
                  </p>
                  <p className="text-tierra-600 font-bold text-xl leading-none">
                    {precioFormateado}
                  </p>
                  <p className="text-tierra-300 text-[10px] mt-0.5">por noche</p>
                </div>
              )}
            </div>

            {/* Nombre del hospedaje */}
            <h1 className="font-display text-3xl md:text-4xl text-noche leading-tight mb-3">
              {h.nombre}
            </h1>

            {/* Dirección completa con ícono */}
            <address className="not-italic flex items-start gap-1.5 text-tierra-400 text-sm">
              <MapPin size={15} className="shrink-0 mt-0.5 text-barro-400" strokeWidth={2} />
              {h.direccion}
            </address>
          </div>
          {/* ── FIN sección 2 ── */}

          {/* ──────────────────────────────────────────────────────────────────
              SECCIÓN 3 — DESCRIPCIÓN LARGA
              ────────────────────────────────────────────────────────────────
              Texto completo del campo `descripcion` del JSON.
              leading-relaxed + text-[15px] para buena legibilidad en pantalla.
          ────────────────────────────────────────────────────────────────── */}
          <div className="py-7 border-b border-arena-dark">
            <h2 className="font-display text-xl text-noche mb-4">
              Sobre el hospedaje
            </h2>
            <p className="text-tierra-700 leading-relaxed text-[15px]">
              {h.descripcion}
            </p>

            {/* Capacidad — si existe el campo en el JSON */}
            {h.capacidad && (
              <p className="mt-4 flex items-center gap-2
                             text-sm text-tierra-500 font-medium">
                <CheckCircle2 size={15} className="text-yunga-400" strokeWidth={2} />
                Capacidad: hasta {h.capacidad} personas
              </p>
            )}
          </div>
          {/* ── FIN sección 3 ── */}

          {/* ──────────────────────────────────────────────────────────────────
              SECCIÓN 4 — GRID DE SERVICIOS Y COMODIDADES
              ────────────────────────────────────────────────────────────────
              Grid de 2 columnas en mobile, 3 en sm+.
              Cada celda: ícono lucide (text-yunga-500) + etiqueta de texto.
              Si no hay ícono lucide para el servicio, fallback al emoji del config.
          ────────────────────────────────────────────────────────────────── */}
          <div className="py-7 border-b border-arena-dark">
            <h2 className="font-display text-xl text-noche mb-4">
              Servicios y comodidades
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {h.servicios.map(key => {
                const info  = SERVICIOS[key]
                const icono = ICONOS_SERVICIO[key]
                if (!info) return null
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2.5
                               px-3 py-3 bg-white rounded-xl
                               border border-arena-dark
                               hover:border-tierra-200 hover:bg-tierra-50
                               transition-colors duration-150"
                  >
                    {/* Ícono: lucide si existe, emoji si no */}
                    <span className="text-yunga-500 shrink-0">
                      {icono ?? <span className="text-lg leading-none">{info.emoji}</span>}
                    </span>
                    <span className="text-sm font-medium text-noche leading-snug">
                      {info.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          {/* ── FIN sección 4 ── */}

          {/* ──────────────────────────────────────────────────────────────────
              SECCIÓN 5 — TIPO DE TURISMO ("Ideal para")
              ────────────────────────────────────────────────────────────────
              Flex wrap de pills con fondo yunga-50.
              Solo se renderiza si el array categorias_turismo tiene elementos.
          ────────────────────────────────────────────────────────────────── */}
          {h.categorias_turismo?.length > 0 && (
            <div className="py-7 border-b border-arena-dark">
              <h2 className="font-display text-xl text-noche mb-4">
                Ideal para
              </h2>
              <div className="flex flex-wrap gap-2">
                {h.categorias_turismo.map(key => {
                  const info = CATEGORIAS_TURISMO[key]
                  if (!info) return null
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-2
                                 bg-yunga-50 border border-yunga-100
                                 text-yunga-700 text-sm font-medium
                                 px-4 py-2 rounded-full"
                    >
                      <span className="text-base leading-none">{info.emoji}</span>
                      {info.label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
          {/* ── FIN sección 5 ── */}

          {/* ──────────────────────────────────────────────────────────────────
              SECCIÓN 6 — CONTACTO MOBILE (lg:hidden)
              ────────────────────────────────────────────────────────────────
              Esta sección SOLO es visible en mobile/tablet (< lg).
              En desktop el contacto está en el panel sticky de la derecha.

              Razón: en mobile no hay panel lateral, entonces el turista
              necesita los botones de contacto en el flujo natural del scroll,
              justo después de ver los servicios.

              Contiene exactamente los mismos botones que el panel desktop:
              - Botón llamar (tel:)
              - Botón WhatsApp
              - Dirección
          ────────────────────────────────────────────────────────────────── */}
          <div className="lg:hidden py-7 border-b border-arena-dark">
            <h2 className="font-display text-xl text-noche mb-5">
              Contactar
            </h2>

            {/* Fila: teléfono + WhatsApp lado a lado en sm, apilados en xs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">

              {/* Botón LLAMAR — href="tel:" abre la app de teléfono en mobile */}
              <a
                href={`tel:${telefonoLimpio}`}
                className="btn-primary flex-1 justify-center text-base py-3.5"
              >
                <Phone size={18} />
                {h.telefono}
              </a>

              {/* Botón WHATSAPP */}
              <a
                href={whatsappUrl(h.whatsapp, h.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2
                           bg-[#25D366] hover:bg-[#20ba58] text-white
                           font-semibold text-base px-6 py-3.5 rounded-btn
                           transition-colors duration-200"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>

            {/* Dirección con ícono */}
            <div className="flex items-start gap-2.5
                            p-4 bg-white rounded-xl border border-arena-dark">
              <MapPin size={16} className="text-barro-400 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider
                               text-tierra-400 mb-0.5">
                  Dirección
                </p>
                <p className="text-sm text-tierra-700 leading-snug">
                  {h.direccion}
                </p>
              </div>
            </div>
          </div>
          {/* ── FIN sección 6 (solo mobile) ── */}

          {/* ──────────────────────────────────────────────────────────────────
              SECCIÓN 7 — MAPA + BOTÓN "CÓMO LLEGAR" (versión mobile/full-width)
              ────────────────────────────────────────────────────────────────
              En mobile: el mapa ocupa el ancho completo con altura 280px.
              En desktop: está en el panel sticky de la derecha (lg:hidden acá).

              El botón "Cómo llegar" abre Google Maps con las coordenadas exactas.
              Está debajo del mapa, span completo, para que sea fácil de tocar.
          ────────────────────────────────────────────────────────────────── */}
          <div className="lg:hidden py-7">
            <h2 className="font-display text-xl text-noche mb-4">
              Ubicación
            </h2>

            <MapaHospedaje
              hospedaje={h}
              altura="h-[280px]"
              autoPopup={false}
              className="mb-4"
            />

            {/* Botón grande "Cómo llegar" → Google Maps */}
            <a
              href={googleMapsUrl(h.coordenadas.lat, h.coordenadas.lng, h.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center text-base py-3.5"
            >
              <Navigation size={18} />
              Cómo llegar con Google Maps
            </a>
          </div>
          {/* ── FIN sección 7 mobile ── */}

        </div>
        {/* ── FIN columna izquierda ── */}

        {/* ════════════════════════════════════════════════════════════════════
            COLUMNA DERECHA — PANEL STICKY DE CONTACTO (solo desktop)
            ────────────────────────────────────────────────────────────────
            hidden en mobile (hidden lg:block).
            sticky top-24: el panel se queda visible mientras se hace scroll.
            overflow-y-auto: si el panel es más alto que la ventana, scroll interno.
        ════════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-card shadow-card p-6
                          sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">

            <h3 className="font-display text-xl text-noche mb-5">
              Contacto
            </h3>

            {/* ── BOTÓN LLAMAR ─────────────────────────────────────────────
                <a href="tel:"> es el estándar para llamadas en mobile.
                En desktop muestra el número; en mobile (si llega aquí) llama.
                El número se limpia de espacios, guiones y paréntesis para href.
            ── */}
            <a
              href={`tel:${telefonoLimpio}`}
              className="btn-primary w-full justify-center mb-3 text-sm"
            >
              <Phone size={16} />
              {h.telefono}
            </a>

            {/* ── BOTÓN WHATSAPP ───────────────────────────────────────────
                whatsappUrl() genera: https://wa.me/NUMERO?text=MENSAJE
                target="_blank" + rel="noopener noreferrer": buenas prácticas
                para enlaces externos (seguridad + performance).
            ── */}
            <a
              href={whatsappUrl(h.whatsapp, h.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba58] text-white
                         font-semibold text-sm px-5 py-3 rounded-btn
                         flex items-center gap-2 justify-center
                         transition-colors duration-200 mb-7"
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>

            {/* ── UBICACIÓN + MAPA + BOTÓN CÓMO LLEGAR ─────────────────── */}
            <div className="border-t border-arena-dark pt-5">

              {/* Título de sección */}
              <p className="text-[10px] font-bold uppercase tracking-widest
                             text-tierra-400 mb-2">
                Ubicación
              </p>

              {/* Dirección */}
              <p className="text-sm text-tierra-700 leading-relaxed mb-4 flex items-start gap-1.5">
                <MapPin size={14} className="text-barro-400 shrink-0 mt-0.5" strokeWidth={2} />
                {h.direccion}
              </p>

              {/* ── MAPA LEAFLET — MapaHospedaje del PROMPT 5 ────────────────
                  altura="h-40" (160px) en el panel compacto de contacto.
                  autoPopup=false: el popup no se abre solo (el turista lo activa).
                  El botón "Abrir en Google Maps" está dentro del componente.
              ── */}
              <MapaHospedaje
                hospedaje={h}
                altura="h-40"
                autoPopup={false}
                className="mb-4 rounded-xl overflow-hidden"
              />

              {/* ── BOTÓN GRANDE "CÓMO LLEGAR" ───────────────────────────────
                  googleMapsUrl() genera:
                  https://www.google.com/maps/search/?api=1&query=LAT,LNG
                  Se abre en pestaña nueva con target="_blank".
                  btn-secondary (yunga-500) para diferenciar del btn-primary (tierra).
              ── */}
              <a
                href={googleMapsUrl(h.coordenadas.lat, h.coordenadas.lng, h.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center text-sm"
              >
                <Navigation size={16} />
                Cómo llegar
              </a>
            </div>
            {/* ── FIN ubicación + mapa ── */}

          </div>
        </div>
        {/* ── FIN columna derecha ── */}

      </div>
      {/* ── FIN grid principal ── */}

    </article>
  )
}
