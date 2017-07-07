var utils = require('./utils');
var constants = require('./constants');

/***
 * @class
 * 表示动态过程中发生的异常
 */
var MomentError = (function () {
  function MomentError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  MomentError.prototype = new Error();
  MomentError.prototype.constructor = MomentError;

  return MomentError;
})();

var noop = function noop() {};
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  momentUrl: null,
};

var moment = function moment(options) {
  options = utils.extend({}, defaultOptions, options);

  if (!defaultOptions.momentUrl) {
    options.fail(new MomentError(constants.ERR_INVALID_PARAMS, '动态错误： 缺少动态地址'));
    return;
  }

  var doMoment = function() {
    var header = {};

    wx.request({
      url: options.momentUrl,
      header: header,
      method: options.method,
      data: {
        lat: options.lat,
        lng: options.lng,
        title: options.title,
        word: options.word
      },

      success: function (result) {
        var data = result.data;

        if (data && data[constants.WX_SESSION_MAGIC_ID]) {
          if (data.session) {
            options.success(data.session.uuid);
          } else {
            var errorMessage = '动态创建失败(' + data.error + ')：' + (data.message || '未知错误');
            var noSessionError = new MomentError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
            options.fail(noSessionError);
          }
        } else {
          var errorMessage = '动态请求没有包含会话响应，请确保服务器处理 `' + options.momentUrl + '` 的时候正确使用了 SDK 输出登录结果';
          var noSessionError = new MomentError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
          options.fail(noSessionError);
        }
      },

      fail: function (momentResponseError) {
        var error = new MomentError(constants.ERR_LOGIN_FAILED, '动态失败，可能是网络错误或者服务器发生异常');
        console.log(error);
        options.fail(error);
      }
    });
  };

  doMoment();
};

var setMomentUrl = function (momentUrl) {
  defaultOptions.momentUrl = momentUrl;
}

module.exports = {
  MomentError: MomentError,
  moment: moment,
  setMomentUrl: setMomentUrl,
}
