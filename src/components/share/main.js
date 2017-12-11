let Util = require('util');
let Wechat = null;
let _wechat = null;

Wechat = require('wechat');
let share = {
    init: function (options) {
        // if (Util.isWeChat()) {
            _wechat.menuShare(options);
        // }
    },
    signature(){
        _wechat = new Wechat();
    }
};


module.exports = share;