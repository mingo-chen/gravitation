
$(document).ready(function() {
			var $saveTask = $("#saveTask");
			var $saveCompaignRefer = $("#saveCompaignRefer");
			var $saveTaskRefer = $("#saveTaskRefer");
			var selects = document.getElementsByName('selectBox');
			var $savedialog = $("#savedialog");
			var $commitdialog = $("#commitdialog");
			var $selectAll = $("input[name='selectAllBox']");
			
			$saveTask.click(function(){
				 var compaignId = $("#compaignId")[0].value;
				 var selects = document.getElementsByName('selectBox');
		    	  var taskIds ="";
		    	  for (var i=0;i<selects.length;i++){
		    		  var select = selects[i];
		    		  if (select.checked){
		    				  taskIds = taskIds + ","+select.id;
		    		  }
		    	  }
		    	  if(taskIds==""){
		    		    $savedialog.modal();
		    		    $savedialog.modal().css({
		    			    width: 'auto',
		    			    'margin-left': function () {
		    			       return -($(this).width() /2);
		    			   }
		    			});
						$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="请您选择要添加的任务！！";
		    		  return;
		    	  }
		    	  
		    	  var url = ctx+'/admin/compaign/task/add';
		    	  $.ajax({
		    		    type: 'POST',
		    		    url: url,
						data:{compaignId:compaignId,taskIds:taskIds},
						dataType: "json",
						async: false,
						success: function(data) {
							if (data.code == "200" && data.value.result == "true") {
								var returnUrl = data.value.url;
								var id = data.value.compaignId;
								window.location.href = ctx + returnUrl + "?compaignId="+id; 
							}else {
								$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="添加失败！！";
								$savedialog.modal().css({
								    width: 'auto',
								    'margin-left': function () {
								       return -($(this).width() /2);
								   }
								});
								$savedialog.modal();
							}
						},
						error:function(data) {
							$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="添加失败！！";
							$savedialog.modal().css({
							    width: 'auto',
							    'margin-left': function () {
							       return -($(this).width() /2);
							   }
							});
							$savedialog.modal();
						}
					}); 
			});
			
			$saveCompaignRefer.click(function() {
				var compaignId = $("#compaignId").attr("value");
				var pattern = $("#pattern").attr("value");
				var referId = "";
				var existAward = "false";
				for ( var i = 0; i < selects.length; i++) {
					var select = selects[i];
					if (select.checked) {
						referId = select.id;
						existAward = select.value;
						break;
					}
				}

				if (compaignId == "") {
					$savedialog.modal();
					$savedialog.modal().css({
					    width: 'auto',
					    'margin-left': function () {
					       return -($(this).width() /2);
					   }
					});
					$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="请选择添加记录！！";
					return;
				}
				
				if (existAward == "false"){
					$savedialog.modal();
					$savedialog.modal().css({
					    width: 'auto',
					    'margin-left': function () {
					       return -($(this).width() /2);
					   }
					});
					var patternInfo = '1' == pattern?"抽奖":"直接发放奖品";
					$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="该"+patternInfo+"没有关联奖品，请先关联奖品！！";
					return;
				}
				
				var url = ctx + '/admin/compaign/refer/add';
				$.ajax({
					type : 'POST',
					url : url,
					data : {
						compaignId : compaignId,
						referId : referId
					},
					dataType : "json",
					async : false,
					success : function(data) {
						if (data.code == "200" && data.value.result == "true") {
							var returnUrl = data.value.url;
							var id = data.value.compaignId;
							window.location.href = ctx + returnUrl
									+ "?compaignId=" + id;
						} else {
							$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="添加失败！！";
							$savedialog.modal().css({
							    width: 'auto',
							    'margin-left': function () {
							       return -($(this).width() /2);
							   }
							});
							$savedialog.modal();
						}
					},
					error : function(data) {
						if (data.status == "401") {
							$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="添加失败！！";
							$savedialog.modal().css({
							    width: 'auto',
							    'margin-left': function () {
							       return -($(this).width() /2);
							   }
							});
							$savedialog.modal();
						}
					}
				});

			});
			
			
			$saveTaskRefer.click(function() {
				var compaignId = $("#compaignId").attr("value");
				var pattern = $("#pattern").attr("value");
				var taskId = $("#taskId").attr("value");
				var referId = "";
				var existAward = "false";
				for ( var i = 0; i < selects.length; i++) {
					var select = selects[i];
					if (select.checked) {
						referId = select.id;
						existAward = select.value;
						break;
					}
				}

				if (compaignId == "") {
					$savedialog.modal();
					$savedialog.modal().css({
					    width: 'auto',
					    'margin-left': function () {
					       return -($(this).width() /2);
					   }
					});
					$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="请选择添加记录！！";
					return;
				}
				
				if (existAward == "false"){
					$savedialog.modal();
					$savedialog.modal().css({
					    width: 'auto',
					    'margin-left': function () {
					       return -($(this).width() /2);
					   }
					});
					var patternInfo = '1' == pattern?"抽奖":"直接发放奖品";
					$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="该"+patternInfo+"没有关联奖品，请先关联奖品！！";
					return;
				}
				
				var url = ctx + '/admin/compaign/task/refer/add';
				$.ajax({
					type : 'POST',
					url : url,
					data : {
						compaignId : compaignId,
						taskId : taskId,
						referId : referId
					},
					dataType : "json",
					async : false,
					success : function(data) {
						if (data.code == "200" && data.value.result == "true") {
							var returnUrl = data.value.url;
							var id = data.value.compaignId;
							window.location.href = ctx + returnUrl
									+ "?compaignId=" + id;
						} else {
							$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="添加失败！！";
							$savedialog.modal().css({
							    width: 'auto',
							    'margin-left': function () {
							       return -($(this).width() /2);
							   }
							});
							$savedialog.modal();
						}
					},
					error : function(data) {
						if (data.status == "401") {
							$savedialog[0].childNodes[1].childNodes[3].childNodes[1].innerHTML="添加失败！！";
							$savedialog.modal().css({
							    width: 'auto',
							    'margin-left': function () {
							       return -($(this).width() /2);
							   }
							});
							$savedialog.modal();
						}
					}
				});

			});
			
			//全选checkbox点击事件
			$selectAll.click(function () {
				var flag = $(this).attr("checked");
				if (true == flag || "checked" ==  $(this).attr("checked")) {
					//全选
					$(selects).attr("checked","checked");
					$(selects).parent("span").addClass("checked");
				}else{
					//全取消
					$(selects).removeAttr("checked");
					$(selects).parent("span").removeClass("checked");
				}
			});
			
		});