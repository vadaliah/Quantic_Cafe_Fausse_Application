from models.database import create_database_connection
from models.menu import fetch_available_menu_items


def get_available_menu():
    with create_database_connection() as connection:
        with connection.cursor() as cursor:
            menu_rows = fetch_available_menu_items(cursor)

    categories = {}

    for row in menu_rows:
        category_id = row["category_id"]

        if category_id not in categories:
            categories[category_id] = {
                "categoryId": category_id,
                "categoryName": row["category_name"],
                "displayOrder": row["category_display_order"],
                "items": [],
            }

        categories[category_id]["items"].append(
            {
                "menuItemId": row["menu_item_id"],
                "itemName": row["item_name"],
                "description": row["description"],
                "price": float(row["price"]),
                "displayOrder": row["item_display_order"],
            }
        )

    return list(categories.values())