import { useHospedajes } from '../hooks/useHospedajes'

export default function MapaPage() {
  const { hospedajes } = useHospedajes()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl text-noche mb-2">Mapa de hospedajes</h1>
      <p className="text-tierra-500 mb-8">
        {hospedajes.length} hospedajes en San Francisco, Valle Grande, Jujuy
      </p>

      {/* Placeholder: se completa en PROMPT 5 con react-leaflet */}
      <div className="bg-yunga-50 border-2 border-dashed border-yunga-200 rounded-card
                      h-[500px] flex flex-col items-center justify-center text-center">
        <span className="text-6xl mb-4">🗺️</span>
        <h2 className="font-display text-2xl text-yunga-700 mb-2">Mapa interactivo</h2>
        <p className="text-tierra-400 max-w-sm">
          Este componente se construye en el <strong>PROMPT 5</strong> usando{' '}
          <code className="bg-yunga-100 px-1 rounded">react-leaflet</code> con 
          marcadores para cada hospedaje.
        </p>
        <div className="mt-6 flex flex-col gap-2 text-left">
          {hospedajes.map(h => (
            <div key={h.id} className="flex items-center gap-3 text-sm text-tierra-600">
              <span>📍</span>
              <span className="font-medium">{h.nombre}</span>
              <span className="text-tierra-400">
                ({h.coordenadas.lat}, {h.coordenadas.lng})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
