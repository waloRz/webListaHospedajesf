/**
 * seoConfig.js — src/seo/seoConfig.js
 *
 * Configuración centralizada de SEO para el sitio.
 * Todos los valores por defecto (globals) se definen aquí.
 * Las páginas individuales los sobreescriben donde corresponde.
 *
 * Se usa junto con react-helmet-async para inyectar <head> dinámicamente.
 */

// ── URL base del sitio (cambiar en producción) ────────────────────────────────
// Se usa para construir URLs absolutas en og:url, canonical, og:image, etc.
// En Vite podés leerlo de import.meta.env.VITE_SITE_URL
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://hospedajessanfrancisco.com.ar'

// ── Imagen Open Graph por defecto ────────────────────────────────────────────
// Debe ser una imagen de al menos 1200×630px. Ponerla en /public/og-image.jpg
export const OG_IMAGE_DEFAULT = `${SITE_URL}/og-image.jpg`

// ── Metadatos globales (se usan como fallback en todas las páginas) ───────────
export const SEO_DEFAULTS = {
  // title: se usa en <title> y og:title
  // El sufijo " | Hospedajes San Francisco" se agrega automáticamente en páginas internas.
  titleBase: 'Hospedajes en San Francisco, Jujuy | Turismo Valle Grande',

  // description: se usa en <meta name="description"> y og:description
  description: 'Encontrá los mejores hospedajes en San Francisco, Valle Grande, Jujuy. Hosterías, cabañas, camping y más en plena Yunga jujeña.',

  // keywords generales del sitio
  keywords: 'hospedajes san francisco jujuy, turismo valle grande jujuy, cabañas jujuy, camping jujuy, hostería jujuy, yunga jujeña, turismo naturaleza jujuy',

  // Open Graph básico
  og: {
    type:        'website',
    siteName:    'Hospedajes San Francisco Jujuy',
    locale:      'es_AR',
    image:       OG_IMAGE_DEFAULT,
    imageWidth:  '1200',
    imageHeight: '630',
    imageAlt:    'Paisaje de la Yunga Jujeña — San Francisco, Valle Grande, Jujuy',
  },

  // Twitter Card
  twitter: {
    card:    'summary_large_image',
    site:    '@hospedajesSFJujuy', // cambiar al handle real
    creator: '@hospedajesSFJujuy',
  },

  // Datos de la organización (para JSON-LD en homepage)
  organization: {
    name:        'Hospedajes San Francisco Jujuy',
    url:         SITE_URL,
    logo:        `${SITE_URL}/logo.png`,
    description: 'Directorio de hospedajes en San Francisco, Valle Grande, Jujuy, Argentina.',
    address: {
      locality:    'San Francisco',
      region:      'Jujuy',
      country:     'AR',
      postalCode:  '4634',
    },
    geo: {
      latitude:  '-23.9500',
      longitude: '-65.0700',
    },
    telephone:   '+54 388 400-0000',
    sameAs: [
      // Redes sociales — completar cuando existan
      // 'https://www.facebook.com/hospedajesSFJujuy',
      // 'https://www.instagram.com/hospedajesSFJujuy',
    ],
  },
}

// ── Mapa de categoría → tipo LodgingBusiness de Schema.org ───────────────────
// https://schema.org/LodgingBusiness y subtipos
export const SCHEMA_TIPO_ALOJAMIENTO = {
  'hotel':    'Hotel',
  'hostería': 'LodgingBusiness',  // No hay "Hostería" en schema.org; usamos LodgingBusiness
  'cabaña':   'Resort',            // Las cabañas de campo suelen mapearse a Resort
  'camping':  'Campground',
  'hostel':   'Hostel',
  'b&b':      'BedAndBreakfast',
}
