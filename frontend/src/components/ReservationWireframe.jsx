function ReservationWireframe() {
    return (
        <main id="reservation" className="reservation-page">
            <section className="page-introduction" aria-labelledby="page-title">
                <p className="eyebrow">Dining reservations</p>
                <h1 id="page-title">Reserve Your Table</h1>
                <p>
                    Plan an evening at Café Fausse. Provide your preferred dining details,
                    and we will help prepare your table.
                </p>
            </section>

            <div className="reservation-layout">
                <section className="reservation-card" aria-labelledby="form-heading">
                    <div className="section-heading">
                        <p className="step-label">Reservation request</p>
                        <h2 id="form-heading">Your dining details</h2>
                        <p>Fields marked with an asterisk are required.</p>
                    </div>

                    <form className="reservation-form">
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="reservation-date">Date *</label>
                                <input id="reservation-date" name="date" type="date" />
                            </div>

                            <div className="form-field">
                                <label htmlFor="reservation-time">Time *</label>
                                <select id="reservation-time" name="time" defaultValue="">
                                    <option value="" disabled>
                                        Select a time
                                    </option>
                                    <option value="17:00">5:00 PM</option>
                                    <option value="18:00">6:00 PM</option>
                                    <option value="19:00">7:00 PM</option>
                                    <option value="20:00">8:00 PM</option>
                                </select>
                            </div>

                            <div className="form-field full-width">
                                <label htmlFor="guest-count">Number of Guests *</label>
                                <select id="guest-count" name="guestCount" defaultValue="">
                                    <option value="" disabled>
                                        Select party size
                                    </option>
                                    <option value="1">1 guest</option>
                                    <option value="2">2 guests</option>
                                    <option value="3">3 guests</option>
                                    <option value="4">4 guests</option>
                                    <option value="5">5 guests</option>
                                    <option value="6">6 guests</option>
                                </select>
                            </div>

                            <div className="form-field full-width">
                                <label htmlFor="customer-name">Name *</label>
                                <input
                                    id="customer-name"
                                    name="customerName"
                                    type="text"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="customer-email">Email *</label>
                                <input
                                    id="customer-email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="customer-phone">Phone (Optional)</label>
                                <input
                                    id="customer-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>

                        <label className="checkbox-field" htmlFor="newsletter">
                            <input id="newsletter" name="newsletter" type="checkbox" />
                            <span>
                                Send me occasional news and special offers from Café Fausse.
                            </span>
                        </label>

                        <button className="primary-button" type="button">
                            Reserve Table
                        </button>

                        <p className="wireframe-note">
                            Reservation submission will be implemented in a later story.
                        </p>
                    </form>
                </section>

                <aside className="information-card" aria-labelledby="information-heading">
                    <p className="step-label">Before you reserve</p>
                    <h2 id="information-heading">Plan your visit</h2>

                    <section className="information-section">
                        <h3>Restaurant hours</h3>
                        <dl className="hours-list">
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
                    </section>

                    <section className="information-section">
                        <h3>Reservation guidance</h3>
                        <ul>
                            <li>Please provide current contact information.</li>
                            <li>Arrive a few minutes before your reservation.</li>
                            <li>Contact the restaurant if your party size changes.</li>
                        </ul>
                    </section>

                    <p className="availability-note">
                        Reservations and table assignments are subject to availability.
                    </p>
                </aside>
            </div>
        </main>
    )
}

export default ReservationWireframe