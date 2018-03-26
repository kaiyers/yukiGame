// pages/changePassword/changePassword.js
var util = require('../../utils/util.js');
var time = '';
Page({
  data: {
    uid:'',
    showPhone:'',
    phone:'',
    btnvfShow: true,
    btnText: '获取验证码',
    durTime: 60,
    countdowns: '',
    newPass:'',
    enterPass:'',
    sunxu:false,
    verification:''
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
              phone: datas.userPhone,
              showPhone: datas.userPhone.substr(0, 3) + '****' + datas.userPhone.substr(7),
            })
          }
        })
      }
    })
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
  getverify: function () {
    var newphone = this.data.phone;
    var that = this;
    wx.request({
      url: util.Apis + '/h5/h5sendsms/sendSMSForForgetPwd',
      method: 'POST',
      data: {
        phone: newphone
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.state == 'error') {
          wx.showToast({
            title: "请输入新手机号",
            image: '../../img/icon/badTost.png',
            duration: 2000
          })
        } else {
          time = setInterval(that.sktime, 1000);
          that.setData({
            btnvfShow: false,
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
  },
  //新密码
  newPass: function (e) {
    this.setData({
      newPass: e.detail.value
    });
  },
  //确认密码
  enterPass: function (e) {
    this.setData({
      enterPass: e.detail.value
    });
  },
  //验证码
  verification(e){
    this.setData({
      verification: e.detail.value
    });
  },
  //确认修改
  pinless(){
    var nPass = this.data.newPass,
      ePass = this.data.enterPass,
      newp = this.data.phone,
      verification = this.data.verification;
    if (!nPass) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    } else if (nPass.length<6){
      wx.showToast({
        title: '请输6-16位密码',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    };
    if (!ePass) {
      wx.showToast({
        title: '请确认密码',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    }
    if (nPass != ePass){
      wx.showToast({
        title: '密码不一致',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    }
    if (!this.data.sunxu) {
      wx.showToast({
        title: '请先获取验证码',
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
    //校验验证码
    wx.request({
      url: util.Apis + '/h5/h5sendsms/checkSMSLogForForgetPwd',
      method: 'POST',
      data: {
        phone: newp,
        code: verification
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.state == 'error') {
          wx.showToast({
            title: "验证码错误",
            icon: 'loading',
            duration: 2000
          })
        } else {
          wx.request({
            url: util.Apis + '/h5/h5password/forgetUserPassword',
            method: 'POST',
            data: {
              phone: newp,
              code: verification,
              password: ePass
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: "修改成功",
                icon: 'success',
                duration: 2000
              });
              setTimeout(function(){
                wx.navigateBack({
                  delta:1
                })
              },2500)
            }
          })
        }
      }
    })
  }
})