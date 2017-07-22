var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session')

var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index')
var config = require('../../config')

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var QQMapSDK

var popup = require('../../utils/popup.js')

var position = {
  lat: 0,
  lng: 0,
  title: ''
}

Page({

  data: {
    position
  },

  connect: function() {
    //建立与服务器之间的信道
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.momentUrl)

    //连接成功
    tunnel.on('connect', () => {
      console.log('WebSocket 信道已连接')
    })

    //连接失败
    tunnel.on('error', error => {
      showModel('信道发生错误', error);
      console.error('信道发生错误：', error);
    })

    tunnel.open();
  },

  closeTunnel: function() {
    if (this.tunnel) {
      this.tunnel.close();
    }
  },

  onLoad: function() {
    QQMapSDK = new QQMapWX({
      key: 'YSEBZ-RLCHU-MCPVC-4YYWU-WQN53-IJFGQ'
    })
  },

  // 页面渲染完成后，启动信道
  onReady: function() {
    let that = this

    wx.setNavigationBarTitle({ title: '发布动态'})

    if (!this.pageReady) {
      this.pageReady = true
      this.connect()
    }

    QQMapSDK.reverseGeocoder({
      success: function(res) {

        that.data.position.lat = res.result.location.lat
        that.data.position.lng = res.result.location.lng
        that.data.position.title = res.result.address_reference.landmark_l2.title
        console.log(that.data.position)

        that.setData({
          position: that.data.position
        })
      },
      fail: function(res) {
        popup.showModel('定位失败', '定位失败，请检查一下你的网络')
      }
    })
  },

  // 后续后台切换回前台时，重新启动信道
  onShow: function() {
    if (this.pageReady) {
      this.connect()
    }
  },

  // 页面卸载时，关闭信道
  onUnload: function() {
    this.closeTunnel()
  },

  // 页面切换到后台运行时，关闭信道
  onHide: function() {
    this.closeTunnel()
  },

  Submit: function(e) {
    if (!this.tunnel || !this.tunnel.isActive()) {
      popup.showModel('稍等一下', '服务器正在加紧赶来')

      if (this.tunnel.isClosed()) {
        this.connect()
      }
      return
    }

    setTimeout(() => {
      	if (e.detail.value.textarea && this.tunnel) {
  			  popup.showBusy('马上就好')
          let session = Session.get()
      		// 服务器存储动态
        	qcloud.moment({
              'uuid': session.id,
              'nickname': session.userInfo.nickName,
          		'lat': this.data.position.lat,
          		'lng': this.data.position.lng,
          		'title': this.data.position.title,
          		'word': e.detail.value.textarea
        	});
        	// 通知在线用户动态出现
        	this.tunnel.emit('moment', {'word': e.detail.value.textarea, 'where': this.data.position})
        	popup.showSuccess('动态已面世')
        	wx.navigateBack({
        		delta: 1
        	})
      	} else {
      		popup.showModel('出现问题了', '输入内容不可为空')
      	}
    })
  }
})
