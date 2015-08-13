#!/usr/bin/env python3.4

from flask_failsafe import failsafe
import socialtrading


@failsafe
def create_app():
    return socialtrading.app


if __name__ == "__main__":
    host = socialtrading.app.config["SERVER_HOST"]
    port = socialtrading.app.config["SERVER_PORT"]
    create_app().run(host=host, port=port)
