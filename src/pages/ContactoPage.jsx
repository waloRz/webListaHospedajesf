/**
 * ContactoPage — src/pages/ContactoPage.jsx
 *
 * Página para que propietarios de hospedajes se contacten
 * para sumarse al directorio. Contacto directo por WhatsApp.
 */

import { MessageCircle, MapPin, Star, Users, TrendingUp, CheckCircle, QrCode, Phone } from 'lucide-react'
import SEOHead from '../seo/SEOHead'

const WA_NUMBER  = '5493874434836'
const WA_MENSAJE = encodeURIComponent(
  'Hola! Vi el directorio de Hospedajes en San Francisco y me gustaría sumar mi hospedaje. ¿Me podrías dar más información?'
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MENSAJE}`

const BENEFICIOS = [
  {
    icono: <QrCode size={22} strokeWidth={1.5} />,
    titulo: 'Código QR en Turismo',
    texto: 'Tu hospedaje se promociona a través de un código QR disponible en la oficina de Turismo de San Francisco.',
  },
  {
    icono: <Star size={22} strokeWidth={1.5} />,
    titulo: 'Costo mínimo de inscripción',
    texto: 'Accedé al directorio con una inscripción accesible. Una inversión mínima para una visibilidad máxima.',
  },
  {
    icono: <Users size={22} strokeWidth={1.5} />,
    titulo: 'Búsqueda inteligente',
    texto: 'El turista filtra por los servicios que necesita. Dejamos atrás las listas de solo números de teléfono sin información.',
  },
  {
    icono: <TrendingUp size={22} strokeWidth={1.5} />,
    titulo: 'Visibles las 24 horas',
    texto: 'Tu hospedaje está disponible para ser consultado en cualquier momento del día, todos los días del año.',
  },
  {
    icono: <Phone size={22} strokeWidth={1.5} />,
    titulo: 'Contacto directo e inmediato',
    texto: 'El turista se comunica con vos por llamada (Personal, Movistar o Claro) o mensaje de WhatsApp en un solo click.',
  },
  {
    icono: <MapPin size={22} strokeWidth={1.5} />,
    titulo: 'Ubicación en el mapa',
    texto: 'Tu hospedaje aparece con un pin en el mapa interactivo para que el turista llegue sin perderse.',
  },
]

const PASOS = [
  { num: '01', texto: 'Escribinos por WhatsApp contándonos sobre tu hospedaje.' },
  { num: '02', texto: 'Te pedimos fotos, servicios, precio y datos de contacto.' },
  { num: '03', texto: 'En menos de 48hs tu hospedaje ya aparece en el directorio.' },
]

export default function ContactoPage() {
  return (
    <>
      <SEOHead
        title="Sumar mi hospedaje — Hospedajes en San Francisco Jujuy"
        description="¿Tenés un hospedaje en San Francisco, Valle Grande? Sumalo al directorio turístico y llegá a más turistas."
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-yunga-900 via-yunga-800 to-noche
                          relative overflow-hidden">
        {/* Textura de puntos */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white/80
                           text-xs font-bold tracking-[3px] uppercase px-4 py-2
                           rounded-full mb-6">
            🏔️ Para propietarios de hospedajes
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-tight mb-5">
            Sumá tu hospedaje al<br />
            <span className="text-barro-400">directorio turístico</span>
          </h1>
          <p className="text-arena/70 text-lg max-w-xl mx-auto mb-10">
            Llegá a más turistas que visitan San Francisco, Valle Grande.
            Es facil y se configura en menos de 48 horas.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3
                       bg-[#25D366] hover:bg-[#1fb855]
                       text-white font-bold text-lg
                       px-8 py-4 rounded-2xl
                       shadow-lg hover:shadow-xl
                       transition-all duration-200 active:scale-[0.97]"
          >
            <MessageCircle size={22} strokeWidth={2} />
            Quiero sumar mi hospedaje
          </a>
          <p className="text-arena/35 text-sm mt-4">
            Respondemos en el día · Sin costos ocultos
          </p>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-noche text-center mb-2">
          ¿Por qué sumarte?
        </h2>
        <p className="text-tierra-400 text-center mb-10">
          Beneficios de estar en el directorio
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFICIOS.map((b, i) => (
            <div key={i}
              className="bg-white border border-arena-dark rounded-2xl p-6
                         hover:shadow-card transition-shadow duration-200">
              <div className="w-11 h-11 rounded-xl bg-yunga-50 text-yunga-600
                               flex items-center justify-center mb-4">
                {b.icono}
              </div>
              <h3 className="font-semibold text-noche mb-2">{b.titulo}</h3>
              <p className="text-tierra-400 text-sm leading-relaxed">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section className="bg-arena py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-noche text-center mb-2">
            ¿Cómo funciona?
          </h2>
          <p className="text-tierra-400 text-center mb-10">
            Tres pasos simples para aparecer en el directorio
          </p>
          <div className="flex flex-col gap-5">
            {PASOS.map((p, i) => (
              <div key={i}
                className="flex items-start gap-5 bg-white rounded-2xl px-6 py-5
                           border border-arena-dark shadow-sm">
                <span className="font-display text-3xl text-barro-300 font-bold
                                 shrink-0 leading-none mt-0.5">
                  {p.num}
                </span>
                <p className="text-noche text-base leading-relaxed pt-1">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ NECESITÁS ─────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-noche text-center mb-2">
          ¿Qué necesitás?
        </h2>
        <p className="text-tierra-400 text-center mb-10">
          Solo te pedimos información básica de tu hospedaje
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Nombre del hospedaje',
            'Fotos (mínimo 3, en buena calidad)',
            'Descripción breve',
            'Servicios que ofrecés',
            'Precio por noche',
            'Número de WhatsApp o teléfono',
            'Dirección o ubicación',
            'Categoría (cabaña, camping, hostel...)',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-3 px-4
                                    bg-white border border-arena-dark rounded-xl">
              <CheckCircle size={17} strokeWidth={2} className="text-yunga-500 shrink-0" />
              <span className="text-noche text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DECLARACIÓN DE RESPONSABILIDAD ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-arena border border-arena-dark rounded-2xl px-6 py-5
                        flex items-start gap-4">
          <span className="text-2xl shrink-0">📋</span>
          <div>
            <p className="text-sm font-semibold text-noche mb-1">
              Compromiso de información veraz
            </p>
            <p className="text-sm text-tierra-400 leading-relaxed">
              Al registrar tu hospedaje en el directorio, declarás que toda la información
              proporcionada (fotos, precios, servicios y datos de contacto) es verdadera
              y actualizada. Sos responsable de mantenerla al día y de notificarnos
              cualquier cambio. Nos reservamos el derecho de dar de baja cualquier
              hospedaje con información falsa o engañosa.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="bg-noche py-16 mb-0">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-arena mb-4">
            ¿Listo para sumarte?
          </h2>
          <p className="text-arena/50 mb-8">
            Escribinos por WhatsApp y en menos de 48hs
            tu hospedaje ya aparece en el directorio.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3
                       bg-[#25D366] hover:bg-[#1fb855]
                       text-white font-bold text-lg
                       px-8 py-4 rounded-2xl
                       shadow-lg hover:shadow-xl
                       transition-all duration-200 active:scale-[0.97]"
          >
            <MessageCircle size={22} strokeWidth={2} />
            Escribinos por WhatsApp
          </a>
          <p className="text-arena/25 text-sm mt-4">
            San Francisco · Valle Grande · Jujuy
          </p>
        </div>
      </section>
    </>
  )
}
