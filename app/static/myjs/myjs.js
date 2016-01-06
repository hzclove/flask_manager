var request;
function createRequest() {
	var req = null;
	var reqs = [ function() {
		return new XMLHttpRequest();
	}, function() {
		return new ActiveXObject("Msxml2.XMLHTTP");
	}, function() {
		return new ActiveXObject("Msxml3.XMLHTTP");
	}, function() {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}, ];
	for ( var i = 0; i < reqs.length; i++) {
		try {
			req = reqs[i]();
			break;
		} catch (e) {
			continue;
		}
	}
	return req;
}
//ÓÃ»§µÇÂ¼
function login(){
	var userName = document.getElementById("userName").value;
	var userPwd = document.getElementById("userPwd").value;
	var flag1 = false;
	var flag2 = false;
	if(userName != ""){
		flag1 = true;
	}
	if(userPwd != ""){
		flag2 = true;
	}
	if(flag1 && flag2){
		document.getElementById("loginForm").submit();
	}
}










































































