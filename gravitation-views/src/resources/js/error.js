$(document).ready(function(){
//	alert('error.js call'+redirectionUrl);
		$("#errorModalMsg").html('您的操作失败【'+message+'】');
		$("#myErrorModal").modal();
		$("#message").hide();
		$('#myErrorModal').on('hidden', function () {
			if($.trim(redirectionUrl).length == 0) {
				window.history.back();	
			}else {
				window.location.href=redirectionUrl;
			}
			
		});
		
});