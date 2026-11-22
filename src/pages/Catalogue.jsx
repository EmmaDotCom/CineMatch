import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { discoverMovies, getGenres, searchMovies } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import {
  SORTS,
  YEARS,
  DURATIONS,
  RATINGS,
  buildDiscoverParams,
  filterSearchResults,
} from '../utils/catalogueFilters'

const FILTER_KEYS = ['tri', 'genre', 'annee', 'duree', 'note']

function withoutDuplicates(movies) {
  const seen = new Set()
  return movies.filter((m) => !seen.has(m.id) && seen.add(m.id))
}

function FilterGroup({ label, options, value, onToggle, disabled, hint }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="filter-tags">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`tag-btn ${value === o.value ? 'active' : ''}`}
            aria-pressed={value === o.value}
            disabled={disabled}
            onClick={() => onToggle(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className="filter-hint">{hint}</p>}
    </div>
  )
}

function Catalogue() {
  const [params, setParams] = useSearchParams()
  const term = (params.get('q') ?? '').trim()
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) ?? '']))
  const isSearch = term !== ''

  const requestKey = JSON.stringify(
    isSearch ? { term } : { discover: buildDiscoverParams(filters) },
  )

  const [genres, setGenres] = useState([])
  const [data, setData] = useState({ key: null, page: 0, items: [], total: 0, totalPages: 0 })
  const [error, setError] = useState(null)
  const [pageState, setPageState] = useState({ key: requestKey, page: 1 })

  const page = pageState.key === requestKey ? pageState.page : 1

  useEffect(() => {
    const controller = new AbortController()
    getGenres(controller.signal)
      .then((d) => setGenres(d.genres))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const request = JSON.parse(requestKey)
    const controller = new AbortController()

    const timer = setTimeout(
      () => {
        const call = request.term
          ? searchMovies(request.term, page, controller.signal)
          : discoverMovies({ ...request.discover, page }, controller.signal)

        call
          .then((res) =>
            setData((prev) => ({
              key: requestKey,
              page,
              items: page === 1 ? res.results : withoutDuplicates([...prev.items, ...res.results]),
              total: res.total_results,
              totalPages: Math.min(res.total_pages, 500),
            })),
          )
          .catch((err) => {
            if (err.name !== 'AbortError') setError({ key: requestKey, page, message: err.message })
          })
      },
      request.term ? 400 : 0,
    )

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [requestKey, page])

  const setParam = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }
  const toggle = (key) => (value) => setParam(key, filters[key] === value ? '' : value)
  const resetFilters = () => setParams(term ? { q: term } : {}, { replace: true })

  const currentError = error?.key === requestKey && error.page === page ? error.message : null
  const isUpToDate = data.key === requestKey && data.page === page
  const loading = !isUpToDate && !currentError
  const movies = isSearch ? filterSearchResults(data.items, filters) : data.items
  const hasMore = data.key === requestKey && page < data.totalPages
  const hasFilters = FILTER_KEYS.some((k) => filters[k])

  return (
    <section className="catalogue">
      <h1>Catalogue</h1>
      <div className="catalogue-toolbar">
        <input
          className="search"
          type="search"
          placeholder="Rechercher un film…"
          value={params.get('q') ?? ''}
          onChange={(e) => setParam('q', e.target.value)}
        />
        <label className="sort">
          Trier par
          <select
            value={filters.tri || 'popularite'}
            onChange={(e) => setParam('tri', e.target.value === 'popularite' ? '' : e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="filters">
        {genres.length > 0 && (
          <FilterGroup
            label="Genre"
            options={genres.map((g) => ({ value: String(g.id), label: g.name }))}
            value={filters.genre}
            onToggle={toggle('genre')}
          />
        )}
        <FilterGroup label="Année" options={YEARS} value={filters.annee} onToggle={toggle('annee')} />
        <FilterGroup
          label="Durée"
          options={DURATIONS}
          value={filters.duree}
          onToggle={toggle('duree')}
          disabled={isSearch}
          hint={isSearch ? 'Le filtre de durée n’est pas disponible pendant une recherche par titre.' : null}
        />
        <FilterGroup label="Note" options={RATINGS} value={filters.note} onToggle={toggle('note')} />
        {hasFilters && (
          <button type="button" className="reset" onClick={resetFilters}>
            ✕ Réinitialiser les filtres
          </button>
        )}
      </div>
      <p className="muted results-count">
        {isSearch
          ? `Résultats pour « ${term} »`
          : isUpToDate &&

            (data.total > 10000
              ? 'Plus de 10 000 films'
              : `${data.total.toLocaleString('fr-FR')} film${data.total > 1 ? 's' : ''}`)}
      </p>
      {currentError && <p className="error">{currentError}</p>}
      {!loading && !currentError && movies.length === 0 && (
        <p>Aucun film ne correspond à ces critères.</p>
      )}

      <ul className={`grid ${loading ? 'is-loading' : ''}`}>
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </ul>
      {loading && <p className="loading">Chargement…</p>}
      {!loading && hasMore && (
        <button
          type="button"
          className="btn load-more"
          onClick={() => setPageState({ key: requestKey, page: page + 1 })}
        >
          Charger plus de films
        </button>
      )}
    </section>
  )
}

export default Catalogue
