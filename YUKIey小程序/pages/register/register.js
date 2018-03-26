// pages/register/register.js
var util = require('../../utils/util.js');
var time=''
Page({
  /*页面的初始数据*/
  data: {
    phoneNum:'',//手机号
    authCode:'',//验证码
    password:'',//密码
    passwordagain: '',//再次密码
    btnText: '点击获取验证码',
    durTime: 60,
    phone:-1,
    interTime:'',
    mesTime:true
  },
  //判断有没有注册过
  ifLogin:function(){
    var that=this
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(that.data.phoneNum))) {
      wx.showToast({
        title: '手机号不正确',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      that.setData({
        phoneNum:''
      })
      return false
    }else{
      if (that.data.mesTime) {
        wx.request({
          url: util.Apis + '/h5/h5sendsms/sendSMSForwxPhone',
          data: { phone: that.data.phoneNum },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            if (res.data.state=="error"){
              wx.showModal({
                content: res.data.errMsg,
                showCancel: false
              });
            }else{
              if (res.data.phonestate == 1) {
                that.setData({
                  phone: 1
                })
              } else if (res.data.phonestate == 0) {
                that.setData({
                  phone: 0
                })
              }
            }
          }
        })
      } else {
        return false
      }
      that.sktime()
      that.data.interTime = setInterval(function () {
        that.sktime()
       }, 1000)
    }
  },
  //绑定手机号
  bounding:function(){
    var that=this
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(that.data.phoneNum))) {
      wx.showToast({
        title: '手机号不正确',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      return false
    }
    if (!that.data.authCode){
      wx.showToast({
        title: '验证码不能为空',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      return false
    }
    var openids = wx.getStorageSync('openidLocal')
    wx.request({
      url: util.Apis + '/h5/h5register/bindingxcxUser',
      data: { 
        phone: that.data.phoneNum,
        code: that.data.authCode,
        openid: openids
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.state =="success"){
          wx.setStorage({
            key: "userId",
            data: res.data.user,
            success: function () {
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
          // wx.showToast({
          //   title: '绑定成功',
          //   duration: 2000,
          //   image: '../../img/icon/badTost.png',
          //   success:function(){
          //     wx.switchTab({ url: '../index/index'})
          //   }
          // })
        }else{
          wx.showToast({
            title: '绑定失败',
            duration: 2000,
            image: '../../img/icon/badTost.png'
          });
        }
      }
    })
  },
  //注册
  userregister: function () {
    var that = this
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(that.data.phoneNum))) {
      wx.showToast({
        title: '请输入正确的手机号',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      that.setData({
        phoneNum: ''
      })
      return false
    }
    if (!that.data.authCode) {
      wx.showToast({
        title: '验证码不能为空',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      return false
    }
    if (!that.data.password) {
      wx.showToast({
        title: '密码不能为空',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      return false
    }
    if (!that.data.passwordagain) {
      wx.showToast({
        title: '密码不能为空',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      return false
    }
    if (that.data.passwordagain != that.data.password) {
      wx.showToast({
        title: '两次密码不一致',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
      that.setData({
        passwordagain: '',
        password: ''
      })
      return false
    }
    wx.request({
      url: util.Apis + '/h5/h5register/registerxcxUser',
      data: { 
        phone: that.data.phoneNum,
        code: that.data.authCode,
        pwd: that.data.password,
        openid: wx.getStorageSync('openidLocal')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.data.state == "error") {
          wx.showModal({
            content: res.data.data.errMsg,
            showCancel: false,
          });
        }else{
          wx.setStorage({
            key: "userId",
            data: res.data.data.user,
            success: function (){
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        }
      }
    })
  },
  //倒计时模块
  sktime() {
    var that = this;
    that.setData({
      mesTime:false
    })
    that.data.durTime--;
    that.setData({
      durTime: that.data.durTime
    })
    if (that.data.durTime <= 0) {
      that.setData({
        mesTime: true,
        btnText: '重新获取验证码',
        durTime:60
      })
      clearInterval(that.data.interTime)
    }
  },
  //手机号设置
  methblurpl: function (e) {
    this.setData({
      phoneNum: e.detail.value,
    });
  },
  //验证码设置
  methblura: function (e) {
    this.setData({
      authCode: e.detail.value
    });
  },
  //获取密码设置
  methblurp: function(e){
    this.setData({
      password: e.detail.value,
    });
  },
  //再次获取密码设置
  methblurap: function (e) {
    this.setData({
      passwordagain: e.detail.value,
    });
  }
})