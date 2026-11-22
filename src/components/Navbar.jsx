import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Navbar() {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Cine<span>Match</span>
      </Link>
      <nav>
        <NavLink to="/" end>
          Accueil
        </NavLink>
        <NavLink to="/catalogue">Catalogue</NavLink>
        <NavLink to="/favoris">Favoris</NavLink>
        <NavLink to="/connexion" className="nav-account">
          {user ? `👤 ${user.name}` : 'Connexion'}
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
