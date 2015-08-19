# coding: utf-8

import functools
import flask
from flask import jsonify, session, request
from flask.ext.login import login_required

from . import models
from socialtrading import db

api_blueprint = flask.Blueprint('api', __name__)


def make_serializer(fields):
    """Make a function that serializes only selected fields of an object."""

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
    @functools.wraps(route)
    def inner(*args, **kw_args):
        result = route(*args, **kw_args)
        if isinstance(result, map):
            result = list(result)
        return jsonify(result=result)
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
@login_required
@rest_endpoint
def get_all_followers():
    """\
    Return all followers
    """
    return []


@api_blueprint.route("/follower/<username>", methods=["GET", "PUT"])
@login_required
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
    user = models.user_service.get_user_by_username(username)

    if not user:
        flask.abort(404)

    if user.username != session['user_id']:
        flask.abort(401)

    if request.method == "PUT":
        user.name = request.json['name']
        user.risk_factor = request.json['risk_factor']
        user.initialized = True
        db.session.add(user)
        db.session.commit()

    fields = ['id', 'username', 'account_number',
              'name', 'broker', 'cash', 'account_type',
              'initialized', 'nav', 'gross_stock_value', 'gross_profit']
    if isinstance(user, models.Follower):
        fields.append('risk_factor')

    return make_serializer(fields)(user)


@api_blueprint.route("/follower/<username>/following", methods=["GET", "POST"])
@login_required
@rest_endpoint
def following_relationships(username):
    if request.method == "POST":
        following = models.Following()
        following.follower_id = request.json['follower_id']
        following.trader_id = request.json['trader_id']
        # FIXME: Auto divide the allocated money
        following.allocated_money = 1000000
        db.session.add(following)
        db.session.commit()

    user = models.user_service.get_user_by_username(username)
    if not user:
        flask.abort(404)

    fields = ['trader_id', 'follower_id', 'allocated_money', 'profit']

    return map(make_serializer(fields), user.trader_assocs)


@api_blueprint.route("/follower/<username>/deals")
@login_required
@rest_endpoint
def follower_positions(username):
    deals = models.user_service.get_deals_by_username(username)

    return map(make_serializer(["id", "username", "mimicking_username",
        "buying_price", "quantity", "status", "buying_date", "symbol"]), deals)


@api_blueprint.route("/traders")
@rest_endpoint
def get_all_traders():
    """\
    Return all traders
    """
    fields = ['id', 'name', 'username', 'account_type', 'account_number', 'description', 'cash', 'people_following', 'roi', 'nav']
    traders = models.Trader.query.all()
    return map(make_serializer(fields), traders)
