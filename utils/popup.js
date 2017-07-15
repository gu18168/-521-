// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content, func) => {
    wx.hideToast()

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            func()
          }
        }
    })
}

module.exports = {
  showBusy: showBusy,
  showSuccess: showSuccess,
  showModel: showModel
}
