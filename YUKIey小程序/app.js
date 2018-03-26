//app.js
var util = require('utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('key') || []
    logs.unshift(Date.now())
    wx.setStorage({
      key: "logs",
      data: logs
    })
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: util.Apis +'/h5/h5login/xcxlogin', 
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            wx.setStorage({
              key: "openidLocal",
              data: res.data.data.openid
            })
            wx.setStorage({
              key: "userId",
              data:'11111111111a',
            })
            if (res.data.state =='success'){//已经绑定过账号
              wx.setStorage({
                key: "userId",
                data: res.data.user,
              })
            }else{
              wx.navigateTo({
                url: "../register/register"
              })
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
