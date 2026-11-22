import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section>
      <h1>Page introuvable</h1>
      <Link to="/" className="btn">
        Retour à l’accueil
      </Link>
    </section>
  )
}

export default NotFound
