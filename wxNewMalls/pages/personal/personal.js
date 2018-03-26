// pages/personal/personal.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    uimg:'',
    uNickName:'',
    vlogo:'',
    vName:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    icon:'../../img/icon/my_list_icon_address@3x.png',
    userID: '',
    infor:false
  },
  //事件处理函数
  onShow:function(){
    var that=this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
          infor: true
        });
        if (that.data.userID !='11111111111a'){
          wx.request({
            url: util.Apis + '/h5/h5MyInfo/getUserInfo',
            data: { userId: that.data.userID },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  // 默认值
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              var userPhone = res.data.data.user.userPhone;
              var userNickName = res.data.data.user.userNickName;
              if (userPhone == userNickName) {
                userNickName = userNickName.substr(0, 3) + '****' + userNickName.substr(7)
              }
              that.setData({
                uimg: res.data.data.user.userAvatar,
                uNickName: userNickName,
                vlogo: res.data.data.user.vipLogo,
                vName: res.data.data.user.vipName,
                qpA: res.data.data.user.waitPayOrderCount,
                qpB: res.data.data.user.waitSendOrderCount,
                qpC: res.data.data.user.waitReceiveOrderCount,
                qpD: res.data.data.user.waitCommentOrderCount
              })
            }
          })
          if (app.globalData.carIcon == 0) {
            wx.removeTabBarBadge({
              index: 2,
            });
          } else {
            wx.setTabBarBadge({
              index: 2,
              text: app.globalData.carIcon
            });
          }
          if (app.globalData.infomationIcon == 0) {
            wx.removeTabBarBadge({
              index: 3,
            });
          } else {
            wx.setTabBarBadge({
              index: 3,
              text: app.globalData.infomationIcon
            })
          }
        }else{
           wx.showToast({
            title: '请先绑定或注册',
            icon: 'success',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: "../register/register"
              })
            }
          })
        }
      },
    })
  },
  userCenter: function() {
    wx.navigateTo({
      url: "../userCenter/userCenter"
    })
  },
  //进入地址管理
  goAdress: function(){
    wx.setStorageSync('sty', false);
    wx.navigateTo({
      url: '../address/address'
    })
  }
})
