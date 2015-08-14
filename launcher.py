#!/usr/bin/env python3.4

from flask_failsafe import failsafe

from tornado import autoreload
from tornado.wsgi import WSGIContainer
from tornado.ioloop import IOLoop
from tornado.web import Application, FallbackHandler
from sockjs.tornado import SockJSRouter

import socialtrading
from socialtrading import notification


@failsafe
def create_app():
    return socialtrading.app


if __name__ == "__main__":
    host = socialtrading.app.config["SERVER_HOST"]
    port = socialtrading.app.config["SERVER_PORT"]

    EchoRouter = SockJSRouter(notification.WebSocketConnection, '/realtime')

    container = WSGIContainer(create_app())
    server = Application(EchoRouter.urls + [
        (r'.*', FallbackHandler, dict(fallback=container))
    ])

    server.listen(port)
    ioloop = IOLoop.instance()
    autoreload.start(ioloop)
    ioloop.start()
