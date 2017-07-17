var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index')

Page({
	tap() {
		qcloud.getMoment(34.244038, 108.909460)
	}
})