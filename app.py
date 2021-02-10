from flask import Flask, send_file


def create_app():
    app = Flask(__name__, static_folder="static")

    @app.route("/")
    def index():
        return send_file("static/index.html")

    return app


if __name__ == "__main__":
    create_app().run(host='0.0.0.0', port=8080, debug=False)
