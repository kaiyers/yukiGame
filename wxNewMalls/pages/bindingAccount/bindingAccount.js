// pages/bindingAccount/bindingAccount.js
var util = require('../../utils/util.js');
Page({
  data: {
    account:'',
    password:''
  },
//yuki账号
  getAccount: function (e) {
    this.setData({
      account: e.detail.value
    });
  },
  //yuki密码
  getPassword: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  //绑定
  binding:function(){
    var account = this.data.account;
    var password = this.data.password;
    if (account){
      if (password){
      }else{
        wx.showToast({
          title: '密码不能为空',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      }
    }else{
      wx.showToast({
        title: '账号不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
  }
})