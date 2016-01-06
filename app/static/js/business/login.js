$('#login').click(function(){
	var name=hex_md5($('#userName').val());
	var passwords=hex_md5($('#passWord').val());
		$.ajax({
		type: 'post',
		url: '/login',
		data: {
			userName:name,
			passWord:passwords
		},
		dataType: "json",
		success: function(data) {
	
		},
		error: function(data) {
			console.log("login error");
		}
	});
});
