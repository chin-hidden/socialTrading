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

    user = models.UserDao.get_user_by_username(username)

    def serialize_following(f):
        fields = ['trader_id', 'follower_id', 'allocated_money']
        return {field: getattr(f, field) for field in fields}

    return jsonify(result=map(serialize_following, user.trader_assocs))


@api_blueprint.route("/follower/<username>/positions")
def follower_positions(username):
    positions = models.db_session.query(models.Position).filter(models.Position.username==username).all()

    def serialize_position(pos):
        fields = ['username', 'mimicking_username', 'symbol', 'quantity', 'buying_price', 'buying_date']
        return {field: getattr(pos, field) for field in fields}


    return jsonify(result=map(serialize_position, positions))


@api_blueprint.route("/traders")
def get_all_traders():
    """\
    Return all traders
    """
    fields = ['name', 'username', 'account_type', 'account_number', 'description', 'cash', 'people_following', 'roi']

    def trader_to_json(trader):
        return {field: getattr(trader, field) for field in fields}

    traders = models.db_session.query(models.Trader).all()

    return jsonify(result=map(trader_to_json, traders))
