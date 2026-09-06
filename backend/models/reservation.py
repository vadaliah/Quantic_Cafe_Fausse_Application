def lock_time_slot(cursor, time_slot):
    cursor.execute(
        "SELECT pg_advisory_xact_lock(hashtext(%s));",
        (time_slot.isoformat(),),
    )

def find_available_table(cursor, time_slot):
    cursor.execute(
        """
        SELECT candidate.table_number
        FROM generate_series(1, 30) AS candidate(table_number)
        WHERE NOT EXISTS (
            SELECT 1
            FROM reservations
            WHERE reservations.time_slot = %s
              AND reservations.table_number = candidate.table_number
              AND reservations.reservation_status = 'ASSIGNED'
        )
        ORDER BY RANDOM()
        LIMIT 1;
        """,
        (time_slot,),
    )

    available_table = cursor.fetchone()

    if available_table is None:
        return None

    return available_table["table_number"]


def create_reservation_record(
    cursor,
    customer_id,
    time_slot,
    guest_count,
    table_number,
):
    cursor.execute(
        """
        INSERT INTO reservations (
            customer_id,
            time_slot,
            guest_count,
            table_number,
            reservation_status,
            assigned_at
        )
        VALUES (%s, %s, %s, %s, 'ASSIGNED', CURRENT_TIMESTAMP)
        RETURNING
            reservation_id,
            customer_id,
            time_slot,
            guest_count,
            table_number,
            reservation_status,
            requested_at,
            assigned_at;
        """,
        (
            customer_id,
            time_slot,
            guest_count,
            table_number,
        ),
    )

    return cursor.fetchone()