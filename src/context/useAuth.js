import { createContext, useContext } from 'react'

// Même principe que les favoris : une « boîte » partagée par toute l'app,
// qui contient l'utilisateur connecté (ou null).
export const AuthContext = createContext(null)

// Raccourci : const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
