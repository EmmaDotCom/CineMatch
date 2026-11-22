const BASE_URL = 'https://api.themoviedb.org/3'
export const IMG_URL = 'https://image.tmdb.org/t/p/w500'
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280'

async function request(path, params = {}, signal) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  if (!apiKey) {
    throw new Error(
      'Clé TMDB manquante : renseignez VITE_TMDB_API_KEY dans .env.local puis relancez npm run dev.',
    )
  }

  const query = new URLSearchParams({
    api_key: apiKey,
    language: 'fr-FR',
    ...params,
  })
  const res = await fetch(`${BASE_URL}${path}?${query}`, { signal })
  if (!res.ok) throw new Error(`Erreur TMDB (${res.status})`)
  return res.json()
}

export const getPopularMovies = (page = 1, signal) =>
  request('/movie/popular', { page }, signal)

export const searchMovies = (query, page = 1, signal) =>
  request('/search/movie', { query, page }, signal)

// include_video_language : beaucoup de films n'ont pas de bande-annonce en
// français, on accepte donc aussi l'anglais et les vidéos sans langue.
export const getMovie = (id, signal) =>
  request(
    `/movie/${id}`,
    { append_to_response: 'credits,videos', include_video_language: 'fr,en,null' },
    signal,
  )

export const getGenres = (signal) => request('/genre/movie/list', {}, signal)

export const discoverMovies = (params = {}, signal) =>
  request('/discover/movie', params, signal)

// Films les plus vus du moment ('day' ou 'week')
export const getTrending = (timeWindow = 'week', signal) =>
  request(`/trending/movie/${timeWindow}`, {}, signal)

// Films les mieux notés de tous les temps
export const getTopRated = (page = 1, signal) =>
  request('/movie/top_rated', { page }, signal)
