$(document).ready(function() {
	var trophySelect = $("#trophySelect").val();
	if(trophySelect != null && trophySelect != undefined && trophySelect != ''){
		$.ajax({
			url : '/compaign/lottery/award/get',// 跳转到
			// action
			data : {
				awardId : $("#trophySelect").val()
			},
			type : 'get',
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (data.code == "200") {
					$("#Inventory").html(
							data.value.surplus);
					$("#price").val(data.value.price);
				} else {
				}
			},
			error : function() {
				alert("你所选的奖品有误");
			}
		});
	}
	$(".ui_timepicker").datetimepicker({
        showSecond: true,
        timeFormat: 'hh:mm:ss',
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1
    });
    
	$("#total").val(
			$("#price").val()
					* $("#amount").val());
	$("#trophySelect").change(function() { // 为Select添加事件，当选择其中一项时触发
		var checkText = $("#trophySelect").find(
				"option:selected").text();// 获取Select选择的Text
		var checkValue = $("#trophySelect").val(); // 获取Select选择的Value
		$.ajax({
			url : '/compaign/lottery/award/get',// 跳转到
			// action
			data : {
				awardId : checkValue
			},
			type : 'get',
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (data.code == "200") {
					$("#Inventory").html(
							data.value.surplus);
					$("#price").val(data.value.price);
				} else {
					alert("你所选的奖品不存在");
				}
			},
			error : function() {
				alert("你所选的奖品有误");
			}
		});
			});
	
	$("#amount").focus(function() {
		 $("#errorMsg").hide();
		 $("#errorContent").html("");
	}).blur(function() {
		var amount = $("#amount").val();
		var price  = $("#price").val();
		var Inventory = $("#Inventory").html();
		if(!$.util.IsNum(amount)){
			 $("#errorMsg").show();
			 $("#errorContent").html("请输入正整数");
			 return;
		}
		if(Number(amount) > Number(Inventory)){
			 $("#errorMsg").show();
			 $("#errorContent").html("奖品的数量不能超过当前库存，请重新输入");
			 return;
		};
		var total = $("#price").val()* $("#amount").val();
		$("#total").val(Number(total).toFixed(2));
	});
	
	
	
//	$("a[name='offlineLottery']").click(function(){
//		var td = $(this);
//		var onlineLotteryId = Number(td.parent("td").parent("tr").find("td[name='lotteryId']").text()); 
//		$.ajax({
//			url : '/compaign/lottery/lottery/offline',// 跳转到
//			data : {
//				lotteryId:onlineLotteryId
//			},
//			type : 'post',
//			cache : false,
//			dataType : 'json',
//			success : function(data) {
//				if (data.code == "200") {
//					$("#offlineLottery").hide();
//					$("#onlineLottery").show();
//					td.parent("td").parent("tr").find("td[name='lotteryStatus']").html(data.value);
//				} else {
//					
//				}
//			},
//			error : function() {
//			}
//		});	
//	});
	
	$("#weight").focus(function() {
		 $("#errorMsg").hide();
		 $("#errorContent").html("");
	}).blur(function() {
		var weight = $("#weight").val();
		if(!$.util.IsNum(weight)){
			 $("#errorMsg").show();
			 $("#errorContent").html("请输入正整数");
		}
	});
});
