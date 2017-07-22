var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');

var marker = require('./utils/marker');
var markers = new marker.Marker();

App({
  onLaunch: function() {
    qcloud.setLoginUrl(config.service.loginUrl);
    qcloud.setMomentUrl(config.service.createUrl);
    qcloud.setGetMomentUrl(config.service.getUrl);
  },
  onError: function (msg) {
  	console.log(msg)
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    mark: markers
  }
})
