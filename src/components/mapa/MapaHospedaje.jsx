/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  MapaHospedaje — src/components/mapa/MapaHospedaje.jsx                 ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * DEPENDENCIAS:
 *   npm install react-leaflet leaflet
 *
 * IMPORTANTE — CSS de Leaflet:
 *   Agregar en index.css (o main.jsx):
 *   import 'leaflet/dist/leaflet.css'
 *
 * NOTA NEXT.JS:
 *   Si migrás a Next.js, este componente debe importarse con:
 *   const MapaHospedaje = dynamic(() => import('./MapaHospedaje'), { ssr: false })
 *   porque Leaflet usa `window` y no funciona en SSR.
 *   En Vite/CRA no hay ese problema.
 *
 * ── QUÉ MUESTRA ─────────────────────────────────────────────────────────────
 *
 *  ┌────────────────────────────────────────────────────┐
 *  │  [OpenStreetMap tiles]                             │
 *  │                                                    │
 *  │         🏔 [Marcador personalizado]                │
 *  │            ┌──────────────────────┐               │
 *  │            │ [foto] Nombre        │  ← Popup       │
 *  │            │ 📞 Teléfono          │               │
 *  │            └──────────────────────┘               │
 *  │                                                    │
 *  │  [+]  [Abrir en Google Maps ↗]  [-]               │
 *  └────────────────────────────────────────────────────┘
 *
 * Props:
 *   hospedaje  {object}   — objeto completo de hospedajes.json
 *   altura     {string}   — clase Tailwind de altura (default: 'h-64 md:h-[400px]')
 *   className  {string}   — clases extra para el wrapper
 *   autoPopup  {bool}     — si true, el popup se abre automáticamente al cargar
 */

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MapPin, AlertTriangle } from 'lucide-react'
import { googleMapsUrl } from '../../utils/formatters'

// Coordenadas del centro de San Francisco, Jujuy
const SF_CENTER = { lat: -23.621640, lng: -64.949483 }
const ZOOM_DEFAULT = 16

export default function MapaHospedaje({
  hospedaje,
  altura     = 'h-64 md:h-[400px]',
  className  = '',
  autoPopup  = true,
}) {
  const mapaRef      = useRef(null)   // ref al <div> del contenedor
  const leafletRef   = useRef(null)   // instancia del mapa Leaflet
  const [estado, setEstado] = useState('cargando')  // 'cargando' | 'ok' | 'error' | 'sin-coords'

  // ── Validar coordenadas ──────────────────────────────────────────────────
  const coords = hospedaje?.coordenadas
  const lat    = coords?.lat
  const lng    = coords?.lng
  const tieneCoords = typeof lat === 'number' && typeof lng === 'number'
                      && lat !== 0 && lng !== 0

  // ── Inicializar Leaflet ──────────────────────────────────────────────────
  useEffect(() => {
    if (!tieneCoords) {
      setEstado('sin-coords')
      return
    }
    if (!mapaRef.current) return

    let mapInstance = null

    const initLeaflet = async () => {
      try {
        // Importación dinámica: Leaflet usa `window`, no funciona en SSR
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')

        // Leaflet v1 tiene un bug con Webpack/Vite donde los íconos default
        // no se cargan. Este fix manual resuelve el problema sin configuración extra.
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        // Evitar doble inicialización (React StrictMode monta 2 veces en dev)
        if (leafletRef.current) {
          leafletRef.current.remove()
          leafletRef.current = null
        }

        // ── Crear el mapa ──────────────────────────────────────────────────
        mapInstance = L.map(mapaRef.current, {
          center:          [lat, lng],
          zoom:            ZOOM_DEFAULT,
          zoomControl:     false,      // lo reubicamos abajo a la derecha
          attributionControl: true,
        })

        // ── Tile layer OpenStreetMap (gratuito, sin API key) ───────────────
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapInstance)

        // ── Control de zoom — reubicado a la esquina inferior derecha ─────
        // (la esquina inferior izquierda la ocupa el atribución)
        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

        // ── Ícono personalizado con los colores de la paleta ──────────────
        // SVG inline: pin tierra-500 con sombra, sin dependencia de archivos
        const iconoSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
            <defs>
              <filter id="sombra" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000040"/>
              </filter>
            </defs>
            <!-- Cuerpo del pin -->
            <path d="M16 2C9.4 2 4 7.4 4 14c0 9 12 26 12 26S28 23 28 14C28 7.4 22.6 2 16 2z"
                  fill="#8B5E3C" filter="url(#sombra)"/>
            <!-- Borde más claro -->
            <path d="M16 3.5C10.2 3.5 5.5 8.2 5.5 14c0 8.5 10.5 23.5 10.5 23.5S26.5 22.5 26.5 14C26.5 8.2 21.8 3.5 16 3.5z"
                  fill="#C4956A" opacity="0.3"/>
            <!-- Círculo interior blanco -->
            <circle cx="16" cy="14" r="5.5" fill="white" opacity="0.95"/>
            <!-- Punto interior tierra -->
            <circle cx="16" cy="14" r="3" fill="#8B5E3C"/>
          </svg>`

        const iconoPersonalizado = L.divIcon({
          html:        iconoSVG,
          className:   '',           // evitar estilos default de Leaflet
          iconSize:    [32, 42],
          iconAnchor:  [16, 42],    // punta del pin
          popupAnchor: [0, -44],    // popup arriba del pin
        })

        // ── Marcador ──────────────────────────────────────────────────────
        const marcador = L.marker([lat, lng], { icon: iconoPersonalizado })
          .addTo(mapInstance)

        // ── Popup: foto pequeña + nombre + teléfono ───────────────────────
        const fotoSrc    = hospedaje.imagen_portada || ''
        const fotoHtml   = fotoSrc
          ? `<img src="${fotoSrc}" alt="${hospedaje.nombre}"
                  style="width:100%;height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px;"
                  onerror="this.style.display='none'">`
          : `<div style="width:100%;height:60px;background:linear-gradient(135deg,#274836,#8B5E3C);
                          border-radius:8px;margin-bottom:8px;
                          display:flex;align-items:center;justify-content:center;font-size:24px;opacity:0.5">
               🏡
             </div>`

        const popupContenido = `
          <div style="
            font-family: 'DM Sans', sans-serif;
            min-width: 180px;
            max-width: 220px;
          ">
            ${fotoHtml}
            <p style="
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 14px;
              font-weight: 700;
              color: #1A2332;
              margin: 0 0 4px 0;
              line-height: 1.3;
            ">${hospedaje.nombre}</p>
            <p style="
              font-size: 12px;
              color: #7a5133;
              margin: 0 0 6px 0;
              display: flex;
              align-items: center;
              gap: 4px;
            ">📍 ${hospedaje.direccion.split(',')[0]}</p>
            <a href="tel:${hospedaje.telefono.replace(/[\s\-()+]/g, '')}"
               style="
                 font-size: 12px;
                 font-weight: 600;
                 color: #8B5E3C;
                 text-decoration: none;
                 display: flex;
                 align-items: center;
                 gap: 4px;
               ">📞 ${hospedaje.telefono}</a>
          </div>`

        marcador.bindPopup(popupContenido, {
          maxWidth:   240,
          className:  'popup-hospedaje',   // clase para estilos custom en index.css
          closeButton: true,
        })

        // Abrir popup automáticamente si autoPopup === true
        if (autoPopup) {
          mapInstance.whenReady(() => {
            setTimeout(() => marcador.openPopup(), 300)
          })
        }

        leafletRef.current = mapInstance
        setEstado('ok')

      } catch (err) {
        console.error('Error inicializando Leaflet:', err)
        setEstado('error')
      }
    }

    initLeaflet()

    // ── Cleanup al desmontar ────────────────────────────────────────────────
    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [lat, lng, tieneCoords, autoPopup, hospedaje])

  // ── Render: estado sin coordenadas ──────────────────────────────────────
  if (!tieneCoords) {
    return (
      <div className={`${altura} ${className}
                       bg-arena rounded-xl border border-arena-dark
                       flex flex-col items-center justify-center gap-2 text-center px-4`}>
        <AlertTriangle size={24} className="text-tierra-300" strokeWidth={1.5} />
        <p className="text-sm text-tierra-400 font-medium">
          Ubicación no disponible
        </p>
        <p className="text-xs text-tierra-300">
          Este hospedaje no tiene coordenadas registradas
        </p>
      </div>
    )
  }

  return (
    // ── WRAPPER RELATIVO — el botón "Abrir en Google Maps" es absoluto ──
    <div className={`relative rounded-xl overflow-hidden ${altura} ${className}`}>

      {/* ── Estado: cargando ── */}
      {estado === 'cargando' && (
        <div className="absolute inset-0 z-10 bg-arena
                        flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-tierra-300 border-t-tierra-500
                          rounded-full animate-spin" />
          <p className="text-xs text-tierra-400">Cargando mapa…</p>
        </div>
      )}

      {/* ── Estado: error de Leaflet ── */}
      {estado === 'error' && (
        <div className="absolute inset-0 z-10 bg-arena rounded-xl
                        flex flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertTriangle size={28} className="text-tierra-300" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold text-noche mb-1">
              No se pudo cargar el mapa
            </p>
            <p className="text-xs text-tierra-400">
              Verificá tu conexión o que react-leaflet esté instalado:
              <code className="block bg-arena-dark rounded px-2 py-1 mt-1 font-mono text-[11px]">
                npm install react-leaflet leaflet
              </code>
            </p>
          </div>
        </div>
      )}

      {/* ── Contenedor del mapa (Leaflet lo llena) ─────────────────────── */}
      <div
        ref={mapaRef}
        className="w-full h-full"
        aria-label={`Mapa mostrando la ubicación de ${hospedaje.nombre}`}
      />

      {/* ══════════════════════════════════════════════════════════════════
          BOTÓN FLOTANTE — "Abrir en Google Maps"
          ────────────────────────────────────────────────────────────────
          Posición: absolute bottom-3 left-3
          z-[400]: por encima de los controles de Leaflet (z-index 1000 aprox)
          pero con z-[400] queda debajo del popup (z-index ~700 en Leaflet).
          El botón se muestra solo cuando el mapa está OK.
      ══════════════════════════════════════════════════════════════════ */}
      {estado === 'ok' && (
        <a
          href={googleMapsUrl(lat, lng, hospedaje.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 left-3 z-[400]
                     flex items-center gap-1.5
                     bg-white/95 backdrop-blur-sm
                     text-noche text-xs font-semibold
                     px-3 py-2 rounded-xl
                     shadow-[0_2px_12px_rgba(0,0,0,0.15)]
                     hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                     border border-white/60
                     transition-all duration-200
                     active:scale-[0.96]"
          aria-label="Abrir ubicación en Google Maps"
        >
          <MapPin size={12} className="text-tierra-500 shrink-0" strokeWidth={2.5} />
          Abrir en Google Maps
          <ExternalLink size={10} className="text-tierra-400 shrink-0" strokeWidth={2} />
        </a>
      )}
    </div>
  )
}
