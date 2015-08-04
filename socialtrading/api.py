# coding: utf-8

import flask
from flask import jsonify, session, request
from flask.ext.login import login_required

from . import models

api_blueprint = flask.Blueprint('api', __name__)


def make_serializer(fields):
    """Make a function that returns a dictionary that only
    includes the specified fields of its argument."""

    def inner(obj):
        return {field: getattr(obj, field) for field in fields}

    return inner


def rest_endpoint(route):
    """
    Decorator to mark a view as a REST-ful endpoint, converting its returning value into
    a JSON dictionary of the following form:

    {
        "result": <the view's result>
    }
    """
    def inner(*args, **kw_args):
        result = route(*args, **kw_args)
        if isinstance(result, map):
            result = list(result)
        return jsonify(result=result)
    inner.__name__ = route.__name__
    return inner


@api_blueprint.route("/account")
@login_required
def account_detail():
    """\
    Get the current user's detail
    """
    username = session["user_id"]
    return flask.redirect(flask.url_for('.follower', username=username))


@api_blueprint.route("/followers", methods=["GET"])
@rest_endpoint
def get_all_followers():
    """\
    Return all followers
    """
    return []


@api_blueprint.route("/follower/<username>", methods=["GET", "PUT"])
@rest_endpoint
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

    404 if no such user.
    """
    user = models.UserDao.get_user_by_username(username)

    # FIXME: throw 404

    if request.method == "PUT":
        user.name = request.json['name']
        user.risk_factor = request.json['risk_factor']
        models.db_session.add(user)
        models.db_session.commit()

    fields = ['id', 'username', 'account_number', 'name', 'brokerage', 'cash', 'account_type']
    return make_serializer(fields)(user)


@api_blueprint.route("/follower/<username>/following", methods=["GET", "POST"])
@rest_endpoint
def following_relationships(username):
    if request.method == "POST":
        pass

    user = models.UserDao.get_user_by_username(username)
    fields = ['trader_id', 'follower_id', 'allocated_money']

    return map(make_serializer(fields), user.trader_assocs)


@api_blueprint.route("/follower/<username>/positions")
@rest_endpoint
def follower_positions(username):
    positions = models.db_session.query(models.Position).filter(models.Position.username==username).all()

    fields = ['username', 'mimicking_username', 'symbol', 'quantity', 'buying_price', 'buying_date']

    return map(make_serializer(fields), positions)


@api_blueprint.route("/traders")
@rest_endpoint
def get_all_traders():
    """\
    Return all traders
    """
    fields = ['id', 'name', 'username', 'account_type', 'account_number', 'description', 'cash', 'people_following', 'roi']

    traders = models.db_session.query(models.Trader).all()

    return map(make_serializer(fields), traders)
