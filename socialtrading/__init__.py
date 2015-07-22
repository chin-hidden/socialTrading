#!/usr/bin/env python3

from flask import Flask
from models import UserDao
from flask.ext.login import LoginManager

from socialtrading.api import api


app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
login_manager = LoginManager()
login_manager.init_app(app)



@login_manager.user_loader
def load_user(userid):
    dao = UserDao()
    return dao.get_user_by_username(userid)


app.register_blueprint(api, url_prefix="/api/v1")
import socialtrading.views
