# coding: utf-8

import functools
import flask
from flask import request, session, redirect, render_template, url_for
from flask.ext.login import \
    login_user, login_required, logout_user
from flask.ext import menu
import logging

from socialtrading import app
from . import tradeapi
from . import models


menu.Menu(app=app)
logger = logging.getLogger(__name__)


def only_allow(account_types):
    """\
    Decorator to only allow some account types to get through.

    Args:
        account_type (list of str): List of allowed account types.
    """
    def decorator(route):
        @functools.wraps(route)
        def decorated_function(*args, **kw_args):
            user = models.user_service.get_user_by_username(session['user_id'])
            if user.account_type in account_types:
                return route(*args, **kw_args)
            else:
                return render_template('noservice.jinja.html')
        return decorated_function
    return decorator


def create_tradeapi_client():
    """\
    Create a TradeAPI client with base URLs injected from the config file.
    """
    AUTH_BASE = app.config['BROKERS']['VNDIRECT']['AUTH_BASE']
    TRADEAPI_BASE = app.config['BROKERS']['VNDIRECT']['TRADEAPI_BASE']

    return tradeapi.VndirectTradeApiClient(
        auth_base_url=AUTH_BASE, tradeapi_base_url=TRADEAPI_BASE)


# FIXME Disable this route on production mode
@app.route("/__debug__")
def debug():
    raise Exception("Just for debugging")


def login_arguments():
    return {
        "next": "/app/account"
    }


@app.route('/login', methods=['GET', 'POST'])
@menu.register_menu(app, '.login', u'Đăng nhập', order=4, visible_when=lambda: not is_logged_in(), endpoint_arguments_constructor=login_arguments)
def login():
    """\
    GET: Show the login page.
    POST: Log the user in and set the `trade-api-token` and `user` keys in the session.
    """
    if request.method == "POST":
        # FIXME Use Flask-WTF to validate the form format
        username = request.form["username"]
        client = create_tradeapi_client()

        def create_user():
            # Create the user if they're not on our system yet.
            # FIXME: Extract this into a method in the UserService.
            user = models.Follower()
            user.username = username
            user.broker = "__DEMO__"
            user.account_type = "FOLLOWER"

            user_detail = client.get_user_detail()
            user.name = user_detail.customer_name
            user.account_number = user_detail.accounts[0].account_number
            user.risk_factor = 50

            account_detail = client.get_account_detail(user.account_number)
            user.cash = account_detail.cash

            if user.cash == 0:
                user.cash = 100000000

            models.user_service.save_user(user)

            return user

        try:
            user = models.user_service.get_user_by_username(username)

            if not user or user and not user.is_demo_account:
                client.login(username, request.form["password"])

            if user is None:
                user = create_user()
            login_user(user)

            session["tradeapi-client"] = client

            _next = flask.request.args.get('next')
            return flask.redirect(_next or flask.url_for('index'))
        except:
            logger.exception("Cannot login")
            # Fallthrough to the GET case
            flask.flash("Sai tên người dùng hoặc mật khẩu!", 'error')

    return render_template("login.jinja.html")


def is_logged_in():
    return "user_id" in session


# FIXME: GET should not have side effects
@app.route("/logout", methods=["GET", "POST"])
@menu.register_menu(app, '.logout', u'Đăng xuất', order=4, visible_when=is_logged_in)
@login_required
def logout():
    logout_user()
    session.clear()
    return redirect(url_for(".index"))


@app.errorhandler(404)
def page_not_found(e):
    context = {
        "error": 404,
        "description": "Không tìm thấy trang này. <br/>Quý khách vui xem lại đường dẫn hoặc liên hệ số **** để được hỗ trợ."
    }

    return flask.render_template('error.jinja.html', **context), 404


@app.errorhandler(500)
def internal_server_error(e):
    context = {
        "error": 500,
        "description": """Đã có chuyện gì đó xảy ra ở phía máy chủ. <br/>\
                          Quý khách tải lại hoặc liên hệ số **** để được hỗ trợ."""
    }
    return flask.render_template('error.jinja.html', **context), 500


@app.route("/app/<frontend_route>")
def application(frontend_route):
    return flask.render_template("app.jinja.html")


@app.route("/")
@menu.register_menu(app, '.', u'Trang chủ', order=0)
def index():
    return flask.render_template("index.jinja.html")


@app.route("/help")
@menu.register_menu(app, '.help', u'Tìm hiểu về AutoTrade', order=3)
def help():
    return render_template("help.jinja.html")


@app.route("/admin", methods=["GET", "POST"])
def admin():
    if request.method == "GET":
        context = {
            "traders": models.Trader.query.all()
        }
        return render_template("admin.jinja.html", **context)

    import subprocess

    action = request.form["action"]
    if action == "reset_db":
        subprocess.call("make db", shell=True)

    if action == "fake_trader_signal":
        from . import cloner
        import datetime

        trader = models.user_service.get_user_by_username(request.form["trader_id"])
        side = cloner.OrderSide.NORMAL_SELL if request.form["side"] == "selling" else cloner.OrderSide.NORMAL_BUY

        order_resp = cloner.ExecutedOrderResponse(
            "random-id",
            trader.account_number,
            datetime.datetime.now(),
            "now",
            side,
            request.form["symbol"],
            int(request.form["amount"]),
            float(request.form["price"]),
            0,
            0,
            "SEND"
        )

        cloner.order_processor.on_trader_order_executed(trader, order_resp)

    return redirect("/admin")
