var app = getApp()
var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session');

// 获取腾讯地图对象
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var QQMapSDK

// 获取腾讯云对象
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index')
var config = require('../../config')

// 获取一系列工具
var popup = require('../../utils/popup.js')
var Device = require('../../utils/device.js')

// 地址集合
var url = {
	loginUrl: config.service.loginUrl, //登录地址
	momentUrl: config.service.momentUrl, //动态地址
	tunnelUrl: config.service.tunnelUrl //信道地址
}

// 用户位置信息集合
var position = {
	longitude: 0,
	latitude: 0
}

var message = {
  top: -100, //初始-100%来完全隐藏
  distance: 78, //本身位置与动态发布点的距离
  minute: 5, //步行距离时间
  disWidth: 187.5, //距离信息单个宽度，单位rpx
  btnWidth: 150, //按钮单个宽度，单位rpx
  btnMargin: 18.75 //按钮单个外间距，单位rpx
}

// 地图控件集合
var controls = [
	{
		id: 0,
		iconPath: '/img/locate.png',
		position: {
			left: 20,
			top: 530,
			width: 56,
			height: 56
		},
		clickable: true
	},
	{
		id: 1,
		iconPath: '/img/fresh.png',
		position: {
			left: 20,
			top: 450,
			width: 56,
			height: 56
		},
		clickable: true
	},
	{
		id: 2,
		iconPath: '/img/moment.png',
		position: {
			left: 0,
			top: 0,
			width: 120,
			height: 56
		},
		clickable: true
	},
  {
    id: 3,
    iconPath: '/img/shadow.png',
    position: {
      left: 0,
      top: 0,
      width: 20,
      height: 50
    }
  }
]

// 地图标记点集合
var markers = [
]

var mapSize = {
	width: 375,
	height: 603
}

Page({
	data: {
		userInfo: {},
		map: false,
		position,
    message,
		url,
		mapSize,
		controls,
    markers
	},
	// 开启信道函数
	openTunnel() {
    // 创建信道，需要给定后台服务地址
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.momentUrl);
    var that = this

    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
      console.log('WebSocket 信道已连接');
    });

    tunnel.on('close', () => {
      console.log('WebSocket 信道已断开');
    });

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
      popup.showBusy('正在重连');
    });

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      popup.showSuccess('重连成功');
    });

    tunnel.on('error', error => {
      popup.showModel('信道发生错误', error);
      console.error('信道发生错误：', error);
    });

    // 监听自定义消息（服务器进行推送）
    tunnel.on('moment', moment => {
      // @todo 接收到动态的提示
      console.log('收到说话消息：', moment);
    });

    // 打开信道
    tunnel.open();
  },
  // 关闭信道
  closeTunnel() {
  	if (this.tunnel) {
      	this.tunnel.close();
 	 	}
 	},
  // 点击相应的控件处理
  controltap(e) {
    // 定位控件
    if (e.controlId === 0) {
      this.mapCtx.moveToLocation()
    } else if (e.controlId === 1) {
      // 刷新控件
      qcloud.getMoment(this.data.position.latitude, this.data.position.longitude)
      this.markerFresh()
    } else if (e.controlId == 2) {
      // 发表动态控件
      this.closeTunnel()
      wx.navigateTo({
        url: '../moment/moment'
      })
    }
  },
  // 点击特定的标记点
  markertap(e) {
    for(let i = 0; i < this.data.markers.length; i++) {
      if (this.data.markers[i].id === e.markerId) {
        console.log(this.data.markers[i])
      }
    }
  },
 	// 初始化地图尺寸
 	mapInit() {
 		let device = Device.get()
 		this.data.mapSize.width = device.width
 		this.data.mapSize.height = device.height
 		this.data.controls[0].position.top = this.data.mapSize.height - 136
    this.data.controls[1].position.top = this.data.mapSize.height - 201
    this.data.controls[2].position.top = this.data.mapSize.height - 136
    this.data.controls[2].position.left = this.data.mapSize.width / 2 - 60
    this.data.controls[3].position.width = this.data.mapSize.width * 1.2
    this.data.controls[3].position.left = this.data.mapSize.width * (-0.1)
    this.data.controls[3].position.top = this.data.mapSize.height - 98
 	},
  // 刷新地图标记点
  markerFresh() {
    console.log(app.globalData.mark)
    this.setData({
      markers: app.globalData.mark.dataStore
    })
  },
 	onLoad() {
 		let that = this;

 		// 获得用户信息
 		app.getUserInfo((userInfo) => {
 			that.setData({
 				userInfo: userInfo
 			})
 		})

 		// 获得设备信息
 		if (!Device.get()) {
  		wx.getSystemInfo({
  			success: (res) => {
  				let device = {
  				  width: res.windowWidth, //设备可用宽度，单位px
  				  height: res.windowHeight, //设备可用高度，单位px
  				  px2rpx: 750 / res.windowWidth, //设备px转rpx值
  				  rpx2px: res.windowWidth / 750, //设备rpx转px值
  				  rwidth: 750, //设备可用宽度，单位rpx，规定750rpx
  				  rheight: res.windowHeight * 750 / res.windowWidth, //设备可用高度，单位rpx
  				}
  				Device.set(device)
  			}
   		})
 		}

    // 绑定后才能获取地图以及动态信息
    if (Session.get().bindType) {
      // 获得用户定位
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          that.data.position.latitude = res.latitude
          that.data.position.longitude = res.longitude
          that.mapInit()
          if (qcloud.getMoment(res.latitude, res.longitude)) {
            setTimeout(() => {
              that.markerFresh()
            }, 1000)
          }
          that.setData({
            position: that.data.position,
            map: true,
            mapSize: that.data.mapSize,
            controls: that.data.controls
          })
        }
      })
    }

 		QQMapSDK = new QQMapWX({
    		key: 'YSEBZ-RLCHU-MCPVC-4YYWU-WQN53-IJFGQ'
 		})
 	},
 	onReady() {
 		this.mapCtx = wx.createMapContext('map')
    if (!this.pageReady) {
      this.pageReady = true
      this.openTunnel()
    }
 	},
  // 后台切换回前台时，重新启动信道并刷新
  onShow: function() {
    if (this.pageReady) {
      this.openTunnel()
      if (Session.get().bindType) {
        if (qcloud.getMoment(this.data.position.latitude, this.data.position.longitude)) {
          setTimeout(() => {
            this.markerFresh()
          }, 1000)
        }
      }
    }
  },
  // 页面卸载时，关闭信道
  onUnload: function() {
    this.closeTunnel()
  },
  // 页面切换到后台运行时，关闭信道
  onHide: function() {
    this.closeTunnel()
  }
})