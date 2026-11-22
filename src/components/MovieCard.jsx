import { Link } from 'react-router-dom'
import { IMG_URL } from '../api/tmdb'
import FavoriteButton from './FavoriteButton'

function MovieCard({ movie }) {
  const year = movie.release_date?.slice(0, 4) || '—'
  const note = movie.vote_average ? movie.vote_average.toFixed(1) : '—'

  return (
    <li className="card">
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
      <FavoriteButton movie={movie} className="on-card" />
    </li>
  )
}

export default MovieCard
