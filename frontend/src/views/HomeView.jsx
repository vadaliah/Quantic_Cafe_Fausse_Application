import { Link } from 'react-router-dom'
import homeImage from '../assets/images/home-cafe-fausse.webp'

function HomeView() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Welcome to Café Café Fausse</p>
          <h1>French dining, thoughtfully served.</h1>
          <p className="home-hero-description">
            Discover an inviting restaurant experience, explore our carefully
            presented menu, and reserve a table for your next visit.
          </p>

          <div className="page-actions">
            <Link className="primary-link" to="/reservations">
              Reserve a Table
            </Link>

            <Link className="secondary-link" to="/menu">
              Explore the Menu
            </Link>
          </div>
        </div>

        <div className="home-hero-image">
          <img
            src={homeImage}
            alt="Welcoming dining room at Café Fausse"
          />
        </div>
      </section>

      <section
        className="home-experience"
        aria-labelledby="experience-heading"
      >
        <div className="home-section-heading">
          <p className="eyebrow">The Café Fausse experience</p>
          <h2 id="experience-heading">
            An evening designed around our guests
          </h2>
          <p>
            From selecting a dish to reserving a table, Café Fausse provides a
            simple and welcoming dining experience.
          </p>
        </div>

        <div className="experience-grid">
          <article className="experience-card">
            <p className="experience-number" aria-hidden="true">
              01
            </p>
            <h3>Thoughtful Menu</h3>
            <p>
              Browse starters, main courses, desserts, and beverages before
              planning your visit.
            </p>
            <Link to="/menu">View the menu</Link>
          </article>

          <article className="experience-card">
            <p className="experience-number" aria-hidden="true">
              02
            </p>
            <h3>Welcoming Setting</h3>
            <p>
              Enjoy an atmosphere designed for relaxed meals and memorable
              occasions.
            </p>
            <Link to="/gallery">View the gallery</Link>
          </article>

          <article className="experience-card">
            <p className="experience-number" aria-hidden="true">
              03
            </p>
            <h3>Simple Reservations</h3>
            <p>
              Select your preferred date and time and receive an immediate
              table assignment.
            </p>
            <Link to="/reservations">Reserve your table</Link>
          </article>
        </div>
      </section>

      <section className="home-visit" aria-labelledby="visit-heading">
        <div>
          <p className="eyebrow">Plan your visit</p>
          <h2 id="visit-heading">Restaurant Hours</h2>
        </div>

        <dl className="home-hours">
          <div>
            <dt>Monday–Thursday</dt>
            <dd>5:00 PM–10:00 PM</dd>
          </div>
          <div>
            <dt>Friday–Saturday</dt>
            <dd>5:00 PM–11:00 PM</dd>
          </div>
          <div>
            <dt>Sunday</dt>
            <dd>5:00 PM–9:00 PM</dd>
          </div>
        </dl>

        <Link className="primary-link" to="/reservations">
          Plan Your Evening
        </Link>
      </section>
    </main>
  )
}

export default HomeView