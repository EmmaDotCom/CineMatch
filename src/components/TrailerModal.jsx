import { useEffect } from 'react'

// Fenêtre qui affiche la bande-annonce YouTube par-dessus la page.
// Props : videoKey (identifiant YouTube) et onClose (fonction pour fermer).
function TrailerModal({ videoKey, title, onClose }) {
  // Fermer avec la touche Échap
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    // Un clic sur le fond sombre ferme la fenêtre…
    <div className="modal" onClick={onClose}>
      {/* …mais pas un clic sur la vidéo elle-même */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1`}
          title={`Bande-annonce : ${title}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default TrailerModal
