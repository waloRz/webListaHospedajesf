import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-4">🏔️</p>
      <h1 className="font-display text-4xl text-noche mb-3">Página no encontrada</h1>
      <p className="text-tierra-500 mb-8 max-w-sm">
        Esta ruta se perdió entre las montañas. Volvé al inicio para explorar los hospedajes.
      </p>
      <Link to="/" className="btn-primary">Volver al inicio</Link>
    </div>
  )
}
