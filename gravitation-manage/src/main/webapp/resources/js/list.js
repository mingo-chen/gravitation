//function releaseLock(sn){
////	alert(sn);
//	//密码框
//	$("#passwordDialog").modal();
//	var $password = $("#password");
//	$passwordBtn.click(function(){
//		if($.trim($password.val()).length == 0) {
//			alert('密码不能为空');
//			return;
//		}
//		
//		var url = ctx+'/userAccount/releaseLock';
//		var t = new Date().getTime();
//		$.ajax({
//			url: url,
//			data:{sn:sn,t:t},
//			dataType: "json",
//			async: false,
//			success: function(data) {
//				if (data.code == 200 && data.value == true) {
//					$modalMsg.html('您的操作已成功!');
//				}else {
//					$modalMsg.html('您的操作失败!');
//				}
//				$modal.modal();
//			}
//		});
//	});
//}
$(document).ready(function(){
	
	
	var $form = $(".form-horizontal");// 列表表单
	
	var $keyword = $("input[name=keyword]");
	var $sn = $("input[name=sn]");
	var $imei = $("input[name=imei]");
	
	var $searchBtn = $("#searchBtn");
	var $searchDiv = $("#searchDiv");
	var $errorMsg = $("#errorMsg");
	var $phoneErrorMsg  = $("#phoneErrorMsg");
	var $emailErrorMsg  = $("#emailErrorMsg");
	var $uidErrorMsg  = $("#uidErrorMsg");
	var $snErrorMsg  = $("#snErrorMsg");
	var $imeiErrorMsg  = $("#imeiErrorMsg");
	
	var $releaseLock = $("#releaseLock");
	var $releaseBind = $("#releaseBind");
	
	var $passwordDialog = $("#passwordDialog");
	var $modalMsg = $("#modalMsg");
	var $modal = $("#myModal");
	//radio checked value,defalut value：载入页面的checked的值
	var checkTypeValue = $("input[name='queryType']:checked").val();
	
	var phoneRegx = /^1\d{10}$/; // 判断是否为手机的正则表达式
	var emailRegx = /^[0-9a-z\.\-_]+@[0-9a-z\-\_]+\.[a-zA-Z0-9_\-\.]+$/i;
	var uidRegx = /^\d+$/;
	var imeiRegx = /^\d+$/;
	
	var $normalSpan = $("#normal");
	var $imeiSnSpan = $("#imei_sn");
	
	
	
	$(".ui_timepicker").datetimepicker({
        showSecond: true,
        timeFormat: 'HH:mm:ss',
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1
    });
	
	
	//搜索框没有值
	if($.trim($keyword.val()).length == 0) {
		$searchBtn.attr('disabled',true);
	}
	
	if(checkTypeValue == 3) {
		 $normalSpan.hide();
		 $imeiSnSpan.show();
	}
	
	//获取选中radio的值
	$("input[name='queryType']").each(function (index) {  
	      $(this).change(function(){
	      	  //清空输入框内容
	    	  $keyword.val('');
	    	  checkTypeValue = $(this).val();
	    	  $normalSpan.show();
    		  $imeiSnSpan.hide();
    		  //alert(checkTypeValue);
    		  //查询为imei_sn类型，需要两个输入框
	    	  if(checkTypeValue == 3){
	    		  $normalSpan.hide();
	    		  $imeiSnSpan.show();
	    	  }
	    	  $errorMsg.hide();
	  		  $phoneErrorMsg.hide();
	  		  $emailErrorMsg.hide();
	  		  $uidErrorMsg.hide();
	  		  $imeiErrorMsg.hide();
	  		  $snErrorMsg.hide();
			
	    	  $keyword.blur();
	      });  
	 });  
	
	
	$keyword.focus(function(){
		$searchBtn.attr('disabled',false);
		$searchDiv.removeClass('error');
		$errorMsg.hide();
		$phoneErrorMsg.hide();
		$emailErrorMsg.hide();
		$uidErrorMsg.hide();
		$imeiErrorMsg.hide();
 		$snErrorMsg.hide();
 		
	}).blur(function(){
		
		if(checkTypeValue == 3){
			var sn = $.trim($sn.val());
			var imei = $.trim($imei.val());
			
			if(imei.length == 0) {
				$searchDiv.addClass('error');
				$imeiErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
			
			if(sn.length == 0) {
				$searchDiv.addClass('error');
				$snErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
			
			
		}
		
		
		var keyword=$.trim($keyword.val());
		if(keyword.length == 0) {
			$searchDiv.addClass('error');
			$errorMsg.show();
			$searchBtn.attr('disabled',true);
			return;
		}
		//alert(checkTypeValue);
		//check phone
		if(checkTypeValue == 4){
			if(!phoneRegx.test(keyword)){
				$searchDiv.addClass('error');
				$phoneErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
		}
		//check email
		if(checkTypeValue == 5){
			if(!emailRegx.test(keyword)){
				$searchDiv.addClass('error');
				$emailErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
		}
		//check uid
		if(checkTypeValue == 6){
			if(!uidRegx.test(keyword)){
				$searchDiv.addClass('error');
				$uidErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
		}
		
		$searchBtn.attr('disabled',false);
		$searchDiv.removeClass('error');
		$errorMsg.hide();
		$phoneErrorMsg.hide();
		$emailErrorMsg.hide();
		$uidErrorMsg.hide();
		$imeiErrorMsg.hide();
		$snErrorMsg.hide();
	});
	
	$sn.focus(function(){
		$searchBtn.attr('disabled',false);
		$searchDiv.removeClass('error');
		$errorMsg.hide();
		$phoneErrorMsg.hide();
		$emailErrorMsg.hide();
		$uidErrorMsg.hide();
		$imeiErrorMsg.hide();
 		$snErrorMsg.hide();
 		
	}).blur(function(){
		
		if(checkTypeValue == 3){
			var imei = $.trim($imei.val());
			var sn = $.trim($sn.val());
			if(imei.length == 0 || !imeiRegx.test(imei)) {
				$searchDiv.addClass('error');
				$imeiErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
			if(sn.length == 0) {
				$searchDiv.addClass('error');
				$snErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
		}
		
		var keyword = imei+"_"+sn;
//		//alert(keyword);
		$keyword.val(keyword);
		$searchBtn.attr('disabled',false);
		$searchDiv.removeClass('error');
		$errorMsg.hide();
		$phoneErrorMsg.hide();
		$emailErrorMsg.hide();
		$uidErrorMsg.hide();
		$imeiErrorMsg.hide();
		$snErrorMsg.hide();
	});
	
	$imei.focus(function(){
		$searchBtn.attr('disabled',false);
		$searchDiv.removeClass('error');
		$errorMsg.hide();
		$phoneErrorMsg.hide();
		$emailErrorMsg.hide();
		$uidErrorMsg.hide();
		$imeiErrorMsg.hide();
		$snErrorMsg.hide();
		
	}).blur(function(){
		
		if(checkTypeValue == 3){
			var imei = $.trim($imei.val());
			var sn = $.trim($sn.val());
			if(imei.length == 0 || !imeiRegx.test(imei)) {
				$searchDiv.addClass('error');
				$imeiErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
			if(sn.length == 0) {
				$searchDiv.addClass('error');
				$snErrorMsg.show();
				$searchBtn.attr('disabled',true);
				return;
			}
		}
		
		var keyword = imei+"_"+sn;
//		//alert(keyword);
		$keyword.val(keyword);
		$searchBtn.attr('disabled',false);
		$searchDiv.removeClass('error');
		$errorMsg.hide();
		$phoneErrorMsg.hide();
		$emailErrorMsg.hide();
		$uidErrorMsg.hide();
		$imeiErrorMsg.hide();
		$snErrorMsg.hide();
	});
	
	var $password = $("#password");
	var $pwdErrorMsg =$("#pwdErrorMsg");
	var $passwordBtn = $("#passwordBtn");
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
	
	//random num
	var t = new Date().getTime();
	var sn;
	var imei;
	var method = '';
	 $("#passwordBtn").click(function(){
		  //提交后，隐藏
		  $passwordDialog.modal('hide');
		  var url = ctx+'/userAccount/manage/'+method;
		  $.ajax({
				url: url,
				data:{password:$password.val(),sn:sn,imei:imei,t:t},
				dataType: "json",
				async: false,
				success: function(data) {
					if (data.code == 200 && data.value == true) {
						if(method === 'releaseLock'){
							$modalMsg.html('解除锁定命令已发送!');
						}else {
							$modalMsg.html('退出账户命令已发送!');
						}
						$modal.modal();
						//退出时重新提交请求，刷新页面
						$modal.on('hidden', function () {
							//alert('hidden');
							$("#searchBtn").click();
					    });
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
	
	//循环指定页面中事件
	$("a[id='releaseLock']").each(function (index) {  
	      $(this).click(function(){
	    	  var $snSpan = $(this).children(".sn");
	    	  var $imeiSpan = $(this).children(".imei");
	    	  $passwordDialog.modal();
	    	  sn = $snSpan.html();
	    	  imei = $imeiSpan.html();
	    	  method = 'releaseLock';
	    	  t = new Date().getTime();
	      });  
	   });  
	
	//循环指定页面中事件
	$("a[id='releaseBind']").each(function (index) {  
	      $(this).click(function(){
	    	  var $snSpan = $(this).children(".sn");
	    	  var $imeiSpan = $(this).children(".imei");
	    	  $passwordDialog.modal();
	    	  sn = $snSpan.html();
	    	  imei = $imeiSpan.html();
	    	  method = 'closePhoneBind';
	    	  t = new Date().getTime();
	      });  
	   });  
	
	
});