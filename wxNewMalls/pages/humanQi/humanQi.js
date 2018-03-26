var util = require('../../utils/util.js');
const app = getApp()
Page({
  data:{
    newGoodsList:[],
    news:[],
    indenx:0,
    winWidth:'',
    winHeight:'',
    openId:'',
    userID:'',
    maxIndex:1
  },
  onLoad:function(){
    var that =this
    app.globalData.userInfo=(parseInt(app.globalData.userInfo)+1).toString()
    console.log(typeof(app.globalData.userInfo))
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
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log('res.data', res.data)
        if (res.data) {
          that.setData({
            userId: res.data,
          })
        }
        var idx = parseInt(app.globalData.backidx) - 1
        if (that.data.newGoodsList.length) {
          that.data.newGoodsList[idx].isCollected = app.globalData.backisCollected
          that.setData({
            newGoodsList: that.data.newGoodsList
          })
        } else {
          that.getMsg()
        }
      }
    })
  },
  addLike(e) {
    var that = this
    var goodId = e.currentTarget.dataset.goodid
    var isCollected = e.currentTarget.dataset.iscollected
    var idx = e.currentTarget.dataset.idx
    var name = e.currentTarget.dataset.name
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
          infor: true
        });
        if (that.data.userID != '11111111111a') {
          if (isCollected == '0') {
            that.data.newGoodsList[idx].isCollected = 1
            that.setData({
              newGoodsList: that.data.newGoodsList
            })
            wx.request({
              url: util.Apis + '/h5/h5collection/addCollection',
              method: 'POST',
              data: {
                goodId: goodId,
                userId: that.data.userID,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              },
            })
          } else {
            that.data.newGoodsList[idx].isCollected = 0
            that.setData({
              newGoodsList: that.data.newGoodsList
            })
            wx.request({
              url: util.Apis + '/h5/h5collection/deleteCollection',
              method: 'POST',
              data: {
                goodId: goodId,
                userId: that.data.userID,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              }
            })
          }
        } else {
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          })
        }
      }
    })
  },
  getMsg:function(){
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5good/goodList',
      data: {
        oneLevelTypeId: 0,
        twoLevelTypeId: 0,
        index: that.data.indenx,
        size: 10,
        userId: that.data.userId
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
          maxIndex: res.data.data.maxIndex,
          newGoodsList: that.data.news
        })
      }
    })
  },
  pullUpLoad:function(){
    if (this.data.newGoodsList.length) {
      var that = this
      this.data.indenx++
      if (this.data.indenx >= this.data.maxIndex) {
        wx.showToast({
          title: '没有更多数据啦',
          duration: 2000,
          image: '../../img/icon/badTost.png'
        });
        that.setData({
          moreBoolean: false
        })
        return false
      } else {
        that.setData({
          indexs: that.data.indexs
        })
        that.getMsg()
      }
    }else{
      return false
    }
  }
})