// pages/classify/classify.js
var util = require('../../utils/util.js');
Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0
  },
  onLoad: function () {
    // 加载的使用进行网络访问，把需要的数据设置到data数据对象  
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5goodtype/goodTypeList',
      method: 'POST',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          navLeftItems: res.data.data.typeBeanList,
          navRightItems: res.data.data.typeBeanList,
        })
      }
    })
  },

  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  }

})  