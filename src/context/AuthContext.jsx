import { useEffect, useState } from 'react'
import { AuthContext } from './useAuth'

const STORAGE_KEY = 'cinematch-utilisateur'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [user])

  const login = (email) => setUser({ email, name: email.split('@')[0] })
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  )
}
