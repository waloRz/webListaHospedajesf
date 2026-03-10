// src/utils/servicios.js
// Mapeo de claves de servicio → ícono (emoji) + etiqueta legible

export const SERVICIOS_MAP = {
  wifi:               { icono: '📶', label: 'WiFi gratis' },
  estacionamiento:    { icono: '🚗', label: 'Estacionamiento' },
  desayuno:           { icono: '🍳', label: 'Desayuno' },
  pileta:             { icono: '🏊', label: 'Pileta' },
  admite_mascotas:    { icono: '🐾', label: 'Mascotas OK' },
  aire_acondicionado: { icono: '❄️',  label: 'Aire A/C' },
  quincho:            { icono: '🔥', label: 'Quincho' },
  parrilla_individual:{ icono: '🥩', label: 'Parrilla propia' },
  cocina_equipada:    { icono: '🍽️', label: 'Cocina equipada' },
  acceso_rio:         { icono: '🌊', label: 'Acceso al río' },
  calefaccion:        { icono: '♨️', label: 'Calefacción' },
  tv:                 { icono: '📺', label: 'TV' },
  fogon:              { icono: '🪵', label: 'Fogón' },
  sanitarios:         { icono: '🚿', label: 'Sanitarios' },
}

export const CATEGORIAS_MAP = {
  'hotel':    { label: 'Hotel',             color: 'chip-cielo' },
  'hostería': { label: 'Hostería',          color: 'chip-selva' },
  'cabaña':   { label: 'Cabaña',            color: 'chip-tierra' },
  'camping':  { label: 'Camping',           color: 'chip-selva' },
  'b&b':      { label: 'B&B / Casa flia.',  color: 'chip-tierra' },
  'hostel':   { label: 'Hostel',            color: 'chip-cielo' },
}

export const CATEGORIAS_TURISMO_MAP = {
  naturaleza: '🌿 Naturaleza',
  aventura:   '🧗 Aventura',
  familia:    '👨‍👩‍👧 Familia',
  descanso:   '😌 Descanso',
  mochilero:  '🎒 Mochilero',
  cultural:   '🏛️ Cultural',
  pesca:      '🎣 Pesca',
}

/**
 * Devuelve el ícono y label de un servicio dado su key.
 * Si no existe, retorna un genérico.
 */
export function getServicio(key) {
  return SERVICIOS_MAP[key] ?? { icono: '✔️', label: key }
}

/**
 * Devuelve info de la categoría de hospedaje.
 */
export function getCategoria(key) {
  return CATEGORIAS_MAP[key?.toLowerCase()] ?? { label: key, color: 'chip-tierra' }
}
