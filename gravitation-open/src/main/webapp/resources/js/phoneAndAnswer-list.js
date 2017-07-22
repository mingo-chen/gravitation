$(document).ready(function(){
	
	var $modalMsg = $("#modalMsg");
	var $modal = $("#myModal");
	var $clearAnswer = $("#clearUserAnswer");
	var $unbindPhone = $("#unbindPhone");
	var $uid = $("input[name=uid]");
	var $phone = $("#phone");
	var $password = $("#password1");
	var $passwordDialog = $("#passwordDialog1");
	var $passwordBtn = $("#passwordBtn1");
	var $pwdErrorMsg =$("#pwdErrorMsg1");
	//random num
	var t = new Date().getTime();
	var method = '';
	
	$password.focus(function(){
		$passwordBtn.attr('disabled',false);
		$pwdErrorMsg.hide();
	}).blur(function(){
		if($.trim($password.val()).length == 0) {
			$pwdErrorMsg.show();
			$passwordBtn.attr('disabled',true);
			return;
		}
		$passwordBtn.attr('disabled',false);
		$pwdErrorMsg.hide();
	});
	//密码框显示时清空错误消息,确认按钮不可用
	$passwordDialog.on('show', function () {
		$pwdErrorMsg.hide();
		$passwordBtn.attr('disabled',true);
    });
	
	$passwordBtn.click(function(){
		  //提交后，隐藏
		  $passwordDialog.modal('hide');
		  var url = ctx+'/userAccount/manage/'+method;
		  $.ajax({
				url: url,
				data:{uid:$uid.val(),password:$password.val(),t:t},
				dataType: "json",
				async: false,
				success: function(data) {
					if (data.code == 200 && data.value == true) {
						if(method === 'clearUserAnswerByUid'){
							$clearAnswer.hide();
						}else {
							$unbindPhone.hide();
							$phone.html('')
						}
						$modalMsg.html('您的操作已成功!');
						$modal.modal();
						//退出时重新提交请求，刷新页面
						$modal.on('hidden', function () {
							//alert('hidden');
							$("#searchBtn").click();
					    })
					}else {
						$modalMsg.html('您的操作失败【'+data.message+'】');
						$modal.modal();
					}
					$password.val('');
					
				},
				error:function(data) {
					if(data.status == "401") {
						$modalMsg.html('您没有系统操作权限');
						$modal.modal();
					}
					$password.val('');
				}
				
			});
	  });
	
	$clearAnswer.click(function(){
		$passwordDialog.modal();
		method = 'clearUserAnswerByUid';
		t = new Date().getTime();
	});
	
	$unbindPhone.click(function(){
		$passwordDialog.modal();
		method = 'unbindPhoneByUid';
		t = new Date().getTime();
	});
});