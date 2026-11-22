import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

// Squelette commun à toutes les pages.
// <Outlet /> est remplacé par la page qui correspond à l'URL.
function Layout() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
