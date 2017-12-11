let $ = require('jquery');
let Toastr = require('toastr');
let Loading = require('loading');
let Util = require('util');
let Conf = require('conf');

let _loading;

let Widget = {

    XHR: [],

    sum: 0,

    abort: function () {
        this.XHR.forEach(function (item) {
            item.abort();
        });
    },

    request: function (params) {

        if (!$.isPlainObject(params)) return;

        let _this = this;

        let options = {
            headers: {},
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            async: true,
            cache: false,
            url: '',
            crossDomain: true,
            silence: false,
            noAuthorization: false,
            data: null,
            success: null,
            error: null,
            timeout: 60000,
            supportAbort: true
        };

        options = $.extend(options, params);

        if (!options.silence) {
            _this.sum++;
            if (_this.sum === 1) {
                _loading = new Loading({delay: params['delay'], modal: params['modal']});
                _loading.show(); // 显示loading
            }
        }

        if (!options.noAuthorization) {
            options.headers["Authorization"] = Util.getCookie('user_basicauth') || '';
        }

        let o = $.extend({}, options);

        if ((o.type).toLowerCase() != 'get') {
            o.processData = false;
            if (o.data && typeof(o.data) != 'string') {
                o.data = JSON.stringify(o.data);
            }
        }

        o.success = function (res) {
            if (res.code && res.code !== '40010') {
                new Toastr({
                    text: '网络错误，请稍后再试！[' + res.code + ']', timeoutFn: function () {
                    }, iconType: "fail"
                }).show();
            }
            if (options.success) options.success(res);
        };

        o.error = function (err) {
            if (!options.silence && err.statusText !== 'abort') {
                let _toastr = new Toastr({
                    text: '网络错误，请稍后再试！', timeoutFn: function () {
                        options.error && options.error(err);
                    }, iconType: "fail"
                });
                _toastr.show();
            } else {
                if (options.error) options.error(err);
            }
        };

        o.complete = function (xhr, staus) {
            if (!options.silence) {
                _this.sum--;
                if (_this.sum === 0) {
                    _loading.hide();
                }
            }
            Util.removeByValue(_this.XHR, xhr);
            if (options.complete) options.complete(xhr, staus);
        };

        let xhr = $.ajax(o);
        if (o.supportAbort) {
            _this.XHR.push(xhr);
        }
        return xhr;
    },

    putUserInfo (o) {
        let url = Conf.domainApi + 'users/' + o.id;
        let params = {
            gender: o.gender,
            constellation: o.constellation,
            group: o.group
        };

        this.request({
            url,
            type: 'put',
            data: params,
            success(res){
                o.success && o.success(res);
            }
        });
    },

    getQuestion(o){
        let url = Conf.domainApi + 'questions/brevity';

        this.request({
            url,
            data: {t: o.gender},
            success(res){
                o.success && o.success(res);
            }
        })
    },

    postAnswer(o){
        let url = Conf.domainApi + 'answers/brevity';

        this.request({
            url,
            data: o.data,
            type: 'post',
            success(res){
                o.success && o.success(res);
            }
        });
    },

    getReport(o){
        let url = Conf.domainApi + 'users/' + o.id + '/detail';

        this.request({
            url,
            // silence: true,
            success(res){
                o.success && o.success(res);
            }
        });
    },

    brief (o) {
        let url = Conf.domainApi + 'users/' + o.id + '/brief?ts=' + o.ts;

        this.request({
            url,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    classes (o) {
        let url = Conf.domainApi + 'classes/' + o.id + '?page=' + o.p;

        this.request({
            url,
            success(res){
                o.success && o.success(res);
            }
        });
    },

    classeslist (o) {
        let url = Conf.domainApi + 'classes/detail/' + o.id + '?page=' + o.p1 + '&page2=' + o.p2;

        this.request({
            url,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    join (o) {
        let url = Conf.domainApi + 'classes/' + o.id + '/' + o.fid;

        this.request({
            url,
            slience: o.slience,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    invitation (o) {
        let url = Conf.domainApi + 'invitations/' + o.id;

        this.request({
            url,
            type: 'post',
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    putad (o) {
        let url = Conf.domainApi + 'users/' + o.id + '/ads/aha';

        this.request({
            url,
            silence: true,
            type: 'put',
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    /* 每日心情 相关接口 */
    getmood (o) {
        let url = Conf.domainApi + 'mood/' + o.id + '?rows=' + (o.rows || 20);

        this.request({
            url,
            success(res){
                o.success && o.success(res);
            }
        });
    },

    getmoodinfo (o) {
        let url = Conf.domainApi + 'messages/mood/' + o.moodid;

        this.request({
            url,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    moodcount (o) {
        let url = Conf.domainApi + 'mood/' + o.id + '/count';

        this.request({
            url,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    getreplycount (o) {
        let url = Conf.domainApi + 'messages/' + o.id + '/unread';

        this.request({
            url,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    replymood (o) {
        let url = Conf.domainApi + 'messages/mood/' + o.moodid;

        this.request({
            url,
            type: 'post',
            data: o.data,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    putmood (o) {
        let url = Conf.domainApi + 'mood/' + o.data.userid;

        this.request({
            url,
            type: 'put',
            data: o.data,
            success (res) {
                o.success && o.success(res);
            }
        });
    },

    getreplylist: (function () {

        let eachRow = 10;
        let index = 0;

        return function (o) {
            if (o === 'clear') {
                index = 0;
                return;
            }

            let url = Conf.domainApi + 'messages/' + o.id;

            this.request({
                url,
                data: {
                    start: index++ * eachRow,
                    rows: eachRow
                },
                success (res) {
                    o.success && o.success(res, eachRow);
                }
            });
        }
    })()

};

module.exports = Widget;