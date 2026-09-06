import { useState } from 'react'

const initialFormData = {
  date: '',
  time: '',
  guestCount: '',
  customerName: '',
  email: '',
  phone: '',
  newsletterOptIn: false,
}

function validateReservation(formData) {
  const validationErrors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.date) {
    validationErrors.date = 'Select a reservation date.'
  } else {
    const selectedDate = new Date(`${formData.date}T00:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      validationErrors.date = 'Reservation date cannot be in the past.'
    }
  }

  if (!formData.time) {
    validationErrors.time = 'Select a reservation time.'
  }

  if (!formData.guestCount) {
    validationErrors.guestCount = 'Select the number of guests.'
  }

  if (!formData.customerName.trim()) {
    validationErrors.customerName = 'Enter your name.'
  }

  if (!formData.email.trim()) {
    validationErrors.email = 'Enter your email address.'
  } else if (!emailPattern.test(formData.email)) {
    validationErrors.email = 'Enter a valid email address.'
  }

  return validationErrors
}

function ReservationView() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [validationMessage, setValidationMessage] = useState('')

  function handleInputChange(event) {
    const { name, type, value, checked } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors
      }

      const updatedErrors = { ...currentErrors }
      delete updatedErrors[name]
      return updatedErrors
    })

    setValidationMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateReservation(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setValidationMessage('')
      return
    }

    setValidationMessage(
      'All reservation fields are valid and ready for submission.',
    )
  }

  function handleReset() {
    setFormData(initialFormData)
    setErrors({})
    setValidationMessage('')
  }

  const hasErrors = Object.keys(errors).length > 0

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

          <form
            className="reservation-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {hasErrors && (
              <div className="error-summary" role="alert">
                <strong>Please review the reservation form.</strong>
                <p>Correct the highlighted fields before continuing.</p>
              </div>
            )}

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="reservation-date">Date *</label>
                <input
                  id="reservation-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                />
                {errors.date && (
                  <p id="date-error" className="field-error">
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="reservation-time">Time *</label>
                <select
                  id="reservation-time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? 'time-error' : undefined}
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
                {errors.time && (
                  <p id="time-error" className="field-error">
                    {errors.time}
                  </p>
                )}
              </div>

              <div className="form-field full-width">
                <label htmlFor="guest-count">Number of Guests *</label>
                <select
                  id="guest-count"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.guestCount)}
                  aria-describedby={
                    errors.guestCount ? 'guest-count-error' : undefined
                  }
                >
                  <option value="" disabled>
                    Select party size
                  </option>

                  {Array.from({ length: 10 }, (_, index) => {
                    const guestCount = index + 1

                    return (
                      <option key={guestCount} value={guestCount}>
                        {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                      </option>
                    )
                  })}
                </select>
                {errors.guestCount && (
                  <p id="guest-count-error" className="field-error">
                    {errors.guestCount}
                  </p>
                )}
              </div>

              <div className="form-field full-width">
                <label htmlFor="customer-name">Name *</label>
                <input
                  id="customer-name"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(errors.customerName)}
                  aria-describedby={
                    errors.customerName ? 'customer-name-error' : undefined
                  }
                />
                {errors.customerName && (
                  <p id="customer-name-error" className="field-error">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="customer-email">Email *</label>
                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="field-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="customer-phone">Phone (Optional)</label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <label className="checkbox-field" htmlFor="newsletter-opt-in">
              <input
                id="newsletter-opt-in"
                name="newsletterOptIn"
                type="checkbox"
                checked={formData.newsletterOptIn}
                onChange={handleInputChange}
              />
              <span>
                Send me occasional news and special offers from Café Fausse.
              </span>
            </label>

            <div className="form-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>

              <button className="primary-button" type="submit">
                Reserve Table
              </button>
            </div>

            {validationMessage && (
              <p className="validation-success" role="status">
                {validationMessage}
              </p>
            )}
          </form>
        </section>

        <aside
          className="information-card"
          aria-labelledby="information-heading"
        >
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

export default ReservationView