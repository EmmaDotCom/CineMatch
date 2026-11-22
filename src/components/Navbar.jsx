import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// NavLink ajoute automatiquement la classe "active" au lien de la page affichée.
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
        {/* Connecté : on affiche le nom (qui mène à la page compte), sinon « Connexion » */}
        <NavLink to="/connexion" className="nav-account">
          {user ? `👤 ${user.name}` : 'Connexion'}
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
