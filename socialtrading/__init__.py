#!/usr/bin/env python3
# coding: utf-8

import logging
import redis
from flask import Flask, session
from flask.ext.login import LoginManager, UserMixin
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore
import os



app = Flask(__name__)


# Load the configurations
app.config.from_object('socialtrading.default_configs')
if 'CONFIG_FILE' in os.environ:
    app.config.from_envvar('CONFIG_FILE')


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
login_manager.login_message = u"Xin hãy đăng nhập hoặc tạo tài khoản để xem trang này!"


@login_manager.user_loader
def load_user(userid):
    # dao = UserDao()
    # return dao.get_user_by_username(userid)
    user = UserMixin()
    return user


@app.context_processor
def inject_user():
    """Inject the 'user' object into the template context"""
    if "user_id" in session:
        from . import models
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

# Load the view functions for their decorator side effect
import socialtrading.views
