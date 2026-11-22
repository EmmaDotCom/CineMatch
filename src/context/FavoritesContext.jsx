import { useEffect, useState } from 'react'
import { FavoritesContext } from './useFavorites'

const STORAGE_KEY = 'cinematch-favoris'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  const toggleFavorite = (movie) => {
    setFavorites((list) =>
      list.some((f) => f.id === movie.id)
        ? list.filter((f) => f.id !== movie.id)
        : [
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
            },
            ...list,
          ],
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
