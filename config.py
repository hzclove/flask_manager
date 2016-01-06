import os

DEBUG = True
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI = 'mysql://koudai:KouDai2015@123.57.21.222:3306/study'
#SQLALCHEMY_DATABASE_URI = 'mysql://koudai:KouDai2015@101.200.199.209:3306/study'
SQLALCHEMY_BINDS = {
    'bbs': 'mysql://dever:dever@123.57.21.222:3306/bbs'
    #'bbs': 'mysql://work:work@10.51.111.18:3306/bbs'
}