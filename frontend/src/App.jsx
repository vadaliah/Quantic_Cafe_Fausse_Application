import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutView from './views/AboutView'
import GalleryView from './views/GalleryView'
import HomeView from './views/HomeView'
import MenuView from './views/MenuView'
import NotFoundView from './views/NotFoundView'
import ReservationView from './views/ReservationView'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeView />} />
        <Route path="menu" element={<MenuView />} />
        <Route path="reservations" element={<ReservationView />} />
        <Route path="about" element={<AboutView />} />
        <Route path="gallery" element={<GalleryView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  )
}

export default App