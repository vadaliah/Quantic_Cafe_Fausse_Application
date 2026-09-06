from flask import Flask, jsonify

from config import Config
from controllers.reservation_controller import reservation_blueprint


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(reservation_blueprint)

    @app.get("/api/health")
    def health():
        return jsonify(
            {
                "application": "Cafe Fausse API",
                "status": "healthy",
            }
        )

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True,
        load_dotenv=False,
        use_reloader=False,
    )