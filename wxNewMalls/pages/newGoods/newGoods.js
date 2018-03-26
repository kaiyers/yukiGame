var util = require('../../utils/util.js');
const app = getApp()
Page({
  data:{
    newGoodsList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    circular: true,
    imgUrls:[],
    userID:'',
  },
  onShow:function(){
    var that=this
    var idx = parseInt(app.globalData.backidx)-1
    if (this.data.newGoodsList.length){
      this.data.newGoodsList[idx].isCollected = app.globalData.backisCollected
      this.setData({
        newGoodsList: this.data.newGoodsList
      })
    }else{
      wx.getStorage({
        key: 'userId',
        success: function (res) {
          if (res.data) {
            that.setData({
              userID: res.data,
            })
          }
          wx.request({
            url: util.Apis + '/h5/h5index/indexPage',
            // url: 'http://ttioowh.nat300.top/h5/h5index/indexPage',
            data: {
              userId: that.data.userID
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
              that.setData({
                imgUrls: res.data.data.banners,
              })
            }
          })
          wx.request({
            url: util.Apis + '/h5/h5good/findNewGoodList',
            data: {
              userId: that.data.userID
            },
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
    }
    
  },
  //收藏
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
  }
})