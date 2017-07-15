Page({
	data: {
		loading: false,
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
		let that = this
		this.data.loading = true

		this.setData({
			loading: this.data.loading
		})

		console.log(this.data.loading)

		// wx.request({
		// 	url: "/",
		// 	header: {},
		// 	method: 'POST',
		// 	data: {
		// 		username: this.data.username,
		// 		password: this.data.password
		// 	},

		// 	success: (result) => {
		// 		var data = result.data;

		//         if (data && data[constants.WX_SESSION_MAGIC_ID]) {
		//           if (data.userId) {
		//             // @todo 成功登录
		//           } else {
		//             // @todo 失败登录
		//           }
		//         } else {
		//           // @todo 无响应登录
		//         }
		// 	},

		// 	fail: function (momentResponseError) {
		//         // @todo 网络错误或服务器错误
		//     }
		// })
	},
	onLoad() {
		wx.setNavigationBarTitle({
			title: '登录绑定'
		})
	}
})