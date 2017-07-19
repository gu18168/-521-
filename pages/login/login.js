var config = require('../../config')
var popup = require('../../utils/popup.js')
var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session')
var constants = require('../../vendor/qcloud-weapp-client-sdk/lib/constants')

Page({
	data: {
		disabled: true,
		username: '',
		password: ''
	},
	changeUsername(e) {
		this.setData({
			username: e.detail.value
		})

		this.disable()
	},
	changePassword(e) {
		this.setData({
			password: e.detail.value
		})

		this.disable()
	},
	disable() {
		if (this.data.username && this.data.password && this.data.disabled) {
			this.setData({
				disabled: false
			})
		} else if ((!this.data.username || !this.data.password) && !this.data.disabled) {
			this.setData({
				disabled: true
			})
		}
	},
	login() {
		wx.showLoading({
			title: '正在处理中...'
		})

		let se = Session.get()

		wx.request({
			url: config.service.bindUrl,
			header: {},
			method: 'GET',
			data: {
				username: this.data.username,
				password: this.data.password,
				uuid: se.id,
				avatar: se.userInfo.avatarUrl,
				desc: '你好，同学，欢迎来做朋友',
				nickname: se.userInfo.nickName,
				gender: se.userInfo.gender
			},

			success: (result) => {
				var data = result.data;

				console.log(data);

		        if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		          if (data.session && data.session.userId) {
		            // @todo 成功登录
		            popup.showSuccess('绑定成功')

		            let session = Session.get()
		            session.bindType = true
		            Session.set(session)
		            wx.navigateBack({
		    			delta: 1
        			})
		          } else {
		            // @todo 失败登录
		            popup.showModel('绑定失败', '该账号已被绑定')
		          }
		        } else {
		          // @todo 无响应登录
		          popup.showModel('绑定失败', '出现某种未知的错误')
		        }
			},

			fail: function (momentResponseError) {
		        popup.showModel('绑定失败', '可能是网络错误或者服务器发生异常')
		    },

		    complete: () => {
		    	wx.hideLoading()
		    }
		})
	},
	onLoad() {
		wx.setNavigationBarTitle({
			title: '登录绑定'
		})
	}
})