// pages/authentication/authentication.js
var util = require('../../utils/util.js');
var app = getApp()   
Page({
  data: {
    oldPhone:'',
    showPhone:'',
    newPhone:'',
    btnvfShow:false,
    cursor:''
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data
        });
        wx.request({
          url: util.Apis + '/h5/h5MyInfo/getUserInfo',
          method: 'POST',
          data: {
            userId: that.data.uid
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var datas = res.data.data.user;
            var uphone = datas.userPhone;
            that.setData({
              oldPhone: datas.userPhone,
              showPhone: datas.userPhone.substr(0, 3) + '****' + datas.userPhone.substr(7),
            })
          }
        })
      }
    })
  },
  //用户输入的手机号
  verification(e){
    console.log(e.detail.value)
    var newPhone = e.detail.value;
    this.setData({
      newPhone: newPhone,
      cursor: e.detail.cursor
    });
    if (e.detail.cursor == 11){
      this.setData({
        btnvfShow:true
      })
    }else{
      this.setData({
        btnvfShow: false
      })
    }
  },
  //next下一步
  nextBtn(){
    if (this.data.cursor == 11){
      if (this.data.newPhone == this.data.oldPhone){
        wx.navigateTo({
          url: '../changePhone/changePhone',
        })
      }else{
        wx.showToast({
          title: '号码校验失败',
          icon: 'loading',
          duration: 2000
        })
      }
    }else{
      wx.showToast({
        title: '请输入完整手机号',
        icon: 'loading',
        duration: 2000
      })
    }
  }
})