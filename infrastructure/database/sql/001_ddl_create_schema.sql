-- Café Fausse Application
-- Creates customer, reservation, and menu database objects.
-- Target database: cafe_fausse_db

BEGIN;

CREATE TABLE customers (
    customer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_name VARCHAR(150),
    email VARCHAR(254) NOT NULL,
    phone_number VARCHAR(30),
    newsletter_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_customers_email UNIQUE (email)
);

COMMENT ON TABLE customers IS
    'Customers who make reservations or opt in to the newsletter';

COMMENT ON COLUMN customers.email IS
    'Email stored and compared verbatim without case normalization';

CREATE OR REPLACE FUNCTION set_customer_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customers_set_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION set_customer_updated_at();


CREATE TABLE reservations (
    reservation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    time_slot TIMESTAMP NOT NULL,
    guest_count SMALLINT NOT NULL,
    table_number SMALLINT,
    reservation_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    release_reason VARCHAR(30),

    CONSTRAINT fk_reservations_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id),

    CONSTRAINT chk_reservations_guest_count
        CHECK (guest_count > 0),

    CONSTRAINT chk_reservations_table_number
        CHECK (table_number BETWEEN 1 AND 30),

    CONSTRAINT chk_reservations_status
        CHECK (
            reservation_status IN (
                'PENDING',
                'ASSIGNED',
                'RELEASED'
            )
        ),

    CONSTRAINT chk_reservations_release_reason
        CHECK (
            release_reason IS NULL
            OR release_reason IN (
                'CUSTOMER_CANCELLED',
                'RESTAURANT_CHECKOUT',
                'ADMIN_RELEASED'
            )
        ),

    CONSTRAINT chk_reservations_state
        CHECK (
            (
                reservation_status = 'PENDING'
                AND table_number IS NULL
                AND assigned_at IS NULL
                AND released_at IS NULL
                AND release_reason IS NULL
            )
            OR
            (
                reservation_status = 'ASSIGNED'
                AND table_number IS NOT NULL
                AND assigned_at IS NOT NULL
                AND released_at IS NULL
                AND release_reason IS NULL
            )
            OR
            (
                reservation_status = 'RELEASED'
                AND released_at IS NOT NULL
                AND release_reason IS NOT NULL
            )
        )
);

COMMENT ON TABLE reservations IS
    'Customer reservations and their table-assignment lifecycle';

COMMENT ON COLUMN reservations.time_slot IS
    'Restaurant-local reservation date and time';

COMMENT ON COLUMN reservations.table_number IS
    'Assigned table from 1 through 30; null while pending';

CREATE UNIQUE INDEX uq_reservations_active_time_table
    ON reservations (time_slot, table_number)
    WHERE reservation_status = 'ASSIGNED';

CREATE INDEX ix_reservations_customer_id
    ON reservations (customer_id);

CREATE INDEX ix_reservations_time_slot
    ON reservations (time_slot);

CREATE INDEX ix_reservations_status
    ON reservations (reservation_status);


CREATE OR REPLACE FUNCTION set_reservation_lifecycle_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.requested_at =
            COALESCE(NEW.requested_at, CURRENT_TIMESTAMP);

        IF NEW.reservation_status = 'ASSIGNED' THEN
            NEW.assigned_at =
                COALESCE(NEW.assigned_at, CURRENT_TIMESTAMP);

        ELSIF NEW.reservation_status = 'RELEASED' THEN
            NEW.released_at =
                COALESCE(NEW.released_at, CURRENT_TIMESTAMP);
        END IF;

        RETURN NEW;
    END IF;

    IF NEW.reservation_status
       IS DISTINCT FROM OLD.reservation_status THEN

        IF NEW.reservation_status = 'ASSIGNED' THEN
            NEW.assigned_at =
                COALESCE(NEW.assigned_at, CURRENT_TIMESTAMP);
            NEW.released_at = NULL;
            NEW.release_reason = NULL;

        ELSIF NEW.reservation_status = 'RELEASED' THEN
            NEW.released_at =
                COALESCE(NEW.released_at, CURRENT_TIMESTAMP);
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reservations_set_lifecycle_timestamps
BEFORE INSERT OR UPDATE OF reservation_status
ON reservations
FOR EACH ROW
EXECUTE FUNCTION set_reservation_lifecycle_timestamps();


CREATE TABLE menu_categories (
    category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    display_order SMALLINT NOT NULL,

    CONSTRAINT uq_menu_categories_name
        UNIQUE (category_name),

    CONSTRAINT chk_menu_categories_display_order
        CHECK (display_order >= 0)
);

COMMENT ON TABLE menu_categories IS
    'Ordered Café Fausse menu categories';


CREATE TABLE menu_items (
    menu_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(8, 2) NOT NULL,
    display_order SMALLINT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_menu_items_category
        FOREIGN KEY (category_id)
        REFERENCES menu_categories (category_id),

    CONSTRAINT uq_menu_items_category_name
        UNIQUE (category_id, item_name),

    CONSTRAINT chk_menu_items_price
        CHECK (price >= 0),

    CONSTRAINT chk_menu_items_display_order
        CHECK (display_order >= 0)
);

CREATE INDEX ix_menu_items_category_id
    ON menu_items (category_id);

COMMENT ON TABLE menu_items IS
    'Menu products maintained through CRUD operations';

COMMENT ON COLUMN menu_items.is_available IS
    'Controls customer visibility without deleting the item';

COMMIT;