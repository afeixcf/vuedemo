let Conf = require('conf');
var Util = {
    //输出日志
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    rnd: function (min, max) {
        return Math.floor((max - min) * Math.random() + min)
    },
    // 将对象转化问URI字符串
    encodeURIObject: function (obj) {
        var retVal = "", i = 0;

        for (var _key in obj) {
            i++ && ( retVal += "&" );
            retVal += encodeURIComponent(_key);
            retVal += '=';
            retVal += encodeURIComponent(obj[_key]);
        }

        return retVal;
    },
    isWeChat: function () {
        if (window.navigator.userAgent.toLowerCase().match("micromessenger") || !!window.navigator.userAgent.match("MicroMessenger")) {
            return true
        }
        return false
    },
    getHostName: function (url) {
        var e = new RegExp("^(?:(?:https?|ftp):)?\/\/(?:[^@]+@)?([^:/#]+)", 'i'), matches = e.exec(url);
        return matches ? matches[1] : url;
    },

    getAbsUrl: function (url) {
        var a = document.createElement('a');
        a.href = url;

        var _result = /^(?:https?|ftp):\/\//i.test(a.href) ? a.href : a.getAttribute('href', 4);

        return _result ? _result : '';
    },

    parseURI: function (url) {
        var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
        // authority = '//' + user + ':' + pass '@' + hostname + ':' port
        return (m ? {
            href: m[0] || '',
            protocol: m[1] || '',
            authority: m[2] || '',
            host: m[3] || '',
            hostname: m[4] || '',
            port: m[5] || '',
            pathname: m[6] || '',
            search: m[7] || '',
            hash: m[8] || ''
        } : null);
    },
    //删除url参数
    delURIParam: function (url,paramKey){

        if(!url) return '';

        var hashMatch = url.match(/\!?\#[\s\S]*$/);
        var hashUrl ='' ;

        if(hashMatch && hashMatch.length>0){
            hashUrl = hashMatch[0];
            url =  url.replace(hashUrl,'');
        }

        var urlParam = (url.indexOf("?") <=-1) ? '' : url.substr(url.indexOf('?')+1);
        var beforeUrl = (url.indexOf("?") <=-1) ? url : url.substr(0,url.indexOf('?'));
        var nextUrl = '';

        var arr = new Array();
        var tempParamArr;

        if(urlParam!=''){
            var urlParamArr = urlParam.split('&');

            for(var i=0;i<urlParamArr.length;i++){
                tempParamArr = urlParamArr[i].split('=');
                if(tempParamArr[0]!=paramKey){
                    arr.push(urlParamArr[i]);
                }
            }
        }

        if(arr.length>0){
            nextUrl = "?"+arr.join("&");
        }
        url = beforeUrl+nextUrl+hashUrl;
        return url;
    },
    //增加URL参数
    addURIParam:function(url,paramKey,paramVal){

        if(!url) return '';

        var hashMatch = url.match(/\!?\#[\s\S]*$/);
        var hashUrl ='' ;

        if(hashMatch && hashMatch.length>0){
            hashUrl = hashMatch[0];
            url =  url.replace(hashUrl,'');
        }

        var andStr = "?";
        var beforeparam = url.indexOf("?");
        if(beforeparam != -1){
            andStr = "&";
        }
        return url + andStr + paramKey + "="+ encodeURIComponent(paramVal)+hashUrl;
    },

    editUrlParam:function(url,paramKey,paramVal){

        if(!url) return '';

        var _current_url = this.delURIParam(url,paramKey);

        return this.addURIParam(_current_url,paramKey,paramVal);

    },
    
    getSupportedStyle : function (supported, element) {
        var el = element ? element : document.createElement('div');

        for (var i = supported.length - 1; i >= 0; i--) {
            if (el.style[supported[i]] !== undefined) return supported[i];
        };
    },
    getTransSupportedCss3Perfix :function (){
        var _el = document.createElement('div');
        var supported = {
            attributes: ['WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'],
            prefixes: ['-webkit-', '-moz-', '-o-', '-ms-']
        };
        var _style = this.getSupportedStyle( supported.attributes,_el);
        if(!_style) return "";

        var _index = supported.attributes.indexOf(_style);
        return supported.prefixes[_index];
    },
    getTransitionEndEvent:function(){
        var t;
        var el = document.createElement('div');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd',
            'MsTransition':'msTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    },
    query : function (_url,_name) {
        var _url  = String(_url);

        var reg = new RegExp('(?:\\?|&)' + _name + '=([^&]+)'),
            res = _url.match(reg);
        return res ? res[1] : '';
    },
    extend: function() {
        for (var _rlt = {}, i = 0; i < arguments.length; i++)
            if (arguments[i] && "object" === typeof (arguments[i]))
                for (var o in arguments[i])
                    null != o && arguments[i].hasOwnProperty(o) && (_rlt[o] = arguments[i][o]);
        return _rlt
    },
    call: function(fn,targe) {
        
        var _target = targe ? targe :null
        var _fn = (typeof fn != 'function') ? function(){} :fn;
        
            for (var _args = [], i = 2; i < arguments.length; ++i){
                _args.push(arguments[i]);
            }
                
            _fn.apply(_target, _args)
    },

    isEmptyObject: function(obj) {
        return 0 === Object.keys(obj).length
    },
    isFunction: function(e) {
        return "function" == typeof e
    },
    isObject : function(obj) {
        var _type = typeof obj;
        return  _type === 'object' && !!obj;
    },
    isArray: function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    },
    getWechatVersion: function() {
        var _userAgent = this.getValueFromUserAgent("micromessenger/");
        return null === _userAgent && (_userAgent = ""),
            _userAgent
    },
    loadJs: function (url, async, loading, callback, errcallback) {

        loading && typeof loading == "function" && loading();

        var documentBody = document.body || document.getElementsByTagName("body")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.async = undefined == async ? true : async;

        script.onload = function () {
            callback && callback();
        }
        script.onerror = function () {
            errcallback && errcallback();
            documentBody.removeChild(script)
        }

        script.src = url;
        documentBody.appendChild(script);
    },
    setCookie: function (name, value, expiredays, domain, path) {
        var Days = (parseFloat(expiredays) && parseFloat(expiredays) > 0) ? parseFloat(expiredays) : 1,
            exp = new Date();

        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        // exp.setTime(exp.getTime() + 10000);

        var _str = name + '=' + encodeURIComponent(value) + ';expires= '+ exp.toGMTString();

        if(domain){
            _str += '; domain=' + domain;
        }

        if(path){
            _str += '; path=' + path;
        } else {
            _str += '; path=/';
        }

        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString();
    },
    //读取cookies
    getCookie: function (name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    },
    //删除cookies
    delCookie: function (name) {
        var self = this,
            exp = new Date();

        exp.setTime(exp.getTime() - 1);

        var cval = self.getCookie(name);

        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },

    lStorage :{
        setItem : function(_key,_val){
            "object" == typeof localStorage ? localStorage.setItem(_key, _val) : Util.setCookie(_key, _val, 366, "", "/");
        },
        getItem: function(_key){
            return "object" == typeof localStorage ? localStorage.getItem(_key) : Util.getCookie(_key);
        },
        removeItem: function(_key){
            "object" == typeof localStorage ? localStorage.removeItem(_key) : Util.delCookie(_key);
        }
    },
    sStorage : {
        setItem : function(_key,_val){
            "object" == typeof sessionStorage ? sessionStorage.setItem(_key, _val) : Util.setCookie(_key, _val, 0, "", "/");
        },
        getItem: function(_key){
            return "object" == typeof sessionStorage ? sessionStorage.getItem(_key) : Util.getCookie(_key);
        },
        removeItem: function(_key){
            "object" == typeof sessionStorage ? sessionStorage.removeItem(_key) : Util.delCookie(_key);
        }
    },
    
    delay : function(func, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){
            return func.apply(null, args);
        }, wait);
    },

    removeByValue: function (arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] === val) {
                arr.splice(i, 1);
                break;
            }
        }
    },

    // 格式成 str为原始分隔符，不传就是没有分隔符
    getFormatDate(value, str) {
        let result;
        if (str) {
            let arr = value.split(str);
            result = arr[0] + '.' + arr[1] + '.' + arr[2];
        } else {
            result = value.substr(0, 4) + '.' + value.substr(4, 2) + '.' + value.substr(-2);
        }

        return result;
    },

    getWeekday(value) {
        var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        value = value.split('.').join('-');

        return arr[new Date(value).getDay()];
    },

    getShareImg(rgid,str) {
        let o2 = ['守护系','艺术系','浪漫系','理智系'];
        let arr = [
            ['管理者','监督者','组织者','奉献着','保护者','守护者','大主管','女强人'],
            ['促进者','巧思者','摄政官','外交家','艺术家','推进者','实干家'],
            ['梦想家','理想者','启发者','哲学家','治愈者','关怀者','导师','教导主任'],
            ['领导者','创新者','分析师','睿智者','预言家','学者','统帅者','思想者']
        ];
        let index = arr[rgid - 1].indexOf(str);
        let img = Conf.domainRoot + 'externals/rg_' + (rgid - 1) + '_' + index + '.png';

        return img;
    },

    add_utm_source(url, source){
        source = source || '';
        let arr = source.split('_'), _this = this, result;

        // if (arr[1]) {
        //     arr[1] = parseInt(arr[1]) + 1;
        // }

        result = _this.addURIParam(url, 'utm_source', source);

        return result;
    },

    replace_head_img (src) {
        let result = '';
        let index = src.lastIndexOf('\/');
        let str = src.substr(index);

        if (str !== '/0') return src;

        result = src.substr(0, index) + '/132';

        return result;
    },

    lrtrim (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    HTMLDeCode (str) {
        let s = "";
        if (str.length === 0)  return "";
        s = str.replace(/>/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        return s;
    },

    getcontent(c) {
        let result = '';

        switch (c) {
            case 'Like':
                result = `<span class="s-icon c-1 cur"></span>悄悄的点了下赞`;
                break;
            case 'TapShoulder':
                result = `<span class="s-icon c-2 cur"></span>轻轻拍了拍肩膀`;
                break;
            case 'Hug':
                result = `<span class="s-icon c-3 cur"></span>给了一个大大的拥抱`;
                break;
            default:
                result = Util.HTMLDeCode(c);
        }

        return result;
    }

};


module.exports = Util;