var config = require('../../config')
var Session = require('../../vendor/qcloud-weapp-client-sdk/lib/session')
var constants = require('../../vendor/qcloud-weapp-client-sdk/lib/constants')
var popup = require('../../utils/popup.js')

Page({
	data: {
		bgColor: '#F47A9B',
		reader: '',
		content: ''
	},
	orange() {
		this.setData({
			bgColor: '#ffa07a'
		})
	},
	pink() {
		this.setData({
			bgColor: '#F47A9B'
		})
	},
	blue() {
		this.setData({
			bgColor: '#54A3E5'
		})
	},
	changeReader(e) {
		this.setData({
			reader: e.detail.value
		})
	},
	changeContent(e) {
		this.setData({
			content: e.detail.value
		})
	},
	submit() {
		let session = Session.get()
		let that = this

		wx.request({
			url: config.service.confessionUrl,
			header: {},
			method: 'GET',
			data: {
				uuid: session.id,
				author: session.realInfo.realname,
				reader: that.data.reader,
				content: that.data.content,
				background: that.data.bgColor
			},

			success: (result) => {
				var data = result.data;

		        if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		          if (data.session) {
		            popup.showSuccess('表白成功')
		            wx.navigateBack({
		    			delta: 1
        			})
		          } else {
		            popup.showModel('表白失败', '该账号已被绑定')
		          }
		        } else {
		          popup.showModel('表白失败', '出现某种未知的错误')
		        }
			},

			fail: function () {
		        popup.showModel('表白失败', '可能是网络错误或者服务器发生异常')
		    }
		})
	},
	onLoad() {
		wx.setNavigationBarColor({
  			frontColor: '#ffffff',
  			backgroundColor: '#54A3E5'
  		})
	}
})