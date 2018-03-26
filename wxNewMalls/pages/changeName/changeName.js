// pages/changeName/changeName.js
var util = require('../../utils/util.js');
Page({
  data: {
    uid:'',
    uname:'',
    inpText:''
  },
  onLoad: function () {
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
            var uname = datas.userNickName;
            var uphone = datas.userPhone;
            if (uname == uphone) {
              uname = uname.substr(0, 3) + '****' + uname.substr(7)
            }
            that.setData({
              uname: uname,
            })
          }
        })
      }
    })
  },
  /*输入框内容*/
  inputChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      inpText: e.detail.value
    });
  },
  /*对话框确认按钮点击事件*/
  onConfirm: function () {
    var newnice = this.data.inpText;
    if (newnice) {
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5MyInfo/updateNcikName',
        method: 'POST',
        data: {
          userId: that.data.uid,
          nickName: newnice,
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  }
})