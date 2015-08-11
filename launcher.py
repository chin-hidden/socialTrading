#!/usr/bin/env python3.4

from flask_failsafe import failsafe
import threading
import socialtrading


@failsafe
def create_app():
    return socialtrading.app


if __name__ == "__main__":
    # FIXME: Probably not a good place to run this thread. May be on Flask app initialized hook?
    from socialtrading import cloner
    order_processing_thread = threading.Thread(target=cloner.run_order_processor)
    order_processing_thread.start()

    host = socialtrading.app.config["SERVER_HOST"]
    port = socialtrading.app.config["SERVER_PORT"]
    create_app().run(host=host, port=port)
