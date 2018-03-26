const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    winWidth: 0,
    winHeight: 0, 
    currentTab: 0,
    tipsShowaF:false,
    tipsShowaS: false, 
    tipsShowaT: false,
    userID: '',
    usefulCoupon: [],
    usedCoupon:[],
    validateCoupon:[],
    searchinput:"",
    clickIcnStateF: [],
    clickIcnStateT: [],
    clickIcnStateS: [],
    mess:''
  },
  onLoad: function (options) {
    var that = this;
    let arrF = [];
    let arrS = [];
    let arrT = [];
    that.setData({
      userID: options.userId
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    wx.request({
      url: util.Apis + '/h5/h5coupon/myCoupon',
      data: {
        userId: wx.getStorageSync('userId')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.data.usefulCoupon.length == 0){
          that.setData({
            tipsShowaF:true
          })
        }else{
          that.setData({
            tipsShowaF: false
          })
        }
        if (res.data.data.usedCoupon.length==0) {
          that.setData({
            tipsShowaS: true
          })
        } else {
          that.setData({
            tipsShowaS: false
          })
        }
        if (res.data.data.validateCoupon.length == 0) {
          that.setData({
            tipsShowaT: true
          })
        } else {
          that.setData({
            tipsShowaT: false
          })
        }
        for (let i = 0; i < res.data.data.usefulCoupon.length; i++) {
          arrF[i] = false;
        }
        for (let i = 0; i < res.data.data.usedCoupon.length; i++) {
          arrS[i] = false;
        }
        for (let i = 0; i < res.data.data.validateCoupon.length; i++) {
          arrT[i] = false;
        }
        that.setData({ 
          clickIcnStateF:arrF,
          clickIcnStateS: arrS,
          clickIcnStateT: arrT,
          usefulCoupon: res.data.data.usefulCoupon,
          usedCoupon: res.data.data.usedCoupon,
          validateCoupon: res.data.data.validateCoupon
        });
      }
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  clickIcnF: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    for (var i = 0; i < that.data.usefulCoupon.length; i++) {
      if (that.data.usefulCoupon[i].id === id) {
        that.data.clickIcnStateF[i] = !that.data.clickIcnStateF[i];
      }
    }
    that.setData({
      clickIcnStateF: that.data.clickIcnStateF
    })
  },
  clickIcnS: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    for (var i = 0; i < that.data.usedCoupon.length; i++) {
      if (that.data.usedCoupon[i].id === id) {
        that.data.clickIcnStateS[i] = !that.data.clickIcnStateS[i];
      }
    }
    that.setData({
      clickIcnStateS: that.data.clickIcnStateS
    })
  },
  clickIcnT: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    for (var i = 0; i < that.data.validateCoupon.length; i++) {
      if (that.data.validateCoupon[i].id === id) {
        that.data.clickIcnStateT[i] = !that.data.clickIcnStateT[i];
      }
    }
    that.setData({
      clickIcnStateT: that.data.clickIcnStateT
    })
  },
  qrCode:function(){
    wx.scanCode({
      success: (res) => {
        this.setData({
          searchinput: res.result
        });
      }
    })
  },
  //输入内容检测
  // textF: function (e) {
  //   if (e.detail.value.replace(/(^[a-zA-Z0-9]+$)/g, '')) {
  //     wx.showToast({
  //       title: '只支持英文数字',
  //       duration: 2000,
  //       image: '../../img/icon/badTost.png'
  //     });
  //     this.setData({
  //       searchinput: ""
  //     });
  //   }
  // },
  //聚焦检测
  // methfoc: function (e) {
  //   // e.detail.value=""
  //   this.setData({
  //     searchinput: ""
  //   });
  // },
  //失焦检测
  // methblur: function (e) {
  //   if (e.detail.value == '') {
  //     wx.showToast({
  //       title: '不能为空哦',
  //       duration: 2000,
  //       image: '../../img/icon/badTost.png'
  //     });
  //   }
  //   this.setData({
  //     searchinput: e.detail.value
  //   });
  // },
  text:function(e){
    // if (e.detail.value == '') {
    //   wx.showToast({
    //     title: '不能为空哦',
    //     duration: 2000,
    //     image: '../../img/icon/badTost.png'
    //   });
    // }
    this.setData({
      searchinput: e.detail.value
    });
  },
  //兑换优惠卷
  seachClick:function(){
    var that=this
    if (this.data.searchinput == '') {
      wx.showToast({
        title: '不能为空哦',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
    }else{
      wx.request({
        url: util.Apis + '/h5/h5coupon/couponExchange',
        data: {
          userId: that.data.userID,
          exchange: that.data.searchinput
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'  // 默认值
        },
        method: 'POST',
        success: function (res) {
          wx.showModal({
            content: res.data.data.msg,
            showCancel: false,
          });
          if (res.data.data.state == "success"){
            that.setData({
              tipsShowaF: false,
              searchinput:""
            });
            wx.request({
              url: util.Apis + '/h5/h5coupon/myCoupon',
              data: {
                userId: that.data.userID
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'  // 默认值
              },
              method: 'POST',
              success: function (res) {
                that.setData({
                  usefulCoupon: res.data.data.usefulCoupon
                });
              }
            })
          }
        }
      })
    }
  }
})  