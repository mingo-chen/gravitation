$(document).ready(function() {
	$("#addSingleKeyWord").focus(function() {
		$("#messageMsg").hide();
	}).blur(function() {
		$("#searchDiv").removeClass("error");
	});

	$("#queryKeyWord").focus(function() {
		$("#messageMsg").hide();
	}).blur(function() {
	});

	$("#addSingleKeyWordSubmit").click(function() {
		var url = "/member/sensitiveWord/addSigle";
		$.ajax({
			url : url,
			data : {
				keyword : $("#addSingleKeyWord").val()
			},
			dataType : "json",
			async : false,
			success : function(data) {
				if (data.code == 200 && data.value == true) {
					$("#emptyErrorMsg").show();
					$("#ErrorMsg").html('添加敏感词已成功!');
				} else {
					$("#emptyErrorMsg").show();
					$("#ErrorMsg").html(data.message);
				}
			},
			error : function(data) {
				if (data.status == "401") {
					$("#emptyErrorMsg").show();
					$("#ErrorMsg").html('您没有系统操作权限');
				}
			}
		});
	});
	$("#delSensitiveWord").click(function() {
		var url = "/member/sensitiveWord/del";
		$.ajax({
			url : url,
			data : {
				keyword : $("#sensitiveWord").val()
			},
			dataType : "json",
			async : false,
			success : function(data) {
				if (data.code == 200 && data.value == true) {
					$("#messageMsg").show();
					$("#ErrorMsg").html('删除敏感词已成功!');
				} else {
					$("#messageMsg").show();
					$("#ErrorMsg").html(data.message);
				}
			},
			error : function(data) {
				if (data.status == "401") {
					$("#messageMsg").show();
					$("#ErrorMsg").html('您没有系统操作权限');
				}
			}
		});
	});

});