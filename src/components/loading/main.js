/**
 * Created by Sam on 9/11/15.
 */

require ('./main.css');
var $ = require('jquery');

function Loading(o) {
    if (!(this instanceof Loading)) {
        return new Loading(o);
    }
    if(!isPlainObject(o)) o = {};
    o.delay =  parseInt(o.delay) ? parseInt(o.delay) :0;
    o.modal =  undefined == o.modal ? true : !!o.modal;

    this.o = o;
    this.t = 0;
    this.init();
}

function isPlainObject( obj ){
    return   Object.prototype.toString.call(obj)==='[object Object]';
}

Loading.prototype = {
    constructor: Loading,

    init: function () {
        /*var el  = $('<div>', {
         'class': 'loading',
         html   : '加载中'
         });*/

        var el  = $('<div>', {
            'class': 'pub-loading',
            html   : ''
        });


        var mask = null;


        // $('.pub-loading-mask').remove();
        // $('.pub-loading').remove();

        el.appendTo('body');

        if(this.o.modal) {
            mask  = $('<div>', {
                'class': 'pub-loading-mask',
                html   : ''
            });
            mask.appendTo('body');

            mask.off('touchmove').on('touchmove',function(e){
                e.preventDefault();
                e.stopPropagation();
            })
        }

        this.el = el;
        this.mask = mask;
    },

    show: function () {
        var el            = this.el;
        var mask            = this.mask;
        var o =          this.o;

        clearTimeout(this.t);
        this.t = setTimeout(function(){
            var _html_normal = '<div class="pic-normal-loading"></div>';
            el.append(_html_normal);

            if(mask) mask.removeClass('debut-loading-mask');
            el.show();

            if(mask) mask.show();
            
        },this.delay);
    },

    hide: function () {
        var el = this.el;
        var mask = this.mask;
        clearTimeout(this.t);
        el.hide();

        if(mask) mask.hide();
    }
};

module.exports =  Loading;
