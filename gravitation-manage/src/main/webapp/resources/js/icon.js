$(document).ready(function() {
	$("#recoverDefaultImg").click(function() {
		var returnVal = window.confirm("你确认要恢复吗？");
		if(returnVal) {
			$.ajax({
				url : "/member/icon/recoverDefaultAvatar",
				data : {
					userId : $("#UID").val(),phoneOrFlyme : $("#phoneOrFlyme").val()
				},
				dataType : "json",
				async : false,
				success : function(data) {
					if (data.code == 200) {
						$("img").attr("src", data.value.icon);
						window.location.href = "/member/icon/get?phoneOrFlyme="+$("#phoneOrFlyme").val();
					}
					if(data.code == 401){
						alert("对不起，您没有系统操作权限.");
					}
				}
			});
		}
		});
	
});