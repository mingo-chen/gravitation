/*部分代码依赖util.js*/
;
(function ($) {
    var ie = $.browser.msie,
        iev = $.browser.version,
        ie6 = ie && iev < 7,
        ie7 = ie && iev == 7,
        ie8 = ie && iev > 7,
        ie67 = ie6 || ie7,
        ie68 = ie6 || ie8,
        ff = $.browser.mozilla,
        ie11 = ff && iev == 11,
        ff2 = ff && !(iev == 11) && navigator.userAgent.toLowerCase().match(/firefox\/([\d.]+)/)[1].charAt(0) - 3 < 0,
        safari = $.browser.safari,
        isAndroid = /Android/.test(navigator.userAgent),
        iPad = /iPad/.test(navigator.userAgent),
        iPhone = /iPhone/.test(navigator.userAgent),
        ismobile = isAndroid || iPad || iPhone,
        css3 = !ie6 && !ie7 && !ie8 && !ff2 ? true : false;
    $.meizu = {
        ie: ie,
        ie6: ie6,
        ie7: ie7,
        ie8: ie8,
        ie67: ie67,
        ie68: ie68,
        ie11: ie11,
        ff: ff,
        ff2: ff2,
        safari: $.browser.safari,
        ismobile: ismobile,
        zindex: 1e4,
        css3: css3
    };
    var html1 = '<span class="radioPic">&nbsp;</span>';
    var html2 = '<span class="checkboxPic"><i class="i_icon"></i></span>';

    /**
     * 自定义单选框插件
     * @param opt Object 设置时覆盖defaults的默认参数
     */
    function radio(opt) {
        var d1 = new Date().getTime();
        var defaults = {
            chkCls: "radio_chk",
            unChkCls: "radio_unchk",
            spanCls: "mzradio",
            click: null,
            host: null
        };
        var proto = this;
        this.options = $.extend(defaults, opt);
        this.options.host.each(function () {
            proto.bind($(this));
        });
        var d2 = new Date().getTime();
    }

    radio.prototype = {
        bind: function (radio) {
            var pic = $(html1),
                span = radio.hide().parent().prepend(pic),
                proto = this,
                opt = proto.options,
                host = opt.host;
            if (radio.get(0).checked) {
                pic.addClass(opt.chkCls);
                host.data("key", pic);
            } else {
                pic.addClass(opt.unChkCls);
            }
            var _click = function () {
                var con = $(this),
                    pic = $(con.find("span")[0]),
                    radio = $(con.find("input")[0]);
                if (!pic.hasClass(opt.chkCls)) {
                    proto.chose(radio);
                }
            };
            span.addClass(opt.spanCls).click(_click);
        },
        chose: function (radio, triger) {
            var opt = this.options,
                pic = $(radio.attr("checked", "checked").parent().find("span")[0]),
                key = opt.host.data("key");
            !triger && opt.click && opt.click.call(radio, {
                value: radio.val()
            });
            if (key) key.addClass(opt.unChkCls).removeClass(opt.chkCls);
            pic.addClass(opt.chkCls).removeClass(opt.unChkCls);
            opt.host.data("key", pic);
        },
        val: function (j) {
            if (j) this.setVal(j);
            else return this.getVal();
        },
        setVal: function (val, canClick) {
            var proto = this,
                host = proto.options.host;
            host.each(function () {
                if (val == this.value) {
                    proto.chose($(this), canClick ? false : true);
                    return false;
                }
            });
        },
        getVal: function () {
            var val;
            this.options.host.each(function () {
                if (this.checked) {
                    val = this.value;
                    return false;
                }
            });
            return val;
        }
    };
    /**
     * 自定义复选框插件
     * @param opt Object 设置时覆盖defaults的默认参数
     *//*
    function checkbox(opt) {
        var defaults = {
            chkCls: "check_chk",
            unChkCls: "check_unchk",
            spanCls: "checkbox",
            click: null,
            host: null,
            serverInit: false
        };
        this.options = $.extend(defaults, opt);
        var proto = this,
            host = this.options.host,
            all = host.length;
        if (!all) return;
        if (this.options.serverInit) {
            this._fastBind2();
        } else if (all > 15) {
            this._fastBind1();
        } else {
            for (var i = 0; i < all; i++) {
                this.bind($(host[i]), false);
            }
        }
    }

    checkbox.prototype = {
        chose: function (cbox, chose, nochose) {
            var opt = this.options,
                pic = $(cbox.parent().find("span")[0]);
            if (!nochose && (chose || !pic.hasClass(opt.chkCls))) {
                pic.removeClass(opt.unChkCls).addClass(opt.chkCls);
                cbox.attr("checked", "checked");
            } else {
                pic.removeClass(opt.chkCls).addClass(opt.unChkCls);
                cbox.removeAttr("checked");
            }
        },
        _fastBind1: function () {
            var _self = this,
                opt = _self.options,
                host = opt.host,
                all = host.length;
            for (var i = 0; i < all; i++) {
                var cbox = $(host[i]),
                    pic = $(html2);
                cbox.hide().parent().prepend(pic);
                _self._oBind(cbox, pic, opt.chkCls, opt.unChkCls);
            }
            setTimeout(function () {
                for (var j = 0; j < all; j++) {
                    var cbox = $(host[j]),
                        span = cbox.parent();
                    _self._eBind(cbox, span, false, opt.spanCls);
                }
            }, 10);
        },
        _fastBind2: function () {
            var _self = this,
                host = _self.options.host,
                spanCls = _self.options.spanCls,
                all = host.length;
            for (var j = 0; j < all; j++) {
                var cbox = $(host[j]),
                    span = cbox.parent();
                _self._eBind(cbox, span, false, spanCls);
            }
        },
        _eBind: function (cbox, span, isnew, spanCls) {
            var proto = this;
            if (isnew) proto.options.host.push(cbox[0]);
            var _click = function (e) {
                proto.chose(cbox);
                return proto.options.click && proto.options.click.call(cbox[0], {
                    value: cbox.val(),
                    checked: cbox.attr("checked")
                }, e);
            };
            span.click(_click).addClass(spanCls);
        },
        _oBind: function (cbox, pic, chkCls, unChkCls) {
            if (cbox.get(0).checked) {
                pic.addClass(chkCls);
            } else {
                pic.addClass(unChkCls);
            }
        },
        bind: function (cbox, isnew) {
            var pic = $(html2),
                span = cbox.hide().parent().prepend(pic),
                opt = this.options,
                host = opt.host;
            this._oBind(cbox, pic, this.options.chkCls, this.options.unChkCls);
            this._eBind(cbox, span, isnew, opt.spanCls);
        },
        val: function (j) {
            if (j && j.length) {
                this.setVal(j);
            } else {
                return this.getVal();
            }
        },
        setVal: function (j) {
            if (!j || !j.length) return;
            var host = this.options.host;
            for (var i = 0, k = j.length; i < k; i++) {
                for (var ci = 0, ck = host.length; ci < ck; ci++) {
                    if (host[ci].value == j[i]) this.chose($(host[ci]), true);
                }
            }
        },
        getVal: function () {
            var host = this.options.host,
                ay = [];
            for (var i = 0, j = host.length; i < j; i++) {
                if (host[i].checked) ay.push(host[i].value);
            }
            return ay;
        },
        checkAll: function () {
            var host = this.options.host;
            for (var i = 0, j = host.length; i < j; i++) {
                this.chose($(host[i]), true);
            }
        },
        uncheckAll: function () {
            var host = this.options.host;
            for (var i = 0, j = host.length; i < j; i++) {
                this.chose($(host[i]), true, true);
            }
        },
        uncheck: function (val) {
            if (!val) return;
            var host = this.options.host;
            for (var i = 0, j = host.length; i < j; i++) {
                if (host[i].value == val) {
                    this.chose($(host[i]), true, true);
                    return;
                }
            }
        },
        size: function () {
            return this.options.host.length;
        }
    };*/
    /**
     * 弹出面板构造器，用于下拉框的背景
     * @param jop Object 设置参数覆盖opt中的对象
     * @returns {*}
     */
    function makeLayOuter(jop) {
        var opt = $.extend({
            start: false,
            end: false,
            host: null,
            position: "cover",
            fJobj: false,
            timeout: 500
        }, jop);
        $("body").append("<div id='meizuSelectID_" + (makeLayOuter.uuid += 1) + "' class='mzContainer'></div>");
        var layOuter = $("#meizuSelectID_" + makeLayOuter.uuid).html("&nbsp;");
        layOuter.data("isIn", false).data("abled", true);
        opt.fJobj && opt.fJobj.bind("click", {
            opt: opt,
            lay: layOuter
        }, makeLayOuter._fns["_show"]);
        opt.host.bind("click", {
            opt: opt,
            lay: layOuter,
            xlen: opt.xlen,
            ylen: opt.ylen
        }, makeLayOuter._fns["_show"]);
        makeLayOuter._hover(layOuter, opt.host, opt.timeout, opt.end);
        makeLayOuter._hover(layOuter, layOuter, opt.timeout, opt.end);
        return layOuter;
    }

    makeLayOuter._fns = {
        _outFn: function (e) {
            var lay = e.data.lay.data("isIn", false);
            setTimeout(function () {
                if (!lay.data("isIn")) {
                    lay.hide();
                    e.data.end && e.data.end();
                }
            }, e.data.delay);
        },
        _inFn: function (e) {
            e.data.lay.data("isIn", true);
        },
        _show: function (e) {
            var opt = e.data.opt,
                lay = e.data.lay;
            opt.start && opt.start();
            if (!lay.data("abled")) return;
            var host = $(this),
                pos = host.offset(),
                sh = opt.position === "cover" ? pos.top : pos.top + host.height(),
                left = pos.left + (opt.xlen ? opt.xlen : 0),
                top = sh + (opt.ylen ? opt.ylen : 0);
            lay.css({
                left: left,
                top: top
            }).show();
            e.data.opt.curObj = host;
        }
    };
    makeLayOuter._close = function (lay, end) {
        lay.data("isIn", false);
        lay.hide();
        end && end();
    };
    makeLayOuter._hover = function (lay, target, delay, end) {
        var param = {
            lay: lay,
            delay: delay,
            end: end
        };
        target.mouseenter(param, makeLayOuter._fns["_inFn"]).mouseleave(param, makeLayOuter._fns["_outFn"]);
    };
    makeLayOuter._unHover = function (j) {
        j.unbind("mouseenter", makeLayOuter._fns["_inFn"]).unbind("mouseleave", makeLayOuter._fns["_outFn"]).unbind("click", makeLayOuter._fns["_show"]);
    };
    makeLayOuter.html = function (c) {
        var opt = $.extend({
            jdom: null,
            html: null,
            maxH: 0,
            width: 0,
            hostw: 0
        }, c);
        if (!opt.jdom || !opt.html) return 0;
        opt.jdom.empty().append(opt.html);
        var w = opt.jdom.width(),
            sw = opt.hostw,
            h = opt.jdom.height();
        if (opt.hostw && w < sw) w = sw;
        if (opt.maxH && h >= opt.maxH) {
            opt.jdom.css({
                height: opt.maxH + "px",
                overflowY: "scroll"
            });
            w += 10;
        }
        if (opt.width) w = opt.width;
        return w;
    };
    makeLayOuter.uuid = 0;
    /**
     * 自定义下拉框插件
     * @param opt Object 设置时覆盖defaults的默认参数
     */
    function select(opt) {
        var defaults = {
            click: "",
            data: "",
            maxH: "",
            itemOver: "mzItemOver",
            pos: "down",
            chgHost: false,
            width: false,
            disClk: false,
            start: false,
            end: false,
            focus: null,
            nowidth: true,
            needTitle: false,
            itemChk: "mzItemChecked",
            timeout: 500,
            xlen: 0,
            ylen: 0
        };
        this.options = $.extend(defaults, opt);
        var opt = this.options;
        opt.host.data("lj", makeLayOuter({
            host: opt.host,
            start: opt.start,
            end: opt.end,
            position: opt.pos,
            fJobj: opt.focus,
            xlen: opt.xlen,
            ylen: opt.ylen
        }));
        this.options.curObj = this.options.host;
        this.reload(opt.data, false, true);
    }

    select.prototype = {
        addHost: function (j) {
            var opt = this.options,
                lay = opt.host.data("lj");
            makeLayOuter._hover(lay, j, opt.timeout, opt.end);
            j.bind("click", {
                opt: opt,
                lay: lay
            }, makeLayOuter._fns["_show"]);
        },
        rmvHost: function (j) {
            makeLayOuter._unHover(j);
        },
        close: function () {
            var opt = this.options;
            makeLayOuter._close(opt.host.data("lj"), opt.end);
        },
        reload: function (j, isHtml, isInit) {
            var proto = this,
                opt = proto.options,
                host = opt.host,
                lj = host.data("lj").css({
                    height: "auto",
                    overflowY: "",
                    cursor: "pointer"
                }),
                ay = [];
            if (!isHtml) {
                ay.push("<ul>");
                if (j && j.length) {
                    for (var m = 0, n = j.length; m < n; m++) {
                        var unit = j[m];
                        ay.push("<li onclick='javascript:void(0)' class='mzSelectLi " + (unit["selected"] ? opt["itemChk"] : "") + "' ivalue='" + unit.value + "'><div class='" + (unit.title ? " longdot" : "") + "'title='" + (unit.title ? unit.title : unit.text) + "'>" + unit.text + "</div></li>");
                    }
                }
                ay.push("</ul>");
                opt.jsondatas = j;
            }
            var w = makeLayOuter.html({
                jdom: lj,
                html: isHtml ? j : ay.join(""),
                maxH: opt.maxH,
                width: opt.width,
                hostw: opt.nowidth ? 0 : host.width()
            });
            if (isInit) this._eventBind(opt, host, w);
        },
        setVal: function (val) {
            if (this.options.jsondatas) {
                for (var i = 0, j = this.options.jsondatas.length; i < j; i++) {
                    if (this.options.jsondatas[i].value == val) {
                        this.options.jsondatas[i].selected = true;
                    } else {
                        this.options.jsondatas[i].selected = false;
                    }
                }
                this.reload(this.options.jsondatas);
            }
        },
        getVal: function () {
            if (this.options.jsondatas) {
                for (var i = 0, j = this.options.jsondatas.length; i < j; i++) {
                    if (true == this.options.jsondatas[i].selected) {
                        return this.options.jsondatas[i].value;
                    }
                }
            }
        },
        _eventBind: function (opt, host, w) {
            var proto = this;
            $("li", host.data("lj")).each(function () {
                $(this).width(w);
            }).live("click mouseenter mouseleave", function (event) {
                if (event.type == "click") {
                    if (!opt.disClk) {
                        host.data("lj").hide();
                    }
                    var jobj = $(this),
                        val = jobj.attr("ivalue"),
                        text = jobj.text();
                    opt.click && opt.click.call(proto.options.curObj, {
                        value: val,
                        text: text,
                        jobj: host
                    });
                    proto.setVal(val);
                } else if (event.type == "mouseenter") {
                    $(this).addClass(opt.itemOver);
                } else if (event.type == "mouseleave") {
                    $(this).removeClass(opt.itemOver);
                }
            });
        },
        html: function (j) {
            if (!j) return;
            return this.reload(j, true);
        },
        disable: function () {
            this.options.host.data("lj").data("abled", false);
        },
        enable: function () {
            this.options.host.data("lj").data("abled", true);
        },
        remove: function () {
            var lj = this.options.host.data("lj");
            lj.children().each(function () {
                $(this).unbind();
            });
            lj.empty().remove();
            this.options.host.removeData("lj");
            this.options.host = null;
            this.options = null;
        }
    };
    /*返回顶部*/
    $.scrollToTop = function (scrollTo, time) {
        $("body").append('<a id="scrollToTop" title="返回顶部" href="javascript:void(0);" style="visibility: visible;"></a>');
        var winW = $(window).width(), scrollTopIcon = $("#scrollToTop");
        var scrollTop_right = 16, notWebkit = false, ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("rv:") != -1 || ua.indexOf("msie") != -1) notWebkit = true;
        var ltIE10 = $.browser.msie && ($.browser.version <= 10);

        function scroll(scrollTo, time) {
            var scrollFrom = parseInt(notWebkit ? document.documentElement.scrollTop : document.body.scrollTop), i = 0, runEvery = 5; // run every 5ms
            scrollTo = parseInt(scrollTo);
            time /= runEvery;
            if (ltIE10) time /= runEvery;
            var interval = setInterval(function () {
                i++;
                if (notWebkit) {
                    document.documentElement.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
                } else {
                    document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
                }
                if (i >= time) {
                    clearInterval(interval);
                }
            }, runEvery);
        }

        if (scrollTop_right < 0) scrollTop_right = 0;
        if (scrollTopIcon.length > 0) {
            scrollTopIcon.css({"right": scrollTop_right});
            $(window).scroll(function () {
                if ($(this).scrollTop() <= 80) {
                    scrollTopIcon.css({"display": "block", "visibility": "hidden"}).fadeOut(0);
                } else {
                    if (!scrollTopIcon.is(":visible")) {
                        scrollTopIcon.css({"visibility": "visible"}).fadeIn(300);
                    }
                }
            });
            scrollTopIcon.click(function (e) {
                var scrollTo = !!scrollTo || 0, time = !!time || 250;
                scroll(scrollTo, time);
            });
            $(window).resize(function (e) {
                var scrollRight = 16;
                scrollTop_right = ($(window).width() - 1000) / 2 - 100;
                if (scrollTop_right < 0) scrollRight = 0;
                scrollTopIcon.css({"right": scrollRight});
            });
        }
    };
    /**
     * 构造分页的函数
     * @param o Object 设置分页参数
     * @returns {pager}
     */
    function pager(o) {
        var _self = this.reload(o);
        var pageClick = function (page) {
            var opt = _self.options;
            if (opt.callBack) {
                /*if (!_self.block) {
                 var _tmp = _self.options.host, w = _tmp.width(), h = _tmp.height(), oset = _tmp.offset(), l = oset.left, t = oset.top;
                 _tmp.addClass("overOpac5");
                 _self.block = $("<div></div>").appendTo($(document.body)).css({
                 width: w,
                 height: h,
                 left: l,
                 top: t,
                 fontSize: "18px",
                 position: "absolute",
                 paddingLeft: "100px"
                 });
                 } else {
                 var _tmp = _self.options.host, w = _tmp.width(), h = _tmp.height(), oset = _tmp.offset(), l = oset.left, t = oset.top;
                 _self.block.css({
                 width: w,
                 height: h,
                 left: l,
                 top: t,
                 fontSize: "18px",
                 position: "absolute",
                 paddingLeft: "100px"
                 }).show();
                 }*/
                _self.options.pagenumber = page;
                opt.callBack(page);
            } else {
                var gpage = opt.toPage + Number(page);
                window.location = gpage;
            }
        };
        $("a", _self.options.host).die().live("click", function () {
            var J = $(this);
            var opt = _self.options;
            if (J.hasClass("liNoThisClass")) {
                var page = 0;
                page = $.trim(J.text() + "") - 0;
                if (!page) {
                    page = $.trim(J.attr("rno")) - 0;
                }
                if (page !== opt.pagenumber) {
                    pageClick.call(null, page);
                }
            } else if (J.hasClass("pre")) {
                if (opt.pagenumber !== 1) {
                    pageClick.call(null, opt.pagenumber - 1);
                }
            } else if (J.hasClass("next")) {
                if (opt.pagenumber !== opt.pagecount) pageClick.call(null, opt.pagenumber + 1);
            }
        });
        return this;
    }

    pager.prototype = {
        block: null,
        reload: function (o) {
            this.options = $.extend(this.options ? this.options : {
                pagenumber: 1,
                pagecount: 1,
                maxPage: 5,
                pageSize: 10,
                totalCount: 1,
                callBack: null,
                toPage: null,
                noLF: false
            }, o);
            this.options.pagecount = Math.ceil(this.options.totalCount / this.options.pageSize);
            this.html(this.options.callBack ? true : false, this.options.host, parseInt(this.options.pagenumber), parseInt(this.options.pagecount), this.options.maxPage, this.options.noLF);
            if (this.block) {
                this.options.host.removeClass("overOpac5");
                this.block.hide();
            }
            return this;
        },
        getCurPage: function () {
            return this.options.pagenumber;
        },
        html: function (ajax, host, pno, pc, mp, noLF) {
            var $pager = $('<div class="pageDiv"></div>'),
                buffer = [],
                bText = ajax ? "javascript:void(0)" : "#",
                from = 1,
                to = parseInt(mp),
                temp = [];
            if (pc < 2) {
                host.empty();
                return;
            }
            var offset = Math.floor(mp * 0.5);
            if (mp > pc) {
                from = 1;
                to = pc;
            } else {
                from = pno - offset;
                to = from + mp - 1;
                if (from < 1) {
                    to = pno + 1 - from;
                    from = 1;
                    if (to - from < mp) {
                        to = mp;
                    }
                } else if (to > pc) {
                    from = pc - mp + 1;
                    to = pc;
                }
            }
            // if (!noLF && pno > 1) {
            // buffer.push("<a class='pre bRadius2' href='" + bText + "'>" + (window["G_isCht"] ? "上一頁" : "上一页") + "</a>");
            // }
            if (from != 1 && pno != from && pc > mp) {
                buffer.push("<a class='bRadius2 liNoThisClass' href='" + bText + "' rno='1'>" + (noLF ? "<" : 1) + "</a>");
                buffer.push("<a class='bRadius0 pomit' href='javascript:void(0)'>...</a>");
                from += 2;
            }
            if (to != pc && pno != to && pc > mp) {
                temp.push("<a class='bRadius0 pomit' href='javascript:void(0)'>...</a>");
                temp.push("<a class='bRadius2 liNoThisClass' href='" + bText + "' rno='1'>" + (noLF ? "<" : pc) + "</a>");
                to -= 2;
            }
            for (var i = from; i <= to; i++) {
                buffer.push("<a class='" + (i == pno ? "selected bRadius0" : "liNoThisClass bRadius2") + "' href='" + bText + "'>" + i + "</a>");
            }
            buffer = buffer.concat(temp);

            if (!noLF && pno < pc) {
                buffer.push("<a class='next bRadius2' href='" + bText + "'>" + (window["G_isCht"] ? "下一頁" : "下一页") + "</a>");
            }
            $pager.append(buffer.join(""));
            host.empty().append($pager);
        }
    };

    function dialog(c) {
        var defaults = {
            host: null,
            width: false,
            height: false,
            nohide: true
        };
        this.options = $.extend(defaults, c);
    }

    dialog.uuid = 0;
    dialog.prototype = {
        _createBtns: function (winDiv) {
            var _self = this;
            if (this.options.closeBtn) {
                winDiv.append($('<div class="mzClose"></div>').click(function () {
                    _self.close();
                    $.isFunction(_self.options.closeBtn) && _self.options.closeBtn.call();
                }));
            }
        },
        open: function () {
            var _self = this;
            var opt = this.options;
            var blockID = opt.blockID;
            if (!this.options.blockID) {
                blockID = opt.blockID = $.block.open(opt.nohide);
                if ($.isFunction(opt.blkClose)) {
                    $("#" + blockID).on("click", opt.blkClose);
                }
            } else {
                $.block.reOpen(opt.blockID, opt.nohide);
            }
            var block = $("#" + blockID);
            var winDiv;
            if (!opt.winid) {
                $(document.body).append($('<div class="mzdialog" id="mzdialog' + (dialog.uuid += 1) + '"></div>').append(this.options.host));
                this.options.winid = "mzdialog" + dialog.uuid;
                winDiv = $("#" + this.options.winid);
                this._createBtns(winDiv);
                $.mzAddResize({
                    winDiv: winDiv,
                    blockID: blockID
                }, function (data) {
                    var block = $("#" + data.blockID),
                        w = data.winDiv.width(),
                        h = data.winDiv.height();
                    data.winDiv.css({
                        left: ($(window).width() - w > 0 ? $(window).width() - w : 1) / 2 + "px",
                        top: ($(window).height() - h > 0 ? $(window).height() - h : 1) / 2 + block.data("sTop") + "px"
                    });
                });
            } else {
                winDiv = $("#" + this.options.winid);
            }
            var style = {
                width: opt.width,
                height: opt.height,
                zIndex: $.meizu.zindex += 1,
                position: "absolute",
                left: ($(window).width() - opt.width > 0 ? $(window).width() - opt.width : 1) / 2 + "px",
                top: ($(window).height() - opt.height > 0 ? $(window).height() - opt.height : 1) / 2 + block.data("sTop") + "px"
            };
            winDiv.css(style).show();
        },
        resize: function (w, h) {
            var winDiv = $("#" + this.options.winid),
                block = $("#" + this.options.blockID);
            var style = {
                width: w,
                height: h,
                left: ($(window).width() - w > 0 ? $(window).width() - w : 1) / 2 + "px",
                top: ($(window).height() - h > 0 ? $(window).height() - h : 1) / 2 + block.data("sTop") + "px"
            };
            winDiv.css(style).show();
        },
        close: function () {
            if ($.browser.msie && ($.browser.version == "7.0" || $.browser.version == "6.0")) {
                $("body").css("overflow", "hidden");
            }
            $.block.close(this.options.blockID);
            $("#" + this.options.winid).hide();
        }
    };
    $.fn.extend({
        mzRadio: function (c) {
            c = $.extend({}, c, {
                host: $(this)
            });
            return new radio(c);
        },
        mzCheckBox: function (c) {
            c = $.extend({}, c, {
                host: $(this)
            });
            return new checkbox(c);
        },
        mzSelect: function (c) {
            c = $.extend({}, c, {
                host: $(this)
            });
            return new select(c);
        },
        mzDialog: function (c) {
            c = $.extend({}, c, {
                host: $(this)
            });
            return new dialog(c);
        },
        pager: function (c) {
            c = $.extend({}, c, {
                host: $(this)
            });
            return new pager(c);
        }
    });
    /**
     * 禁用tab键，供遮罩层使用
     * @param b Boolean
     */
    $.disTab = function (b) {
        $(document).data("keyTab", b);
        $(window.document).bind("keydown", function (e) {
            e = e ? e : window.event;
            if (9 == e.keyCode) {
                return !$(document).data("keyTab");
            }
        });
    };
    $.block = {
        uuid: 0,
        getWH2: function () {
            return {
                width: $(window).width(),
                height: $(document).height()
            };
        },
        getWH: function () {
            var w = 0,
                h = 0;
            if ($.meizu.ie) {
                h = $(document.documentElement).height();
                w = $(document.documentElement).width();
            } else if (window.innerHeight) {
                h = window.innerHeight;
                w = window.innerWidth;
            } else if (document.documentElement && document.documentElement.clientHeight) {
                h = document.documentElement.clientHeight;
                w = document.documentElement.clientWidth;
            }
            return {
                width: w,
                height: h
            };
        },
        open: function (nohide) {
            var block = $('<div id="mzBlockLayer' + ($.block.uuid += 1) + '" class="mzBlockLayer" style=" z-index: ' + ($.meizu.zindex += 1) + '; "> </div>');
            var htdy = $($.meizu.ie ? "html" : "body");
            htdy.data("sTop", Math.max($(document).scrollTop(), $("body").scrollTop()));
            !nohide && htdy.data("overflow", htdy.css("overflow")).css({
                overflow: "hidden"
            });
            var wh = !nohide ? this.getWH() : this.getWH2();
            $(document.body).append(block);
            block.css({
                height: wh.height,
                width: wh.width,
                display: "block"
            }).data("sTop", htdy.data("sTop"));
            !nohide && block.css("top", htdy.data("sTop"));
            $.disTab(true);
            $.mzAddResize({
                block: block,
                nohide: nohide
            }, function (data) {
                var htdy = $($.meizu.ie ? "html" : "body");
                var wh = !data.nohide ? $.block.getWH() : $.block.getWH2();
                data.block.css({
                    height: wh.height,
                    width: wh.width
                });
            });
            return "mzBlockLayer" + $.block.uuid;
        },
        reOpen: function (id, nohide) {
            var htdy = $($.meizu.ie ? "html" : "body");
            htdy.data("sTop", Math.max($(document).scrollTop(), $("body").scrollTop()));
            !nohide && htdy.data("overflow", htdy.css("overflow")).css({
                overflow: "hidden"
            });
            var wh = !nohide ? this.getWH() : this.getWH2();
            var block = $("#" + id);
            block.css({
                height: wh.height,
                width: wh.width,
                display: "block"
            }).data("sTop", htdy.data("sTop"));
            !nohide && block.css("top", htdy.data("sTop"));
            $.disTab(true);
        },
        close: function (id) {
            var htdy = $($.meizu.ie ? "html" : "body");
            if ("hidden" != htdy.data("overflow")) htdy.removeAttr("style");
            $("#" + id).hide();
            $.disTab(false);
        }
    };
    /**
     * 构造遮罩层函数，一般不单独使用，主要为弹出框提供遮罩
     * @param msg String
     */
    $.blockUI = function (msg) {
        $.blockUI.cid = $.block.open();
        var message = window.resBlockUI && window.resBlockUI.processing ? window.resBlockUI.processing : window["G_isCht"] ? "正在處理，請稍候..." : "正在处理，请稍候..";
        message = msg ? msg : message;
        var block = $("#" + $.blockUI.cid),
            zindex = block.css("zIndex") + 1,
            left = (block.width() - 315 > 0 ? block.width() - 315 : 1) / 2 + "px",
            top = (block.height() - 30 > 0 ? block.height() - 30 : 1) / 2 + block.data("sTop") + "px";
        $("body").append('<div style="top:' + top + ";left:" + left + ";z-index:" + zindex + ';" id="blockUICenter">' + message + "</div>");
    };
    $.unblockUI = function () {
        $.block.close($.blockUI.cid);
        $("#" + $.blockUI.cid).remove();
        $("#blockUICenter").remove();
    };
    $.mzAddResize = function (p, fn) {
        $.mzAddResize.param.push(p);
        $.mzAddResize.queue.push(fn);
    };
    $.mzAddResize.queue = [];
    $.mzAddResize.param = [];
    function _createNewDia(type, msg, title, config) {
        title = title ? title : '提示';
        var nohide = config && config.nohide;
        var $oldDia = window[type].$dia;
        if (!nohide && $oldDia) {
            $oldDia.open();
            var host = $oldDia.options.host;
            $('.alertDialogTitleTip', host).text(title);
            $('.alertDialogContent', host).html(msg);
            return $oldDia;
        }
        var btnField = '';
        switch (type) {
            case 'jAlert':
                btnField = '<a class="fullBtnBlue alertDialogSure">' + (config && config.sure || '确定') + '</a>';
                break;
            case 'jConfirm':
                btnField = '<a class="fullBtnBlue conFDialogSure">' + (config && config.sure || '确定') + '</a>' +
                    '<a class="fullBtnGray conFDialogCancel">' + (config && config.cancel || '取消') + '</a>';
                break;
        }
        var html = '<div class="alertDialog">' +
            '<div class="alertDialogTitle">' +
            '<label class="alertDialogTitleTip">' + title + '</label>' +
            '<a class="alertDialogClose">' +
            '<i class="i_icon"></i>' +
            '</a>' +
            '</div>' +
            '<div class= "alertDialogMain">' +
            '<div class="alertDialogContent">' + msg + '</div>' +
            '</div>' +
            '<div class="alertDialogBtnField">' +
            btnField +
            '</div>' +
            '</div>';
        var $html = $(html);
        $html.appendTo($(document.body));
        var $dia = $html.mzDialog({
            nohide: true,
            width: 420,
            height: 250
        });
        if ($oldDia) {
            $oldDia.remove();
        }
        window[type].$dia = $dia;
        return $dia;
    }

    /**
     * 不解释，常用的模态框
     * @param msg
     * @param title
     * @param callback
     * @param config
     */
    window['jAlert'] = function (msg, title, callback, config) {
        var $dia = _createNewDia('jAlert', msg, title, config);
        $dia.open();
        var host = $dia.options.host;
        $('.alertDialogClose', host).unbind().click(function () {
            $dia.close();
        });
        $(".alertDialogSure", host).unbind().click(function () {
            $dia.close();
            $.isFunction(callback) && callback();
        });
    };
    window['jConfirm'] = function (msg, title, callback, config) {
        var $dia = _createNewDia('jConfirm', msg, title, config);
        $dia.open();
        var host = $dia.options.host;
        $('.alertDialogClose', host).unbind().click(function () {
            $dia.close();
            return false;
        });
        $(".conFDialogSure, .conFDialogCancel", host).unbind().click(function () {
            $dia.close();
            $.isFunction(callback) && callback.call(window, $(this).hasClass("conFDialogSure"));
            return false;
        });
    };
})(jQuery);

;
(function ($) {
    /**
     * 下拉框插件
     * @param opts  Object 用于覆盖defaults缺省配置
     * @constructor
     */
    function Dropdown(opts) {
        var $this = $(this),
            defaults = {
                "wrap": "this",//下拉列表用什么包裹，"this"为按钮自身，主流的插件放在"body"中
                "data": null,
                "formName": "",
                "zIndex": 999
            },
            id = $this.attr("id"),
            tName = $this.attr("name"),
            height = $this.outerHeight(),
            liArray = [],
            aTop = height / 2 - 3,
            haveDropdown = $this.data("value") !== undefined;
        var opt = $.extend(true, defaults, opts);
        var name = !!opt.formName ? opt.formName : !!tName ? tName : id;
        if (!haveDropdown) {
            $this.css("position", "relative").append("<i class='dropdown_arrow' style='top:" + aTop + "px; right:10px'></i>");
            if ($this.find("span").length < 1) {
                $this.append("<span></span>");
            }
            $this.append("<input type='hidden' name='" + name + "'>");
        }
        var $dropdown_menu = $(".dropdown_menu[data-target='#" + id + "']");
        if ($dropdown_menu.length < 1 && !!opt.data && !haveDropdown) {
            var wrap;
            if (opt.wrap == "this") {
                wrap = $this.css("zIndex", opt.zIndex);
            } else {
                wrap = $(opt.wrap)
            }
            wrap.append("<ul class='dropdown_menu' data-target='#" + id + "'></ul>")
        }
        var $menu = $(".dropdown_menu[data-target='#" + id + "']").hide().css({"position": "absolute", "zIndex": opt.zIndex});
        if (!!opt.data) {
            for (var i = 0; i < opt.data.length; i++) {
                liArray.push("<li data-text='" + opt.data[i].text + "' data-value='" + opt.data[i].value + "' >" + opt.data[i].text + "</li>");
            }
            $menu.html(liArray.join(""));
        }
        BindEvents($this, $menu, true, opt);
    }

    function Reload(data, opt) {
        var $this = $(this),
            id = $this.attr("id"),
            $menu = $(".dropdown_menu[data-target='#" + id + "']"),
            liArray = [],
            defaults = {
                "wrap": "this",
                "data": null,
                "formName": "",
                "zIndex": 999
            };
        var opts = $.extend(true, defaults, opt);
        if (typeof data != "object") {
            return
        }
        for (var i = 0; i < data.length; i++) {
            liArray.push("<li data-text='" + data[i].text + "' data-value='" + data[i].value + "' >" + data[i].text + "</li>");
        }
        $menu.html(liArray.join(""));
        BindEvents($this, $menu, false, opts);
    }

    function setValue(text, value) {
        var $this = $(this);
        $this.data("value", value).find("span:eq(0)").html(text).end().find("input:hidden").val(value);
    }

    function setDisable(val) {

    }

    function BindEvents($this, $menu, init, opt) {
        if (init) {
            $("body").on("click", function () {
                $menu.hide();
            });
        }
        $this.off("click").on("click", function () {
            var width = $this.outerWidth(),
                height = $this.outerHeight(),
                offset = $this.offset();
            var border = parseInt($menu.css("borderLeftWidth")) + parseInt($menu.css("borderRightWidth"));
            var padding = parseInt($menu.css("paddingLeft")) + parseInt($menu.css("paddingRight"));
            var top = (opt.wrap == "this") ? -parseInt($this.css("borderTopWidth")) : offset.top;
            var left = (opt.wrap == "this") ? -parseInt($this.css("borderLeftWidth")) : offset.left;
            $menu.css({"width": (width - border - padding), "top": top + height, "left": left}).show();
            $this.trigger("dropdown.show");
            return false;
        });
        $menu.delegate("li", "click", function () {
            var text = $(this).data("text");
            var value = $(this).data("value");
            setValue.call($this[0], text, value);
            $this.trigger("dropdown.set", [text, value]);
            $menu.hide();
            return false;
        }).delegate("li", "mouseenter", function () {
            $(this).addClass("cursor").siblings("li").removeClass("cursor");
        }).mouseleave(function () {
            $menu.hide();
        });
    }

    //初始化下拉组件的方法
    $.fn.dropdown = function (opts) {
        return this.each(function () {
            Dropdown.call(this, opts);
        });
    };
    //重载下拉框数据的方法
    $.fn.menuReload = function (data, opt) {
        return this.each(function () {
            Reload.call(this, data, opt);
        });
    };
    //设置下拉框的值
    $.fn.setValue = function (data) {
        return this.each(function () {
            setValue.call(this, data.text, data.value);
        });
    };
    $.fn.setDisable = function (val) {
        return this.each(function () {
            setDisable.call(this, val);
        });
    };
})(jQuery);

$(function () {
    /*窗口调整大小时调整弹出框位置*/
    $(window).resize(function () {
        var queue = $.mzAddResize.queue;
        var param = $.mzAddResize.param;
        for (var i = 0, j = queue.length; i < j; i++) {
            queue[i].call(window, param[i]);
        }
    });

    /*返回顶部*/
    $.scrollToTop();
    /*文本框和文本域失焦获焦及初始化文本框提示*/
    var $inputs = $(".input,.textarea");
    $inputs.live("focus", function () {
        var type = $(this).attr("type");
        if (type == "text") {
            $(this).addClass("input_focus");
        } else {
            $(this).addClass("textarea_focus");
        }
    }).live("blur", function () {
        var type = $(this).attr("type");
        if (type == "text") {
            $(this).removeClass("input_focus");
        } else {
            $(this).removeClass("textarea_focus");
        }
    });
    !!$inputs.placeholder && $inputs.placeholder();
    /*初始化复选框*/
    var $checkbox = $(":checkbox");
    var checkboxFn = $checkbox.mzCheckBox();
    checkboxFn.chose($checkbox);
    /*转义文本框和文本域的内容*/
    $(".J_encode").each(function () {
        /*依赖util.js*/
        var value = $(this).data("value");
        var text = $(this).data("text");
        if (value) {
            $(this).val(util.htmlEncode(value));
        } else if (text) {
            $(this).html(util.htmlEncode(text));
        }
    });
    /*文本折行*/
    $(".J_word_wrap").each(function () {
        var text = $(this).text();
        if (text) {
            $(this).html(text.replace(/\n|\r/g, '<br />'));
        }
    });
//    /*判断登录*/
//    var login = getCookie("_wiki_approved");
//    if (login != "" && "undefined" != typeof login && $("#_islogin").css("display") != "none") {
//        $.getJSON("/system/account/approved?_wiki_approved=" + login + "&jsoncallback=?", function (e) {
//            if (e.code == 200 && e.value == 2) {
//                $("#appManage").css("display", "inline-block");
//            }
//        })
//    }
//    if (pageStatus == "-1") {
//        jAlert("您还没有认证成为开发者，请先认证", "通知", function () {
//            $(window).trigger("resize");
//        });
//    } else if (pageStatus == "0") {
//        jAlert("亲爱的开发者<br />您的认证还在<span class='dialog_warning'>审核中</span>，请您耐心等待！", "审核中", function () {
//            /*触发窗口调整的事件，防止弹窗恢复时因为滚动条恢复导致布局变化*/
//            $(window).trigger("resize");
//        });
//    } else if (pageStatus == "1") {
//        var remark = approveRemark ? "原因：" : "";
//        jConfirm("抱歉<br />您的认证审核未通过。" + remark + "<br /><span class='dialog_error'> " + approveRemark + "</span>", "未通过认证", function (e) {
//            if (e) {
//                location.href = "https://open.flyme.cn/account/reRegister";
//            }
//            $(window).trigger("resize");
//        });
//        $(".conFDialogSure").html("重新认证");
//    } else if (pageStatus == "2") {
//        jAlert("亲爱的开发者<br />您的认证已经通过，可以发布您的应用了！", "通过验证", function () {
//            $(window).trigger("resize");
//        });
//    }
});