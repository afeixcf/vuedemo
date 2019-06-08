let $ = require('jquery');
let Ajax = require('ajax');
let Conf = require('conf');
let Util=  require('util');
let User = require('user');

function Wechat(options){

    if (!(this instanceof Wechat)) {
        return new Wechat(options);
    }

    this.init(options);
}

Wechat.version = '20170526';

Wechat.prototype = {

    constructor: Wechat,

    init: function(options){
        let _this = this;
        let o = {
            appId: Conf.appId,
            beta: true,
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            jsApiList: ['getInstallState', 'launch3rdApp', 'checkJsApi', 'onMenuShareTimeline',
                'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems',
                'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord',
                'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage',
                'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation',
                'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
                'addCard', 'chooseCard', 'openCard'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        };

        if (typeof (options) != "undefined" && options) {
            o.appId = Conf.appId;
            o.timestamp = options.timestamp;
            o.nonceStr = options.noncestr;
            o.signature = options.signature;

            wx.config(o);
        } else {
            let parameterUrl = window.location.href.split('#/')[0];
            let url = Conf.domainApi + 'authorizations/signature?url=' + encodeURIComponent(parameterUrl);

            Ajax.request({
                silence: true,
                supportAbort: false,
                data: {
                    appid: Conf.appid
                },
                url: url,
                success: function (res) {
                    if (res.code == 0) {
                        //微信配置初始化

                        o.timestamp = res.data.timestamp;
                        o.nonceStr = res.data.noncestr;
                        o.signature = res.data.signature;

                        wx.config(o);

                    } else {
                        if (o.debug) alert('signature api code error');

                    }
                },
                error: function (e) {
                    if (o.debug) alert('signature api request error');
                }
            });
        }
        wx.ready(function () {
            wx.hideMenuItems({
                menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        });


        wx.error(function () {
            /* config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，
             也可以在返回的res参数中查看，对于SPA可以在这里更新签名。*/
            if (o.debug) alert('wx config error');

        });
    },

    showShareLayer: function () {

    },

    hideShareLayer: function () {
    },

    menuShare: function (params) {

        let _defualt_params = {
            imgUrl: Conf.domainRoot + 'externals/404.jpeg',
            title: '分享标题',
            desc: '分享描述',
            link: Conf.domainRoot + 'default.html', // 默认链接到说明文章。
            //区分朋友圈和朋友分享
            timelineTitle: '',
            appmessageTitle: ''
        };

        let _params = $.extend(_defualt_params, params);

        _params.link = Util.delURIParam(_params.link,'code');
        _params.link = Util.delURIParam(_params.link,'state');


        if (!_params.link) return;

        let _share_type_arr = ['timeline', 'appmessage', 'qq', 'weibo', 'qzone'];
        let _share_confs = {};


        $.each(_share_type_arr, function (_idx, _key) {

            let _item_share_conf = $.extend({}, _params);

            /**
             * 区分朋友圈和朋友分享标题
             *
             */
            if (_key == 'timeline' && _item_share_conf.timelineTitle) {
                _item_share_conf.title = _item_share_conf.timelineTitle;
            }
            if (_key == 'appmessage' && _item_share_conf.appmessageTitle) {
                _item_share_conf.title = _item_share_conf.appmessageTitle;
            }


            _item_share_conf.cancel = function (res) {
                    _params.cancel && _params.cancel(res);
            }

            _item_share_conf.trigger = function (res) {
                    _params.trigger && _params.trigger(res);
            }

            _item_share_conf.fail = function (res) {
                    _params.fail && _params.fail(res);
            }

            _item_share_conf.success = function (res) {
                _params.success && _params.success(res);
            }


            _share_confs[_key] = _item_share_conf;
        })

        let _get_type_conf = function (_type) {

            if (!_share_confs[_type]) return {};

            let _conf = _share_confs[_type];

            return {
                imgUrl: _conf.imgUrl,
                title: _conf.title,
                desc: _conf.desc,
                link: _conf.link,
                cancel: _conf.cancel,
                trigger: _conf.trigger,
                fail: _conf.fail,
                success: _conf.success
            }
        }

        wx.ready(function () {
            wx.onMenuShareTimeline(_get_type_conf('timeline'));
            wx.onMenuShareAppMessage(_get_type_conf('appmessage'));
            wx.onMenuShareQQ(_get_type_conf('qq'));
            wx.onMenuShareWeibo(_get_type_conf('weibo'));
            wx.onMenuShareQZone(_get_type_conf('qzone'));
        })
    }



}


module.exports = Wechat;

