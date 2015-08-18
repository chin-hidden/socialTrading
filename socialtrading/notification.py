import collections
from sockjs.tornado import SockJSConnection
from socialtrading import app


class WebSocketConnection(SockJSConnection):
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
            self.cookies = WebSocketConnection._FakeCookieCollection(
                request.cookies)

    def on_open(self, request):
        with app.app_context():
            # Get the user_id from the Flask session.
            flask_session = app.session_interface.open_session(
                app, WebSocketConnection._FakeRequest(request))
            user_id = flask_session['user_id']
            self._user_id = user_id

            message_router.add_client(self)

    def on_close(self):
        message_router.remove_client(self)

    @property
    def user_id(self) -> str:
        return self._user_id


class MessageRouter:
    def __init__(self):
        # Map from user_id to a list of sessions made by that user
        self._clients = collections.defaultdict(list)

    def add_client(self, client: WebSocketConnection):
        self._clients[client.user_id].append(client)

    def remove_client(self, client: WebSocketConnection):
        # FIXME: this remove operation might be slow.
        self._clients[client.user_id].remove(client)

    def send_message_to_user(self, user_id: str, topic, payload: dict):
        """\
        Send a message to all open sessions made by a user.
        """

        message = {
            "headers": {
            "topic": topic
            },
            "payload": payload
        }
        if user_id in self._clients and self._clients[user_id]:
            self._clients[user_id][0].broadcast(self._clients[user_id],
                                                message)


message_router = MessageRouter()
