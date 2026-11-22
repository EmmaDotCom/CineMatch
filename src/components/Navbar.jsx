import { Link, NavLink } from 'react-router-dom'

// NavLink ajoute automatiquement la classe "active" au lien de la page affichée.
function Navbar() {
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
      </nav>
    </header>
  )
}

export default Navbar
