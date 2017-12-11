/* 仿toastr提示框 */

require ('./main.css');

var $ = require('jquery');

function Toastr(option) {
  if (!(this instanceof Toastr)) {
    return new Toastr(option);
  }
  if( typeof option == 'string') option = {text:option}

  this.o =  $.extend({
    text: '请稍候...',
    iconType:'',
    timeout: 3000,
    timeoutFn: null,
    onhide: null
  }, option);

  this.init();
}

Toastr.prototype = {
  constructor: Toastr,

  init: function () {
    var o = this.o;

    $(".toastr").remove();

    var toastr = $('<div class="toastr"><p class="toastr-txt">' + o.text + '</p></div>');

    if (o.iconType) {
      toastr.prepend('<div class="toastr-icon ' + o.iconType + '"></div>');
    }

    toastr.appendTo("body").hide();

    this.el = toastr;
  },


  hide : function () {
    var o = this.o;
    var el = this.el;

    el.fadeOut(500, function () {
      el.remove();
      if (o.onhide) {
        o.onhide();
      }
    });
  },

  show:function(){
    var o = this.o;
    var _this = this;


    var _t = ($(window).height() - this.el.height()) / 2 + $(window).scrollTop();
    var _l = ($(window).width() - this.el.width()) / 2;

    this.el.css({left: _l, top: _t});
    this.el.fadeIn(800);

    if (o.timeout) {
      setTimeout(function () {
        _this.hide();
        if (o.timeoutFn) {
          o.timeoutFn();
        }
      }, o.timeout);
    }
  }
};

module.exports = Toastr;

