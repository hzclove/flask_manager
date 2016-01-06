var locaurl = location.search;
var theRequest = AnalyserUrl(locaurl, true);
var news_type = theRequest.type;
var modify = theRequest.modify;


var PageSize = 3; //评论页面大小
var PageIndex = 1; //评论页面序号
var PageTotal = 0;


var addtopickPostUrl = "/addtopick"
var topickGetUrl = "/topic";
var commentGetUrl = "/topicComments";
var commentAddPostUrl = "/addTopicComment";
var commentModifyPostUrl='/modifyTopicComment';
var commentreplyPostUrl = "/replyComment";
var commentdelurl = "/deleteTopicComment";
var accountsGetUrl = "/accounts";

var BBSUrl = ""

var user_name = ""; //编辑身份
var user_id = "";

var ConnentId = 0;


var IsStatus = false;  //默认不置顶
var IsLevel  =false;   //默认不加精

var Article = {
	id: -1,
	title: '',
	content: '',
	imags: '',
	status: 1, //  2置顶,1普通，先不用管,
	topic_level: 0, //1精华帖,0普通帖
	forum_id: 0
}

Article.forum_id = news_type;
var articleMsg = "";
 
$('.input-group').hide();
$.ajax({
	type: 'get',
	url: "/forums",
	dataType: "json",
	success: function(data) {
		console.log(data);
		var obj = data.msg;
		for (var i = 0; i < obj.length; i++) {
			var op = $('<option></option>');
			op.html(obj[i].forumName);
			op.attr('value', obj[i].forumId);
			$('#forum').append(op);
		}
	},
	error: function(data) {
		console.log("BBS error");
	}
});



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
	accounts();

}

function seeArticle() {
	Article.id = theRequest.articleId;
	console.log(Article.id);
	GetArticle(Article.id);


}

function modifyArticle() {
	Article.id = theRequest.articleId;
	//	InitModify();
	accounts();
	GetArticle(Article.id);

}

function GetComment(id) {
	$.ajax({
		type: 'get',
		url: commentGetUrl,
		dataType: "json",
		data: {
			topicId: id,
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
		url: topickGetUrl,
		dataType: "json",
		data: {
			topicId: id
		},
		success: function(data) {
			console.log(data);
			ShowArticle(data.msg);
		},
		error: function(data) {
			console.log("GetArticle error");
		}
	}); 
}

$('#status').click(function() {
	if (IsStatus) {
		IsStatus = false;
	} else {
		IsStatus = true;
	}
});

$('#level').click(function() {
	if (IsLevel) {
		IsLevel = false;
	} else {
		IsLevel = true;
	}
});

//保存 
$("body").on("click", "#modifybtn", function() {
	if ($('#modifybtn').html() == '保存') {
		saveArticle();
		console.log(Article);
		postArticle();
$('#modifybtn').attr('disabled', 'disabled');

	} else if ($('#modifybtn').html() == '修改') {
		location.href = "BBSarticle?type=" + news_type + "&modify=modify&articleId=" + Article.id;
	}

});


$("body").on("change", "#forum", function() {
	news_type = $(this).val();
	Article.forum_id = $(this).val();
	console.log($(this).val());
});

//修改评论
$("body").on("click", ".editbtn", function() {
	if ($('.addComment').css('display') == 'none') {
		$('#commentEdit').parents('.fg-line').hide();
		alert('无法获得管理员列表！请与后台人员联系');
		return;
	}
	$(this).parents('.media').find('.commModify').show();
	$(this).parents('.media').find('.comms').hide();
	$(this).parents('.media').find('.addComment ').show();
	$(this).parents('.media').find('.okbtn').show();
	$(this).hide();
});

$("body").on("click", ".okbtn", function() {
	$(this).hide();
	var str=$(this).parents('.media').find('.commModify').val();
	//type=2;修改评论
	ConnentId = $(this).parents('.media').find('.commentId').html();
addComment(str,2);
$(this).attr('disabled','disabled');
});
//评论回复
$("body").on("click", ".repbtn", function() {
	if ($('.addComment').css('display') == 'none') {
		$('#commentEdit').parents('.fg-line').hide();
		alert('无法获得管理员列表！请与后台人员联系');
		return;
	}
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
		type = 1;
	} else {
		str = $(this).parent().find('.commentTo').val();
		type = 0;
	}
	addComment(str, type);
});

$("body").on("click", "#commentPage button", function() {
	PageIndex = $(this).text();
	//显示评论 articleId  文章详情的ID
	GetComment(Article.id);
});



function InitAdd() {

	$('.input-group').show();
	$('#leftart').css('background', '#FFF');
	$('#leftart ul li:lt(7)').hide();

	$('#modifybtn').addClass('btn-danger');
	$('#modifybtn').html('保存');

	$('#artsummary').hide();
	$('#arttext').hide();
	$('#artsummaryEdit').find('textarea').val('');

	$('#nr').hide();
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

	$('#artsummarytextarea').val(data.title);
	$('#arttext').hide();
	$('#artsummaryEdit').show()

	$('#artsummaryEdit').val(data.images);
	//showImg(data.images);

	$('#nrEdit').val(data.content);


	$('#articleTypeEdit').val(data.articleType);
	//显示发帖人
	$('#bbsaccount').val(data.user_id);

}

function ShowComment(data) {
	console.log(data);
	var obj = data.msg.comments;
	$('#commlist').empty();
	for (var i = 0; i < obj.length; i++) {
		var oli = $("<li></li>");
		oli.addClass("media")
		$('#commlist').append(oli);

		var oid = $('<div class="commentId" style="display:none;"></div>');
		oid.html(obj[i].comment_id);
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

		var obtn = $('<button href="javascript:;" class="btn btn-danger pull-right delbtn "><i class="zmdi zmdi-delete"></i></button><button href="javascript:;" class="btn btn-primary pull-right m-r-5 repbtn"><i class="zmdi zmdi-mail-reply"></i></button> ');
		obtn.appendTo(nickname);



		var comtime = $('<small class="c-gray"></small>');
		comtime.html(obj[i].commentTime);
		comtime.appendTo(obody);

		//评论内容
		var comments = $('<div class="m-t-10 comms"></div>');
		comments.html(obj[i].content);
		comments.appendTo(obody);

		//该评论是否可回复
		if (obj[i].user_level > 0) {
			var obtnModify = $('<button href="javascript:;" class="btn btn-danger pull-right okbtn m-r-5 " style="display:none;">OK</button><button href="javascript:;" class="btn btn-warning pull-right editbtn m-r-5 "><i class="zmdi zmdi-edit"></i></button>');
			obtnModify.appendTo(nickname);

			var commentsEdit = $('<input class="commModify"  style="display:none; width:70%;border:solid 1px #0d8aee;"/>');
			commentsEdit.val(obj[i].content);
			commentsEdit.appendTo(obody);

		}

		//评论内容中的图片
		var oimgdiv = $('<div></div>')
		oimgdiv.appendTo(obody);
		showImg(obj[i].images, oimgdiv);
		//是否是回复别人的评论
		if (obj[i].reply_id != 0) {
			var repbpx = $('<div class="m-t-10 p-5 " style="border:solid 1px #2196f3;margin-left:60px;border-radius: 5px;"></div>');
			repbpx.appendTo(oli);

			var namediv = $('<div>回复</div>');
			namediv.appendTo(repbpx);

			var namespan = $('<span style="display:inline-block;" class="m-l-5 c-blue	"></span>');
			namespan.html(obj[i].reply_user_name);
			namespan.appendTo(namediv);

			var repcomm = $('<div class="m-t-5" style="word-break:break-all; word-wrap:break-word;"></div>');
			repcomm.html(obj[i].reply_content);
			repcomm.appendTo(repbpx);
		}

		var repcommto = $('<div class="fg-line" style="display:none;" ><textarea class="form-control auto-size  imgaddress" placeholder="图片地址" rows="2"></textarea><button class="m-t-15 btn btn-primary btn-sm pull-right addComment ">提交</button><button class="m-t-15 btn btn-warning btn-sm pull-right addComment m-r-10" data-toggle="modal" data-target="#myModal">添加图片</button><select class="accounts" style="padding:5px;position:relative;top:50px;left:0;border:solid 1px #0d8aee;width:140px;"></select><textarea class="form-control auto-size commentTo" placeholder="撰写回复内容..." rows="2" style="padding-left:150px;"></textarea></div>');
		repcommto.appendTo(oli);


	}
	//添加翻页效果
	$('#commentPage').empty();
	for (var j = data.msg.pagenum; j > 0; j--) {
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
			$('.addComment').hide();
			$('#commentEdit').parents('.fg-line').hide();
		}
	});

}

$("body").on("change", ".accounts", function() {
	user_name = $(this).find("option:selected").text();
	user_id = $(this).val();

});


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
	//默认设置第一个为当前用户
	if (managers.length > 0) {
		user_name = managers[0].user_name;
		user_id = managers[0].user_id;
	} else if (majias.length > 0) {
		user_name = majias[0].user_name;
		user_id = majias[0].user_id;
	} else {
		$('.addComment').hide();
	}

}

function ShowArticle(data) {
	console.log(data);
	if (data.status == 2) {
		$('#status').attr('checked', 'checked');
		IsStatus=true;
	} else {
		$('#status').removeAttr('checked');
		IsStatus=false;
	}

	if (data.topic_level == 1) {
		$('#level').attr('checked', 'checked');
		IsLevel=true;
	} else {
		$('#level').removeAttr('checked');
		IsLevel=false;
	}

	$('#forum').val(data.forum_id);

	$('#bbsaccount').show();
	$('#bbsaccount').val(data.user_id);
	//在这里添加判断是否是我们的管理员
	var isAdm=false;
	console.log($('#bbsaccount option'));
	var obj=$('#bbsaccount option');
	for(var m=0;m<obj.length;m++){
	   if($(obj[m]).val()==data.user_id){
	   	isAdm=true;
	   	break;
	   }
	}
	if(!isAdm){
		$('#bbsaccount').attr('disabled', 'disabled');
	}
	console.log('data.user_id+' + data.user_id)
	user_id=data.user_id;
	
	if (modify == "modify") {
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
	$('#forum').parents('.input-group').show();
	$('#forum').parent().show();

	$('#status').attr('disabled', 'disabled');
	$('#level').attr('disabled', 'disabled');
	$('#forum').attr('disabled', 'disabled');

	$('#artsummary').html(data.title);
	$('#arttext').html("");
	showImg(data.images, $('#arttext'));
	$('#nr').html(data.content);

	$('#pinglun').html(data.commentnum);
	Article.id = data.topic_id;


	GetComment(Article.id);
}

function showImg(str, obj) {
	//	var obj = $('#arttext');
	console.log("tupian" + str);
	var strs = str.split(',');
	for (var i = 0; i < strs.length; i++) {
		if (strs[i] == "") {
			continue;
		}
		var odiv = $("<div></div>");
		odiv.css('display', 'block');
		odiv.css('margin', '10px auto');
		odiv.css('border', 'solid 1px #00BCD4');
		odiv.css('border-radius', '5px');
		odiv.css('width', '30%');
		odiv.css('padding', '10px');
		odiv.css('margin-right', '5px');
		odiv.addClass('pull-left');
		odiv.appendTo(obj);

		var oimg = $('<img />');
		oimg.attr('src', strs[i]);
		oimg.css('width', '100%');
		oimg.appendTo(odiv);
	}
	obj.css('margin-top', "10px");
	obj.addClass('clearfix');
}

function saveArticle() {
	Article.title = $('#artsummarytextarea').val();
	Article.content = $('#nrEdit').val();
	Article.imags = $('#artsummaryEdit').val();
	if (IsStatus) {
		Article.status = 2;
	} else {
		Article.status = 1;
	}
	//  2置顶,1普通，先不用管,
	if (IsLevel) {
		Article.topic_level = 1;
	} else {
		Article.topic_level = 0;
	}
	//1精华帖,0普通帖

}

function postArticle() {
	console.log("post");
	console.log(Article);
	$.ajax({
		type: 'post',
		url: addtopickPostUrl,
		data: {
			topic_id: Article.id,
			title: Article.title,
			content: Article.content,
			images: Article.imags,
			status: Article.status,
			topic_level: Article.topic_level,
			forum_id: Article.forum_id,
			user_id: user_id

		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			Article.id = data.msg.topic_id;
			console.log("BBS+++" + Article.id);
			location.href = "BBSarticle?type=" + news_type + "&modify=see&articleId=" + Article.id;

		},
		error: function(data) {
			console.log("post BBS error");
		}
	});
}

function addComment(str, type) {
	var urls = "";
	var imgstr = $('.imgaddress').val();
	var datas;
	if (type == 1) {
		datas = {
			topic_id: Article.id,
			forum_id: Article.forum_id,
			images: imgstr,
			content: str,
			user_id: user_id,
			user_name: user_name
		};
		urls = commentAddPostUrl;
	} else if (type == 0) {
		datas = {
			topic_id: Article.id,
			forum_id: Article.forum_id,
			reply_id: ConnentId,
			images: imgstr,
			content: str,
			user_id: user_id,
			user_name: user_name
		};
		urls = commentreplyPostUrl;
	}else if(type == 2){
		datas={
			comment_id:ConnentId,
			content:str
		};
		urls =commentModifyPostUrl;
	}
	
	console.log(datas);
	console.log(Article.id + "sss" + ConnentId + "sss" + str + "++" + urls);
	$.ajax({
		type: 'post',
		url: urls,
		data: datas,
		dataType: "json",
		success: function(data) {
			$('.showSuccess').html('提交');
			$('.showSuccess').show();
			var time = setTimeout(function() {

				$('.showSuccess').hide();
			}, 1000);
				GetComment(Article.id);
			//			GetComment(Article.id);
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
			GetComment(Article.id);
		},
		error: function(data) {
			console.log("post Comment error");
		}
	});
}
