Page({
  onShareAppMessage: function() {
    return {
      title: '自定义的转发标题',
      path: '/page/user?id=123'
    }
  },
  data: {
    name: 'WeChat',
    num: 0,
    zero: 0,
    array: [{text: 'init data'}],
    array1: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    object: {
    text: 'init data'
    }
  },
  changeName: function(e) {
    this.setData({
      name: 'MINA'
    })
  },
  changeNum: function() {
    this.data.num = 1
    this.setData({
      num: this.data.num
    })
  },
  changeItemInObject: function() {
    this.setData({
      'object.text': 'changed data'
    })
  },
  addNewField: function() {
    this.setData({
      'newField.text': 'new data'
    })
  }
})
