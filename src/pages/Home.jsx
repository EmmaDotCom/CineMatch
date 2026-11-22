import { useEffect, useState } from 'react'
import { getTrending, getTopRated } from '../api/tmdb'
import FeaturedMovie from '../components/FeaturedMovie'
import SurpriseMe from '../components/SurpriseMe'
import MovieRow from '../components/MovieRow'

function pickMovieOfTheDay(movies) {
  const candidates = movies.filter((m) => m.backdrop_path && m.overview)
  if (candidates.length === 0) return null
  const dayNumber = Math.floor(Date.now() / 86_400_000)
  return candidates[dayNumber % candidates.length]
}

function Home() {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const onError = (err) => {
      if (err.name !== 'AbortError') setError(err.message)
    }
    getTrending('week', controller.signal)
      .then((d) => setTrending(d.results))
      .catch(onError)
    getTopRated(1, controller.signal)
      .then((d) => setTopRated(d.results))
      .catch(onError)
    return () => controller.abort()
  }, [])

  const featured = pickMovieOfTheDay(trending)

  return (
    <div className="home">
      {error && <p className="error">{error}</p>}

      {featured ? (
        <FeaturedMovie key={featured.id} movie={featured} />
      ) : (
        !error && <div className="hero hero-placeholder" aria-busy="true" />
      )}

      <SurpriseMe />
      <MovieRow
        title={
          <>
            Tendances <span className="accent">de la semaine</span>
          </>
        }
        movies={trending}
        link="/catalogue"
      />
      <MovieRow
        title={
          <>
            Les <span className="accent">mieux notés</span>
          </>
        }
        movies={topRated}
        link="/catalogue?tri=note"
      />
    </div>
  )
}

export default Home
