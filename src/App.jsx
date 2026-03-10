import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage      from './pages/HomePage'
import HospedajesPage from './pages/HospedajesPage'
import HospedajeDetallePage from './pages/HospedajeDetallePage'
import MapaPage      from './pages/MapaPage'
import NotFoundPage  from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todas las rutas comparten el Layout (Header + Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index                   element={<HomePage />} />
          <Route path="hospedajes"        element={<HospedajesPage />} />
          <Route path="hospedaje/:id"     element={<HospedajeDetallePage />} />
          <Route path="mapa"              element={<MapaPage />} />
          <Route path="*"                 element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
