function formatReservationDate(timeSlot) {
    const reservationDate = new Date(timeSlot)

    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(reservationDate)
}

function formatReservationTime(timeSlot) {
    const reservationDate = new Date(timeSlot)

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(reservationDate)
}

function ReservationConfirmation({
    customerName,
    reservation,
    onNewReservation,
}) {
    return (
        <section
            className="confirmation-card"
            aria-labelledby="confirmation-heading"
        >
            <p className="confirmation-symbol" aria-hidden="true">
                ✓
            </p>

            <p className="step-label">Reservation confirmed</p>

            <h2 id="confirmation-heading">
                Your table is ready, {customerName}.
            </h2>

            <p className="confirmation-introduction">
                Your reservation has been created successfully. Please retain these
                details for your visit.
            </p>

            <dl className="confirmation-details">
                <div>
                    <dt>Reservation number</dt>
                    <dd>#{reservation.reservationId}</dd>
                </div>

                <div>
                    <dt>Assigned table</dt>
                    <dd>Table {reservation.tableNumber}</dd>
                </div>

                <div>
                    <dt>Date</dt>
                    <dd>{formatReservationDate(reservation.timeSlot)}</dd>
                </div>

                <div>
                    <dt>Time</dt>
                    <dd>{formatReservationTime(reservation.timeSlot)}</dd>
                </div>

                <div>
                    <dt>Party size</dt>
                    <dd>
                        {reservation.guestCount}{' '}
                        {reservation.guestCount === 1 ? 'guest' : 'guests'}
                    </dd>
                </div>

                <div>
                    <dt>Status</dt>
                    <dd>
                        <span className="status-badge">
                            {reservation.status}
                        </span>
                    </dd>
                </div>
            </dl>

            <button
                className="secondary-button confirmation-button"
                type="button"
                onClick={onNewReservation}
            >
                Make Another Reservation
            </button>
        </section>
    )
}

export default ReservationConfirmation