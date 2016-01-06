var locaurl = location.search;
var theRequest = AnalyserUrl(locaurl, true);
var news_type = theRequest.type;

var pageIndex = 1;
if(theRequest.pageIndex!=undefined){
	pageIndex=theRequest.pageIndex;
}
var pageSize = 6;
var pageTotal = 0;
var pageActive = 0;

var searchKey="";
var get_url = "/news";
var del_url = "/deleteNews";
initAjax();

function initAjax() {
	$.ajax({
		type: 'get',
		url: get_url,
		data: {
			newsType: news_type,
			keywords:searchKey,
			pageIndex: pageIndex,
			pageSize: pageSize
		},

		dataType: "json",
		success: function(data) {

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
	console.log(data.msg.articleType);

	$('#newsType').html(articleType(data.msg.articleType));
	console.log(data);
	var list = data.msg.basics;

	//初始化列表
	init_list(list);
	//初始化翻页按钮
	init_listfooter(list.length);
}

function articleType(str) {
	switch (str) {
		case 'DAILY_CHEESE':
			return '每日芝士';
			break;
		case 'EXAMINATION_ROAD':
			return '自考路上';
			break;
		case 'SIGN_UP_INFO':
			return '报考讯息';
			break;
		case 'OFFICIAL_NEWS':
			return '新闻看点';
			break;
		case 'COMMEN_QUESTION':
			return '常见问题';
			break;
		default:
			return str;
			break;
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

function init_list(list) {
	$('#lv-body').empty();
	for (var i = 0; i < list.length; i++) {

		var listItem = $('<div class="lv-item media"></div>');
		$('#lv-body').append(listItem);

		//checkbox
		//		var checkboxs = $('<div class="checkbox pull-left"><label><input type="checkbox" value=""><i class="input-helper"></i></label></div>');
		//		checkboxs.appendTo(listItem);

		//小图片
		if (!list[i].panelUrl == "") {
			var smallImg_div = $('<div class="pull-left"></div>');
			smallImg_div.appendTo(listItem);

			var smallImg = $('<img class="lv-img-sm">');
			smallImg.attr("src", list[i].panelUrl);
			smallImg.appendTo(smallImg_div);
		}

		var mediabody = $('<div class="media-body"></div>');
		mediabody.appendTo(listItem);

		//标题
		var title = $('<div class="lv-title"></div');
		title.html(list[i].instruction);
		title.appendTo(mediabody);

		var actid = $('<span class="hidden"> </span>');
		actid.html(list[i].id);
		actid.addClass("articleId");
		actid.appendTo(mediabody);
		
		var xqid = $('<span > </span>');
		xqid.html(list[i].articleId);
		xqid.addClass("articleId");
		xqid.appendTo(mediabody);
		

		//标签
		var attrs = $('<ul class="lv-attrs"></ul>');
		attrs.appendTo(mediabody);

		//点赞数
		var thumbNum = $('<li></li>');
		thumbNum.html('点赞：' + list[i].thumbNum);
		thumbNum.appendTo(attrs);

		//转发数
		var transmitNum = $('<li></li>');
		transmitNum.html('转发：' + list[i].transmitNum);
		transmitNum.appendTo(attrs);

		//添加操作按钮
		var todo = $('<ul class="lv-actions actions"><li><a href = "javascript:;" class ="lvh-search-trigger push">推</a></li><li><a href = "javascript:;" class ="lvh-search-trigger modify"><i class = "zmdi zmdi-edit"></i></a></li><li><a href="javascript:;" class ="lvh-search-trigger delete"><i class = "zmdi zmdi-delete" ></i></a></li></ul>');
		todo.appendTo(mediabody);

	}
}

//删除文章
function deleteNews(articleId) {
	$.ajax({
		type: 'get',
		url: del_url,
		data: {
			newsId: articleId
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

var News = (function() {
	function showalert(str) {
		alert(str);
	}

	var newsfun = {

		add: function(articleType) {
			location.href="article?type="+news_type+"&modify=add";
			//console.log('add');
		},
		modify: function(articleId) {
			location.href="article?type="+news_type+"&modify=modify&articleId="+articleId+"&pageIndex="+pageIndex;
			console.log('modify');
		},
		push: function(articleId) {
			location.href="push?articleId="+articleId+"&modify=add";
			console.log('push');
		},
		see: function(articleId){
			location.href="article?type="+news_type+"&modify=see&articleId="+articleId+"&pageIndex="+pageIndex;
			console.log('see');
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
		search:function(key){
			searchKey=key;
//			get_url="/searchNews";
			initAjax();
		}
	}
	return newsfun;
})();