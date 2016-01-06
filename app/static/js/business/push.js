var provinceUrl = "/provinces";
var majorUrl = "/majors";

ProvinceAdd();
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
//			if (Article.provinceId != undefined) {
//				$("#ProvinceSelect").val(Article.provinceId);
//				MajorAdd(Article.provinceId);
//			}

			console.log("ProvinceSelect add over ");
			var opt = $('<option></option>');
			opt.html("全部");
			opt.attr('value', "全部");
			$('#MajorSelect').append(opt);

$("#ProvinceSelect").trigger("chosen:updated");

$("#MajorSelect").trigger("chosen:updated");
		},
		error: function(data) {
			console.log("province error");
		}
	});
}
$("body").on("change", "#ProvinceSelect", function() {
	MajorAdd($(this).val());
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

//			if (Article.majorId != undefined) {
//				$("#MajorSelect").val(Article.majorId);
//			}
			
			$("#MajorSelect").trigger("chosen:updated");
		},
		error: function(data) {
			console.log("province error");
		}
	});
}