import flask
from flask import jsonify, session, request
from flask.ext.login import login_required

from models import UserDao


api = flask.Blueprint('api', __name__)


@api.route("/account")
@login_required
def account_detail():
    """\
    Get the current user's detail
    """
    user_dao = UserDao()
    user = user_dao.get_user_by_username(session["user_id"])
    return jsonify(result=user.__dict__)


@api.route("/followers", methods=["GET"])
def get_all_followers():
    """\
    Return all followers
    """
    return jsonify(result=[])


@api.route("/follower/<username>", methods=["GET", "PUT"])
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

    404 if no such user
    """
    user_dao = UserDao()
    user = user_dao.get_user_by_username(username)

    # FIXME: throw 404

    if request.method == "PUT":
        print(request.form)

    return jsonify(result=user.as_dict())


@api.route("/follower/<username>/following", methods=["GET", "POST"])
def following_relationships(username):
    if request.method == "POST":
        pass

    return jsonify(result=[])


@api.route("/follower/<username>/positions")
def follower_positions(username):
    positions = [
        {
            "stock": "VND",
            "exchange": "HOSE",
            "quantity": 9000,
            "buyingPrice": 8500,
            "mimickingUser": "thachvu"
        },
        {
            "stock": "VND",
            "exchange": "HOSE",
            "quantity": 5000,
            "buyingPrice": 8300,
            "mimickingUser": "thachvu"
        },
        {
            "stock": "ACB",
            "exchange": "HNX",
            "quantity": 9000,
            "buyingPrice": 12000,
            "mimickingUser": "giangnguyen"
        },
    ]
    return jsonify(result=positions)


@api.route("/traders")
def get_all_traders():
    """\
    Return all traders
    """
    traders = [{
        "name": "Nguyen Hoang Giang",
        "id": "giangnguyen",
        "type": "TRADER",
        "accountNumber": "1234",
        "description": "lol",
        "cash": 1234,
        "peopleFollowing": 10,
        "roi": 100
    }, {
        "name": "Tran Vu Thach",
        "id": "thachvu",
        "type": "TRADER",
        "accountNumber": "1234",
        "description": "lol",
        "cash": 1234,
        "peopleFollowing": 10,
        "roi": 100
    }, {
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
