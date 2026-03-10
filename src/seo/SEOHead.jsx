/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  SEOHead — src/seo/SEOHead.jsx                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Componente que inyecta dinámicamente las etiquetas <head> usando
 * react-helmet-async (instalación: npm install react-helmet-async).
 *
 * EQUIVALENTE NEXT.JS:
 *   En Next.js 13+ este trabajo lo hace la función `generateMetadata()` de
 *   cada page.tsx + el objeto `metadata` en layout.tsx.
 *   En Vite + React Router usamos react-helmet-async que manipula el DOM del
 *   <head> en el cliente (no hay SSR en este proyecto, por lo que el SEO
 *   depende del pre-renderizado o de bots que ejecutan JavaScript).
 *
 * ETIQUETAS QUE GENERA:
 *   - <title>
 *   - <meta name="description">
 *   - <meta name="keywords">
 *   - <link rel="canonical">
 *   - Open Graph: og:title, og:description, og:url, og:image, og:type, og:locale
 *   - Twitter Card: twitter:card, twitter:title, twitter:description, twitter:image
 *   - <script type="application/ld+json"> — JSON-LD (Structured Data)
 *   - <meta name="robots"> — indexación
 *
 * Props:
 *   title          {string}   — título de la página (sin sufijo)
 *   description    {string}   — descripción (máx 160 chars recomendado)
 *   keywords       {string}   — keywords separadas por coma
 *   canonical      {string}   — URL canónica completa
 *   ogImage        {string}   — URL absoluta de la imagen OG
 *   ogImageAlt     {string}   — alt text de la imagen OG
 *   ogType         {string}   — 'website' | 'article' (default: 'website')
 *   noIndex        {bool}     — true para evitar indexación (ej: 404, preview)
 *   jsonLd         {object|object[]} — uno o varios objetos JSON-LD
 *   appendSiteName {bool}     — si true agrega " | Hospedajes SF Jujuy" al title
 */

import { Helmet }            from 'react-helmet-async'
import { SEO_DEFAULTS, SITE_URL } from './seoConfig'

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogImageAlt,
  ogType        = 'website',
  noIndex       = false,
  jsonLd        = null,
  appendSiteName = true,
}) {
  // ── Construir valores finales (prop → default) ───────────────────────────
  const finalTitle       = title
    ? (appendSiteName ? `${title} | Hospedajes SF Jujuy` : title)
    : SEO_DEFAULTS.titleBase

  const finalDescription = (description || SEO_DEFAULTS.description)
    .slice(0, 160)  // Google muestra ~155-160 chars

  const finalKeywords    = keywords || SEO_DEFAULTS.keywords
  const finalCanonical   = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_URL)
  const finalOgImage     = ogImage || SEO_DEFAULTS.og.image
  const finalOgImageAlt  = ogImageAlt || SEO_DEFAULTS.og.imageAlt

  // ── JSON-LD: normalizar a array ──────────────────────────────────────────
  const jsonLdArray = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : []

  return (
    <Helmet>
      {/* ── TITLE ─────────────────────────────────────────────────────── */}
      <title>{finalTitle}</title>

      {/* ── META BÁSICAS ──────────────────────────────────────────────── */}
      <meta name="description"    content={finalDescription} />
      <meta name="keywords"       content={finalKeywords} />
      <meta name="author"         content="Hospedajes San Francisco Jujuy" />

      {/* Robots: noindex si es una página que no debe indexarse */}
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow'}
      />

      {/* URL canónica: evita contenido duplicado si la misma página tiene
          múltiples URLs (ej: con y sin trailing slash, con query params) */}
      <link rel="canonical" href={finalCanonical} />

      {/* ── OPEN GRAPH (Facebook, LinkedIn, WhatsApp, etc.) ───────────── */}
      <meta property="og:title"       content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url"         content={finalCanonical} />
      <meta property="og:type"        content={ogType} />
      <meta property="og:image"       content={finalOgImage} />
      <meta property="og:image:alt"   content={finalOgImageAlt} />
      <meta property="og:image:width" content={SEO_DEFAULTS.og.imageWidth} />
      <meta property="og:image:height"content={SEO_DEFAULTS.og.imageHeight} />
      <meta property="og:site_name"   content={SEO_DEFAULTS.og.siteName} />
      <meta property="og:locale"      content={SEO_DEFAULTS.og.locale} />

      {/* ── TWITTER CARD ──────────────────────────────────────────────── */}
      <meta name="twitter:card"        content={SEO_DEFAULTS.twitter.card} />
      <meta name="twitter:site"        content={SEO_DEFAULTS.twitter.site} />
      <meta name="twitter:title"       content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image"       content={finalOgImage} />
      <meta name="twitter:image:alt"   content={finalOgImageAlt} />

      {/* ── JSON-LD (Structured Data) ─────────────────────────────────── */}
      {jsonLdArray.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // dangerouslySetInnerHTML es la única forma de inyectar JSON-LD
          // dentro de react-helmet-async sin que React escape los caracteres
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </Helmet>
  )
}
