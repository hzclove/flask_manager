var BBSUrl = "/forums";
$.ajax({
	type: 'get',
	url: BBSUrl,
	dataType: "json",
	success: function(data) {
		ShowBBSList(data);
	},
	error: function(data) {
		console.log("BBS error");
	}
});

function ShowBBSList(data) {
	var obj = data.msg;
	for (var i = 0; i < obj.length; i++) {
		var oli = $('<li></li>');
		$('#bbs').append(oli);

		var oa = $('<a></a>');
		oa.attr('href', 'BBSlist?type=' + obj[i].forumId);
		oa.text(obj[i].forumName);
		oa.appendTo(oli);
	}
}