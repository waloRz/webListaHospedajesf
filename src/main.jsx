/**
 * main.jsx — Entry point de la aplicación
 *
 * HelmetProvider debe envolver TODO el árbol de componentes para que
 * react-helmet-async funcione. Es el equivalente al <Head> de Next.js.
 *
 * IMPORTANTE: sin HelmetProvider, cualquier <Helmet> dentro de la app
 * lanzará un error en desarrollo.
 */
import React        from 'react'
import ReactDOM     from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App          from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HelmetProvider gestiona el contexto para todos los <Helmet> de la app */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)
