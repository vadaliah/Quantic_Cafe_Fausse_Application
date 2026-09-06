import { Link } from 'react-router-dom'

function AboutView() {
    return (
        <main className="page-shell">
            <section className="page-shell-content" aria-labelledby="about-heading">
                <p className="eyebrow">About Café Fausse</p>
                <h1 id="about-heading">A Thoughtful Dining Experience</h1>
                <p>
                    Café Fausse brings together an inviting atmosphere, carefully
                    presented dishes, and a reservation experience designed around our
                    guests.
                </p>

                <div className="page-actions">
                    <Link className="primary-link" to="/reservations">
                        Plan Your Visit
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default AboutView