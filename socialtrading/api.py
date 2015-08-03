# coding: utf-8

import flask
from flask import jsonify, session, request
from flask.ext.login import login_required

import models

api_blueprint = flask.Blueprint('api', __name__)


@api_blueprint.route("/account")
@login_required
def account_detail():
    """\
    Get the current user's detail
    """
    user = models.UserDao.get_user_by_username(session["user_id"])
    return jsonify(result=user.as_dict())


@api_blueprint.route("/followers", methods=["GET"])
def get_all_followers():
    """\
    Return all followers
    """
    return jsonify(result=[])


@api_blueprint.route("/follower/<username>", methods=["GET", "PUT"])
def follower(username):
    """\
    GET and PUT a follower.

    GET /follower/<username>
    {
        "name": "Superman",
        "account_number": "1234",
        "type": "FOLLOWER",    // or TRADER
        "risk_factor": 60
    }

    404 if no such user
    """
    user = models.UserDao.get_user_by_username(username)

    # FIXME: throw 404

    if request.method == "PUT":
        user.name = request.json['name']
        user.risk_factor = request.json['risk_factor']
        models.db_session.add(user)
        models.db_session.commit()


    return jsonify(result=user.as_dict())


@api_blueprint.route("/follower/<username>/following", methods=["GET", "POST"])
def following_relationships(username):
    if request.method == "POST":
        pass

    return jsonify(result=[])


@api_blueprint.route("/follower/<username>/positions")
def follower_positions(username):
    positions = [
        {
            "stock": "VND",
            "exchange": "HOSE",
            "quantity": 9000,
            "buying_price": 8500,
            "mimicking_user": "thachvu"
        },
        {
            "stock": "VND",
            "exchange": "HOSE",
            "quantity": 5000,
            "buying_price": 8300,
            "mimicking_user": "thachvu"
        },
        {
            "stock": "ACB",
            "exchange": "HNX",
            "quantity": 9000,
            "buying_price": 12000,
            "mimicking_user": "giangnguyen"
        },
    ]
    return jsonify(result=positions)


@api_blueprint.route("/traders")
def get_all_traders():
    """\
    Return all traders
    """
    traders = [{
        "name": u"Nguyễn Hoàng Giang",
        "id": "giangnguyen",
        "type": "TRADER",
        "account_number": "1234",
        "description": "lol",
        "cash": 1234,
        "people_following": 10,
        "roi": 100
    }, {
        "name": u"Trần Vũ Thạch",
        "id": "thachvu",
        "type": "TRADER",
        "account_number": "1234",
        "description": "lol",
        "cash": 1234,
        "people_following": 10,
        "roi": 100
    }, {
        "name": u"Hoàng Minh Châu",
        "id": "chauhoang",
        "type": "TRADER",
        "account_number": "1234",
        "description": "lol",
        "cash": 1234,
        "people_following": 10,
        "roi": 100
    },
    ]
    return jsonify(result=traders)
