import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Favoris from './pages/Favoris'
import MovieDetail from './pages/MovieDetail'
import NotFound from './pages/NotFound'
import Connexion from './pages/Connexion'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/film/:id" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
