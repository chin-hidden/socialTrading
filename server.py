#!/usr/bin/env python3

import requests
import json
import flask
from flask import Flask, request, session, redirect, jsonify
from flask.ext.login import \
    LoginManager, login_user, login_required, logout_user


app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
login_manager = LoginManager()
login_manager.init_app(app)


class VndirectTradeApiClient:
    API_URL = "https://api.vndirect.com.vn/v1"

    def login(self, username, password):
        """\
        Log the user in and return the 1st phase token.
        """
        res = requests.post(self.API_URL + "/auth", 
            data={"username": username, "password": password})
        res.raise_for_status()

        token = res.json()["token"]
        return token

    def get_user_detail(self, token):
        """\
        - GET /customer
        """
        headers = {"Authorization": "Bearer " + token}

        res = requests.get(self.API_URL + "/customer", headers=headers)
        user = res.json()
        return user

    def get_account_detail(self, token, account_nr):
        """\
        - GET /accounts/{id}, and
        - GET /accounts/{id}/portfolio
        """
        headers = {"Authorization": "Bearer " + token}

        res = requests.get(self.API_URL + "/accounts/" + account_nr, 
            headers=headers)
        accounts[account_nr] = res.json()
        res = requests.get(self.API_URL + "/accounts/" + account_nr + "/portfolio", 
            headers=headers)
        accounts[account_nr].update(res.json())


class User:

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return "trung"


@login_manager.user_loader
def load_user(userid):
    return User()


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return """
        <html>
        <body>
            <form action="" method="post">
                <input name="username" type="text">
                <input name="password" type="password">
                <input type="submit">
            </form>
        </body>
        </html>
        """
    else:
        login_user(User())

        client = VndirectTradeApiClient()
        token = client.login(request.form["username"], request.form["password"])
        session["trade-api-token"] = token
        return token


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")


@app.route("/")
@login_required
def hello():
    client = VndirectTradeApiClient()
    token = session["trade-api-token"]
    return jsonify(**client.get_user_detail(token))


if __name__ == "__main__":
    app.run(debug=True)
