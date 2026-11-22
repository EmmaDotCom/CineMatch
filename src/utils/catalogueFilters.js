export const SORTS = [
  { value: 'popularite', label: 'Popularité', api: 'popularity.desc', minVotes: 0 },
  { value: 'note', label: 'Meilleure note', api: 'vote_average.desc', minVotes: 1000 },
  { value: 'recent', label: 'Plus récent', api: 'primary_release_date.desc', minVotes: 20 },
  { value: 'ancien', label: 'Plus ancien', api: 'primary_release_date.asc', minVotes: 50 },
]

export const YEARS = [
  { value: 'avant-1980', label: 'Avant 1980', max: 1979 },
  { value: '1980-1999', label: '1980–1999', min: 1980, max: 1999 },
  { value: '2000-2009', label: '2000–2009', min: 2000, max: 2009 },
  { value: '2010-2019', label: '2010–2019', min: 2010, max: 2019 },
  { value: '2020', label: '2020 et après', min: 2020 },
]

export const DURATIONS = [
  { value: 'moins-1h', label: 'Moins d’1h', min: 1, max: 59 },
  { value: '1h-1h30', label: '1h – 1h30', min: 60, max: 90 },
  { value: '1h30-2h', label: '1h30 – 2h', min: 91, max: 120 },
  { value: 'plus-2h', label: 'Plus de 2h', min: 121 },
]

export const RATINGS = [5, 6, 7, 8].map((n) => ({
  value: String(n),
  label: `★ ${n}+`,
  min: n,
}))

const find = (list, value) => list.find((o) => o.value === value)

export function buildDiscoverParams(filters) {
  const sort = find(SORTS, filters.tri) ?? SORTS[0]
  const year = find(YEARS, filters.annee)
  const duration = find(DURATIONS, filters.duree)
  const rating = find(RATINGS, filters.note)
  const today = new Date().toISOString().slice(0, 10)

  const params = {
    sort_by: sort.api,

    'primary_release_date.lte': year?.max ? `${year.max}-12-31` : today,

    'vote_count.gte': Math.max(sort.minVotes, rating ? 50 : 0),
  }
  if (year?.min) params['primary_release_date.gte'] = `${year.min}-01-01`
  if (filters.genre) params.with_genres = filters.genre
  if (duration) {
    params['with_runtime.gte'] = duration.min
    if (duration.max) params['with_runtime.lte'] = duration.max
  }
  if (rating) params['vote_average.gte'] = rating.min
  return params
}

export function filterSearchResults(movies, filters) {
  const year = find(YEARS, filters.annee)
  const rating = find(RATINGS, filters.note)

  const kept = movies.filter((m) => {
    if (filters.genre && !m.genre_ids?.includes(Number(filters.genre))) return false
    if (year) {
      const y = Number(m.release_date?.slice(0, 4))
      if (!y || (year.min && y < year.min) || (year.max && y > year.max)) return false
    }
    if (rating && m.vote_average < rating.min) return false
    return true
  })

  const compare = {
    popularite: (a, b) => b.popularity - a.popularity,
    note: (a, b) => b.vote_average - a.vote_average,
    recent: (a, b) => (b.release_date || '').localeCompare(a.release_date || ''),
    ancien: (a, b) => (a.release_date || '9999').localeCompare(b.release_date || '9999'),
  }
  return kept.sort(compare[filters.tri] ?? compare.popularite)
}
