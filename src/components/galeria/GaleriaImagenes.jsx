/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  GaleriaImagenes — src/components/galeria/GaleriaImagenes.jsx          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * DEPENDENCIA EXTERNA: Swiper.js (solo para el carousel mobile)
 * Instalación: npm install swiper
 *
 * COMPORTAMIENTO POR BREAKPOINT:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ MOBILE  (< 768px / md)                                                  │
 * │   Carousel horizontal de Swiper con paginación de puntos.              │
 * │   Ocupa 100% del ancho, height 260px.                                  │
 * │   El botón "Ver todas" flota sobre el último slide.                    │
 * │                                                                         │
 * │ DESKTOP (≥ 768px / md)                                                  │
 * │   Grid estilo Airbnb:                                                   │
 * │   ┌──────────────────────────┬───────────┬───────────┐                 │
 * │   │                          │ thumb 2   │ thumb 3   │                 │
 * │   │   IMAGEN PRINCIPAL       ├───────────┼───────────┤                 │
 * │   │      (col-span-2)        │ thumb 4   │ thumb 5   │                 │
 * │   │                          │(+ overlay)│           │                 │
 * │   └──────────────────────────┴───────────┴───────────┘                 │
 * │   Botón "Ver todas las fotos" en esquina inferior derecha              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * LIGHTBOX (modal):
 *   - Se abre al clickear cualquier imagen (grid o carousel)
 *   - Navegación con flechas ← → y teclado (ArrowLeft / ArrowRight)
 *   - Cerrar con botón ✕, click en overlay, o tecla Escape
 *   - Contador "3 / 6" en la esquina inferior
 *   - Miniaturas clickeables en la parte inferior
 *
 * Props:
 *   imagenes   {string[]}  — array de URLs de imágenes
 *   nombre     {string}    — nombre del hospedaje (para alt text)
 *   categoria  {string}    — para el gradiente placeholder
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

// Gradientes placeholder por categoría (igual que HospedajeCard)
const GRADIENTES = {
  'hostería': 'from-yunga-800  via-yunga-600  to-tierra-500',
  'cabaña':   'from-tierra-700 via-tierra-500 to-barro-500',
  'camping':  'from-yunga-900  via-yunga-700  to-cielo-600',
  'hotel':    'from-cielo-700  via-cielo-500  to-yunga-500',
  'hostel':   'from-barro-700  via-tierra-500 to-yunga-600',
  'b&b':      'from-tierra-600 via-barro-500  to-yunga-600',
}
const EMOJIS = {
  'hostería': '🏡', 'cabaña': '🛖', 'camping': '⛺',
  'hotel': '🏨',   'hostel': '🎒', 'b&b':    '🏠',
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GaleriaImagenes({ imagenes = [], nombre = '', categoria = '' }) {
  // ── Estado del lightbox ──────────────────────────────────────────────────
  const [lightboxAbierto, setLightboxAbierto] = useState(false)
  const [indiceActivo,    setIndiceActivo]    = useState(0)

  // Derived
  const gradiente  = GRADIENTES[categoria] ?? 'from-yunga-700 to-tierra-600'
  const emojiPH    = EMOJIS[categoria]     ?? '🏡'
  const totalFotos = imagenes.length

  // Si no hay imágenes usamos placeholders para que la UI se vea completa
  const todasLasImagenes = totalFotos > 0
    ? imagenes
    : [null, null, null, null, null]   // 5 placeholders

  const total = todasLasImagenes.length

  // ── Abrir lightbox ───────────────────────────────────────────────────────
  const abrirLightbox = useCallback((indice) => {
    setIndiceActivo(indice)
    setLightboxAbierto(true)
  }, [])

  const cerrarLightbox = useCallback(() => {
    setLightboxAbierto(false)
  }, [])

  // ── Navegación del lightbox ──────────────────────────────────────────────
  const irAnterior = useCallback(() => {
    setIndiceActivo(prev => (prev === 0 ? total - 1 : prev - 1))
  }, [total])

  const irSiguiente = useCallback(() => {
    setIndiceActivo(prev => (prev === total - 1 ? 0 : prev + 1))
  }, [total])

  // ── Teclado (Escape / flechas) ───────────────────────────────────────────
  useEffect(() => {
    if (!lightboxAbierto) return
    const handler = (e) => {
      if (e.key === 'Escape')     cerrarLightbox()
      if (e.key === 'ArrowLeft')  irAnterior()
      if (e.key === 'ArrowRight') irSiguiente()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [lightboxAbierto, irAnterior, irSiguiente, cerrarLightbox])

  // ── Bloquear scroll del body cuando el lightbox está abierto ────────────
  useEffect(() => {
    document.body.style.overflow = lightboxAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxAbierto])

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          GALERÍA MOBILE — Carousel Swiper (md:hidden)
          ──────────────────────────────────────────────────────────────────
          Se oculta en md y arriba. Requiere que Swiper esté instalado:
            npm install swiper
          Los estilos base de Swiper se importan en index.css (ver abajo).
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative mb-6">
        <SwiperCarousel
          imagenes={todasLasImagenes}
          nombre={nombre}
          gradiente={gradiente}
          emojiPH={emojiPH}
          onClickImagen={abrirLightbox}
        />

        {/* Botón "Ver todas" sobre el carousel mobile */}
        {total > 1 && (
          <button
            onClick={() => abrirLightbox(0)}
            className="absolute bottom-4 right-4 z-10
                       flex items-center gap-1.5
                       bg-white/90 backdrop-blur-sm
                       text-noche text-xs font-semibold
                       px-3 py-2 rounded-xl shadow-md
                       hover:bg-white transition-colors"
          >
            <Images size={13} strokeWidth={2} />
            Ver todas las fotos ({total})
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          GALERÍA DESKTOP — Grid estilo Airbnb (hidden md:block)
          ──────────────────────────────────────────────────────────────────
          Layout de 4 columnas / 2 filas:
          ┌──────────────────────────┬───────────┬───────────┐
          │                          │  img[1]   │  img[2]   │
          │        img[0]            ├───────────┼───────────┤
          │     (row-span-2)         │  img[3]   │  img[4]   │
          │    (col-span-2)          │(+ overlay)│           │
          └──────────────────────────┴───────────┴───────────┘
          Total: 5 slots. Si hay menos imágenes, se muestran placeholders.
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative mb-8">
        <div
          className="grid gap-2 rounded-card overflow-hidden"
          style={{ gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '200px 200px' }}
        >

          {/* ── IMAGEN PRINCIPAL (slot 0) — fila 1-2, columna 1 ── */}
          <SlotImagen
            src={todasLasImagenes[0]}
            alt={`${nombre} - foto principal`}
            gradiente={gradiente}
            emojiPH={emojiPH}
            className="row-span-2 col-span-1"
            onClick={() => abrirLightbox(0)}
            prioridad
          />

          {/* ── MINIATURAS (slots 1 al 4) — columnas 2 y 3 ── */}
          {[1, 2, 3, 4].map((slot) => {
            const src         = todasLasImagenes[slot]
            const esUltimo    = slot === 4
            const masImagenes = total > 5
            return (
              <SlotImagen
                key={slot}
                src={src}
                alt={`${nombre} - foto ${slot + 1}`}
                gradiente={gradiente}
                emojiPH={emojiPH}
                className="col-span-1"
                onClick={() => abrirLightbox(Math.min(slot, total - 1))}
              >
                {/* Overlay "+N fotos más" en la última miniatura (slot 4)
                    si hay más imágenes de las que caben en el grid */}
                {esUltimo && masImagenes && (
                  <div className="absolute inset-0 bg-noche/55 flex flex-col
                                  items-center justify-center pointer-events-none">
                    <span className="text-white font-display text-2xl font-bold leading-none">
                      +{total - 5}
                    </span>
                    <span className="text-white/80 text-xs mt-1">más fotos</span>
                  </div>
                )}
              </SlotImagen>
            )
          })}
        </div>

        {/* ── Botón "Ver todas las fotos" — esquina inferior derecha ── */}
        <button
          onClick={() => abrirLightbox(0)}
          className="absolute bottom-4 right-4 z-10
                     flex items-center gap-2
                     bg-white border border-arena-dark
                     text-noche text-sm font-semibold
                     px-4 py-2.5 rounded-xl shadow-card
                     hover:shadow-card-hover hover:border-tierra-300
                     transition-all duration-200 active:scale-[0.97]"
        >
          <Images size={15} strokeWidth={2} className="text-tierra-500" />
          Ver todas las fotos
          <span className="text-tierra-400 font-normal">({total})</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LIGHTBOX / MODAL
          ──────────────────────────────────────────────────────────────────
          Cubre toda la pantalla con overlay oscuro.
          La imagen activa está centrada. Flechas laterales para navegar.
          Tira de miniaturas clickeables abajo.
          Se cierra con ✕, Escape, o click fuera de la imagen.
      ══════════════════════════════════════════════════════════════════════ */}
      {lightboxAbierto && (
        <Lightbox
          imagenes={todasLasImagenes}
          indice={indiceActivo}
          nombre={nombre}
          gradiente={gradiente}
          emojiPH={emojiPH}
          onCerrar={cerrarLightbox}
          onAnterior={irAnterior}
          onSiguiente={irSiguiente}
          onSeleccionar={setIndiceActivo}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SlotImagen — Un slot del grid desktop
 * Muestra imagen real o gradiente placeholder.
 * children: overlay opcional (ej: "+N fotos más")
 */
function SlotImagen({ src, alt, gradiente, emojiPH, className = '', onClick, children, prioridad = false }) {
  const [error, setError] = useState(false)
  const mostrarPlaceholder = !src || error

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className={`relative overflow-hidden cursor-pointer group ${className}`}
    >
      {mostrarPlaceholder ? (
        <div className={`w-full h-full bg-gradient-to-br ${gradiente}
                         flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-[0.07]"
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <span className="text-5xl opacity-20 select-none">{emojiPH}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={prioridad ? 'eager' : 'lazy'}
          onError={() => setError(true)}
          className="w-full h-full object-cover
                     transition-transform duration-500 ease-out
                     group-hover:scale-[1.05]"
        />
      )}

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-noche/0 group-hover:bg-noche/15
                      transition-colors duration-300 pointer-events-none" />

      {children}
    </div>
  )
}

/**
 * SwiperCarousel — Carousel mobile usando Swiper.js
 *
 * IMPORTANTE: requiere que en index.css agregues:
 *   import 'swiper/css';
 *   import 'swiper/css/pagination';
 *
 * O en el HTML:
 *   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
 *
 * Si Swiper no está instalado, el componente muestra solo la primera imagen.
 */
function SwiperCarousel({ imagenes, nombre, gradiente, emojiPH, onClickImagen }) {
  const swiperRef    = useRef(null)
  const [indice, setIndice] = useState(0)
  const total = imagenes.length

  // Inicializar Swiper de forma dinámica (evita error si no está instalado)
  useEffect(() => {
    let swiperInstance = null

    const init = async () => {
      try {
        const { Swiper } = await import('swiper')
        const { Pagination } = await import('swiper/modules')
        await import('swiper/css')
        await import('swiper/css/pagination')

        if (!swiperRef.current) return
        swiperInstance = new Swiper(swiperRef.current, {
          modules: [Pagination],
          slidesPerView: 1,
          spaceBetween: 0,
          loop: total > 1,
          pagination: { el: '.swiper-pagination', clickable: true },
          on: { slideChange: (s) => setIndice(s.realIndex) },
        })
      } catch {
        // Swiper no instalado: el fallback muestra solo la primera imagen
        console.warn('Swiper no instalado. Ejecutá: npm install swiper')
      }
    }

    init()
    return () => swiperInstance?.destroy(true, true)
  }, [total])

  return (
    <div
      ref={swiperRef}
      className="swiper w-full rounded-card overflow-hidden"
      style={{ height: '260px' }}
    >
      <div className="swiper-wrapper">
        {imagenes.map((src, i) => (
          <div
            key={i}
            className="swiper-slide relative cursor-pointer"
            onClick={() => onClickImagen(i)}
          >
            {src ? (
              <img
                src={src}
                alt={`${nombre} - foto ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradiente}
                               flex items-center justify-center`}>
                <span className="text-7xl opacity-20 select-none">{emojiPH}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="swiper-pagination" />
    </div>
  )
}

/**
 * Lightbox — Modal full-screen para navegar las imágenes
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────┐
 * │ [✕]                                    [3 / 6]          │ ← header
 * ├─────────────────────────────────────────────────────────┤
 * │        [◀]   IMAGEN ACTIVA CENTRADA    [▶]              │ ← zona principal
 * ├─────────────────────────────────────────────────────────┤
 * │  [mini1] [mini2] [mini3•] [mini4] [mini5]               │ ← tira miniaturas
 * └─────────────────────────────────────────────────────────┘
 */
function Lightbox({ imagenes, indice, nombre, gradiente, emojiPH, onCerrar, onAnterior, onSiguiente, onSeleccionar }) {
  const total       = imagenes.length
  const miniRef     = useRef(null)
  const [imgError, setImgError] = useState({})

  // Auto-scroll de la tira de miniaturas para mantener la activa visible
  useEffect(() => {
    const el = miniRef.current?.children[indice]
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [indice])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-noche-dark/97 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de fotos de ${nombre}`}
    >

      {/* ── HEADER: contador + botón cerrar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3
                      bg-gradient-to-b from-noche-dark/80 to-transparent
                      absolute top-0 inset-x-0 z-10">
        <span className="text-arena/70 text-sm font-medium">
          {nombre}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-arena/50 text-sm tabular-nums">
            {indice + 1} / {total}
          </span>
          <button
            onClick={onCerrar}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-white/10 hover:bg-white/20
                       text-arena transition-colors duration-150
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Cerrar galería"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── ZONA PRINCIPAL: imagen + flechas ── */}
      <div
        className="flex-1 flex items-center justify-center relative px-4 pt-16 pb-4"
        onClick={onCerrar}  /* click en el fondo cierra */
      >

        {/* Flecha ANTERIOR */}
        {total > 1 && (
          <button
            onClick={e => { e.stopPropagation(); onAnterior() }}
            className="absolute left-3 md:left-6 z-10
                       w-11 h-11 flex items-center justify-center rounded-full
                       bg-white/10 hover:bg-white/25 backdrop-blur-sm
                       text-arena transition-all duration-150
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
        )}

        {/* Imagen activa */}
        <div
          className="relative max-w-4xl w-full max-h-full flex items-center justify-center"
          onClick={e => e.stopPropagation()}  /* evita cerrar al clickear la imagen */
        >
          {imagenes[indice] && !imgError[indice] ? (
            <img
              key={indice}   /* key fuerza re-render y animación de entrada */
              src={imagenes[indice]}
              alt={`${nombre} - foto ${indice + 1}`}
              onError={() => setImgError(prev => ({ ...prev, [indice]: true }))}
              className="max-w-full max-h-[65vh] object-contain rounded-xl
                         shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                         animate-in fade-in duration-200"
            />
          ) : (
            /* Placeholder si la imagen falla o es null */
            <div className={`w-full aspect-video max-h-[65vh] rounded-xl
                             bg-gradient-to-br ${gradiente}
                             flex items-center justify-center`}>
              <span className="text-8xl opacity-25 select-none">{emojiPH}</span>
            </div>
          )}
        </div>

        {/* Flecha SIGUIENTE */}
        {total > 1 && (
          <button
            onClick={e => { e.stopPropagation(); onSiguiente() }}
            className="absolute right-3 md:right-6 z-10
                       w-11 h-11 flex items-center justify-center rounded-full
                       bg-white/10 hover:bg-white/25 backdrop-blur-sm
                       text-arena transition-all duration-150
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* ── TIRA DE MINIATURAS (scroll horizontal) ── */}
      {total > 1 && (
        <div
          className="shrink-0 bg-gradient-to-t from-noche-dark/80 to-transparent
                     px-4 py-4"
        >
          <div
            ref={miniRef}
            className="flex gap-2 overflow-x-auto pb-1
                       scrollbar-hide justify-center"
            style={{ scrollbarWidth: 'none' }}
          >
            {imagenes.map((src, i) => (
              <button
                key={i}
                onClick={() => onSeleccionar(i)}
                className={`
                  shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden
                  transition-all duration-200 border-2
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                  ${i === indice
                    ? 'border-barro-400 opacity-100 scale-105'
                    : 'border-transparent opacity-50 hover:opacity-80'
                  }
                `}
                aria-label={`Ver foto ${i + 1}`}
                aria-pressed={i === indice}
              >
                {src && !imgError[i] ? (
                  <img
                    src={src}
                    alt={`Miniatura ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradiente}
                                   flex items-center justify-center`}>
                    <span className="text-xl opacity-30 select-none">{emojiPH}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
