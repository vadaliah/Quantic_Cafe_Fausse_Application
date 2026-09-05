import Header from './components/Header'
import ReservationWireframe from './components/ReservationWireframe'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <ReservationWireframe />

      <footer className="site-footer">
        <p>© Café Fausse</p>
        <p>A thoughtful French dining experience.</p>
      </footer>
    </div>
  )
}

export default App