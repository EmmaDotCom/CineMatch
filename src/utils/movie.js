// Petites fonctions utilisées par plusieurs pages (accueil, détail).

// Choisit la meilleure vidéo : bande-annonce YouTube en français, sinon
// n'importe quelle bande-annonce YouTube, sinon un teaser.
export function findTrailer(videos = []) {
  const youtube = videos.filter((v) => v.site === 'YouTube')
  return (
    youtube.find((v) => v.type === 'Trailer' && v.iso_639_1 === 'fr') ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube.find((v) => v.type === 'Teaser')
  )
}

// 142 → "2h22"
export function formatRuntime(minutes) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, '0')
  return h ? `${h}h${m}` : `${minutes} min`
}
