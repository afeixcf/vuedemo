var Util = require('util');
var Ajax = require('ajax');
var Toastr = require('toastr');
var Conf = require('conf');

var User = {

    init: function () {

        this.basicAuth = Util.getCookie('user_basicauth') || '';

        var _sSelfInfo = Util.lStorage.getItem('user_self_info') || '';
        this.selfInfo = _sSelfInfo ? JSON.parse(_sSelfInfo) : {};

        this.userId = this.selfInfo.id || '';
        this.openId = this.selfInfo.open_id || '';
        this.status = this.selfInfo.status && parseInt(this.selfInfo.status) > 0 && parseInt(this.selfInfo.status) || 0;

    },

    isLogin: function () {
        return !!this.basicAuth
    },

    setBaiscAuth: function (val) {
        if (val) {
            this.basicAuth = val;
            Util.setCookie('user_basicauth', val, 7.2);
        }
    },

    clearBaiscAuth: function () {
        this.basicAuth = '';
        Util.delCookie('user_basicauth');
    },

    ensureLogin: function (sucessFn, errFn, fromUrl) {
        !!this.basicAuth ? sucessFn() : this.login('', sucessFn, errFn, fromUrl)
    },

    updateUserData: function (userData) {
        if (!userData) return;

        var _userId = userData.id || '';
        var _userOpenId = userData.open_id || '';
        var _basicAuth = userData.authorization || '';

        this.userId = _userId;
        this.openId = _userOpenId;
        this.status = parseInt(userData.status) > 0 && parseInt(userData.status) || 0;

        this.selfInfo = userData;
        this.selfInfo.head_img_s = Util.replace_head_img(userData.head_img);
        Util.lStorage.setItem('user_self_info', JSON.stringify(userData));

        this.setBaiscAuth(_basicAuth);
    },

    getUserInfoByCode: function (_code, sucessFn, errFn) {

        if (!_code) return;

        var _this = this;
        var _errHandel = function (res) {
            var _errMsg = Util.isWeChat() ? '授权登录出错了,页面禁止访问' : '获取用户信息失败了,请稍候再试';

            _this.errHandle(_errMsg, function () {
                errFn && errFn(res);
            });
        }

        Ajax.request({
            url: Conf.domainApi + 'authorizations/weixin/' + _code,
            // silence: true,
            success: function (res) {
                if (res.code == 0) {
                    _this.updateUserData(res.data);
                    sucessFn && sucessFn(res);
                } else {
                    _errHandel(res);
                }

            },
            error: function (res) {
                console.log(res);
                if (res.status === 401) {
                    let url = location.href;

                    _this.clearBaiscAuth();
                    url = Util.delURIParam(url, 'code');
                    url = Util.delURIParam(url, 'state');

                    location.href = url;
                }
                // _errHandel(res);

            },
            noAuthorization: true
        });

    },

    errHandle: function (errMsg, fn) {
        var _errStr = errMsg ? errMsg : '用户信息出错了';
        new Toastr({
            text: _errStr, iconType: "fail", timeout: 2000, timeoutFn: fn
        }).show();

    },

    login: function (passCode, sucessFn, errFn, fromUrl) {

        var _this = this;
        var bool = ~location.href.indexOf('#/result');

        if (_this.basicAuth && _this.selfInfo && _this.selfInfo.id) {
            _this.requestSelfInfo(sucessFn, errFn, bool);
            return;
        }

        var _currUrl = location.href;
        // var _redirectUri = (fromUrl || location.href).split("#")[0];
        var _redirectUri = fromUrl || location.href;


        // var _wxAuthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
        //     + Conf.appId +'&redirect_uri='+encodeURIComponent(_redirectUri)
        //     +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

        var _wxAuthUrl = Conf.authorApi + 'getweixincode.html?appid=' + Conf.appId + '&scope=snsapi_base&state=STATE&redirect_uri=' + encodeURIComponent(_redirectUri);

        var _authAccessCode = Util.query(_currUrl, 'code');


        _this.logout(function () {

            //if(Util.isWeChat()){
            if (!_authAccessCode) {
                location.href = _wxAuthUrl;
                return;
            }

            _this.getUserInfoByCode(_authAccessCode, sucessFn, errFn);

            /*}else{
             if (!passCode) {
             location.href = '/login.html?formurl='+fromUrl;
             return;
             }

             _this.getUserInfoByCode(_authAccessCode,sucessFn, errFn);
             }*/
        });
    },

    logout: function (callback) {
        this.clearBaiscAuth();

        this.selfInfo = {};
        Util.lStorage.removeItem('user_self_info');

        this.userId = '';
        this.openId = '';
        this.status = 0;

        if (typeof callback == 'function') callback();
    },

    requestSelfInfo: function (sucessFn, errFn, bool) {

        var _this = this;
        if (!this.userId) {
            this.errHandle('你还没有登录', function () {
                errFn && errFn();
            });
        }

        Ajax.request({
            url: Conf.domainApi + 'users/' + _this.userId,
            silence: bool,
            success: function (res) {
                if (res.code == 0) {
                    _this.updateUserData(res.data);
                    sucessFn && sucessFn(res);
                } else {
                    _this.errHandle(res.message, function () {
                        errFn && errFn(res);
                    });
                }

            },
            error: function (res) {
                errFn && errFn(res);
            }
        });
    }
};

User.init();

module.exports = User;