-- Cafe Fausse Application
-- 002_dml_seed_menu.sql
-- Loads the menu categories and items required by SRS FR-5.
-- This script is rerunnable: existing seed rows are updated, not duplicated.

BEGIN;

INSERT INTO menu_categories (
    category_name,
    display_order
)
VALUES
    ('Starters', 1),
    ('Main Courses', 2),
    ('Desserts', 3),
    ('Beverages', 4)
ON CONFLICT (category_name)
DO UPDATE SET
    display_order = EXCLUDED.display_order;

WITH menu_seed (
    category_name,
    item_name,
    description,
    price,
    display_order
) AS (
    VALUES
        (
            'Starters',
            'Bruschetta',
            'Fresh tomatoes, basil, olive oil, and toasted baguette slices',
            8.50::NUMERIC(8, 2),
            1
        ),
        (
            'Starters',
            'Caesar Salad',
            'Crisp romaine with homemade Caesar dressing',
            9.00::NUMERIC(8, 2),
            2
        ),
        (
            'Main Courses',
            'Grilled Salmon',
            'Served with lemon butter sauce and seasonal vegetables',
            22.00::NUMERIC(8, 2),
            1
        ),
        (
            'Main Courses',
            'Ribeye Steak',
            '12 oz prime cut with garlic mashed potatoes',
            28.00::NUMERIC(8, 2),
            2
        ),
        (
            'Main Courses',
            'Vegetable Risotto',
            'Creamy Arborio rice with wild mushrooms',
            18.00::NUMERIC(8, 2),
            3
        ),
        (
            'Desserts',
            'Tiramisu',
            'Classic Italian dessert with mascarpone',
            7.50::NUMERIC(8, 2),
            1
        ),
        (
            'Desserts',
            'Cheesecake',
            'Creamy cheesecake with berry compote',
            7.00::NUMERIC(8, 2),
            2
        ),
        (
            'Beverages',
            'Red Wine (Glass)',
            'A selection of Italian reds',
            10.00::NUMERIC(8, 2),
            1
        ),
        (
            'Beverages',
            'White Wine (Glass)',
            'Crisp and refreshing',
            9.00::NUMERIC(8, 2),
            2
        ),
        (
            'Beverages',
            'Craft Beer',
            'Local artisan brews',
            6.00::NUMERIC(8, 2),
            3
        ),
        (
            'Beverages',
            'Espresso',
            'Strong and aromatic',
            3.00::NUMERIC(8, 2),
            4
        )
)
INSERT INTO menu_items (
    category_id,
    item_name,
    description,
    price,
    display_order,
    is_available
)
SELECT
    category.category_id,
    seed.item_name,
    seed.description,
    seed.price,
    seed.display_order,
    TRUE
FROM menu_seed AS seed
JOIN menu_categories AS category
    ON category.category_name = seed.category_name
ON CONFLICT (category_id, item_name)
DO UPDATE SET
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    display_order = EXCLUDED.display_order,
    is_available = EXCLUDED.is_available;

COMMIT;