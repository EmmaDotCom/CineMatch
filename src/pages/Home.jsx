import { Link } from 'react-router-dom'

// Page d'accueil : film du jour, « Surprends-moi » et rangées de films viendront ici.
function Home() {
  return (
    <section>
      <h1>
        Bienvenue sur Cine<span className="accent">Match</span>
      </h1>
      <p>Le film du jour et les recommandations arrivent bientôt.</p>
      <Link to="/catalogue" className="btn">
        Explorer le catalogue
      </Link>
    </section>
  )
}

export default Home
