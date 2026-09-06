import { Link } from 'react-router-dom'

function AboutView() {
  return (
    <main className="about-page">
      <section className="about-introduction" aria-labelledby="about-heading">
        <p className="eyebrow">About Café Fausse</p>
        <h1 id="about-heading">A Thoughtful Approach to Dining</h1>
        <p>
          Café Fausse brings together an inviting setting, a carefully
          presented menu, and a straightforward reservation experience designed
          around our guests.
        </p>

        <div className="page-actions">
          <Link className="primary-link" to="/reservations">
            Reserve a Table
          </Link>
          <Link className="secondary-link" to="/menu">
            Explore the Menu
          </Link>
        </div>
      </section>

      <section
        className="about-philosophy"
        aria-labelledby="philosophy-heading"
      >
        <div className="about-section-heading">
          <p className="eyebrow">Our philosophy</p>
          <h2 id="philosophy-heading">
            Every part of the visit should feel considered
          </h2>
        </div>

        <div className="about-philosophy-content">
          <p>
            Dining begins before a guest arrives. Clear menu information,
            dependable reservations, and an inviting presentation all
            contribute to a welcoming experience.
          </p>
          <p>
            Our customer experience is designed to make planning a visit
            simple, while allowing guests to discover the menu and atmosphere
            at their own pace.
          </p>
        </div>
      </section>

      <section
        className="about-principles"
        aria-labelledby="principles-heading"
      >
        <div className="about-section-heading">
          <p className="eyebrow">Guest experience</p>
          <h2 id="principles-heading">Designed around three principles</h2>
        </div>

        <div className="about-principles-grid">
          <article className="about-principle-card">
            <span className="about-principle-number" aria-hidden="true">
              01
            </span>
            <h3>Clarity</h3>
            <p>
              Menu descriptions, prices, reservation details, and table
              assignments are presented clearly.
            </p>
          </article>

          <article className="about-principle-card">
            <span className="about-principle-number" aria-hidden="true">
              02
            </span>
            <h3>Convenience</h3>
            <p>
              Guests can explore the restaurant and submit a reservation from
              one responsive experience.
            </p>
          </article>

          <article className="about-principle-card">
            <span className="about-principle-number" aria-hidden="true">
              03
            </span>
            <h3>Reliability</h3>
            <p>
              Each successful reservation provides a confirmation and an
              available table assignment.
            </p>
          </article>
        </div>
      </section>

      <section
        className="about-reservations"
        aria-labelledby="about-reservations-heading"
      >
        <div>
          <p className="eyebrow">Reservations</p>
          <h2 id="about-reservations-heading">
            Plan your visit with confidence
          </h2>
          <p>
            Select a preferred date, time, and party size. When availability is
            confirmed, Café Fausse provides the reservation details and table
            assignment immediately.
          </p>
        </div>

        <Link className="primary-link" to="/reservations">
          Make a Reservation
        </Link>
      </section>
    </main>
  )
}

export default AboutView