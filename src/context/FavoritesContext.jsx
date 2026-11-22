import { useEffect, useState } from 'react'
import { FavoritesContext } from './useFavorites'

const STORAGE_KEY = 'cinematch-favoris'

// Lit les favoris sauvegardés. try/catch : si le stockage est vide,
// abîmé ou bloqué (navigation privée), on repart d'une liste vide.
function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  // La fonction passée à useState n'est appelée qu'une fois, au démarrage
  const [favorites, setFavorites] = useState(loadFavorites)

  // À chaque changement de la liste, on la sauvegarde dans le navigateur
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // stockage indisponible : les favoris restent valables jusqu'au rafraîchissement
    }
  }, [favorites])

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  // Ajoute le film s'il n'y est pas, le retire s'il y est déjà
  const toggleFavorite = (movie) => {
    setFavorites((list) =>
      list.some((f) => f.id === movie.id)
        ? list.filter((f) => f.id !== movie.id)
        : [
            // On ne garde que ce dont la carte a besoin
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
