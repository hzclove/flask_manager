//上传文件功能
var UpFile = (function() {
	function showalert(str) {
		alert(str);
	}

	var upfile = {

		add: function(articleType) {
			location.href="article?type="+news_type+"&modify=add";
			//console.log('add');
		}
		
	}
	return upfile;
})();