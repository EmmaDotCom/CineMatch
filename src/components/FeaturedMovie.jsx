import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMovie, BACKDROP_URL } from '../api/tmdb'
import { findTrailer, formatRuntime } from '../utils/movie'
import TrailerModal from './TrailerModal'
import FavoriteButton from './FavoriteButton'

// Grand bandeau « Film du jour ».
// Reçoit un film de la liste des tendances, puis charge ses détails
// (durée, genres, vidéos) pour pouvoir proposer la bande-annonce.
function FeaturedMovie({ movie }) {
  const [details, setDetails] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getMovie(movie.id, controller.signal)
      .then(setDetails)
      .catch(() => {}) // sans détails, le bandeau s'affiche quand même
    return () => controller.abort()
  }, [movie.id])

  const trailer = findTrailer(details?.videos?.results)
  const infos = [
    movie.release_date?.slice(0, 4),
    formatRuntime(details?.runtime),
    details?.genres?.slice(0, 2).map((g) => g.name).join(', '),
  ].filter(Boolean)

  return (
    <section className="hero">
      <img
        className="hero-backdrop"
        src={BACKDROP_URL + movie.backdrop_path}
        alt=""
        aria-hidden="true"
      />

      <div className="hero-content">
        <p className="hero-label">★ Film du jour</p>
        <h1>{movie.title}</h1>
        <p className="hero-meta">
          <span className="star">★</span> {movie.vote_average.toFixed(1)}
          {infos.length > 0 && ` · ${infos.join(' · ')}`}
        </p>
        <p className="hero-overview">{movie.overview}</p>

        <div className="actions">
          <Link to={`/film/${movie.id}`} className="btn">
            Voir le film
          </Link>
          {trailer && (
            <button className="btn btn-outline" onClick={() => setShowTrailer(true)}>
              ▶ Bande-annonce
            </button>
          )}
          {/* Même bouton cœur que sur les cartes et la page détail */}
          <FavoriteButton movie={movie} className="large" />
        </div>
      </div>

      {showTrailer && (
        <TrailerModal
          videoKey={trailer.key}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </section>
  )
}

export default FeaturedMovie
