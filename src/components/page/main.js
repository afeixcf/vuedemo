var User = require('user');
var Util = require('util');
var Toastr = require('toastr');
var Wechat = require('wechat');
var Conf = require('conf');

var Page = {

    initView: function(_conf, _callback, _target) {
        var _this = this;
        var _hasBaiscAuth = !!User.basicAuth;

        null == _conf && (_conf = {});
        
        var _fn = function(){
            Util.call(_callback,_target);
        }

        var _init = function() {

            var _errMsg,_redirectUrl;

            var _fid = location.href.query('fid') || ''; //朋友ID

            if(_conf.needCheckUserState){
                if(User.status < 2){
                    if(User.status < 1){
                        _errMsg = '需要您先完成基本资料';
                        _redirectUrl = 'userInfoInput.html';
                    }else{
                        _errMsg = '需要您先先补充解码资料';
                        _redirectUrl = 'answer.html';
                    }

                    if(_fid){
                        _redirectUrl = Util.addURIParam(_redirectUrl,'fid',_fid);
                    }

                    new Toastr({
                        text: _errMsg, iconType: "warn", timeout:2000, timeoutFn: function(){
                            Page.backView(_redirectUrl);
                        }
                    }).show();
                }
            }

            var _wxConf = _conf.wxConf || {};

            var _wechat;

            if(Util.isWeChat() && !_conf.preWechat){

                //JSSDK config ...
                _wechat = new Wechat(_wxConf.init);
                _wechat.menuShare(_wxConf.share);

                _this.wechat = _wechat;

            }

            _fn()



        };
        
        // if(Util.isWeChat()) _conf.needLogin = true;

        if (_conf.needLogin){
            var _basicAuth = User.basicAuth || '';
            User.login(_basicAuth, _init);
        } else{
            _init();
        }

    },
    openView : function(url){
        if(url) {
            location.href = url
        }else{
            history.go(1);
        }
    },
    path: function (rName,params) {
        Conf.isGoBack = false;
        var url = this.getRouteUrl(rName,params);
        location.href = url;
    },

    replaceView: function (url) {
        location.replace(url);
    },

    replace: function (rName,params) {
        Conf.isGoBack = false;
        var url = this.getRouteUrl(rName,params);
        location.replace(url);
    },

    getRouteUrl: function (rName,params) {
        var url = Conf.domainRoot + Conf.mainUrl + '#!/' + rName;
        var x;
        if (params) {
            for (x in params) {
                url = url + '/' + params[x];
            }
        }
        return url;
    },

    backView : function(url){
        if(url) {
            location.href = url
        }else{
            history.go(-1);
        }

    },

    handleEror:function(desc,back_url,count){
        var _url = back_url? back_url :'/error.html';

        _url += '?';

        if(desc) _url += 'desc=' + decodeURIComponent(desc);
        if(count && parseInt(count)>0) _url += 'count=' + parseInt(count);

        this.Wigdet.openView(_url);
    },

    getJudgeUrl: function (status,u) {
        let url = '';
        let fid = location.href.query('fid');
        let ts = location.href.query('ts');
        let utm_source = location.href.query('utm_source');
        let _fn = (u) => {
            if (u === location.pathname) u = '';
            return u;
        };

        switch(status) {
            case 0:
                url = '/userInfoInput.html';
                break;
            case 1:
                url = '/innateResult.html';
                break;
            case 2:
                url = u;
                url = Util.addURIParam(url, 'mid', User.selfInfo.id);
                break;
        }
        if (url) {
            url = Util.addURIParam(url, 'fid', fid);
            url = Util.addURIParam(url, 'ts', ts);
            url = Util.addURIParam(url, 'utm_source', utm_source);
        }
        url = _fn(url);

        return url;
    }
    
}

module.exports = Page;