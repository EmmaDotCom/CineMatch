import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovie, IMG_URL, BACKDROP_URL } from '../api/tmdb'
import TrailerModal from '../components/TrailerModal'

// Choisit la meilleure vidéo : bande-annonce YouTube en français, sinon
// n'importe quelle bande-annonce YouTube, sinon un teaser.
function findTrailer(videos = []) {
  const youtube = videos.filter((v) => v.site === 'YouTube')
  return (
    youtube.find((v) => v.type === 'Trailer' && v.iso_639_1 === 'fr') ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube.find((v) => v.type === 'Teaser')
  )
}

// 142 → "2h22"
function formatRuntime(minutes) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, '0')
  return h ? `${h}h${m}` : `${minutes} min`
}

// Lit le ":id" de l'URL /film/:id. Le key={id} recrée MovieDetailContent
// à chaque nouveau film : son état (film, erreur, fenêtre) repart de zéro.
function MovieDetail() {
  const { id } = useParams()
  return <MovieDetailContent key={id} id={id} />
}

function MovieDetailContent({ id }) {
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)

  // On charge le film depuis TMDB à l'affichage de la page
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
    movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}` : null,
  ].filter(Boolean)

  return (
    <article className="detail">
      {/* Grande image de fond, fondue dans la page grâce à un dégradé en CSS */}
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
          <p className="detail-meta">{infos.join(' · ')}</p>

          <ul className="tags">
            {movie.genres.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>

          <h2>Synopsis</h2>
          <p className="overview">
            {movie.overview || 'Aucun synopsis disponible pour ce film.'}
          </p>

          {trailer ? (
            <button className="btn" onClick={() => setShowTrailer(true)}>
              ▶ Bande-annonce
            </button>
          ) : (
            <p className="muted">Pas de bande-annonce disponible.</p>
          )}

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

      {/* La fenêtre n'existe dans la page que si showTrailer vaut true */}
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
