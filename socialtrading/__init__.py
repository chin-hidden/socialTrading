#!/usr/bin/env python3
# coding: utf-8

import logging
import redis
from flask import Flask, session
from flask.ext.login import LoginManager, UserMixin
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore
from flask.ext.cache import Cache

from . import models


logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
login_manager.login_message = u"Xin hãy đăng nhập hoặc tạo tài khoản để xem trang này!"
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Use Redis to store sessions
# FIXME: Provide a fallback when the redis server is down.
store = RedisStore(redis.StrictRedis())
KVSessionExtension(store, app)


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
        user = models.UserDao.get_user_by_username(session["user_id"])
        return dict(user=user)
    return {}


from . import api
app.register_blueprint(api.api_blueprint, url_prefix="/api/v1")
import socialtrading.views
