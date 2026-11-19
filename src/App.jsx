import { useEffect, useState } from 'react'
import { getPopularMovies, searchMovies, IMG_URL } from './api/tmdb'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const term = search.trim()

    // Délai de 400 ms pour éviter un appel à chaque frappe
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      const call = term
        ? searchMovies(term, 1, controller.signal)
        : getPopularMovies(1, controller.signal)

      call
        .then((data) => setMovies(data.results))
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 400)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [search])

  return (
    <main className="app">
      <h1>CineMatch</h1>

      <input
        className="search"
        type="search"
        placeholder="Rechercher un film…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>{search.trim() ? 'Résultats' : 'Films populaires'}</h2>

      {error && <p className="error">{error}</p>}
      {loading && !error && <p>Chargement…</p>}
      {!loading && !error && movies.length === 0 && <p>Aucun film trouvé.</p>}

      <ul className="grid">
        {movies.map((m) => (
          <li key={m.id} className="card">
            {m.poster_path ? (
              <img src={IMG_URL + m.poster_path} alt={m.title} loading="lazy" />
            ) : (
              <div className="no-poster">Pas d’affiche</div>
            )}
            <h3>{m.title}</h3>
            <p>
              {m.release_date?.slice(0, 4) || '—'} · ⭐{' '}
              {m.vote_average.toFixed(1)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
