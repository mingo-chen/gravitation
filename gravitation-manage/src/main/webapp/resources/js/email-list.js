function cEmail(){
		var email = $.trim($("input[name=newemail]").val());
		var regexp=/^[0-9a-z\.\-_]+@[0-9a-z\-\_]+\.[a-zA-Z0-9_\-\.]+$/i;
	    if (email.length == 0) {
	    	$("#emailMsg").html("请输入新邮箱");
	        return false;
	    }else if(!regexp.test(email)){
	    	$("#emailMsg").html("请按正确邮箱格式输入");
	        return false;
	    }
	    return true;
}
function cPassword(){
	if($.trim($("input[name=password]").val()) == 0){
		$("#passwordMsg").html('请输入密码');
	    return false;
	}
	return true;
}

$(document).ready(function(){
	var $modalMsg = $("#modalMsg");
	var $modal = $("#myModal");
	var $resetEmailBtn = $("#resetEmailBtn");
	var $uid = $("input[name=uid]");
	
	var $username = $("#username");
	var $email = $("#email");
	var $newemail = $("input[name=newemail]");
	var $password = $("input[name=password]");
	var $emailMsg = $("#emailMsg");
	var $passwordMsg = $("#passwordMsg");
	
	var emailExists = false;
	$newemail.focus(function(){
		$emailMsg.html('');
	}).blur(function(){
		if(!cEmail()){
			return;
		}
		var email = $.trim($newemail.val());
	    var url =   ctx+'/userAccount/isEmailExists';
	    var data = {email: email};
	    var callback = function(result) {
	    	var msg = '';
	        if ("true" == result) {
	            msg = "此邮箱已经存在";
	            emailExists = true;
	        } else {
	        	msg = "";
	        	emailExists = false;
	        }
	        $emailMsg.html(msg);
	    }
	    $.get(url, data, callback);
	});
	
	$password.focus(function(){
		$passwordMsg.html('');
	}).blur(function(){
		cPassword();
	});
	
	$resetEmailBtn.click(function(){
		
		if(!cEmail() || !cPassword() || emailExists) {
			return;
		}
		
		var url = ctx+'/userAccount/manage/resetEmail';
		var oldemail = $.trim($email.html());
		var newemail = $.trim($newemail.val());
		var password = $.trim($password.val());
		//var username = $.trim($username.html());
		var uid = $uid.val();
		//random num
		var t = new Date().getTime();
		$.ajax({
			url: url,
			data:{oldemail:oldemail,newemail:newemail,uid:uid,password:password,t:t},
			dataType: "json",
			async: false,
			success: function(data) {
				if (data.code == 200 && data.value == true) {
					$modalMsg.html('您的操作已成功!');
					$modal.modal();
					$modal.on('hidden', function () {
						//alert('hidden');
						$("#searchBtn").click();
						//$("#accountForm").submit();	
				    });
				}else {
					$modalMsg.html('您的操作失败【'+data.message+'】');
					$modal.modal();
				}
			},
			error:function(data) {
				if(data.status == "401") {
					$modalMsg.html('您没有系统操作权限');
					$modal.modal();
				}
			}
		});
	});
	
});