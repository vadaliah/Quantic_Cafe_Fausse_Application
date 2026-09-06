import Header from './components/Header'
import ReservationView from './views/ReservationView'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <ReservationView />

      <footer className="site-footer">
        <p>© Café Fausse</p>
        <p>A thoughtful French dining experience.</p>
      </footer>
    </div>
  )
}

export default App