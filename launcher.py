from flask_failsafe import failsafe
import threading


@failsafe
def create_app():
    from socialtrading import app
    return app


if __name__ == "__main__":
    # FIXME: Probably not a good place to run this thread. May be on Flask app initialized hook?
    from socialtrading import cloner
    order_processing_thread = threading.Thread(target=cloner.run_order_processor)
    order_processing_thread.start()
    create_app().run(debug=True)
