#!/usr/bin/env python3
# coding: utf-8

import logging
import redis
from flask import Flask, session
from flask.ext.login import LoginManager, UserMixin
from flask.ext.sqlalchemy import SQLAlchemy
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore
import flask_debugtoolbar
import os
import threading


app = Flask(__name__)


# Load the configurations
app.config.from_object('socialtrading.default_configs')
if 'CONFIG_FILE' in os.environ:
    app.config.from_envvar('CONFIG_FILE')

# Setup the database
db = SQLAlchemy(app)

# Debugging stuff
flask_debugtoolbar.DebugToolbarExtension(app)

# Setup logging
if app.config['DEBUG']:
    level = logging.DEBUG
else:
    level = logging.INFO
logging.basicConfig(level=level)


# Setup the login logic
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
login_manager.login_message = u"Mời quý khách đăng nhập sử dụng tài khoản của VNDIRECT để có thể sử dụng trang này!"


from . import models


@login_manager.user_loader
def load_user(userid):
    # FIXME: Not sure what this function is for. But if we uncomment
    # the next line, the login process will run very slowly.

    return models.UserDao.get_user_by_username(userid)
    return UserMixin()


@app.context_processor
def inject_user():
    """Inject the 'user' object into the template context"""
    if "user_id" in session:
        user = models.UserDao.get_user_by_username(session["user_id"])
        return dict(user=user)
    return {}


# Use Redis to store sessions
# FIXME: Provide a fallback when the redis server is down.
store = RedisStore(redis.StrictRedis())
KVSessionExtension(store, app)


# Register the API handlers
from . import api
app.register_blueprint(api.api_blueprint, url_prefix="/api/v1")


@app.before_first_request
def run_order_processing_thread():
    from socialtrading import cloner
    order_processing_thread = threading.Thread(target=cloner.run_order_processor)
    order_processing_thread.start()

# Load the view functions for their decorator side effect
import socialtrading.views
