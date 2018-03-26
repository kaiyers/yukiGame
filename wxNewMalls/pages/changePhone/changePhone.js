// pages/changePhone/changePhone.js
var util = require('../../utils/util.js');
var time = ''
Page({
  data: {
    uid:'',
    newphone:'',
    verification:'',
    btnvfShow: true,
    btnText:'获取验证码',
    durTime:60,
    countdowns:'',
    sunxu: false,
    verifyShow:true
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data
        });
      }
    })
  },
  //手机号
  newPhone: function (e) {
    var newphone = e.detail.value
    if (newphone.length == '11'){
      this.setData({
        btnvfShow:false,
        newphone: newphone
      });
    }else{
      this.setData({
        btnvfShow: true,
      });
    }
  },
  //倒计时模块
  sktime() {
    var that = this;
    var sdurTime = that.data.durTime
    that.data.durTime--;
    var s = sdurTime;
    that.setData({
      countdowns: that.toDou(s)
    })
    if (that.data.durTime <= 0) {
      that.setData({
        countdowns: '',
        disabled: false,
        btnText: '获取验证码'
      })
      clearInterval(time)
    }
  },
  toDou(n) {
    return n < 10 ? '0' + n : '' + n;
  },
  //获取验证码
  getverify:function(){
    var newphone = this.data.newphone;
    let pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,3,6,7,8])|(19[7]))\d{8}$/;
    if (newphone){
      if (pattern.test(newphone)) {
        var that = this;
        wx.request({
          url: util.Apis + '/h5/h5sendsms/sendSMSForRegister',
          method: 'POST',
          data: {
            phone: newphone
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data.state == 'error') {
              wx.showToast({
                title: "请输入新手机号",
                image: '../../img/icon/badTost.png',
                duration: 2000
              })
            } else {
              time = setInterval(that.sktime, 1000);
              that.setData({
                disabled: true,
                btnText: 's后重试',
                sunxu: true,
              })
              wx.showToast({
                title: res.data.successMsg,
                icon: 'success',
                duration: 2000
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      }
    }else{
      wx.showToast({
        title: '请输入完整手机号',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
  },
  //验证码
  verification: function (e) {
    this.setData({
      verification: e.detail.value
    });
  },
  //绑定手机号
  pinless: function(){
    var verification = this.data.verification; //验证码
    var newp = this.data.newphone; //手机号
    var sunxu = this.data.sunxu //顺序
    if (!newp) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    };
    if (!verification) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    };
    if (!sunxu) {
      wx.showToast({
        title: '请先获取验证码',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    }
    var that = this;
    console.log(newp, verification, that.data.uid)
    wx.request({
      url: util.Apis + '/h5/h5MyInfo/updatePhone',
      method: 'POST',
      data: {
        phone: newp,
        code: verification,
        userId: that.data.uid
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.state == 'error') {
          wx.showToast({
            title: res.data.data.errMsg,
            icon: 'loading',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.data.successMsg,
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta:2
          })
        }
      }
    })
  }
})

