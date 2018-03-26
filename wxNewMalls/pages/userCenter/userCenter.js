// pages/userCenter/userCenter.js
var util = require('../../utils/util.js');
var app = getApp()    
Page({
/*页面的初始数据*/
  data: {
    uid:'',
    uimg:'',
    uname: '',
    usex: '',
    uage: '',
    uphone: '',
    time:'',
  },
  onShow: function (options) {
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
            var uname = datas.userNickName;
            var uphone = datas.userPhone;
            if (uname == uphone){
              uname = uname.substr(0, 3) + '****' + uname.substr(7)
            }
            that.setData({
              uimg: datas.userAvatar,
              uname: uname,
              usex: datas.userSex,
              uage: datas.age,
              uphone: datas.userPhone.substr(0, 3) + '****' + datas.userPhone.substr(7),
            })
          }
        })
      },
      fail:function(){
      }
    })
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
    });
  },
//改变性别
  actioncnt: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        var usex = res.tapIndex?'女':'男'
        wx.request({
          url: util.Apis + '/h5/h5MyInfo/updateSex',
          method: 'POST',
          data: {
            userId: that.data.uid,
            sex: usex
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              usex: usex
            })
          }
        })
      }
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    var bothday = e.detail.value.split('-').join('')
    var nowday = this.data.time.split('/').join('').split(' ')
    nowday = nowday[0]
    var age = nowday.substring(0, 4) - bothday.substring(0, 4) + 1
    if (nowday - bothday < 0) {
      wx.showToast({
        title: '所选日期不合法',
        image: '../../img/icon/my_comment_icon_bad_p@3x.png',
        duration: 1000,
        mask: true
      })
    } else {
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5MyInfo/updateAge',
        method: 'POST',
        data: {
          userId: that.data.uid,
          birth: e.detail.value,
          age: age
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            uage: age
          })
        }
      })
    }
  },  
  //修改头像
  setPhotoInfo: function(){
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original','compressed'],
      sourceType:['album','camera'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: util.Apis + '/h5/h5MyInfo/updateUserAvatar', //仅为示例，非真实的接口地址
          name: 'img',
          filePath: tempFilePath,
          formData: {
            'userId': that.data.uid,
          },
          success: function (res) {
            var data = res.data
            that.setData({
              uimg: tempFilePath
            })
          }
        })
      }
    })
  }
})