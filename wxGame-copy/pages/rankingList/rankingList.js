// pages/rankingList/rankingList.js
var util = require('../../utils/util.js');
Page({
  data: {
    vlogo:'',
    playerName:'',
    jinbiNum:'',
    list:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'accountCoins_quantity',
      success: function (res) {
        that.setData({
          jinbiNum: res.data.accountCoins_quantity
        })
      }
    })
    wx.getStorage({
      key: 'Mes',
      success: function (res) {
        that.setData({
          vlogo: res.data.avatarUrl,
          playerName: res.data.nickName,
          jinbiNum: res.data.coin
        })
        var myopenid = res.data.openid;
        wx.request({
          url: util.Apis + '/h5/game/userLogin/rank', //仅为示例，并非真实的接口地址
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var datas = res.data.data
            datas.forEach((value, index) => {
              console.log(value.openid, myopenid)
              if (value.openid == myopenid){
                value.isMe = true
              }
            })
            console.log(datas)
            that.setData({
              list: datas
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})