import { createContext, useContext } from 'react'

// Le contexte est une « boîte » partagée : n'importe quel composant
// placé dans le FavoritesProvider peut lire ou modifier les favoris.
export const FavoritesContext = createContext(null)

// Raccourci : const { favorites, toggleFavorite } = useFavorites()
export function useFavorites() {
  return useContext(FavoritesContext)
}
