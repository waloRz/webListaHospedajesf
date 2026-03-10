/**
 * HomePage — src/pages/HomePage.jsx
 *
 * Importa HospedajeCard y lo usa en la grilla de destacados.
 * La grilla responsive se define AQUÍ (no en el componente):
 *   - mobile:  1 columna  (grid-cols-1)
 *   - tablet:  2 columnas (sm:grid-cols-2)
 *   - desktop: 3 columnas (lg:grid-cols-3)
 */
import { Link } from 'react-router-dom'
import SEOHead    from '../seo/SEOHead'
import { buildWebSiteSchema, buildLocalBusinessSchema } from '../seo/jsonLdBuilders'
import { SEO_DEFAULTS } from '../seo/seoConfig'
import { Search, MapPin } from 'lucide-react'
import { useHospedajes } from '../hooks/useHospedajes'
import { CATEGORIAS }    from '../utils/serviciosConfig'
import HospedajeCard     from '../components/hospedaje/HospedajeCard'

export default function HomePage() {
  const { totalActivos, destacados } = useHospedajes()

  return (
    <div>
      {/* ══════════════════════════════════════════════════════════════════
          SEO — Homepage
          Equivalente a: export const metadata = { ... } en layout.tsx Next.js
          Title completo: no agrega sufijo (appendSiteName=false)
          JSON-LD: WebSite + LocalBusiness (TouristInformationCenter)
      ══════════════════════════════════════════════════════════════════ */}
      <SEOHead
        title={SEO_DEFAULTS.titleBase}
        description={SEO_DEFAULTS.description}
        appendSiteName={false}
        jsonLd={[buildWebSiteSchema(), buildLocalBusinessSchema()]}
      />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden
                          bg-gradient-to-br from-noche via-yunga-900 to-tierra-800">
        {/* Silueta de montañas decorativa */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1440 560" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path fill="#3D6B4F" d="M0,400 L250,180 L450,320 L650,120 L900,280 L1100,80 L1300,220 L1440,140 L1440,560 L0,560Z"/>
            <path fill="#8B5E3C" opacity="0.6" d="M0,460 L350,260 L550,380 L800,200 L1050,340 L1250,160 L1440,260 L1440,560 L0,560Z"/>
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-block bg-barro-500/20 border border-barro-400/40 text-barro-400
                           text-xs font-bold tracking-[3px] uppercase px-4 py-2 rounded-full mb-6">
            ⛰️ Valle Grande · Jujuy · Argentina
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-arena leading-tight mb-4">
            Tu estadía en<br />
            <span className="text-barro-400">San Francisco</span>
          </h1>
          <p className="text-arena/60 text-lg mb-10 max-w-md mx-auto">
            Encontrá el hospedaje ideal entre la selva y las montañas jujeñas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/hospedajes" className="btn-primary text-base px-8 py-3.5 justify-center">
              <Search size={18} /> Ver todos los hospedajes
            </Link>
            <Link to="/mapa"
              className="bg-white/10 hover:bg-white/20 text-arena border border-white/20
                         font-semibold px-8 py-3.5 rounded-btn flex items-center gap-2
                         transition-colors duration-200 justify-center">
              <MapPin size={18} /> Ver en el mapa
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <div className="bg-noche">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-12">
          {[
            { num: totalActivos, label: 'Hospedajes' },
            { num: Object.keys(CATEGORIAS).length, label: 'Categorías' },
            { num: '100%', label: 'Gratuito' },
            { num: '1', label: 'Destino único' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl text-barro-400 font-bold">{num}</div>
              <div className="text-arena/40 text-xs uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESTACADOS ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl text-noche">Hospedajes destacados</h2>
          <Link to="/hospedajes" className="text-yunga-500 text-sm font-semibold hover:underline">
            Ver todos →
          </Link>
        </div>

        {/*
          GRILLA RESPONSIVE — se define aquí, no dentro de HospedajeCard
          ┌──────────────────────────────────────────────────────┐
          │ mobile  < 640px  → 1 columna  (grid-cols-1)         │
          │ tablet  ≥ 640px  → 2 columnas (sm:grid-cols-2)      │
          │ desktop ≥ 1024px → 3 columnas (lg:grid-cols-3)      │
          │ gap-7 = 28px entre cards                            │
          │ items-stretch: todas las cards tienen la misma altura│
          └──────────────────────────────────────────────────────┘
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
          {destacados.map(h => (
            <HospedajeCard key={h.id} hospedaje={h} variant="default" />
          ))}
        </div>
      </section>
    </div>
  )
}
