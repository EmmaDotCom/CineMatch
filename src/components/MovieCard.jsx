import { Link } from 'react-router-dom'
import { IMG_URL } from '../api/tmdb'
import FavoriteButton from './FavoriteButton'

// Carte réutilisable : catalogue, favoris, rangées de l'accueil, films similaires.
// Elle reçoit un objet film de TMDB via la prop "movie".
function MovieCard({ movie }) {
  const year = movie.release_date?.slice(0, 4) || '—'
  const note = movie.vote_average ? movie.vote_average.toFixed(1) : '—'

  return (
    <li className="card">
      {/* Un clic sur la carte mène à la page détail du film */}
      <Link to={`/film/${movie.id}`}>
        {movie.poster_path ? (
          <img src={IMG_URL + movie.poster_path} alt={movie.title} loading="lazy" />
        ) : (
          <div className="no-poster">Pas d’affiche</div>
        )}
        <h3>{movie.title}</h3>
      </Link>
      <p>
        {year} · <span className="star">★</span> {note}
      </p>
      {/* En dehors du Link : cliquer sur le cœur n'ouvre pas la page du film */}
      <FavoriteButton movie={movie} className="on-card" />
    </li>
  )
}

export default MovieCard
