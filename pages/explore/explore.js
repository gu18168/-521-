var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index')
var config = require('../../config')
var constants = require('../../vendor/qcloud-weapp-client-sdk/lib/constants')
var popup = require('../../utils/popup.js')

// 活动基本信息
var actInfo = []
// 活跃用户基本信息
var usersInfo = []
// 动态基本信息
var momentsInfo = []

Page({
	data: {
		actInfo,
		usersInfo,
		momentsInfo
	},
  	onLoad: function() {
  		let that= this
  		wx.setNavigationBarColor({
  			frontColor: '#ffffff',
  			backgroundColor: '#F47F59'
  		})

  		wx.request({
		    url: config.service.activityUrl,
		    header: {},
		    method: 'GET',
		    data: {},

		    success: function(result) {
		      var data = result.data;

		      if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		        if (data.res) {
		          that.setData({
		          	actInfo: data.res
		          })
		        } else {
		          let act = [
		          	{
		          		rest: '0',
		          		desc: '最近暂无活动'
		          	}
		          ]
		          that.setData({
		          	actInfo: act
		          })
		        }
		      } else {
		        popup.showModel('活动刷新失败', '出现某种未知的错误')
		      }
		    },

		    fail: function () {
		      popup.showModel('活动刷新失败', '可能是网络错误或者服务器发生异常')
		    },
		})

		wx.request({
			url: config.service.usersUrl,
			header: {},
			method: 'GET',
			data: {},

			success: function(result) {
		      var data = result.data;

		      if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		        if (data.res) {
		          that.setData({
		          	usersInfo: data.res
		          })
		        }
		      } else {
		        popup.showModel('用户刷新失败', '出现某种未知的错误')
		      }
		    },

		    fail: function () {
		       popup.showModel('用户刷新失败', '可能是网络错误或者服务器发生异常')
		    }
		})

		wx.request({
			url: config.service.momentsUrl,
			header: {},
			method: 'GET',
			data: {},

			success: function(result) {
		      var data = result.data;

		      if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		        if (data.res) {
		          that.setData({
		          	momentsInfo: data.res
		          })
		        }
		      } else {
		        popup.showModel('动态刷新失败', '出现某种未知的错误')
		      }
		    },

		    fail: function () {
		      popup.showModel('动态刷新失败', '可能是网络错误或者服务器发生异常')
		    }
		})
  	}
})