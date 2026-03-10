/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  HospedajeCard — Tarjeta de hospedaje                                  ║
 * ║  Archivo: src/components/hospedaje/HospedajeCard.jsx                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ESTRUCTURA VISUAL (de arriba hacia abajo):
 * ┌─────────────────────────────────────┐
 * │ [badge categoría]    [★ Destacado]  │  ← absolutos sobre imagen
 * │                                     │
 * │         IMAGEN / GRADIENTE          │  ← h-52 (208px)
 * │                                     │
 * │              [$ precio]             │  ← absoluto inferior derecho
 * ├─────────────────────────────────────┤
 * │ NOMBRE DEL HOSPEDAJE                │  ← font-display
 * │ 📍 Primera parte de la dirección    │  ← texto pequeño truncado
 * │ Descripción breve (2 líneas max)    │  ← solo en variant="default"
 * │ [🔥 Quincho] [📶 WiFi] [🚗 +2 más] │  ← tags de servicios
 * ├─────────────────────────────────────┤
 * │ 📞 +54 388 ...    [Ver detalle →]   │  ← footer fijo al fondo
 * └─────────────────────────────────────┘
 *
 * Props:
 *   hospedaje  {object}  — un objeto de hospedajes.json
 *   variant    {string}  — "default" (con descripción) | "compact" (sin ella)
 *
 * Uso en grilla responsive (en el padre, NO aquí):
 *   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
 *     {lista.map(h => <HospedajeCard key={h.id} hospedaje={h} />)}
 *   </div>
 */

import { Link } from 'react-router-dom'
import {
  Wifi, Car, Coffee, PawPrint, Flame, Utensils,
  Waves, Snowflake, Compass, ShowerHead, MapPin,
  Phone, ArrowRight, Star, Beef, Thermometer,
} from 'lucide-react'
import { SERVICIOS, CATEGORIAS } from '../../utils/serviciosConfig'
import { formatPrecio }          from '../../utils/formatters'

// ─── 1. MAPA ÍCONO LUCIDE por clave de servicio ────────────────────────────
//  Usamos lucide-react en lugar de emojis para consistencia visual.
//  Cada ícono tiene size=12 (se verá bien dentro del tag-servicio de 11px).
//  strokeWidth=2.2 da un trazo más cálido que el default (2).
const ICONOS_SERVICIO = {
  wifi:               <Wifi        size={12} strokeWidth={2.2} />,
  desayuno:           <Coffee      size={12} strokeWidth={2.2} />,
  estacionamiento:    <Car         size={12} strokeWidth={2.2} />,
  admite_mascotas:    <PawPrint    size={12} strokeWidth={2.2} />,
  quincho:            <Flame       size={12} strokeWidth={2.2} />,
  parrilla:           <Beef        size={12} strokeWidth={2.2} />,
  pileta:             <Waves       size={12} strokeWidth={2.2} />,
  aire_acondicionado: <Snowflake   size={12} strokeWidth={2.2} />,
  acceso_rio:         <Waves       size={12} strokeWidth={2.2} />,
  cocina_equipada:    <Utensils    size={12} strokeWidth={2.2} />,
  sanitarios:         <ShowerHead  size={12} strokeWidth={2.2} />,
  agua_caliente:      <Thermometer size={12} strokeWidth={2.2} />,
  fogon:              <Flame       size={12} strokeWidth={2.2} />,
  guias_locales:      <Compass     size={12} strokeWidth={2.2} />,
}

// ─── 2. GRADIENTES de imagen placeholder (uno por categoría) ──────────────
//  Se usa cuando imagen_portada es null o la URL no existe todavía.
//  Los colores respetan la paleta Yunga Jujeña de tailwind.config.js
const GRADIENTES_PLACEHOLDER = {
  'hostería': 'from-yunga-800  via-yunga-600  to-tierra-500',
  'cabaña':   'from-tierra-700 via-tierra-500 to-barro-500',
  'camping':  'from-yunga-900  via-yunga-700  to-cielo-600',
  'hotel':    'from-cielo-700  via-cielo-500  to-yunga-500',
  'hostel':   'from-barro-700  via-tierra-500 to-yunga-600',
  'b&b':      'from-tierra-600 via-barro-500  to-yunga-600',
}

// Emoji grande que se centra sobre el gradiente para identificar la categoría
const EMOJIS_PLACEHOLDER = {
  'hostería': '🏡', 'cabaña': '🛖', 'camping': '⛺',
  'hotel': '🏨',   'hostel': '🎒', 'b&b':    '🏠',
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HospedajeCard({ hospedaje, variant = 'default' }) {
  const {
    id,
    nombre,
    categoria,
    descripcion_corta,
    telefono,
    direccion,
    servicios    = [],
    imagen_portada,
    precio_desde,
    moneda,
    destacado,
  } = hospedaje

  // Datos derivados
  const catInfo          = CATEGORIAS[categoria] ?? { emoji: '🏠', label: categoria }
  const gradiente        = GRADIENTES_PLACEHOLDER[categoria] ?? 'from-yunga-700 to-tierra-600'
  const emojiPH          = EMOJIS_PLACEHOLDER[categoria]     ?? '🏡'
  const precioFormateado = formatPrecio(precio_desde, moneda)
  const serviciosShow    = servicios.slice(0, 4)   // Máximo 4 tags visibles
  const serviciosExtra   = servicios.length - 4    // Cantidad de extras para badge "+N"

  return (
    // ── CARD WRAPPER ────────────────────────────────────────────────────────
    // .card-hospedaje aplica: bg-white, rounded-card (18px), shadow-card,
    // hover:shadow-card-hover, hover:-translate-y-1.5, transition, overflow-hidden.
    // flex flex-col h-full: hace que todas las cards en la grilla tengan
    // la misma altura (el footer queda siempre abajo).
    <article className="card-hospedaje group flex flex-col h-full">

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOQUE A — IMAGEN
          ───────────────────────────────────────────────────────────────────
          Posición en el archivo: primer hijo de <article>
          Altura: h-52 = 208px fija en todos los breakpoints
          Overflow hidden + Link: hace que el zoom de hover quede recortado
          y que toda la imagen sea un enlace al detalle.
      ═══════════════════════════════════════════════════════════════════════ */}
      <Link
        to={`/hospedaje/${id}`}
        className="relative block overflow-hidden h-52 shrink-0"
        tabIndex={-1}     /* El enlace principal está en "Ver detalle" abajo */
        aria-hidden="true"
      >
        {/* ── A.1 Imagen real vs placeholder ── */}
        {imagen_portada ? (
          // Imagen real: zoom sutil en hover con transition-transform
          <img
            src={imagen_portada}
            alt={`Foto principal de ${nombre}`}
            className="w-full h-full object-cover
                       transition-transform duration-500 ease-out
                       group-hover:scale-[1.07]"
            loading="lazy"
          />
        ) : (
          // Placeholder: gradiente temático + textura puntillada + emoji grande
          <div className={`w-full h-full bg-gradient-to-br ${gradiente}
                           flex items-center justify-center`}>
            {/* Textura de puntos (pattern SVG inline) sobre el gradiente */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <span className="text-8xl opacity-[0.18] select-none">{emojiPH}</span>
          </div>
        )}

        {/* ── A.2 Overlay oscuro al hover (sobre imagen O placeholder) ── */}
        <div className="absolute inset-0 bg-noche/0 group-hover:bg-noche/20
                        transition-colors duration-300 pointer-events-none" />

        {/* ── A.3 Gradiente inferior (legibilidad del precio abajo) ── */}
        <div className="absolute bottom-0 inset-x-0 h-20
                        bg-gradient-to-t from-noche/60 to-transparent
                        pointer-events-none" />

        {/* ── A.4 BADGE CATEGORÍA — esquina superior IZQUIERDA ──────────────
            Clases (.badge-categoria) definidas en index.css:
            bg-noche/70 backdrop-blur text-barro-400 text-xs font-bold
            uppercase tracking-wider px-3 py-1 rounded-full
        ── */}
        <span className="badge-categoria absolute top-3 left-3 z-10">
          <span className="mr-1">{catInfo.emoji}</span>
          {catInfo.label}
        </span>

        {/* ── A.5 BADGE DESTACADO — esquina superior DERECHA ───────────────
            Solo aparece si destacado === true en el JSON.
            Color barro-400 (dorado tierra) para diferenciar del badge de categoría.
        ── */}
        {destacado && (
          <span className="absolute top-3 right-3 z-10
                           flex items-center gap-1
                           bg-barro-400 text-white
                           text-[10px] font-bold tracking-wide uppercase
                           px-2.5 py-1 rounded-full shadow-md">
            <Star size={9} fill="currentColor" strokeWidth={0} />
            Destacado
          </span>
        )}

        {/* ── A.6 PRECIO DESDE — esquina inferior DERECHA ──────────────────
            Flotando sobre la imagen (z-10), con backdrop-blur para
            legibilidad sobre cualquier imagen.
            Solo se renderiza si precio_desde existe en el JSON.
        ── */}
        {precioFormateado && (
          <div className="absolute bottom-3 right-3 z-10
                          bg-noche/75 backdrop-blur-md
                          text-arena rounded-xl px-2.5 py-1.5 leading-none text-right">
            <span className="block text-barro-300 text-[9px] uppercase tracking-widest mb-0.5">
              desde
            </span>
            <span className="text-sm font-bold">{precioFormateado}</span>
            <span className="text-arena/50 text-[10px]"> /noche</span>
          </div>
        )}
      </Link>
      {/* ── FIN BLOQUE A ─────────────────────────────────────────────────── */}


      {/* ═══════════════════════════════════════════════════════════════════════
          BLOQUE B — CUERPO (nombre, ubicación, descripción, servicios)
          ───────────────────────────────────────────────────────────────────
          flex-1: ocupa el espacio restante entre la imagen y el footer,
          garantizando que el BLOQUE C (footer) siempre quede pegado abajo.
          p-5: padding uniforme de 20px en los 4 lados.
          gap entre elementos se maneja con mb-* individuales para control fino.
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 p-5">

        {/* ── B.1 NOMBRE ───────────────────────────────────────────────────
            font-display → Playfair Display (definido en tailwind.config.js)
            group-hover:text-tierra-600: cambia de color junto con el hover de la card
        ── */}
        <h3 className="font-display text-[1.05rem] leading-snug text-noche mb-1
                       group-hover:text-tierra-600 transition-colors duration-200">
          {nombre}
        </h3>

        {/* ── B.2 UBICACIÓN ────────────────────────────────────────────────
            Solo muestra el primer segmento antes de la primera coma,
            ej: "Ruta Provincial 83 Km 12" (sin ", Valle Grande, Jujuy")
            truncate evita overflow en nombres largos.
        ── */}
        <p className="flex items-center gap-1 text-xs text-tierra-400 mb-3 truncate">
          <MapPin size={11} className="shrink-0 text-barro-400" strokeWidth={2.5} />
          {direccion.split(',')[0]}
        </p>

        {/* ── B.3 DESCRIPCIÓN CORTA — solo en variant="default" ────────────
            line-clamp-2: recorta a 2 líneas con "..." automático (Tailwind).
            En variant="compact" este bloque no se renderiza, haciendo la
            card más densa, ideal para listas o resultados de búsqueda.
        ── */}
        {variant === 'default' && descripcion_corta && (
          <p className="text-sm text-tierra-600 leading-relaxed line-clamp-2 mb-4">
            {descripcion_corta}
          </p>
        )}

        {/* ── B.4 TAGS DE SERVICIOS ─────────────────────────────────────────
            Máximo 4 tags visibles (serviciosShow).
            Si hay más de 4 servicios, aparece badge "+N más".
            .tag-servicio (index.css): bg-arena-dark text-yunga-600 text-xs
            font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1
            Los íconos son los de lucide-react del MAPA_ICONOS de arriba.
        ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {serviciosShow.map(key => {
            const info  = SERVICIOS[key]
            const icono = ICONOS_SERVICIO[key]
            if (!info) return null
            return (
              <span key={key} className="tag-servicio" title={info.label}>
                {icono}
                {info.label}
              </span>
            )
          })}

          {/* Badge "+N más" cuando hay servicios que no caben */}
          {serviciosExtra > 0 && (
            <span className="inline-flex items-center
                             text-[11px] font-medium text-tierra-400
                             bg-arena-dark px-2 py-1 rounded-lg">
              +{serviciosExtra} más
            </span>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            BLOQUE C — FOOTER DE LA CARD (teléfono + botón Ver detalle)
            ─────────────────────────────────────────────────────────────────
            mt-auto: empuja este bloque al fondo del BLOQUE B sin importar
            cuánto texto tenga la descripción arriba.
            border-t border-arena-dark: línea sutil de separación.
            flex justify-between: teléfono a la izquierda, botón a la derecha.
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="mt-auto pt-3 border-t border-arena-dark
                        flex items-center justify-between gap-3">

          {/* ── C.1 TELÉFONO ──────────────────────────────────────────────
              <a href="tel:..."> permite llamar directamente en mobile.
              El número se limpia de espacios/guiones para el atributo href.
              En mobile (<sm) muestra "Llamar" en lugar del número completo.
          ── */}
          <a
            href={`tel:${telefono.replace(/[\s\-()+]/g, '')}`}
            className="flex items-center gap-1.5 text-xs text-tierra-500
                       hover:text-tierra-700 transition-colors duration-150 shrink-0"
            aria-label={`Llamar a ${nombre}`}
            onClick={e => e.stopPropagation()}
          >
            <Phone size={13} className="text-barro-400 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline truncate max-w-[130px]">{telefono}</span>
            <span className="sm:hidden font-medium">Llamar</span>
          </a>

          {/* ── C.2 BOTÓN VER DETALLE ─────────────────────────────────────
              Link de React Router → navega a /hospedaje/:id
              focus-visible: accesibilidad para usuarios de teclado.
              ArrowRight (lucide) como indicador visual de navegación.
          ── */}
          <Link
            to={`/hospedaje/${id}`}
            className="inline-flex items-center gap-1.5 shrink-0
                       bg-tierra-500 hover:bg-tierra-400
                       text-white text-xs font-semibold
                       px-3.5 py-2 rounded-xl
                       transition-colors duration-200
                       focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-tierra-400 focus-visible:ring-offset-1"
          >
            Ver detalle
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>

        </div>
        {/* ── FIN BLOQUE C ─────────────────────────────────────────────── */}

      </div>
      {/* ── FIN BLOQUE B ─────────────────────────────────────────────────── */}

    </article>
  )
}
