# -*- coding: utf8 -*-

#管理员uid和马甲uid
manager_ids = ['f016173095943457845991e2531250cb', 'e612c770c7ae7550abefc7c252113a8e']
majia_ids = ['47d44eb236f1621cf945262f1a0b1ead', '3cdf3b40b039efd6b1bba0f7cd2a1b70', '27cae141df367c9bc6afd7e34b2085c8', '60b5151505079579b465d2875be84b5e',
            '200c3baadf956113dfeb8c3f4a3e2067', '7199bda95ab229bfc53f80fbc55ef48d', '06825a5f28c60e112d1b97422e4a18e7', '5756bdf8f00a5bd45032ae44bdcc8437',
            'e587b89a92a4051adc05f749af40d615', '3470b5acb33a6b44ef6b027216463aa3', 'b844106e64464722ee2176f0cec20252', 'fb843123e0c7974bfdbeac3c89a951ea',
            '02af00392bd78a397766aef3d7828e28', 'bd57ed6d7e1a6f789a91cdb844a21e37', '0c1cb68e13bdb8e700bf98904b50d14b', '7a21e8acf858af1551e9060712f42a04',
            'a0f0cc6ca8e2598fcc205fb7de021d07', 'd355e8c765cceae691f29d77a276b907', '32fc9ffda42c7038667bdefdcdbbb259', '1050054acf5db5d8433d61d21e07a6bb',
            '80647f7ed97997e294e9931e30313ea6', '3dc71794859f2e7eb6af730647aee15a']


#资讯基本信息节点
class NewsBasicNode:
	def __init__(self, basic, provinces=None, majors=None):
		self.basic = basic
		self.provinces = provinces
		self.majors = majors

	def pack_res(self):
		json_basic = {key: value for key,value in self.basic.__dict__.items() if key != '_sa_instance_state'}
		if self.provinces is None:
			provinces = {p.province_id: p.province_name for p in self.provinces}
			provinces['all'] = '全部'
			majors = {m.major_id: m.major_name for m in self.majors}
			majors['all'] = '全部'
			json_basic['provinceName'] = provinces[self.basic.provinceId]
			json_basic['majorName'] = majors[self.basic.majorId]
	
		return json_basic


#资讯详细信息节点:
class NewsDetailNode:
	def __init__(self, detail, majorName, provinceName):
		json_detail = {key: value for key,value in detail.NewsBasic.__dict__.items() if key != '_sa_instance_state'}
		json_detail['createdTime'] = str(detail.NewsBasic.createdTime)[0:-3]
		json_detail['expiredAt'] = str(detail.NewsBasic.expiredAt)[0:-3]
		json_detail['author'] = detail.NewsDetail.author
		json_detail['content'] = detail.NewsDetail.content
		json_detail['provinceId'] = provinceName
		json_detail['majorId'] = majorName
		self.json_detail = json_detail


	def pack_res(self):
		return self.json_detail



#资讯评论信息节点:
class CommentNode:
	def __init__(self, comment):
		json_comment = {key:value for key,value in comment.NewsComment.__dict__.items() if key != '_sa_instance_state'}
		json_comment['nickname'] = comment.nickname
		json_comment['profileUrl'] = comment.profileUrl
		json_comment['parentcomment'] = comment.parentcomment
		json_comment['parentuser'] = comment.parentuser
		if comment.NewsComment.uid in manager_ids:
			json_comment['user_level'] = 2
		elif comment.NewsComment.uid in majia_ids:
			json_comment['user_level'] = 1
		else:
			json_comment['user_level'] = 0
		self.json_comment = json_comment

	def pack_res(self):
		return self.json_comment

#bbs帖子信息节点:
class TopicNode:
	def __init__(self, topic, users):
		json_topic = {key:value for key,value in topic.Topics.__dict__.items() if key != '_sa_instance_state'}
		json_topic['praisenum'] = topic.praisenum
		json_topic['commentnum'] = topic.commentnum
		json_topic['forum'] = topic.name
		if topic.Topics.user_id in users:
			user = users[topic.Topics.user_id]
			json_topic['nickname'] = user[0]
			json_topic['profileUrl'] = user[1]
		else:
			json_topic['nickname'] = None
			json_topic['profileUrl'] = None
		if topic.Topics.user_id in manager_ids:
			json_topic['user_level'] = 2
		elif topic.Topics.user_id in majia_ids:
			json_topic['user_level'] = 1
		else:
			json_topic['user_level'] = 0
		self.json_topic = json_topic

	def pack_res(self):
		return self.json_topic


#bbs评论信息节点:
class TopicCommentNode:
	def __init__(self, comment, users):
		json_comment = {key:value for key,value in comment.__dict__.items() if key != '_sa_instance_state'}
		json_comment['nickname'] = comment.user_name
		if json_comment['reply_id'] == None:
			json_comment['reply_id'] = 0
		if comment.user_id in users:
			user = users[comment.user_id]
			json_comment['profileUrl'] = user[1]
		else:
			json_comment['profileUrl'] = None
		if comment.user_id in manager_ids:
			json_comment['user_level'] = 2
		elif comment.user_id in majia_ids:
			json_comment['user_level'] = 1
		else:
			json_comment['user_level'] = 0
		self.json_comment = json_comment

	def pack_res(self):
		self.json_comment['floor_no'] = self.floor_no
		return self.json_comment
