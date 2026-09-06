from models.customer import upsert_customer
from models.database import create_database_connection
from models.reservation import (
    create_reservation_record,
    find_available_table,
    lock_time_slot,
)


class ReservationUnavailableError(Exception):
    pass


def create_reservation(reservation_request):
    with create_database_connection() as connection:
        with connection.cursor() as cursor:
            lock_time_slot(cursor, reservation_request["time_slot"])

            customer = upsert_customer(
                cursor,
                {
                    "customer_name": reservation_request["customer_name"],
                    "email": reservation_request["email"],
                    "phone_number": reservation_request["phone_number"],
                    "newsletter_opt_in": reservation_request[
                        "newsletter_opt_in"
                    ],
                },
            )

            table_number = find_available_table(
                cursor,
                reservation_request["time_slot"],
            )

            if table_number is None:
                raise ReservationUnavailableError(
                    "No tables are available for the requested time."
                )

            return create_reservation_record(
                cursor,
                customer["customer_id"],
                reservation_request["time_slot"],
                reservation_request["guest_count"],
                table_number,
            )