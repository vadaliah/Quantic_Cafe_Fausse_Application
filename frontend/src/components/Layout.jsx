import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function Layout() {
    return (
        <div className="app">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout