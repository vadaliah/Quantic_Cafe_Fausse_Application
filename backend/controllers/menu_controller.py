from flask import Blueprint, current_app, jsonify

from services.menu_service import get_available_menu

menu_blueprint = Blueprint(
    "menu",
    __name__,
    url_prefix="/api/menu",
)


@menu_blueprint.get("")
def retrieve_menu():
    try:
        categories = get_available_menu()
    except Exception:
        current_app.logger.exception("Unable to retrieve the menu.")

        return jsonify(
            {
                "message": (
                    "The menu could not be loaded at this time."
                )
            }
        ), 500

    return jsonify({"categories": categories}), 200