import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter lit l'URL du navigateur et la rend disponible à toute l'app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
