from sockjs.tornado import SockJSConnection
from socialtrading import app


# Map from user_id to a list of sessions made by that user
sockjs_clients = {}



class WebSocketConnection(SockJSConnection):
    def __init__(self, *args):
        super().__init__(*args)

    def on_message(self, msg):
        self.send(msg)

    # Classes to adapt sockjs' request object to Flask-KVSession's
    # session_interface.open_session()'s expectation.

    class _FakeCookieCollection:
        def __init__(self, cookies):
            self._cookies = cookies

        def get(self, name, _):
            return self._cookies.get(name).value

    class _FakeRequest:
        def __init__(self, request):
            self.cookies = WebSocketConnection._FakeCookieCollection(request.cookies)

    def on_open(self, request):
        with app.app_context():
            # Get the user_id from the Flask session.
            flask_session = app.session_interface.open_session(
                app, WebSocketConnection._FakeRequest(request))
            user_id = flask_session['user_id']
            self._user_id = user_id

            if user_id not in sockjs_clients:
                sockjs_clients[user_id] = []

            sockjs_clients[user_id].append(self)

    def on_close(self):
        sockjs_clients[self.user_id].remove(self)

    @property
    def user_id(self) -> str:
        return self._user_id


def send_message_to_user(user_id: str, message: str):
    """\
    Send a message to all open sessions made by a user.
    """
    if user_id in sockjs_clients and sockjs_clients[user_id]:
        sockjs_clients[user_id][0].broadcast(sockjs_clients[user_id], message)
