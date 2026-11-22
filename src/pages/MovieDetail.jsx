import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovie, IMG_URL, BACKDROP_URL } from '../api/tmdb'
import TrailerModal from '../components/TrailerModal'
import FavoriteButton from '../components/FavoriteButton'
import { findTrailer, formatRuntime } from '../utils/movie'

function MovieDetail() {
  const { id } = useParams()
  return <MovieDetailContent key={id} id={id} />
}

function MovieDetailContent({ id }) {
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getMovie(id, controller.signal)
      .then(setMovie)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })

    return () => controller.abort()
  }, [id])

  if (error) return <p className="error">{error}</p>
  if (!movie) return <p>Chargement…</p>
  const trailer = findTrailer(movie.videos?.results)
  const cast = movie.credits?.cast?.slice(0, 6) ?? []
  const infos = [
    movie.release_date?.slice(0, 4),
    formatRuntime(movie.runtime),
  ].filter(Boolean)

  return (
    <article className="detail">
      {movie.backdrop_path && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${BACKDROP_URL + movie.backdrop_path})` }}
        />
      )}

      <div className="detail-body">
        {movie.poster_path && (
          <img className="detail-poster" src={IMG_URL + movie.poster_path} alt={movie.title} />
        )}

        <div className="detail-info">
          <button className="back" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <h1>{movie.title}</h1>
          <p className="detail-meta">
            {infos.join(' · ')}
            {movie.vote_average > 0 && (
              <>
                {infos.length > 0 && ' · '}
                <span className="star">★</span> {movie.vote_average.toFixed(1)}
              </>
            )}
          </p>
          <ul className="tags">
            {movie.genres.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>
          <h2>Synopsis</h2>
          <p className="overview">
            {movie.overview || 'Aucun synopsis disponible pour ce film.'}
          </p>
          <div className="actions">
            {trailer ? (
              <button className="btn" onClick={() => setShowTrailer(true)}>
                ▶ Bande-annonce
              </button>
            ) : (
              <p className="muted">Pas de bande-annonce disponible.</p>
            )}
            <FavoriteButton movie={movie} className="large" />
          </div>
          {cast.length > 0 && (
            <>
              <h2>Casting</h2>
              <p className="muted">
                {cast.map((a) => a.name).join(', ')}
              </p>
            </>
          )}
        </div>
      </div>
      {showTrailer && (
        <TrailerModal
          videoKey={trailer.key}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </article>
  )
}

export default MovieDetail
