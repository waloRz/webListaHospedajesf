import { Link } from 'react-router-dom'
import { Mountain, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-noche text-arena/60 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mountain size={22} className="text-barro-400" />
              <span className="font-display text-lg text-arena">
                Hospedajes en <span className="text-barro-400">San Francisco</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Directorio turístico de hospedajes en San Francisco, Valle Grande, provincia de Jujuy, Argentina.
            </p>
          </div>
          <div>
            <h4 className="text-arena font-semibold text-sm uppercase tracking-wider mb-4">Explorar</h4>
            <nav className="flex flex-col gap-2">
              {[{ to: '/', label: 'Inicio' }, { to: '/hospedajes', label: 'Ver todos los hospedajes' }, { to: '/mapa', label: 'Mapa de la zona' }, { to: '/contacto', label: 'Sumar mi hospedaje' }].map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm hover:text-barro-400 transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-arena font-semibold text-sm uppercase tracking-wider mb-4">Ubicación</h4>
            <div className="flex items-start gap-2 text-sm mb-2">
              <MapPin size={15} className="text-barro-400 mt-0.5 shrink-0" />
              <span>San Francisco, Valle Grande<br />Jujuy, Argentina</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={15} className="text-barro-400 shrink-0" />
              <span>Consultá directamente a cada hospedaje</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-arena/30">
          © {new Date().getFullYear()} Hospedajes San Francisco Jujuy · Directorio turístico
        </div>
      </div>
    </footer>
  )
}
