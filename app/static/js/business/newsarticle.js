var locaurl = location.search;
var theRequest = AnalyserUrl(locaurl, true);
var news_type = theRequest.type;
var modify = theRequest.modify;

var PageSize = 3; //评论页面大小
var PageIndex = 1; //评论页面序号
if (theRequest.pageIndex != undefined) {
	PageIndex = theRequest.pageIndex;
}
console.log(PageIndex);
var PageTotal = 0;

var provinceUrl = "/provinces";
var majorUrl = "/majors";
var articlePostUrl = "/modify"
var articleGetUrl = "/detail";
var commentGetUrl = "/comments";
var commentPostUrl = "/addComment";
var commentdelurl = "/deleteComment";

var accountsGetUrl = "/accounts";

var ConnentId = 0;

var user_name = ""; //编辑身份
var user_id = "";

var Ischeck = true; //是否有轮播图 check
var Article = {
	articleId: -1,
	articleType: news_type, //文章类型 /*dfsdf*/
	attachUrl: "", //轮播图
	author: "口袋学习", //作者   必填
	briefText: "", //摘要
	//	commentNum: 0, //评论数目   不需要
	content: "", //内容
	createdTime: "2015-11-20 12:11",
	expiredAt: "2015-11-20 12:11",
	handPicked: 0, //是否有lunbo
	id: -1, //文章ID
	instruction: "",
	majorId: "全部",
	panelUrl: " ",
	provinceId: "全部",
	//	thumbNum: 0,
	//	transmitNum: 0

}
var articleMsg = "";

$('.input-group').hide();
switch (modify) {
	case 'add':
		addArticle();
		break;
	case 'modify':
		modifyArticle();
		break;
	case 'see':
		seeArticle();
		break;
}

function addArticle() {
	InitAdd();
	Article.id = -1;

}

function seeArticle() {
	Article.id = theRequest.articleId;
	console.log(Article.id);
	$('#backList').show();
	GetArticle(Article.id);


}

function modifyArticle() {
	Article.id = theRequest.articleId;
	//	InitModify();
	GetArticle(Article.id);
}


function GetComment(id) {

	$.ajax({
		type: 'get',
		url: commentGetUrl,
		dataType: "json",
		data: {
			articleId: id,
			page: PageIndex,
			perpage: PageSize
		},
		success: function(data) {
			ShowComment(data);
		},
		error: function(data) {
			console.log("GetArticle error");
		}
	});
}

function GetArticle(id) {
	$.ajax({
		type: 'get',
		url: articleGetUrl,
		dataType: "json",
		data: {
			news_id: id
		},
		success: function(data) {
			ShowArticle(data.msg);
		},
		error: function(data) {
			console.log("GetArticle error");
		}
	});
}

function ProvinceAdd() {
	$.ajax({
		type: 'get',
		url: provinceUrl,
		dataType: "json",
		success: function(data) {
			console.log(data);
			for (var i = 0; i < data.msg.length; i++) {
				var opt = $('<option></option>');
				opt.html(data.msg[i]);
				opt.attr('value', data.msg[i]);
				$('#ProvinceSelect').append(opt);
			}
			if (Article.provinceId != undefined) {
				$("#ProvinceSelect").val(Article.provinceId);
				MajorAdd(Article.provinceId);
			}

			console.log("ProvinceSelect add over ");
			var opt = $('<option></option>');
			opt.html("全部");
			opt.attr('value', "全部");
			$('#MajorSelect').append(opt);


		},
		error: function(data) {
			console.log("province error");
		}
	});
}

//保存 
$("body").on("click", "#modifybtn", function() {
	if ($('#modifybtn').html() == '保存') {
		saveArticle();
		console.log(Article);
		postArticle();

		$('#modifybtn').attr('disabled', 'disabled');
	} else if ($('#modifybtn').html() == '修改') {
		location.href = "article?type=" + news_type + "&modify=modify&articleId=" + Article.id + "&pageIndex=" + PageIndex;
	}

});

//返回列表页
$("body").on("click", "#backList", function() {
	location.href = "newslist?type=" + news_type + "&pageIndex=" + PageIndex;
});

function MajorAdd(provincename) {
	$('#MajorSelect').empty();
	var pstr = provincename;
	if (pstr == "全部") {
		var opt = $('<option></option>');
		opt.html("全部");
		opt.attr('Value', "全部");
		$('#MajorSelect').append(opt);
		return;
	}
	$.ajax({
		type: 'get',
		url: majorUrl,
		data: {
			province_name: pstr
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			for (var i = 0; i < data.msg.length; i++) {
				var opt = $('<option></option>');
				opt.html(data.msg[i]);
				opt.attr('Value', data.msg[i]);
				$('#MajorSelect').append(opt);
			}

			if (Article.majorId != undefined) {
				$("#MajorSelect").val(Article.majorId);
			}
		},
		error: function(data) {
			console.log("province error");
		}
	});
}
$("body").on("change", "#ProvinceSelect", function() {
	MajorAdd($(this).val());
});

$('#Islunbo').click(function() {
	if (Ischeck) {
		Ischeck = false;
		$('#luboimg').hide();
	} else {
		Ischeck = true;
		$('#luboimg').show();
	}
});


$("body").on("change", "#articleTypeEdit", function() {
	news_type = $(this).val();
	Article.articleType = $(this).val();
});

//评论回复
$("body").on("click", ".repbtn", function() {
	$('.media').find('.fg-line').hide();
	$(this).parents('.media').find('.fg-line').show();
	ConnentId = $(this).parents('.media').find('.commentId').html();

});

//删除评论
$("body").on("click", ".delbtn", function() {
	ConnentId = $(this).parents('.media').find('.commentId').html();
	delConnect(ConnentId);

});


$("body").on("click", ".addComment", function() {
	console.log($(this).text());
	if ($(this).text() == "发表") {
		ConnentId = 0;
		str = $('#commentEdit').val();
	} else {
		str = $(this).parent().find('.commentTo').val();
	}


	addComment(str);
});

$("body").on("click", "#commentPage button", function() {
	PageIndex = $(this).text();
	//显示评论 articleId  文章详情的ID
	GetComment(Article.articleId);
});



function InitAdd() {
	ProvinceAdd();
	$('.input-group').show();
	$('#leftart').css('background', '#FFF');
	$('#leftart ul li:lt(7)').hide();
	//	//点赞数
	//	$('#leftart ul li:eq(7)').hide();
	//	//查看数
	//	$('#leftart ul li:eq(8)').hide();

	$('#modifybtn').addClass('btn-danger');
	$('#modifybtn').html('保存');

	$('#artsummary').hide();
	$('#arttext').hide();
	$('#artsummaryEdit').find('textarea').val('');

	//评论等信息
	$('.tvbs-comments').hide();
	$('.tvbs-likes').hide();
	$('.tvbs-views').hide();

	//隐藏浏览更多
	$('.tvc-more').hide();
	$('.tv-comments').hide();

}

function InitModify(data) {
	InitAdd();
	$('.fg-line').show();
	$('#upfilebtn').show();
	$('.pmop-edit').show();
	//添加信息

	$('#changeArtcFM').attr('src', data.panelUrl);
	$('#InstructionEdit').val(data.instruction);
	$('#Author').val(data.author);
	$('#datetimepicker1').val(data.createdTime);
	$('#datetimepicker2').val(data.expiredAt);

	if (data.handPicked == 1) {
		$('#Islunbo').attr('checked', 'checked');
		$('#luboimg').show();
		$('#luboimg').find('img').attr('src', data.attachUrl);
		Ischeck = true;
	} else {
		$('#Islunbo').removeAttr('checked');
		$('#luboimg').hide();
		Ischeck = false;
	}
	$('#artsummarytextarea').val(data.briefText);
	$('#artsummaryEdit').val(data.content);
	$('#articleTypeEdit').val(data.articleType);

}

function ShowComment(data) {
	var obj = data.msg.comments;
	$('#commlist').empty();
	for (var i = 0; i < obj.length; i++) {
		var oli = $("<li></li>");
		oli.addClass("media")
		$('#commlist').append(oli);

		var oid = $('<div class="commentId" style="display:none;"></div>');
		oid.html(obj[i].id);
		oid.appendTo(oli);

		//头像
		var Imga = $('<a href="javascript:;" class="tvh-user pull-left"></a>');
		Imga.appendTo(oli);

		var headImg = $('<img />');
		headImg.addClass('mg-responsive');
		headImg.attr('src', obj[i].profileUrl);
		headImg.appendTo(Imga);

		var obody = $('<div class="media-body"></div>');
		obody.appendTo(oli);

		//昵称行
		var nickname = $('<strong class="d-block"><span></span></strong>');
		nickname.find('span').html(obj[i].nickname);
		nickname.appendTo(obody);

		var obtn = $('<button href="javascript:;" class="btn btn-danger pull-right  delbtn"><i class="zmdi zmdi-delete"></i></button><button href="javascript:;" class="btn btn-primary pull-right m-r-5 repbtn"><i class="zmdi zmdi-mail-reply"></i></button> ');
		obtn.appendTo(nickname);

		var comtime = $('<small class="c-gray"></small>');
		comtime.html(obj[i].commentTime);
		comtime.appendTo(obody);

		//评论内容
		var comments = $('<div class="m-t-10"></div>');
		comments.html(obj[i].content);
		comments.appendTo(obody);
		//是否是回复别人的评论
		if (obj[i].parentId != 0) {
			var repbpx = $('<div class="m-t-10 p-5 " style="border:solid 1px #2196f3;margin-left:60px;border-radius: 5px;"></div>');
			repbpx.appendTo(oli);

			var namediv = $('<div>回复</div>');
			namediv.appendTo(repbpx);

			var namespan = $('<span style="display:inline-block;" class="m-l-5 c-blue	"></span>');
			namespan.html(obj[i].parentuser);
			namespan.appendTo(namediv);

			var repcomm = $('<div class="m-t-5" style="word-break:break-all; word-wrap:break-word;"></div>');
			repcomm.html(obj[i].parentcomment);
			repcomm.appendTo(repbpx);
		}

		var repcommto = $('<div class="fg-line" style="display:none;" ><button class="m-t-15 btn btn-primary btn-sm pull-right addComment">提交</button><select class="accounts" style="padding:5px;position:relative;top:50px;left:0;border:solid 1px #0d8aee;width:140px;"></select><textarea class="form-control auto-size commentTo" placeholder="撰写回复内容..." rows="2" style="padding-left:150px;"></textarea></div>');
		repcommto.appendTo(oli);

	}
	//添加翻页效果
	$('#commentPage').empty();
	for (var j = data.pagenum; j > 0; j--) {
		var buttons = $('<button href="javascript:;" class="btn btn-primary pull-right m-r-5 p-5"></button>');
		if (j == PageIndex) {
			buttons.addClass('btn-warning');
		}
		buttons.text(j);
		$('#commentPage').append(buttons);
	}

	//添加用于回复评论的用户
	accounts();

}

function accounts() {
	$.ajax({
		type: 'get',
		url: accountsGetUrl,
		dataType: "json",
		success: function(data) {
			console.log(data);
			ShowAccounts(data)
		},
		error: function(data) {
			console.log("Getaccounts error");
		}
	});

}

function ShowAccounts(data) {
	$('.accounts').empty();
	var managers = data.msg.managers
	for (var i = 0; i < managers.length; i++) {
		var opm = $('<option></option>');
		opm.html(managers[i].user_name);
		opm.attr('value', managers[i].user_id);
		$('.accounts').append(opm);
	}
	var majias = data.msg.majias;
	for (var i = 0; i < majias.length; i++) {
		var opm = $('<option></option>');
		opm.html(majias[i].user_name);
		opm.attr('value', majias[i].user_id);
		$('.accounts').append(opm);
	}


}

$("body").on("change", ".accounts", function() {
	user_name = $(this).find("option:selected").text();
	user_id = $(this).val();
});




function ShowArticle(data) {
	if (modify == "modify") {
		Article.provinceId = data.provinceId;
		Article.majorId = data.majorId;
		InitModify(data);
		return;
	}
	console.log("+++++++++++++++++++++++++++++++++++++");
	console.log(data);
	//将可编辑的全部隐藏
	$('.fg-line').hide();
	$('#commentEdit').parents('.fg-line').show();
	$('#upfilebtn').hide();
	$('.pmop-edit').hide();
	//	console.log($('#Islunbo').attr('checked'));

	$('#changeArtcFM').attr("src", data.panelUrl);
	$('#Instruction').html(data.instruction);
	$('#AuthorLook').html(data.author);
	$("#createTime").html(data.createdTime);
	$('#expiredAt').html(data.expiredAt);
	$('#province').html(data.provinceId);
	$('#major').html(data.majorId);


	//轮播图
	if (data.handPicked == 1) {
		$('#Islunbo').attr('checked', 'checked');
		$('#luboimg').find('img').attr('src', data.attachUrl);
		$('#luboimg').show();
		Ischeck = true;
	} else {
		$('#luboimg').hide();
		$('#Islunbo').removeAttr('checked');
		Ischeck = false;
	}



	$('#artsummary').html(data.briefText);
	showContent(data.content);

	$('.pinglun').html('　' + data.thumbNum);
	$('.zan').html('　' + data.transmitNum);

	$('#articleType').html(TransArticleType(data.articleType));
	Article.id = data.id;

	//显示评论 articleId  文章详情的ID
	Article.articleId = data.articleId;
	GetComment(Article.articleId);
}

function TransArticleType(str) {
	switch (str) {
		case 'DAILY_CHEESE':
			return "每日芝士";
			break;
		case 'EXAMINATION_ROAD':
			return "自考路上";
			break;
		case 'SIGN_UP_INFO':
			return "报考讯息";
			break;
		case 'OFFICIAL_NEWS':
			return "新闻看点";
			break;
		case 'COMMEN_QUESTION':
			return "常见问题";
			break;
		default:
			return str;
			break;
	}
}



function showContent(str) {
	var obj = $('#arttext');
	str = str.replace(/\<\$/g, '<img src=\"');
	str = str.replace(/\$\>/g, '\" width="90%" style="display:block;margin:0 auto;">');
	obj.html(str);
	obj.css('margin-top', "10px");
}

function saveArticle() {
	if (Ischeck) {
		Article.handPicked = 1, //是否有lunbo
			Article.attachUrl = $('#luboimg').find('img').attr("src");
	}
	if ($('#Author').val() != "") {
		Article.author = $('#Author').val();
	} //作者   必填
	Article.briefText = $('#artsummarytextarea').val(); //摘要
	Article.content = $('#artsummaryEdit').val(); //内容
	Article.createdTime = $('#datetimepicker1').val();
	Article.expiredAt = $('#datetimepicker2').val();
	Article.instruction = $('#InstructionEdit').val();
	Article.majorId = $('#MajorSelect').val();
	Article.panelUrl = $('#changeArtcFM').attr("src");
	Article.provinceId = $('#ProvinceSelect').val();

}

function postArticle() {
	console.log("post");
	console.log(Article);
	$.ajax({
		type: 'post',
		url: articlePostUrl,
		data: {
			id: Article.id,
			articleType: Article.articleType,
			handPicked: Article.handPicked,
			attachUrl: Article.attachUrl,
			author: Article.author,
			briefText: Article.briefText,
			content: Article.content,
			createdTime: Article.createdTime,
			expiredAt: Article.expiredAt,
			instruction: Article.instruction,
			majorId: Article.majorId,
			panelUrl: Article.panelUrl,
			provinceId: Article.provinceId
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			Article.id = data.msg.news_id;
			location.href = "article?type=" + news_type + "&modify=see&articleId=" + Article.id + "&pageIndex=" + PageIndex;

		},
		error: function(data) {
			console.log("post article error");
		}
	});
}

function addComment(str) {
	console.log(Article.articleId + "sss" + ConnentId + "sss" + str + "id:" + user_id);
	$.ajax({
		type: 'post',
		url: commentPostUrl,
		data: {
			articleId: Article.articleId,
			parentId: ConnentId,
			content: str,
			user_id: user_id
		},
		dataType: "json",
		success: function(data) {
			$('.showSuccess').show();
			var time = setTimeout(function() {

				$('.showSuccess').hide();
			}, 1000);
			GetComment(Article.articleId);
		},
		error: function(data) {
			console.log("post Comment error");
		}
	});
}

function delConnect(id) {
	console.log('begin del');
	$.ajax({
		type: 'get',
		url: commentdelurl,
		data: {
			commentId: id
		},
		dataType: "json",
		success: function(data) {
			GetComment(Article.articleId);
		},
		error: function(data) {
			console.log("post Comment error");
		}
	});
}