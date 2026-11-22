import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Favoris from './pages/Favoris'
import MovieDetail from './pages/MovieDetail'
import NotFound from './pages/NotFound'
import Connexion from './pages/Connexion'
import './App.css'

// App ne fait plus qu'une chose : associer chaque URL à une page.
function App() {
  return (
    <Routes>
      {/* Toutes les pages partagent le Layout (navbar en haut) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/connexion" element={<Connexion />} />
        {/* :id est un paramètre : /film/550 → id = "550" */}
        <Route path="/film/:id" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
