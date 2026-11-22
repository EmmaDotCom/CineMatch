import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverMovies, getGenres, IMG_URL } from '../api/tmdb'
import FavoriteButton from './FavoriteButton'

// Nombre entier au hasard entre 1 et max (inclus)
const randomInt = (max) => Math.floor(Math.random() * max) + 1

// Bloc « Surprends-moi » : tire un bon film au hasard, dans le genre choisi.
function SurpriseMe() {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('')
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    getGenres(controller.signal)
      .then((d) => setGenres(d.genres))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const draw = async () => {
    setLoading(true)
    setError(null)
    try {
      // Seulement des films connus et bien notés, pour que la surprise soit bonne
      const params = {
        sort_by: 'popularity.desc',
        'vote_count.gte': 300,
        'vote_average.gte': 6.5,
        ...(genre && { with_genres: genre }),
      }
      // 1er appel : combien de pages existe-t-il pour ce genre ?
      const first = await discoverMovies({ ...params, page: 1 })
      // 2e appel : une page au hasard parmi les 20 premières (les films les plus connus)
      const page = randomInt(Math.min(first.total_pages, 20))
      const data = page === 1 ? first : await discoverMovies({ ...params, page })

      // On évite de retomber sur le même film deux fois de suite
      const choices = data.results.filter((m) => m.id !== movie?.id)
      if (choices.length === 0) throw new Error('Aucun film trouvé pour ce genre.')
      setMovie(choices[randomInt(choices.length) - 1])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="surprise">
      <div className="surprise-controls">
        <h2>
          Tu ne sais pas quoi <span className="accent">regarder ?</span>
        </h2>
        <p className="muted">Choisis un genre et laisse le hasard décider.</p>
        <div className="surprise-form">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-label="Genre"
          >
            <option value="">Tous les genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <button className="btn" onClick={draw} disabled={loading}>
            {loading ? 'Tirage…' : movie ? '🎲 Un autre !' : '🎲 Surprends-moi'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Le film tiré au sort */}
      {movie && (
        <div className={`surprise-result ${loading ? 'is-loading' : ''}`}>
          {movie.poster_path && (
            <img src={IMG_URL + movie.poster_path} alt={movie.title} />
          )}
          <div>
            <h3>{movie.title}</h3>
            <p className="muted">
              {movie.release_date?.slice(0, 4)} · <span className="star">★</span>{' '}
              {movie.vote_average.toFixed(1)}
            </p>
            <p className="surprise-overview">{movie.overview}</p>
            <div className="actions">
              <Link to={`/film/${movie.id}`} className="btn">
                Voir le film
              </Link>
              <FavoriteButton movie={movie} className="large" />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default SurpriseMe
