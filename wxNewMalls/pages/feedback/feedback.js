// pages/feedback/feedback.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    uid:'',
    liuyan:'',
    zishu:0,
    lianxi:''
  },
  // 意见
  leaveMessage(e){
    this.setData({
      liuyan: e.detail.value,
      zishu: e.detail.cursor
    })
  },
  //联系方式
  inputChange(e) {
    this.setData({
      lianxi: e.detail.value
    })
  },
  //提交
  onConfirm(){
    var liuyan = this.data.liuyan,
      lianxi = this.data.lianxi;
    if (liuyan){
      wx.getStorage({
        key: 'userId',
        success: function (res) {
          wx.request({
            url: util.Apis + '/h5/feedback/add',
            method: 'POST',
            data: {
              userId: res.data,
              feedbackContent: liuyan,
              contactWay: lianxi
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
             if(res.code){
               wx.showToast({
                 title: '提交失败',
                 icon: 'loading',
                 duration: 2000
               })
             }else{
               wx.showToast({
                 title: '提交成功',
                 icon: 'success',
                 duration: 2000,
                 success: function () {
                   setTimeout(function(){
                     wx.navigateBack({
                       delta: 1
                     })
                   },2100)
                 }
               })
             }
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '请填写意见',
        icon: 'loading',
        duration: 2000
      })
    }
  }
})