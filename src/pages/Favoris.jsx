import { Link } from 'react-router-dom'
import { useFavorites } from '../context/useFavorites'
import MovieCard from '../components/MovieCard'

function Favoris() {
  const { favorites } = useFavorites()

  return (
    <section>
      <h1>Mes favoris</h1>

      {favorites.length === 0 ? (
        <>
          <p>Aucun favori pour l’instant. Clique sur ♡ sur un film pour l’ajouter.</p>
          <Link to="/catalogue" className="btn">
            Parcourir le catalogue
          </Link>
        </>
      ) : (
        <>
          <p className="muted">
            {favorites.length} film{favorites.length > 1 ? 's' : ''}
          </p>
          {/* Le cœur de chaque carte permet de retirer le film de la liste */}
          <ul className="grid">
            {favorites.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default Favoris
