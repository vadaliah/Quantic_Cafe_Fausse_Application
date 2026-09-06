import { Link } from 'react-router-dom'

function NotFoundView() {
    return (
        <main className="page-shell">
            <section className="page-shell-content" aria-labelledby="not-found-heading">
                <p className="eyebrow">Page not found</p>
                <h1 id="not-found-heading">We Couldn’t Find That Page</h1>
                <p>
                    The page you requested does not exist or may have moved.
                </p>

                <div className="page-actions">
                    <Link className="primary-link" to="/">
                        Return Home
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default NotFoundView