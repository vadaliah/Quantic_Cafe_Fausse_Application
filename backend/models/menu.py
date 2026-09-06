def fetch_available_menu_items(cursor):
    cursor.execute(
        """
        SELECT
            menu_categories.category_id,
            menu_categories.category_name,
            menu_categories.display_order AS category_display_order,
            menu_items.menu_item_id,
            menu_items.item_name,
            menu_items.description,
            menu_items.price,
            menu_items.display_order AS item_display_order
        FROM menu_categories
        JOIN menu_items
          ON menu_items.category_id = menu_categories.category_id
        WHERE menu_items.is_available = TRUE
        ORDER BY
            menu_categories.display_order,
            menu_items.display_order,
            menu_items.item_name;
        """
    )

    return cursor.fetchall()