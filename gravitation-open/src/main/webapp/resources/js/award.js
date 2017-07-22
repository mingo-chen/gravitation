$(document).ready(function() {
	
			$("#amount").blur(function() {
				$.trophy.calculateTotal($("#price").val(), $("#amount").val());
			});
			// 方法定义
			$.trophy = {
				// 定义一个方法aa
				calculateTotal : function(price, amount) {
					var total = 0;
					var bignum1 = new BigDecimal(price.toString());  
					var bignum2 = new BigDecimal(amount.toString());
					total = bignum1.multiply(bignum2).setScale(2).toString();
					$("#total").val(total);
				},
				
			}
});