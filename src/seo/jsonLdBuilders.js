/**
 * jsonLdBuilders.js — src/seo/jsonLdBuilders.js
 *
 * Funciones puras que construyen objetos JSON-LD válidos según schema.org.
 * Cada función recibe datos del hospedaje (o del sitio) y retorna un objeto
 * listo para pasarle al prop `jsonLd` de <SEOHead>.
 *
 * REFERENCIAS:
 *   - https://schema.org/LodgingBusiness
 *   - https://schema.org/Hotel
 *   - https://schema.org/Campground
 *   - https://schema.org/BedAndBreakfast
 *   - https://developers.google.com/search/docs/appearance/structured-data/local-business
 *   - https://validator.schema.org/ — para validar los schemas generados
 *
 * TIPOS USADOS:
 *   buildLodgingBusinessSchema(hospedaje)  — para páginas de detalle
 *   buildWebSiteSchema()                   — para la homepage
 *   buildBreadcrumbSchema(items)           — para navegación
 *   buildLocalBusinessSchema()             — para el negocio/directorio en homepage
 */

import { SITE_URL, SEO_DEFAULTS, SCHEMA_TIPO_ALOJAMIENTO } from './seoConfig'

// ─────────────────────────────────────────────────────────────────────────────

/**
 * buildLodgingBusinessSchema — JSON-LD para la página de detalle de un hospedaje
 *
 * Genera un schema de tipo LodgingBusiness (o subtipo: Hotel, Campground, etc.)
 * con todos los campos relevantes del hospedaje.
 *
 * Google usa este schema para:
 *   - Rich snippets en búsquedas ("Hospedaje en San Francisco Jujuy")
 *   - Integración con Google Maps y Google Travel
 *   - Paneles de Knowledge Graph
 *
 * @param {object} h — objeto completo del hospedaje (de hospedajes.json)
 * @returns {object} — schema JSON-LD listo para inyectar
 */
export function buildLodgingBusinessSchema(h) {
  // Tipo schema.org según la categoría del hospedaje
  const schemaType = SCHEMA_TIPO_ALOJAMIENTO[h.categoria] || 'LodgingBusiness'

  // Construir array de imágenes con URLs absolutas
  const images = []
  if (h.imagen_portada) images.push(`${SITE_URL}${h.imagen_portada}`)
  if (h.imagenes?.length) {
    h.imagenes.forEach(url => {
      const abs = url.startsWith('http') ? url : `${SITE_URL}${url}`
      if (!images.includes(abs)) images.push(abs)
    })
  }

  // Construir array de amenities (servicios del hospedaje)
  // Schema.org usa amenityFeature con el tipo LocationFeatureSpecification
  const amenities = (h.servicios || []).map(servicio => ({
    '@type': 'LocationFeatureSpecification',
    name:    formatServicioLabel(servicio),
    value:   true,
  }))

  // PriceRange: aproximado basado en precio_desde
  const priceRange = h.precio_desde
    ? (h.precio_desde < 5000 ? '$' : h.precio_desde < 20000 ? '$$' : '$$$')
    : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type':    schemaType,

    // ── Identificación ────────────────────────────────────────────────────
    '@id':  `${SITE_URL}/hospedaje/${h.id}`,
    name:   h.nombre,
    url:    `${SITE_URL}/hospedaje/${h.id}`,

    // ── Descripción ───────────────────────────────────────────────────────
    description: h.descripcion,

    // ── Imágenes ──────────────────────────────────────────────────────────
    ...(images.length > 0 && { image: images.length === 1 ? images[0] : images }),

    // ── Dirección y geolocalización ───────────────────────────────────────
    address: {
      '@type':          'PostalAddress',
      streetAddress:    h.direccion.split(',')[0].trim(),
      addressLocality:  'San Francisco',
      addressRegion:    'Jujuy',
      addressCountry:   'AR',
      postalCode:       '4634',
    },

    ...(h.coordenadas?.lat && h.coordenadas?.lng && {
      geo: {
        '@type':    'GeoCoordinates',
        latitude:   h.coordenadas.lat.toString(),
        longitude:  h.coordenadas.lng.toString(),
      },
    }),

    // ── Contacto ──────────────────────────────────────────────────────────
    telephone: h.telefono,

    // ── Precio ────────────────────────────────────────────────────────────
    ...(h.precio_desde && {
      priceRange,
      offers: {
        '@type':         'Offer',
        price:           h.precio_desde.toString(),
        priceCurrency:   h.moneda || 'ARS',
        description:     `Precio desde ${h.precio_desde.toLocaleString('es-AR')} ${h.moneda || 'ARS'} por noche`,
      },
    }),

    // ── Capacidad ─────────────────────────────────────────────────────────
    ...(h.capacidad && {
      numberOfRooms: h.capacidad,
    }),

    // ── Servicios / Amenities ─────────────────────────────────────────────
    ...(amenities.length > 0 && { amenityFeature: amenities }),

    // ── Tipo de turismo como audience ─────────────────────────────────────
    ...(h.categorias_turismo?.length > 0 && {
      audience: h.categorias_turismo.map(tipo => ({
        '@type':       'Audience',
        audienceType:  formatTurismoLabel(tipo),
      })),
    }),

    // ── Área de servicio ──────────────────────────────────────────────────
    areaServed: {
      '@type': 'City',
      name:    'San Francisco, Valle Grande, Jujuy',
    },

    // ── Idioma ────────────────────────────────────────────────────────────
    availableLanguage: {
      '@type': 'Language',
      name:    'Spanish',
    },
  }

  return schema
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * buildWebSiteSchema — JSON-LD WebSite con SearchAction para la homepage
 *
 * Habilita el "Sitelinks search box" en Google cuando alguien
 * busca el nombre del sitio directamente.
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      `${SITE_URL}/#website`,
    name:       SEO_DEFAULTS.og.siteName,
    url:        SITE_URL,
    description: SEO_DEFAULTS.description,
    inLanguage: 'es-AR',
    // SearchAction: permite que Google muestre un buscador en los resultados
    potentialAction: {
      '@type':       'SearchAction',
      target: {
        '@type':      'EntryPoint',
        urlTemplate:  `${SITE_URL}/hospedajes?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * buildLocalBusinessSchema — JSON-LD LocalBusiness para el directorio
 *
 * Representa al sitio como un negocio local (directorio turístico).
 * Aparece en Google Maps y búsquedas locales.
 */
export function buildLocalBusinessSchema() {
  const { organization } = SEO_DEFAULTS
  return {
    '@context': 'https://schema.org',
    '@type':    'TouristInformationCenter',
    '@id':      `${SITE_URL}/#organization`,
    name:       organization.name,
    url:        organization.url,
    logo: {
      '@type': 'ImageObject',
      url:     organization.logo,
    },
    description: organization.description,
    telephone:   organization.telephone,
    address: {
      '@type':          'PostalAddress',
      addressLocality:  organization.address.locality,
      addressRegion:    organization.address.region,
      addressCountry:   organization.address.country,
      postalCode:       organization.address.postalCode,
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   organization.geo.latitude,
      longitude:  organization.geo.longitude,
    },
    ...(organization.sameAs.length > 0 && { sameAs: organization.sameAs }),
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * buildBreadcrumbSchema — JSON-LD BreadcrumbList para navegación
 *
 * Genera la cadena de migas de pan que Google muestra en los resultados:
 *   Inicio > Hospedajes > Hostería Los Alisos
 *
 * @param {Array<{name: string, url: string}>} items — ítems del breadcrumb
 * @returns {object} — schema JSON-LD
 */
export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type':   'ListItem',
      position:  index + 1,
      name:      item.name,
      item:      item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────────────────────────────────────

// Convierte clave de servicio a label legible para schema.org
function formatServicioLabel(key) {
  const labels = {
    wifi:               'WiFi gratuito',
    desayuno:           'Desayuno incluido',
    estacionamiento:    'Estacionamiento',
    admite_mascotas:    'Acepta mascotas',
    quincho:            'Quincho',
    parrilla:           'Parrilla',
    pileta:             'Pileta',
    aire_acondicionado: 'Aire acondicionado',
    acceso_rio:         'Acceso al río',
    cocina_equipada:    'Cocina equipada',
    sanitarios:         'Sanitarios completos',
    agua_caliente:      'Agua caliente',
    fogon:              'Fogón',
    guias_locales:      'Guías locales disponibles',
  }
  return labels[key] || key
}

// Convierte clave de turismo a label legible
function formatTurismoLabel(key) {
  const labels = {
    naturaleza: 'Amantes de la naturaleza',
    aventura:   'Turismo de aventura',
    familia:    'Familias',
    romantico:  'Parejas',
    trekking:   'Trekking y senderismo',
    pesca:      'Pesca deportiva',
    mochilero:  'Mochileros',
    cultural:   'Turismo cultural',
  }
  return labels[key] || key
}
