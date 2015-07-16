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
        return self.id


class UserDao:
    def get_user_by_username(self, username):
        if username == "ndtrung4419":
            user = User()
            user.id = username
            user.name = "Trung Ngo"
            user.type = "FOLLOWER"
            user.accountNumber = "1234"
            user.broker = "VND"
            user.riskFactor = 60
            user.firstLogin = False
            return user



@login_manager.user_loader
def load_user(userid):
    dao = UserDao()
    return dao.get_user_by_username(userid)


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
        # FIXME Use Flask-WTF to validate the form format
        user_dao = UserDao()
        user = user_dao.get_user_by_username(request.form["username"])
        login_user(user)

        client = VndirectTradeApiClient()
        token = client.login(request.form["username"], request.form["password"])
        session["trade-api-token"] = token
        return token


# FIXME: GET should not have side effect
@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return redirect("/")


@app.route("/")
def index():
    return redirect("/static/index.html")


@app.route("/api/v1/account")
@login_required
def account_detail():
    """\
    Get the current user's detail
    """
    user_dao = UserDao()
    user = user_dao.get_user_by_username(session["user_id"])
    return jsonify(result=user.__dict__)


@app.route("/api/v1/followers", methods=["GET"])
def get_all_followers():
    """\
    Return all followers
    """
    return jsonify(result=[])


@app.route("/api/v1/follower/<username>", methods=["GET", "PUT"])
def follower(username):
    """\
    GET and PUT a follower.

    GET /follower/<username>
    {
        "name": "Superman",
        "accountNumber": "1234",
        "type": "FOLLOWER",    // or TRADER
        "riskFactor": 60
    }
    """
    user_dao = UserDao()
    user = user_dao.get_user_by_username(username)

    if request.method == "PUT":
        print(request.form)

    return jsonify(result=user.__dict__)


@app.route("/api/v1/follower/<username>/following", methods=["GET", "POST"])
def following_relationships(username):
    if request.method == "POST":
        pass

    return jsonify(result=[])


@app.route("/api/v1/follower/<username>/positions")
def follower_positions(username):
    return jsonify(result=[])


@app.route("/api/v1/traders")
def get_all_traders():
    """\
    Return all traders
    """
    traders = [
    {
        "name": "Nguyen Hoang Giang",
        "id": "giangnguyen",
        "type": "TRADER",
        "accountNumber": "1234",
        "description": "lol",
        "cash": 1234,
        "peopleFollowing": 10,
        "roi": 100
    },
    {
        "name": "Tran Vu Thach",
        "id": "thachvu",
        "type": "TRADER",
        "accountNumber": "1234",
        "description": "lol",
        "cash": 1234,
        "peopleFollowing": 10,
        "roi": 100
    },
    {
        "name": "Hoang Minh Chau",
        "id": "chauhoang",
        "type": "TRADER",
        "accountNumber": "1234",
        "description": "lol",
        "cash": 1234,
        "peopleFollowing": 10,
        "roi": 100
    },
    ]
    return jsonify(result=traders)


if __name__ == "__main__":
    app.run(debug=True)
