// pages/changePhone/changePhone.js
var util = require('../../utils/util.js');
var time = ''
Page({
  data: {
    uid:'',
    oldphone:'',
    verify:'',
    verifyphone:'',
    newphone:'',
    verification:'',
    btnvfShow: true,
    disabled:false,
    btnText:'获取验证码',
    durTime:60,
    countdowns:'',
    sunxu: false,
    verifyShow:true
  },
/* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
   
  },
/*生命周期函数--监听页面显示 */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        // success
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
            that.setData({
              oldphone: datas.userPhone.substr(0, 3) + '****' + datas.userPhone.substr(7),
              verify: datas.userPhone
            })
          }
        })
      }
    })
  },
  //手机号
  inputChange:function(e){
    this.setData({
      verifyphone: e.detail.value
    });
  },
  //更换手机号
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
          if(res.data.state=='error'){
            wx.showToast({
              title: res.data.errMsg,
              image: '../../img/icon/badTost.png',
              duration: 2000
            })
          }else{
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
    }else{
      wx.showToast({
        title: '手机号格式错误',
        image: '../../img/icon/badTost.png',
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
        image: '../../img/icon/my_comment_icon_medium_p@3x.png',
        duration: 1000,
        mask: true
      })
      return;
    };
    if (!verification) {
      wx.showToast({
        title: '验证码不能为空',
        image: '../../img/icon/my_comment_icon_medium_p@3x.png',
        duration: 1000,
        mask: true
      })
      return;
    };
    if (!sunxu) {
      wx.showToast({
        title: '请先获取验证码',
        image: '../../img/icon/my_comment_icon_medium_p@3x.png',
        duration: 1000,
        mask: true
      })
      return;
    }
    var that = this;
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
        if (res.data.data.state == 'error') {
          wx.showToast({
            title: res.data.data.errMsg,
            image: '../../img/icon/badTost.png',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.data.successMsg,
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../userCenter/userCenter'
          })
        }
      }
    })
  },
  //校验
  verify:function(){
    var oldp = this.data.verify;
    var newp = this.data.verifyphone;
    if (newp){
      if (oldp == newp) {
        this.setData({
          verifyShow:false
        })
      } else {
        wx.showToast({
          title: '手机号码不一致',
          image: '../../img/icon/badTost.png',
          duration: 1000,
          mask: true
        })
      }
    }else{
      wx.showToast({
        title: '请输入手机号',
        image: '../../img/icon/my_comment_icon_medium_p@3x.png',
        duration: 1000,
        mask: true
      })
    }
  }
})

