var util = require('../../utils/util.js');
const app = getApp()
Page({
  data:{
    newGoodsList:[]
  },
  onLoad: function (options) {
    var that=this
    wx.request({
      url: util.Apis + '/h5/h5good/findNewGoodList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          newGoodsList: res.data.data.newGoodBeanList
        })
      }
    })
  }
})