var app = getApp()
var width = 0
var height = 0
Page({
  data: {
    map: false,
    userInfo:{},
    long: 0,
    lat: 0,
    top: -100,
    height,
    width,
    distance: 78,
    minute: 5,
    disWidth: 0,
    btnWidth: 0,
    btnMargin: 0,
    markers: [],
    controls: [{
      id: 0,
      iconPath: '/img/shadow.png',
      position: {
        left: 0,
        top: -50,
        width: 20,
        height: 50
      }
    },
    // },{
    //   id: 1,
    //   iconPath: '/img/locate.png',
    //   position: {
    //     left: 0,
    //     top: 0,
    //     width: 20,
    //     height: 40
    //   }
    // },{
      {
      id: 2,
      iconPath: '/img/loca.png',
      position: {
        left: 20,
        top: 520,
        width: 50,
        height: 50
      },
      clickable: true
    },{
      id: 3,
      iconPath: '/img/refresh.png',
      position: {
        left: 20,
        top: 450,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    if (e.controlId === 2) {
      this.mapCtx.moveToLocation()
    } else if (e.controlId === 3) {
      // wx.showModal({
      //   title: '提示',
      //   content: '这是一个模态弹窗',
      //   success: function(res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else {
      //       console.log('用户点击却笑')
      //     }
      //   }
      // })
      if (this.data.top !== 0) {
        this.data.controls[0].position.top = -10
        this.setData({
          top: 0,
          controls: this.data.controls
        })
      }
    }
  },
  tap: function() {
    if(this.data.top === 0) {
      this.data.controls[0].position.top = -50
      this.setData({
        top: -100,
        controls: this.data.controls
      })
    }
  },
  addMarker: function() {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude

        var length = that.data.markers.length;

        that.data.markers.push({
          iconPath: '/img/message.png',
          id: length + 1,
          latitude: latitude,
          longitude: longitude,
          width: 30,
          height: 30
        })

        console.log(that.data.markers)

        that.setData({
          markers: that.data.markers
        })
      }
    })
  },
  onLoad: function() {
    let that = this
    //得到用户信息
    app.getUserInfo(function(userInfo){
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
    })

    //得到用户设备信息
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight - 170,
          width: res.windowWidth,
          disWidth: res.windowWidth / 4,
          btnWidth: res.windowWidth / 5,
          btnMargin: res.windowWidth / 40
        })
      }
    })

    //得到用户定位
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.data.controls[0].position.width = that.data.width * 1.2
        that.data.controls[0].position.left = -(that.data.width * 0.1)
        // that.data.controls[1].position.left = that.data.width / 2 - 10
        // that.data.controls[1].position.top = that.data.height / 2 - 40
        that.data.controls[1].position.top = that.data.height - 80
        that.data.controls[2].position.top = that.data.height - 145;
        that.setData({
          long: longitude,
          lat: latitude,
          controls: that.data.controls,
          map: true
        })
      }
    })
  },
  onReady: function(e) {
    this.mapCtx = wx.createMapContext('map')
  }
})

// {
//   iconPath: '/img/current.png',
//   id: 0,
//   latitude: 0,
//   longitude: 0,
//   width: 20,
//   height: 20
// }
