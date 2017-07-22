$.fn.extend({
	fillFormByUrl:function(formId,url){
		$.ajax({
            type: "get",//使用get方法访问后台
            dataType: "json",//返回json格式的数据
            url: url,//要访问的后台地址
            error:function(data){
            	alert(data.message);
            },
            success: function(data){//msg为返回的数据，在这里做数据绑定
            	var code=data.code;
            	var message=data.message;
            	if(code!="200"&&code!=2){
            		alert(message);
            		return;
            	}
            	var value = data.value;
	                $.each(value, function(i, n){
//	                	alert(i+":"+n);
	                	$("#"+formId+" input[name='"+i+"']").val(n);
	                	$("#"+formId+" #"+i+"").val(n);
	                	$("#"+formId+" #"+i+" p").html(n);
	                });
            }
		});
	}
}); 