import { Outlet, useLocation } from 'react-router-dom'
import Header    from './Header'
import Footer    from './Footer'
import BottomNav from './BottomNav'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparente={pathname === '/'} />

      {/* pb-16 en mobile para que el contenido no quede tapado por el BottomNav */}
      <main className="flex-1 md:pb-0 pb-16">
        <Outlet />
      </main>

      <Footer />

      {/* Barra de navegación inferior — solo mobile */}
      <BottomNav />
    </div>
  )
}
