from datetime import datetime

from flask import Blueprint, jsonify, request

from services.reservation_service import (
    ReservationUnavailableError,
    create_reservation,
)

reservation_blueprint = Blueprint(
    "reservations",
    __name__,
    url_prefix="/api/reservations",
)


def validate_request(payload):
    errors = {}

    if not isinstance(payload, dict):
        return {"request": "Request body must be a JSON object."}, None

    date_value = payload.get("date")
    time_value = payload.get("time")
    customer_name = payload.get("customerName")
    email = payload.get("email")
    guest_count = payload.get("guestCount")

    if not date_value:
        errors["date"] = "Reservation date is required."

    if not time_value:
        errors["time"] = "Reservation time is required."

    time_slot = None

    if date_value and time_value:
        try:
            time_slot = datetime.fromisoformat(
                f"{date_value}T{time_value}"
            )

            if time_slot <= datetime.now():
                errors["date"] = "Reservation must be in the future."
        except ValueError:
            errors["date"] = "Reservation date or time is invalid."

    if not isinstance(customer_name, str) or not customer_name.strip():
        errors["customerName"] = "Customer name is required."

    if not isinstance(email, str) or not email:
        errors["email"] = "Email address is required."
    elif (
        email != email.strip()
        or "@" not in email
        or "." not in email.rsplit("@", 1)[-1]
    ):
        errors["email"] = "Email address format is invalid."

    try:
        parsed_guest_count = int(guest_count)

        if parsed_guest_count < 1 or parsed_guest_count > 10:
            errors["guestCount"] = (
                "Guest count must be between 1 and 10."
            )
    except (TypeError, ValueError):
        parsed_guest_count = None
        errors["guestCount"] = "Guest count is required."

    if errors:
        return errors, None

    reservation_request = {
        "time_slot": time_slot,
        "guest_count": parsed_guest_count,
        "customer_name": customer_name.strip(),
        # Email is intentionally stored without case normalization.
        "email": email,
        "phone_number": payload.get("phone") or None,
        "newsletter_opt_in": bool(
            payload.get("newsletterOptIn", False)
        ),
    }

    return {}, reservation_request


@reservation_blueprint.post("")
def submit_reservation():
    payload = request.get_json(silent=True)
    errors, reservation_request = validate_request(payload)

    if errors:
        return jsonify(
            {
                "message": "Reservation request is invalid.",
                "errors": errors,
            }
        ), 400

    try:
        reservation = create_reservation(reservation_request)
    except ReservationUnavailableError as error:
        return jsonify({"message": str(error)}), 409
    except Exception:
        return jsonify(
            {
                "message": (
                    "The reservation could not be processed at this time."
                )
            }
        ), 500

    return jsonify(
        {
            "message": "Reservation created successfully.",
            "reservation": {
                "reservationId": reservation["reservation_id"],
                "customerId": reservation["customer_id"],
                "timeSlot": reservation["time_slot"].isoformat(),
                "guestCount": reservation["guest_count"],
                "tableNumber": reservation["table_number"],
                "status": reservation["reservation_status"],
                "requestedAt": reservation["requested_at"].isoformat(),
                "assignedAt": reservation["assigned_at"].isoformat(),
            },
        }
    ), 201