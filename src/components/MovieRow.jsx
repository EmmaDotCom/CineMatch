import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'

// Rangée de films qui défile horizontalement.
// "title" peut contenir du JSX (pour colorer un mot-clé),
// "link" (optionnel) ajoute un lien « Tout voir » vers le catalogue.
function MovieRow({ title, movies, link }) {
  if (movies.length === 0) return null

  return (
    <section className="movie-row">
      <div className="row-header">
        <h2>{title}</h2>
        {link && (
          <Link to={link} className="see-all">
            Tout voir →
          </Link>
        )}
      </div>
      <ul className="row">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </ul>
    </section>
  )
}

export default MovieRow
