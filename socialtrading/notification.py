from sockjs.tornado import SockJSConnection
import socialtrading


# Map from user_id to a list of sessions made by that user
sockjs_clients = {}


class FakeCookieCollection:
    def __init__(self, cookies):
        self._cookies = cookies

    def get(self, name, duh):
        return self._cookies.get(name).value


class FakeRequest:
    def __init__(self, request):
        self._request = request
        self.cookies = FakeCookieCollection(request.cookies)


class WebSocketConnection(SockJSConnection):
    def __init__(self, *args):
        super().__init__(*args)

    def on_message(self, msg):
        self.send(msg)

    def on_open(self, request):
        with socialtrading.app.app_context():
            flask_session = socialtrading.app.session_interface.open_session(socialtrading.app, FakeRequest(request))
            user_id = flask_session['user_id']
            self._user_id = user_id

            if user_id not in sockjs_clients:
                sockjs_clients[user_id] = []

            sockjs_clients[user_id].append(self)

    def on_close(self):
        sockjs_clients[self.user_id].remove(self)

    @property
    def user_id(self):
        return self._user_id


def send_message_to_user(user_id, message):
    """\
    Send a message to all open sessions made by a user.
    """
    if user_id in sockjs_clients and sockjs_clients[user_id]:
        sockjs_clients[user_id][0].broadcast(sockjs_clients[user_id], message)
