//方法定义 
$.util = {
	// 定义一个方法aa
	IsNum : function(num) {
		var reNum = /^\d*$/;
		return (reNum.test(num));
	},
	IsDouble : function(num) {
		var reNum = /^\d*\.\d*$/;
		return (reNum.test(num));
	},
    deleteTr : function(nowTr){ 
       $(nowTr).parent().parent().remove(); 
    },
    isNull: function(str){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
}
