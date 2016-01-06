#!/usr/bin/python
# -*- coding: utf8 -*-
from __future__ import division
from flask import render_template, flash, redirect, session, url_for, request, g, jsonify
from sqlalchemy.orm import aliased
from app import app, db
from .models import *
from .util import *
import datetime, math

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/newslist')
def newslist():
    return render_template('newslist.html')

@app.route('/article')
def article():
    return render_template('article.html')

@app.route('/upfile')
def upfile():
    return render_template('upfile.html')

@app.route('/BBSlist')
def BBSlist():
    return render_template('BBSlist.html')

@app.route('/BBSarticle')
def BBSarticle():
    return render_template('BBSarticle.html')

@app.route('/search')
def search():
    searchtype = request.args.get('type')
    keywords = request.args.get('keywords').split(' ')
    page = request.args.get('pageIndex', 1, type=int)
    perpage = request.args.get('pageSize', 10, type=int)
    results = []
    #查询资讯的信息，根据关键字查询（content，instruction）
    if searchtype == 'news':
        for keyword in keywords:
            results.extend(NewsBasic.query.join(NewsDetail, NewsDetail.id == NewsBasic.articleId) \
                .filter(or_(NewsDetail.content.like('%'+keyword+'%'), NewsBasic.instruction.like('%'+keyword+'%'))).all())
        pagenum = int(math.ceil(len(results)/float(perpage)))
        try:
            #分页返回
            results = results[(page-1)*perpage:page*perpage] if page < pagenum else results[(page-1)*perpage:]
        except:
            results = results[0:perpage] if len(results) > perpage else results
        return jsonify({'result':'true', 'msg':{'page':page, 'pagenum':pagenum, 'basics':[NewsBasicNode(b).pack_res() for b in results]}})
    #查询社区信息，根据关键字（content,title）    
    elif searchtype == 'bbs':
        for keyword in keywords:
            results.extend(Topics.query.filter(or_(Topics.content.like('%'+keyword+'%'), Topics.title.like('%'+keyword+'%'))).all())
        pagenum = int(math.ceil(len(results)/float(perpage)))
        try:
            #分页返回
            results = results[(page-1)*perpage:page*perpage] if page < pagenum else results[(page-1)*perpage:]
        except:
            results = results[0:perpage] if len(results) > perpage else results
        #
        topics = [{key:value for key,value in topic.__dict__.items() if key != '_sa_instance_state'} for topic in results]
        return jsonify({'result':'true', 'msg':{'page':page, 'pagenum':pagenum, 'topics':topics}})



#用户的登录
@app.route('/accounts')
def accounts():
    managers = [{'user_id':a.uid, 'user_name':a.nickname} for a in Account.query.filter(Account.uid.in_(manager_ids)).all()]
    majias = [{'user_id':a.uid, 'user_name':a.nickname} for a in Account.query.filter(Account.uid.in_(majia_ids)).all()]
    return jsonify({'result':'true', 'msg':{'managers':managers, 'majias':majias}})
#     return jsonify({
#     "msg":{
#         "majias":[
#             {
#                 "user_id":"60b5151505079579b465d2875be84b5e",
#                 "user_name":"Judith"
#             },
#             {
#                 "user_id":"47d44eb236f1621cf945262f1a0b1ead",
#                 "user_name":"喂！把我带回家"
#             },
#             {
#                 "user_id":"27cae141df367c9bc6afd7e34b2085c8",
#                 "user_name":"冬小鹿"
#             },
#             {
#                 "user_id":"3cdf3b40b039efd6b1bba0f7cd2a1b70",
#                 "user_name":"陌颜"
#             }
#         ],
#         "managers":[
#             {
#                 "user_id":"f016173095943457845991e2531250cb",
#                 "user_name":"小袋"
#             },
#             {
#                 "user_id":"e612c770c7ae7550abefc7c252113a8e",
#                 "user_name":"袋妹"
#             }
#         ]
#     },
#     "result":"true"
# })


#查询资讯帖子信息
@app.route('/news')
def newsbasic():
    articleType = request.args.get('newsType')
    page = request.args.get('pageIndex', 1, type=int)
    perpage = request.args.get('pageSize', 10, type=int)
    keywords = request.args.get('keywords')
    #资讯信息查询，按类型查询(COMMEN_QUESTION，DAILY_CHEESE，EXAMINATION_ROAD，OFFICIAL_NEWS，SIGN_UP_INFO)
    if keywords:
        keywords = keywords.split(' ')
        basics = []
        for keyword in keywords:
            basics.extend(NewsBasic.query.join(NewsDetail, NewsDetail.id == NewsBasic.articleId) \
                .filter(or_(NewsDetail.content.like('%'+keyword+'%'), NewsBasic.instruction.like('%'+keyword+'%')), NewsBasic.articleType == articleType).order_by(NewsBasic.id.desc()).all())
        pagenum = int(math.ceil(len(basics)/perpage))
        try:
            basics = basics[(page-1)*perpage:page*perpage] if page < pagenum else basics[(page-1)*perpage:]
        except:
            basics = basics[0:perpage] if len(basics) > perpage else basics
    else:
        query = NewsBasic.query.filter(NewsBasic.articleType == articleType).order_by(NewsBasic.id.desc()).paginate(page, perpage, False)
        basics = query.items
        pagenum = query.pages

    for b in basics:
        if b.majorId != 'all':
                b.majorId = str(b.majorId).split('_')[1]
    province_ids = [b.provinceId for b in basics if b.provinceId != 'all']
    provinces = Province.query.filter(Province.province_id.in_(province_ids)).all() if len(province_ids) > 0 else []
    major_ids = [b.majorId for b in basics if b.majorId != 'all']
    majors = Major.query.with_entities(Major.major_name, Major.major_id).filter(Major.major_id.in_(major_ids)).distinct() if len(major_ids) > 0 else []
    basics = [NewsBasicNode(b, provinces, majors) for b in basics]
    
    return jsonify({'result':'true', 'msg':{'articleType':articleType, 'page':page, 'pagenum':pagenum, 'basics':[b.pack_res() for b in basics]}})

#查询资讯对应帖子详细信息
@app.route('/detail')
def newsdetail():
    news_id = request.args.get('news_id', 1, type=int)
    detail = db.Query([NewsBasic, NewsDetail], db.session()).filter(NewsBasic.id == news_id, NewsBasic.articleId == NewsDetail.id).first()
    if detail.NewsBasic.provinceId != 'all':
        provinceName = db.Query(Province.province_name, db.session()).filter(Province.province_id == detail.NewsBasic.provinceId).scalar()
        if detail.NewsBasic.majorId != 'all':
            majorId = str(detail.NewsBasic.majorId).split('_')[1]
            majorName = db.Query(Major.major_name, db.session()).filter(Major.major_id == majorId, Major.province_name == provinceName).first()[0]
        else:
            majorName = '全部'
    else:
        provinceName = '全部'
        majorName = '全部'
    return jsonify({'result':'true', 'msg':NewsDetailNode(detail, majorName, provinceName).pack_res()})


#修改，插入资讯信息
@app.route('/modify', methods=['POST'])
def modify():
    news_id = int(request.form['id'])
    form = request.form
    expiredTime = datetime.datetime.strptime(form['expiredAt'], "%Y-%m-%d %H:%M")
    createdTime = datetime.datetime.strptime(form['createdTime'], "%Y-%m-%d %H:%M")
    if form['provinceId'] == '全部':
        provinceId = 'all'
        majorId = 'all'
    else:
        provinceId = Province.query.filter(Province.province_name == form['provinceId']).first().province_id
        if form['majorId'] == '全部':
            majorId = 'all'
        else:
            majorId = provinceId + '_' + Major.query.filter(Major.major_name == form['majorId'], Major.province_name == form['provinceId']).first().major_id
    # 修改
    if news_id > 0:
        newsbasic = NewsBasic.query.get(news_id)
        newsdetail = NewsDetail.query.get(newsbasic.articleId)

        newsbasic.articleType = form['articleType']
        newsbasic.attachUrl = form['attachUrl']
        newsbasic.instruction = form['instruction']
        newsbasic.briefText = form['briefText']
        newsbasic.panelUrl = form['panelUrl']
        newsbasic.handPicked = int(form['handPicked'])
        newsbasic.majorId = majorId
        newsbasic.provinceId = provinceId
        newsbasic.expiredAt = expiredTime
        newsbasic.createdTime = createdTime
        
        newsdetail.author = form['author']
        newsdetail.content = form['content']
        db.session.commit()

        return jsonify({'result':'true', 'msg':{'news_id':newsbasic.id}})

    # 新增
    detail = NewsDetail(author=form['author'], content=form['content'])
    db.session.add(detail)
    db.session.commit()
    articleId = detail.id
    
    basic = NewsBasic(articleId=articleId, articleType=form['articleType'], provinceId=provinceId, majorId=majorId, \
        instruction=form['instruction'], attachUrl=form['attachUrl'], createdTime=createdTime, \
        expiredAt=expiredTime, briefText=form['briefText'], panelUrl=form['panelUrl'], handPicked=int(form['handPicked']))
    db.session.add(basic)
    db.session.commit()
    return jsonify({'result':'true', 'msg':{'news_id':basic.id}})

#删除资讯帖子
@app.route('/deleteNews')
def deleteNews():
    news_id = request.args.get('newsId', type=int)
    basic = NewsBasic.query.get(news_id)
    detail = NewsDetail.query.get(basic.articleId)
    db.session.delete(basic)
    db.session.delete(detail)
    db.session.commit()
    return jsonify({'result':'true'})

#获取所有的专业
@app.route('/majors', methods=['GET','POST'])
def getmajors():
    province_name = request.args.get('province_name','')
    majors = Major.query.with_entities(Major.major_name).filter(Major.province_name == province_name).distinct()
    major_names = ['全部'] + [m.major_name for m in majors]
    return jsonify({'result':'true', 'msg': major_names})

#获取所有的省份
@app.route('/provinces')
def getprovinces():
    provinces = Province.query.all()
    province_names = ['全部']+[p.province_name for p in provinces]
    return jsonify({'result':'true', 'msg':province_names})

#获取资讯评论信息
@app.route('/comments')
def getcomments():
    articleId = request.args.get('articleId', 1, type=int)
    page = request.args.get('page', 1, type=int)
    perpage = request.args.get('perpage', 10, type=int)

    #子查询方法
    ParentComment = aliased(NewsComment)
    ParentUser = aliased(Account)
    query = db.Query([NewsComment, Account.nickname, Account.profileUrl, ParentComment.content.label('parentcomment'), \
        ParentUser.nickname.label('parentuser')],db.session()).filter(NewsComment.articleId == articleId) \
        .outerjoin(Account, Account.uid == NewsComment.uid).outerjoin(ParentComment, ParentComment.id == NewsComment.parentId). \
        outerjoin(ParentUser, ParentUser.uid == ParentComment.uid).order_by(NewsComment.id).paginate(page, perpage, False)
    comments = query.items
    pagenum = query.pages

    return jsonify({'result':'true', 'msg':{'comments':[CommentNode(c).pack_res() for c in comments]}, 'page':page, 'pagenum':pagenum})
    
@app.route('/deleteComment')
def deleteComment():
    comment_id = request.args.get('commentId', type=int)
    comment = NewsComment.query.get(comment_id)
    comment.content = '原评论已删除'
    db.session.commit()
    return jsonify({'result':'true'})


@app.route('/addComment', methods=['POST'])
def addComment():
    if request.form['user_id']:
        articleId = int(request.form['articleId'])
        parentId = int(request.form['parentId'])
        uid = request.form['user_id']
        content = request.form['content']
        comment = NewsComment(uid=uid, content=content, articleId=articleId, parentId=parentId)
        db.session.add(comment)
        db.session.commit()
        return jsonify({'result':'true'})
    else:
        return jsonify({'result':'false', 'msg':'The request does not have a user_id'})


@app.route('/forums')
def forums():
    forums = Forums.query.all()
    forums = [{'forumId':f.forum_id, 'forumName':f.name} for f in forums]
    return jsonify({'result':'true', 'msg':forums})

#获取指定板块下的所有帖子
@app.route('/topics')
def topics():
    forum_id = request.args.get('forumId', type=int)
    page = request.args.get('pageIndex', 1, type=int)
    perpage = request.args.get('pageSize', 10, type=int)
    keywords = request.args.get('keywords')

    p = Praises.query.filter(Praises.status == 1).subquery()
    c = Comments.query.filter(Comments.status == 1).subquery()
    query = db.Query([Topics, func.count(p.c.user_id.distinct()).label('praisenum'), \
        func.count(c.c.comment_id.distinct()).label('commentnum'), Forums.name], db.session()) \
        .filter(Topics.forum_id == forum_id, Topics.status >= 1) \
        .outerjoin(p, p.c.topic_id == Topics.topic_id) \
        .outerjoin(c, c.c.topic_id == Topics.topic_id) \
        .join(Forums, Forums.forum_id == Topics.forum_id) \
        .group_by(Topics.topic_id).order_by(Topics.last_modify_time.desc())

    if keywords:
        keywords = keywords.split(' ')
        topics = []
        for keyword in keywords:
            topics.extend(query.filter(or_(Topics.content.like('%'+keyword+'%'), Topics.title.like('%'+keyword+'%'))).all())
        pagenum = int(math.ceil(len(topics)/perpage))
        try:
            topics = topics[(page-1)*perpage:page*perpage] if page < pagenum else topics[(page-1)*perpage:]
        except:
            topics = topics[0:perpage] if len(topics) > perpage else topics
        
    else:
        query = query.paginate(page, perpage, False)

        topics = query.items
        pagenum = query.pages


    user_ids = [t.Topics.user_id for t in topics]
    users = {a.uid:(a.nickname, a.profileUrl) for a in Account.query.filter(Account.uid.in_(user_ids)).all()}
    forumName = Forums.query.filter(Forums.forum_id == forum_id).first().name


    return jsonify({'result':'true', 'msg':{'forumName':forumName, 'page':page, 'pagenum':pagenum, 'basics':[TopicNode(t, users).pack_res() for t in topics]}})
#获取某个特定的帖子
@app.route('/topic')
def topic():
    topic_id = request.args.get('topicId', type=int)
    p = Praises.query.filter(Praises.status == 1).subquery()
    c = Comments.query.filter(Comments.status == 1).subquery()
    topic = db.Query([Topics, func.count(p.c.user_id.distinct()).label('praisenum'), func.count(c.c.comment_id.distinct()).label('commentnum'), Forums.name], db.session()) \
        .filter(Topics.topic_id == topic_id) \
        .outerjoin(p, p.c.topic_id == Topics.topic_id) \
        .outerjoin(c, c.c.topic_id == Topics.topic_id) \
        .join(Forums, Forums.forum_id == Topics.forum_id) \
        .group_by(Topics.topic_id).order_by(Topics.last_modify_time.desc()).first()
    users = {a.uid:(a.nickname, a.profileUrl) for a in Account.query.filter(Account.uid == topic.Topics.user_id).all()}
    return jsonify({'result':'true', 'msg':TopicNode(topic, users).pack_res()})
#获取帖子评论信息
@app.route('/topicComments')
def topicComments():
    topic_id = request.args.get('topicId', type=int)
    page = request.args.get('page', 1, type=int)
    perpage = request.args.get('perpage', 10, type=int)
    query = Comments.query.filter(Comments.topic_id == topic_id).order_by(Comments.comment_id).paginate(page, perpage, False)
    comments = query.items
    pagenum = query.pages
    user_ids = [c.user_id for c in comments]
    users = dict()
    if user_ids:
        users = {a.uid:(a.nickname, a.profileUrl) for a in Account.query.filter(Account.uid.in_(user_ids)).all()}
    # comments = [c for c in comments if c.user_id in users]
    start_floor_no = (page-1) * perpage
    commentNodes = []
    for c in comments:
        commentNodes.append(TopicCommentNode(c, users))
        start_floor_no += 1
        commentNodes[-1].floor_no = start_floor_no
    return jsonify({'result':'true', 'msg':{'comments':[c.pack_res() for c in commentNodes], 'page':page, 'pagenum':pagenum}})

@app.route('/deleteTopic')
def deleteTopic():
    topic_id = request.args.get('topicId', type=int)
    Topics.query.filter(Topics.topic_id == topic_id).update({Topics.status:0})
    Comments.query.filter(Comments.topic_id == topic_id).update({Comments.status:0})
    db.session.commit()
    return jsonify({'result':'true'})


@app.route('/addtopick', methods=['POST'])
def addtopick():
    topic_id = int(request.form['topic_id'])
    if topic_id == -1:
        if request.form['user_id']:
            topic = Topics(title=request.form['title'], content=request.form['content'], pub_time=func.unix_timestamp(), images=request.form['images'],
                            status=int(request.form['status']), topic_level=int(request.form['topic_level']), user_id=request.form['user_id'],
                            forum_id=int(request.form['forum_id']), last_modify_time=func.unix_timestamp())
            db.session.add(topic)
            db.session.commit()
            return jsonify({'result':'true', 'msg':{'topic_id':topic.topic_id}})
        else:
            return jsonify({'result':'false', 'msg':'The request does not have a user_id'})

    else:
        topic = Topics.query.get(topic_id)
        if topic.user_id in manager_ids or topic.user_id in majia_ids:
            if request.form['user_id']:
                topic.user_id = request.form['user_id']
            else:
                return jsonify({'result':'false', 'msg':'The request does not have a user_id'})
        topic.title = request.form['title']
        topic.content = request.form['content']
        topic.images = request.form['images']
        topic.status = request.form['status']
        topic.topic_level = request.form['topic_level']
        topic.last_modify_time = func.unix_timestamp()
        if topic.forum_id != request.form['forum_id']:
            comments = Comments.query.filter(Comments.topic_id == topic_id).all()
            for c in comments:
                c.forum_id = request.form['forum_id']
        topic.forum_id = request.form['forum_id']
        db.session.commit()
        return jsonify({'result':'true', 'msg':{'topic_id':topic.topic_id}})
        



@app.route('/addTopicComment', methods=['POST'])
def addTopicComment():
    if request.form['user_id']:
        comment = Comments(content=request.form['content'], pub_time=func.unix_timestamp(), images=request.form['images'], status=1, \
            topic_id=request.form['topic_id'], forum_id=request.form['forum_id'], user_id=request.form['user_id'], user_name=request.form['user_name'])
        db.session.add(comment)
        db.session.commit()
        return jsonify({'result':'true'})
    else:
        return jsonify({'result':'false', 'msg':'The request does not have a user_id'})


@app.route('/replyComment', methods=['POST'])
def replyComment():
    if request.form['user_id']:
        topic_id = int(request.form['topic_id'])
        reply_id = int(request.form['reply_id'])
        parentcomment = Comments.query.get(reply_id)
        reply_floor_no = db.Query(func.count(Comments.comment_id), db.session()).filter(Comments.topic_id == topic_id, Comments.comment_id <= reply_id).first()[0]
        comment = Comments(content=request.form['content'], pub_time=func.unix_timestamp(), images=request.form['images'], status=1, \
            topic_id=topic_id, forum_id=int(request.form['forum_id']), user_id=request.form['user_id'], user_name=request.form['user_name'], \
            reply_id=reply_id, reply_floor_no=reply_floor_no, reply_user_id=parentcomment.user_id, reply_user_name=parentcomment.user_name, \
            reply_content=parentcomment.content)
        db.session.add(comment)
        db.session.commit()
        return jsonify({'result':'true'})
    else:
        return jsonify({'result':'false', 'msg':'The request does not have a user_id'})

@app.route('/modifyTopicComment', methods=['POST'])
def modifyTopicComment():
    comment_id = request.form['comment_id']
    content = request.form['content']
    comment = Comments.query.get(comment_id)
    if comment.user_id in manager_ids or comment.user_id in majia_ids:
        comment.content = content
        db.session.commit()
        return jsonify({'result':'true'})
    else:
        return jsonify({'result':'false', 'msg':'user_id of this comment is true user'})

@app.route('/deleteTopicComment')
def deleteTopicComment():
    comment_id = request.args.get('commentId', type=int)
    comment = Comments.query.get(comment_id)
    comment.content = '原评论已删除'
    db.session.commit()
    return jsonify({'result':'true'})
