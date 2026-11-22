import { useFavorites } from '../context/useFavorites'

// Bouton cœur réutilisable (cartes et page détail).
function FavoriteButton({ movie, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(movie.id)

  return (
    <button
      type="button"
      className={`fav-btn ${active ? 'active' : ''} ${className}`}
      onClick={() => toggleFavorite(movie)}
      aria-pressed={active}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {active ? '♥' : '♡'}
    </button>
  )
}

export default FavoriteButton
