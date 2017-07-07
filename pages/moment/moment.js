var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index')
var config = require('../../config')

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var qqmapsdk

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

var position = {
  lat: 0,
  lng: 0,
  title: ''
}

Page({

  data: {
    inputContent: '',
    position,
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

    tunnel.on('moment', moment => {
      console.log('收到说话消息：', moment);
    })

    tunnel.open();
  },

  closeTunnel: function() {
    if (this.tunnel) {
      this.tunnel.close();
    }
  },

  onLoad: function() {
    qqmapsdk = new QQMapWX({
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

    qqmapsdk.reverseGeocoder({
      success: function(res) {

        that.data.position.lat = res.result.location.lat
        that.data.position.lng = res.result.location.lng
        that.data.position.title = res.result.address_reference.landmark_l2.title
        console.log(that.data.position)

        that.setData({
          position: that.data.position
        })

        // console.log(res);
        // console.log(res.result.address_reference.landmark_l2.title);
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },

  // 后续后台切换回前台时，重新启动信道
  onShow: function() {
    if (this.pageReady) {
      this.connect()
    }
  },

  // 页面卸载时，退出聊天室
  onUnload: function() {
    this.closeTunnel()
  },

  // 页面切换到后台运行时，退出聊天室
  onHide: function() {
    this.closeTunnel()
  },

  changeInputContent: function(e) {
    this.setData({
      inputContent: e.detail.value
    })
  },

  sendMessage: function(e) {
    if (!this.tunnel || !this.tunnel.isActive()) {
      console.log("信道还未开启")

      if (this.tunnel.isClosed()) {
        this.connect()
      }

      return
    }

    setTimeout(() => {
      if (this.data.inputContent && this.tunnel) {
        qcloud.moment({
          'lat': this.data.position.lat,
          'lng': this.data.position.lng,
          'title': this.data.position.title,
          'word': this.data.inputContent
        });
        this.tunnel.emit('moment', {'word': this.data.inputContent, 'where': this.data.position})
        this.setData({ inputContent: ''})

      }
    })
  }

})
