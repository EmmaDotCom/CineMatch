import { useEffect, useState } from 'react'
import { AuthContext } from './useAuth'

const STORAGE_KEY = 'cinematch-utilisateur'

// ⚠️ Connexion SIMULÉE : le projet n'a pas de serveur pour vérifier un mot de passe.
// On garde seulement le nom et l'email dans le navigateur, jamais le mot de passe.
// Dans une vraie application, c'est un serveur qui vérifierait les identifiants.

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  // On sauvegarde (ou on efface) la session à chaque changement
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // stockage indisponible : la session dure jusqu'au rafraîchissement
    }
  }, [user])

  // Le nom affiché est la partie de l'email avant le « @ » : jean.dupont@… → jean.dupont
  const login = (email) => setUser({ email, name: email.split('@')[0] })
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  )
}
