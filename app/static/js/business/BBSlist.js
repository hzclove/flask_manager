var locaurl = location.search;
var theRequest = AnalyserUrl(locaurl, true);
var BBStype = theRequest.type;
console.log(BBStype);

var pageIndex = 1;
var pageSize = 6;
var pageTotal = 0;
var pageActive = 0;
var searchKey = "";

var get_url = "/topics";
var del_url = "/deleteTopic";


initAjax();

function initAjax() {
	$.ajax({
		type: 'get',
		url: get_url,
		data: {
			forumId: BBStype,
			keywords: searchKey,
			pageIndex: pageIndex,
			pageSize: pageSize
		},

		dataType: "json",
		success: function(data) {
			console.log(data);
			initDom(data);
		},
		error: function(data) {

			console.log("error");

		}

	});
}

function initDom(data) {
	pageTotal = data.msg.pagenum
	pageActive = data.msg.page;
	console.log(data);
	var list = data.msg.basics;
	$('#newsType').html(data.msg.forumName);
	//初始化列表
	init_list(list);
	//初始化翻页按钮
	init_listfooter(list.length);
}


function init_list(list) {
	$('#lv-body').empty();
	for (var i = 0; i < list.length; i++) {

		var listItem = $('<div class="lv-item media"></div>');
		$('#lv-body').append(listItem);

		//checkbox
		//		var checkboxs = $('<div class="checkbox pull-left"><label><input type="checkbox" value=""><i class="input-helper"></i></label></div>');
		//		checkboxs.appendTo(listItem);

		//小图片
		if (!list[i].profileUrl == "") {
			var smallImg_div = $('<div class="pull-left"></div>');
			smallImg_div.appendTo(listItem);

			var smallImg = $('<img class="lv-img-sm">');
			smallImg.attr("src", list[i].profileUrl);
			smallImg.appendTo(smallImg_div);
		}

		var mediabody = $('<div class="media-body"></div>');
		mediabody.appendTo(listItem);

		//标题
		var title = $('<div class="lv-title"></div');
		title.html(list[i].title);
		title.appendTo(mediabody);

		var comm = $('<small class="lv-small"></small>');
		comm.html(list[i].content);
		comm.appendTo(mediabody);

		var actid = $('<span class="hidden"> </span>');
		actid.html(list[i].topic_id);
		actid.addClass("articleId");
		actid.appendTo(mediabody);

		var xqid = $('<span > </span>');
		xqid.html(list[i].articleId);
		xqid.addClass("articleId");
		xqid.appendTo(mediabody);


		//标签
		var attrs = $('<ul class="lv-attrs"></ul>');
		attrs.appendTo(mediabody);

		//帖子类型user_level
//		2： 管理员
//		1： 马甲
//		0： 真实用户
		var levelstr = "";
		if (list[i].user_level == 0) {
			levelstr = "真实用户";
		} else if (list[i].user_level == 1) {
			levelstr = "马甲";
		} else if (list[i].user_level == 2) {
			levelstr = "管理员";
		}
		var userlevel = $('<li></li>');
		userlevel.html(levelstr);
		userlevel.appendTo(attrs);
		//nickname
		var nickname = $('<li></li>');
		nickname.html('昵称	：' + list[i].nickname);
		nickname.appendTo(attrs);

		//点赞数
		var thumbNum = $('<li></li>');
		thumbNum.html('点赞：' + list[i].praisenum);
		thumbNum.appendTo(attrs);

		//帖子类型
		var transmitNum = $('<li></li>');
		if (list[i].topic_level == 0) {
			transmitNum.html('普通帖');
		} else if (list[i].topic_level == 1) {
			transmitNum.html('精华贴')
		} else {
			transmitNum.html('其他');
		}
		transmitNum.appendTo(attrs);

		//添加操作按钮
		var todo = $('<ul class="lv-actions actions"><li><a href = "javascript:;" class ="lvh-search-trigger push">推</a></li><li><a href = "javascript:;" class ="lvh-search-trigger modify"><i class = "zmdi zmdi-edit"></i></a></li><li><a href="javascript:;" class ="lvh-search-trigger delete"><i class = "zmdi zmdi-delete" ></i></a></li></ul>');
		todo.appendTo(mediabody);

	}
}

function init_listfooter(mun) {
	$('#lv-pagination').empty();

	var prve = $('<li> <a  href="javascript:;" class="prove"><i class="zmdi zmdi-chevron-left"></i></a></li>');

	$('#lv-pagination').append(prve);

	for (var i = 0; i < pageTotal; i++) {
		var oli = $('<li></li>');
		if ((i + 1) == pageActive) {
			oli.addClass("active");
		}

		$('#lv-pagination').append(oli);
		var oa = $('<a href="javascript:;"></a>');
		oa.html(i + 1);
		oa.addClass("page")
		oa.appendTo(oli);
	}

	var next = $('<li><a href="javascript:;" class="next"><i class="zmdi zmdi-chevron-right"></i></a></li>');
	$('#lv-pagination').append(next);
}

//删除文章
function deleteNews(articleId) {
	$.ajax({
		type: 'get',
		url: del_url,
		data: {
			topicId: articleId
		},
		dataType: "json",
		success: function(data) {
			if (data.result == 'true') {
				initAjax();
			}
		},
		error: function(data) {

			console.log("error");

		}

	});
}

var BBS = (function() {
	function showalert(str) {
		alert(str);
	}

	var bbsfun = {

		add: function(articleType) {
			location.href = "BBSarticle?type=" + BBStype + "&modify=add";
			//console.log('add');
		},
		modify: function(articleId) {
			location.href = "BBSarticle?type=" + BBStype + "&modify=modify&articleId=" + articleId;
			//+"&pageIndex="pageIndex;
			console.log('modify');
		},
		see: function(articleId) {
			location.href = "BBSarticle?type=" + BBStype + "&modify=see&articleId=" + articleId;
			//+"&pageIndex="pageIndex;
			console.log('see');
		},
		push: function(articleId) {
			location.href="push?articleId="+articleId+"&modify=add";
			console.log('push');
		},
		del: function(articleId) {
			deleteNews(articleId);
			console.log('articleId:' + articleId);
		},
		up: function(articleId) {
			console.log('articleId');
		},
		down: function(articleId) {
			console.log('articleId');
		},
		prove: function() {
			if (pageIndex > 1) {
				pageIndex--;
			}
			initAjax();
		},
		next: function() {
			if (pageIndex < pageTotal) {
				pageIndex++;
			}
			initAjax();
		},
		goPage: function(page) {
			pageIndex = page;
			initAjax();
		},
		search: function(key) {
			searchKey = key;
			//			get_url='/searchBBS';
			initAjax();
		}
	}
	return bbsfun;
})();