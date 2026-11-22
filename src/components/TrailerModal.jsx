import { useEffect } from 'react'

function TrailerModal({ videoKey, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal" onClick={onClose}>
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
