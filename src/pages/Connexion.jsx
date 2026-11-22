import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Vérifie le formulaire et renvoie les erreurs trouvées (objet vide = tout est bon)
function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'L’email est obligatoire.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Cet email n’est pas valide.'
  if (!password) errors.password = 'Le mot de passe est obligatoire.'
  else if (password.length < 6) errors.password = 'Au moins 6 caractères.'
  return errors
}

function Connexion() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Un « formulaire contrôlé » : React garde la valeur de chaque champ dans l'état
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    // On efface l'erreur du champ dès qu'on le corrige
    setErrors((errs) => ({ ...errs, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault() // empêche le rechargement de la page
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    login(form.email.trim())
    // Retour à la page d'où l'on venait (ou l'accueil)
    navigate(location.state?.from ?? '/', { replace: true })
  }

  // Déjà connecté : on propose de se déconnecter
  if (user) {
    return (
      <section className="auth">
        <div className="auth-card">
          <h1>
            Bonjour <span className="accent">{user.name}</span>
          </h1>
          <p className="muted">Tu es connecté·e avec {user.email}.</p>
          <div className="actions">
            <Link to="/favoris" className="btn">
              Voir mes favoris
            </Link>
            <button className="btn btn-outline" onClick={logout}>
              Se déconnecter
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="auth">
      {/* noValidate : on utilise nos propres messages d'erreur, en français */}
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>
          <span className="accent">Connexion</span>
        </h1>
        <p className="muted">Connecte-toi pour retrouver tes films préférés.</p>

        <label className="field">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="toi@exemple.fr"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="field">
          Mot de passe
          <div className="password">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <button type="submit" className="btn auth-submit">
          Se connecter
        </button>
      </form>
    </section>
  )
}

export default Connexion
