// pages/classify/classify.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0,
    claName:'',
    showImg: "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/xcx/yuki.jpg",
    claImg:[
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/xcx/yuki.jpg",
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/yuki_go/web/3C.jpg",
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/yuki_go/web/life.jpg",
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/yuki_go/web/stationery.jpg",
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/yuki_go/web/clothing.jpg",
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/yuki_go/web/accessories.jpg",
      "http://yukicomic-pic.oss-cn-hangzhou.aliyuncs.com/yuki_go/web/model.jpg"
    ]
  },
  onLoad: function () {
    // 加载的使用进行网络访问，把需要的数据设置到data数据对象  
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5goodtype/goodTypeList',
      method: 'POST',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data.typeBeanList)
        that.setData({
          claName: res.data.data.typeBeanList[0].typeName,
          navLeftItems: res.data.data.typeBeanList,
          navRightItems: res.data.data.typeBeanList,
        })
      }
    })
  },
  onShow(){
    console.log('sfdksljnioxjuaquipcfha j',app.globalData.carIcon)
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
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值 
    var datas = this.data.navRightItems; 
    var imgList = this.data.claImg;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index); 
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index,
      claName: datas[index].typeName,
      showImg: imgList[index],
    })
  },
  //去优惠券
  tomycoupencc: function () {
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (res.data != '11111111111a') {
          wx.navigateTo({
            url: '../Coupon/Coupon?userId=' + res.data
          })
        } else {
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          });
        }
      }
    })
  },
})  