var utils = require('./utils');
var constants = require('./constants');

var popup = require('../../../utils/popup.js');

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
  getUrl: null,
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

var getMoment = function(lat, lng) {
  if (!defaultOptions.getUrl) {
    console.log('地址未设置');
    return;
  }

  popup.showBusy('刷新中');

  wx.request({
    url: defaultOptions.getUrl,
    header: {},
    method: defaultOptions.method,
    data: {
      lat: lat,
      lng: lng
    },

    success: function(result) {
      var data = result.data;

      if (data && data[constants.WX_SESSION_MAGIC_ID]) {
        if (data.res) {
          // @todo 查询成功后
          let app = getApp();
          app.globalData.mark.clear();
          for (let i = data.res.length - 1; i >= 0; i--) {
            if (app.globalData.mark.full()) {
              app.globalData.mark.dequeue();
            }
            app.globalData.mark.enqueue(data.res[i]);
          }
          popup.showSuccess('刷新成功');
        } else {
          popup.showModel('刷新失败', '可能是附近没有动态');
        }
      } else {
        popup.showModel('刷新失败', '出现了一些奇怪的问题');
      }
    },

    fail: function () {
      popup.showModel('刷新失败', '网络错误或者是服务器发生异常');
    }
  });

  return true;

}

var setMomentUrl = function (momentUrl) {
  defaultOptions.momentUrl = momentUrl;
}

var setGetMomentUrl = function (getUrl) {
  defaultOptions.getUrl = getUrl;
}

module.exports = {
  MomentError: MomentError,
  moment: moment,
  getMoment: getMoment,
  setMomentUrl: setMomentUrl,
  setGetMomentUrl: setGetMomentUrl,
}
