Utils = {};

Utils.bindProps = function(viewElem, props, direct) {

	//收集
	function collect(props) {
		$(viewElem).find("input").each(function(index, elem) {
			elem = $(elem);
			if (!elem.attr("name")) {
				return;
			}
			if(typeof(props[elem.attr("name")])=='undefined'){
				return;
			}
			
			switch (elem.attr("type")) {
			case "checkbox":
				if (elem.attr("checked")) {
					if (elem.attr("group")) {
						var data = props[elem.attr("name")];
						if (!data) {
							data = props[elem.attr("name")] = [];
						}
						props[elem.attr("name")][data.length] = elem.val();
					} else {
						props[elem.attr("name")] = elem.val();
					}
				}else{
					if (!elem.attr("group")) {
						props[elem.attr("name")] = "";
					}
				}
				break;
			case "radio":
				if (elem.attr("checked")) {
					props[elem.attr("name")] = elem.val();
				}
				break;
			default:
				props[elem.attr("name")] = elem.val();
			}

		});
		
		$(viewElem).find("select").each(function(index, elem){
			if(typeof(props[$(elem).attr("name")])=='undefined'){
				return;
			}
			props[$(elem).attr("name")] = $(elem).val();
		});
		$(viewElem).find("textarea").each(function(index, elem){
			if(typeof(props[$(elem).attr("name")])=='undefined'){
				return;
			}
			props[$(elem).attr("name")] = $(elem).val();
		});
	}

	//填充
	function fillElem(elem, data) {
		var patten = /^\d{1,}\.[0][A-Z]{3}$/;
		if(patten.test(data)){
			data=data.substring(0,data.length-5)+data.substring(data.length-3,data.length);
		}
		if(data + ""=="0.0"){
			data=0;
		}
		if(data + ""=="1.0"){
			data=1;
		}
		if (elem.attr("type") == "checkbox" || elem.attr("type") == "radio") {
			var val = $(elem).val() + "";
			if (val == (data + "")) {
				elem.attr("checked", true);
			}
		} else if (elem.is("input") || (elem.is("textarea")) || (elem.is("select"))) {
			if(data && data.time){
				var d=new Date(data.time);
				data=d.toDate();
			}
			elem.val(data);
		} else {
			elem.html(data);
		}
	}

	//填充
	function fill(props) {
		var elems = {};
		for ( var p in props) {
			elems = $(viewElem).find("[name='" + p + "']");
			if (elems.lenght <= 0) {
				break;
			}

			// is array
			if ($.isArray(props[p])) {
				$.each(props[p],function(index,data){
				    $(elems).each(function(index,elem){
				    	
				    	if($(elem).val() == (data + "")){
				    		fillElem($(elem),data);
				    	}
				    });
				});
			} else {
				elems.each(function(index, elem) {
					fillElem($(elem), props[p]);
				});
			}
		}
	}

	if (direct) {
		fill(props);
	} else {
		collect(props);
	}
};

//填充属性
Utils.fillProps = function (viewElem, props) {
	Utils.bindProps(viewElem, props, true);
}
//收集属性
Utils.collectProps = function (viewElem, props) {
	Utils.bindProps(viewElem, props, false);
}