// pages/collect/collect.js
var util = require('../../utils/util.js');
Page({
/* 页面的初始数据*/
  data: {
    uid:'',
    collectList:[],
    isShow:true
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        // success
        that.setData({
          uid: res.data
        });
        that.getData()
      }
    })
  },
  getData(){
    var that = this;
    wx.request({
      url: util.Apis + '/h5/h5collection/myCollection',
      method: 'POST',
      data: {
        userId: that.data.uid,
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var datas = res.data.data;
        datas.goodBeans.forEach((value, index) => {
          value.isShow = true
        })
        console.log(datas.goodBeans)
        that.setData({
          collectList: datas.goodBeans
        })
      }
    })
  },
  //去商品详情
  godetail: function (e) {
    const index = e.currentTarget.dataset.index;
    let collectList = this.data.collectList;
    if (collectList[index].sale) {
      wx.navigateTo({
        url: '../details/details?gsid=' + collectList[index].goodId
      })
    }else{
      wx.showModal({
        content: '亲，此商品已下架了...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },

  addLike(e){
    var that = this;
    var collectList = this.data.collectList,
      idx = e.currentTarget.dataset.index,
      goodId = collectList[idx].goodId;
    collectList.forEach((value,index)=>{
      if(index == idx){
        value.isShow = false;
      }
    })
    this.setData({
      collectList: collectList
    })
    wx.request({
      url: util.Apis + '/h5/h5collection/deleteCollection',
      method: 'POST',
      data: {
        userId: that.data.uid,
        goodId: goodId
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("已删除");
        that.getData()
      }
    })
  }
})