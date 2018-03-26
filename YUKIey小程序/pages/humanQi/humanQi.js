var util = require('../../utils/util.js');
const app = getApp()
Page({
  data:{
    newGoodsList:[],
    news:[],
    indenx:0,
    winWidth:'',
    winHeight:''
  },
  onLoad:function(){
    var that =this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },
  onShow: function () {
    this.getMsg()
  },
  getMsg:function(){
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5good/goodList',
      data: {
        oneLevelTypeId: 0,
        twoLevelTypeId: 0,
        index: that.data.indenx,
        size: 10
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        for (let i = 0; i < res.data.data.goodBeanList.length;i++){
          that.data.news.push(res.data.data.goodBeanList[i])
        }
        that.setData({
          newGoodsList: that.data.news
        })
      }
    })
  },
  pullUpLoad:function(){
    this.data.indenx++
    this.getMsg()
  }
})