export function formatPrecio(precio, moneda = 'ARS') {
  if (!precio) return null
  const sym = moneda === 'USD' ? 'USD ' : '$ '
  return sym + precio.toLocaleString('es-AR')
}

export function whatsappUrl(numero, nombre) {
  const msg = encodeURIComponent(`Hola! Consulto por disponibilidad en ${nombre}`)
  return `https://wa.me/${numero}?text=${msg}`
}

export function googleMapsUrl(lat, lng, nombre) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(nombre)}`
}
