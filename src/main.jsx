import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter lit l'URL du navigateur et la rend disponible à toute l'app */}
    <BrowserRouter>
      {/* Le Provider rend les favoris accessibles à toutes les pages */}
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
