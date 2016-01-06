# -*- coding: utf8 -*-

# from app import bcrypt, db
from app import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import *
from sqlalchemy.dialects import mysql


class NewsBasic(db.Model):
    __tablename__ = 'news_basic'
    __table_args__ = {'schema': 'study'}

    id = db.Column('id', mysql.INTEGER(display_width=11, unsigned=True), primary_key=True, nullable=False)
    articleId = db.Column('articleId', mysql.INTEGER(display_width=11), nullable=False, default='0')
    articleType = db.Column('articleType', VARCHAR(length=32), nullable=False, default='')
    provinceId = db.Column('provinceId', VARCHAR(length=32), nullable=False, default='')
    # provinceId = db.Column('provinceId', db.ForeignKey('province.province_id'))
    majorId = db.Column('majorId', VARCHAR(length=32), nullable=False, default='')
    instruction = db.Column('instruction', VARCHAR(length=256), nullable=False, default='')
    attachUrl = db.Column('attachUrl', VARCHAR(length=256), nullable=False, default='')
    thumbNum = db.Column('thumbNum', mysql.INTEGER(display_width=11), nullable=False, default='0')
    transmitNum = db.Column('transmitNum', mysql.INTEGER(display_width=11), nullable=False, default='0')
    commentNum = db.Column('commentNum', mysql.INTEGER(display_width=11), nullable=False, default='0')
    createdTime = db.Column('createdTime', TIMESTAMP(), nullable=False, default=func.current_timestamp())
    expiredAt = db.Column('expiredAt', TIMESTAMP(), nullable=False, default=func.current_timestamp())
    briefText = db.Column('briefText', VARCHAR(length=256), nullable=False, default='')
    panelUrl = db.Column('panelUrl', VARCHAR(length=256), nullable=False, default='')
    handPicked = db.Column('handPicked', mysql.INTEGER(display_width=11), nullable=False, default='0')

class NewsComment(db.Model):
    __tablename__ = 'news_comment'
    __table_args__ = {'schema': 'study'}

    id = db.Column('id', mysql.INTEGER(display_width=11, unsigned=True), primary_key=True, nullable=False)
    articleId = db.Column('articleId', mysql.INTEGER(display_width=11), nullable=False, default='0')
    uid = db.Column('uid', VARCHAR(collation=u'utf8mb4_bin', length=32), nullable=False, default='')
    content = db.Column('content', VARCHAR(collation=u'utf8mb4_bin', length=1024), nullable=False, default='')
    commentTime = db.Column('commentTime', TIMESTAMP(), nullable=False, default=func.current_timestamp())
    parentId = db.Column('parentId', mysql.INTEGER(display_width=11), nullable=False, default='0')


class NewsDetail(db.Model):
    __tablename__ = 'news_detail'
    __table_args__ = {'schema': 'study'}

    id = db.Column('id', mysql.INTEGER(display_width=11, unsigned=True), primary_key=True, nullable=False)
    author = db.Column('author', VARCHAR(length=32), nullable=False, default='')
    content = db.Column('content', TEXT())


class NewsFavorites(db.Model):
    __tablename__ = 'news_favorites'
    __table_args__ = {'schema': 'study'}

    id = db.Column('id', mysql.INTEGER(display_width=11, unsigned=True), primary_key=True, nullable=False)
    uid = db.Column('uid', VARCHAR(length=32), nullable=False, default='')
    articleId = db.Column('articleId', mysql.INTEGER(display_width=11), nullable=False, default='0')
    collectTime = db.Column('collectTime', TIMESTAMP(), nullable=False, default=func.current_timestamp())


class NewsThumb(db.Model):
    __tablename__ = 'news_thumb'
    __table_args__ = {'schema': 'study'}

    id = db.Column('id', mysql.INTEGER(display_width=11, unsigned=True), primary_key=True, nullable=False)
    uid = db.Column('uid', VARCHAR(length=32), nullable=False, default='')
    articleId = db.Column('articleId', mysql.INTEGER(display_width=11), nullable=False, default='0')
    thumbTime = db.Column('thumbTime', TIMESTAMP(), nullable=False, default=func.current_timestamp())

class Province(db.Model):
    __tablename__ = 'province'
    __table_args__ = {'schema': 'study'}

    province_id = db.Column('province_id', VARCHAR(length=20), primary_key=True, nullable=False)
    province_name = db.Column('province_name', VARCHAR(length=50), nullable=False)
    # news_basics = db.relationship('NewsBasic', backref='province', lazy='dynamic')

class Major(db.Model):
    __tablename__ = 'major'
    __table_args__ = {'schema': 'study'}

    province_name = db.Column('province_name', VARCHAR(length=20), nullable=False, primary_key=True)
    major_name = db.Column('major_name', VARCHAR(length=50), nullable=False)
    major_id = db.Column('major_id', VARCHAR(length=20), nullable=False, primary_key=True)
    major_stage = db.Column('major_stage', VARCHAR(length=20), nullable=False, default='')
    major_university = db.Column('major_university', VARCHAR(length=50), nullable=False, default='')
    subject_seq = db.Column('subject_seq', VARCHAR(length=20), nullable=False)
    subject_name = db.Column('subject_name', VARCHAR(length=50), nullable=False)
    subject_id = db.Column('subject_id', VARCHAR(length=20), primary_key=True)
    exam_mode = db.Column('exam_mode', VARCHAR(length=20))
    exam_type = db.Column('exam_type', VARCHAR(length=100))
    subject_property = db.Column('subject_property', VARCHAR(length=20))
    exam_month = db.Column('exam_month', VARCHAR(length=20))
    book_name = db.Column('book_name', VARCHAR(length=50))
    book_author = db.Column('book_author', VARCHAR(length=50))
    book_publisher = db.Column('book_publisher', VARCHAR(length=50))
    book_version = db.Column('book_version', VARCHAR(length=50))
    book_channel = db.Column('book_channel', VARCHAR(length=50))
    book_id = db.Column('book_id', VARCHAR(length=50))
    remark = db.Column('remark', TEXT())
    wenli_flag = db.Column('wenli_flag', VARCHAR(length=20))


class Account(db.Model):
    __tablename__ = 'account'
    __table_args__ = {'schema': 'study'}

    uid = db.Column('uid', VARCHAR(collation=u'utf8mb4_bin', length=128), primary_key=True, nullable=False, default='')
    nickname = db.Column('nickname', VARCHAR(collation=u'utf8mb4_bin', length=32), nullable=False, default='')
    passWord = db.Column('passWord', VARCHAR(collation=u'utf8mb4_bin', length=128), nullable=False, default='')
    phone = db.Column('phone', VARCHAR(collation=u'utf8mb4_bin', length=32), nullable=False, default='')
    profileUrl = db.Column('profileUrl', VARCHAR(collation=u'utf8mb4_bin', length=256), nullable=False, default='')
    registerTime = db.Column('registerTime', TIMESTAMP(), nullable=False, default=func.current_timestamp())
    accountType = db.Column('accountType', VARCHAR(collation=u'utf8mb4_bin', length=32), nullable=False, default='')
    gender = db.Column('gender', VARCHAR(collation=u'utf8mb4_bin', length=32), nullable=False, default='DEFAULT')
    registerChannel = db.Column('registerChannel', VARCHAR(collation=u'utf8mb4_bin', length=110))
    qqToken = db.Column('qqToken', VARCHAR(collation=u'utf8mb4_bin', length=128), nullable=False, default='')
    weixinToken = db.Column('weixinToken', VARCHAR(collation=u'utf8mb4_bin', length=128), nullable=False, default='')
    weiboToken = db.Column('weiboToken', VARCHAR(collation=u'utf8mb4_bin', length=128), nullable=False, default='')
    imei = db.Column('imei', VARCHAR(collation=u'utf8mb4_bin', length=128))
    majorId = db.Column('majorId', VARCHAR(collation=u'utf8mb4_bin', length=20))


class Collects(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'collects'
    __table_args__ = {'schema': 'bbs'}

    topic_id = db.Column('topic_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    user_id = db.Column('user_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50), primary_key=True, nullable=False)
    status = db.Column('status', mysql.TINYINT(display_width=4), nullable=False)
    update_time = db.Column('update_time', mysql.BIGINT(display_width=20), nullable=False)


class Comments(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'comments'
    __table_args__ = {'schema': 'bbs'}

    comment_id = db.Column('comment_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    content = db.Column('content', mysql.MEDIUMTEXT(collation=u'utf8mb4_unicode_ci'))
    pub_time = db.Column('pub_time', mysql.BIGINT(display_width=20), nullable=False)
    pub_area = db.Column('pub_area', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50))
    pub_client = db.Column('pub_client', VARCHAR(collation=u'utf8mb4_unicode_ci', length=20))
    images = db.Column('images', mysql.MEDIUMTEXT(collation=u'utf8mb4_unicode_ci'))
    status = db.Column('status', mysql.TINYINT(display_width=4), nullable=False)
    topic_id = db.Column('topic_id', mysql.INTEGER(display_width=11), nullable=False)
    forum_id = db.Column('forum_id', mysql.INTEGER(display_width=11), nullable=False)
    user_id = db.Column('user_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50), nullable=False)
    user_name = db.Column('user_name', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50), nullable=False)
    reply_id = db.Column('reply_id', mysql.INTEGER(display_width=11))
    reply_floor_no = db.Column('reply_floor_no', mysql.INTEGER(display_width=11))
    reply_user_id = db.Column('reply_user_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50))
    reply_user_name = db.Column('reply_user_name', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50))
    reply_content = db.Column('reply_content', mysql.MEDIUMTEXT(collation=u'utf8mb4_unicode_ci'))


class Follows(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'follows'
    __table_args__ = {'schema': 'bbs'}

    forum_id = db.Column('forum_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    user_id = db.Column('user_id', VARCHAR(length=50), primary_key=True, nullable=False)
    status = db.Column('status', mysql.TINYINT(display_width=4), nullable=False)
    update_time = db.Column('update_time', mysql.BIGINT(display_width=20), nullable=False)


class Forums(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'forums'
    __table_args__ = {'schema': 'bbs'}

    forum_id = db.Column('forum_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    name = db.Column('name', VARCHAR(collation=u'utf8mb4_unicode_ci', length=100), nullable=False)
    description = db.Column('description', VARCHAR(collation=u'utf8mb4_unicode_ci', length=500), nullable=False)
    image = db.Column('image', mysql.MEDIUMTEXT(collation=u'utf8mb4_unicode_ci'))
    province_id = db.Column('province_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=20))
    major_id = db.Column('major_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=20))
    last_modify_time = db.Column('last_modify_time', mysql.BIGINT(display_width=20), nullable=False)


class Praises(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'praises'
    __table_args__ = {'schema': 'bbs'}

    topic_id = db.Column('topic_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    user_id = db.Column('user_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50), primary_key=True, nullable=False)
    status = db.Column('status', mysql.TINYINT(display_width=4), nullable=False)
    update_time = db.Column('update_time', mysql.BIGINT(display_width=20), nullable=False)


class Topics(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'topics'
    __table_args__ = {'schema': 'bbs'}

    topic_id = db.Column('topic_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    title = db.Column('title', VARCHAR(collation=u'utf8mb4_unicode_ci', length=100), nullable=False)
    content = db.Column('content', mysql.MEDIUMTEXT(collation=u'utf8mb4_unicode_ci'))
    pub_time = db.Column('pub_time', mysql.BIGINT(display_width=20), nullable=False)
    pub_area = db.Column('pub_area', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50))
    pub_client = db.Column('pub_client', VARCHAR(collation=u'utf8mb4_unicode_ci', length=20))
    images = db.Column('images', mysql.MEDIUMTEXT(collation=u'utf8mb4_unicode_ci'))
    status = db.Column('status', mysql.TINYINT(display_width=4), nullable=False)    #2置顶,1普通,0删除
    topic_level = db.Column('topic_level', mysql.TINYINT(display_width=4), nullable=False)   #1精华帖,0普通帖
    user_id = db.Column('user_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50), nullable=False)
    forum_id = db.Column('forum_id', mysql.INTEGER(display_width=11), nullable=False)
    last_modify_time = db.Column('last_modify_time', mysql.BIGINT(display_width=20), nullable=False)


class Views(db.Model):
    __bind_key__ = 'bbs'
    __tablename__ = 'views'
    __table_args__ = {'schema': 'bbs'}

    topic_id = db.Column('topic_id', mysql.INTEGER(display_width=11), primary_key=True, nullable=False)
    user_id = db.Column('user_id', VARCHAR(collation=u'utf8mb4_unicode_ci', length=50), primary_key=True, nullable=False)
    view_num = db.Column('view_num', mysql.INTEGER(display_width=11), nullable=False)
    update_time = db.Column('update_time', mysql.BIGINT(display_width=20), nullable=False)