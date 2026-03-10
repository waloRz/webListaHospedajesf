/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  MapaTodos — src/components/mapa/MapaTodos.jsx                         ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Mapa general para la ruta /mapa que muestra TODOS los hospedajes activos
 * con marcadores agrupados por categoría y colores distintos.
 *
 * ── FUNCIONALIDADES ─────────────────────────────────────────────────────────
 * - Un marcador por hospedaje, color según categoría
 * - Click en marcador: popup con foto, nombre, categoría y link "Ver detalle"
 * - Botón "Centrar mapa" vuelve al centro de San Francisco
 * - Leyenda de categorías en esquina superior derecha
 * - Altura 100% del contenedor padre (la página define la altura)
 *
 * Props:
 *   hospedajes  {object[]}  — array de hospedajes (del hook useHospedajes)
 *   className   {string}    — clases extra para el wrapper
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate }   from 'react-router-dom'
import { Crosshair, AlertTriangle } from 'lucide-react'
import { CATEGORIAS }    from '../../utils/serviciosConfig'

// Centro de San Francisco, Jujuy
const SF_CENTER = [-23.621640, -64.949483]
const ZOOM_TODOS = 19.5

// Color de pin por categoría (hex para el SVG inline)
const COLOR_CATEGORIA = {
  'hotel':    { fill: '#4d7f93', label: '#cielo' },  // cielo-600
  'hostería': { fill: '#8B5E3C', label: '#tierra' }, // tierra-500
  'cabaña':   { fill: '#62402a', label: '#tierra' }, // tierra-700
  'camping':  { fill: '#335c43', label: '#yunga' },  // yunga-600
  'hostel':   { fill: '#C4956A', label: '#barro' },  // barro-500
  'b&b':      { fill: '#274836', label: '#yunga' },  // yunga-800
}
const COLOR_DEFAULT = { fill: '#8B5E3C' }

function crearIconoCategoria(L, categoria) {
  const color = (COLOR_CATEGORIA[categoria] || COLOR_DEFAULT).fill
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 38" width="28" height="38">
      <defs>
        <filter id="s" x="-30%" y="-10%" width="160%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#00000050"/>
        </filter>
      </defs>
      <path d="M14 1C7.9 1 3 5.9 3 12c0 8 11 25 11 25S25 20 25 12C25 5.9 20.1 1 14 1z"
            fill="${color}" filter="url(#s)"/>
      <circle cx="14" cy="12" r="5" fill="white" opacity="0.92"/>
      <circle cx="14" cy="12" r="2.5" fill="${color}"/>
    </svg>`

  return L.divIcon({
    html:        svg,
    className:   '',
    iconSize:    [28, 38],
    iconAnchor:  [14, 38],
    popupAnchor: [0, -40],
  })
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MapaTodos({ hospedajes = [], className = '' }) {
  const navigate    = useNavigate()
  const mapaRef     = useRef(null)
  const leafletRef  = useRef(null)
  const [estado, setEstado]   = useState('cargando')
  const [mapListo, setMapListo] = useState(false)

  useEffect(() => {
    if (!mapaRef.current) return

    let L_ref = null

    const init = async () => {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        L_ref = L

        // Fix íconos default (bug conocido de Leaflet con Vite/Webpack)
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        if (leafletRef.current) {
          leafletRef.current.remove()
          leafletRef.current = null
        }

        // ── Crear mapa centrado en San Francisco ──────────────────────────
        const map = L.map(mapaRef.current, {
          center:      SF_CENTER,
          zoom:        ZOOM_TODOS,
          zoomControl: false,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)

        // ── Marcador por hospedaje ────────────────────────────────────────
        hospedajes.forEach(h => {
          const { lat, lng } = h.coordenadas ?? {}
          if (typeof lat !== 'number' || typeof lng !== 'number') return

          const icono  = crearIconoCategoria(L, h.categoria)
          const catInfo = CATEGORIAS[h.categoria] ?? { emoji: '🏠', label: h.categoria }

          const fotoHtml = h.imagen_portada
            ? `<img src="${h.imagen_portada}" alt="${h.nombre}"
                    style="width:100%;height:70px;object-fit:cover;border-radius:6px;margin-bottom:8px"
                    onerror="this.style.display='none'">`
            : `<div style="width:100%;height:50px;background:linear-gradient(135deg,#274836,#8B5E3C);
                            border-radius:6px;margin-bottom:8px;
                            display:flex;align-items:center;justify-content:center;font-size:20px;opacity:0.5">
                 ${catInfo.emoji}
               </div>`

          // El popup tiene un botón "Ver detalle" — usamos un ID para engancharlo
          const btnId = `btn-detalle-${h.id}`

          const popup = L.popup({
            maxWidth:    220,
            className:   'popup-hospedaje',
            closeButton: true,
          }).setContent(`
            <div style="font-family:'DM Sans',sans-serif;min-width:180px;max-width:210px">
              ${fotoHtml}
              <span style="
                display:inline-flex;align-items:center;gap:4px;
                background:#1A2332;color:#C4956A;
                font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                padding:3px 8px;border-radius:20px;margin-bottom:6px;
              ">${catInfo.emoji} ${catInfo.label}</span>
              <p style="
                font-family:'Playfair Display',Georgia,serif;
                font-size:14px;font-weight:700;color:#1A2332;margin:0 0 4px;line-height:1.3;
              ">${h.nombre}</p>
              <p style="font-size:11px;color:#7a5133;margin:0 0 8px">
                📍 ${h.direccion.split(',')[0]}
              </p>
              <button id="${btnId}" style="
                width:100%;background:#8B5E3C;color:white;border:none;cursor:pointer;
                font-size:12px;font-weight:600;padding:7px 12px;border-radius:8px;
                font-family:'DM Sans',sans-serif;
                transition:background 0.15s;
              " onmouseover="this.style.background='#d97f35'"
                 onmouseout="this.style.background='#8B5E3C'">
                Ver detalle →
              </button>
            </div>`)

          const marcador = L.marker([lat, lng], { icon: icono })
            .bindPopup(popup)
            .addTo(map)

          // Enganchamos la navegación al botón del popup
          marcador.on('popupopen', () => {
            setTimeout(() => {
              document.getElementById(btnId)?.addEventListener('click', () => {
                navigate(`/hospedaje/${h.id}`)
              })
            }, 50)
          })
        })

        // ── Ajustar el mapa para que entren todos los marcadores ──────────
        const bounds = hospedajes
          .filter(h => h.coordenadas?.lat && h.coordenadas?.lng)
          .map(h => [h.coordenadas.lat, h.coordenadas.lng])

        if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: ZOOM_TODOS })
        }

        leafletRef.current = map
        L_ref = L
        setMapListo(true)
        setEstado('ok')

      } catch (err) {
        console.error('Error inicializando Leaflet:', err)
        setEstado('error')
      }
    }

    init()

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [hospedajes, navigate])

  // ── Función: recentrar el mapa en San Francisco ──────────────────────────
  const centrarMapa = () => {
    leafletRef.current?.setView(SF_CENTER, ZOOM_TODOS, { animate: true })
  }

  if (estado === 'error') {
    return (
      <div className={`${className} bg-arena rounded-card border border-arena-dark
                       flex flex-col items-center justify-center gap-3 text-center p-8`}>
        <AlertTriangle size={32} className="text-tierra-300" strokeWidth={1.5} />
        <div>
          <p className="font-semibold text-noche mb-1">No se pudo cargar el mapa</p>
          <p className="text-sm text-tierra-400">
            Ejecutá:{' '}
            <code className="bg-arena-dark rounded px-2 py-0.5 font-mono text-xs">
              npm install react-leaflet leaflet
            </code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-card overflow-hidden ${className}`}>

      {/* Loader */}
      {estado === 'cargando' && (
        <div className="absolute inset-0 z-10 bg-arena flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-tierra-300 border-t-tierra-500 rounded-full animate-spin" />
          <p className="text-xs text-tierra-400">Cargando mapa…</p>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div ref={mapaRef} className="w-full h-full" />

      {/* Botón "Centrar mapa" */}
      {mapListo && (
        <button
          onClick={centrarMapa}
          title="Centrar en San Francisco, Jujuy"
          className="absolute top-3 left-3 z-[400]
                     w-9 h-9 flex items-center justify-center
                     bg-white/95 backdrop-blur-sm rounded-xl
                     shadow-[0_2px_12px_rgba(0,0,0,0.15)]
                     hover:bg-white border border-white/60
                     text-tierra-600 hover:text-tierra-500
                     transition-all duration-200 active:scale-[0.93]"
          aria-label="Centrar mapa en San Francisco, Jujuy"
        >
          <Crosshair size={16} strokeWidth={2} />
        </button>
      )}

      {/* Leyenda de categorías */}
      {mapListo && (
        <div className="absolute top-3 right-3 z-[400]
                        bg-white/95 backdrop-blur-sm rounded-xl
                        shadow-[0_2px_12px_rgba(0,0,0,0.12)]
                        border border-white/60 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-tierra-400 mb-2">
            Categorías
          </p>
          {Object.entries(COLOR_CATEGORIA).map(([cat, { fill }]) => {
            const info  = CATEGORIAS[cat]
            const count = hospedajes.filter(h => h.categoria === cat).length
            if (count === 0) return null
            return (
              <div key={cat} className="flex items-center gap-2 mb-1 last:mb-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: fill }}
                />
                <span className="text-xs text-noche">
                  {info?.emoji} {info?.label}
                </span>
                <span className="text-[10px] text-tierra-400 ml-auto">({count})</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
