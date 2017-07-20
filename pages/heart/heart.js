var config = require('../../config')
var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session')
var constants = require('../../vendor/qcloud-weapp-client-sdk/lib/constants')
var popup = require('../../utils/popup.js')

Page({
	data: {
		beReal: false,
		realname: '',
		school: ''
	},
	changeRealname(e) {
		this.setData({
			realname: e.detail.value
		})
	},
	changeSchool(e) {
		this.setData({
			school: e.detail.value
		})
	},
	Confession() {
		let that = this
		if(!Session.get().realInfo) {
			wx.request({
			    url: config.service.realUrl,
			    header: {},
			    method: 'GET',
			    data: {
			    	uuid: Session.get().id
			    },

			    success: function(result) {
			      var data = result.data;

			      if (data && data[constants.WX_SESSION_MAGIC_ID]) {
			        if (data.res) {
			          let session = Session.get()
		          	  session.realInfo = data.res
		          	  Session.set(session)
		          	  // @todo 跳转
			        } else {
			          that.setData({
			          	beReal: true
			          })
			        }
			      } else {
			        popup.showModel('请求失败', '出现某种未知的错误')
			      }
			    },

			    fail: function () {
			      popup.showModel('请求失败', '可能是网络错误或者服务器发生异常')
			    },
			})
		} else {
			console.log(Session.get())
			// @todo 跳转
		}
	},
	tobeReal() {
		let that = this
		wx.request({
		    url: config.service.berealUrl,
		    header: {},
		    method: 'GET',
		    data: {
		    	uuid: Session.get().id,
		    	realname: that.data.realname,
		    	school: that.data.school
		    },

		    success: function(result) {
		      var data = result.data;

		      if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		        if (data.res) {
		          let session = Session.get()
		          session.realInfo = data.res
		          Session.set(session)
		          // @todo 跳转
		        } else {
		          popup.showModel('绑定失败', '出现某种未知的错误')
		        }
		      } else {
		        popup.showModel('请求失败', '出现某种未知的错误')
		      }
		    },

		    fail: function () {
		      popup.showModel('请求失败', '可能是网络错误或者服务器发生异常')
		    },
		})
	},
	cancel() {
		this.setData({
			beReal: false
		})
	},
	onLoad() {
		console.log(Session.get())
		wx.setNavigationBarColor({
  			frontColor: '#ffffff',
  			backgroundColor: '#E2455F'
  		})
	}
})