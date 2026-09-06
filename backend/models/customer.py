def upsert_customer(cursor, customer_data):
    cursor.execute(
        """
        INSERT INTO customers (
            customer_name,
            email,
            phone_number,
            newsletter_opt_in
        )
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (email)
        DO UPDATE SET
            customer_name = EXCLUDED.customer_name,
            phone_number = EXCLUDED.phone_number,
            newsletter_opt_in = EXCLUDED.newsletter_opt_in
        RETURNING
            customer_id,
            customer_name,
            email,
            phone_number,
            newsletter_opt_in;
        """,
        (
            customer_data["customer_name"],
            customer_data["email"],
            customer_data["phone_number"],
            customer_data["newsletter_opt_in"],
        ),
    )

    return cursor.fetchone()