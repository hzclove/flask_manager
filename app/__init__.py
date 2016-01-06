# -*- coding: utf8 -*-
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import sys
reload(sys)
sys.setdefaultencoding('utf8')


app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

from app import views, models
