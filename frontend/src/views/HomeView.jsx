import { Link } from 'react-router-dom'

function HomeView() {
    return (
        <main className="page-shell">
            <section className="page-shell-content" aria-labelledby="home-heading">
                <p className="eyebrow">Welcome to Café Fausse</p>
                <h1 id="home-heading">French dining, thoughtfully served.</h1>
                <p>
                    Discover a welcoming dining experience, explore our menu, and reserve
                    a table for your next visit.
                </p>

                <div className="page-actions">
                    <Link className="primary-link" to="/reservations">
                        Reserve a Table
                    </Link>
                    <Link className="secondary-link" to="/menu">
                        View Our Menu
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default HomeView